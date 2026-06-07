# Mizan v3 design direction

**Your call:** FT editorial vibe + Bloomberg Terminal professionalism + modern punch.

This document sets the locked-in direction so every future page upgrade fits the same identity. The big idea:

> Mizan looks like a **Financial Times print spread that runs on a Bloomberg Terminal**, modernized with confident typography and motion. Nothing else in halal-investing software looks remotely like this.

That's a moat. Wahed, Zoya, Musaffa all look like generic fintech apps. Mizan looking like *journalism that doubles as a screening engine* is positioning by visual identity alone.

---

## The signature move (memorize this)

Every page has at least one pairing of:

- **Elegant Georgia serif copy** — the editorial layer
- right next to —
- **Dense monospace tabular data** — the Bloomberg layer

That contrast IS the Mizan brand. If a page only has one and not the other, it's drifted off-brand.

Example: a verdict card has the word *"Halal"* in 56px Georgia next to `Debt / market cap: 6.5%   cap 30%` in 11px mono — same card, two voices in conversation.

---

## Color system (locked)

```
Foundation
  Cream      #FAF7F0   page backgrounds for editorial sections
  White      #FFFFFF   data sections, cards, tables
  Gray-50    #F9FAFB   alternate row, subtle stat tiles

Primary
  Navy-800   #1F3A5F   headlines, primary brand, "your scholar" highlights
  Navy-700   #2C4A6F   links, focus states, secondary headlines

Accent (use SPARINGLY — one moment per page max)
  Gold-600   #B8860B   "Why Mizan" eyebrow, key value highlights only

Verdict (consistent across the app)
  Emerald-700 #047857  PASS / Halal / safe / comfortable
  Amber-700   #B45309  Borderline / Doubtful / near limit
  Rose-700    #BE123C  FAIL / Not halal / breached

Data / chrome
  Gray-700   #374151   primary body text
  Gray-500   #6B7280   secondary text, captions
  Gray-300   #D1D5DB   hairlines, dividers
  Gray-200   #E5E7EB   card borders, table gridlines
```

Rule: gold is the rarest. If you see it twice on a single page, one of them is wrong.

---

## Typography hierarchy (locked)

```
Display 1     Georgia serif, 64–88px, bold, leading-[1.02]
              "Is your stock halal?" — hero H1 only

Display 2     Georgia serif, 36–48px, bold, leading-[1.1]
              Page H1 on /universe, /portfolio, /custom

Section head  Georgia serif, 24–32px, bold
              "Meet the scholars", "Why Mizan", etc.

Subhead       Georgia serif, 18–20px, semibold
              Inside cards and panels

Eyebrow       System sans, 10–11px, semibold, uppercase, tracking-[0.18em]
              "PRIVATE BETA", "WHY MIZAN", section kickers

Body          System sans, 14–16px, leading-relaxed
              All prose

Data / tabular numbers
              Liberation Mono / Menlo, tabular-nums
              Used for: every percentage, every dollar amount, every
              threshold, every ticker symbol, every ratio, market cap.
              EVEN INLINE IN PROSE: "with a debt ratio of 28.4%."

Caption       System sans, 11px, gray-500
              Source citations, "as of" dates, footnotes
```

**Bloomberg touch:** if it's a number, it's monospaced. No exceptions, including stats in the middle of an editorial paragraph.

---

## Layout & density (two modes)

Mizan has two distinct page modes. Don't mix them inside a single section.

### Editorial mode
- Max width: `max-w-2xl` (40rem) for prose, `max-w-3xl` for hero panels
- Generous vertical rhythm: `mt-20` to `mt-28` between sections
- Centered when single-column, left-aligned when content-heavy
- Used for: homepage, /learn, /about, /methodology

### Bloomberg / data mode
- Max width: `max-w-6xl` or full-width minus margins
- Tight vertical rhythm: `mt-6` to `mt-8` between sections
- Tables dominate, with hairline gridlines and no row backgrounds
- Used for: /universe, /portfolio, /screen below the verdict, /custom editor

Transition between modes within a page is fine — the homepage opens editorial (Why Mizan wedge), narrows to a hero search, then dilates back to a card grid. That rhythm is good. Just don't have a Bloomberg table sitting *inside* a max-w-2xl editorial paragraph; that's the dissonant version.

---

## Motion (subtle, deliberate)

- **Hover:** 200ms ease, navy-700 underline or background-shift
- **Focus:** 200ms border-color shift to navy-700, no harsh ring
- **Tab/switch transitions:** 150ms fade-in, slight slide-from-left
- **Numbers:** if a number changes on screen (scholar switch, slider drag), let it briefly highlight (`bg-amber-50/60`) for ~600ms then fade
- **Verdict reveal:** when a verdict first appears on /screen, a 400ms fade-in feels Bloomberg-terminal-y. Don't bounce, don't slide; just appear with intent.

Avoid: framer-motion choreography, parallax, anything "playful."

---

## Component upgrades (priority order)

### Tier 1 — first impressions (do these first)

1. **Hero H1 on home** — bump to text-[72px] / sm:text-[88px]. Mizan deserves to be loud at the top.
2. **Why Mizan wedge** — already strong, but the data lines (debt / market cap: 6.5%) should be bigger and feel ticker-tape. Pair with a small "AS OF" caption below each panel.
3. **"Meet the scholars" cards on home** — they exist; tighten typography hierarchy and add a `Verdict on AAPL` mini-row in monospace at the bottom of each card. Live data in editorial frames.

### Tier 2 — the verdict moment (`/screen`)

1. **Verdict card hero** — `text-[88px]` for "Halal" / "Not halal" in Georgia. The current 56px is good but underplayed for the focal moment.
2. **Stats strip** — instead of inline text, add a monospace 4-up grid: `DEBT 6.5%` / `CASH 12.1%` / `ILLIQUID 67.8%` / `IMP. INC. 0.4%`. Bloomberg ribbon.
3. **Multi-scholar table** — keep, but tighten row height, add hairline gridlines, monospace verdicts.

### Tier 3 — Bloomberg ribbons (everywhere)

Add a thin "last updated" ribbon at the top of any data page. Format:
```
LAST UPDATED  ·  2026-06-07 15:42 HKT  ·  342 TICKERS  ·  ENGINE v0.4
```
Monospace, 10px, gray-500. Sits like a Bloomberg status bar.

### Tier 4 — empty states

Right now empty states are functional but plain. Each should have:
- A faint icon (12px lucide, gray-300)
- A 16px sans line ("No holdings yet.")
- A monospace caption with a CTA ("Add your first position →")

### Tier 5 — micro-details

- Tabular-num on EVERY number, no exceptions
- Hairlines instead of card shadows (kill `shadow-sm` everywhere)
- Section dividers: `border-t border-gray-200 pt-14`, never thicker
- Pills/badges: rounded-full, single-line, 10–11px uppercase
- Buttons: navy bg for primary, gray-200 border for secondary, no gradients

---

## 21st.dev components worth looking at

For inspiration only — don't paste anything wholesale. Look, learn the pattern, then I'll rebuild in the Mizan style.

| Category | Why look here | URL |
|---|---|---|
| Heroes | For the home H1 + Why Mizan punch | [21st.dev → Heroes](https://21st.dev/community/components/s/hero) |
| Comparisons | For the AAOIFI vs Mufti Taqi split | [Comparisons](https://21st.dev/community/components/s/comparison) |
| Numbers | Bloomberg-style stat displays | [Numbers](https://21st.dev/community/components/s/number) |
| Tables | For /universe and /portfolio | [Tables](https://21st.dev/community/components/s/table) |
| Cards | "Meet the scholars" tightening | [Cards](https://21st.dev/community/components/s/card) |
| Empty States | for /portfolio, /watchlist | [Empty States](https://21st.dev/community/components/s/empty-state) |

When you find one you like, paste the code and one line like:
> *"Adapt this hero for the home page, keep our colors."*

---

## What this direction explicitly is NOT

Important to mark these so we don't drift:

- **Not Robinhood-green.** Verdict colors only. Never a wash of green or rose on a page.
- **Not dark-mode default.** Cream/white is the foundation. (We can add dark mode later as an opt-in.)
- **Not gradient-y.** Solid colors only. No `from-X to-Y` Tailwind gradients anywhere.
- **Not iconography-heavy.** Lucide line icons, used sparingly. No filled icons. No mascot, no illustrations.
- **Not "fintech app friendly."** This is FT meets Bloomberg. Slightly intimidating is fine — it reads as competent.

---

## How I'll apply this from here

Every code change I make from now on follows this doc. If you ever feel a page has drifted, say:

> *"This isn't on-brand — review against DESIGN_DIRECTION.md"*

and I'll re-anchor.

For new pages or major redesigns, I'll start by sketching against this doc before writing JSX. For the homepage demo coming next, you'll see all of Tier 1 applied.
