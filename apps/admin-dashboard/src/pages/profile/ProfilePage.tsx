import React from 'react';
import { Box, Typography } from '@mui/material';
import { ProfileManagement } from '../../components/user/ProfileManagement';

export const ProfilePage: React.FC = () => (
  <Box>
    <Typography variant="h5" fontWeight={700} gutterBottom>Profile</Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
      Manage your account settings and preferences
    </Typography>
    <ProfileManagement />
  </Box>
);
