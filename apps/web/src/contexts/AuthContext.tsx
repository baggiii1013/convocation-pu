'use client';

import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { createContext, ReactNode, useContext, useState } from 'react';

/**
 * Minimal user information for client-side display
 * No sensitive data or auth tokens
 */
export interface UserInfo {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'STAFF' | 'STUDENT';
  profileImageURL?: string;
}

/**
 * Simplified auth context - only for displaying user info
 * Authentication logic lives server-side
 */
export interface AuthContextType {
  user: UserInfo | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  initialUser?: UserInfo | null;
}

/**
 * Lightweight Auth Provider
 * 
 * This provider:
 * - Accepts initial user data from the server (via layout.tsx)
 * - Provides logout functionality
 * - Does NOT handle authentication, loading states, or role checks
 * 
 * All auth logic happens server-side using Phase 2 utilities
 */
export function AuthProvider({ children, initialUser = null }: AuthProviderProps) {
  const [user, setUser] = useState<UserInfo | null>(initialUser);
  const router = useRouter();

  /**
   * Logout function
   * Calls the server logout endpoint and clears local state
   */
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

  const value: AuthContextType = {
    user,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth context
 * Only provides user info and logout - no auth logic
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
