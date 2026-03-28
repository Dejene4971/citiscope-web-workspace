export type SensorType = 'water_pressure' | 'vibration' | 'electrical' | 'flood' | 'air_quality';
export type SensorStatus = 'active' | 'inactive' | 'maintenance' | 'faulty';

export interface SensorMetrics {
  value: number;
  unit: string;
  threshold: number;
  is_critical: boolean;
}

export interface IoTSensor {
  sensor_id: string;
  sensor_type: SensorType;
  status: SensorStatus;
  latitude: number;
  longitude: number;
  last_update: string;
  metrics: SensorMetrics;
  location: {
    woreda_id: string;
    address: string;
  };
}

export interface IoTAlert {
  alert_id: string;
  sensor_id: string;
  sensor_type: SensorType;
  message: string;
  severity: 'warning' | 'critical';
  triggered_at: string;
  acknowledged: boolean;
}
