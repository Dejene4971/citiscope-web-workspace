import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  PointElement, LineElement,
  BarElement,
  ArcElement,
  Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register all needed Chart.js components once
ChartJS.register(
  CategoryScale, LinearScale,
  PointElement, LineElement,
  BarElement,
  ArcElement,
  Title, Tooltip, Legend, Filler,
);

const LABELS   = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const REPORTED = [12, 19, 8, 24, 17, 30];
const RESOLVED = [8,  14, 6, 20, 15, 27];

const SUMMARY = [
  { label: 'Total Reported', value: 110, color: '#1976d2' },
  { label: 'Total Resolved', value: 90,  color: '#2e7d32' },
  { label: 'Resolution Rate', value: '84%', color: '#ed6c02' },
  { label: 'Avg Resolution',  value: '4.2h', color: '#9c27b0' },
];

const CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: { legend: { position: 'top' as const } },
};

export const AnalyticsPage: React.FC = () => (
  <Box>
    <Typography variant="h5" fontWeight={700} gutterBottom>Analytics</Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
      Infrastructure issue trends and resolution metrics
    </Typography>

    {/* KPI row */}
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {SUMMARY.map(s => (
        <Grid item xs={6} sm={3} key={s.label}>
          <Paper sx={{ p: 2, borderTop: `4px solid ${s.color}`, borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">{s.label}</Typography>
            <Typography variant="h4" fontWeight={700} sx={{ color: s.color }}>{s.value}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>

    <Grid container spacing={3}>
      {/* Line chart */}
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>Issues Over Time</Typography>
          <Line
            options={CHART_OPTIONS}
            data={{
              labels: LABELS,
              datasets: [
                { label: 'Reported', data: REPORTED, borderColor: '#1976d2', backgroundColor: '#1976d222', fill: true, tension: 0.4 },
                { label: 'Resolved', data: RESOLVED, borderColor: '#2e7d32', backgroundColor: '#2e7d3222', fill: true, tension: 0.4 },
              ],
            }}
          />
        </Paper>
      </Grid>

      {/* Doughnut chart */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>By Category</Typography>
          <Doughnut
            options={{ ...CHART_OPTIONS, plugins: { legend: { position: 'bottom' as const } } }}
            data={{
              labels: ['Water', 'Road', 'Electricity', 'Sewage', 'Waste'],
              datasets: [{
                data: [34, 28, 18, 12, 8],
                backgroundColor: ['#1976d2', '#ed6c02', '#ffc107', '#9c27b0', '#2e7d32'],
                borderWidth: 2,
              }],
            }}
          />
        </Paper>
      </Grid>

      {/* Bar chart */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>Monthly Breakdown</Typography>
          <Bar
            options={CHART_OPTIONS}
            data={{
              labels: LABELS,
              datasets: [
                { label: 'Reported', data: REPORTED, backgroundColor: '#1976d2' },
                { label: 'Resolved', data: RESOLVED, backgroundColor: '#2e7d32' },
              ],
            }}
          />
        </Paper>
      </Grid>
    </Grid>
  </Box>
);
