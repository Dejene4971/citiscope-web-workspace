interface CacheEntry {
  data: unknown;
  timestamp: number;
  ttl: number;
}

interface GetOptions {
  skipCache?: boolean;
  ttl?: number;
}

/**
 * API Proxy — transparent caching, request deduplication, and exponential-backoff retry.
 *
 * Usage:
 *   const issues = await apiProxy.get<Issue[]>('/api/issues');
 *   const created = await apiProxy.post<Issue>('/api/issues', payload);
 */
class APIProxy {
  private cache           = new Map<string, CacheEntry>();
  private pendingRequests = new Map<string, Promise<unknown>>();

  private readonly DEFAULT_TTL  = 60_000; // 1 min
  private readonly MAX_RETRIES  = 3;
  private readonly RETRY_DELAY  = 1_000;  // base ms (doubles each retry)

  // ── Public API ─────────────────────────────────────────────────────────────

  async get<T>(url: string, options?: GetOptions): Promise<T> {
    const key = `GET:${url}`;

    // Cache hit
    if (!options?.skipCache) {
      const cached = this.cache.get(key);
      if (cached && Date.now() - cached.timestamp < (options?.ttl ?? this.DEFAULT_TTL)) {
        return cached.data as T;
      }
    }

    // Deduplicate in-flight requests
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key) as Promise<T>;
    }

    const request = this.fetchWithRetry<T>(url);
    this.pendingRequests.set(key, request);

    try {
      const result = await request;
      this.cache.set(key, { data: result, timestamp: Date.now(), ttl: options?.ttl ?? this.DEFAULT_TTL });
      return result;
    } finally {
      this.pendingRequests.delete(key);
    }
  }

  async post<T>(url: string, data: unknown): Promise<T> {
    this.invalidate(url);
    return this.fetchWithRetry<T>(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async put<T>(url: string, data: unknown): Promise<T> {
    this.invalidate(url);
    return this.fetchWithRetry<T>(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async delete<T>(url: string): Promise<T> {
    this.invalidate(url);
    return this.fetchWithRetry<T>(url, { method: 'DELETE' });
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheStats(): { size: number; keys: string[] } {
    return { size: this.cache.size, keys: Array.from(this.cache.keys()) };
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  private invalidate(url: string): void {
    // Remove both GET and POST cache entries for the base URL
    const base = url.split('?')[0];
    this.cache.delete(`GET:${base}`);
    this.cache.delete(`POST:${base}`);
  }

  private async fetchWithRetry<T>(
    url: string,
    options?: RequestInit,
    attempt = 0,
  ): Promise<T> {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(url, {
        ...options,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options?.headers,
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      return (await res.json()) as T;

    } catch (err) {
      if (attempt < this.MAX_RETRIES) {
        const delay = this.RETRY_DELAY * Math.pow(2, attempt);
        await new Promise(r => setTimeout(r, delay));
        return this.fetchWithRetry<T>(url, options, attempt + 1);
      }
      throw err;
    }
  }
}

export const apiProxy = new APIProxy();
