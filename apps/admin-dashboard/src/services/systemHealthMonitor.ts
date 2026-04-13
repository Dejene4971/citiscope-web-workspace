export interface HealthCheck {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  latency: number;
  lastCheck: Date;
  error?: string;
}

interface RegisteredCheck {
  check: HealthCheck;
  fn: () => Promise<boolean>;
  timeoutMs: number;
}

class SystemHealthMonitor {
  private static instance: SystemHealthMonitor;
  private registry = new Map<string, RegisteredCheck>();
  private listeners = new Set<(health: Map<string, HealthCheck>) => void>();
  private intervalId: ReturnType<typeof setInterval> | null = null;

  private constructor() {}

  static getInstance(): SystemHealthMonitor {
    if (!SystemHealthMonitor.instance) {
      SystemHealthMonitor.instance = new SystemHealthMonitor();
    }
    return SystemHealthMonitor.instance;
  }

  /** Register a named health check and run it immediately. */
  registerCheck(name: string, checkFn: () => Promise<boolean>, timeoutMs = 5000): void {
    this.registry.set(name, {
      check: { name, status: 'healthy', latency: 0, lastCheck: new Date() },
      fn: checkFn,
      timeoutMs,
    });
    this.runCheck(name);
  }

  /** Start periodic re-evaluation of all registered checks. */
  startMonitoring(intervalMs = 60_000): void {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => {
      for (const name of this.registry.keys()) this.runCheck(name);
    }, intervalMs);
  }

  stopMonitoring(): void {
    if (this.intervalId) { clearInterval(this.intervalId); this.intervalId = null; }
  }

  /** Subscribe to health updates. Returns unsubscribe fn. */
  subscribe(listener: (health: Map<string, HealthCheck>) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getOverallStatus(): 'healthy' | 'degraded' | 'unhealthy' {
    let degraded = false;
    for (const { check } of this.registry.values()) {
      if (check.status === 'unhealthy') return 'unhealthy';
      if (check.status === 'degraded')  degraded = true;
    }
    return degraded ? 'degraded' : 'healthy';
  }

  getHealthSummary(): Record<string, { status: string; latency: string; lastCheck: string; error?: string }> {
    const out: ReturnType<typeof this.getHealthSummary> = {};
    for (const [name, { check }] of this.registry) {
      out[name] = {
        status:    check.status,
        latency:   `${check.latency}ms`,
        lastCheck: check.lastCheck.toISOString(),
        error:     check.error,
      };
    }
    return out;
  }

  /** Expose current checks as a plain Map for subscribers. */
  getChecks(): Map<string, HealthCheck> {
    const m = new Map<string, HealthCheck>();
    for (const [name, { check }] of this.registry) m.set(name, check);
    return m;
  }

  private async runCheck(name: string): Promise<void> {
    const entry = this.registry.get(name);
    if (!entry) return;

    const start = Date.now();
    try {
      const timeout = new Promise<boolean>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), entry.timeoutMs)
      );
      const ok = await Promise.race([entry.fn(), timeout]);
      entry.check.status    = ok ? 'healthy' : 'degraded';
      entry.check.error     = undefined;
    } catch (err) {
      entry.check.status = 'unhealthy';
      entry.check.error  = err instanceof Error ? err.message : String(err);
    } finally {
      entry.check.latency   = Date.now() - start;
      entry.check.lastCheck = new Date();
    }
    this.notifyListeners();
  }

  private notifyListeners(): void {
    const snapshot = this.getChecks();
    this.listeners.forEach(l => l(snapshot));
  }
}

export const systemHealthMonitor = SystemHealthMonitor.getInstance();
