/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: 'var(--brand-color)',
      },
      boxShadow: {
        soft: '0 20px 45px -20px rgba(15, 23, 42, 0.25)',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        texture:
          'radial-gradient(circle at top, rgba(200, 169, 110, 0.12), transparent 30%), linear-gradient(180deg, rgba(255,255,255,0.95), rgba(250,247,242,0.98))',
      },
    },
  },
  plugins: [],
}
