/**
 * OfflineSync — localStorage-backed cache with TTL and conflict resolution.
 * Mimics a Redis-style key/value store in the browser.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;        // ms
  version: number;
}

class OfflineSyncService {
  private prefix = 'citiscope:';

  /** Store data with a TTL (default 5 min). */
  set<T>(key: string, data: T, ttlMs = 5 * 60 * 1000): void {
    const existing = this.getRaw<T>(key);
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
      version: existing ? existing.version + 1 : 1,
    };
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(entry));
    } catch {
      // Storage quota exceeded — evict oldest entries
      this.evictOldest();
      localStorage.setItem(this.prefix + key, JSON.stringify(entry));
    }
  }

  /** Get data if not expired. Returns null on miss/expiry. */
  get<T>(key: string): T | null {
    const entry = this.getRaw<T>(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.delete(key);
      return null;
    }
    return entry.data;
  }

  /** Resolve conflict: last-write-wins by default, or custom resolver. */
  merge<T>(key: string, incoming: T, resolver?: (local: T, remote: T) => T): T {
    const local = this.get<T>(key);
    if (!local) { this.set(key, incoming); return incoming; }
    const resolved = resolver ? resolver(local, incoming) : incoming;
    this.set(key, resolved);
    return resolved;
  }

  delete(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  /** Batch set multiple keys at once. */
  batchSet<T>(entries: { key: string; data: T; ttl?: number }[]): void {
    entries.forEach(e => this.set(e.key, e.data, e.ttl));
  }

  /** Returns all non-expired keys managed by this service. */
  keys(): string[] {
    return Object.keys(localStorage)
      .filter(k => k.startsWith(this.prefix))
      .map(k => k.slice(this.prefix.length));
  }

  clearAll(): void {
    this.keys().forEach(k => this.delete(k));
  }

  private getRaw<T>(key: string): CacheEntry<T> | null {
    const raw = localStorage.getItem(this.prefix + key);
    if (!raw) return null;
    try { return JSON.parse(raw) as CacheEntry<T>; } catch { return null; }
  }

  private evictOldest(): void {
    const entries = this.keys().map(k => ({ key: k, entry: this.getRaw(k) }))
      .filter(e => e.entry !== null)
      .sort((a, b) => (a.entry!.timestamp) - (b.entry!.timestamp));
    if (entries.length > 0) this.delete(entries[0].key);
  }
}

export const offlineSync = new OfflineSyncService();
