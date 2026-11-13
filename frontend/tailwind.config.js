/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Warm Editorial Palette from EventForge AI Specification
        paper: {
          50: "#FAF7F2",
          100: "#F5EFE8",
          200: "#EBE3DA",
          300: "#DDD2C5",
        },
        surface: {
          DEFAULT: "#F8F5F0",
          card: "#FFFFFF",
          subtle: "#F3EFEA",
          elevated: "#FDFCFA",
        },
        ink: {
          DEFAULT: "#1F1916",
          body: "#382F2A",
          muted: "#73645A",
          faint: "#A89C92",
          border: "#E7DFD5",
          borderStrong: "#D5C9BA",
        },
        terracotta: {
          DEFAULT: "#C2542D",
          hover: "#A8431F",
          subtle: "#FBEFEA",
          faint: "#F6DDD3",
          dark: "#8F3516",
        },
        sage: {
          DEFAULT: "#2F5B3C",
          hover: "#254B31",
          subtle: "#EFF5F1",
          faint: "#DEEBE1",
          dark: "#1D3B26",
        },
        ochre: {
          DEFAULT: "#C47D1C",
          subtle: "#FDF6EA",
          faint: "#F8E7C5",
          dark: "#8C540C",
        },
        // Backwards compatibility tokens
        primary: {
          DEFAULT: "#C2542D",
          container: "#2F5B3C",
          fixed: "#DEEBE1",
        },
        secondary: {
          DEFAULT: "#C47D1C",
          fixed: "#FDF6EA",
        }
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        serif: ["'Newsreader'", "Georgia", "serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        subtle: "0 1px 2px rgba(27, 20, 16, 0.04)",
        card: "0 1px 3px rgba(27, 20, 16, 0.04), 0 4px 12px rgba(27, 20, 16, 0.02)",
        dropdown: "0 4px 16px rgba(27, 20, 16, 0.08), 0 1px 3px rgba(27, 20, 16, 0.04)",
      }
    },
  },
  plugins: [],
}
