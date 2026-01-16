'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '@/lib/api';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  avatar: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    const storedAvatar = localStorage.getItem('avatar');
    if (token && storedUsername) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
      setAvatar(storedAvatar);
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const response = await authApi.login(username, password);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('username', response.data.username);
    setIsAuthenticated(true);
    setUsername(response.data.username);
  };

  const register = async (username: string, password: string) => {
    const response = await authApi.register(username, password);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('username', response.data.username);
    setIsAuthenticated(true);
    setUsername(response.data.username);
  };

  const googleLogin = async (credential: string) => {
    const response = await authApi.googleLogin(credential);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('username', response.data.username);
    if (response.data.avatar) {
      localStorage.setItem('avatar', response.data.avatar);
      setAvatar(response.data.avatar);
    }
    setIsAuthenticated(true);
    setUsername(response.data.username);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('avatar');
    setIsAuthenticated(false);
    setUsername(null);
    setAvatar(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, avatar, login, register, googleLogin, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
