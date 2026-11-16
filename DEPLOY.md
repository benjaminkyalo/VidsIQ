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
git clone -b lovable-site https://github.com/benjaminkyalo/youtubedownloadpro.git vidsiq
cd vidsiq
bun install
```

---

## 2. Set the environment variables

Create the secrets file:

```bash
nano /var/www/vidsiq/.env.production
```

Paste this and fill in the two keys you own:

```bash
# --- required: YouTube data (all the checker / lookup tools) ---
# Google Cloud Console -> APIs & Services -> Credentials -> your "VidsIQ" API key
GOOGLE_API_KEY=paste-your-google-key-here

# --- required: AI writing (title / tag / description generators, summarizer, SEO rewrite) ---
# Any OpenAI-compatible provider works.
AI_API_KEY=paste-your-ai-key-here
AI_MODEL=gpt-5.1
# AI_BASE_URL=https://api.openai.com/v1   # uncomment only if you use a different provider

# --- already committed, no need to change ---
SUPABASE_URL=https://kileqgforewkricvbzpp.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_27yH1_lvX1Mn7Yr6hjsGbQ_qZDu6Usc
```

Lock it down so other users on the server can't read it:

```bash
chmod 600 /var/www/vidsiq/.env.production
```

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
cd /var/www/vidsiq
bun run build:node
```

This produces `.output/` — a self-contained Node server.
It takes a few minutes. A prerender warning about `server.fetch` is harmless:
pages are rendered live by the server instead of being frozen to disk.

---

## 4. Run it with pm2 (keeps it up after reboots)

```bash
sudo npm install -g pm2
cd /var/www/vidsiq
PORT=3000 pm2 start .output/server/index.mjs --name vidsiq
pm2 save
pm2 startup     # then run the command it prints
```

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
    listen 443 ssl;
    server_name vidsiq.com www.vidsiq.com;

    # keep your existing ssl_certificate / ssl_certificate_key lines

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
cd /var/www/vidsiq
git pull
bun install
bun run build:node
pm2 restart vidsiq
```

That's the whole update cycle — four lines.

---

## Troubleshooting

| Symptom | Cause / fix |
| --- | --- |
| Old site still shows | Browser cache. Hard refresh, or `pm2 restart vidsiq`. |
| Tools say "The YouTube connection is not configured." | `GOOGLE_API_KEY` missing or wrong. Check `.env.production`, rebuild not needed — restart: `pm2 restart vidsiq`. |
| AI tools say "AI writing is not configured." | `AI_API_KEY` missing. |
| AI tools error with a model name | `AI_MODEL` isn't available to your key. Change it. |
| 502 from nginx | The Node server isn't up. `pm2 logs vidsiq`. |
| Build fails on `bun install` | Node too old. `node -v` must be 22+. |
| Only the logo is missing | You're on an old commit. `git pull` then rebuild. |

---

## Security note

`.env` is committed in this repo and only holds Supabase's **publishable**
keys — those are designed to be public, so this is not an emergency. Keep your
`GOOGLE_API_KEY` and `AI_API_KEY` in `.env.production` (not committed), and
restrict the Google key to the YouTube Data API v3 only.
