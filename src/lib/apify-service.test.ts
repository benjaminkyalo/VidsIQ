import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { apifyConfigured, apifyDirectToken, apifyJob, startApify } from './apify-service';

const KEYS = ['APIFY_DIRECT_TOKEN', 'APIFY_TOKEN', 'APIFY_API_KEY', 'LOVABLE_API_KEY'] as const;
let saved: Record<string, string | undefined> = {};

beforeEach(() => {
  saved = {};
  for (const key of KEYS) { saved[key] = process.env[key]; delete process.env[key]; }
});
afterEach(() => {
  for (const key of KEYS) {
    if (saved[key] === undefined) delete process.env[key];
    else process.env[key] = saved[key];
  }
  vi.unstubAllGlobals();
});

it('reports the download service unconfigured without any credentials', () => {
  expect(apifyConfigured()).toBe(false);
  expect(apifyDirectToken()).toBe('');
});

it('works with only a personal Apify token, as on a self-hosted server', () => {
  process.env['APIFY_DIRECT_TOKEN'] = 'personal-token';
  expect(apifyConfigured()).toBe(true);
  expect(apifyDirectToken()).toBe('personal-token');
});

it('needs both connector secrets before using the connector gateway', () => {
  process.env['APIFY_API_KEY'] = 'connection-key';
  expect(apifyConfigured()).toBe(false);
  process.env['LOVABLE_API_KEY'] = 'project-key';
  expect(apifyConfigured()).toBe(true);
});

it('sends the personal token straight to Apify and never the connector key', async () => {
  process.env['APIFY_DIRECT_TOKEN'] = 'personal-token';
  const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: { id: 'run1234567890ab' } })));
  vi.stubGlobal('fetch', fetch);
  const started = await startApify('jNQXAC9IVRw', 'audio', '192');
  expect(started.job).toBe('apify:run1234567890ab');
  const [url, init] = fetch.mock.calls[0]!;
  expect(String(url)).toBe('https://api.apify.com/v2/acts/marielise.dev~youtube-video-downloader/runs?timeout=300');
  const headers = init!.headers as Record<string, string>;
  expect(headers['Authorization']).toBe('Bearer personal-token');
  expect(headers['X-Connection-Api-Key']).toBeUndefined();
});

it('routes through the connector gateway when only connector secrets exist', async () => {
  process.env['APIFY_API_KEY'] = 'connection-key';
  process.env['LOVABLE_API_KEY'] = 'project-key';
  const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: { id: 'run1234567890ab' } })));
  vi.stubGlobal('fetch', fetch);
  await startApify('jNQXAC9IVRw', 'video', '720');
  const [url, init] = fetch.mock.calls[0]!;
  expect(String(url)).toBe('https://connector-gateway.lovable.dev/apify/acts/marielise.dev~youtube-video-downloader/runs?timeout=300');
  const headers = init!.headers as Record<string, string>;
  expect(headers['X-Connection-Api-Key']).toBe('connection-key');
  expect(headers['Authorization']).toBe('Bearer project-key');
});

it('accepts only well-formed Apify job tickets', () => {
  expect(apifyJob.safeParse('apify:run1234567890ab').success).toBe(true);
  expect(apifyJob.safeParse('apify:short').success).toBe(false);
  expect(apifyJob.safeParse('deadbeefdeadbeef.deadbee').success).toBe(false);
});
