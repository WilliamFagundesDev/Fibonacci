export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        background: '#0B0F19', // Dark neon theme
        surface: '#1A202C',
        surfaceHover: '#2D3748',
        primary: '#3B82F6', // Blue
        secondary: '#10B981', // Emerald
        accent: '#8B5CF6', // Purple
      }
    },
  },
  plugins: [],
}
