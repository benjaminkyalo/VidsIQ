import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { parseYouTubeInput } from './tool-engine';
import { parseTimedText, type TranscriptSegment } from './transcript';

export type TranscriptTrack = { language: string; name: string; auto: boolean };
export type TranscriptResponse = { segments: TranscriptSegment[]; language?: string; tracks: TranscriptTrack[]; title?: string; error?: string };

type CaptionTrack = { baseUrl: string; languageCode: string; kind?: string; name?: { runs?: { text?: string }[]; simpleText?: string } };

async function loadTranscript(videoId: string, lang?: string): Promise<TranscriptResponse> {
  // Retrieve fresh player tracks: their base URLs contain expiring signatures.
  const player = await (async () => {
    const r = await fetch('https://www.youtube.com/youtubei/v1/player?prettyPrint=false', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(15000),
      body: JSON.stringify({ context: { client: { clientName: 'ANDROID', clientVersion: '20.10.38', hl: 'en' } }, videoId }),
    });
    if (!r.ok) throw new Error(`Captions are unavailable right now (${r.status}).`);
    const d = await r.json() as { videoDetails?: { title?: string }; captions?: { playerCaptionsTracklistRenderer?: { captionTracks?: CaptionTrack[] } } };
    return { title: d.videoDetails?.title, tracks: d.captions?.playerCaptionsTracklistRenderer?.captionTracks ?? [] };
  })();
  const tracks = player.tracks.map(t => ({ language: t.languageCode, name: t.name?.simpleText ?? t.name?.runs?.map(x => x.text).join('') ?? t.languageCode, auto: t.kind === 'asr' }));
  if (!player.tracks.length) return { segments: [], tracks, ...(player.title ? { title: player.title } : {}), error: 'This video has no captions or transcript available.' };
  const pick = player.tracks.find(t => t.languageCode === lang) ?? player.tracks.find(t => t.languageCode.startsWith('en') && t.kind !== 'asr') ?? player.tracks.find(t => t.kind !== 'asr') ?? player.tracks[0];
  if (!pick) return { segments: [], tracks, error: 'No caption track is available.' };
  const url = new URL(pick.baseUrl); url.searchParams.set('fmt', 'srv3');
  const r = await fetch(url, { signal: AbortSignal.timeout(15000) });
  const segments = r.ok ? parseTimedText(await r.text()) : [];
  if (!segments.length) return { segments, tracks, error: 'The transcript could not be loaded right now. Please try again.' };
  return { segments, tracks, language: pick.languageCode, ...(player.title ? { title: player.title } : {}) };
}

export const getTranscript = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => z.object({ input: z.string().trim().min(1).max(2000), lang: z.string().max(20).optional() }).parse(d))
  .handler(async ({ data }): Promise<TranscriptResponse> => {
    try {
      const parsed = parseYouTubeInput(data.input);
      if (parsed.kind !== 'video') return { segments: [], tracks: [], error: 'Enter a YouTube video link or video ID.' };
      return await loadTranscript(parsed.value, data.lang);
    } catch (e) { return { segments: [], tracks: [], error: e instanceof Error && e.message.length < 160 ? e.message : 'Captions are unavailable right now.' }; }
  });

const PROMPTS: Record<string, string> = {
  'Tag Generator': 'Generate 25 relevant YouTube video tags for the topic. Mix broad and long-tail phrases. Lowercase, no hashtags, no numbering. One tag per line.',
  'Title Generator': 'Write 10 compelling, honest YouTube video titles (under 70 characters) for the topic. Vary styles: how-to, list, question, curiosity. No numbering or quotes. One title per line.',
  'Channel Name Generator': 'Suggest 15 short, memorable, brandable YouTube channel names for the niche. Avoid existing famous brands. No numbering, no explanations. One name per line.',
  'Description Generator': 'Write one complete YouTube video description for the topic: an engaging 2-sentence hook, a short paragraph about what viewers learn, a "In this video:" list of 4 bullet points with placeholder timestamps like 00:00, a call to subscribe, and 5 relevant hashtags on the final line. Plain text, no markdown headings.',
};

export const generateCreatorText = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => z.object({ tool: z.enum(['Tag Generator', 'Title Generator', 'Channel Name Generator', 'Description Generator']), topic: z.string().trim().min(2).max(2000) }).parse(d))
  .handler(async ({ data }): Promise<{ items: string[]; error?: string }> => {
    const { aiText } = await import('./ai.server');
    try {
      const text = await aiText(`You help YouTube creators worldwide. ${PROMPTS[data.tool]} Write in the same language as the topic. Return only the requested content.`, `Topic: ${data.topic}`);
      if (data.tool === 'Description Generator') return { items: [text] };
      return { items: [...new Set(text.split('\n').map(l => l.replace(/^[\s\-*•\d.)]+/, '').replace(/^["“]|["”]$/g, '').trim()).filter(Boolean))].slice(0, 30) };
    } catch (e) { return { items: [], error: e instanceof Error ? e.message : 'AI writing failed. Please try again.' }; }
  });

export const summarizeVideo = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => z.object({ input: z.string().trim().min(1).max(2000) }).parse(d))
  .handler(async ({ data }): Promise<{ summary?: string; title?: string; error?: string }> => {
    try {
      const parsed = parseYouTubeInput(data.input);
      if (parsed.kind !== 'video') return { error: 'Enter a YouTube video link or video ID.' };
      const t = await loadTranscript(parsed.value);
      if (t.error) return { error: t.error === 'This video has no captions or transcript available.' ? 'This video has no captions, so it cannot be summarized.' : t.error };
      const text = t.segments.map(s => s.text).join(' ').slice(0, 60000);
      const { aiText } = await import('./ai.server');
      const summary = await aiText('You summarize YouTube videos from their transcript. Reply in English with: a one-sentence TL;DR line starting "TL;DR:", then "Key points:" followed by 5-8 lines each starting with "• ", then "Takeaway:" with one sentence. Plain text only. Only use information in the transcript.', `Video title: ${t.title ?? 'Unknown'}\n\nTranscript:\n${text}`);
      return { summary, ...(t.title ? { title: t.title } : {}) };
    } catch (e) { return { error: e instanceof Error && e.message.length < 160 ? e.message : 'The summary could not be created. Please try again.' }; }
  });

export const improveDescription = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => z.object({ title: z.string().max(200), description: z.string().max(5000), tags: z.array(z.string().max(100)).max(60) }).parse(d))
  .handler(async ({ data }): Promise<{ description?: string; error?: string }> => {
    try {
      const { aiText } = await import('./ai.server');
      const description = await aiText(
        'You are a YouTube SEO expert. Rewrite the video description so it ranks well in YouTube search and earns clicks, using only facts found in the title, tags and current description — never add names, dates, awards or places that are not there. Structure: first two lines contain the main keyword from the title and a strong hook; a short paragraph naming what viewers learn using natural related keywords; a "Chapters:" list with 4-6 placeholder timestamps (00:00 ...); a call to like and subscribe; 3 relevant hashtags on the last line. Keep any real links from the original. Write in the same language as the title. Plain text only, no markdown. Return only the description.',
        `Title: ${data.title}\nTags: ${data.tags.join(', ') || 'none'}\n\nCurrent description:\n${data.description || '(empty)'}`,
      );
      return { description };
    } catch (e) { return { error: e instanceof Error ? e.message : 'AI writing failed. Please try again.' }; }
  });
