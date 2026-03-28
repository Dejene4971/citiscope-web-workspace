import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@citiscope/store';
import { setView, selectUnit, toggleHeatmap, toggleClusters } from '@citiscope/store';
import type { MapViewState } from '@citiscope/types';

/** Access map view state and controls. */
export function useMap() {
  const dispatch = useDispatch<AppDispatch>();
  const map = useSelector((state: RootState) => state.map);

  return {
    ...map,
    setView: (v: Partial<MapViewState>) => dispatch(setView(v)),
    selectUnit: (id: string | null) => dispatch(selectUnit(id)),
    toggleHeatmap: () => dispatch(toggleHeatmap()),
    toggleClusters: () => dispatch(toggleClusters()),
  };
}
