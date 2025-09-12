'use client';

import api from '@/lib/axios';
import axios from 'axios';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

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
      
      const response = await api.post('/api/v1/auth/login', {
        email,
        password,
      });

      const { user: userData } = response.data.data;

      // Set user data (no need to store tokens - they're in httpOnly cookies)
      setUser({
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        displayName: userData.displayName || `${userData.firstName} ${userData.lastName}`,
        role: userData.role.toUpperCase() as 'ADMIN' | 'STAFF' | 'STUDENT',
        profileImageURL: userData.profileImageURL,
        accountState: userData.accountState || 'ACTIVE',
        isActive: userData.isActive !== false,
      });
    } catch (error: unknown) {
      console.error('Login error:', error);
      
      // Clear any existing user state
      setUser(null);
      
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
      await api.post('/api/v1/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear user state (cookies are cleared server-side)
      setUser(null);
      // Redirect to homepage
      router.push('/');
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to get user profile - if cookies are valid, this will succeed
        const response = await api.get('/api/v1/auth/profile');
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
        // Only log error if it's not a 401 (which is expected when not logged in)
        if (axios.isAxiosError(error) && error.response?.status !== 401) {
          console.error('Auth check error:', error);
        }
        
        // Clear user state if authentication fails
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
