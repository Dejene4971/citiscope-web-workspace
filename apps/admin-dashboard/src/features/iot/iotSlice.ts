import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IoTAlert {
  id: string;
  sensorId: string;
  sensorType: 'water_pressure' | 'vibration' | 'electrical' | 'flood' | 'air_quality';
  location: {
    latitude: number;
    longitude: number;
    woredaId: string;
    address: string;
  };
  status: 'active' | 'inactive' | 'maintenance' | 'faulty';
  batteryLevel: number;
  lastUpdate: string;
  metrics: {
    value: number;
    unit: string;
    threshold: number;
    isCritical: boolean;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
  acknowledged: boolean;
}

export interface IoTState {
  sensors: IoTAlert[];
  activeAlerts: IoTAlert[];
  historicalAlerts: IoTAlert[];
  criticalCount: number;
  warningCount: number;
  lastUpdated: string;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: IoTState = {
  sensors: [],
  activeAlerts: [],
  historicalAlerts: [],
  criticalCount: 0,
  warningCount: 0,
  lastUpdated: new Date().toISOString(),
  isConnected: true,
  isLoading: false,
  error: null,
};

const iotSlice = createSlice({
  name: 'iot',
  initialState,
  reducers: {
    setSensors: (state, action: PayloadAction<IoTAlert[]>) => {
      state.sensors = action.payload;
      state.criticalCount = action.payload.filter(s => s.metrics.isCritical).length;
      state.warningCount = action.payload.filter(s => s.metrics.value > s.metrics.threshold * 0.8 && !s.metrics.isCritical).length;
      state.lastUpdated = new Date().toISOString();
    },
    addAlert: (state, action: PayloadAction<IoTAlert>) => {
      state.activeAlerts.unshift(action.payload);
      if (action.payload.metrics.isCritical) {
        state.criticalCount++;
      }
      if (action.payload.metrics.value > action.payload.metrics.threshold * 0.8 && !action.payload.metrics.isCritical) {
        state.warningCount++;
      }
    },
    acknowledgeAlert: (state, action: PayloadAction<string>) => {
      const alert = state.activeAlerts.find(a => a.id === action.payload);
      if (alert) {
        alert.acknowledged = true;
        if (alert.metrics.isCritical) {
          state.criticalCount--;
        } else {
          state.warningCount--;
        }
      }
    },
    clearAlerts: (state) => {
      state.activeAlerts = [];
      state.criticalCount = 0;
      state.warningCount = 0;
    },
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setSensors,
  addAlert,
  acknowledgeAlert,
  clearAlerts,
  setConnectionStatus,
  setLoading,
  setError,
} = iotSlice.actions;

export default iotSlice.reducer;