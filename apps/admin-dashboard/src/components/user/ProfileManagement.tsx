import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  TextField,
  Button,
  Grid,
  Divider,
  Chip,
  Switch,
  FormControlLabel,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

export const ProfileManagement: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    phone: '+251 912 345 678',
    department: 'Infrastructure Management',
    role: user?.role || 'admin',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifications: true,
    smsAlerts: false,
    criticalAlertsOnly: false,
  });
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    setSuccess('Profile updated successfully!');
    setTimeout(() => setSuccess(null), 3000);
    setIsEditing(false);
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setSuccess('Password changed successfully!');
    setTimeout(() => setSuccess(null), 3000);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setError(null);
  };

  return (
    <Box>
      {success && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>{error}</Alert>}

      {/* Profile Header */}
      <Paper sx={{ p: 3, mb: 3, textAlign: 'center' }}>
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <Avatar sx={{ width: 100, height: 100, mb: 2, mx: 'auto' }}>
            {user?.full_name?.charAt(0) || 'A'}
          </Avatar>
          <IconButton
            sx={{ position: 'absolute', bottom: 10, right: -10, bgcolor: 'background.paper' }}
            size="small"
          >
            <PhotoCameraIcon fontSize="small" />
          </IconButton>
        </Box>
        <Typography variant="h5">{user?.full_name || 'Admin User'}</Typography>
        <Chip label={user?.role?.replace('_', ' ').toUpperCase()} color="primary" size="small" sx={{ mt: 1 }} />
      </Paper>

      {/* Personal Information */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Personal Information</Typography>
          <Button
            startIcon={isEditing ? <CancelIcon /> : <EditIcon />}
            onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
            color={isEditing ? 'error' : 'primary'}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Full Name"
              value={formData.fullName}
              disabled={!isEditing}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={formData.email}
              disabled={!isEditing}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone Number"
              value={formData.phone}
              disabled={!isEditing}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Department"
              value={formData.department}
              disabled={!isEditing}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
          </Grid>
        </Grid>
        {isEditing && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
              Save Changes
            </Button>
          </Box>
        )}
      </Paper>

      {/* Change Password */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Change Password</Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Current Password"
              type={showPassword ? 'text' : 'password'}
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              error={passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== ''}
              helperText={passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== '' ? 'Passwords do not match' : ''}
            />
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button variant="outlined" onClick={handlePasswordChange}>
            Update Password
          </Button>
        </Box>
      </Paper>

      {/* Notification Preferences */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Notification Preferences</Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={<Switch checked={notifications.emailAlerts} onChange={(e) => setNotifications({ ...notifications, emailAlerts: e.target.checked })} />}
              label="Email Alerts"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={<Switch checked={notifications.pushNotifications} onChange={(e) => setNotifications({ ...notifications, pushNotifications: e.target.checked })} />}
              label="Push Notifications"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={<Switch checked={notifications.smsAlerts} onChange={(e) => setNotifications({ ...notifications, smsAlerts: e.target.checked })} />}
              label="SMS Alerts"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={<Switch checked={notifications.criticalAlertsOnly} onChange={(e) => setNotifications({ ...notifications, criticalAlertsOnly: e.target.checked })} />}
              label="Critical Alerts Only"
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};