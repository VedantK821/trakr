import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        heading: ["var(--font-syne)", "system-ui", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "monospace"],
      },
      colors: {
        surface: {
          deep: "#06060b",
          base: "#0c0c14",
          card: "#10111a",
          "card-hover": "#141520",
        },
        border: {
          subtle: "#1a1b2e",
        },
        accent: {
          ai: "#8b5cf6",
          blue: "#3b82f6",
          green: "#10b981",
          amber: "#f59e0b",
          red: "#ef4444",
          pink: "#ec4899",
        },
      },
    },
  },
  plugins: [],
};

export default config;
