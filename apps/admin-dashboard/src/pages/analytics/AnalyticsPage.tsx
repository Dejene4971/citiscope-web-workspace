import React, { useState, useMemo } from 'react';
import {
  Box, Typography, Grid, Paper, Tabs, Tab, Chip, Card, CardContent,
} from '@mui/material';
import { TrendingUp, Warning, Speed, Schedule } from '@mui/icons-material';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, BarElement, ArcElement,
  RadialLinearScale, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { PredictiveChart }      from '../../components/analytics/PredictiveChart';
import { AnomalyDetection }     from '../../components/analytics/AnomalyDetection';
import { PerformanceMetrics }   from '../../components/analytics/PerformanceMetrics';
import { RiskAssessment }       from '../../components/analytics/RiskAssessment';
import { MaintenancePredictor } from '../../components/analytics/MaintenancePredictor';
import { ResourceOptimization } from '../../components/analytics/ResourceOptimization';
import { DataExport }           from '../../components/analytics/DataExport';
import { MONTHLY_LABELS, REPORTED_MONTHLY, RESOLVED_MONTHLY } from '../../data/mockAnalyticsData';

// Register once at module level — never inside a component or render function
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, RadialLinearScale,
  Title, Tooltip, Legend, Filler,
);

// Static data outside component — never recreated
const KPI_CARDS = [
  { label: 'Total Reported',  value: 110,    color: '#1976d2', trend: '+8%'  },
  { label: 'Total Resolved',  value: 90,     color: '#2e7d32', trend: '+12%' },
  { label: 'Resolution Rate', value: '84%',  color: '#ed6c02', trend: '+3%'  },
  { label: 'Avg Resolution',  value: '4.2h', color: '#9c27b0', trend: '-15%' },
];

const SCHEDULED_REPORTS = [
  { name: 'Weekly Summary',     schedule: 'Every Monday 08:00', status: 'active'   },
  { name: 'Monthly KPI Report', schedule: '1st of month 07:00', status: 'active'   },
  { name: 'Critical Alerts',    schedule: 'Real-time',          status: 'active'   },
  { name: 'Quarterly Review',   schedule: 'Every 3 months',     status: 'inactive' },
];

// Static chart options — defined once, never recreated on render
const LINE_OPTIONS = {
  responsive: true,
  maintainAspectRatio: true,
  animation: { duration: 400 } as const,
  plugins: { legend: { position: 'top' as const } },
  scales: { y: { beginAtZero: true } },
} as const;

const BAR_OPTIONS = {
  responsive: true,
  maintainAspectRatio: true,
  animation: { duration: 400 } as const,
  plugins: { legend: { position: 'top' as const } },
  scales: { y: { beginAtZero: true } },
} as const;

const DOUGHNUT_OPTIONS = {
  responsive: true,
  maintainAspectRatio: true,
  animation: { duration: 400 } as const,
  plugins: { legend: { position: 'bottom' as const } },
} as const;

// Static chart data — defined once
const LINE_DATA = {
  labels: MONTHLY_LABELS,
  datasets: [
    { label: 'Reported', data: REPORTED_MONTHLY, borderColor: '#1976d2', backgroundColor: '#1976d215', fill: true, tension: 0.4 },
    { label: 'Resolved', data: RESOLVED_MONTHLY, borderColor: '#2e7d32', backgroundColor: '#2e7d3215', fill: true, tension: 0.4 },
  ],
};

const BAR_DATA = {
  labels: MONTHLY_LABELS,
  datasets: [
    { label: 'Reported', data: REPORTED_MONTHLY, backgroundColor: '#1976d2', borderRadius: 4 },
    { label: 'Resolved', data: RESOLVED_MONTHLY, backgroundColor: '#2e7d32', borderRadius: 4 },
  ],
};

const DOUGHNUT_DATA = {
  labels: ['Water', 'Road', 'Electricity', 'Sewage', 'Waste'],
  datasets: [{ data: [34, 28, 18, 12, 8], backgroundColor: ['#1976d2', '#ed6c02', '#ffc107', '#9c27b0', '#2e7d32'], borderWidth: 2 }],
};

interface TabPanelProps { children: React.ReactNode; index: number; value: number; }
const TabPanel = ({ children, index, value }: TabPanelProps) => (
  <Box hidden={value !== index} sx={{ pt: 3 }}>
    {value === index && children}
  </Box>
);

export const AnalyticsPage: React.FC = () => {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Analytics & Intelligence</Typography>
          <Typography variant="body2" color="text.secondary">
            Predictive insights · Anomaly detection · Risk scoring
          </Typography>
        </Box>
        <Chip label="ML Powered" color="secondary" icon={<TrendingUp />} />
      </Box>

      {/* KPI row — icons rendered here, not in static array */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {KPI_CARDS.map((k, i) => (
          <Grid item xs={6} sm={3} key={k.label}>
            <Card sx={{ borderTop: `4px solid ${k.color}`, borderRadius: 2 }}>
              <CardContent sx={{ pb: '12px !important' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', color: k.color, mb: 0.5 }}>
                  {i === 0 ? <Warning /> : i === 1 ? <TrendingUp /> : i === 2 ? <Speed /> : <Schedule />}
                  <Chip
                    label={k.trend}
                    size="small"
                    color={k.trend.startsWith('+') ? 'success' : 'error'}
                    sx={{ height: 18, fontSize: 10 }}
                  />
                </Box>
                <Typography variant="h4" fontWeight={700}>{k.value}</Typography>
                <Typography variant="caption" color="text.secondary">{k.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ mb: 0 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto">
          <Tab label="Overview" />
          <Tab label="Predictive Models" />
          <Tab label="Risk & Resources" />
          <Tab label="Export & Reports" />
        </Tabs>
      </Paper>

      <TabPanel value={tab} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>Issues Over Time</Typography>
              <Line data={LINE_DATA} options={LINE_OPTIONS} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>By Category</Typography>
              <Doughnut data={DOUGHNUT_DATA} options={DOUGHNUT_OPTIONS} />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>Monthly Breakdown</Typography>
              <Bar data={BAR_DATA} options={BAR_OPTIONS} />
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tab} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}><PredictiveChart /></Grid>
          <Grid item xs={12} md={4}><MaintenancePredictor /></Grid>
          <Grid item xs={12}><AnomalyDetection /></Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tab} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}><RiskAssessment /></Grid>
          <Grid item xs={12} md={5}><PerformanceMetrics /></Grid>
          <Grid item xs={12}><ResourceOptimization /></Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tab} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}><DataExport /></Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Scheduled Reports</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Automated report delivery configuration
              </Typography>
              {SCHEDULED_REPORTS.map(r => (
                <Box key={r.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, borderBottom: '1px solid #f3f4f6' }}>
                  <Box>
                    <Typography variant="body2" fontWeight={600}>{r.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{r.schedule}</Typography>
                  </Box>
                  <Chip label={r.status} size="small" color={r.status === 'active' ? 'success' : 'default'} />
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
};
