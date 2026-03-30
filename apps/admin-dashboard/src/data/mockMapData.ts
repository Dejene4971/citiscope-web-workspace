import { MapMarker } from '../features/map/mapSlice';

// Mock issues for Addis Ababa area
export const mockMarkers: MapMarker[] = [
  {
    id: '1',
    position: [9.011, 38.746],
    type: 'issue',
    severity: 'critical',
    data: {
      title: 'Burst Water Pipe',
      description: 'Major water leak on Bole Road',
      status: 'pending',
      reportedAt: '2024-03-28T10:00:00Z',
    },
  },
  {
    id: '2',
    position: [9.033, 38.765],
    type: 'issue',
    severity: 'high',
    data: {
      title: 'Large Pothole',
      description: 'Deep pothole causing traffic issues',
      status: 'verified',
      reportedAt: '2024-03-28T09:30:00Z',
    },
  },
  {
    id: '3',
    position: [9.045, 38.712],
    type: 'issue',
    severity: 'medium',
    data: {
      title: 'Street Light Outage',
      description: 'Multiple street lights not working',
      status: 'assigned',
      reportedAt: '2024-03-27T18:00:00Z',
    },
  },
  {
    id: '4',
    position: [9.022, 38.733],
    type: 'sensor',
    severity: 'critical',
    data: {
      title: 'Water Pressure Drop',
      description: 'IoT sensor detected abnormal pressure',
      sensorId: 'SEN-001',
      value: 12.5,
      threshold: 20,
    },
  },
  {
    id: '5',
    position: [9.008, 38.754],
    type: 'issue',
    severity: 'low',
    data: {
      title: 'Trash Accumulation',
      description: 'Waste collection needed',
      status: 'pending',
      reportedAt: '2024-03-28T08:00:00Z',
    },
  },
];

// Mock administrative boundaries (simplified GeoJSON)
export const mockBoundaries = [
  {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [38.71, 9.01],
        [38.73, 9.01],
        [38.73, 9.03],
        [38.71, 9.03],
        [38.71, 9.01],
      ]],
    },
    properties: {
      name: 'Bole Woreda',
      id: 'W-001',
      type: 'woreda',
    },
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [38.73, 9.01],
        [38.75, 9.01],
        [38.75, 9.03],
        [38.73, 9.03],
        [38.73, 9.01],
      ]],
    },
    properties: {
      name: 'Kirkos Woreda',
      id: 'W-002',
      type: 'woreda',
    },
  },
];