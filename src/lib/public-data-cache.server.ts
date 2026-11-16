import { PublicDataCache, publicDataTtl } from './public-data-cache';

const local = new PublicDataCache();

// Best-effort shared edge cache, with bounded isolate caching when unavailable in preview.
export async function cachedPublicJson<T>(url: string, endpoint: string, load: () => Promise<T>): Promise<T> {
  const ttl = publicDataTtl(endpoint);
  return local.get(url, ttl, async () => {
    let edge: Cache | undefined;
    const key = new Request(url, { method: 'GET' });
    try {
      if (typeof caches !== 'undefined') edge = await caches.open('youtube-public-v1');
      const hit = await edge?.match(key);
      if (hit) return await hit.json() as T;
    } catch { /* Cache availability must not block public lookups. */ }
    const value = await load();
    try {
      await edge?.put(key, new Response(JSON.stringify(value), {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': `public, max-age=${ttl}` },
      }));
    } catch { /* A successful lookup still works if caching fails. */ }
    return value;
  });
}