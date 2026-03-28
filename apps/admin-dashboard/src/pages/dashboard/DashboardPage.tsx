import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { MuiStatCard as StatCard, Card } from '@citiscope/ui';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SpeedIcon from '@mui/icons-material/Speed';

export const DashboardPage: React.FC = () => {
  const stats = [
    {
      title: 'Active Issues',
      value: 124,
      icon: <WarningIcon />,
      color: '#ff9800',
      trend: { value: 12, isPositive: false },
    },
    {
      title: 'Resolved Issues',
      value: 89,
      icon: <CheckCircleIcon />,
      color: '#4caf50',
      trend: { value: 8, isPositive: true },
    },
    {
      title: 'Critical Alerts',
      value: 5,
      icon: <SpeedIcon />,
      color: '#f44336',
      trend: { value: 2, isPositive: false },
    },
    {
      title: 'Avg Resolution',
      value: '4.2h',
      icon: <AccessTimeIcon />,
      color: '#2196f3',
      trend: { value: 15, isPositive: true },
    },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Dashboard Overview
      </Typography>
      
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
        
        <Grid item xs={12} md={8}>
          <Card title="Recent Activity">
            <Typography variant="body2" color="text.secondary">
              Activity feed will appear here...
            </Typography>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card title="Quick Actions">
            <Typography variant="body2" color="text.secondary">
              Quick action buttons will appear here...
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};