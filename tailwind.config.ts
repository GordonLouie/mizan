import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  "#f3f6fa", 100: "#e3ebf3", 200: "#c4d4e3",
          300: "#94b1cb", 400: "#5e89af", 500: "#3d6c95",
          600: "#2e547a", 700: "#264464", 800: "#1f3a5f", 900: "#162a44",
        },
        gold: { 500: "#b8860b", 600: "#9a700b" },
      },
    },
  },
  plugins: [typography],
};
export default config;
