export type AuditAction =
  | 'CREATE_ISSUE'
  | 'UPDATE_STATUS'
  | 'ASSIGN_TECHNICIAN'
  | 'RESOLVE_ISSUE'
  | 'IOT_ALERT_RECEIVED'
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'MAP_MARKER_SELECTED';

export interface AuditEntry {
  id: string;
  action: AuditAction;
  entityId?: string;
  entityType?: string;
  userId?: string;
  userRole?: string;
  payload?: Record<string, unknown>;
  timestamp: string;
}

const STORAGE_KEY = 'citiscope:audit_log';
const MAX_ENTRIES = 500;

class AuditService {
  private entries: AuditEntry[] = [];

  constructor() {
    this.load();
  }

  log(
    action: AuditAction,
    options: {
      entityId?: string;
      entityType?: string;
      userId?: string;
      userRole?: string;
      payload?: Record<string, unknown>;
    } = {}
  ): AuditEntry {
    const entry: AuditEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      action,
      timestamp: new Date().toISOString(),
      ...options,
    };
    this.entries.unshift(entry);
    if (this.entries.length > MAX_ENTRIES) this.entries.pop();
    this.persist();
    return entry;
  }

  getAll(): AuditEntry[] {
    return [...this.entries];
  }

  getByAction(action: AuditAction): AuditEntry[] {
    return this.entries.filter(e => e.action === action);
  }

  getByEntity(entityId: string): AuditEntry[] {
    return this.entries.filter(e => e.entityId === entityId);
  }

  clear(): void {
    this.entries = [];
    localStorage.removeItem(STORAGE_KEY);
  }

  private persist(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.entries.slice(0, MAX_ENTRIES)));
    } catch { /* quota exceeded — skip */ }
  }

  private load(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) this.entries = JSON.parse(raw);
    } catch {
      this.entries = [];
    }
  }
}

export const auditService = new AuditService();
