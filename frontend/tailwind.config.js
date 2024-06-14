/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ './src/**/*.{html,ts,css,scss,sass,less,styl}',],
  theme: {
    extend: {
       colors: {
        'main-blue': '#1e3a8a', // Use a cor desejada
        'fill-white': '#ffffff', // Use a cor desejada
      },
    },
  },
  plugins: [],
}

