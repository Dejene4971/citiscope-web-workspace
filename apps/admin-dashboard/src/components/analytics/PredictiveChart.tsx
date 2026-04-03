import React from 'react';
import { Box, Typography, Chip, Paper } from '@mui/material';
import { TrendingUp } from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import { FORECAST_LABELS, FORECAST_ACTUAL, FORECAST_PREDICTED } from '../../data/mockAnalyticsData';

// No ChartJS.register here — already done once in AnalyticsPage

// Static data and options — never recreated on render
const CHART_DATA = {
  labels: FORECAST_LABELS,
  datasets: [
    {
      label: 'Actual Issues',
      data: FORECAST_ACTUAL,
      borderColor: '#1976d2',
      backgroundColor: 'rgba(25,118,210,0.08)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
    },
    {
      label: 'Predicted',
      data: FORECAST_PREDICTED,
      borderColor: '#9c27b0',
      backgroundColor: 'rgba(156,39,176,0.08)',
      borderDash: [6, 4],
      fill: true,
      tension: 0.4,
      pointRadius: 5,
    },
  ],
};

const CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: true,
  animation: { duration: 400 } as const,
  plugins: {
    legend: { position: 'top' as const },
    tooltip: { mode: 'index' as const, intersect: false },
  },
  scales: {
    y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' } },
    x: { grid: { display: false } },
  },
} as const;

export const PredictiveChart: React.FC = () => (
  <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Box>
        <Typography variant="h6" fontWeight={700}>Issue Trend Forecast</Typography>
        <Typography variant="caption" color="text.secondary">
          ML model · 87% confidence · next 3 months
        </Typography>
      </Box>
      <Chip icon={<TrendingUp />} label="Predictive" color="primary" size="small" />
    </Box>
    <Line data={CHART_DATA} options={CHART_OPTIONS} />
  </Paper>
);
