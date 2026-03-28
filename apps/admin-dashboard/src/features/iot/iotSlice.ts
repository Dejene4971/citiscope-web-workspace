import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { IoTSensor } from '@citiscope/types';

interface IoTState {
  sensors: IoTSensor[];
  isLoading: boolean;
}

const initialState: IoTState = {
  sensors: [],
  isLoading: false,
};

const iotSlice = createSlice({
  name: 'iot',
  initialState,
  reducers: {
    setSensors(state, action: PayloadAction<IoTSensor[]>) {
      state.sensors = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { setSensors, setLoading } = iotSlice.actions;
export default iotSlice.reducer;
