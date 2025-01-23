/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./index.html",
  ],
  theme: {
     colors: {
      'gray-50': '#D9C4A9',
      'black': '#242424',
      'gray': '#CCCCCC',
      'white': '#F3F3F3',
      'tan': '#D9C4A9',
      'dark-tan': '#8C7F6D',
      'light-green': '#6F8B51',
      'green': '#496134',
      'dark-green': '#3A4C28',
      'red': '#B54141',
      'dark-red':'#822F2F',
      'yellow':'#D4A72C',
    },
    extend: {},
  },
  plugins: [],
}
