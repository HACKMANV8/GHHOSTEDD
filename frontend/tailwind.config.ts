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
        // These tell Tailwind to use your CSS variables
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        danger: 'var(--danger)',
        'accent-green': 'var(--accent-green)',
        'accent-brown': 'var(--accent-brown)',
        'brand-green': 'var(--brand-green)',
      }
    }
  },
  plugins: []
}

export default config