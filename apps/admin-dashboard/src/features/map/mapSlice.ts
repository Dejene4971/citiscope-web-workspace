import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MapMarker {
  id: string;
  position: [number, number];
  type: 'issue' | 'sensor' | 'technician';
  severity?: 'low' | 'medium' | 'high' | 'critical';
  data: {
    title?: string;
    description?: string;
    status?: string;
    reportedAt?: string;
    sensorId?: string;
    value?: number;
    threshold?: number;
  };
}

interface MapViewState {
  center: [number, number];
  zoom: number;
  visibleLayers: {
    issues: boolean;
    sensors: boolean;
    boundaries: boolean;
  };
}

interface MapState {
  markers: MapMarker[];
  boundaries: any[];
  selectedMarkerId: string | null;
  viewState: MapViewState;
}

const initialState: MapState = {
  markers: [],
  boundaries: [],
  selectedMarkerId: null,
  viewState: {
    center: [9.03, 38.74],
    zoom: 12,
    visibleLayers: {
      issues: true,
      sensors: true,
      boundaries: true,
    },
  },
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setMarkers(state, action: PayloadAction<MapMarker[]>) {
      state.markers = action.payload;
    },
    setBoundaries(state, action: PayloadAction<any[]>) {
      state.boundaries = action.payload;
    },
    setSelectedMarker(state, action: PayloadAction<string | null>) {
      state.selectedMarkerId = action.payload;
    },
    toggleLayer(state, action: PayloadAction<keyof MapViewState['visibleLayers']>) {
      state.viewState.visibleLayers[action.payload] = !state.viewState.visibleLayers[action.payload];
    },
    setView(state, action: PayloadAction<Partial<Pick<MapViewState, 'center' | 'zoom'>>>) {
      Object.assign(state.viewState, action.payload);
    },
  },
});

export const { setMarkers, setBoundaries, setSelectedMarker, toggleLayer, setView } = mapSlice.actions;
export default mapSlice.reducer;
