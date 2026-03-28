import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_BASE = process.env.REACT_APP_API_URL || '/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);

  // Set axios default auth header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const fetchCurrentUser = useCallback(async () => {
    if (!token) { setLoading(false); return; }
    try {
      const res = await axios.get(`${API_BASE}/auth/me`);
      setUser(res.data.user);
    } catch {
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchCurrentUser(); }, [fetchCurrentUser]);

  const login = async (email, password) => {
    const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    setUser(userData);
    return res.data;
  };

  const register = async (formData) => {
    const res = await axios.post(`${API_BASE}/auth/register`, formData);
    return res.data;
  };

  const logout = async () => {
    try { await axios.post(`${API_BASE}/auth/logout`); } catch {}
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
