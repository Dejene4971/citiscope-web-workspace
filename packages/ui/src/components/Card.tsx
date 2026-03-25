import React from 'react';
import { Card as MuiCard, CardContent, CardActions, Typography, Box } from '@mui/material';

export interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  elevation?: number;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  actions,
  elevation = 1,
}) => {
  return (
    <MuiCard elevation={elevation}>
      {(title || subtitle) && (
        <Box sx={{ p: 2, pb: 0 }}>
          {title && (
            <Typography variant="h6" component="div">
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      )}
      <CardContent>{children}</CardContent>
      {actions && <CardActions>{actions}</CardActions>}
    </MuiCard>
  );
};