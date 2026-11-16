import { afterEach, expect, it, vi } from 'vitest';
import { fetchMedia } from './media-download';

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.useRealTimers(); });
it('retries an empty file and uses the successful provider filename', async () => {
  const get = vi.fn().mockResolvedValueOnce({url:'https://provider.test/first',filename:'first.mp3',next:1}).mockResolvedValueOnce({url:'https://provider.test/second',filename:'second.mp3'});
  vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(new Response(new Uint8Array(0),{headers:{'content-type':'audio/mpeg'}})).mockResolvedValueOnce(new Response(new Uint8Array(2048),{headers:{'content-type':'audio/mpeg'}})));
  const result = await fetchMedia(get, 'jNQXAC9IVRw', 'audio', '720', () => {});
  expect(result.blob.size).toBe(2048);
  expect(result.filename).toBe('second.mp3');
  expect(get).toHaveBeenCalledTimes(2);
});
it('stops an active stream at the 60-second deadline', async () => {
  vi.useFakeTimers();
  vi.spyOn(AbortSignal, 'timeout').mockImplementation(ms => { const ctl=new AbortController();setTimeout(()=>ctl.abort(),ms);return ctl.signal; });
  const get = vi.fn().mockResolvedValue({url:'https://provider.test/audio'});
  let interval: ReturnType<typeof setInterval>;
  const stream = new ReadableStream({start(controller){ interval=setInterval(()=>controller.enqueue(new Uint8Array(256)),5000); },cancel(){clearInterval(interval);}});
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(stream,{headers:{'content-type':'audio/mpeg'}})));
  const assertion = expect(fetchMedia(get, 'jNQXAC9IVRw', 'audio', '720', () => {})).rejects.toThrow('60 seconds');
  await vi.advanceTimersByTimeAsync(60_000);
  await assertion;
  expect(get).toHaveBeenCalledTimes(1);
});