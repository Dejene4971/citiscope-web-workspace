import React from 'react';
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isLoading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color = '#1976d2',
  trend,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="rectangular" height={40} sx={{ mt: 1 }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography color="text.secondary" variant="subtitle2" gutterBottom>
            {title}
          </Typography>
          <Box sx={{ color: color }}>{icon}</Box>
        </Box>
        <Typography variant="h4" component="div" sx={{ mt: 1, mb: 1 }}>
          {value}
        </Typography>
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="caption"
              color={trend.isPositive ? 'success.main' : 'error.main'}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              from last period
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};