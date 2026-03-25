import React from 'react';
import { TextField, TextFieldProps, InputAdornment } from '@mui/material';

export interface InputProps extends Omit<TextFieldProps, 'variant'> {
  label?: string;
  error?: boolean;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error = false,
  helperText,
  startIcon,
  endIcon,
  fullWidth = true,
  ...props
}) => {
  return (
    <TextField
      label={label}
      error={error}
      helperText={helperText}
      fullWidth={fullWidth}
      variant="outlined"
      InputProps={{
        startAdornment: startIcon ? (
          <InputAdornment position="start">{startIcon}</InputAdornment>
        ) : undefined,
        endAdornment: endIcon ? (
          <InputAdornment position="end">{endIcon}</InputAdornment>
        ) : undefined,
      }}
      {...props}
    />
  );
};