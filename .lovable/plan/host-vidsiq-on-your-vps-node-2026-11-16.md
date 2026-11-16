# Host VidsIQ on your VPS (Node)

Goal: the site builds and runs as a plain Node server on your VPS, with no Lovable hosting involved. Your domain already points at the VPS, so no DNS change is needed — just deploy.

## 1. Make the build produce a Node server
- Switch the build output from the serverless/Worker target to a Node server (`NITRO_PRESET=node-server`).
- Fix `src/server.ts` so the prerender step works with the Node target (today it fails with `server.fetch is not a function` on every page).
- Result: `bun run build` produces a `.output/` folder you start with `node .output/server/index.mjs`.

## 2. Replace Lovable-only services with direct providers
Two features currently call Lovable's private gateways, which won't exist on your VPS:

- **YouTube data** (search, channels, stats, comments, playlists): switch `src/lib/tool-data.functions.ts` to call the official YouTube Data API (`googleapis.com/youtube/v3`) directly. You create a free API key in Google Cloud Console (takes ~5 minutes, free tier is generous).
- **AI tools** (titles, tags, descriptions, summaries, SEO rewrites): switch `src/lib/ai.server.ts` to a standard OpenAI-compatible endpoint with your own API key (e.g. OpenAI, or any compatible provider you prefer).

Everything else (downloads, thumbnails, transcripts, dislikes) already calls public services directly and needs no change.

## 3. Environment file for the VPS
Add `.env.production.example` listing exactly what the server needs:
- `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` (public values, already in the repo)
- `YOUTUBE_API_KEY` (your free Google key)
- `AI_API_KEY` + `AI_BASE_URL` + `AI_MODEL` (your chosen AI provider)

## 4. Deployment guide
A short `DEPLOY.md` with copy-paste steps for the VPS: install Node 20+, `git pull`, `bun install`, `bun run build`, run with pm2 (auto-restart), and point nginx/Caddy at it with your existing certificate.

## 5. Verify before handover
- Build passes with all pages prerendered.
- Start the Node server locally here and smoke-test: homepage, a tool page, a video report, and an AI tool.
- 59 existing tests still pass.

## What you'll need to provide (only when deploying)
- A free YouTube Data API key from Google Cloud Console.
- An API key from an AI provider (a few dollars of credit is plenty to start).

Nothing is published or changed on the live site until you run the deploy steps on the VPS.
