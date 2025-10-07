/**
 * Color Tokens - District.in Inspired Palette
 * 
 * Primary: Purple (#6D49FD) - Main brand color
 * Accents: Blue, Pink, Green, Orange, Red
 * Neutrals: Dark theme optimized
 */

export const colors = {
  // Primary Purple Palette (District.in signature color)
  primary: {
    50: '#F5F3FF',   // Lightest purple tint
    100: '#EDE9FE',  // Very light purple
    200: '#DDD6FE',  // Light purple
    300: '#C4B5FD',  // Medium-light purple
    400: '#A78BFA',  // Medium purple
    500: '#6D49FD',  // MAIN BRAND COLOR
    600: '#5938D6',  // Dark purple
    700: '#4527B8',  // Darker purple
    800: '#3B1F9A',  // Very dark purple
    900: '#2E1765',  // Deepest purple
  },

  // Accent Colors
  accent: {
    blue: '#00D4FF',    // Electric blue
    pink: '#FF4D8F',    // Vibrant pink
    green: '#00E676',   // Success green
    orange: '#FF9800',  // Warning orange
    red: '#FF3B30',     // Error red
  },

  // Neutral Colors - Dark Theme
  dark: {
    bg: '#0A0A0F',           // Darkest background
    surface: '#1A1A24',       // Surface/elevated bg
    card: '#242433',          // Card background
    border: '#2D2D40',        // Border color
    hover: '#2F2F45',         // Hover state
    disabled: '#1F1F2E',      // Disabled state
  },

  // Neutral Colors - Light Theme
  light: {
    bg: '#FFFFFF',            // White background
    surface: '#F8F9FB',       // Light surface
    card: '#FFFFFF',          // Card background
    border: '#E5E7EB',        // Border color
    hover: '#F3F4F6',         // Hover state
    disabled: '#F9FAFB',      // Disabled state
  },

  // Text Colors
  text: {
    primary: {
      light: '#0A0A0F',       // Dark text on light bg
      dark: '#FFFFFF',         // White text on dark bg
    },
    secondary: {
      light: '#6B7280',       // Gray text on light bg
      dark: '#A0A0B8',         // Light gray text on dark bg
    },
    muted: {
      light: '#9CA3AF',       // Muted text on light bg
      dark: '#6B7280',         // Muted text on dark bg
    },
    disabled: {
      light: '#D1D5DB',       // Disabled text light
      dark: '#4B5563',         // Disabled text dark
    },
  },

  // Semantic Colors
  semantic: {
    success: {
      light: '#00E676',
      dark: '#00C853',
      bg: 'rgba(0, 230, 118, 0.1)',
      border: 'rgba(0, 230, 118, 0.3)',
    },
    warning: {
      light: '#FF9800',
      dark: '#F57C00',
      bg: 'rgba(255, 152, 0, 0.1)',
      border: 'rgba(255, 152, 0, 0.3)',
    },
    error: {
      light: '#FF3B30',
      dark: '#D32F2F',
      bg: 'rgba(255, 59, 48, 0.1)',
      border: 'rgba(255, 59, 48, 0.3)',
    },
    info: {
      light: '#00D4FF',
      dark: '#00B8D4',
      bg: 'rgba(0, 212, 255, 0.1)',
      border: 'rgba(0, 212, 255, 0.3)',
    },
  },

  // Gradients (as strings for use in CSS)
  gradients: {
    // Primary purple gradient
    primary: 'linear-gradient(135deg, #6D49FD 0%, #8B6DFF 100%)',
    
    // Purple to pink
    accent: 'linear-gradient(135deg, #6D49FD 0%, #FF4D8F 100%)',
    
    // Hero background
    hero: 'linear-gradient(180deg, rgba(109, 73, 253, 0.1) 0%, rgba(0, 0, 0, 0) 100%)',
    
    // Card subtle gradient
    card: 'linear-gradient(135deg, rgba(109, 73, 253, 0.05) 0%, rgba(139, 109, 255, 0.05) 100%)',
    
    // Glassmorphism overlay
    glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
    
    // Shimmer effect for loading
    shimmer: 'linear-gradient(90deg, rgba(109, 73, 253, 0.05) 0%, rgba(109, 73, 253, 0.15) 50%, rgba(109, 73, 253, 0.05) 100%)',
  },

  // Overlay colors (for modals, backdrops)
  overlay: {
    light: 'rgba(0, 0, 0, 0.5)',
    dark: 'rgba(0, 0, 0, 0.7)',
    blur: 'rgba(10, 10, 15, 0.8)',
  },
} as const;

// Type exports for TypeScript
export type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
export type PrimaryColor = typeof colors.primary;
export type AccentColor = typeof colors.accent;
export type Theme = 'light' | 'dark';

// Helper function to get color with alpha
export function withAlpha(color: string, alpha: number): string {
  // Convert hex to rgba
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Export individual color palettes for easier imports
export const primaryColors = colors.primary;
export const accentColors = colors.accent;
export const darkColors = colors.dark;
export const lightColors = colors.light;
export const textColors = colors.text;
export const semanticColors = colors.semantic;
export const gradients = colors.gradients;
