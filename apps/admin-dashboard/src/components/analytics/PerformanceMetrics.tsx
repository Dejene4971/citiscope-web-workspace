import React from 'react';
import { Paper, Typography, Box, Grid, LinearProgress, Chip } from '@mui/material';
import { Radar } from 'react-chartjs-2';
import { KPI_LABELS, KPI_CURRENT, KPI_TARGET } from '../../data/mockAnalyticsData';

// No ChartJS.register — done once in AnalyticsPage

const CHART_DATA = {
  labels: KPI_LABELS,
  datasets: [
    {
      label: 'Current',
      data: KPI_CURRENT,
      borderColor: '#1976d2',
      backgroundColor: 'rgba(25,118,210,0.15)',
      pointBackgroundColor: '#1976d2',
    },
    {
      label: 'Target',
      data: KPI_TARGET,
      borderColor: '#2e7d32',
      backgroundColor: 'rgba(46,125,50,0.08)',
      borderDash: [4, 3],
      pointBackgroundColor: '#2e7d32',
    },
  ],
};

const CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: true,
  animation: { duration: 400 } as const,
  scales: { r: { min: 0, max: 100, ticks: { stepSize: 25 } } },
  plugins: { legend: { position: 'bottom' as const } },
} as const;

export const PerformanceMetrics: React.FC = () => (
  <Paper sx={{ p: 3, borderRadius: 2 }}>
    <Typography variant="h6" fontWeight={700} gutterBottom>Performance Metrics</Typography>
    <Typography variant="caption" color="text.secondary">Current vs Target KPIs</Typography>

    <Box sx={{ mt: 2 }}>
      <Radar data={CHART_DATA} options={CHART_OPTIONS} />
    </Box>

    <Box sx={{ mt: 3 }}>
      {KPI_LABELS.map((label, i) => {
        const pct = KPI_CURRENT[i];
        const gap = KPI_TARGET[i] - pct;
        return (
          <Box key={label} sx={{ mb: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" fontWeight={600}>{label}</Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Typography variant="caption">{pct}%</Typography>
                {gap > 0
                  ? <Chip label={`-${gap}%`} size="small" color="warning" sx={{ height: 16, fontSize: 10 }} />
                  : <Chip label="✓" size="small" color="success" sx={{ height: 16, fontSize: 10 }} />
                }
              </Box>
            </Box>
            <LinearProgress
              variant="determinate"
              value={pct}
              color={pct >= KPI_TARGET[i] ? 'success' : pct >= KPI_TARGET[i] - 10 ? 'warning' : 'error'}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>
        );
      })}
    </Box>
  </Paper>
);
