import { Typography } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import { LoginFormEnhanced } from '../../components/auth/LoginFormEnhanced';
import { loginStart, loginSuccess, loginFailure } from '../../features/auth/authSlice';
import { RootState } from '../../store/store';
import { LoginFormData } from '../../schemas/auth.schema';

export const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const handleLogin = async (data: LoginFormData) => {
    dispatch(loginStart());

    // Simulate API call with validation
    setTimeout(() => {
      // Mock user data based on email domain
      let role: 'woreda_admin' | 'zonal_admin' | 'regional_admin' | 'federal_admin' = 'federal_admin';
      
      if (data.email.includes('woreda')) {
        role = 'woreda_admin';
      } else if (data.email.includes('zonal')) {
        role = 'zonal_admin';
      } else if (data.email.includes('regional')) {
        role = 'regional_admin';
      }

      dispatch(loginSuccess({
        user: {
          user_id: '1',
          email: data.email,
          full_name: data.email.split('@')[0].replace('.', ' '),
          role: role,
          admin_unit_id: role === 'woreda_admin' ? 'W-001' : role === 'zonal_admin' ? 'Z-001' : 'FED-001',
          permissions: ['view_dashboard', 'manage_issues', 'view_analytics'],
          created_at: new Date().toISOString(),
        },
        token: 'mock-jwt-token-12345',
      }));
      
      navigate('/');
    }, 1000);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            🏙️ CitiScope
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            National Multi-Tier Civic Intelligence Platform
          </Typography>
        </Box>
        <LoginFormEnhanced onSubmit={handleLogin} isLoading={isLoading} error={error} />
      </Container>
    </Box>
  );
};
