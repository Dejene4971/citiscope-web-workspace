// services/iotIngestionService.ts
import { orchestrator } from './workflowOrchestrator';
import { auditService } from './auditService';
import type { IoTAlert } from '../features/iot/iotSlice';

interface SensorThreshold {
  min?: number;
  max?: number;
  warningThreshold: number;
  criticalThreshold: number;
}

const SENSOR_THRESHOLDS: Record<string, SensorThreshold> = {
  water_pressure: { min: 20, max: 60, warningThreshold: 35, criticalThreshold: 45 },
  vibration: { max: 10, warningThreshold: 5, criticalThreshold: 8 },
  electrical: { max: 150, warningThreshold: 100, criticalThreshold: 130 },
  flood: { max: 50, warningThreshold: 30, criticalThreshold: 40 },
  air_quality: { max: 200, warningThreshold: 100, criticalThreshold: 150 },
};

interface ProcessedAlert extends IoTAlert {
  severity: 'low' | 'medium' | 'high' | 'critical';
  requiresIssue: boolean;
  requiresNotification: boolean;
  requiresMapMarker: boolean;
}

/**
 * IoT Ingestion Service
 *
 * Single entry point for all incoming IoT data.
 * Handles threshold detection, duplicate prevention, and escalation.
 */
class IoTIngestionService {
  private processingQueue: IoTAlert[] = [];
  private isProcessing = false;
  private recentAlerts: Map<string, number> = new Map(); // sensorId -> lastAlertTimestamp
  private readonly DUPLICATE_WINDOW_MS = 60000; // 1 minute
  private readonly ESCALATION_INTERVAL_MS = 300000; // 5 minutes
  private escalationInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.startEscalationChecker();
  }

  /**
   * Ingest a single IoT alert through the workflow pipeline
   */
  async ingest(alert: IoTAlert): Promise<void> {
    // Check for duplicate alerts
    if (this.isDuplicate(alert)) {
      console.log(`[IoTIngestion] Duplicate alert ignored: ${alert.sensorId}`);
      auditService.log('IOT_ALERT_RECEIVED', {
        entityId: alert.sensorId,
        entityType: 'sensor',
        payload: { value: alert.metrics.value, duplicate: true },
      });
      return;
    }

    this.recordAlert(alert);
    this.processingQueue.push(alert);
    
    if (!this.isProcessing) {
      await this.processQueue();
    }
  }

  /**
   * Ingest a batch of alerts (e.g., from WebSocket reconnect)
   */
  async ingestBatch(alerts: IoTAlert[]): Promise<void> {
    const uniqueAlerts = alerts.filter(alert => !this.isDuplicate(alert));
    this.processingQueue.push(...uniqueAlerts);
    uniqueAlerts.forEach(alert => this.recordAlert(alert));
    
    if (!this.isProcessing) {
      await this.processQueue();
    }
  }

  /**
   * Simulate a real-time sensor reading for demo/testing
   */
  simulateAlert(overrides: Partial<IoTAlert> = {}): void {
    const sensorType = overrides.sensorType ?? 'water_pressure';
    const thresholds = SENSOR_THRESHOLDS[sensorType];
    const randomValue = thresholds 
      ? thresholds.min 
        ? thresholds.min + Math.random() * (thresholds.max || thresholds.criticalThreshold * 1.5)
        : Math.random() * (thresholds.max || 100)
      : Math.random() * 100;
    
    const isCritical = thresholds 
      ? randomValue > thresholds.criticalThreshold
      : randomValue > 80;
    
    const mock: IoTAlert = {
      id: `SIM-${Date.now()}`,
      sensorId: overrides.sensorId ?? `SEN-${Math.floor(Math.random() * 100)}`,
      sensorType: sensorType,
      location: overrides.location ?? {
        latitude: 9.01 + (Math.random() - 0.5) * 0.1,
        longitude: 38.71 + (Math.random() - 0.5) * 0.1,
        woredaId: `W-${Math.floor(Math.random() * 10) + 1}`,
        address: `Sensor Location ${Math.floor(Math.random() * 100)}`,
      },
      status: 'active',
      batteryLevel: Math.floor(20 + Math.random() * 80),
      lastUpdate: new Date().toISOString(),
      metrics: {
        value: parseFloat(randomValue.toFixed(1)),
        unit: overrides.metrics?.unit ?? (sensorType === 'water_pressure' ? 'psi' : 
               sensorType === 'vibration' ? 'mm/s' :
               sensorType === 'electrical' ? 'A' :
               sensorType === 'flood' ? 'cm' : 'AQI'),
        threshold: thresholds?.warningThreshold ?? 50,
        isCritical: overrides.metrics?.isCritical ?? isCritical,
        trend: Math.random() > 0.7 ? 'increasing' : Math.random() > 0.5 ? 'decreasing' : 'stable',
      },
      acknowledged: false,
      ...overrides,
    };
    
    console.log(`[IoTIngestion] Simulated alert: ${mock.sensorType} = ${mock.metrics.value} ${mock.metrics.unit}`);
    this.ingest(mock);
  }

  /**
   * Process the alert queue - determines severity and triggers appropriate actions
   */
  private async processQueue(): Promise<void> {
    this.isProcessing = true;
    
    while (this.processingQueue.length > 0) {
      const alert = this.processingQueue.shift()!;
      
      try {
        const processed = this.enrichAlert(alert);
        
        // Log receipt
        auditService.log('IOT_ALERT_RECEIVED', {
          entityId: alert.sensorId,
          entityType: 'sensor',
          payload: { 
            value: alert.metrics.value, 
            threshold: alert.metrics.threshold,
            severity: processed.severity,
          },
        });

        // Trigger orchestrator for each required action
        if (processed.requiresIssue) {
          await orchestrator.trigger('iot:alert:createIssue', processed);
        }
        
        if (processed.requiresNotification) {
          await orchestrator.trigger('iot:alert:notify', processed);
        }
        
        if (processed.requiresMapMarker) {
          await orchestrator.trigger('iot:alert:addMarker', processed);
        }
        
        // Special handling for critical alerts
        if (processed.severity === 'critical') {
          await orchestrator.trigger('iot:alert:critical', processed);
        }
        
      } catch (err) {
        console.error('[IoTIngestion] Failed to process alert:', alert.sensorId, err);
        auditService.log('IOT_ALERT_RECEIVED', {
          entityId: alert.sensorId,
          entityType: 'sensor',
          payload: { error: String(err), value: alert.metrics.value },
        });
      }
    }
    
    this.isProcessing = false;
  }

  /**
   * Enrich alert with severity and action flags
   */
  private enrichAlert(alert: IoTAlert): ProcessedAlert {
    const thresholds = SENSOR_THRESHOLDS[alert.sensorType];
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
    
    if (thresholds) {
      const value = alert.metrics.value;
      if (value >= thresholds.criticalThreshold) {
        severity = 'critical';
      } else if (value >= thresholds.warningThreshold) {
        severity = 'high';
      } else if (value >= thresholds.warningThreshold * 0.7) {
        severity = 'medium';
      } else {
        severity = 'low';
      }
    } else if (alert.metrics.isCritical) {
      severity = 'critical';
    } else if (alert.metrics.value > alert.metrics.threshold) {
      severity = 'high';
    }
    
    // Determine required actions
    const requiresIssue = severity === 'critical' || severity === 'high';
    const requiresNotification = severity !== 'low';
    const requiresMapMarker = true; // Always show on map
    
    return {
      ...alert,
      severity,
      requiresIssue,
      requiresNotification,
      requiresMapMarker,
    };
  }

  /**
   * Check if alert is duplicate (same sensor within time window)
   */
  private isDuplicate(alert: IoTAlert): boolean {
    const lastTimestamp = this.recentAlerts.get(alert.sensorId);
    if (!lastTimestamp) return false;
    
    const now = Date.now();
    const timeDiff = now - lastTimestamp;
    return timeDiff < this.DUPLICATE_WINDOW_MS;
  }

  /**
   * Record alert timestamp for duplicate detection
   */
  private recordAlert(alert: IoTAlert): void {
    this.recentAlerts.set(alert.sensorId, Date.now());
    
    // Clean up old entries periodically
    if (this.recentAlerts.size > 1000) {
      const cutoff = Date.now() - this.DUPLICATE_WINDOW_MS * 2;
      for (const [sensorId, timestamp] of this.recentAlerts.entries()) {
        if (timestamp < cutoff) {
          this.recentAlerts.delete(sensorId);
        }
      }
    }
  }

  /**
   * Check for unacknowledged critical alerts and escalate
   */
  private startEscalationChecker(): void {
    this.escalationInterval = setInterval(async () => {
      // This would check database for unacknowledged critical alerts
      // and send escalation notifications
      console.log('[IoTIngestion] Running escalation check...');
    }, this.ESCALATION_INTERVAL_MS);
  }

  /**
   * Stop escalation checker (cleanup)
   */
  stopEscalationChecker(): void {
    if (this.escalationInterval) {
      clearInterval(this.escalationInterval);
      this.escalationInterval = null;
    }
  }

  /**
   * Get current queue size (for monitoring)
   */
  getQueueSize(): number {
    return this.processingQueue.length;
  }

  /**
   * Get sensor health summary
   */
  getSensorHealth(): { total: number; active: number; lowBattery: number; critical: number } {
    // This would aggregate from database
    // Placeholder for now
    return { total: 0, active: 0, lowBattery: 0, critical: 0 };
  }
}

// Export singleton instance
export const iotIngestionService = new IoTIngestionService();