import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Alert,
  Button,
} from '@mui/material';
import {
  Sensors as SensorsIcon,
  WaterDrop as WaterIcon,
  Vibration as VibrationIcon,
  Bolt as BoltIcon,
  Flood as FloodIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

// Mock IoT sensor data
const mockSensors = [
  {
    id: 'SEN-001',
    type: 'water_pressure',
    location: 'Bole Woreda, Addis Ababa',
    status: 'active',
    battery: 87,
    lastUpdate: '2024-03-31T14:30:00Z',
    metrics: { value: 42, unit: 'psi', threshold: 35, isCritical: true },
  },
  {
    id: 'SEN-002',
    type: 'vibration',
    location: 'Kirkos Woreda, Addis Ababa',
    status: 'active',
    battery: 92,
    lastUpdate: '2024-03-31T14:28:00Z',
    metrics: { value: 2.3, unit: 'mm/s', threshold: 5, isCritical: false },
  },
  {
    id: 'SEN-003',
    type: 'electrical',
    location: 'Yeka Woreda, Addis Ababa',
    status: 'maintenance',
    battery: 45,
    lastUpdate: '2024-03-31T12:00:00Z',
    metrics: { value: 0, unit: 'A', threshold: 100, isCritical: false },
  },
  {
    id: 'SEN-004',
    type: 'flood',
    location: 'Gulele Woreda, Addis Ababa',
    status: 'active',
    battery: 78,
    lastUpdate: '2024-03-31T14:32:00Z',
    metrics: { value: 15, unit: 'cm', threshold: 30, isCritical: false },
  },
  {
    id: 'SEN-005',
    type: 'water_pressure',
    location: 'Lideta Woreda, Addis Ababa',
    status: 'faulty',
    battery: 12,
    lastUpdate: '2024-03-30T08:00:00Z',
    metrics: { value: 0, unit: 'psi', threshold: 35, isCritical: true },
  },
];

const getSensorIcon = (type: string) => {
  switch (type) {
    case 'water_pressure': return <WaterIcon />;
    case 'vibration': return <VibrationIcon />;
    case 'electrical': return <BoltIcon />;
    case 'flood': return <FloodIcon />;
    default: return <SensorsIcon />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'success';
    case 'maintenance': return 'warning';
    case 'faulty': return 'error';
    default: return 'default';
  }
};

const getBatteryColor = (level: number) => {
  if (level > 50) return 'success';
  if (level > 20) return 'warning';
  return 'error';
};

export const IoTPage: React.FC = () => {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);

  const activeSensors = mockSensors.filter(s => s.status === 'active').length;
  const criticalAlerts = mockSensors.filter(s => s.metrics.isCritical).length;
  const lowBattery = mockSensors.filter(s => s.battery < 30).length;

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            IoT Sensor Network
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Real-time monitoring of critical infrastructure sensors
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControlLabel
            control={<Switch checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />}
            label="Auto-refresh"
          />
          <Button variant="outlined" startIcon={<RefreshIcon />} size="small">
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" color="text.secondary">Active Sensors</Typography>
                <SensorsIcon color="primary" />
              </Box>
              <Typography variant="h4">{activeSensors}</Typography>
              <Typography variant="caption" color="text.secondary">of {mockSensors.length} total</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderTop: '3px solid #f44336' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" color="text.secondary">Critical Alerts</Typography>
                <WarningIcon color="error" />
              </Box>
              <Typography variant="h4" color="error.main">{criticalAlerts}</Typography>
              <Typography variant="caption">Requires immediate attention</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderTop: '3px solid #ff9800' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" color="text.secondary">Low Battery</Typography>
                <ErrorIcon color="warning" />
              </Box>
              <Typography variant="h4" color="warning.main">{lowBattery}</Typography>
              <Typography variant="caption">Need maintenance</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" color="text.secondary">Network Uptime</Typography>
                <CheckCircleIcon color="success" />
              </Box>
              <Typography variant="h4">98.5%</Typography>
              <Typography variant="caption">Last 24 hours</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Critical Alerts Section */}
      {criticalAlerts > 0 && (
        <Alert severity="error" sx={{ mb: 3 }} icon={<WarningIcon />}>
          <Typography variant="subtitle2">Critical Alerts Detected</Typography>
          <Typography variant="body2">{criticalAlerts} sensor(s) are reporting values above critical thresholds</Typography>
        </Alert>
      )}

      {/* Sensors Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.50' }}>
            <TableRow>
              <TableCell>Sensor ID</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Battery</TableCell>
              <TableCell>Current Value</TableCell>
              <TableCell>Last Update</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockSensors.map((sensor) => (
              <TableRow 
                key={sensor.id} 
                hover
                sx={{ 
                  bgcolor: sensor.metrics.isCritical ? 'error.light' : 'inherit',
                  '&:hover': { bgcolor: sensor.metrics.isCritical ? 'error.light' : 'action.hover' }
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getSensorIcon(sensor.type)}
                    <Typography variant="body2" fontWeight={500}>{sensor.id}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={sensor.type.replace('_', ' ').toUpperCase()} 
                    size="small" 
                    variant="outlined" 
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap sx={{ maxWidth: 180 }}>
                    {sensor.location}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={sensor.status.toUpperCase()} 
                    size="small" 
                    color={getStatusColor(sensor.status) as any}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={sensor.battery} 
                      sx={{ width: 60, height: 6, borderRadius: 3 }}
                      color={getBatteryColor(sensor.battery) as any}
                    />
                    <Typography variant="caption">{sensor.battery}%</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">
                      {sensor.metrics.value} {sensor.metrics.unit}
                    </Typography>
                    {sensor.metrics.isCritical && (
                      <Chip label="Critical" size="small" color="error" sx={{ mt: 0.5 }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="caption">
                    {new Date(sensor.lastUpdate).toLocaleTimeString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton size="small" title="View Details">
                    <SensorsIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};