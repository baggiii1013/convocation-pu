/**
 * Design Tokens - Main Export
 * 
 * Central export for all design tokens
 * Import this file to access the complete design system
 */

export * from './animations';
export * from './colors';
export * from './shadows';
export * from './spacing';
export * from './typography';

import { animations, motionVariants, transitions } from './animations';
import { colors } from './colors';
import { shadows, textShadows } from './shadows';
import { semanticSpacing, spacing, zIndex } from './spacing';
import { textStyles, typography } from './typography';

// Unified design system export
export const designSystem = {
  colors,
  typography,
  textStyles,
  spacing,
  semanticSpacing,
  zIndex,
  animations,
  transitions,
  motionVariants,
  shadows,
  textShadows,
} as const;

export default designSystem;
