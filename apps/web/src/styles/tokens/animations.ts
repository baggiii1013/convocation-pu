/**
 * Animation Tokens
 * 
 * Durations, easing functions, and keyframe definitions
 * for consistent animations throughout the app
 */

export const animations = {
  // Duration scale
  duration: {
    instant: '50ms',
    fast: '150ms',
    base: '200ms',
    medium: '300ms',
    slow: '500ms',
    slower: '700ms',
    slowest: '1000ms',
  },

  // Easing functions
  easing: {
    // Standard easings
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',

    // Custom cubic-bezier curves
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)', // Material Design standard
    snappy: 'cubic-bezier(0.4, 0, 1, 1)',   // Quick start, slow end
    gentle: 'cubic-bezier(0, 0, 0.2, 1)',   // Slow start, quick end
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Bouncy spring effect
    dramatic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Overshoot
  },

  // Delay scale
  delay: {
    none: '0ms',
    short: '100ms',
    medium: '200ms',
    long: '300ms',
  },

  // Keyframe names (defined in CSS)
  keyframes: {
    fadeIn: 'fadeIn',
    fadeOut: 'fadeOut',
    slideUp: 'slideUp',
    slideDown: 'slideDown',
    slideLeft: 'slideLeft',
    slideRight: 'slideRight',
    scaleIn: 'scaleIn',
    scaleOut: 'scaleOut',
    spin: 'spin',
    pulse: 'pulse',
    bounce: 'bounce',
    shimmer: 'shimmer',
    shake: 'shake',
    wiggle: 'wiggle',
    ripple: 'ripple',
  },
} as const;

// Predefined animation combinations
export const animationPresets = {
  // Fade animations
  fadeIn: {
    animation: `${animations.keyframes.fadeIn} ${animations.duration.medium} ${animations.easing.smooth}`,
  },
  fadeOut: {
    animation: `${animations.keyframes.fadeOut} ${animations.duration.medium} ${animations.easing.smooth}`,
  },

  // Slide animations
  slideUp: {
    animation: `${animations.keyframes.slideUp} ${animations.duration.medium} ${animations.easing.smooth}`,
  },
  slideDown: {
    animation: `${animations.keyframes.slideDown} ${animations.duration.medium} ${animations.easing.smooth}`,
  },
  slideLeft: {
    animation: `${animations.keyframes.slideLeft} ${animations.duration.medium} ${animations.easing.smooth}`,
  },
  slideRight: {
    animation: `${animations.keyframes.slideRight} ${animations.duration.medium} ${animations.easing.smooth}`,
  },

  // Scale animations
  scaleIn: {
    animation: `${animations.keyframes.scaleIn} ${animations.duration.base} ${animations.easing.spring}`,
  },
  scaleOut: {
    animation: `${animations.keyframes.scaleOut} ${animations.duration.base} ${animations.easing.smooth}`,
  },

  // Loading animations
  spin: {
    animation: `${animations.keyframes.spin} ${animations.duration.slowest} ${animations.easing.linear} infinite`,
  },
  pulse: {
    animation: `${animations.keyframes.pulse} ${animations.duration.slower} ${animations.easing.smooth} infinite`,
  },
  shimmer: {
    animation: `${animations.keyframes.shimmer} 2s ${animations.easing.linear} infinite`,
  },

  // Interactive animations
  bounce: {
    animation: `${animations.keyframes.bounce} ${animations.duration.slow} ${animations.easing.smooth}`,
  },
  shake: {
    animation: `${animations.keyframes.shake} ${animations.duration.medium} ${animations.easing.smooth}`,
  },
  wiggle: {
    animation: `${animations.keyframes.wiggle} ${animations.duration.medium} ${animations.easing.smooth}`,
  },
} as const;

// Transition presets for common properties
export const transitions = {
  // All properties
  all: {
    fast: `all ${animations.duration.fast} ${animations.easing.smooth}`,
    base: `all ${animations.duration.base} ${animations.easing.smooth}`,
    medium: `all ${animations.duration.medium} ${animations.easing.smooth}`,
    slow: `all ${animations.duration.slow} ${animations.easing.smooth}`,
  },

  // Specific properties
  colors: {
    fast: `color ${animations.duration.fast} ${animations.easing.smooth}, background-color ${animations.duration.fast} ${animations.easing.smooth}, border-color ${animations.duration.fast} ${animations.easing.smooth}`,
    base: `color ${animations.duration.base} ${animations.easing.smooth}, background-color ${animations.duration.base} ${animations.easing.smooth}, border-color ${animations.duration.base} ${animations.easing.smooth}`,
  },

  transform: {
    fast: `transform ${animations.duration.fast} ${animations.easing.smooth}`,
    base: `transform ${animations.duration.base} ${animations.easing.smooth}`,
    spring: `transform ${animations.duration.medium} ${animations.easing.spring}`,
  },

  opacity: {
    fast: `opacity ${animations.duration.fast} ${animations.easing.smooth}`,
    base: `opacity ${animations.duration.base} ${animations.easing.smooth}`,
  },

  shadow: {
    base: `box-shadow ${animations.duration.base} ${animations.easing.smooth}`,
    medium: `box-shadow ${animations.duration.medium} ${animations.easing.smooth}`,
  },
} as const;

// Hover effects
export const hoverEffects = {
  // Lift effect (elevate + shadow)
  lift: {
    transition: transitions.all.base,
    hover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 24px rgba(109, 73, 253, 0.15)',
    },
  },

  // Gentle lift
  liftGentle: {
    transition: transitions.all.base,
    hover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 16px rgba(109, 73, 253, 0.1)',
    },
  },

  // Scale up
  scaleUp: {
    transition: transitions.transform.spring,
    hover: {
      transform: 'scale(1.05)',
    },
  },

  // Scale up subtle
  scaleUpSubtle: {
    transition: transitions.transform.base,
    hover: {
      transform: 'scale(1.02)',
    },
  },

  // Glow
  glow: {
    transition: transitions.shadow.base,
    hover: {
      boxShadow: '0 0 20px rgba(109, 73, 253, 0.4)',
    },
  },

  // Brightness
  brighten: {
    transition: 'filter 200ms ease',
    hover: {
      filter: 'brightness(1.1)',
    },
  },
} as const;

// Active/Press effects
export const activeEffects = {
  // Scale down
  scaleDown: {
    transition: transitions.transform.fast,
    active: {
      transform: 'scale(0.98)',
    },
  },

  // Scale down subtle
  scaleDownSubtle: {
    transition: transitions.transform.fast,
    active: {
      transform: 'scale(0.99)',
    },
  },

  // Dim
  dim: {
    transition: transitions.opacity.fast,
    active: {
      opacity: 0.8,
    },
  },
} as const;

// Stagger animations (for lists)
export const staggerChildren = {
  fast: {
    staggerChildren: 0.05,
    delayChildren: 0.1,
  },
  base: {
    staggerChildren: 0.1,
    delayChildren: 0.2,
  },
  slow: {
    staggerChildren: 0.15,
    delayChildren: 0.3,
  },
} as const;

// Framer Motion variants (for use with framer-motion)
export const motionVariants = {
  // Fade in
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },

  // Fade in + slide up
  fadeInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },

  // Fade in + slide down
  fadeInDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  },

  // Scale + fade
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },

  // Slide from left
  slideLeft: {
    hidden: { x: -100, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  },

  // Slide from right
  slideRight: {
    hidden: { x: 100, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  },

  // Stagger container
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },

  // List item
  listItem: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  },
} as const;

// Type exports
export type AnimationDuration = keyof typeof animations.duration;
export type AnimationEasing = keyof typeof animations.easing;
export type AnimationKeyframe = keyof typeof animations.keyframes;
export type TransitionPreset = keyof typeof transitions;
