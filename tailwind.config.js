/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFFDF8',
        softblue: '#EAF5FA',
        godavari: {
          500: '#1687B8',
          600: '#0F6B94',
          700: '#0A5070',
        },
        navy: {
          900: '#17324D',
          800: '#1F4060',
          700: '#2A4E73',
        },
        teal: {
          500: '#2A9D8F',
          600: '#217F74',
        },
        saffron: {
          500: '#E9A23B',
          600: '#D9A441',
        },
        mutedgreen: '#3E8E63',
        bordergray: '#D8E3E8',
      },
      fontFamily: {
        heading: ['Cinzel', 'serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
