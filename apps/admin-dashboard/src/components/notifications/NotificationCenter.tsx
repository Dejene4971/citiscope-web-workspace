import React, { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Divider,
  Button,
  Chip,
  Tabs,
  Tab,
  Avatar,
  alpha,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  DoneAll as DoneAllIcon,
} from '@mui/icons-material';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionable?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

interface NotificationCenterProps {
  maxNotifications?: number;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ maxNotifications = 50 }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Mock initial notifications
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'warning',
        title: 'High Water Pressure',
        message: 'Sensor SEN-001 detected pressure above critical threshold',
        timestamp: new Date(),
        read: false,
      },
      {
        id: '2',
        type: 'success',
        title: 'Issue Resolved',
        message: 'Issue ISS-002 has been marked as resolved',
        timestamp: new Date(Date.now() - 3600000),
        read: false,
      },
      {
        id: '3',
        type: 'error',
        title: 'Connection Lost',
        message: 'IoT sensor network connection interrupted',
        timestamp: new Date(Date.now() - 7200000),
        read: true,
      },
    ];
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckIcon sx={{ color: '#4caf50' }} />;
      case 'warning':
        return <WarningIcon sx={{ color: '#ff9800' }} />;
      case 'error':
        return <ErrorIcon sx={{ color: '#f44336' }} />;
      default:
        return <InfoIcon sx={{ color: '#2196f3' }} />;
    }
  };

  const filteredNotifications = notifications.filter(n =>
    activeTab === 0 ? true : activeTab === 1 ? !n.read : n.read
  );

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 400, maxHeight: 500, overflow: 'hidden' },
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Notifications</Typography>
            <Box>
              <IconButton size="small" onClick={handleMarkAllAsRead} title="Mark all as read">
                <DoneAllIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={handleClearAll} title="Clear all">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mt: 1 }}>
            <Tab label="All" />
            <Tab label="Unread" />
            <Tab label="Read" />
          </Tabs>
        </Box>

        {filteredNotifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <NotificationsIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography color="text.secondary">No notifications</Typography>
          </Box>
        ) : (
          <>
            <List sx={{ overflow: 'auto', maxHeight: 350 }}>
              {filteredNotifications.slice(0, maxNotifications).map((notif) => (
                <ListItem
                  key={notif.id}
                  sx={{
                    bgcolor: notif.read ? 'transparent' : alpha('#2196f3', 0.05),
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                  secondaryAction={
                    <IconButton edge="end" size="small" onClick={() => handleDelete(notif.id)}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemIcon>{getIcon(notif.type)}</ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight={notif.read ? 'normal' : 'bold'}>
                          {notif.title}
                        </Typography>
                        {!notif.read && <Chip label="New" size="small" color="primary" sx={{ height: 18 }} />}
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="caption" color="text.secondary">
                          {notif.message}
                        </Typography>
                        <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                          {new Date(notif.timestamp).toLocaleTimeString()}
                        </Typography>
                      </>
                    }
                    onClick={() => handleMarkAsRead(notif.id)}
                    sx={{ cursor: 'pointer' }}
                  />
                </ListItem>
              ))}
            </List>
            <Divider />
            <Box sx={{ p: 1, textAlign: 'center' }}>
              <Button size="small" onClick={handleClose}>
                Close
              </Button>
            </Box>
          </>
        )}
      </Popover>
    </>
  );
};