import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./*.{html,js,ts,tsx}", "./src/**/*.{html,js,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#171430",
        secondary: "#26233c",
        tertiary: "#e2443c",
        lightGrey: "#90909d",
        white: "#FEFEFE",
        black: "#2D2D2D",
        skeletonPrimary: "#cccccc",
        skeletonSecondary: "#e0e0e0",
      },
    },
  },
  plugins: [],
};

export default config;
