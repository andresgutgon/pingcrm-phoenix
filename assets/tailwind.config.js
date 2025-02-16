// See the Tailwind configuration guide for advanced usage
// https://tailwindcss.com/docs/configuration

module.exports = {
  content: ['./js/**/*.ts', './js/**/*.tsx'],
  theme: {
    extend: {
      colors: {
        brand: '#FD4F00',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
