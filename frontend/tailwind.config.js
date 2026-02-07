/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sponge-yellow': '#FFEB3B',
        'ocean-blue': '#0077BE',
        'ocean-dark': '#005A8C',
        'sand': '#F4D03F',
        'coral': '#FF6B6B',
        'seafoam': '#4ECDC4',
      },
      fontFamily: {
        'sponge': ['Titan One', 'cursive'],
      },
      animation: {
        'bubble': 'bubble 4s ease-in-out infinite',
        'wave': 'wave 3s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        bubble: {
          '0%, 100%': { transform: 'translateY(0) scale(1)', opacity: '0.7' },
          '50%': { transform: 'translateY(-20px) scale(1.1)', opacity: '1' },
        },
        wave: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(10px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(255, 235, 59, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(255, 235, 59, 0.8)' },
        },
      },
    },
  },
  plugins: [],
}
