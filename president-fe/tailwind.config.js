/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary — Navy (#053668)
        primary: {
          50:  '#e8f0f8',
          100: '#c5d7ed',
          200: '#9dbcde',
          300: '#74a1cf',
          400: '#4f88bf',
          500: '#2a6fb0',
          600: '#1a5a9a',
          700: '#0d4480',
          800: '#063b6e',
          900: '#053668',
          950: '#02213f',
        },
        // Secondary — Orange (#FF7100)
        secondary: {
          50:  '#fff4e6',
          100: '#ffe0b3',
          200: '#ffcc80',
          300: '#ffb84d',
          400: '#ffa31a',
          500: '#ff8f00',
          600: '#FF7100',
          700: '#e56500',
          800: '#cc5900',
          900: '#993f00',
        },
        // Tertiary — Cream
        tertiary: '#F7ECB5',
        // Surface — Off-white background (renamed from neutral to avoid Tailwind built-in conflict)
        surface: '#F9FAFB',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
