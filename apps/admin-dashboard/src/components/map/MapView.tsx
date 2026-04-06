import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapContainer as LeafletMap, TileLayer, Marker, Popup, GeoJSON, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { Box, CircularProgress, Typography, Switch, FormControlLabel, Paper } from '@mui/material';
import { RootState } from '../../store/store';
import { setSelectedMarker } from '../../features/map/mapSlice';

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const getMarkerColor = (severity?: string) => {
  switch (severity) {
    case 'critical': return '#f44336';
    case 'high': return '#ff9800';
    case 'medium': return '#ffc107';
    case 'low': return '#4caf50';
    default: return '#1976d2';
  }
};

const getMarkerIcon = (severity?: string) => {
  const color = getMarkerColor(severity);
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 14px; 
      height: 14px; 
      background-color: ${color}; 
      border-radius: 50%; 
      border: 2px solid white;
      box-shadow: 0 1px 4px rgba(0,0,0,0.3);
      cursor: pointer;
    "></div>`,
    iconSize: [14, 14],
    popupAnchor: [0, -7],
  });
};

// Custom cluster icon
const createClusterIcon = (cluster: any) => {
  const count = cluster.getChildCount();
  let color = '#1976d2';
  if (count > 50) color = '#f44336';
  else if (count > 20) color = '#ff9800';
  else if (count > 10) color = '#ffc107';
  
  return L.divIcon({
    html: `<div style="
      width: 40px;
      height: 40px;
      background-color: ${color};
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 14px;
      border: 2px solid white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    ">${count}</div>`,
    className: 'custom-cluster',
    iconSize: [40, 40],
  });
};

interface MapViewProps {
  height?: string | number;
}

export const MapView: React.FC<MapViewProps> = ({ height = '500px' }) => {
  const dispatch = useDispatch();
  const { markers, boundaries, viewState } = useSelector((state: RootState) => state.map);
  const [showClusters, setShowClusters] = useState(true);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    setIsMapReady(true);
  }, []);

  const handleMarkerClick = (marker: any) => {
    dispatch(setSelectedMarker(marker.id));
  };

  if (!isMapReady) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading map...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', height }}>
      <Paper sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1000, p: 1 }}>
        <FormControlLabel
          control={<Switch size="small" checked={showClusters} onChange={(e) => setShowClusters(e.target.checked)} />}
          label="Enable Clustering"
        />
      </Paper>
      
      <LeafletMap
        center={viewState.center}
        zoom={viewState.zoom}
        style={{ height: '100%', width: '100%', borderRadius: '8px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Render boundaries */}
        {viewState.visibleLayers.boundaries && boundaries.map((boundary, index) => (
          <GeoJSON
            key={`boundary-${index}`}
            data={boundary}
            style={{
              color: '#1976d2',
              weight: 2,
              fillOpacity: 0.1,
              fillColor: '#1976d2',
            }}
          />
        ))}
        
        {/* Render markers with clustering */}
        {showClusters ? (
          <MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterIcon}>
            {viewState.visibleLayers.issues && markers
              .filter(m => m.type === 'issue')
              .map((marker) => (
                <Marker
                  key={marker.id}
                  position={marker.position}
                  icon={getMarkerIcon(marker.severity)}
                  eventHandlers={{
                    click: () => handleMarkerClick(marker),
                  }}
                >
                  <Popup>
                    <div style={{ minWidth: '200px' }}>
                      <strong>{marker.data?.title || 'Infrastructure Issue'}</strong>
                      <p style={{ margin: '8px 0', fontSize: '12px' }}>
                        {marker.data?.description || 'No description'}
                      </p>
                      <div style={{ fontSize: '11px', color: '#666' }}>
                        <div>Status: {marker.data?.status || 'Unknown'}</div>
                        <div>Severity: {marker.severity?.toUpperCase() || 'N/A'}</div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            
            {viewState.visibleLayers.sensors && markers
              .filter(m => m.type === 'sensor')
              .map((marker) => (
                <Marker
                  key={marker.id}
                  position={marker.position}
                  icon={getMarkerIcon('critical')}
                  eventHandlers={{
                    click: () => handleMarkerClick(marker),
                  }}
                >
                  <Popup>
                    <div>
                      <strong>🔌 IoT Sensor Alert</strong>
                      <p>{marker.data?.title}</p>
                      <small>Sensor ID: {marker.data?.sensorId}</small>
                    </div>
                  </Popup>
                </Marker>
              ))}
          </MarkerClusterGroup>
        ) : (
          <>
            {viewState.visibleLayers.issues && markers
              .filter(m => m.type === 'issue')
              .map((marker) => (
                <Marker
                  key={marker.id}
                  position={marker.position}
                  icon={getMarkerIcon(marker.severity)}
                  eventHandlers={{
                    click: () => handleMarkerClick(marker),
                  }}
                >
                  <Popup>{/* ... */}</Popup>
                </Marker>
              ))}
          </>
        )}
      </LeafletMap>
    </Box>
  );
};