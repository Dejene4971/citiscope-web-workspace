import { orchestrator } from './workflowOrchestrator';
import { auditService } from './auditService';
import { store } from '../store/store';
import { addNotification } from '../features/ui/uiSlice';
import { setMarkers } from '../features/map/mapSlice';
import type { IoTAlert } from '../features/iot/iotSlice';

/**
 * Additional IoT workflow handlers — registered on top of the built-in ones
 * in workflowOrchestrator.ts. Call registerIoTWorkflows() once at app startup.
 */
export function registerIoTWorkflows(): void {

  // Handler: Add map marker for every alert
  orchestrator.register<IoTAlert>('iot:alert:addMarker', (alert) => {
    const state = store.getState();
    const existing = state.map.markers;
    store.dispatch(setMarkers([
      ...existing,
      {
        id: `marker-${alert.sensorId}-${Date.now()}`,
        position: [alert.location.latitude, alert.location.longitude] as [number, number],
        type: 'sensor',
        severity: alert.metrics.isCritical ? 'critical' : 'high',
        data: {
          title: `${alert.sensorType.replace('_', ' ')} alert`,
          sensorId: alert.sensorId,
          value: alert.metrics.value,
          threshold: alert.metrics.threshold,
        },
      },
    ]));
  });

  // Handler: Notify woreda admin
  orchestrator.register<IoTAlert>('iot:alert:notify', (alert) => {
    store.dispatch(addNotification({
      type: alert.metrics.isCritical ? 'error' : 'warning',
      title: `${alert.metrics.isCritical ? '🚨 Critical' : '⚠️ Warning'}: ${alert.sensorType.replace('_', ' ')}`,
      message: `Sensor ${alert.sensorId} — value ${alert.metrics.value} ${alert.metrics.unit} (threshold: ${alert.metrics.threshold})`,
      source: 'iot',
    }));
  });

  // Handler: Escalate critical alerts
  orchestrator.register<IoTAlert>('iot:alert:critical', (alert) => {
    if (!alert.metrics.isCritical) return;

    auditService.log('IOT_ALERT_RECEIVED', {
      entityId: alert.sensorId,
      entityType: 'sensor',
      payload: {
        value: alert.metrics.value,
        threshold: alert.metrics.threshold,
        escalated: true,
      },
    });

    // Placeholder: in production, trigger SMS/email via backend API
    console.warn(`[Escalation] Critical alert for sensor ${alert.sensorId} at ${alert.location.address}`);
  });
}
