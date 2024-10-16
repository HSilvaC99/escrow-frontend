/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "selector", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        light: "#1f2937",
        dark: "#e5e7eb",
        light_hover: "#d1d5db",
        dark_hover: "#4b5563",
      },
    },
  },
  plugins: [],
};
