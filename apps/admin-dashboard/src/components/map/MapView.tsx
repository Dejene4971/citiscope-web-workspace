import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapContainer as LeafletMap, TileLayer, Marker, Popup, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, CircularProgress, Typography } from '@mui/material';
import type { RootState } from '../../store/store';
import { setSelectedMarker } from '../../features/map/mapSlice';
import type { MapMarker } from '../../features/map/mapSlice';

// Fix Leaflet default icon paths (broken by bundlers)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// ── Helpers ──────────────────────────────────────────────────────────────────

const getMarkerColor = (severity?: string) => {
  switch (severity) {
    case 'critical': return '#f44336';
    case 'high':     return '#ff9800';
    case 'medium':   return '#ffc107';
    case 'low':      return '#4caf50';
    default:         return '#1976d2';
  }
};

const getMarkerIcon = (severity?: string) => {
  const color = getMarkerColor(severity);
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 14px; height: 14px;
      background-color: ${color};
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 1px 4px rgba(0,0,0,0.35);
      cursor: pointer;
    "></div>`,
    iconSize: [14, 14],
    popupAnchor: [0, -7],
  });
};

// Syncs map view when Redux state changes
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => { map.setView(center, zoom); }, [center, zoom, map]);
  return null;
};

// ── Component ─────────────────────────────────────────────────────────────────

interface MapViewProps {
  height?: string | number;
}

export const MapView: React.FC<MapViewProps> = ({ height = '500px' }) => {
  const dispatch = useDispatch();
  const { markers, boundaries, viewState } = useSelector((s: RootState) => s.map);
  const [ready, setReady] = useState(false);

  useEffect(() => { setReady(true); }, []);

  if (!ready) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height }}>
        <CircularProgress size={32} />
        <Typography sx={{ ml: 2 }}>Loading map…</Typography>
      </Box>
    );
  }

  const issueMarkers  = markers.filter((m: MapMarker) => m.type === 'issue');
  const sensorMarkers = markers.filter((m: MapMarker) => m.type === 'sensor');

  return (
    <LeafletMap
      center={viewState.center}
      zoom={viewState.zoom}
      style={{ height, width: '100%', borderRadius: 8 }}
    >
      <MapController center={viewState.center} zoom={viewState.zoom} />

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Administrative boundaries */}
      {viewState.visibleLayers.boundaries && boundaries.map((boundary: any, i: number) => (
        <GeoJSON
          key={`boundary-${i}`}
          data={boundary}
          style={{ color: '#1976d2', weight: 2, fillOpacity: 0.08, fillColor: '#1976d2' }}
        />
      ))}

      {/* Issue markers */}
      {viewState.visibleLayers.issues && issueMarkers.map((marker: MapMarker) => (
        <Marker
          key={marker.id}
          position={marker.position}
          icon={getMarkerIcon(marker.severity)}
          eventHandlers={{ click: () => dispatch(setSelectedMarker(marker.id)) }}
        >
          <Popup>
            <div style={{ minWidth: 200 }}>
              <strong>{marker.data.title ?? 'Infrastructure Issue'}</strong>
              <p style={{ margin: '6px 0', fontSize: 12 }}>{marker.data.description ?? '—'}</p>
              <div style={{ fontSize: 11, color: '#555' }}>
                <div>Status: {marker.data.status ?? 'Unknown'}</div>
                <div>Severity: {marker.severity?.toUpperCase() ?? 'N/A'}</div>
                {marker.data.reportedAt && (
                  <div>Reported: {new Date(marker.data.reportedAt).toLocaleDateString()}</div>
                )}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* IoT sensor markers */}
      {viewState.visibleLayers.sensors && sensorMarkers.map((marker: MapMarker) => (
        <Marker
          key={marker.id}
          position={marker.position}
          icon={getMarkerIcon(marker.severity)}
          eventHandlers={{ click: () => dispatch(setSelectedMarker(marker.id)) }}
        >
          <Popup>
            <div>
              <strong>🔌 IoT Sensor Alert</strong>
              <p style={{ margin: '6px 0' }}>{marker.data.title}</p>
              <small>Sensor ID: {marker.data.sensorId}</small><br />
              <small>Value: {marker.data.value} / Threshold: {marker.data.threshold}</small>
            </div>
          </Popup>
        </Marker>
      ))}
    </LeafletMap>
  );
};
