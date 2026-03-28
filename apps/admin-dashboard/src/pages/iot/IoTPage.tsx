import React from 'react';
import { DataTable, Badge } from '@citiscope/ui';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import type { IoTSensor } from '@citiscope/types';
import { titleCase, formatDate } from '@citiscope/ui';

const columns = [
  { key: 'sensor_id', header: 'Sensor ID' },
  { key: 'sensor_type', header: 'Type', render: (r: IoTSensor) => titleCase(r.sensor_type) },
  {
    key: 'status', header: 'Status',
    render: (r: IoTSensor) => (
      <Badge
        label={titleCase(r.status)}
        variant={r.status === 'active' ? 'success' : r.status === 'faulty' ? 'danger' : 'warning'}
        dot
      />
    ),
  },
  { key: 'last_update', header: 'Last Update', render: (r: IoTSensor) => formatDate(r.last_update) },
  {
    key: 'metrics', header: 'Value',
    render: (r: IoTSensor) => `${r.metrics.value} ${r.metrics.unit}${r.metrics.is_critical ? ' ⚠️' : ''}`,
  },
];

export const IoTPage: React.FC = () => {
  const sensors = useSelector((state: RootState) => state.iot.sensors);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ margin: 0 }}>IoT Sensors</h2>
      <DataTable
        columns={columns as never}
        data={sensors as never}
        keyField="sensor_id"
        emptyMessage="No sensors registered"
      />
    </div>
  );
};
