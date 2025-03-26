/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/App.{js,jsx,ts,tsx}',
      './src/screen/*.{js,jsx,ts,tsx}',
      './src/components/**/*.{js,jsx,ts,tsx}',
    ],
    presets: [require('nativewind/preset')],
    theme: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      extend: {
        colors: {
          primary: '#F5A62E',
          secondary: '#FFEBCE',
          third: '#7fca9e',
          fourt:'#FE5F55',
          alternative: '#f1f1f1',
          textcolor: '#646982',
          mainbg:'#F5F5F5',
          placeholder: '#CCD6DD',
          minorgray: '#e5e7eb',
          lesserblack: '#6b7280',
          actionblack: '#404040',
        // ...
        },
      },
    },
    plugins: [],
  };