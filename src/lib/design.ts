// Mizan design tokens — single source of truth for all visual decisions.
// Every page imports from here; nothing else should hardcode colors/spacing.

export const COLOR = {
  // Brand — Forest palette (replaces the prior warm navy + brass gold which
  // was in the Taste skill's banned "premium-consumer cream + gold" list).
  // Token names kept as `navy` and `gold` for compatibility; values are now
  // deep forest green and muted amber.
  navy:        "#1C4537", // forest 800 (primary brand)
  navyDark:    "#14322A", // forest 900
  navyLight:   "#26543F", // forest 700
  navy50:      "#F1F7F3", // forest 50
  navy100:     "#DCEBE1", // forest 100
  navy200:     "#B8D6C4", // forest 200
  gold:        "#A87620", // amber 600
  goldLight:   "#C89030", // amber 500
  gold50:      "#FBF6EB",

  // Neutrals
  ink:         "#0F172A",
  ink2:        "#334155",
  muted:       "#64748B",
  muted2:      "#94A3B8",
  hair:        "#E2E8F0",
  hair2:       "#F1F5F9",
  surface:     "#FFFFFF",
  bg:          "#FAFAF7",

  // Semantic — used ONLY for these meanings
  pass:        "#047857",
  passLight:   "#10B981",
  pass50:      "#ECFDF5",
  fail:        "#BE123C",
  failLight:   "#F43F5E",
  fail50:      "#FFF1F2",
  warn:        "#B45309",
  warnLight:   "#D97706",
  warn50:      "#FFFBEB",
} as const;

// Typography
export const FONT = {
  serif: "Georgia, 'Times New Roman', serif",
  sans:  "ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Inter', system-ui, sans-serif",
  mono:  "ui-monospace, SFMono-Regular, 'Menlo', monospace",
} as const;

// Size scale (in pixels)
export const SIZE = {
  xs:   "11px",
  sm:   "13px",
  base: "15px",
  md:   "16px",
  lg:   "18px",
  xl:   "22px",
  "2xl": "28px",
  "3xl": "36px",
  "4xl": "48px",
  "5xl": "64px",
} as const;

// Spacing scale — Tailwind-ish but enforced
export const SPACE = {
  px:  "1px",
  0.5: "2px",
  1:   "4px",
  2:   "8px",
  3:   "12px",
  4:   "16px",
  5:   "20px",
  6:   "24px",
  8:   "32px",
  10:  "40px",
  12:  "48px",
  16:  "64px",
  20:  "80px",
} as const;

// Radii
export const RADIUS = {
  sm:   "6px",
  md:   "10px",
  lg:   "12px",
  xl:   "16px",
  full: "9999px",
} as const;

// Shadows — used sparingly. NEVER for decoration; only for floating elements.
export const SHADOW = {
  none: "none",
  pop:  "0 4px 16px rgba(15, 23, 42, 0.06)",     // dropdowns, popovers
  lift: "0 8px 32px rgba(15, 23, 42, 0.12)",     // modals
} as const;

// Animation tokens
export const MOTION = {
  fast:   "120ms ease-out",
  base:   "180ms ease-out",
  slow:   "320ms ease-out",
} as const;
