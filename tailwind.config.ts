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
        neo: {
          canvas: "#FAF7F2",
          surface: "#FFFFFF",
          oat: "#F0ECE1",
          ink: "#141413",
          muted: "#52514E",
          lime: "#B8F348",
          coral: "#FF5E4D",
          cobalt: "#3B66FF",
          amber: "#FFBE2E",
          mint: "#1AD598",
        },
        kmRed: {
          light: "#FF5E4D",
          dark: "#FF5A6B",
        },
        kmYellow: {
          light: "#FFBE2E",
          dark: "#FFD25E",
        },
        kmBlue: {
          light: "#3B66FF",
          dark: "#6C9BFF",
        },
        kmGreen: {
          light: "#1AD598",
          darkText: "#0F6E4E",
          dark: "#4CC992",
        },
        kmNeutral: {
          latar: "#FAF7F2",
          surface: "#FFFFFF",
          tinta: "#141413",
          sekunder: "#52514E",
          garis: "#141413",
        },
      },
      fontFamily: {
        display: ["Outfit", "Inter", "sans-serif"],
        serif: ["Outfit", "Inter", "sans-serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "Menlo", "monospace"],
      },
      boxShadow: {
        neoSm: "3px 3px 0px #141413",
        neoMd: "4px 4px 0px #141413",
        neoLg: "6px 6px 0px #141413",
      },
    },
  },
  plugins: [],
};

export default config;
