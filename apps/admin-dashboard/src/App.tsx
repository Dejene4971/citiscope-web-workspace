import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import { LoginPage } from './pages/auth/LoginPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { MapViewPage } from './pages/map/MapViewPage';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LoadingSpinner } from './components/common/LoadingSpinner';

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
            <Route path="/analytics" element={<div>Analytics Page</div>} />
            <Route path="/issues" element={<div>Issues Page</div>} />
            <Route path="/iot" element={<div>IoT Sensors Page</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;