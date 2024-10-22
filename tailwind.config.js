/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        spooky: ["var(--font-rubik)", "sans-serif"],
        spooky2: ["var(--font-nosifer)", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        fadeIn: {
          "0%": {backgroundColor: "rgba(0, 0, 0, 1)"},
          "100%": {backgroundColor: "rgba(0, 0, 0, 0.4)"},
        },
        fadeInTitle: {
          "0%": {opacity: "0", transform: "translateY(40px)"},
          "100%": {opacity: "1", transform: "translateY(0)"},
        },
      },
      animation: {
        fadeIn: "fadeIn 4s ease-in-out forwards", // 4 seconds animation
        fadeInTitle: "fadeInTitle 4s ease-out forwards", // 2 seconds animation
      },
    },
  },
  plugins: [],
};
