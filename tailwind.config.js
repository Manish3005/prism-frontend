/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        amazon: {
          orange: '#FF9900',
          'orange-dark': '#E47911',
          'orange-hover': '#FEBD69',
          navy: '#131921',
          'navy-light': '#232F3E',
          'navy-dark': '#0F1111',
          blue: '#007185',
          'blue-hover': '#C7511F',
          link: '#007185',
          yellow: '#FFD814',
          'yellow-hover': '#F7CA00',
          green: '#067D62',
          red: '#B12704',
          gray: '#565959',
          'gray-light': '#D5D9D9',
          'gray-bg': '#EAEDED',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        amazon: [
          'Amazon Ember',
          'Arial',
          'Helvetica Neue',
          'Helvetica',
          'sans-serif',
        ],
      },
      boxShadow: {
        amazon: '0 2px 5px rgba(15, 17, 17, 0.15)',
        'amazon-card': '0 1px 3px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
};
