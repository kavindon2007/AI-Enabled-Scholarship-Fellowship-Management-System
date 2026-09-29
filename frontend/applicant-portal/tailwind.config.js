/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          blue: {
            DEFAULT: '#004A8F', // Deep government blue
            light: '#1A65A8',
            dark: '#003366',
          },
          orange: {
            DEFAULT: '#F37021', // Restrained orange accent
            light: '#F89052',
            dark: '#D95C12',
          },
          green: {
            DEFAULT: '#138808', // Indian flag green reference
          },
          bg: '#F5F6F8', // Light neutral page background
          surface: '#FFFFFF', // White content surfaces
          text: '#333333',
          textMuted: '#666666',
          border: '#E0E0E0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // Official-looking typography
        heading: ['Roboto', 'sans-serif'],
      },
      boxShadow: {
        'gov': '0 2px 4px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'gov': '4px', // Conservative border radii
      }
    },
  },
  plugins: [],
}
