import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const normalizeRole = (r) => {
  if (!r) return null;
  const clean = String(r).toLowerCase().trim();
  if (clean === 'organizer' || clean === 'organiser') return 'organiser';
  return 'participant';
};

export default function ProtectedRoute({ children, allowedRole }) {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const currentRole = normalizeRole(role);
  const targetAllowedRole = normalizeRole(allowedRole);

  // Strict role-based isolation check
  if (targetAllowedRole && currentRole !== targetAllowedRole) {
    // If participant tries to access organiser portal, send back to participant dashboard
    if (currentRole === 'participant') {
      return <Navigate to="/participant/dashboard" replace />;
    }
    // If organiser tries to access participant portal, send back to organiser dashboard
    if (currentRole === 'organiser') {
      return <Navigate to="/organiser/dashboard" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
}
