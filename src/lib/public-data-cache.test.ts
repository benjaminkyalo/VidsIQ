import { describe, expect, it } from 'vitest';
import { PublicDataCache, publicDataTtl } from './public-data-cache';

describe('public lookup reuse', () => {
  it('shares one upstream call for simultaneous identical requests', async () => {
    const cache = new PublicDataCache(); let calls = 0;
    const load = async () => { calls++; return { views: '125' }; };
    const results = await Promise.all(Array.from({ length: 1000 }, () => cache.get('video-1', 30, load)));
    expect(calls).toBe(1); expect(results[999]).toEqual({ views: '125' });
  });
  it('refreshes statistics after 30 seconds', async () => {
    let time = 0; let calls = 0; const cache = new PublicDataCache(128, () => time);
    const load = async () => ++calls;
    expect(await cache.get('video', 30, load)).toBe(1);
    time = 29999; expect(await cache.get('video', 30, load)).toBe(1);
    time = 30000; expect(await cache.get('video', 30, load)).toBe(2);
  });
  it('does not cache failures', async () => {
    const cache = new PublicDataCache();
    await expect(cache.get('key', 30, async () => { throw new Error('offline'); })).rejects.toThrow('offline');
    expect(await cache.get('key', 30, async () => 'recovered')).toBe('recovered');
  });
  it('bounds cached entries and separates pages', async () => {
    const cache = new PublicDataCache(1); let calls = 0;
    const load = async () => ++calls;
    await cache.get('page1', 30, load); await cache.get('page2', 30, load);
    expect(await cache.get('page1', 30, load)).toBe(3);
  });
  it('uses short freshness windows for counts and longer windows for discovery', () => {
    expect(publicDataTtl('videos')).toBe(30); expect(publicDataTtl('channels')).toBe(30);
    expect(publicDataTtl('search')).toBe(300); expect(publicDataTtl('commentThreads')).toBe(60);
  });
});