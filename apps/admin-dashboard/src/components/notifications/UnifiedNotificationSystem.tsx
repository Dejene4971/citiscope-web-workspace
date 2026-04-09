import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Badge, IconButton, Popover, Box, Typography, List, ListItem,
  ListItemIcon, ListItemText, Chip, Divider, Button, Tabs, Tab,
} from '@mui/material';
import {
  Notifications, CheckCircle, Warning, Error, Info,
  DoneAll, Delete, Close,
} from '@mui/icons-material';
import { showToast } from './ToastNotifications';
import {
  markNotificationRead, markAllRead, clearNotifications,
} from '../../features/ui/uiSlice';
import type { RootState, AppDispatch } from '../../store/store';

const ICON_MAP = {
  success: <CheckCircle sx={{ color: '#4caf50' }} />,
  warning: <Warning sx={{ color: '#ff9800' }} />,
  error:   <Error   sx={{ color: '#f44336' }} />,
  info:    <Info    sx={{ color: '#2196f3' }} />,
};

/**
 * Unified notification bell — reads from Redux ui.notifications.
 * Also shows toast for every new notification automatically.
 */
export const UnifiedNotificationSystem: React.FC = React.memo(() => {
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, unreadCount } = useSelector((s: RootState) => s.ui);
  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);
  const [tab, setTab] = React.useState(0);
  const prevCountRef = useRef(unreadCount);

  // Auto-toast every new notification
  useEffect(() => {
    if (unreadCount > prevCountRef.current && notifications.length > 0) {
      const latest = notifications[0];
      showToast({
        type: latest.type,
        title: latest.title,
        message: latest.message,
        duration: latest.type === 'error' ? 8000 : 5000,
      });
    }
    prevCountRef.current = unreadCount;
  }, [unreadCount, notifications]);

  const filtered = notifications.filter(n =>
    tab === 0 ? true : tab === 1 ? !n.read : n.read
  );

  return (
    <>
      <IconButton color="inherit" onClick={e => setAnchor(e.currentTarget)}>
        <Badge badgeContent={unreadCount} color="error">
          <Notifications />
        </Badge>
      </IconButton>

      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { width: 400, maxHeight: 520, display: 'flex', flexDirection: 'column' } }}
      >
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Notifications</Typography>
            <Box>
              <IconButton size="small" title="Mark all read" onClick={() => dispatch(markAllRead())}>
                <DoneAll fontSize="small" />
              </IconButton>
              <IconButton size="small" title="Clear all" onClick={() => dispatch(clearNotifications())}>
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mt: 1 }}>
            <Tab label={`All (${notifications.length})`} />
            <Tab label={`Unread (${unreadCount})`} />
            <Tab label="Read" />
          </Tabs>
        </Box>

        {/* List */}
        {filtered.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center', flex: 1 }}>
            <Notifications sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography color="text.secondary">No notifications</Typography>
          </Box>
        ) : (
          <List sx={{ flex: 1, overflowY: 'auto' }}>
            {filtered.map(n => (
              <ListItem
                key={n.id}
                sx={{ bgcolor: n.read ? 'transparent' : 'action.selected', '&:hover': { bgcolor: 'action.hover' } }}
                secondaryAction={
                  <IconButton size="small" onClick={() => dispatch(markNotificationRead(n.id))}>
                    <Close fontSize="small" />
                  </IconButton>
                }
                onClick={() => dispatch(markNotificationRead(n.id))}
              >
                <ListItemIcon>{ICON_MAP[n.type]}</ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight={n.read ? 400 : 700}>{n.title}</Typography>
                      {!n.read && <Chip label="New" size="small" color="primary" sx={{ height: 16, fontSize: 10 }} />}
                      <Chip label={n.source} size="small" variant="outlined" sx={{ height: 16, fontSize: 10 }} />
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="caption" color="text.secondary">{n.message}</Typography>
                      <Typography variant="caption" display="block" color="text.disabled">
                        {new Date(n.timestamp).toLocaleTimeString()}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}

        <Divider />
        <Box sx={{ p: 1, textAlign: 'center' }}>
          <Button size="small" onClick={() => setAnchor(null)}>Close</Button>
        </Box>
      </Popover>
    </>
  );
});

UnifiedNotificationSystem.displayName = 'UnifiedNotificationSystem';
