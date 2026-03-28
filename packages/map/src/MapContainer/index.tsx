import React from 'react';
import { MapContainer as LeafletMapContainer, TileLayer } from 'react-leaflet';
import type { MapViewState } from '@citiscope/types';
import 'leaflet/dist/leaflet.css';

interface MapContainerProps extends Partial<MapViewState> {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

/** Base map container centred on Ethiopia by default. */
export const MapContainer: React.FC<MapContainerProps> = ({
  center = [9.145, 40.489],
  zoom = 6,
  children,
  style,
  className,
}) => (
  <LeafletMapContainer
    center={center}
    zoom={zoom}
    style={{ height: '100%', width: '100%', ...style }}
    className={className}
  >
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {children}
  </LeafletMapContainer>
);
