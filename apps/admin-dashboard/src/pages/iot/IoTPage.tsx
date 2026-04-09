import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  ButtonGroup,
  Tabs,
  Tab,
  Tooltip,
} from '@mui/material';
import {
  Sensors as SensorsIcon,
  WaterDrop as WaterIcon,
  Vibration as VibrationIcon,
  Bolt as BoltIcon,
  Flood as FloodIcon,
  Air as AirIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ShowChart as ShowChartIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { RootState } from '../../store/store';
import { setSensors, acknowledgeAlert, setConnectionStatus } from '../../features/iot/iotSlice';
import { mockSensors, mockNewAlerts } from '../../data/mockIoTData';
import { iotIngestionService } from '../../services/iotIngestionService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const getSensorIcon = (type: string) => {
  switch (type) {
    case 'water_pressure': return <WaterIcon />;
    case 'vibration': return <VibrationIcon />;
    case 'electrical': return <BoltIcon />;
    case 'flood': return <FloodIcon />;
    case 'air_quality': return <AirIcon />;
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
  const dispatch = useDispatch();
  const { sensors, activeAlerts, criticalCount, warningCount, isConnected, lastUpdated } = useSelector(
    (state: RootState) => state.iot
  );
  const [tabValue, setTabValue] = useState(0);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  // Load initial sensors
  useEffect(() => {
    dispatch(setSensors(mockSensors));
    
    // Simulate real-time alerts via ingestion service (triggers full workflow)
    if (autoRefresh) {
      const interval = setInterval(() => {
        const randomAlert = mockNewAlerts[Math.floor(Math.random() * mockNewAlerts.length)];
        iotIngestionService.ingest({ ...randomAlert, id: `ALERT-${Date.now()}` });
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [dispatch, autoRefresh]);

  const handleRefresh = () => {
    dispatch(setSensors(mockSensors));
    // Simulate a fresh critical alert through the full pipeline
    iotIngestionService.simulateAlert();
  };

  const handleAcknowledge = (alertId: string) => {
    dispatch(acknowledgeAlert(alertId));
  };

  // Chart data for sensor trends
  const sensorTrendData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', 'Now'],
    datasets: [
      {
        label: 'Water Pressure (psi)',
        data: [32, 34, 35, 38, 42, 41, 42],
        borderColor: '#2196f3',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Threshold',
        data: [35, 35, 35, 35, 35, 35, 35],
        borderColor: '#f44336',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      tooltip: { mode: 'index' as const, intersect: false },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { grid: { display: false } },
    },
  };

  const activeSensors = sensors.filter(s => s.status === 'active').length;
  const totalSensors = sensors.length;
  const lowBattery = sensors.filter(s => s.batteryLevel < 30).length;

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
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
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleRefresh} size="small">
            Refresh
          </Button>
          <Button variant="outlined" startIcon={<DownloadIcon />} size="small">
            Export
          </Button>
        </Box>
      </Box>

      {/* Connection Status Banner */}
      {!isConnected && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Connection to IoT network lost. Reconnecting...
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" color="text.secondary">Active Sensors</Typography>
                <SensorsIcon color="primary" />
              </Box>
              <Typography variant="h4">{activeSensors}</Typography>
              <Typography variant="caption" color="text.secondary">of {totalSensors} total</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderTop: '3px solid #f44336' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" color="text.secondary">Critical Alerts</Typography>
                <WarningIcon color="error" />
              </Box>
              <Typography variant="h4" color="error.main">{criticalCount}</Typography>
              <Typography variant="caption">Requires immediate attention</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderTop: '3px solid #ff9800' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" color="text.secondary">Warnings</Typography>
                <ErrorIcon color="warning" />
              </Box>
              <Typography variant="h4" color="warning.main">{warningCount}</Typography>
              <Typography variant="caption">Above threshold</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
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
        <Grid item xs={12} sm={6} md={2.4}>
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

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="Active Alerts" />
          <Tab label="Sensor Registry" />
          <Tab label="Analytics & Trends" />
          <Tab label="Maintenance Log" />
        </Tabs>
      </Paper>

      {/* Tab 1: Active Alerts */}
      <TabPanel value={tabValue} index={0}>
        {activeAlerts.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
            <Typography variant="h6">No Active Alerts</Typography>
            <Typography variant="body2" color="text.secondary">All sensors are operating normally</Typography>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {activeAlerts.map((alert) => (
              <Grid item xs={12} key={alert.id}>
                <Paper
                  sx={{
                    p: 2,
                    borderLeft: `4px solid ${alert.metrics.isCritical ? '#f44336' : '#ff9800'}`,
                    bgcolor: alert.metrics.isCritical ? 'error.light' : 'warning.light',
                    '&:hover': { bgcolor: alert.metrics.isCritical ? 'error.light' : 'warning.light' },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                      {getSensorIcon(alert.sensorType)}
                      <Box>
                        <Typography variant="subtitle1" fontWeight={500}>
                          {alert.sensorType.replace('_', ' ').toUpperCase()} - {alert.sensorId}
                        </Typography>
                        <Typography variant="body2">{alert.location.address}</Typography>
                        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                          <Chip
                            label={`Value: ${alert.metrics.value} ${alert.metrics.unit}`}
                            size="small"
                            color={alert.metrics.isCritical ? 'error' : 'warning'}
                          />
                          <Chip
                            label={`Threshold: ${alert.metrics.threshold} ${alert.metrics.unit}`}
                            size="small"
                            variant="outlined"
                          />
                          <Chip
                            icon={alert.metrics.trend === 'increasing' ? <TrendingUpIcon /> : <TrendingDownIcon />}
                            label={alert.metrics.trend}
                            size="small"
                          />
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(alert.lastUpdate).toLocaleTimeString()}
                      </Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        color={alert.metrics.isCritical ? 'error' : 'warning'}
                        sx={{ mt: 1 }}
                        onClick={() => handleAcknowledge(alert.id)}
                      >
                        Acknowledge
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      {/* Tab 2: Sensor Registry */}
      <TabPanel value={tabValue} index={1}>
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
              {sensors.map((sensor) => (
                <TableRow
                  key={sensor.id}
                  hover
                  sx={{ bgcolor: sensor.metrics.isCritical ? 'error.light' : 'inherit' }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getSensorIcon(sensor.sensorType)}
                      <Typography variant="body2" fontWeight={500}>{sensor.sensorId}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={sensor.sensorType.replace('_', ' ').toUpperCase()} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 180 }}>
                      {sensor.location.address}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={sensor.status.toUpperCase()} size="small" color={getStatusColor(sensor.status) as any} />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={sensor.batteryLevel}
                        sx={{ width: 60, height: 6, borderRadius: 3 }}
                        color={getBatteryColor(sensor.batteryLevel) as any}
                      />
                      <Typography variant="caption">{sensor.batteryLevel}%</Typography>
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
                    <Tooltip title="View Details">
                      <IconButton size="small">
                        <SensorsIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Tab 3: Analytics & Trends */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          {/* Sensor Trend Chart */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Sensor Trend Analysis</Typography>
                <ButtonGroup size="small" variant="outlined">
                  <Button
                    onClick={() => setChartType('line')}
                    variant={chartType === 'line' ? 'contained' : 'outlined'}
                    startIcon={<ShowChartIcon />}
                  >
                    Line
                  </Button>
                  <Button
                    onClick={() => setChartType('bar')}
                    variant={chartType === 'bar' ? 'contained' : 'outlined'}
                  >
                    Bar
                  </Button>
                </ButtonGroup>
              </Box>
              <Box sx={{ height: 350 }}>
                {chartType === 'line' ? (
                  <Line data={sensorTrendData} options={chartOptions} />
                ) : (
                  <Bar data={sensorTrendData} options={chartOptions} />
                )}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, bgcolor: '#2196f3', borderRadius: 1 }} />
                  <Typography variant="caption">Water Pressure</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, bgcolor: '#f44336', borderRadius: 1 }} />
                  <Typography variant="caption">Critical Threshold</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Alert Summary */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>Alert Summary</Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">Critical Alerts</Typography>
                  <Typography variant="body2" fontWeight="bold" color="error.main">{criticalCount}</Typography>
                </Box>
                <LinearProgress variant="determinate" value={(criticalCount / 10) * 100} color="error" sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">Warning Alerts</Typography>
                  <Typography variant="body2" fontWeight="bold" color="warning.main">{warningCount}</Typography>
                </Box>
                <LinearProgress variant="determinate" value={(warningCount / 10) * 100} color="warning" sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">Sensor Health</Typography>
                  <Typography variant="body2" fontWeight="bold">{(activeSensors / totalSensors * 100).toFixed(1)}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={activeSensors / totalSensors * 100} color="success" />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Tab 4: Maintenance Log */}
      <TabPanel value={tabValue} index={3}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Recent Maintenance Activities</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Sensor ID</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Activity</TableCell>
                  <TableCell>Technician</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>2024-03-31 10:30</TableCell>
                  <TableCell>SEN-003</TableCell>
                  <TableCell>Electrical</TableCell>
                  <TableCell>Battery replacement</TableCell>
                  <TableCell>Tech Team B</TableCell>
                  <TableCell><Chip label="Completed" size="small" color="success" /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2024-03-30 14:15</TableCell>
                  <TableCell>SEN-005</TableCell>
                  <TableCell>Water Pressure</TableCell>
                  <TableCell>Sensor recalibration</TableCell>
                  <TableCell>Tech Team A</TableCell>
                  <TableCell><Chip label="In Progress" size="small" color="warning" /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2024-03-29 09:00</TableCell>
                  <TableCell>SEN-001</TableCell>
                  <TableCell>Water Pressure</TableCell>
                  <TableCell>Firmware update</TableCell>
                  <TableCell>Tech Team A</TableCell>
                  <TableCell><Chip label="Completed" size="small" color="success" /></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </TabPanel>

      {/* Footer Info */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Typography variant="caption" color="text.secondary">
          Last updated: {new Date(lastUpdated).toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
};