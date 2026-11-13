import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('aegis_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('aegis_auth_token') || null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && token) {
      localStorage.setItem('aegis_auth_user', JSON.stringify(user));
      localStorage.setItem('aegis_auth_token', token);
    } else {
      localStorage.removeItem('aegis_auth_user');
      localStorage.removeItem('aegis_auth_token');
    }
  }, [user, token]);

  const normalizeRole = (r) => {
    if (!r) return 'participant';
    const clean = String(r).toLowerCase().trim();
    if (clean === 'organizer' || clean === 'organiser') return 'organiser';
    return 'participant';
  };

  const login = async (email, password, roleType) => {
    setLoading(true);
    try {
      const targetRole = normalizeRole(roleType);
      const res = await api.loginUser(email, password, targetRole);
      const cleanUser = {
        ...res.user,
        role_type: targetRole
      };
      setUser(cleanUser);
      setToken(res.token);
      localStorage.setItem('aegis_auth_user', JSON.stringify(cleanUser));
      localStorage.setItem('aegis_auth_token', res.token);
      return { success: true, user: cleanUser };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, name, roleType) => {
    setLoading(true);
    try {
      const targetRole = normalizeRole(roleType);
      const res = await api.registerUser(email, password, name, targetRole);
      const cleanUser = {
        ...res.user,
        role_type: targetRole
      };
      setUser(cleanUser);
      setToken(res.token);
      localStorage.setItem('aegis_auth_user', JSON.stringify(cleanUser));
      localStorage.setItem('aegis_auth_token', res.token);
      return { success: true, user: cleanUser };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (email, name, roleType, googleId, avatarUrl) => {
    setLoading(true);
    try {
      const targetRole = normalizeRole(roleType);
      const res = await api.googleAuthUser(email, name, targetRole, googleId, avatarUrl);
      const cleanUser = {
        ...res.user,
        role_type: targetRole
      };
      setUser(cleanUser);
      setToken(res.token);
      localStorage.setItem('aegis_auth_user', JSON.stringify(cleanUser));
      localStorage.setItem('aegis_auth_token', res.token);
      return { success: true, user: cleanUser };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const githubLogin = async (email, name, roleType, githubUsername, avatarUrl) => {
    setLoading(true);
    try {
      const targetRole = normalizeRole(roleType);
      const res = await api.githubAuthUser(email, name, targetRole, githubUsername, avatarUrl);
      const cleanUser = {
        ...res.user,
        role_type: targetRole
      };
      setUser(cleanUser);
      setToken(res.token);
      localStorage.setItem('aegis_auth_user', JSON.stringify(cleanUser));
      localStorage.setItem('aegis_auth_token', res.token);
      return { success: true, user: cleanUser };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const switchRole = (newRole) => {
    const cleanRole = normalizeRole(newRole);
    if (user) {
      const updated = { ...user, role_type: cleanRole };
      setUser(updated);
      localStorage.setItem('aegis_auth_user', JSON.stringify(updated));
    }
  };

  const updateUser = (updatedUser) => {
    if (!updatedUser) {
      setUser(null);
      localStorage.removeItem('aegis_auth_user');
      return;
    }
    const cleanUser = {
      ...updatedUser,
      role_type: normalizeRole(updatedUser.role_type)
    };
    setUser(cleanUser);
    localStorage.setItem('aegis_auth_user', JSON.stringify(cleanUser));
  };

  const logout = async () => {
    try {
      if (token) await api.logoutUser(token);
    } catch {
      // ignore
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('aegis_auth_user');
    localStorage.removeItem('aegis_auth_token');
  };

  const currentRole = user ? normalizeRole(user.role_type) : null;

  const value = {
    user,
    token,
    role: currentRole,
    isAuthenticated: !!user && !!token,
    loading,
    login,
    register,
    googleLogin,
    githubLogin,
    switchRole,
    updateUser,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
