import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import { AppInitializer } from './AppInitializer';
import { LoginPage } from './pages/auth/LoginPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { MapViewPage } from './pages/map/MapViewPage';
import { AnalyticsPage } from './pages/analytics/AnalyticsPage';
import { PredictiveAnalyticsPage } from './pages/analytics/PredictiveAnalyticsPage';
import { IssuesPage } from './pages/issues/IssuesPage';
import { IoTPage } from './pages/iot/IoTPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { ReportPage } from './pages/reports/ReportPage';
import { ActivityLogPage } from './pages/admin/ActivityLogPage';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { ToastNotifications } from './components/notifications/ToastNotifications';
import { IssueDetailModal } from './components/modals/IssueDetailModal';
import { HelpWidget } from './components/common/HelpWidget';

function AppContent() {
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading application..." />;
  }

  return (
    <BrowserRouter>
      <ToastNotifications />
      <IssueDetailModal />
      <HelpWidget />
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
        />
        <Route element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />}>
          <Route path="/"           element={<DashboardPage />} />
          <Route path="/map"        element={<MapViewPage />} />
          <Route path="/analytics"  element={<AnalyticsPage />} />
          <Route path="/predictive" element={<PredictiveAnalyticsPage />} />
          <Route path="/issues"     element={<IssuesPage />} />
          <Route path="/iot"        element={<IoTPage />} />
          <Route path="/profile"    element={<ProfilePage />} />
          <Route path="/reports"    element={<ReportPage />} />
          <Route path="/activity"   element={<ActivityLogPage />} />
          <Route path="*"           element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AppInitializer>
        <AppContent />
      </AppInitializer>
    </ErrorBoundary>
  );
}

export default App;
