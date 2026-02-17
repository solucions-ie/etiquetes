import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#edf2f3",
          100: "#d1dde0",
          500: "#1C323B",
          700: "#15262d",
          900: "#0e1a1f"
        },
        ink: "#1C323B"
      },
      boxShadow: {
        panel: "0 20px 50px -25px rgba(15, 23, 42, 0.35)"
      }
    }
  },
  plugins: []
};

export default config;
