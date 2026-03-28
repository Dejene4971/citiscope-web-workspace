export type AdminLevel = 'federal' | 'regional' | 'zonal' | 'woreda';

export interface AdminUnit {
  unit_id: string;
  name: string;
  level: AdminLevel;
  parent_id?: string;
  centroid: { latitude: number; longitude: number };
  boundary?: GeoJSON.Geometry;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapViewState {
  center: [number, number];
  zoom: number;
  bounds?: MapBounds;
}
