/**
 * ============================================
 * AUTH CONTEXT & PROVIDER
 * ============================================
 * Global authentication state management
 * Manages user login, logout, role-based access
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config';

const AuthContext = createContext(null);

/**
 * Auth Provider Component
 * Wraps entire app to provide auth context
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (token) {
          const response = await axios.get(API_ENDPOINTS.GET_CURRENT_USER, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data.data.user);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        localStorage.removeItem('token');
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [token]);

  /**
   * Register new user
   */
  const register = async (role, userData) => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = {
        farmer: API_ENDPOINTS.REGISTER_FARMER,
        buyer: API_ENDPOINTS.REGISTER_BUYER,
        transporter: API_ENDPOINTS.REGISTER_TRANSPORTER
      }[role];

      const response = await axios.post(endpoint, userData);

      setToken(response.data.data.token);
      setUser(response.data.data.user);
      localStorage.setItem('token', response.data.data.token);

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login user
   */
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(API_ENDPOINTS.LOGIN, { email, password });

      setToken(response.data.data.token);
      setUser(response.data.data.user);
      localStorage.setItem('token', response.data.data.token);

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth Hook
 * Use this hook to access auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
