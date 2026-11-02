export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { navy: { 950: '#060b1f', 900: '#0a1230', 800: '#101a40' }, neon: { cyan: '#22d3ee', purple: '#a78bfa', green: '#22c55e', yellow: '#facc15', red: '#ef4444' } },
      fontFamily: { display: ['Sora', 'system-ui', 'sans-serif'], sans: ['Manrope', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
