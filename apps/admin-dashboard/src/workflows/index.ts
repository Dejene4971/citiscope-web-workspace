import { orchestrator } from '../services/workflowOrchestrator';
import { auditService } from '../services/auditService';
import { store } from '../store/store';
import { addNotification } from '../features/ui/uiSlice';
import { addIssue, updateIssueStatus } from '../features/issues/issuesSlice';
import { setMarkers } from '../features/map/mapSlice';
import type { IoTAlert } from '../features/iot/iotSlice';
import type { Issue } from '@citiscope/types';

// ── Types ─────────────────────────────────────────────────────────────────────

interface IssueCreatedPayload  { issue: Issue; source?: string }
interface IssueAssignedPayload { issue: Issue; technicianId: string; userId?: string }
interface IssueResolvedPayload { issue: Issue; userId?: string }
interface UserLoginPayload     { userId: string; role: string }
interface UserLogoutPayload    { userId: string }

// ── Registration ──────────────────────────────────────────────────────────────

/**
 * Register all application-level workflow handlers.
 * Called once at app startup from AppInitializer.
 */
export function registerAllHandlers(): void {

  // ── IoT Alert Handlers ────────────────────────────────────────────────────

  orchestrator.register<IoTAlert>('iot:alert', (alert) => {
    auditService.log('IOT_ALERT_RECEIVED', {
      entityId: alert.sensorId,
      entityType: 'sensor',
      payload: { value: alert.metrics.value, threshold: alert.metrics.threshold },
    });
  });

  orchestrator.register<IoTAlert>('iot:alert:createIssue', (alert) => {
    const issue: Issue = {
      issue_id:    `IOT-${alert.sensorId}-${Date.now()}`,
      title:       `[IoT] ${alert.sensorType.replace('_', ' ')} — ${alert.location.address}`,
      description: `Sensor ${alert.sensorId} exceeded threshold. Value: ${alert.metrics.value} ${alert.metrics.unit}`,
      category:    alert.sensorType === 'water_pressure' ? 'water'
                 : alert.sensorType === 'electrical'     ? 'electricity'
                 : 'water',
      severity:    alert.metrics.isCritical ? 'critical' : 'high',
      status:      'pending',
      location:    { latitude: alert.location.latitude, longitude: alert.location.longitude, woreda_id: alert.location.woredaId, address: alert.location.address },
      reported_by: 'iot-system',
      reported_at: new Date().toISOString(),
      media_urls:  [],
      upvotes:     0,
    };
    store.dispatch(addIssue(issue));
    orchestrator.trigger('issue:created', { issue, source: 'iot' });
  });

  orchestrator.register<IoTAlert>('iot:alert:addMarker', (alert) => {
    const existing = store.getState().map.markers;
    store.dispatch(setMarkers([
      ...existing,
      {
        id:       `marker-${alert.sensorId}-${Date.now()}`,
        position: [alert.location.latitude, alert.location.longitude] as [number, number],
        type:     'sensor',
        severity: alert.metrics.isCritical ? 'critical' : 'high',
        data:     { title: alert.sensorType.replace('_', ' '), sensorId: alert.sensorId, value: alert.metrics.value, threshold: alert.metrics.threshold },
      },
    ]));
  });

  orchestrator.register<IoTAlert>('iot:alert:notify', (alert) => {
    store.dispatch(addNotification({
      type:    alert.metrics.isCritical ? 'error' : 'warning',
      title:   `${alert.metrics.isCritical ? '🚨 Critical' : '⚠️ Warning'}: ${alert.sensorType.replace('_', ' ')}`,
      message: `Sensor ${alert.sensorId} — ${alert.metrics.value} ${alert.metrics.unit} (threshold: ${alert.metrics.threshold})`,
      source:  'iot',
    }));
  });

  orchestrator.register<IoTAlert>('iot:alert:critical', (alert) => {
    auditService.log('IOT_ALERT_RECEIVED', {
      entityId:   alert.sensorId,
      entityType: 'sensor',
      payload:    { value: alert.metrics.value, escalated: true },
    });
    // Production: trigger SMS/email via backend API
    console.warn(`[Escalation] Critical alert — sensor ${alert.sensorId} at ${alert.location.address}`);
  });

  // ── Issue Handlers ────────────────────────────────────────────────────────

  orchestrator.register<IssueCreatedPayload>('issue:created', ({ issue, source }) => {
    auditService.log('CREATE_ISSUE', {
      entityId:   issue.issue_id,
      entityType: 'issue',
      userId:     issue.reported_by,
      payload:    { source, severity: issue.severity, category: issue.category },
    });
    store.dispatch(addNotification({
      type:    'info',
      title:   '📋 New Issue Reported',
      message: issue.title,
      source:  'issue',
    }));
  });

  orchestrator.register<IssueAssignedPayload>('issue:assigned', ({ issue, technicianId, userId }) => {
    store.dispatch(updateIssueStatus({ issueId: issue.issue_id, status: 'assigned', userId }));
    auditService.log('ASSIGN_TECHNICIAN', {
      entityId:   issue.issue_id,
      entityType: 'issue',
      userId,
      payload:    { technicianId },
    });
    store.dispatch(addNotification({
      type:    'info',
      title:   '👷 Issue Assigned',
      message: `"${issue.title}" assigned to technician`,
      source:  'issue',
    }));
  });

  orchestrator.register<IssueResolvedPayload>('issue:resolved', ({ issue, userId }) => {
    store.dispatch(updateIssueStatus({ issueId: issue.issue_id, status: 'resolved', userId }));
    // Remove marker from map
    const markers = store.getState().map.markers.filter(m => m.id !== issue.issue_id);
    store.dispatch(setMarkers(markers));
    store.dispatch(addNotification({
      type:    'success',
      title:   '✅ Issue Resolved',
      message: `"${issue.title}" has been resolved`,
      source:  'issue',
    }));
  });

  // ── User Action Handlers ──────────────────────────────────────────────────

  orchestrator.register<UserLoginPayload>('user:login', ({ userId, role }) => {
    auditService.log('USER_LOGIN', { userId, entityType: 'user', entityId: userId, payload: { role } });
  });

  orchestrator.register<UserLogoutPayload>('user:logout', ({ userId }) => {
    auditService.log('USER_LOGOUT', { userId, entityType: 'user', entityId: userId });
  });
}
