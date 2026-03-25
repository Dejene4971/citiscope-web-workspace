import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Paper, Typography, Box } from '@mui/material';
import { Button, Input, LoadingSpinner } from '@citiscope/ui';
import { loginStart, loginSuccess, loginFailure } from '../../features/auth/authSlice';
import { RootState } from '../../store/store';

export const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginStart());
    
    // Simulate API call
    setTimeout(() => {
      if (email && password) {
        dispatch(loginSuccess({
          user: {
            user_id: '1',
            email: email,
            full_name: 'Admin User',
            role: 'federal_admin',
            admin_unit_id: 'FED-001',
            permissions: ['view_dashboard', 'manage_issues', 'view_analytics'],
            created_at: new Date().toISOString(),
          },
          token: 'mock-jwt-token-12345',
        }));
      } else {
        dispatch(loginFailure('Invalid credentials'));
      }
    }, 1000);
  };

  if (isLoading) {
    return <LoadingSpinner message="Authenticating..." />;
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            🏙️ CitiScope
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
            Admin Dashboard Login
          </Typography>
          
          <form onSubmit={handleLogin}>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />
            <Button
              type="submit"
              fullWidth
              size="large"
              sx={{ mt: 3 }}
            >
              Sign In
            </Button>
          </form>
          
          {error && (
            <Typography color="error" align="center" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          
          <Typography variant="body2" align="center" sx={{ mt: 2, color: 'text.secondary' }}>
            Demo: admin@citiscope.com / any password
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};