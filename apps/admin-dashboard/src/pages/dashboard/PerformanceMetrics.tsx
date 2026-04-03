import React from 'react';
import { Paper, Typography, Grid, Box, LinearProgress, Chip } from '@mui/material';
import { TrendingUp, TrendingDown, Speed, Schedule, Assessment } from '@mui/icons-material';

interface Metric {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  color: string;
}

const metrics: Metric[] = [
  { label: 'Resolution Rate', value: '78%', change: 5, trend: 'up', icon: <Speed />, color: '#4caf50' },
  { label: 'Response Time', value: '2.4h', change: -12, trend: 'down', icon: <Schedule />, color: '#2196f3' },
  { label: 'Satisfaction', value: '87%', change: 3, trend: 'up', icon: <Assessment />, color: '#ff9800' },
  { label: 'Efficiency', value: '92%', change: 8, trend: 'up', icon: <TrendingUp />, color: '#9c27b0' },
];

export const PerformanceMetrics: React.FC = () => {
  return (
    <Grid container spacing={2}>
      {metrics.map((metric, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Paper sx={{ p: 2, borderTop: `3px solid ${metric.color}` }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">{metric.label}</Typography>
              <Box sx={{ color: metric.color }}>{metric.icon}</Box>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
              {metric.value}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                icon={metric.trend === 'up' ? <TrendingUp sx={{ fontSize: 14 }} /> : <TrendingDown sx={{ fontSize: 14 }} />}
                label={`${Math.abs(metric.change)}%`}
                size="small"
                color={metric.trend === 'up' ? 'success' : 'error'}
                sx={{ height: 20, fontSize: '0.7rem' }}
              />
              <Typography variant="caption" color="text.secondary">vs last period</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={typeof metric.value === 'string' ? parseFloat(metric.value) : metric.value}
              sx={{ mt: 2, height: 4, borderRadius: 2 }}
              color={metric.trend === 'up' ? 'success' : 'primary'}
            />
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};