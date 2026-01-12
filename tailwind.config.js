
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#25c0f4",
        "primary-soft": "rgba(37, 192, 244, 0.12)",
        "jaci-pink": "#f472b6",
        "jaci-pink-soft": "rgba(244, 114, 182, 0.12)",
        "jaci-yellow": "#fbbf24",
        "jaci-yellow-soft": "rgba(251, 191, 36, 0.12)",
        "jaci-purple": "#a78bfa",
        "jaci-purple-soft": "rgba(167, 139, 250, 0.12)",
        "jaci-green": "#22c55e",
        "jaci-green-soft": "rgba(34, 197, 94, 0.12)",
        "slate": {
          "900": "#0f172a",
          "800": "#1e293b",
          "500": "#64748b",
        },
        "surface": "#fcfdfe",
      },
      fontFamily: {
        "display": ["Space Grotesk", "ui-sans-serif", "system-ui", "sans-serif"],
        "body": ["Noto Sans", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        'soft': '0 20px 40px -12px rgba(15, 23, 42, 0.08)',
        'glow-primary': '0 0 30px rgba(37, 192, 244, 0.25)',
        'glow-pink': '0 0 30px rgba(244, 114, 182, 0.25)',
        'glow-green': '0 0 30px rgba(34, 197, 94, 0.25)',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
}
