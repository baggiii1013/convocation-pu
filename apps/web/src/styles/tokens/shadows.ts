/**
 * Shadow Tokens
 * 
 * Elevation system with purple-tinted shadows
 * inspired by District.in's design language
 */

export const shadows = {
  // Standard elevation shadows (purple-tinted)
  none: 'none',
  
  sm: '0 1px 2px 0 rgba(109, 73, 253, 0.05)',
  
  md: '0 4px 6px -1px rgba(109, 73, 253, 0.1), 0 2px 4px -1px rgba(109, 73, 253, 0.06)',
  
  lg: '0 10px 15px -3px rgba(109, 73, 253, 0.1), 0 4px 6px -2px rgba(109, 73, 253, 0.05)',
  
  xl: '0 20px 25px -5px rgba(109, 73, 253, 0.1), 0 10px 10px -5px rgba(109, 73, 253, 0.04)',
  
  '2xl': '0 25px 50px -12px rgba(109, 73, 253, 0.25)',
  
  // Inner shadow
  inner: 'inset 0 2px 4px 0 rgba(109, 73, 253, 0.06)',
  
  // Glow effects (for hover states)
  glow: {
    sm: '0 0 10px rgba(109, 73, 253, 0.3)',
    md: '0 0 20px rgba(109, 73, 253, 0.4)',
    lg: '0 0 30px rgba(109, 73, 253, 0.5)',
    xl: '0 0 40px rgba(109, 73, 253, 0.6)',
  },

  // Colored shadows (for specific elements)
  colored: {
    primary: '0 8px 16px -4px rgba(109, 73, 253, 0.3)',
    blue: '0 8px 16px -4px rgba(0, 212, 255, 0.3)',
    pink: '0 8px 16px -4px rgba(255, 77, 143, 0.3)',
    green: '0 8px 16px -4px rgba(0, 230, 118, 0.3)',
    orange: '0 8px 16px -4px rgba(255, 152, 0, 0.3)',
    red: '0 8px 16px -4px rgba(255, 59, 48, 0.3)',
  },

  // Elevation levels (semantic)
  elevation: {
    0: 'none',
    1: '0 1px 3px 0 rgba(109, 73, 253, 0.1), 0 1px 2px 0 rgba(109, 73, 253, 0.06)',
    2: '0 4px 6px -1px rgba(109, 73, 253, 0.1), 0 2px 4px -1px rgba(109, 73, 253, 0.06)',
    3: '0 10px 15px -3px rgba(109, 73, 253, 0.1), 0 4px 6px -2px rgba(109, 73, 253, 0.05)',
    4: '0 20px 25px -5px rgba(109, 73, 253, 0.1), 0 10px 10px -5px rgba(109, 73, 253, 0.04)',
    5: '0 25px 50px -12px rgba(109, 73, 253, 0.25)',
  },

  // Drop shadows (for SVG/images)
  drop: {
    sm: 'drop-shadow(0 1px 1px rgba(109, 73, 253, 0.05))',
    md: 'drop-shadow(0 4px 3px rgba(109, 73, 253, 0.07)) drop-shadow(0 2px 2px rgba(109, 73, 253, 0.06))',
    lg: 'drop-shadow(0 10px 8px rgba(109, 73, 253, 0.04)) drop-shadow(0 4px 3px rgba(109, 73, 253, 0.1))',
    xl: 'drop-shadow(0 20px 13px rgba(109, 73, 253, 0.03)) drop-shadow(0 8px 5px rgba(109, 73, 253, 0.08))',
  },
} as const;

// Text shadows
export const textShadows = {
  none: 'none',
  sm: '0 1px 2px rgba(0, 0, 0, 0.5)',
  md: '0 2px 4px rgba(0, 0, 0, 0.5)',
  lg: '0 4px 6px rgba(0, 0, 0, 0.5)',
  glow: '0 0 10px rgba(109, 73, 253, 0.8)',
} as const;

// Neumorphism shadows (for soft UI elements)
export const neumorphism = {
  light: {
    default: '6px 6px 12px rgba(109, 73, 253, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.8)',
    inset: 'inset 6px 6px 12px rgba(109, 73, 253, 0.1), inset -6px -6px 12px rgba(255, 255, 255, 0.8)',
  },
  dark: {
    default: '6px 6px 12px rgba(0, 0, 0, 0.4), -6px -6px 12px rgba(42, 42, 52, 0.4)',
    inset: 'inset 6px 6px 12px rgba(0, 0, 0, 0.4), inset -6px -6px 12px rgba(42, 42, 52, 0.4)',
  },
} as const;

// Type exports
export type Shadow = keyof typeof shadows;
export type TextShadow = keyof typeof textShadows;
export type ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5;
