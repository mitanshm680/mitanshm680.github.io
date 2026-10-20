/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#120B09',
        espresso: '#1C1210',
        bark: '#2A1C17',
        umber: '#4A3A30',
        newsprint: '#F3E6CC',
        parchment: '#D9C9A8',
        marigold: '#F6B21B',
        tangerine: '#F07F23',
        tomato: '#E8432E',
        brick: '#B8321F',
        avocado: '#4F5D2F',
        wood: '#6B3E22',
      },
      fontFamily: {
        display: ['Shrikhand', 'Georgia', 'serif'],
        screen: ['VT323', 'ui-monospace', 'monospace'],
        sans: ['Archivo', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        station: '1240px',
      },
    },
  },
  plugins: [],
};
