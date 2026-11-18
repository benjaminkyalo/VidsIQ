import { z } from 'zod';

export const conversionTicket = z.string().regex(/^[a-f0-9]{32}\.[a-f0-9]{64}$/);
const jobSchema = z.object({
  ticket: conversionTicket,
  state: z.enum(['queued', 'processing', 'ready', 'error']),
  filename: z.string().max(200).optional(),
  size: z.number().int().positive().optional(),
  error: z.string().max(500).optional(),
});
export type ConversionJob = z.infer<typeof jobSchema>;
export type ConversionConfig = { url: string; key: string };

export function conversionBase(url: string): URL {
  const base = new URL(url);
  const local = ['127.0.0.1', 'localhost', '[::1]'].includes(base.hostname);
  if ((base.protocol !== 'https:' && !(local && base.protocol === 'http:')) || base.username || base.password || base.search || base.hash || base.pathname !== '/') {
    throw new Error('Invalid conversion service configuration.');
  }
  return base;
}

export async function requestConversion(config: ConversionConfig, input: {video_id: string; mode: 'audio'|'video'; quality: string; bitrate: string}, ticket?: string): Promise<ConversionJob> {
  const base = conversionBase(config.url);
  const path = ticket ? `/v1/jobs/${conversionTicket.parse(ticket)}` : '/v1/jobs';
  const response = await fetch(new URL(path, base), {
    method: ticket ? 'GET' : 'POST',
    headers: { Authorization: `Bearer ${config.key}`, 'Content-Type': 'application/json' },
    ...(ticket ? {} : {body: JSON.stringify(input)}),
    signal: AbortSignal.timeout(10_000), redirect: 'manual',
  });
  if (!response.ok) {
    if (response.status === 429) throw new Error('The conversion queue is full. Please try again shortly.');
    if (response.status === 404) throw new Error('This conversion expired. Start a new download.');
    throw new Error('The dedicated conversion service is unavailable. Please try again later.');
  }
  return jobSchema.parse(await response.json());
}