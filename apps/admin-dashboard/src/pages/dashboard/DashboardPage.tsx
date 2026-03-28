import React from 'react';
import { useSelector } from 'react-redux';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { RootState } from '../../store/store';

const STATS = [
  { title: 'Active Issues',    value: 124,    change: '+12%', color: '#ff9800' },
  { title: 'Resolved Issues',  value: 89,     change: '+8%',  color: '#4caf50' },
  { title: 'Critical Alerts',  value: 5,      change: '-2%',  color: '#f44336' },
  { title: 'Avg Resolution',   value: '4.2h', change: '-15%', color: '#2196f3' },
];

export const DashboardPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const firstName = (user as any)?.user?.full_name?.split(' ')[0]
    ?? (user as any)?.full_name?.split(' ')[0]
    ?? 'Admin';

  return (
    <Box>
      {/* Welcome */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Welcome back, {firstName}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your infrastructure today.
        </Typography>
      </Box>

      {/* KPI cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {STATS.map(stat => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Paper sx={{ p: 2.5, borderTop: `4px solid ${stat.color}` }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {stat.title}
              </Typography>
              <Typography variant="h4" fontWeight={700}>{stat.value}</Typography>
              <Typography
                variant="caption"
                sx={{ color: stat.change.startsWith('+') ? 'success.main' : 'error.main' }}
              >
                {stat.change} from last period
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Charts placeholder */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2.5 }}>
            <Typography variant="h6" gutterBottom>Issue Trends</Typography>
            <Box sx={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">Chart coming soon</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2.5 }}>
            <Typography variant="h6" gutterBottom>Recent Activity</Typography>
            <Box sx={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">No recent activity</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
