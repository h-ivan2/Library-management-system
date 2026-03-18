import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // For testing - set a dummy user immediately
  useEffect(() => {
    // This is just for testing - remove in production
    setUser({
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'admin'
    });
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock login for testing
    if (email === 'admin@library.com' && password === 'admin123') {
      setUser({
        id: '1',
        name: 'Admin User',
        email: 'admin@library.com',
        role: 'admin'
      });
      toast.success('Login successful!');
      return true;
    } else if (email === 'user@library.com' && password === 'user123') {
      setUser({
        id: '2',
        name: 'Test User',
        email: 'user@library.com',
        role: 'user'
      });
      toast.success('Login successful!');
      return true;
    } else {
      toast.error('Invalid credentials');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};