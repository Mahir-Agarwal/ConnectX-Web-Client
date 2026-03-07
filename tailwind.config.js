/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff003c', // Neon Red/Crimson
        secondary: '#ff4d00', // Red-Orange/Fire
        dark: '#050505', // Deep Black
        glass: 'rgba(255, 255, 255, 0.05)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        cursive: ['"Dancing Script"', 'cursive'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(255, 0, 60, 0.4)',
      },
    },
  },
  plugins: [],
}
