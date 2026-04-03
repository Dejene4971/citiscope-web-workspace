import React from 'react';
import { Paper, Typography, Box, Chip, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import { Bar } from 'react-chartjs-2';
import { MONTHLY_LABELS, REPORTED_MONTHLY, ANOMALY_POINTS } from '../../data/mockAnalyticsData';

// No ChartJS.register — done once in AnalyticsPage

const anomalyIndices = new Set(ANOMALY_POINTS.map(a => a.month));

const CHART_DATA = {
  labels: MONTHLY_LABELS,
  datasets: [{
    label: 'Issues',
    data: REPORTED_MONTHLY,
    backgroundColor: REPORTED_MONTHLY.map((_, i) => anomalyIndices.has(i) ? '#f44336' : '#1976d2'),
    borderRadius: 4,
  }],
};

const CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: true,
  animation: { duration: 400 } as const,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true }, x: { grid: { display: false } } },
} as const;

export const AnomalyDetection: React.FC = () => (
  <Paper sx={{ p: 3, borderRadius: 2 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Typography variant="h6" fontWeight={700}>Anomaly Detection</Typography>
      <Chip label={`${ANOMALY_POINTS.length} anomalies`} color="error" size="small" />
    </Box>

    <Bar data={CHART_DATA} options={CHART_OPTIONS} />

    <Divider sx={{ my: 2 }} />
    <Typography variant="subtitle2" gutterBottom>Detected Anomalies</Typography>
    <List dense disablePadding>
      {ANOMALY_POINTS.map((a, i) => (
        <ListItem key={i} disablePadding sx={{ py: 0.5 }}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <ErrorOutline color="error" fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={`${MONTHLY_LABELS[a.month]}: ${a.value} issues`}
            secondary={a.reason}
            primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
            secondaryTypographyProps={{ variant: 'caption' }}
          />
        </ListItem>
      ))}
    </List>
  </Paper>
);
