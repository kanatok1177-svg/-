import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#0a0a0c",
          raised: "#131316",
          card: "#18181c",
          border: "#26262b",
        },
        accent: {
          DEFAULT: "#5b8cff",
          soft: "#7ea2ff",
          glow: "#3a63d9",
        },
        success: {
          DEFAULT: "#3ddc97",
          soft: "#6be8b3",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "'Hiragino Sans'",
          "'Hiragino Kaku Gothic ProN'",
          "'Noto Sans JP'",
          "'Yu Gothic'",
          "sans-serif",
        ],
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(91,140,255,0.35)" },
          "50%": { boxShadow: "0 0 0 24px rgba(91,140,255,0)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "tick": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.06)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 2.2s ease-out infinite",
        "fade-in": "fade-in 0.4s ease-out",
        "scale-in": "scale-in 0.35s cubic-bezier(0.16,1,0.3,1)",
        "tick": "tick 1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
