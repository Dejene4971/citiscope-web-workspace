import React from 'react';
import {
  Paper, Typography, Box, Chip, List,
  ListItem, ListItemText, LinearProgress, Alert,
} from '@mui/material';
import { Build, Schedule } from '@mui/icons-material';
import { MAINTENANCE_PREDICTIONS } from '../../data/mockAnalyticsData';

const urgencyColor = (days: number) => {
  if (days <= 14) return 'error';
  if (days <= 30) return 'warning';
  return 'info';
};

/**
 * Predictive maintenance alerts — shows assets likely to fail and recommended actions.
 */
export const MaintenancePredictor: React.FC = () => (
  <Paper sx={{ p: 3, borderRadius: 2 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Typography variant="h6" fontWeight={700}>Maintenance Predictor</Typography>
      <Build color="warning" />
    </Box>

    <Alert severity="info" sx={{ mb: 2, py: 0.5 }}>
      AI model analysing sensor degradation patterns
    </Alert>

    <List disablePadding>
      {MAINTENANCE_PREDICTIONS.map((item, i) => (
        <ListItem
          key={i}
          disablePadding
          sx={{
            mb: 2, p: 1.5, borderRadius: 2,
            border: '1px solid',
            borderColor: item.daysUntilFailure <= 14 ? 'error.light' : 'divider',
            bgcolor: item.daysUntilFailure <= 14 ? 'error.50' : 'background.paper',
          }}
        >
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" fontWeight={700}>{item.asset}</Typography>
                <Chip
                  icon={<Schedule fontSize="small" />}
                  label={`${item.daysUntilFailure}d`}
                  size="small"
                  color={urgencyColor(item.daysUntilFailure) as any}
                />
              </Box>
            }
            secondary={
              <Box sx={{ mt: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    Confidence: {item.confidence}%
                  </Typography>
                  <Typography variant="caption" fontWeight={600} color="primary.main">
                    {item.action}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={item.confidence}
                  color={urgencyColor(item.daysUntilFailure) as any}
                  sx={{ height: 4, borderRadius: 2 }}
                />
              </Box>
            }
          />
        </ListItem>
      ))}
    </List>
  </Paper>
);
