'use client';

import api from '@/lib/axios';
import axios from 'axios';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  role: 'ADMIN' | 'STAFF' | 'STUDENT';
  profileImageURL?: string;
  accountState: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
  isActive: boolean;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (roles: string | string[]) => boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Check if user has specific role(s)
  const hasRole = (roles: string | string[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      
      const response = await api.post('/api/auth/login', {
        email,
        password,
      });

      const { accessToken, refreshToken, account } = response.data.data;

      // Store tokens
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Set user data
      setUser({
        id: account.id,
        email: account.email,
        firstName: account.firstName,
        lastName: account.lastName,
        displayName: account.displayName,
        role: account.role,
        profileImageURL: account.profileImageURL,
        accountState: account.accountState,
        isActive: account.isActive,
      });
    } catch (error: unknown) {
      console.error('Login error:', error);
      
      // Clear any existing tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 'Login failed. Please try again.'
        );
      }
      throw new Error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call logout endpoint to invalidate token on server
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and user state
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          setLoading(false);
          return;
        }

        // Verify token and get user data
        const response = await api.get('/api/auth/profile');
        const userData = response.data.data;

        setUser({
          id: userData.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          displayName: userData.displayName,
          role: userData.role,
          profileImageURL: userData.profileImageURL,
          accountState: userData.accountState,
          isActive: userData.isActive,
        });
      } catch (error) {
        console.error('Auth check error:', error);
        
        // Clear invalid tokens
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
