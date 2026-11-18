# Dedicated VidsIQ conversion service

This independent Linux service uses yt-dlp and FFmpeg on your existing paid
VPS. Visitors are not charged; CPU, storage and outbound bandwidth are your
hosting costs. When configured, the website never silently uses free converters.

## Install on the existing VPS

Install Docker Engine and the Compose plugin using Docker's official instructions
for your operating system. Keep the website's existing PM2/nginx setup.
Allow **2 spare CPU cores, 2 GB spare RAM and 5 GB free disk** in addition to
the website's resources. These starting allocations are not a capacity guarantee.

From your updated repository checkout:

```bash
cd /var/www/vidsiq/services/converter
umask 077
python3 - <<'PY'
from pathlib import Path
import secrets
p = Path('/etc/vidsiq-converter.env')
if p.exists():
    raise SystemExit('Existing settings preserved; edit them instead.')
p.write_text('CONVERTER_API_KEY=' + secrets.token_hex(32) + '\n')
p.chmod(0o600)
PY
docker compose up -d --build
```

Run the configuration creation with appropriate permission to write `/etc`.
The key is generated into a private file, never printed or committed. Using
your server editor, copy the same `CONVERTER_API_KEY` value into the website's
private environment file and add:

```dotenv
CONVERSION_SERVICE_URL=http://127.0.0.1:8090
PORT=3000
```

Use the exact same key in both files. Never paste it into chat, source control
or a `VITE_` variable. Store private environment files outside your checkout
(for example `/etc/vidsiq.env`) and keep mode 600. The platform manages the
repository ignore rules; do not rely on a private file being ignored.

Rebuild the website using `DEPLOY.md`, then restart PM2. Its Node entry does
not automatically load `.env.production`; preserve your working environment
loader, or launch Node explicitly with your private file:

```bash
cd /var/www/vidsiq
# Only after a successful build; restarting briefly interrupts the website.
pm2 delete vidsiq
pm2 start node --name vidsiq -- --env-file=/etc/vidsiq.env /var/www/vidsiq/.output/server/index.mjs
pm2 save
```

The service listens on loopback only. **Do not open port 8090 publicly.**
The hosted preview cannot reach a loopback service on your VPS; test on the
VPS website. A future separate host needs HTTPS, firewall rules and the same
server-only credential, not an unauthenticated public converter.

## Verify without printing credentials

```bash
cd /var/www/vidsiq/services/converter
docker compose exec -T converter python - <<'PY'
import os, urllib.request
req = urllib.request.Request('http://127.0.0.1:8090/health', headers={'Authorization': 'Bearer ' + os.environ['CONVERTER_API_KEY']})
with urllib.request.urlopen(req) as r:
    print('Conversion health:', r.status)
PY
```

Use a short video **you own or have permission to download** on each live MP3,
MP4 and Shorts page. Confirm each saved file plays and MP4 contains sound.
Repeat the same video/quality to measure cached delivery. Monitor container
CPU, memory, disk and host bandwidth while testing simultaneous requests.
YouTube may reject VPS traffic: paid compute does not remove its restrictions
or guarantee extraction. No cookies, proxy evasion, private-video or DRM bypass
is included. Do not claim live speed until these checks pass on your server.

## Processing and limits

- Two active workers and sixteen waiting jobs by default. Duplicate requests
  for the same video/format/quality share work, including ready files.
- MP3 encodes at the selected bitrate. MP4 selects H.264 and AAC up to the
  requested height and merges without expensive video re-encoding. Source
  quality limits output; a higher bitrate cannot restore lost audio detail.
- FFprobe checks streams, codecs, duration and size before files become ready.
  The website also rejects incomplete transfers by byte count.
- Defaults: one-hour video limit, 256 MiB completed file limit, four-minute
  worker deadline, one-hour ready-file retention, and 2 GiB storage budget.
  Temporary-file reservations prevent unbounded queue/disk growth. Full queues
  return an explicit error instead of invented conversion progress.
- Browser waits up to five minutes, showing queued/converting/downloading states.
  Status checks are short requests; conversion never runs inside site handlers.
- File delivery requires an authenticated configured origin and expiring ticket.
  Visitors never receive the service key or an arbitrary upstream URL.
- Expired files are cleaned every minute. Temporary files and video IDs exist
  on disk during processing/cache retention; no visitor download history is stored.
- Jobs are memory-local and reset on container restart. Run **one Uvicorn
  process**, using its internal worker pool. Multi-server scaling needs a durable
  shared queue and object storage; do not load balance independent job maps.

Settings in `/etc/vidsiq-converter.env`: `CONVERTER_WORKERS`,
`CONVERTER_QUEUE_SIZE`, `CONVERTER_CACHE_TTL`, `CONVERTER_TIMEOUT`,
`CONVERTER_MAX_DURATION`, `CONVERTER_MAX_BYTES`, `CONVERTER_DISK_BUDGET`.
Disk budget must exceed three times the file limit times active workers.
Increasing workers needs more CPU/RAM/bandwidth and updated Compose limits.
Do not raise file size blindly: browsers currently buffer files in memory.

## Protect hosting costs

The conversion API is private, but the website downloader is public. Before
opening to traffic, configure nginx/CDN rate limits, bot protection and billing
alerts with your host. Queue and disk limits protect resources, not your monthly
bandwidth bill. A small VPS is not a millions-of-users deployment.

For file streaming, add this before the existing nginx `location /` block:

```nginx
location = /api/media {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 300s;
    proxy_buffering off;
    add_header Cache-Control "no-store";
}
```

Rate-limit conversion **creation**, not one-second status checks; identify the
creation server-function request in your live network/WAF logs. Configure trusted
client IP handling behind a CDN. No automatic infrastructure changes are made here.

## Maintenance and rollback

Access logs are disabled to avoid logging tickets. Inspect service failures with
`docker compose logs --tail=50`, but do not share private files or worker logs.
Update the pinned yt-dlp dependency to a tested release when extraction changes.

```bash
docker compose up -d --build
```

To deliberately restore legacy community services, remove **both** website
conversion settings and restart it. A configured dedicated service never silently
falls back. Run local service checks with requirements plus `httpx2` installed:
`python -m unittest discover -s services/converter -p 'test_*.py'`.