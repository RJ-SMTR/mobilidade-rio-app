/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      zIndex: {
        '401': '401',
        '1001': '1001',
      },
      right: {
        '12px': '12px',
      }
    },
  },
  plugins: [],
}
