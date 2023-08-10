/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  darkMode: 'class',
  
  theme: {
    extend: {
      fontFamily: {
        'satisfy': ['Satisfy', 'cursive'],
      },
    },
  },
  plugins: [],
};
