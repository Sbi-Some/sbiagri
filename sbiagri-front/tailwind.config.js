/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2ecc71',
        secondary: '#8b4513',
        accent: '#f1c40f',
      }
    },
  },
  plugins: [],
}