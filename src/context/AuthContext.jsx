import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import api, { getErrorMessage, setAuthToken } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const loadCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setAuthToken(token);
        const { data } = await api.get('/auth/me');
        const normalizedUser = {
          id: data.user_id,
          name: data.full_name,
          email: data.email,
          role: data.role,
          roleData: data.roleData || null
        };

        localStorage.setItem('user', JSON.stringify(normalizedUser));
        setUser(normalizedUser);
      } catch (error) {
        setAuthToken(null);
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });

      setAuthToken(data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      toast.success('Login successful!');
      return { success: true, user: data.user };
    } catch (error) {
      const message = getErrorMessage(error, 'Login failed');
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await api.post('/auth/register', userData);

      setAuthToken(data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      toast.success('Registration successful!');
      return { success: true, user: data.user };
    } catch (error) {
      const message = getErrorMessage(error, 'Registration failed');
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
