/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        border: 'var(--border)',
        ring: 'var(--ring)',
        gold: 'var(--gold)',
        'gold-light': 'var(--gold-light)',
        'gold-dark': 'var(--gold-dark)',
        'gold-muted': 'var(--gold-muted)',
        'gold-foreground': 'var(--gold-foreground)',
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Arial', 'Helvetica', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      boxShadow: {
        'gold': '0 4px 14px 0 rgba(212, 175, 55, 0.39)',
        'gold-intense': '0 8px 32px 0 rgba(212, 175, 55, 0.5)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.4)',
      },
      dropShadow: {
        'gold': '0 4px 8px rgba(212, 175, 55, 0.4)',
      },
    },
  },
  plugins: [],
}
