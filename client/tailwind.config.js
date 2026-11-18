/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        jira: {
          blue: '#0052CC',
          'blue-hover': '#0747A6',
          'blue-light': '#DEEBFF',
          dark: '#172B4D',
          gray: '#5E6C84',
          subtle: '#7A869A',
          bg: '#F4F5F7',
          surface: '#FAFBFC',
          border: '#DFE1E6',
          green: '#00875A',
          'green-light': '#E3FCEF',
          red: '#DE350B',
          'red-light': '#FFEBE6',
          yellow: '#FF991F',
          'yellow-light': '#FFF0B3',
          purple: '#6554C0',
          'purple-light': '#EAE6FF',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          '"Fira Sans"',
          '"Droid Sans"',
          '"Helvetica Neue"',
          'sans-serif',
        ],
      },
      boxShadow: {
        jira: '0 1px 1px rgba(9, 30, 66, 0.25), 0 0 1px rgba(9, 30, 66, 0.31)',
        'jira-hover': '0 4px 8px -2px rgba(9, 30, 66, 0.25), 0 0 1px rgba(9, 30, 66, 0.31)',
        'jira-modal': '0 20px 32px -8px rgba(9, 30, 66, 0.33), 0 0 1px rgba(9, 30, 66, 0.31)',
      },
    },
  },
  plugins: [],
};
