import React from 'react';
import { Chip, ChipProps } from '@mui/material';

export interface BadgeProps extends ChipProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'default';
  label: string;
  size?: 'small' | 'medium';
}

const statusColors = {
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'info',
  default: 'default',
};

export const Badge: React.FC<BadgeProps> = ({
  status,
  label,
  size = 'small',
  ...props
}) => {
  return (
    <Chip
      label={label}
      color={statusColors[status]}
      size={size}
      {...props}
    />
  );
};