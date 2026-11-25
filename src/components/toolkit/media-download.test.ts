import { afterEach, expect, it, vi } from 'vitest';
import { conversionPollDelay, fetchMedia } from './media-download';

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
it('checks short conversions after 250ms and verifies delivered byte count', async () => {
  vi.useFakeTimers();
  const job='a'.repeat(32)+'.'+'b'.repeat(64);
  const get=vi.fn().mockResolvedValueOnce({dedicated:true,job,state:'queued'}).mockResolvedValueOnce({dedicated:true,job,state:'processing'}).mockResolvedValueOnce({dedicated:true,job,state:'ready',filename:'verified.mp4',size:2048});
  const fetch=vi.fn().mockResolvedValue(new Response(new Uint8Array(2048),{headers:{'content-type':'video/mp4'}}));
  vi.stubGlobal('fetch',fetch);
  const result=fetchMedia(get,'jNQXAC9IVRw','video','720',()=>{});
  await vi.advanceTimersByTimeAsync(249);
  expect(get).toHaveBeenCalledTimes(1);
  await vi.advanceTimersByTimeAsync(1);
  expect(get).toHaveBeenCalledTimes(2);
  await vi.advanceTimersByTimeAsync(250);
  expect((await result).blob.size).toBe(2048);
  expect(fetch).toHaveBeenCalledWith(`/api/media?job=${job}`,expect.anything());
  expect(get).toHaveBeenCalledTimes(3);
});
it('returns to one-second status checks after the quick-start window',()=>{
  expect([0,1,2,3].map(conversionPollDelay)).toEqual([250,250,250,250]);
  expect(conversionPollDelay(4)).toBe(1000);
  expect(conversionPollDelay(100)).toBe(1000);
});
it('rejects an incomplete dedicated file without a free-service retry', async () => {
  const get=vi.fn().mockResolvedValue({dedicated:true,job:'a'.repeat(32)+'.'+'b'.repeat(64),state:'ready',size:4096});
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response(new Uint8Array(2048),{headers:{'content-type':'audio/mpeg'}})));
  await expect(fetchMedia(get,'jNQXAC9IVRw','audio','720',()=>{})).rejects.toThrow('incomplete');
  expect(get).toHaveBeenCalledTimes(1);
});
