import { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx,js,jsx}',
    './src/components/**/*.{ts,tsx,js,jsx}',
    './src/pages/**/*.{ts,tsx,js,jsx}',
    './src/**/*.{ts,tsx,js,jsx}'
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Light mode colors
        light: {
          bg: '#f4f1eb',
          text: '#2d3021',
          accent: '#4d7c0f',
        },
        // Dark mode colors
        dark: {
          bg: '#071011',
          text: '#e5e7eb',
          accent: '#66ff66',
        }
      }
    }
  },
  plugins: []
}

export default config