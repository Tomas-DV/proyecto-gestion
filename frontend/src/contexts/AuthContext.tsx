'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthResponse, LoginRequest, RegisterRequest, apiService } from '@/services/api';
import { authStorage, StoredUser, tokenUtils } from '@/utils/auth';

interface AuthContextType {
  user: StoredUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = () => {
    const token = authStorage.getToken();
    const storedUser = authStorage.getUser();

    if (token && storedUser && !tokenUtils.isTokenExpired(token)) {
      setUser(storedUser);
    } else {
      authStorage.clearAuth();
      setUser(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const response: AuthResponse = await apiService.login(credentials);
      
      authStorage.setAuth(response);
      setUser({
        id: response.id,
        username: response.username,
        email: response.email,
        role: response.role,
      });
    } catch (error) {
      throw error; // Re-throw to handle in component
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const response: AuthResponse = await apiService.register(userData);
      
      authStorage.setAuth(response);
      setUser({
        id: response.id,
        username: response.username,
        email: response.email,
        role: response.role,
      });
    } catch (error) {
      throw error; // Re-throw to handle in component
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authStorage.clearAuth();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
