/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#111827', // slate-900
        surface: '#1f2937',    // slate-800
        primary: {
          DEFAULT: '#10b981', // emerald-500
          light: '#34d399', // emerald-400
          dark: '#059669',  // emerald-600
        },
        secondary: {
          DEFAULT: '#3b82f6', // blue-500
          light: '#60a5fa', // blue-400
        },
        danger: '#ef4444',     // red-500
        warning: '#f97316',   // orange-500
        'text-primary': '#f0fdf4', // emerald-50
        'text-secondary': '#d1d5db', // slate-300
        'text-muted': '#6b7280', // slate-500
      },
      fontFamily: {
          sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.3s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px) scale(0.95)' },
          '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
