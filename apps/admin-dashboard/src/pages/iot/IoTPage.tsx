import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Chip, Grid,
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer,
} from '@mui/material';
import { Sensors, Warning, CheckCircle, Build } from '@mui/icons-material';
import { setSensors } from '../../features/iot/iotSlice';
import type { RootState, AppDispatch } from '../../store/store';
import type { IoTSensor } from '@citiscope/types';

const MOCK_SENSORS: IoTSensor[] = [
  { sensor_id: 'SEN-001', sensor_type: 'water_pressure', status: 'active',      latitude: 9.011, longitude: 38.746, last_update: '2026-03-28T10:00:00Z', metrics: { value: 12.5, unit: 'bar',  threshold: 20,  is_critical: true  }, location: { woreda_id: 'W-001', address: 'Bole Road' } },
  { sensor_id: 'SEN-002', sensor_type: 'vibration',      status: 'active',      latitude: 9.033, longitude: 38.765, last_update: '2026-03-28T09:45:00Z', metrics: { value: 3.2,  unit: 'mm/s', threshold: 5,   is_critical: false }, location: { woreda_id: 'W-002', address: 'Meskel Square' } },
  { sensor_id: 'SEN-003', sensor_type: 'electrical',     status: 'faulty',      latitude: 9.045, longitude: 38.712, last_update: '2026-03-27T18:00:00Z', metrics: { value: 0,    unit: 'V',    threshold: 220, is_critical: true  }, location: { woreda_id: 'W-003', address: 'Kazanchis' } },
  { sensor_id: 'SEN-004', sensor_type: 'flood',          status: 'active',      latitude: 9.022, longitude: 38.733, last_update: '2026-03-28T08:30:00Z', metrics: { value: 0.4,  unit: 'm',    threshold: 1,   is_critical: false }, location: { woreda_id: 'W-001', address: 'Piassa' } },
  { sensor_id: 'SEN-005', sensor_type: 'air_quality',    status: 'maintenance', latitude: 9.008, longitude: 38.754, last_update: '2026-03-26T12:00:00Z', metrics: { value: 85,   unit: 'AQI',  threshold: 100, is_critical: false }, location: { woreda_id: 'W-004', address: 'Merkato' } },
];

const STATUS_COLOR: Record<string, 'success' | 'error' | 'warning' | 'default'> = {
  active: 'success', faulty: 'error', maintenance: 'warning', inactive: 'default',
};

export const IoTPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const sensors = useSelector((s: RootState) => s.iot.sensors) as IoTSensor[];

  useEffect(() => { dispatch(setSensors(MOCK_SENSORS)); }, [dispatch]);

  const active   = sensors.filter(s => s.status === 'active').length;
  const faulty   = sensors.filter(s => s.status === 'faulty').length;
  const critical = sensors.filter(s => s.metrics.is_critical).length;

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>IoT Sensors</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Real-time infrastructure sensor monitoring across Addis Ababa
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total',    value: sensors.length, icon: <Sensors />,     color: '#1976d2' },
          { label: 'Active',   value: active,          icon: <CheckCircle />, color: '#2e7d32' },
          { label: 'Faulty',   value: faulty,          icon: <Build />,       color: '#ed6c02' },
          { label: 'Critical', value: critical,         icon: <Warning />,     color: '#d32f2f' },
        ].map(c => (
          <Grid item xs={6} sm={3} key={c.label}>
            <Paper sx={{ p: 2, borderLeft: `4px solid ${c.color}`, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: c.color, mb: 0.5 }}>
                {c.icon}
                <Typography variant="body2" color="text.secondary">{c.label}</Typography>
              </Box>
              <Typography variant="h4" fontWeight={700}>{c.value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ background: '#f9fafb' }}>
              {['Sensor ID', 'Type', 'Status', 'Value', 'Threshold', 'Alert', 'Last Update', 'Location'].map(h => (
                <TableCell key={h} sx={{ fontWeight: 700 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sensors.map(s => (
              <TableRow key={s.sensor_id} hover>
                <TableCell>{s.sensor_id}</TableCell>
                <TableCell>{s.sensor_type.replace('_', ' ')}</TableCell>
                <TableCell><Chip label={s.status} size="small" color={STATUS_COLOR[s.status]} /></TableCell>
                <TableCell>{s.metrics.value} {s.metrics.unit}</TableCell>
                <TableCell>{s.metrics.threshold} {s.metrics.unit}</TableCell>
                <TableCell>
                  {s.metrics.is_critical
                    ? <Chip label="⚠️ Critical" size="small" color="error" />
                    : <Chip label="Normal" size="small" color="success" />}
                </TableCell>
                <TableCell>{new Date(s.last_update).toLocaleDateString()}</TableCell>
                <TableCell>{s.location.address}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
