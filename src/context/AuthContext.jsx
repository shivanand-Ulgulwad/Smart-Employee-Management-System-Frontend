/**
 * AuthContext – manages JWT auth state, login, logout, and security.
 * Token stored under key 'ems_token' in localStorage.
 */
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { loginApi, forgotPasswordApi } from '../api/authApi';

const AuthContext = createContext(null);

/* Helper: decode JWT payload (without verification) */
function decodeJwtPayload(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

const MAX_FAILED_ATTEMPTS = 3;

export function AuthProvider({ children }) {
  const [user, setUser]               = useState(() => {
    const saved = localStorage.getItem('ems_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken]             = useState(() => localStorage.getItem('ems_token') || null);
  const [failedAttempts, setFailed]   = useState(0);
  const [isLocked, setIsLocked]       = useState(false);
  const [loading, setLoading]         = useState(false);

  /* Persist token */
  useEffect(() => {
    if (token) localStorage.setItem('ems_token', token);
    else localStorage.removeItem('ems_token');
  }, [token]);

  const isAuthenticated = !!token;

  /** Login – returns { success, message } */
  const login = useCallback(async (username, password) => {
    if (isLocked) return { success: false, message: 'Account locked. Too many failed attempts.' };
    setLoading(true);
    try {
      const res = await loginApi({ username, password });
      const jwt = res.data?.token;
      if (!jwt) throw new Error('No token received');

      const payload = decodeJwtPayload(jwt);
      const userData = {
        username: payload?.sub || username,
        role: payload?.role || 'ADMIN',
        name: payload?.name || username,
      };

      setToken(jwt);
      setUser(userData);
      localStorage.setItem('ems_user', JSON.stringify(userData));
      setFailed(0);
      setIsLocked(false);
      return { success: true };
    } catch (err) {
      const newFails = failedAttempts + 1;
      setFailed(newFails);
      if (newFails >= MAX_FAILED_ATTEMPTS) setIsLocked(true);
      const msg = err?.response?.data?.message || 'Invalid credentials.';
      return { success: false, message: msg, attemptsLeft: MAX_FAILED_ATTEMPTS - newFails };
    } finally {
      setLoading(false);
    }
  }, [failedAttempts, isLocked]);

  /** Logout */
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('ems_token');
    localStorage.removeItem('ems_user');
  }, []);

  /** Forgot password */
  const forgotPassword = useCallback(async (data) => {
    try {
      const res = await forgotPasswordApi(data);
      return { success: true, message: res.data?.message || 'Password reset successful.' };
    } catch (err) {
      return { success: false, message: err?.response?.data?.message || 'Reset failed.' };
    }
  }, []);

  /** Check if user has a certain role */
  const hasRole = useCallback((role) => user?.role === role, [user]);

  const value = { user, token, isAuthenticated, isLocked, failedAttempts, loading, login, logout, forgotPassword, hasRole };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
