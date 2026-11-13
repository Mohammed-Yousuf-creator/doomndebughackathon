import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import ParticipantDashboard from './pages/participant/ParticipantDashboard';
import OrganiserDashboard from './pages/organiser/OrganiserDashboard';

function RootRedirect() {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'participant') {
    return <Navigate to="/participant/dashboard" replace />;
  }

  if (role === 'organiser') {
    return <Navigate to="/organiser/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Login Page */}
          <Route path="/login" element={<LoginPage />} />

          {/* Participant Isolated Portal (Protected) */}
          <Route
            path="/participant/*"
            element={
              <ProtectedRoute allowedRole="participant">
                <ParticipantDashboard />
              </ProtectedRoute>
            }
          />

          {/* Organiser / Sponsor Isolated Portal (Protected) */}
          <Route
            path="/organiser/*"
            element={
              <ProtectedRoute allowedRole="organiser">
                <OrganiserDashboard />
              </ProtectedRoute>
            }
          />

          {/* Root & Catch-All Redirects */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
