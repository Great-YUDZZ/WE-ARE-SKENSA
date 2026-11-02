import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Nocturne Dark Luxury Palette (matching reference photo)
        nocturne: {
          bg: "#080A10",
          canvas: "#0B0E17",
          surface: "#0D101A",
          surfaceElevated: "#121624",
          border: "rgba(255, 255, 255, 0.08)",
          borderHover: "rgba(255, 255, 255, 0.18)",
          text: "#F4F3F8",
          muted: "#8E9AB5",
          subtle: "#5E687E",
          accent: "#D2D8F0",
        },
        // Semantic Token Rules adapted for Nocturne
        kmRed: {
          light: "#D7263D",
          dark: "#FF5A6B",
        },
        kmYellow: {
          light: "#FFC93C",
          dark: "#FFD25E",
        },
        kmBlue: {
          light: "#2D6CDF",
          dark: "#6C9BFF",
        },
        kmGreen: {
          light: "#2E9E6B",
          darkText: "#1F7A52",
          dark: "#4CC992",
        },
        kmNeutral: {
          latar: "#FFFDF8",
          surface: "#FFFFFF",
          tinta: "#1B1B2F",
          sekunder: "#5A5A70",
          garis: "#E6E1D6",
          darkLatar: "#14141F",
          darkPermukaan: "#1F1F2E",
          darkTeks: "#F4F2EA",
          darkSekunder: "#A8A8BA",
        },
      },
      fontFamily: {
        display: ["Outfit", "Inter", "sans-serif"],
        serif: ["Outfit", "Inter", "sans-serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "Menlo", "monospace"],
      },
      boxShadow: {
        crisp: "0 1px 3px rgba(0, 0, 0, 0.4)",
        glowPill: "0 4px 24px rgba(244, 243, 248, 0.15)",
        nocturneCard: "0 10px 40px -10px rgba(0, 0, 0, 0.6)",
      },
    },
  },
  plugins: [],
};

export default config;
