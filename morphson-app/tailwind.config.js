/** @type {import('tailwindcss').Config} */

const config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#171430",
        secondary: "#26233c",
        tertiary: "#e2443c",
        white: "#FEFEFE",
        black: "#2D2D2D",
        light: {
          grey: "#90909d",
        },
      },
      fontFamily: {
        primary: ["Roboto", "Helvetica", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
