import secrets
import subprocess
import tempfile
import threading
import time
import unittest
from pathlib import Path
from fastapi.testclient import TestClient
from pydantic import ValidationError
from server import Settings, ConversionRequest, command, create_app, validate_file


class ConverterTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.settings = Settings(api_key=secrets.token_hex(32), storage=Path(self.tmp.name), workers=1, queue_size=0)
        self.headers = {'Authorization': 'Bearer ' + self.settings.api_key}

    def tearDown(self):
        self.tmp.cleanup()

    def test_validation(self):
        for value in ['http://127.0.0.1/x', '../escape', 'x; rm -rf /']:
            with self.assertRaises(ValidationError):
                ConversionRequest(video_id=value, mode='audio')
        for bitrate in ['128', '192', '320']:
            data = ConversionRequest(video_id='jNQXAC9IVRw', mode='audio', bitrate=bitrate)
            args = command(data, Path('/tmp/example'), self.settings)
            self.assertIn(bitrate + 'K', args)
            self.assertEqual(args[-1], 'https://www.youtube.com/watch?v=jNQXAC9IVRw')
            self.assertNotIn('--no-check-certificates', args)

    def test_queue_and_coalescing(self):
        event = threading.Event()
        def runner(data, folder, settings):
            event.wait(2)
            path = folder / 'media.mp3'
            subprocess.run(['ffmpeg','-v','error','-f','lavfi','-i','sine=frequency=440:duration=1','-c:a','libmp3lame','-b:a','192k','-y',str(path)],check=True)
            return path, validate_file(path, data, settings)
        app = create_app(self.settings, runner)
        with TestClient(app) as client:
            self.assertEqual(client.post('/v1/jobs', json={'video_id':'jNQXAC9IVRw','mode':'audio'}).status_code, 401)
            data = {'video_id':'jNQXAC9IVRw','mode':'audio','bitrate':'192'}
            first = client.post('/v1/jobs', json=data, headers=self.headers).json()
            repeated = client.post('/v1/jobs', json=data, headers=self.headers).json()
            self.assertEqual(first['ticket'], repeated['ticket'])
            self.assertEqual(client.post('/v1/jobs', json={**data,'bitrate':'320'}, headers=self.headers).status_code, 429)
            event.set()
            for _ in range(100):
                result = client.get('/v1/jobs/' + first['ticket'], headers=self.headers).json()
                if result['state'] == 'ready':
                    break
                time.sleep(.01)
            self.assertEqual(result['state'], 'ready')
            response = client.get('/v1/files/' + first['ticket'], headers=self.headers)
            self.assertEqual(len(response.content), result['size'])
            self.assertGreater(result['size'], 1024)
            self.assertEqual(response.headers['content-type'], 'audio/mpeg')
            wrong = first['ticket'].split('.')[0] + '.' + '0' * 64
            self.assertEqual(client.get('/v1/files/' + wrong, headers=self.headers).status_code, 404)
            manager = app.state.manager
            manager.jobs[first['ticket'].split('.')[0]]['expires'] = 0
            self.assertEqual(client.get('/v1/files/' + first['ticket'], headers=self.headers).status_code, 404)
            self.assertEqual(list(self.settings.storage.iterdir()), [])

    def test_failure_cleanup_and_no_log_exposure(self):
        def runner(data, folder, settings):
            (folder / 'unfinished.part').write_bytes(b'partial')
            raise ValueError('Private upstream detail must not escape')
        app = create_app(self.settings, runner)
        with TestClient(app) as client:
            created = client.post('/v1/jobs',json={'video_id':'jNQXAC9IVRw','mode':'video'},headers=self.headers).json()
            for _ in range(100):
                response = client.get('/v1/jobs/'+created['ticket'],headers=self.headers)
                if response.json()['state'] == 'error':
                    break
                time.sleep(.01)
            self.assertEqual(response.json()['state'], 'error')
            self.assertNotIn('Private upstream', response.text)
            self.assertEqual(list(self.settings.storage.iterdir()), [])
            self.assertEqual(client.get('/v1/files/'+created['ticket'],headers=self.headers).status_code, 409)

    def test_real_ffmpeg_outputs(self):
        for mode in ['audio', 'video']:
            path = self.settings.storage / ('media.mp3' if mode == 'audio' else 'media.mp4')
            args = ['ffmpeg', '-v', 'error', '-f', 'lavfi', '-i', 'sine=frequency=440:duration=1']
            if mode == 'video':
                args += ['-f', 'lavfi', '-i', 'testsrc=size=320x180:rate=24:duration=1', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-shortest']
            else:
                args += ['-c:a', 'libmp3lame', '-b:a', '192k']
            subprocess.run(args + ['-y', str(path)], check=True)
            data = ConversionRequest(video_id='jNQXAC9IVRw', mode=mode, quality='360')
            self.assertGreater(validate_file(path, data, self.settings), 1024)
        (self.settings.storage / 'empty.mp3').write_bytes(b'')
        with self.assertRaises(ValueError):
            validate_file(self.settings.storage / 'empty.mp3', data, self.settings)


if __name__ == '__main__':
    unittest.main()