import React from 'react';
import { Marker as LeafletMarker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Issue } from '@citiscope/types';

const severityColors: Record<string, string> = {
  low: '#4caf50',
  medium: '#ff9800',
  high: '#f44336',
  critical: '#9c27b0',
};

function makeIcon(color: string) {
  return L.divIcon({
    className: '',
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

interface IssueMarkerProps {
  issue: Issue;
  onClick?: (issue: Issue) => void;
}

/** Map marker for a single issue, colour-coded by severity. */
export const IssueMarker: React.FC<IssueMarkerProps> = ({ issue, onClick }) => (
  <LeafletMarker
    position={[issue.location.latitude, issue.location.longitude]}
    icon={makeIcon(severityColors[issue.severity] ?? '#999')}
    eventHandlers={{ click: () => onClick?.(issue) }}
  >
    <Popup>
      <strong>{issue.title}</strong>
      <br />
      {issue.category} · {issue.severity}
    </Popup>
  </LeafletMarker>
);
