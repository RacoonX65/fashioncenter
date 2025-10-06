/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      borderRadius: {
        'none': '0',
        'sm': '2px',
        DEFAULT: '4px',
        'md': '4px',
        'lg': '6px',
        'xl': '8px',
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // PRIMARY - Sophisticated Black & Charcoal (Sharp, modern)
        primary: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#262626',
          800: '#171717',
          900: '#0a0a0a',
        },
        // SECONDARY - Warm Cream & Beige (Elegant, soft)
        secondary: {
          50: '#fefdfb',
          100: '#fef8f3',
          200: '#fef1e6',
          300: '#fde9d9',
          400: '#f8d9bf',
          500: '#edc3a3',
          600: '#d9a57c',
          700: '#b8825a',
          800: '#8c6244',
          900: '#5c4230',
        },
        // ACCENT - Sophisticated Gold/Bronze (Premium touch)
        accent: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        // SUCCESS - Subtle Green (Professional confirmation)
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
    },
  },
  plugins: [],
}
