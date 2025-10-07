/**
 * Spacing Tokens
 * 
 * Based on 8px grid system (0.5rem = 8px)
 * Provides consistent spacing throughout the app
 */

export const spacing = {
  // Base spacing units (rem based)
  0: '0',
  px: '1px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
} as const;

// Semantic spacing for specific use cases
export const semanticSpacing = {
  // Component internal padding
  componentPadding: {
    xs: spacing[2],      // 8px - tight padding
    sm: spacing[3],      // 12px - small padding
    md: spacing[4],      // 16px - standard padding
    lg: spacing[6],      // 24px - comfortable padding
    xl: spacing[8],      // 32px - spacious padding
  },

  // Gaps between elements
  gap: {
    xs: spacing[1],      // 4px - minimal gap
    sm: spacing[2],      // 8px - small gap
    md: spacing[4],      // 16px - standard gap
    lg: spacing[6],      // 24px - large gap
    xl: spacing[8],      // 32px - extra large gap
  },

  // Section spacing
  section: {
    xs: spacing[8],      // 32px - tight section
    sm: spacing[12],     // 48px - small section
    md: spacing[16],     // 64px - standard section
    lg: spacing[24],     // 96px - large section
    xl: spacing[32],     // 128px - extra large section
  },

  // Container padding
  container: {
    mobile: spacing[4],   // 16px on mobile
    tablet: spacing[6],   // 24px on tablet
    desktop: spacing[8],  // 32px on desktop
  },

  // Touch targets (for mobile)
  touchTarget: {
    min: spacing[11],     // 44px - iOS minimum
    comfortable: spacing[12], // 48px - Android minimum
    large: spacing[14],   // 56px - large touch target
  },

  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.5rem',       // 8px - buttons, inputs
    md: '0.75rem',      // 12px - cards
    lg: '1rem',         // 16px - modals
    xl: '1.5rem',       // 24px - hero sections
    '2xl': '2rem',      // 32px - featured cards
    '3xl': '3rem',      // 48px - large containers
    full: '9999px',     // pills, avatars
  },
} as const;

// Layout spacing presets
export const layoutSpacing = {
  // Page padding
  page: {
    mobile: spacing[4],
    tablet: spacing[6],
    desktop: spacing[8],
  },

  // Content max-width
  maxWidth: {
    xs: '20rem',      // 320px
    sm: '24rem',      // 384px
    md: '28rem',      // 448px
    lg: '32rem',      // 512px
    xl: '36rem',      // 576px
    '2xl': '42rem',   // 672px
    '3xl': '48rem',   // 768px
    '4xl': '56rem',   // 896px
    '5xl': '64rem',   // 1024px
    '6xl': '72rem',   // 1152px
    '7xl': '80rem',   // 1280px
    full: '100%',
  },

  // Grid gaps
  gridGap: {
    tight: spacing[2],       // 8px
    normal: spacing[4],      // 16px
    comfortable: spacing[6], // 24px
    loose: spacing[8],       // 32px
  },
} as const;

// Z-index scale (for layering)
export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
  max: 9999,
} as const;

// Type exports
export type Spacing = keyof typeof spacing;
export type SemanticSpacing = keyof typeof semanticSpacing;
export type ZIndex = keyof typeof zIndex;
