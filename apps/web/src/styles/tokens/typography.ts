/**
 * Typography Tokens
 * 
 * Font families, sizes, weights, and line heights
 * Based on modern web typography best practices
 */

export const typography = {
  // Font Families
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
    display: ['SF Pro Display', 'Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
  },

  // Font Sizes (rem based, 16px = 1rem)
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px - body text
    lg: '1.125rem',     // 18px - large body
    xl: '1.25rem',      // 20px - small heading
    '2xl': '1.5rem',    // 24px - h4
    '3xl': '2rem',      // 32px - h3
    '4xl': '2.5rem',    // 40px - h2
    '5xl': '3rem',      // 48px - h1
    '6xl': '3.5rem',    // 56px - hero mobile
    '7xl': '4rem',      // 64px - hero desktop
  },

  // Font Weights
  fontWeight: {
    normal: 400,      // Regular text
    medium: 500,      // Slightly emphasized
    semibold: 600,    // Buttons, labels
    bold: 700,        // Headings
    extrabold: 800,   // Display text
  },

  // Line Heights
  lineHeight: {
    none: 1,
    tight: 1.2,       // Headings
    snug: 1.375,      // Large body text
    normal: 1.5,      // Body text
    relaxed: 1.75,    // Comfortable reading
    loose: 2,         // Very relaxed
  },

  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // Text Transforms
  textTransform: {
    uppercase: 'uppercase',
    lowercase: 'lowercase',
    capitalize: 'capitalize',
    none: 'none',
  },
} as const;

// Predefined typography styles for common use cases
export const textStyles = {
  // Display Text (Hero sections)
  displayLarge: {
    fontSize: typography.fontSize['7xl'],
    fontWeight: typography.fontWeight.extrabold,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.tight,
    fontFamily: typography.fontFamily.display.join(', '),
  },
  displayMedium: {
    fontSize: typography.fontSize['6xl'],
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.tight,
    fontFamily: typography.fontFamily.display.join(', '),
  },
  displaySmall: {
    fontSize: typography.fontSize['5xl'],
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.snug,
    fontFamily: typography.fontFamily.display.join(', '),
  },

  // Headings
  h1: {
    fontSize: typography.fontSize['5xl'],
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.tight,
    fontFamily: typography.fontFamily.sans.join(', '),
  },
  h2: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.snug,
    fontFamily: typography.fontFamily.sans.join(', '),
  },
  h3: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.snug,
    fontFamily: typography.fontFamily.sans.join(', '),
  },
  h4: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.normal,
    fontFamily: typography.fontFamily.sans.join(', '),
  },
  h5: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.normal,
    fontFamily: typography.fontFamily.sans.join(', '),
  },
  h6: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.normal,
    fontFamily: typography.fontFamily.sans.join(', '),
  },

  // Body Text
  bodyLarge: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.relaxed,
    fontFamily: typography.fontFamily.sans.join(', '),
  },
  body: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal,
    fontFamily: typography.fontFamily.sans.join(', '),
  },
  bodySmall: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal,
    fontFamily: typography.fontFamily.sans.join(', '),
  },

  // Labels & Captions
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.wide,
    fontFamily: typography.fontFamily.sans.join(', '),
  },
  caption: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal,
    fontFamily: typography.fontFamily.sans.join(', '),
  },
  overline: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.wider,
    textTransform: 'uppercase' as const,
    fontFamily: typography.fontFamily.sans.join(', '),
  },

  // UI Elements
  button: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.none,
    letterSpacing: typography.letterSpacing.wide,
    fontFamily: typography.fontFamily.sans.join(', '),
  },
  buttonSmall: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.none,
    fontFamily: typography.fontFamily.sans.join(', '),
  },
  buttonLarge: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.none,
    letterSpacing: typography.letterSpacing.wide,
    fontFamily: typography.fontFamily.sans.join(', '),
  },

  // Code
  code: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal,
    fontFamily: typography.fontFamily.mono.join(', '),
  },
  codeBlock: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.relaxed,
    fontFamily: typography.fontFamily.mono.join(', '),
  },
} as const;

// Responsive typography utilities
export const responsiveText = {
  hero: {
    mobile: typography.fontSize['6xl'],
    tablet: typography.fontSize['7xl'],
    desktop: typography.fontSize['7xl'],
  },
  h1: {
    mobile: typography.fontSize['3xl'],
    tablet: typography.fontSize['4xl'],
    desktop: typography.fontSize['5xl'],
  },
  h2: {
    mobile: typography.fontSize['2xl'],
    tablet: typography.fontSize['3xl'],
    desktop: typography.fontSize['4xl'],
  },
  h3: {
    mobile: typography.fontSize.xl,
    tablet: typography.fontSize['2xl'],
    desktop: typography.fontSize['3xl'],
  },
} as const;

// Type exports
export type FontSize = keyof typeof typography.fontSize;
export type FontWeight = keyof typeof typography.fontWeight;
export type LineHeight = keyof typeof typography.lineHeight;
export type TextStyle = keyof typeof textStyles;
