import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        parchment: "#f5f4ed",
        ivory: "#faf9f5",
        ink: "#141413",
        muted: "#5e5d59",
        accent: "#c96442",
        allow: "#5f8b61",
        block: "#b54c4c",
      },
      fontFamily: {
        serif: ["Georgia", "Times New Roman", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 24px rgba(20,20,19,0.08)",
      },
      borderRadius: {
        panel: "14px",
      },
    },
  },
  plugins: [],
} satisfies Config;
