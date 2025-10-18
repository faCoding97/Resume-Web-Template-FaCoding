import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        taupe: {
          900: "#2f2a28",
          800: "#3a3432",
          700: "#4a4441",
          600: "#5b544f",
          500: "#6d655e",
        },
      },
      boxShadow: {
        glow: "0 0 24px rgba(147, 197, 253, 0.25)",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        "fade-in-up": "fade-in-up 600ms ease-out forwards"
      }
    },
  },
  plugins: [],
} satisfies Config;