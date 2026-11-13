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

  const login = async (email, password, roleType) => {
    setLoading(true);
    try {
      const res = await api.loginUser(email, password, roleType);
      setUser(res.user);
      setToken(res.token);
      return { success: true, user: res.user };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, name, roleType) => {
    setLoading(true);
    try {
      const res = await api.registerUser(email, password, name, roleType);
      setUser(res.user);
      setToken(res.token);
      return { success: true, user: res.user };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (email, name, roleType, googleId, avatarUrl) => {
    setLoading(true);
    try {
      const res = await api.googleAuthUser(email, name, roleType, googleId, avatarUrl);
      setUser(res.user);
      setToken(res.token);
      return { success: true, user: res.user };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const githubLogin = async (email, name, roleType, githubUsername, avatarUrl) => {
    setLoading(true);
    try {
      const res = await api.githubAuthUser(email, name, roleType, githubUsername, avatarUrl);
      setUser(res.user);
      setToken(res.token);
      return { success: true, user: res.user };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const logout = async () => {
    try {
      if (token) await api.logoutUser(token);
    } catch {
      // ignore
    }
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    role: user?.role_type || null,
    isAuthenticated: !!user && !!token,
    loading,
    login,
    register,
    googleLogin,
    githubLogin,
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

