import React, { useEffect } from 'react';
import toast, { Toaster, ToastOptions } from 'react-hot-toast';
import { Box, Typography, IconButton } from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

const toastIcons = {
  success: <SuccessIcon sx={{ color: '#4caf50' }} />,
  error: <ErrorIcon sx={{ color: '#f44336' }} />,
  warning: <WarningIcon sx={{ color: '#ff9800' }} />,
  info: <InfoIcon sx={{ color: '#2196f3' }} />,
};

const CustomToast: React.FC<ToastProps & { onClose: () => void }> = ({
  type,
  title,
  message,
  onClose,
}) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 1.5,
      minWidth: 300,
      maxWidth: 400,
      p: 2,
      bgcolor: 'background.paper',
      borderRadius: 2,
      boxShadow: 3,
      borderLeft: `4px solid ${
        type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : type === 'warning' ? '#ff9800' : '#2196f3'
      }`,
    }}
  >
    {toastIcons[type]}
    <Box sx={{ flex: 1 }}>
      <Typography variant="subtitle2" fontWeight="bold">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
    <IconButton size="small" onClick={onClose}>
      <CloseIcon fontSize="small" />
    </IconButton>
  </Box>
);

export const showToast = ({ type, title, message, duration = 5000 }: ToastProps) => {
  toast.custom(
    (t) => (
      <CustomToast
        type={type}
        title={title}
        message={message}
        onClose={() => toast.dismiss(t.id)}
      />
    ),
    { duration }
  );
};

export const ToastNotifications: React.FC = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 5000,
        style: { background: 'transparent', boxShadow: 'none', padding: 0 },
      }}
    />
  );
};