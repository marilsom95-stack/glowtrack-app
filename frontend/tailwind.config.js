/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        beige: '#F5EEDF',
        lilac: '#DCC6E0',
        graphite: '#3C3A47',
      },
      borderRadius: {
        xl: '1.5rem',
      },
      boxShadow: {
        glow: '0 15px 35px rgba(146, 126, 155, 0.15)',
      },
    },
  },
  plugins: [],
};
