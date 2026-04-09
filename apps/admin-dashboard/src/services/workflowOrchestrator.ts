import { store } from '../store/store';
import { addAlert } from '../features/iot/iotSlice';
import { fetchSuccess } from '../features/issues/issuesSlice';
import { setMarkers } from '../features/map/mapSlice';
import { addNotification } from '../features/ui/uiSlice';
import { auditService } from './auditService';
import type { IoTAlert } from '../features/iot/iotSlice';
import type { Issue } from '@citiscope/types';

type EventHandler<T = unknown> = (data: T) => Promise<void> | void;

// ── Mediator ──────────────────────────────────────────────────────────────────

class WorkflowOrchestrator {
  private handlers = new Map<string, EventHandler[]>();

  /** Register a handler for an event type. Returns unsubscribe fn. */
  register<T>(eventType: string, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(eventType)) this.handlers.set(eventType, []);
    this.handlers.get(eventType)!.push(handler as EventHandler);
    return () => {
      const list = this.handlers.get(eventType) ?? [];
      this.handlers.set(eventType, list.filter(h => h !== handler));
    };
  }

  /** Fire all handlers for an event type in registration order. */
  async trigger<T>(eventType: string, data: T): Promise<void> {
    const list = this.handlers.get(eventType) ?? [];
    for (const handler of list) {
      try { await handler(data); }
      catch (err) { console.error(`[Orchestrator] handler error for "${eventType}":`, err); }
    }
  }
}

export const orchestrator = new WorkflowOrchestrator();

// ── Built-in workflow registrations ──────────────────────────────────────────

/**
 * IoT Alert → Issue + Map Marker + Notification + Audit
 */
orchestrator.register<IoTAlert>('iot:alert', async (alert) => {
  const dispatch = store.dispatch;

  // 1. Add to IoT alerts list
  dispatch(addAlert({ ...alert, id: alert.id ?? `ALERT-${Date.now()}` }));

  // 2. Synthesise an issue from the alert
  const syntheticIssue: Issue = {
    issue_id: `IOT-${alert.sensorId}-${Date.now()}`,
    title: `[IoT] ${alert.sensorType.replace('_', ' ')} alert — ${alert.location.address}`,
    description: `Sensor ${alert.sensorId} exceeded threshold. Value: ${alert.metrics.value} ${alert.metrics.unit} (threshold: ${alert.metrics.threshold})`,
    category: alert.sensorType === 'water_pressure' ? 'water'
      : alert.sensorType === 'electrical' ? 'electricity'
      : alert.sensorType === 'flood' ? 'sewage'
      : 'water',
    severity: alert.metrics.isCritical ? 'critical' : 'high',
    status: 'pending',
    location: {
      latitude: alert.location.latitude,
      longitude: alert.location.longitude,
      woreda_id: alert.location.woredaId,
      address: alert.location.address,
    },
    reported_by: 'iot-system',
    reported_at: new Date().toISOString(),
    media_urls: [],
    upvotes: 0,
  };

  // 3. Add issue to store (prepend to existing items)
  const state = store.getState();
  const existing = state.issues.items;
  dispatch(fetchSuccess({
    data: [syntheticIssue, ...existing],
    total: existing.length + 1,
    page: 1,
    per_page: 20,
  }));

  // 4. Add map marker
  const existingMarkers = state.map.markers;
  dispatch(setMarkers([
    ...existingMarkers,
    {
      id: syntheticIssue.issue_id,
      position: [alert.location.latitude, alert.location.longitude] as [number, number],
      type: 'sensor',
      severity: syntheticIssue.severity,
      data: {
        title: syntheticIssue.title,
        description: syntheticIssue.description,
        sensorId: alert.sensorId,
        value: alert.metrics.value,
        threshold: alert.metrics.threshold,
      },
    },
  ]));

  // 5. Unified notification
  dispatch(addNotification({
    type: alert.metrics.isCritical ? 'error' : 'warning',
    title: alert.metrics.isCritical ? '🚨 Critical IoT Alert' : '⚠️ IoT Warning',
    message: `${alert.sensorType.replace('_', ' ')} at ${alert.location.address}: ${alert.metrics.value} ${alert.metrics.unit}`,
    source: 'iot',
  }));

  // 6. Audit log
  auditService.log('IOT_ALERT_RECEIVED', {
    entityId: alert.sensorId,
    entityType: 'sensor',
    payload: { value: alert.metrics.value, threshold: alert.metrics.threshold, isCritical: alert.metrics.isCritical },
  });
});

/**
 * Issue status change → Notification + Audit
 */
orchestrator.register<{ issue: Issue; previousStatus: string; userId?: string }>('issue:status_changed', async ({ issue, previousStatus, userId }) => {
  const dispatch = store.dispatch;

  dispatch(addNotification({
    type: issue.status === 'resolved' ? 'success' : 'info',
    title: issue.status === 'resolved' ? '✅ Issue Resolved' : '📋 Issue Updated',
    message: `"${issue.title}" changed from ${previousStatus} → ${issue.status}`,
    source: 'issue',
  }));

  auditService.log(
    issue.status === 'resolved' ? 'RESOLVE_ISSUE' : 'UPDATE_STATUS',
    { entityId: issue.issue_id, entityType: 'issue', userId, payload: { from: previousStatus, to: issue.status } }
  );
});

/**
 * Issue created → Audit
 */
orchestrator.register<{ issue: Issue; userId?: string }>('issue:created', async ({ issue, userId }) => {
  auditService.log('CREATE_ISSUE', {
    entityId: issue.issue_id,
    entityType: 'issue',
    userId,
    payload: { title: issue.title, severity: issue.severity, category: issue.category },
  });
});
