import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRole }) {
  const { isAuthenticated, role, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Strict role-based isolation check
  if (allowedRole && role !== allowedRole) {
    // If participant tries to access organiser portal, send back to participant dashboard
    if (role === 'participant') {
      return <Navigate to="/participant/dashboard" replace />;
    }
    // If organiser tries to access participant portal, send back to organiser dashboard
    if (role === 'organiser') {
      return <Navigate to="/organiser/dashboard" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
}

