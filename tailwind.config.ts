import type { Config } from "tailwindcss";
export default {
  darkMode: ["class"],
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#121212",
        foreground: "#ffffff",
        primary: { DEFAULT: "#6366F1", hover: "#818CF8", light: "#A5B4FC" },
        dark: { 100: "#121212", 200: "#1E1E1E", 300: "#2D2D2D", 400: "#333333" },
      },
    },
  },
  plugins: [],
} satisfies Config;
