import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

/**
 * Palette — Forest family.
 *
 * Replaces the prior navy + gold (warm-craft) palette which was named in
 * the Taste skill's banned "premium-consumer cream + brass" list and read
 * as AI-default. The class names `navy` and `gold` are kept so existing
 * components don't need a find-replace, but the HEX values are now Forest
 * green + Amber — same shape, different feel.
 *
 *   - `navy` → deep emerald/forest scale (primary brand)
 *   - `gold` → muted amber (accent / highlights)
 *
 * Long-term, these should be renamed to `forest` and `amber` and the body
 * background palette in src/app/globals.css should move off the warm
 * #fafbfc — but for now, the recoloring covers the highest-visibility tells.
 */
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Forest scale — replaces "navy" (same class names, new feel).
        // 800 is the primary brand color used in CTAs and headings.
        navy: {
          50:  "#f1f7f3",
          100: "#dcebe1",
          200: "#b8d6c4",
          300: "#8ebca2",
          400: "#5f9d7e",
          500: "#3f8062",
          600: "#2f664e",
          700: "#26543f",
          800: "#1c4537",
          900: "#14322a",
        },
        // Amber scale — replaces "gold" (same class names, less brass).
        gold: {
          50:  "#fbf6ec",
          100: "#f5e9d0",
          200: "#ebd3a3",
          500: "#c89030",
          600: "#a87620",
          700: "#855c1a",
        },
      },
    },
  },
  plugins: [typography],
};
export default config;
