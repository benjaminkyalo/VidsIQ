# Deploying VidsIQ to your own server (VPS)

This builds the site as a plain Node server and runs it behind nginx.
Nothing here depends on Lovable's hosting once the build is done.

---

## 0. What you need on the server

- Ubuntu/Debian with root or sudo access
- Node.js 22 or newer
- Bun (the package manager this project uses)
- nginx (you already have it)
- Your domain's DNS pointing at this server's IP

Install the missing pieces:

```bash
# Node 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs nginx git

# Bun
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc
```

Check them:

```bash
node -v    # v22.x
bun -v     # 1.x
```

---

## 1. Get the code

```bash
sudo mkdir -p /var/www && sudo chown $USER /var/www
cd /var/www
git clone -b lovable-site https://github.com/benjaminkyalo/VidsIQ.git vidsiq-app
cd vidsiq-app
bun install
```

---

## 2. Set the environment variables

Keep every private website setting in one file outside the repository. PM2's
saved configuration always loads this exact file, including after a reboot:

```bash
sudo touch /etc/vidsiq.env
sudo chmod 600 /etc/vidsiq.env
sudo nano /etc/vidsiq.env
```

Paste this and fill in the keys you own:

```dotenv
# Required: YouTube checker and lookup tools
GOOGLE_API_KEY=paste-your-google-key-here

# Required: MP3, MP4 and Shorts downloads. Apify is used first when this token
# is set. Get it in the Apify console: your name (top left) > Settings >
# API & Integrations > Personal API tokens > Create a new token.
APIFY_DIRECT_TOKEN=paste-your-apify-personal-token-here

# Optional: your own conversion worker, used only when the Apify token is absent
CONVERSION_SERVICE_URL=http://127.0.0.1:8090
CONVERTER_API_KEY=paste-the-same-key-from-vidsiq-converter-env-here

# Optional: AI writing tools
AI_API_KEY=paste-your-ai-key-here
AI_MODEL=gpt-5.1
# AI_BASE_URL=https://api.openai.com/v1

PORT=3000
```

Never commit this file or print its contents. The committed
`ecosystem.config.cjs` contains only the file path, not any credentials.

Notes:
- `GOOGLE_API_KEY` is free from Google Cloud Console (YouTube Data API v3).
  10,000 units/day free. Search calls cost 100 units each, so a busy day can
  need a quota bump from Google.
- `AI_API_KEY` is the only way the AI tools work on your own server. Without it
  those tools show "AI writing is not configured." Everything else still works.
- Set `AI_MODEL` to a model your key can actually use. If it's wrong the AI
  tools will error and name the model.

---

## 3. Build

```bash
cd /var/www/vidsiq-app
bun run build:node
```

This produces `.output/` — a self-contained Node server with all public pages
prerendered. A successful build prints `Prerendered 83 pages`, then
`Prerender complete; closing preview handles.` and returns to the shell. Do not
restart PM2 if the build reports an error or does not exit.

---

## 4. Run it with pm2 (keeps settings and uptime after reboots)

```bash
sudo npm install -g pm2
cd /var/www/vidsiq-app
node --env-file=/etc/vidsiq.env scripts/verify-vps.mjs
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup     # then run the command it prints
```

The verification command checks setting names and converter health without
printing credentials. Do not start the website if it reports a failure.

Test it locally on the server:

```bash
curl -I http://127.0.0.1:3000/
```

You should see `HTTP/1.1 200 OK`.

---

## 5. Point nginx at it

Edit your existing site config (the one that already has the SSL cert):

```bash
sudo nano /etc/nginx/sites-available/vidsiq.com
```

Replace the `location /` block with:

```nginx
server {
    listen 443 ssl http2;
    server_name vidsiq.com www.vidsiq.com;

    # keep your existing ssl_certificate / ssl_certificate_key lines

    # Fast images & files: compress text, cache static files for a year
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;

    location /assets/ {
        proxy_pass http://127.0.0.1:3000;
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location ~* \.(webp|avif|png|jpg|jpeg|gif|svg|ico|woff2)$ {
        proxy_pass http://127.0.0.1:3000;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;
    }
}
```

Then:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

---

## 6. Check it in a browser

Open `https://vidsiq.com` and do a hard refresh (Ctrl+Shift+R).

You should see the current VidsIQ site: the logo in the header, the Tools
menu, and working tool results.

---

## Updating later

```bash
cd /var/www/vidsiq-app
git pull
bun install
bun run build:node
node --env-file=/etc/vidsiq.env scripts/verify-vps.mjs
pm2 restart ecosystem.config.cjs --update-env
pm2 save
```

The private settings stay in `/etc/vidsiq.env`; pulling code never replaces them.

### One-time move for an existing working VPS

If the current working settings are in `.env.production`, preserve them in the
permanent location, then adopt the saved startup configuration:

```bash
cd /var/www/vidsiq-app
sudo cp .env.production /etc/vidsiq.env
sudo chmod 600 /etc/vidsiq.env
node --env-file=/etc/vidsiq.env scripts/verify-vps.mjs
pm2 delete vidsiq
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup     # run the printed system command once if not done before
sudo systemctl enable docker
cd services/converter && docker compose up -d
```

This briefly restarts the website. Do not delete the old private file until the
verification command and a real download both pass. Future updates only need
the normal update cycle above.

---

## Troubleshooting

Dedicated MP3, MP4 and Shorts conversion on this VPS is documented in
[`services/converter/README.md`](services/converter/README.md), including
isolated workers, private credentials, file validation and live acceptance checks.

| Symptom | Cause / fix |
| --- | --- |
| Old site still shows | Browser cache. Hard refresh, or `pm2 restart vidsiq`. |
| Tools say "The YouTube connection is not configured." | `GOOGLE_API_KEY` missing or wrong in `/etc/vidsiq.env`. Run the verification command, then restart with `pm2 restart ecosystem.config.cjs --update-env`. |
| Downloads say "The download service is unavailable right now." | `APIFY_DIRECT_TOKEN` missing or wrong in `/etc/vidsiq.env`, or your Apify credit has run out. Run the verification command, then restart with `pm2 restart ecosystem.config.cjs --update-env`. |
| AI tools say "AI writing is not configured." | `AI_API_KEY` missing. |
| AI tools error with a model name | `AI_MODEL` isn't available to your key. Change it. |
| 502 from nginx | The Node server isn't up. `pm2 logs vidsiq`. |
| Build fails on `bun install` | Node too old. `node -v` must be 22+. |
| Only the logo is missing | You're on an old commit. `git pull` then rebuild. |

---

## Security note

`.env` is committed in this repo and only holds Supabase's **publishable**
keys — those are designed to be public, so this is not an emergency. Keep your
`GOOGLE_API_KEY`, `APIFY_DIRECT_TOKEN`, `CONVERTER_API_KEY` and `AI_API_KEY` in `/etc/vidsiq.env`
(not committed), and restrict the Google key to the YouTube Data API v3 only.
