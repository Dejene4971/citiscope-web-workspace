import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TextField, Alert, CircularProgress, Box, Paper,
  Typography, InputAdornment, IconButton, Divider,
} from '@mui/material';
import {
  Email, Lock, Visibility, VisibilityOff, AdminPanelSettings,
} from '@mui/icons-material';
import { loginSchema, type LoginFormData } from '../../schemas/auth.schema';

interface LoginFormEnhancedProps {
  onSubmit: (data: LoginFormData) => void;
  isLoading?: boolean;
  error?: string | null;
}

export const LoginFormEnhanced: React.FC<LoginFormEnhancedProps> = ({ onSubmit, isLoading, error }) => {
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <AdminPanelSettings sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
        <Typography variant="h5" fontWeight={700}>Admin Sign In</Typography>
        <Typography variant="body2" color="text.secondary">
          Enter your credentials to access the dashboard
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Email */}
        <TextField
          label="Email Address"
          type="email"
          fullWidth
          margin="normal"
          autoComplete="email"
          autoFocus
          error={!!errors.email}
          helperText={errors.email?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email color={errors.email ? 'error' : 'action'} />
              </InputAdornment>
            ),
          }}
          {...register('email')}
        />

        {/* Password */}
        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          margin="normal"
          autoComplete="current-password"
          error={!!errors.password}
          helperText={errors.password?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock color={errors.password ? 'error' : 'action'} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(v => !v)}
                  edge="end"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          {...register('password')}
        />

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <button
          type="submit"
          disabled={isLoading}
          style={{
            marginTop: 24,
            width: '100%',
            padding: '13px',
            background: isLoading ? '#90caf9' : '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 600,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'background 0.2s',
          }}
        >
          {isLoading && <CircularProgress size={18} color="inherit" />}
          {isLoading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
        Demo: any valid email + 6+ character password
      </Typography>
    </Paper>
  );
};
