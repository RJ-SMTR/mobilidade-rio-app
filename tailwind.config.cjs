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
      },
      right: {
        '12px': '12px',
      }
    },
  },
  plugins: [],
}
