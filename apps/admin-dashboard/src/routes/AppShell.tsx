import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar, Toolbar, Typography, IconButton, Avatar,
  Menu, MenuItem, Divider, Box, Tooltip,
} from '@mui/material';
import {
  Notifications, Person, Settings, Logout,
  Dashboard, Map, List, BarChart, Sensors, Menu as MenuIcon,
} from '@mui/icons-material';
import { logout } from '../features/auth/authSlice';
import type { RootState, AppDispatch } from '../store/store';

const NAV_ITEMS = [
  { path: '/',          label: 'Dashboard',   icon: <Dashboard /> },
  { path: '/map',       label: 'Map',         icon: <Map /> },
  { path: '/issues',    label: 'Issues',      icon: <List /> },
  { path: '/analytics', label: 'Analytics',   icon: <BarChart /> },
  { path: '/iot',       label: 'IoT Sensors', icon: <Sensors /> },
];

const SIDEBAR_WIDTH = 220;

export const AppShell: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((s: RootState) => s.auth);
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  // Handle nested user object shape from loginSuccess payload
  const userData = (user as any)?.user ?? user;
  const displayName = userData?.full_name ?? 'Admin';
  const initials = displayName.charAt(0).toUpperCase();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

      {/* ── Sidebar ── */}
      <Box
        component="nav"
        sx={{
          width: sidebarOpen ? SIDEBAR_WIDTH : 64,
          flexShrink: 0,
          bgcolor: '#1e293b',
          color: '#f1f5f9',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.2s ease',
          overflow: 'hidden',
        }}
      >
        {/* Logo */}
        <Box sx={{ p: 2, borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', gap: 1.5, minHeight: 64 }}>
          <Typography sx={{ fontSize: 22 }}>🏙️</Typography>
          {sidebarOpen && (
            <Typography fontWeight={700} fontSize="1rem" noWrap>CitiScope</Typography>
          )}
        </Box>

        {/* Nav items */}
        <Box component="ul" sx={{ listStyle: 'none', m: 0, p: '8px 0', flex: 1 }}>
          {NAV_ITEMS.map(item => {
            const active = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Box
                  component="button"
                  onClick={() => navigate(item.path)}
                  aria-current={active ? 'page' : undefined}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 1.5,
                    width: '100%', px: 2, py: 1.25,
                    background: active ? '#334155' : 'transparent',
                    color: active ? '#fff' : '#94a3b8',
                    border: 'none', borderLeft: active ? '3px solid #3b82f6' : '3px solid transparent',
                    cursor: 'pointer', fontSize: '0.9375rem', fontWeight: active ? 600 : 400,
                    textAlign: 'left', whiteSpace: 'nowrap',
                    '&:hover': { background: '#273549', color: '#fff' },
                    transition: 'all 0.15s',
                  }}
                >
                  <Box sx={{ flexShrink: 0, display: 'flex' }}>{item.icon}</Box>
                  {sidebarOpen && item.label}
                </Box>
              </li>
            );
          })}
        </Box>
      </Box>

      {/* ── Main area ── */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Top AppBar */}
        <AppBar position="static" elevation={0} sx={{ bgcolor: '#fff', color: 'text.primary', borderBottom: '1px solid #e5e7eb' }}>
          <Toolbar>
            <Tooltip title="Toggle sidebar">
              <IconButton onClick={() => setSidebarOpen(o => !o)} edge="start" sx={{ mr: 2 }}>
                <MenuIcon />
              </IconButton>
            </Tooltip>

            <Typography variant="h6" fontWeight={600} sx={{ flex: 1, color: '#111827' }}>
              {NAV_ITEMS.find(n => n.path === location.pathname)?.label ?? 'CitiScope'}
            </Typography>

            <Tooltip title="Notifications">
              <IconButton><Notifications /></IconButton>
            </Tooltip>

            <Tooltip title={displayName}>
              <IconButton onClick={e => setMenuAnchor(e.currentTarget)} sx={{ ml: 1 }}>
                <Avatar sx={{ width: 34, height: 34, bgcolor: '#1976d2', fontSize: '0.9rem' }}>
                  {initials}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>

        {/* User dropdown */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography fontWeight={600}>{displayName}</Typography>
            <Typography variant="caption" color="text.secondary">
              {userData?.role?.replace(/_/g, ' ')}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={() => setMenuAnchor(null)}>
            <Person fontSize="small" sx={{ mr: 1 }} /> Profile
          </MenuItem>
          <MenuItem onClick={() => setMenuAnchor(null)}>
            <Settings fontSize="small" sx={{ mr: 1 }} /> Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <Logout fontSize="small" sx={{ mr: 1 }} /> Logout
          </MenuItem>
        </Menu>

        {/* Page content */}
        <Box component="main" sx={{ flex: 1, overflowY: 'auto', p: 3, bgcolor: '#f8fafc' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
