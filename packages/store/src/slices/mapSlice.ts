import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { MapViewState } from '@citiscope/types';

interface MapState extends MapViewState {
  selectedUnitId: string | null;
  showHeatmap: boolean;
  showClusters: boolean;
}

const initialState: MapState = {
  center: [9.145, 40.489],  // Ethiopia centroid
  zoom: 6,
  selectedUnitId: null,
  showHeatmap: false,
  showClusters: true,
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setView(state, action: PayloadAction<Partial<MapViewState>>) {
      Object.assign(state, action.payload);
    },
    selectUnit(state, action: PayloadAction<string | null>) {
      state.selectedUnitId = action.payload;
    },
    toggleHeatmap(state) {
      state.showHeatmap = !state.showHeatmap;
    },
    toggleClusters(state) {
      state.showClusters = !state.showClusters;
    },
  },
});

export const { setView, selectUnit, toggleHeatmap, toggleClusters } = mapSlice.actions;
export default mapSlice.reducer;
