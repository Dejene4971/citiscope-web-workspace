import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Grid, Card, CardContent,
  Chip, Button, ButtonGroup, FormControl, InputLabel,
  Select, MenuItem, Alert, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Switch, FormControlLabel,
} from '@mui/material';
import {
  Warning as WarningIcon, Download as DownloadIcon,
  Refresh as RefreshIcon, ShowChart as ShowChartIcon,
  BarChart as BarChartIcon, BubbleChart as BubbleChartIcon,
  Speed as SpeedIcon, Schedule as ScheduleIcon, Timeline as TimelineIcon,
} from '@mui/icons-material';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, BarElement, RadialLinearScale,
  Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line, Bar, Radar } from 'react-chartjs-2';
import { PredictiveAnalyticsService } from '../../services/predictiveAnalytics';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, RadialLinearScale, Title, Tooltip, Legend, Filler,
);

const historicalData = [
  { date: 'Week 1', reported: 45, resolved: 32, predicted: 44 },
  { date: 'Week 2', reported: 52, resolved: 38, predicted: 48 },
  { date: 'Week 3', reported: 48, resolved: 35, predicted: 50 },
  { date: 'Week 4', reported: 58, resolved: 42, predicted: 55 },
  { date: 'Week 5', reported: 62, resolved: 45, predicted: 60 },
  { date: 'Week 6', reported: 55, resolved: 48, predicted: 58 },
  { date: 'Week 7', reported: 68, resolved: 52, predicted: 64 },
  { date: 'Week 8', reported: 72, resolved: 58, predicted: 70 },
];

const woredaPerformance = [
  { name: 'Bole',   issues: 45, resolved: 38, time: 3.2, critical: 5  },
  { name: 'Kirkos', issues: 52, resolved: 42, time: 4.1, critical: 8  },
  { name: 'Yeka',   issues: 48, resolved: 35, time: 5.0, critical: 12 },
  { name: 'Gulele', issues: 38, resolved: 28, time: 4.5, critical: 6  },
  { name: 'Lideta', issues: 42, resolved: 36, time: 3.8, critical: 4  },
];

const categoryData = [
  { category: 'Road',        risk: 78, forecast: 52 },
  { category: 'Water',       risk: 85, forecast: 44 },
  { category: 'Electricity', risk: 62, forecast: 35 },
  { category: 'Waste',       risk: 45, forecast: 28 },
  { category: 'Drainage',    risk: 71, forecast: 24 },
];

const KPI_CARDS = [
  { label: 'Critical Risk Level', value: '85%',  icon: <WarningIcon />,  color: '#f44336', trend: '+12%' },
  { label: 'Predicted Issues',    value: 94,     icon: <TimelineIcon />, color: '#ff9800', trend: '+8%'  },
  { label: 'Efficiency Score',    value: '78%',  icon: <SpeedIcon />,    color: '#4caf50', trend: '+5%'  },
  { label: 'Savings Projected',   value: '125K', icon: <ScheduleIcon />, color: '#1976d2', trend: 'ETB'  },
];

export const PredictiveAnalyticsPage: React.FC = () => {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [forecastPeriods, setForecastPeriods] = useState(4);
  const [showPredictions, setShowPredictions] = useState(true);
  const [anomalies, setAnomalies] = useState<number[]>([]);
  const [forecastData, setForecastData] = useState(historicalData);

  useEffect(() => {
    const values = historicalData.map(d => d.reported);
    const forecast = PredictiveAnalyticsService.forecastTimeSeries(values, forecastPeriods);
    setAnomalies(PredictiveAnalyticsService.detectAnomalies(values).map(a => a.index));
    setForecastData([
      ...historicalData,
      ...forecast.map((v, i) => ({ date: `F+${i + 1}`, reported: Math.round(v), resolved: 0, predicted: Math.round(v) })),
    ]);
  }, [forecastPeriods]);

  const resourceOpt = PredictiveAnalyticsService.optimizeResourceAllocation(
    woredaPerformance.map(w => ({ name: w.name, issues: w.issues, resolutionTime: w.time, criticalCount: w.critical }))
  );

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(historicalData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Analytics');
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buf], { type: 'application/octet-stream' }), `analytics_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const labels = forecastData.map(d => d.date);
  const baseDatasets = [
    { label: 'Reported', data: forecastData.map(d => d.reported || null), borderColor: '#ff9800', backgroundColor: 'rgba(255,152,0,0.1)', fill: true, tension: 0.4 },
    { label: 'Resolved', data: forecastData.map(d => d.resolved || null), borderColor: '#4caf50', backgroundColor: 'rgba(76,175,80,0.1)', fill: true, tension: 0.4 },
  ];
  const datasets = showPredictions
    ? [...baseDatasets, { label: 'Predicted', data: forecastData.map(d => d.predicted || null), borderColor: '#f44336', backgroundColor: 'transparent', borderDash: [5, 5], fill: false, tension: 0.4 }]
    : baseDatasets;

  const chartOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'top' as const }, tooltip: { mode: 'index' as const, intersect: false } },
    scales: { y: { beginAtZero: true }, x: { grid: { display: false } } },
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Predictive Analytics Dashboard</Typography>
          <Typography variant="body2" color="text.secondary">AI-powered insights and predictive maintenance intelligence</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" size="small" startIcon={<DownloadIcon />} onClick={handleExport}>Export</Button>
          <Button variant="outlined" size="small" startIcon={<RefreshIcon />}>Refresh</Button>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {KPI_CARDS.map(k => (
          <Grid item xs={6} sm={3} key={k.label}>
            <Card sx={{ borderTop: `4px solid ${k.color}` }}>
              <CardContent sx={{ pb: '12px !important' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', color: k.color, mb: 0.5 }}>
                  {k.icon}
                  <Chip label={k.trend} size="small" sx={{ height: 18, fontSize: 10 }} />
                </Box>
                <Typography variant="h4" fontWeight={700}>{k.value}</Typography>
                <Typography variant="caption" color="text.secondary">{k.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="h6" fontWeight={600}>Issue Trend Prediction</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <FormControlLabel
              control={<Switch size="small" checked={showPredictions} onChange={e => setShowPredictions(e.target.checked)} />}
              label="Show Predictions"
            />
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel>Forecast Periods</InputLabel>
              <Select value={forecastPeriods} label="Forecast Periods" onChange={e => setForecastPeriods(e.target.value as number)}>
                <MenuItem value={2}>2 Weeks</MenuItem>
                <MenuItem value={4}>4 Weeks</MenuItem>
                <MenuItem value={8}>8 Weeks</MenuItem>
              </Select>
            </FormControl>
            <ButtonGroup size="small" variant="outlined">
              <Button onClick={() => setChartType('line')} variant={chartType === 'line' ? 'contained' : 'outlined'}><ShowChartIcon /></Button>
              <Button onClick={() => setChartType('bar')}  variant={chartType === 'bar'  ? 'contained' : 'outlined'}><BarChartIcon /></Button>
            </ButtonGroup>
          </Box>
        </Box>
        <Box sx={{ height: 360 }}>
          {chartType === 'bar'
            ? <Bar data={{ labels, datasets }} options={chartOpts} />
            : <Line data={{ labels, datasets }} options={chartOpts} />
          }
        </Box>
        {anomalies.length > 0 && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            {anomalies.length} anomalies detected. Review patterns for potential infrastructure issues.
          </Alert>
        )}
      </Paper>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>Resource Optimization</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f9fafb' }}>
                    {['Woreda', 'Priority', 'Teams', 'Improvement'].map(h => (
                      <TableCell key={h} sx={{ fontWeight: 700 }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {resourceOpt.map(rec => (
                    <TableRow key={rec.woreda} hover>
                      <TableCell>{rec.woreda}</TableCell>
                      <TableCell>
                        <Chip label={`${rec.priority}%`} size="small" color={rec.priority > 70 ? 'error' : rec.priority > 40 ? 'warning' : 'info'} />
                      </TableCell>
                      <TableCell>{rec.recommendedResources}</TableCell>
                      <TableCell sx={{ color: 'success.main', fontWeight: 600 }}>+{Math.round(rec.expectedImprovement)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>Category Risk Assessment</Typography>
            <Box sx={{ height: 300 }}>
              <Radar
                data={{
                  labels: categoryData.map(d => d.category),
                  datasets: [
                    { label: 'Current Risk',  data: categoryData.map(d => d.risk),     borderColor: '#f44336', backgroundColor: 'rgba(244,67,54,0.2)'  },
                    { label: 'Forecast Risk', data: categoryData.map(d => d.forecast), borderColor: '#ff9800', backgroundColor: 'rgba(255,152,0,0.15)' },
                  ],
                }}
                options={{ responsive: true, maintainAspectRatio: false, scales: { r: { min: 0, max: 100 } }, plugins: { legend: { position: 'bottom' } } }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Woreda Performance Matrix</Typography>
        <Box sx={{ height: 340 }}>
          <Bar
            data={{
              labels: woredaPerformance.map(w => w.name),
              datasets: [
                { label: 'Total Issues', data: woredaPerformance.map(w => w.issues),   backgroundColor: '#ff9800', borderRadius: 4 },
                { label: 'Resolved',     data: woredaPerformance.map(w => w.resolved), backgroundColor: '#4caf50', borderRadius: 4 },
                { label: 'Critical',     data: woredaPerformance.map(w => w.critical), backgroundColor: '#f44336', borderRadius: 4 },
              ],
            }}
            options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true } } }}
          />
        </Box>
      </Paper>
    </Box>
  );
};
