import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f1115",
        panel: "#161a21",
        border: "#262b35",
        accent: "#22c55e",
        accentDim: "#16a34a",
      },
    },
  },
  plugins: [],
};

export default config;
