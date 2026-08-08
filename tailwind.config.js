/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#05060a',
          900: '#0a0d14',
          800: '#11151f',
          700: '#1a1f2e',
          600: '#262d40',
          500: '#3a4358',
          400: '#5b6478',
          300: '#8b93a7',
          200: '#c2c8d6',
          100: '#e6e9f2',
        },
        accent: {
          50: '#eafcff',
          100: '#c8f6ff',
          200: '#94edff',
          300: '#5fe0ff',
          400: '#2bcfff',
          500: '#06b6d4',
          600: '#0894b8',
          700: '#0a7596',
          800: '#0c5d78',
          900: '#0d4a5e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(43,207,255,0.25), 0 8px 40px -8px rgba(6,182,212,0.45)',
        'glow-sm': '0 0 0 1px rgba(43,207,255,0.18), 0 4px 20px -6px rgba(6,182,212,0.35)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'fade-in': 'fade-in 0.4s ease-out both',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
};
