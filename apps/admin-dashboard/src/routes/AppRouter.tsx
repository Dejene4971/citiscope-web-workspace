import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { LoginPage } from '../pages/auth/LoginPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { MapPage } from '../pages/map/MapPage';
import { IssuesPage } from '../pages/issues/IssuesPage';
import { AnalyticsPage } from '../pages/analytics/AnalyticsPage';
import { IoTPage } from '../pages/iot/IoTPage';
import { AppShell } from './AppShell';

function AppRoutes() {
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/"
        element={isAuthenticated ? <AppShell /> : <Navigate to="/login" replace />}
      >
        <Route index element={<DashboardPage />} />
        <Route path="map" element={<MapPage />} />
        <Route path="issues" element={<IssuesPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="iot" element={<IoTPage />} />
      </Route>
    </Routes>
  );
}

export const AppRouter: React.FC = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);
