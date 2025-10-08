'use client';

import { createContext, ReactNode, useContext, useEffect } from 'react';

// Simplified Theme Context - Dark Mode Only
interface ThemeContextType {
  theme: 'dark';
  resolvedTheme: 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  useEffect(() => {
    // Ensure dark class is always applied
    const root = window.document.documentElement;
    root.classList.add('dark');
    root.classList.remove('light');
  }, []);

  const value: ThemeContextType = {
    theme: 'dark',
    resolvedTheme: 'dark',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}
