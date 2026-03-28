import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import issuesReducer from './slices/issuesSlice';
import mapReducer from './slices/mapSlice';
import iotReducer from './slices/iotSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    issues: issuesReducer,
    map: mapReducer,
    iot: iotReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
