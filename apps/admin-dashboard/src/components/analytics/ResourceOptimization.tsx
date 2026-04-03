import React from 'react';
import {
  Paper, Typography, Box, Chip, Grid, Avatar,
} from '@mui/material';
import { Engineering, ArrowForward } from '@mui/icons-material';
import { RESOURCE_RECOMMENDATIONS } from '../../data/mockAnalyticsData';

const priorityColor = (p: string) => {
  if (p === 'critical') return 'error';
  if (p === 'high')     return 'warning';
  return 'info';
};

/**
 * AI-driven resource allocation recommendations per woreda.
 */
export const ResourceOptimization: React.FC = () => (
  <Paper sx={{ p: 3, borderRadius: 2 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Typography variant="h6" fontWeight={700}>Resource Optimization</Typography>
      <Chip label="AI Recommended" color="secondary" size="small" />
    </Box>

    <Grid container spacing={2}>
      {RESOURCE_RECOMMENDATIONS.map(rec => (
        <Grid item xs={12} sm={6} key={rec.woreda}>
          <Box
            sx={{
              p: 2, borderRadius: 2, border: '1px solid',
              borderColor: `${priorityColor(rec.priority)}.light`,
              bgcolor: `${priorityColor(rec.priority)}.50`,
              display: 'flex', gap: 2, alignItems: 'flex-start',
            }}
          >
            <Avatar sx={{ bgcolor: `${priorityColor(rec.priority)}.main`, width: 40, height: 40 }}>
              <Engineering fontSize="small" />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" fontWeight={700}>{rec.woreda}</Typography>
                <Chip
                  label={rec.priority}
                  size="small"
                  color={priorityColor(rec.priority) as any}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <Engineering fontSize="small" color="action" />
                <Typography variant="body2" fontWeight={600}>{rec.technicians} technicians</Typography>
                <ArrowForward fontSize="small" color="action" sx={{ mx: 0.5 }} />
                <Typography variant="caption" color="text.secondary">Deploy now</Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {rec.reason}
              </Typography>
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  </Paper>
);
