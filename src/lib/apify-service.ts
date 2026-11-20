import { z } from 'zod';
// Apify "YouTube Video Downloader" actor (marielise.dev). Runs async; the client polls the run id.
const GATEWAY = 'https://connector-gateway.lovable.dev/apify';
const DIRECT_BASE = 'https://api.apify.com/v2';
const ACTOR = 'marielise.dev~youtube-video-downloader';
export const apifyJob = z.string().regex(/^apify:[A-Za-z0-9]{10,24}$/);
export type ApifyState = { job: string; state: 'queued'|'processing'|'ready'|'error'; filename?: string; size?: number; error?: string };
const item = z.object({ status: z.string().optional(), title: z.string().optional(), format: z.string().optional(), fileSizeBytes: z.number().optional(), downloadUrl: z.string().optional(), contentType: z.string().optional(), error: z.string().optional() }).passthrough();

// On self-hosted servers the connector gateway is unavailable, so a personal
// Apify token may be supplied directly; it is read only inside server handlers.
// Tolerate pasted values wrapped in quotes or carrying stray spaces/line endings.
const cleanToken = (v: string | undefined) => (v ?? '').trim().replace(/^['"]|['"]$/g, '').trim();
export function apifyDirectToken() { return cleanToken(process.env['APIFY_DIRECT_TOKEN']) || cleanToken(process.env['APIFY_TOKEN']); }
export function apifyConfigured() { return Boolean(apifyDirectToken() || (process.env['APIFY_API_KEY'] && process.env['LOVABLE_API_KEY'])); }
async function call(path: string, init: RequestInit = {}) {
  const direct = apifyDirectToken();
  const headers = direct
    ? { Authorization: `Bearer ${direct}`, 'Content-Type': 'application/json' }
    : { Authorization: `Bearer ${process.env['LOVABLE_API_KEY'] ?? ''}`, 'X-Connection-Api-Key': process.env['APIFY_API_KEY'] ?? '', 'Content-Type': 'application/json' };
  const r = await fetch(`${direct ? DIRECT_BASE : GATEWAY}${path}`, { ...init, headers, signal: AbortSignal.timeout(15_000) });
  if (!r.ok) { console.error(`Apify request failed [${r.status}]: ${await r.text()}`); throw new Error(r.status === 402 ? 'The download plan has run out. Please try again later.' : 'The download service is unavailable right now. Please try again later.'); }
  return r.json() as Promise<{ data?: unknown } & Record<string, unknown>>;
}
const safeName = (t: string | undefined, ext: string) => `${(t ?? 'download').replace(/[^\p{L}\p{N} ._-]+/gu, '').trim().slice(0, 80) || 'download'}.${ext}`;

export async function startApify(videoId: string, mode: 'audio'|'video', quality: string): Promise<ApifyState> {
  const input = { urls: [{ url: `https://www.youtube.com/watch?v=${videoId}` }], format: mode === 'audio' ? 'mp3' : 'default', quality };
  const res = await call(`/acts/${ACTOR}/runs?timeout=300`, { method: 'POST', body: JSON.stringify(input) });
  const id = (res.data as { id?: string } | undefined)?.id;
  if (!id) throw new Error('The download service did not start. Please try again.');
  return { job: `apify:${id}`, state: 'queued' };
}

async function firstItem(runId: string) {
  const run = (await call(`/actor-runs/${runId}`)).data as { status?: string; defaultDatasetId?: string };
  if (!run?.defaultDatasetId) return { run, data: undefined };
  const items = await call(`/datasets/${run.defaultDatasetId}/items?limit=1&clean=1`) as unknown;
  const list = Array.isArray(items) ? items : [];
  return { run, data: list[0] ? item.parse(list[0]) : undefined };
}

export async function checkApify(job: string): Promise<ApifyState> {
  const runId = apifyJob.parse(job).slice(6);
  const { run, data } = await firstItem(runId);
  const s = run?.status ?? '';
  if (s === 'READY') return { job, state: 'queued' };
  if (s === 'RUNNING') return { job, state: 'processing' };
  if (s === 'SUCCEEDED' && data?.status === 'success' && data.downloadUrl) {
    const audio = data.format === 'MP3';
    return { job, state: 'ready', filename: safeName(data.title, audio ? 'mp3' : 'mp4'), ...(data.fileSizeBytes ? { size: data.fileSizeBytes } : {}) };
  }
  return { job, state: 'error', error: 'This video could not be converted. It may be private, age-restricted or blocked. Try another video.' };
}

// Resolve the signed file URL server-side only; it never reaches the browser.
export async function apifyFileUrl(job: string): Promise<string | null> {
  const { run, data } = await firstItem(apifyJob.parse(job).slice(6));
  if (run?.status !== 'SUCCEEDED' || !data?.downloadUrl) return null;
  const u = new URL(data.downloadUrl);
  return u.protocol === 'https:' && u.hostname === 'api.apify.com' && u.pathname.startsWith('/v2/key-value-stores/') ? u.toString() : null;
}
