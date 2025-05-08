export default {
  content: ['./index.html', './new-index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      colors: {
        primary: '#2B3990',
        secondary: '#A61F1F',
        accent: '#F5B800',
      },
    },
  },
  plugins: [],
};
