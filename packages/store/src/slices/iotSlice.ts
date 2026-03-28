import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { IoTSensor, IoTAlert } from '@citiscope/types';

interface IoTState {
  sensors: IoTSensor[];
  alerts: IoTAlert[];
  isLoading: boolean;
  error: string | null;
}

const initialState: IoTState = {
  sensors: [],
  alerts: [],
  isLoading: false,
  error: null,
};

const iotSlice = createSlice({
  name: 'iot',
  initialState,
  reducers: {
    setSensors(state, action: PayloadAction<IoTSensor[]>) {
      state.sensors = action.payload;
    },
    setAlerts(state, action: PayloadAction<IoTAlert[]>) {
      state.alerts = action.payload;
    },
    acknowledgeAlert(state, action: PayloadAction<string>) {
      const alert = state.alerts.find(a => a.alert_id === action.payload);
      if (alert) alert.acknowledged = true;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setSensors, setAlerts, acknowledgeAlert, setLoading, setError } = iotSlice.actions;
export default iotSlice.reducer;
