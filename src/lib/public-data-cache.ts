// Public records only: never use this cache for sessions, credentials, or media URLs.
export function publicDataTtl(endpoint: string): number {
  if (endpoint === 'search') return 300;
  if (endpoint === 'playlistItems' || endpoint === 'commentThreads') return 60;
  return 30;
}

export class PublicDataCache {
  private values = new Map<string, { value: unknown; expires: number }>();
  private pending = new Map<string, Promise<unknown>>();
  constructor(private capacity = 128, private now = () => Date.now()) {}

  async get<T>(key: string, ttl: number, load: () => Promise<T>): Promise<T> {
    const cached = this.values.get(key);
    if (cached && cached.expires > this.now()) return cached.value as T;
    this.values.delete(key);
    const running = this.pending.get(key);
    if (running) return running as Promise<T>;
    if (this.pending.size >= 64) throw new Error('Many lookups are running. Please try again shortly.');
    const task = Promise.resolve().then(load).then(value => {
      if (this.values.size >= this.capacity) {
        const oldest = this.values.keys().next().value;
        if (oldest !== undefined) this.values.delete(oldest);
      }
      this.values.set(key, { value, expires: this.now() + ttl * 1000 });
      return value;
    }).finally(() => this.pending.delete(key));
    this.pending.set(key, task);
    return task;
  }
}