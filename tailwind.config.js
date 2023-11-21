/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(20vw)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeOut: {
          '100%': { opacity: 1 },
          '0%': { opacity: 0 },
        }
      },
      animation: {
        slideIn: 'slideIn 500ms ease-in-out',
        fadeIn: 'fadeIn 150ms ease-in-out',
        fadeOut: 'fadeOut 150ms ease-in-out',
      },
      colors: {
        primary: colors.indigo,
        secondary: colors.slate
      }
    },
  },
  plugins: [],
}

