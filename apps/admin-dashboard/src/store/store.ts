import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import issuesReducer from '../features/issues/issuesSlice';
import iotReducer from '../features/iot/iotSlice';
import mapReducer from '../features/map/mapSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    issues: issuesReducer,
    iot: iotReducer,
    map: mapReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
