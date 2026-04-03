import React from 'react';
import {
  Paper, Typography, Box, Chip, Table, TableHead,
  TableBody, TableRow, TableCell, LinearProgress,
} from '@mui/material';
import { TrendingUp, TrendingDown, Remove } from '@mui/icons-material';
import { RISK_DATA } from '../../data/mockAnalyticsData';

const riskColor = (score: number) => {
  if (score >= 75) return 'error';
  if (score >= 55) return 'warning';
  return 'success';
};

/**
 * Infrastructure risk scoring table with trend indicators and predictions.
 */
export const RiskAssessment: React.FC = () => (
  <Paper sx={{ p: 3, borderRadius: 2 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Typography variant="h6" fontWeight={700}>Risk Assessment</Typography>
      <Chip label="Live scoring" color="primary" size="small" variant="outlined" />
    </Box>

    <Table size="small">
      <TableHead>
        <TableRow sx={{ bgcolor: '#f9fafb' }}>
          <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
          <TableCell sx={{ fontWeight: 700 }}>Risk Score</TableCell>
          <TableCell sx={{ fontWeight: 700 }}>Trend</TableCell>
          <TableCell sx={{ fontWeight: 700 }}>Current</TableCell>
          <TableCell sx={{ fontWeight: 700 }}>Predicted</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {RISK_DATA.map(row => (
          <TableRow key={row.category} hover>
            <TableCell fontWeight={600}>{row.category}</TableCell>
            <TableCell>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={row.score}
                  color={riskColor(row.score) as any}
                  sx={{ width: 60, height: 6, borderRadius: 3 }}
                />
                <Chip
                  label={`${row.score}`}
                  size="small"
                  color={riskColor(row.score) as any}
                  sx={{ minWidth: 40 }}
                />
              </Box>
            </TableCell>
            <TableCell>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {row.trend > 0
                  ? <TrendingUp fontSize="small" color="error" />
                  : row.trend < 0
                  ? <TrendingDown fontSize="small" color="success" />
                  : <Remove fontSize="small" color="disabled" />
                }
                <Typography
                  variant="caption"
                  color={row.trend > 0 ? 'error.main' : row.trend < 0 ? 'success.main' : 'text.secondary'}
                  fontWeight={600}
                >
                  {row.trend > 0 ? `+${row.trend}` : row.trend}%
                </Typography>
              </Box>
            </TableCell>
            <TableCell>{row.issues}</TableCell>
            <TableCell>
              <Typography
                variant="body2"
                color={row.predicted > row.issues ? 'error.main' : 'success.main'}
                fontWeight={600}
              >
                {row.predicted}
              </Typography>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Paper>
);
