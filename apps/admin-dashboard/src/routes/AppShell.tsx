import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { DashboardLayout, Sidebar } from '@citiscope/ui';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import type { AppDispatch } from '../store/store';

const NAV_ITEMS = [
  { id: '/', label: 'Dashboard', icon: '📊' },
  { id: '/map', label: 'Map', icon: '🗺️' },
  { id: '/issues', label: 'Issues', icon: '📋' },
  { id: '/analytics', label: 'Analytics', icon: '📈' },
  { id: '/iot', label: 'IoT Sensors', icon: '📡' },
];

export const AppShell: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  return (
    <DashboardLayout
      sidebar={
        <Sidebar
          items={NAV_ITEMS}
          activeId={location.pathname}
          logo={<span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>CitiScope</span>}
          onItemClick={item => navigate(item.id)}
        />
      }
    >
      <Outlet />
    </DashboardLayout>
  );
};
