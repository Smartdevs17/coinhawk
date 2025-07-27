/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // CoinHawk Brand Colors
        hawk: {
          primary: '#1a1f36',      // Deep navy
          secondary: '#2d3748',    // Dark gray
          accent: '#fbbf24',       // Golden yellow
          'accent-light': '#fcd34d',
          'accent-dark': '#f59e0b',
        },
        
        // Status Colors
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        
        // Dark Theme Colors
        dark: {
          bg: '#0f172a',           // Main background
          surface: '#1e293b',      // Card backgrounds
          'surface-light': '#334155', // Hover states
          border: '#475569',       // Borders
          'text-primary': '#f8fafc',   // Primary text
          'text-secondary': '#cbd5e1', // Secondary text
          'text-muted': '#94a3b8',     // Muted text
        }
      },
    },
  },
  plugins: [],
};