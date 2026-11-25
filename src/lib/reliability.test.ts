import { afterEach, expect, it, vi } from 'vitest';
import { withinDeadline, MEDIA_DEADLINE_MS } from './request-deadline';
import { validateToolInput } from './tool-engine';

afterEach(() => vi.useRealTimers());
it('enforces the intended 60-second media deadline even on a pending operation', async () => {
  vi.useFakeTimers();
  expect(MEDIA_DEADLINE_MS).toBe(60_000);
  const controller = new AbortController();
  const result = withinDeadline(new Promise(() => {}), controller.signal);
  const assertion = expect(result).rejects.toThrow('took too long');
  setTimeout(() => controller.abort(), MEDIA_DEADLINE_MS);
  await vi.advanceTimersByTimeAsync(60_000);
  await assertion;
});
it.each(['MP3 Downloader', 'YouTube Shorts Downloader', 'YouTube URL Downloader', 'Thumbnail Downloader'])('%s rejects a channel handle', tool => {
  expect(() => validateToolInput(tool, '@mkbhd')).toThrow();
  expect(validateToolInput(tool, 'jNQXAC9IVRw')).toBe('jNQXAC9IVRw');
});