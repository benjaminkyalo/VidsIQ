"""Isolated, authenticated conversion service. Never import into the website."""
import asyncio
import hmac
import json
import os
import re
import secrets
import shutil
import signal
import subprocess
import threading
import time
from concurrent.futures import ThreadPoolExecutor
from contextlib import asynccontextmanager
from dataclasses import dataclass
from pathlib import Path

from fastapi import FastAPI, Header, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel, ConfigDict, Field


@dataclass
class Settings:
    api_key: str
    storage: Path = Path('/data')
    workers: int = 2
    queue_size: int = 16
    ttl: int = 3600
    timeout: int = 240
    max_duration: int = 3600
    max_bytes: int = 268435456
    disk_budget: int = 2147483648


class ConversionRequest(BaseModel):
    model_config = ConfigDict(extra='forbid')
    video_id: str = Field(pattern=r'^[A-Za-z0-9_-]{11}$')
    mode: str = Field(pattern=r'^(audio|video)$')
    quality: str = Field(default='720', pattern=r'^(360|480|720|1080)$')
    bitrate: str = Field(default='192', pattern=r'^(128|192|320)$')

    def cache_key(self):
        return (self.video_id, self.mode, self.bitrate if self.mode == 'audio' else self.quality)


def command(data: ConversionRequest, folder: Path, settings: Settings):
    args = ['yt-dlp', '--ignore-config', '--no-playlist', '--no-progress', '--no-warnings',
            '--js-runtimes', 'deno']
    args += ['--socket-timeout', '15', '--retries', '2', '--fragment-retries', '2',
             '--concurrent-fragments', '4', '--max-filesize', str(settings.max_bytes),
             '--match-filter', f'duration <= {settings.max_duration} & !is_live & !is_upcoming & !has_drm',
             '--output', str(folder / 'media.%(ext)s'), '--print', 'after_move:filepath',
             '--postprocessor-args', 'ffmpeg:-threads 2']
    if data.mode == 'audio':
        args += ['--format', 'bestaudio/best', '--extract-audio', '--audio-format', 'mp3',
                 '--audio-quality', data.bitrate + 'K']
    else:
        height = data.quality
        args += ['--format', f'bestvideo[ext=mp4][vcodec^=avc1][height<={height}]+bestaudio[ext=m4a]/best[ext=mp4][vcodec^=avc1][acodec^=mp4a][height<={height}]',
                 '--merge-output-format', 'mp4', '--postprocessor-args', 'ffmpeg:-threads 2 -movflags +faststart']
    args.append(f'https://www.youtube.com/watch?v={data.video_id}')
    return args


def validate_file(path: Path, data: ConversionRequest, settings: Settings):
    if not path.is_file() or not 1024 < path.stat().st_size <= settings.max_bytes:
        raise ValueError('Empty or oversized media')
    probe = subprocess.run(['ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', str(path)],
                           capture_output=True, timeout=15, check=True)
    info = json.loads(probe.stdout)
    duration = float(info.get('format', {}).get('duration', 0))
    if not 0 < duration <= settings.max_duration + 1:
        raise ValueError('Duration outside limit')
    streams = info.get('streams', [])
    audio = [s for s in streams if s.get('codec_type') == 'audio']
    if not audio or audio[0].get('codec_name') != ('mp3' if data.mode == 'audio' else 'aac'):
        raise ValueError('Wrong audio format')
    if data.mode == 'video':
        video = [s for s in streams if s.get('codec_type') == 'video']
        if not video or video[0].get('codec_name') != 'h264' or video[0].get('height', 0) > int(data.quality):
            raise ValueError('Wrong video format')
    return path.stat().st_size


def convert(data: ConversionRequest, folder: Path, settings: Settings):
    with (folder / 'worker.log').open('wb') as log:
        process = subprocess.Popen(command(data, folder, settings), stdout=log, stderr=log, start_new_session=True)
        start = time.monotonic()
        try:
            while process.poll() is None:
                if time.monotonic() - start > settings.timeout:
                    raise TimeoutError('Conversion deadline')
                if sum(p.stat().st_size for p in folder.rglob('*') if p.is_file()) > settings.max_bytes * 3:
                    raise ValueError('Temporary files exceeded budget')
                time.sleep(0.25)
            if process.returncode != 0:
                raise ValueError('Upstream unavailable')
        finally:
            if process.poll() is None:
                os.killpg(process.pid, signal.SIGTERM)
                try:
                    process.wait(timeout=3)
                except subprocess.TimeoutExpired:
                    os.killpg(process.pid, signal.SIGKILL)
                    process.wait()
    path = folder / ('media.mp3' if data.mode == 'audio' else 'media.mp4')
    size = validate_file(path, data, settings)
    for item in folder.iterdir():
        if item != path:
            item.unlink(missing_ok=True)
    return path, size


class Manager:
    def __init__(self, settings, runner=convert):
        if not settings.api_key or len(settings.api_key) < 32:
            raise ValueError('Set a strong CONVERTER_API_KEY')
        if settings.workers < 1 or settings.queue_size < 0 or settings.disk_budget < settings.max_bytes * settings.workers * 3:
            raise ValueError('Invalid worker or disk limits')
        self.settings, self.runner = settings, runner
        self.lock = threading.RLock()
        self.jobs, self.keys = {}, {}
        self.pool = ThreadPoolExecutor(max_workers=settings.workers)
        settings.storage.mkdir(parents=True, exist_ok=True)
        # Job tickets do not survive restarts; remove orphaned job files.
        for folder in settings.storage.iterdir():
            if folder.is_dir() and re.fullmatch(r'[a-f0-9]{32}', folder.name):
                shutil.rmtree(folder)

    def clean(self):
        now = time.time()
        for jid, job in list(self.jobs.items()):
            if job['state'] in ('ready', 'error') and now > job['expires']:
                shutil.rmtree(self.settings.storage / jid, ignore_errors=True)
                self.keys.pop(job['key'], None)
                del self.jobs[jid]

    def create(self, data):
        with self.lock:
            self.clean()
            key = data.cache_key()
            existing = self.keys.get(key)
            if existing and self.jobs[existing]['state'] != 'error':
                return self.public(self.jobs[existing])
            active = sum(j['state'] in ('queued', 'processing') for j in self.jobs.values())
            cached_bytes = sum(j.get('size', 0) for j in self.jobs.values())
            reservation = (active + 1) * self.settings.max_bytes * 3
            if active >= self.settings.workers + self.settings.queue_size or cached_bytes + reservation > self.settings.disk_budget or shutil.disk_usage(self.settings.storage).free < reservation:
                raise HTTPException(429, 'The conversion queue is full. Please try again shortly.', headers={'Retry-After': '10'})
            if existing:
                old = self.jobs.pop(existing)
                shutil.rmtree(self.settings.storage / old['id'], ignore_errors=True)
            jid, token = secrets.token_hex(16), secrets.token_hex(32)
            job = dict(id=jid, ticket=f'{jid}.{token}', key=key, state='queued', created=time.time(), expires=time.time() + self.settings.ttl)
            self.jobs[jid], self.keys[key] = job, jid
            self.pool.submit(self.work, jid, data)
            return self.public(job)

    def work(self, jid, data):
        with self.lock:
            job = self.jobs[jid]
            job['state'] = 'processing'
        folder = self.settings.storage / jid
        folder.mkdir()
        try:
            if time.time() - job['created'] > self.settings.timeout:
                raise TimeoutError('Queue wait deadline')
            path, size = self.runner(data, folder, self.settings)
            with self.lock:
                job.update(state='ready', path=path, size=size, filename=f'VidsIQ-{data.video_id}.{data.mode == "audio" and "mp3" or "mp4"}', content_type='audio/mpeg' if data.mode == 'audio' else 'video/mp4')
        except Exception:
            # Never send upstream logs, URLs, credentials or restriction workarounds to clients.
            shutil.rmtree(folder, ignore_errors=True)
            with self.lock:
                job.update(state='error', error='This video could not be converted. It may be restricted, unavailable, too long, or exceed the file limit.')
        finally:
            with self.lock:
                job['expires'] = time.time() + (self.settings.ttl if job['state'] == 'ready' else 30)

    def public(self, job):
        return {k: v for k, v in job.items() if k in ('ticket', 'state', 'filename', 'size', 'error', 'expires')}

    def get(self, ticket):
        with self.lock:
            self.clean()
            if not re.fullmatch(r'[a-f0-9]{32}\.[a-f0-9]{64}', ticket):
                raise HTTPException(404, 'Conversion unavailable or expired.')
            job = self.jobs.get(ticket.split('.')[0])
            if not job or not hmac.compare_digest(ticket, job['ticket']):
                raise HTTPException(404, 'Conversion unavailable or expired.')
            return job.copy()


def create_app(settings, runner=convert):
    manager = Manager(settings, runner)

    @asynccontextmanager
    async def lifespan(app):
        async def cleanup():
            while True:
                await asyncio.sleep(60)
                with manager.lock:
                    manager.clean()
        task = asyncio.create_task(cleanup())
        yield
        task.cancel()
        manager.pool.shutdown(wait=True)

    app = FastAPI(lifespan=lifespan, docs_url=None, redoc_url=None, openapi_url=None)
    app.state.manager = manager

    def authorize(authorization):
        if not authorization or not hmac.compare_digest(authorization, 'Bearer ' + settings.api_key):
            raise HTTPException(401, 'Unauthorized')

    @app.get('/health')
    def health(authorization: str | None = Header(default=None)):
        authorize(authorization)
        return {'status': 'ok'}

    @app.post('/v1/jobs')
    def create(data: ConversionRequest, authorization: str | None = Header(default=None)):
        authorize(authorization)
        return manager.create(data)

    @app.get('/v1/jobs/{ticket}')
    def status(ticket: str, authorization: str | None = Header(default=None)):
        authorize(authorization)
        return manager.public(manager.get(ticket))

    @app.get('/v1/files/{ticket}')
    def file(ticket: str, authorization: str | None = Header(default=None)):
        authorize(authorization)
        job = manager.get(ticket)
        if job['state'] != 'ready':
            raise HTTPException(409, 'File is not ready.')
        return FileResponse(job['path'], media_type=job['content_type'], filename=job['filename'], headers={'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff'})

    return app


def from_env():
    return create_app(Settings(api_key=os.environ.get('CONVERTER_API_KEY', ''),
        storage=Path(os.environ.get('CONVERTER_STORAGE', '/data')),
        workers=int(os.environ.get('CONVERTER_WORKERS', '2')),
        queue_size=int(os.environ.get('CONVERTER_QUEUE_SIZE', '16')),
        ttl=int(os.environ.get('CONVERTER_CACHE_TTL', '3600')),
        timeout=int(os.environ.get('CONVERTER_TIMEOUT', '240')),
        max_duration=int(os.environ.get('CONVERTER_MAX_DURATION', '3600')),
        max_bytes=int(os.environ.get('CONVERTER_MAX_BYTES', '268435456')),
        disk_budget=int(os.environ.get('CONVERTER_DISK_BUDGET', '2147483648'))))