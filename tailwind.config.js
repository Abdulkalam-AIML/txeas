/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        tgb: {
          darknavy: "#071522",
          navy: "#0B1B2A",
          navylight: "#132738",
          navyborder: "#1E3952",
          gold: "#C99A3E",
          goldlight: "#E2BD69",
          golddark: "#A37A2C",
          goldglow: "#F5D77F",
          warmgray: "#F5F3EE",
          warmgraydark: "#E8E4DA",
          muted: "#8A9BA8",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-cinzel)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
