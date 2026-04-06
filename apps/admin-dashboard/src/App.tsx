import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import { LoginPage } from './pages/auth/LoginPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { MapViewPage } from './pages/map/MapViewPage';
import { AnalyticsPage } from './pages/analytics/AnalyticsPage';
import { PredictiveAnalyticsPage } from './pages/analytics/PredictiveAnalyticsPage';
import { IssuesPage } from './pages/issues/IssuesPage';
import { IoTPage } from './pages/iot/IoTPage';
import { ProfilePage } from './pages/profile/ProfilePage';

import { DashboardLayout } from './layouts/DashboardLayout';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { ToastNotifications } from './components/notifications/ToastNotifications';

function App() {
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading application..." />;
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/" /> : <LoginPage />
          } />
          
          <Route element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/map" element={<MapViewPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/predictive" element={<PredictiveAnalyticsPage />} />
            <Route path="/issues" element={<IssuesPage />} />
            <Route path="/iot" element={<IoTPage />} />
            <Route path="/profile" element={<ProfilePage />} />

          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;