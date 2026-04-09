import React from 'react';
import { Paper, Typography, Box, LinearProgress, Grid } from '@mui/material';

interface FunnelStage {
  name: string;
  count: number;
  color: string;
}

interface FunnelChartProps {
  data: FunnelStage[];
  title: string;
}

export const FunnelChart: React.FC<FunnelChartProps> = ({ data, title }) => {
  const maxCount = Math.max(...data.map(d => d.count));

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <Box sx={{ mt: 3 }}>
        {data.map((stage, index) => {
          const percentage = (stage.count / maxCount) * 100;
          const conversionRate = index > 0 ? ((stage.count / data[index - 1].count) * 100).toFixed(1) : null;
          
          return (
            <Box key={stage.name} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" fontWeight={500}>{stage.name}</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Typography variant="body2" color="text.secondary">{stage.count} issues</Typography>
                  {conversionRate && (
                    <Typography variant="caption" color="success.main">
                      {conversionRate}% conversion
                    </Typography>
                  )}
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={percentage}
                sx={{
                  height: 32,
                  borderRadius: 4,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: stage.color,
                    borderRadius: 4,
                  },
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {percentage.toFixed(1)}% of total
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};