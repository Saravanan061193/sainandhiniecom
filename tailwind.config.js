/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1F4D2B", // Deep Green Header & Footer
          light: "#2E6B3F",   // Lighter Green for hovers
          dark: "#14331D",    // Darker Green for text
        },
        secondary: {
          DEFAULT: "#FAF3E0", // Cream Beige Background
          dark: "#F0E6D2",    // Slightly darker cream
        },
        brown: {
          DEFAULT: "#8B5E3C", // Soft Brown Accent
          light: "#A07050",
        },
        accent: {
          DEFAULT: "#FBC02D", // Warm Yellow Buttons
          hover: "#F9A825",
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "sans-serif"],
        serif: ["var(--font-baloo)", "cursive"],
        mono: ["var(--font-poppins)", "monospace"],
      },
    },
  },
  plugins: [],
};
