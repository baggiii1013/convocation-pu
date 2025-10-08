/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Keep for compatibility but always dark
  theme: {
    extend: {
      // Colors - District.in inspired palette (DARK MODE ONLY)
      colors: {
        // Primary purple palette
        primary: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#6D49FD', // Main brand color
          600: '#5938D6',
          700: '#4527B8',
          800: '#3B1F9A',
          900: '#2E1765',
        },

        // Accent colors
        accent: {
          blue: '#00D4FF',
          pink: '#FF4D8F',
          green: '#00E676',
          orange: '#FF9800',
          red: '#FF3B30',
        },

        // Dark theme colors (always active)
        dark: {
          bg: '#0A0A0F',
          surface: '#1A1A24',
          card: '#242433',
          border: '#2D2D40',
          hover: '#2F2F45',
        },

        // Semantic colors using CSS variables
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        card: {
          DEFAULT: 'rgb(var(--card) / <alpha-value>)',
          foreground: 'rgb(var(--card-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
          foreground: 'rgb(var(--muted-foreground) / <alpha-value>)',
        },
        border: 'rgb(var(--border) / <alpha-value>)',
        ring: 'rgb(var(--ring) / <alpha-value>)',
      },

      // Typography
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['SF Pro Display', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },

      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['2rem', { lineHeight: '2.5rem' }],
        '4xl': ['2.5rem', { lineHeight: '3rem' }],
        '5xl': ['3rem', { lineHeight: '3.5rem' }],
        '6xl': ['3.5rem', { lineHeight: '4rem' }],
        '7xl': ['4rem', { lineHeight: '4.5rem' }],
      },

      // Spacing (8px grid system)
      spacing: {
        '0.5': '0.125rem',
        '1.5': '0.375rem',
        '2.5': '0.625rem',
        '3.5': '0.875rem',
      },

      // Border radius
      borderRadius: {
        sm: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        '2xl': '2rem',
        '3xl': '3rem',
      },

      // Box shadows - purple-tinted
      boxShadow: {
        sm: '0 1px 2px 0 rgba(109, 73, 253, 0.05)',
        md: '0 4px 6px -1px rgba(109, 73, 253, 0.1), 0 2px 4px -1px rgba(109, 73, 253, 0.06)',
        lg: '0 10px 15px -3px rgba(109, 73, 253, 0.1), 0 4px 6px -2px rgba(109, 73, 253, 0.05)',
        xl: '0 20px 25px -5px rgba(109, 73, 253, 0.1), 0 10px 10px -5px rgba(109, 73, 253, 0.04)',
        '2xl': '0 25px 50px -12px rgba(109, 73, 253, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(109, 73, 253, 0.06)',
        'glow-sm': '0 0 10px rgba(109, 73, 253, 0.3)',
        'glow-md': '0 0 20px rgba(109, 73, 253, 0.4)',
        'glow-lg': '0 0 30px rgba(109, 73, 253, 0.5)',
        'primary': '0 8px 16px -4px rgba(109, 73, 253, 0.3)',
        'blue': '0 8px 16px -4px rgba(0, 212, 255, 0.3)',
        'pink': '0 8px 16px -4px rgba(255, 77, 143, 0.3)',
      },

      // Drop shadows
      dropShadow: {
        sm: '0 1px 1px rgba(109, 73, 253, 0.05)',
        md: ['0 4px 3px rgba(109, 73, 253, 0.07)', '0 2px 2px rgba(109, 73, 253, 0.06)'],
        lg: ['0 10px 8px rgba(109, 73, 253, 0.04)', '0 4px 3px rgba(109, 73, 253, 0.1)'],
        xl: ['0 20px 13px rgba(109, 73, 253, 0.03)', '0 8px 5px rgba(109, 73, 253, 0.08)'],
        glow: '0 0 10px rgba(109, 73, 253, 0.8)',
      },

      // Animations
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'fade-out': 'fadeOut 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'scale-out': 'scaleOut 0.2s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'wiggle': 'wiggle 0.3s ease-in-out',
        'shake': 'shake 0.3s ease-in-out',
      },

      // Keyframes
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.9)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
      },

      // Backdrop blur
      backdropBlur: {
        xs: '2px',
      },

      // Z-index
      zIndex: {
        '-1': '-1',
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },

      // Transition timing functions
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}
