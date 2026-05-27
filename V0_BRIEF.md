# Mizan — v0 design briefs

This document contains three drop-in prompts for v0.dev, in priority order. Use them one page at a time. Don't paste all three at once — v0 does its best work focused on a single screen.

---

## How to use this

1. Open https://v0.dev and sign in (use your GitHub).
2. Click **New chat** (top-left).
3. Copy the **entire block** under "Prompt 1" below — from "You are designing…" to the end of the constraints — and paste it as your first message.
4. v0 will generate a full page in ~30-60 seconds. It renders live on the right.
5. Iterate in plain English: "tighten the headline," "remove the gradient," "make the wedge panels feel more like an FT print spread."
6. When you're happy with a version, click the **Code** tab on the top right of the preview.
7. Copy the `page.tsx` contents.
8. **Before pasting into Mizan:** back up your current page with `cp src/app/page.tsx src/app/page.tsx.bak`.
9. Paste the new code over `src/app/page.tsx`.
10. Run `npm run dev` and check `/`. Likely fixes you'll need to make:
    - Remove any `@/components/ui/*` shadcn imports v0 added → replace with raw Tailwind or your existing `src/components/ui/*`
    - Re-wire `TickerSearch` and `CURATED_LISTS` from the original page (v0 doesn't know these exist)
    - Adjust any color tokens it invented to your actual Tailwind palette (`navy-800`, `gold-600`, etc.)

**Repeat for prompts 2 and 3 in separate v0 chats.** Fresh chat each page = no context contamination.

---

## Prompt 1 — Home page (`/`)

Paste everything in the fenced block below into a fresh v0 chat.

```
You are designing the home page of Mizan, a halal stock screener for Muslim investors. Mizan's differentiation: every other halal app screens against ONE standard (AAOIFI). Mizan shows the verdict under SIX scholarly methodologies side-by-side, including the strict Mufti Taqi Usmani interpretation that no other app implements. The audience is sophisticated retail Muslim investors (25-45, college-educated, often immigrants in the US/UK/Gulf) who don't trust black-box halal labels and want to see the math.

DESIGN LANGUAGE — this is the most important section. Mizan must look like an editorial financial publication, not a SaaS dashboard. Reference points, in priority order:
- Financial Times print-to-web (hairline rules, serif headlines, restrained color)
- Stripe (typographic discipline, generous whitespace, single accent color)
- Linear (precise grid, no decoration that doesn't earn its space)
- Pentagram editorial work (confident headline scale, asymmetric balance)

EXPLICITLY AVOID — these are the failure modes:
- No gradients anywhere
- No drop shadows on cards (use 1px borders instead)
- No more than ONE accent color per viewport (gold/amber)
- No icon-in-circle-with-soft-background patterns
- No "hero with abstract 3D shape" SaaS landing-page tropes
- No emoji
- No shadcn/ui imports — use raw Tailwind classes only
- Use lucide-react for icons (already installed in the project)

TECH CONSTRAINTS:
- Next.js 15 App Router, "use client" at top
- Tailwind utility classes only — no inline styles except `fontFamily: "Georgia, serif"` on headlines
- Color palette to use: navy-800 (#1e3a5f), navy-700, gold-600 (#b8860b), emerald-700, rose-700, gray-50 through gray-900
- Headlines use `style={{ fontFamily: "Georgia, serif" }}` — body is default sans
- Kickers (small-caps section labels) use: `text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500` — never more than one gold/amber accent per viewport
- Section spacing: `mt-28` between major sections
- Max content width: `max-w-2xl` for prose, `max-w-3xl` for the wedge, `max-w-4xl` for grids

PAGE STRUCTURE — build exactly these sections in this order:

1. Small status line, centered, very subtle: a 6px amber dot + "PRIVATE BETA · status" in 11px gray uppercase, link to /trust. NOT a banner. Just a whisper above the headline.

2. Hero, centered, max-w-2xl:
   - Serif headline at 42px mobile / 64px desktop, line-height 1.02: "Is your stock halal?"
   - Subhead at 17px gray-600: "Type any ticker. See the verdict under six scholarly methodologies — including the rules no other app implements."
   - Search input (placeholder: "Try AAPL, AMZN, TSLA, or 'apple'…") — render as a styled input, not a real search component
   - Below input, a row of small ticker chips: AAPL AMZN TSLA MSFT JPM SPUS — each as a bordered pill with `font-mono text-[11px]`

3. Hairline separator, then a 3-column trust strip with max-w-xl: "6 scholar profiles", "163 stocks screened", "0 black-box scores" — numbers in 28px serif navy-800, labels in 10px gray uppercase.

4. THE WEDGE — this is the page's anchor moment. Max-w-3xl, centered:
   - Gold kicker: "WHY MIZAN"
   - Serif headline: "Most apps check one rulebook. Muslims follow many." (with explicit line break between sentences)
   - Body: "Every major halal app screens against one standard (AAOIFI). Different scholars reach different verdicts on the same stock. Take Amazon:"
   - Two-column comparison panel below — one rounded-xl border container with a vertical divider between two halves:
     - LEFT: small emerald-700 kicker "UNDER AAOIFI", then 56-64px serif emerald-700 "Halal", then a ratio row "Debt/cap 6.5% · cap 30%" in mono, then small gray caption "What Zoya, Wahed, and Musaffa would tell you."
     - RIGHT: small rose-700 kicker "UNDER MUFTI TAQI USMANI", then 56-64px serif rose-700 "Not halal", then "Tangible 12% · floor 20%" in mono, then "His illiquid-asset rule excludes AMZN. No other app surfaces this."
   - Below the panel, a single understated link: "See AMZN under all six scholars →"

5. Three feature cards in a row, max-w-4xl, separated by 1px gray dividers (gap-px on bg-gray-200 trick):
   - "New to investing?" — primer on stocks, halal screening, scholar disagreements. CTA: "Halal Investing 101" → /learn
   - "Calculate your zakat" — cash, stocks, gold, crypto, nisab, 2.5%. CTA: "Open the calculator" → /zakat
   - "Ask a question" — 49 common questions answered per scholar (crypto, gold, mortgage, 401k, options). CTA: "Try the Q&A" → /ask
   Each card: small lucide icon in a navy-50 square (no circle), serif title, 13px gray body, navy CTA with arrow.

6. Curated lists section, max-w-4xl:
   - Header row: gray kicker "DISCOVER" + serif "Not sure where to start?" + "All lists →" link on the right
   - 3 placeholder list cards in a grid: each shows a gray kicker, serif title, "12 stocks" count, 2-line description.

7. "What Mizan is / isn't" — max-w-3xl, hairline above, two columns:
   - LEFT (emerald-700 kicker "WHAT MIZAN IS"): bulletless list of 4 lines
     - Free, transparent halal stock screening.
     - Six scholarly methodologies + a custom builder.
     - Zakat and purification calculators.
     - Information you can verify — we show the math.
   - RIGHT (rose-700 kicker "WHAT MIZAN ISN'T"): bulletless list of 4 lines
     - An investment advisor. We don't tell you what to buy.
     - A bank or brokerage. We don't hold your money.
     - A religious authority. We surface scholarly opinion.
     - A replacement for a qualified scholar for your specifics.

Output a single `page.tsx` file. No README, no setup notes — just the component. Use `export default function Home()`.
```

---

## Prompt 2 — Screen page (`/screen`)

Use this AFTER you've shipped Prompt 1 and are happy. Open a fresh v0 chat.

```
You are designing the primary tool page of Mizan, a multi-scholar halal stock screener. This page is at /screen and is reached when a user types a ticker on the home page. It must FEEL like a serious analyst's tool — Bloomberg Terminal restraint, not consumer-app cheerfulness.

Use the same design language as the Mizan home page: FT editorial typography, single accent color per viewport, no gradients, no shadows, hairline borders, Georgia serif headlines via inline style, raw Tailwind only, lucide-react for icons, no shadcn imports.

Color palette: navy-800, navy-700, gold-600, emerald-700, rose-700, amber-600, gray-50 through gray-900.

PAGE STRUCTURE — render for ticker "AMZN" as the example data:

1. Sticky top bar (inside the page, below the global header): ticker search input on the left (current value AMZN) + a scholar-selector pill row on the right showing 6 options: "AAOIFI", "Mufti Taqi Usmani", "DJIM", "Ja'fari", "Strict", "Custom". One is active (navy filled), others are gray outlined.

2. Hero row, max-w-6xl, grid-cols-12:
   - LEFT (col-span-8): company name "Amazon.com, Inc." in 32px serif, then "AMZN · NASDAQ · Consumer Discretionary" in gray. Below, a 4-stat row: Market cap $1.87T · Price $186.20 · P/E 42.1 · Sector Retail.
   - RIGHT (col-span-4): the VERDICT CARD. Border, no shadow. Kicker "UNDER MUFTI TAQI USMANI", then 48px serif rose-700 "Not halal", then 3 ratio rows showing each test name, the company's value, the threshold, and a pass/fail dot.

3. Below the hero, an EVIDENCE TABLE, max-w-6xl. 6 rows, one per scholar. Each row: scholar name + methodology link + verdict pill (green Halal / red Not halal / amber Doubtful) + the deciding metric in mono. Hairline borders between rows. No shadows. This is the page's center of gravity — the user's "aha" moment is seeing the same company get different verdicts.

4. A "WHY THE VERDICTS DIFFER" explainer panel, max-w-3xl, hairline above. Two-paragraph editorial prose explaining the AAOIFI debt ratio vs Mufti Taqi tangible-assets-floor distinction for AMZN specifically.

5. A purification estimate row: "If you held 100 shares this year, your estimated purification obligation is $X" — small, factual, link to /purification.

6. Footer row of related actions: "Compare AMZN with another stock →", "Save to watchlist", "Add to portfolio score".

Output a single `page.tsx` file. No fake data libraries — hardcode the AMZN example values directly in the JSX so the page renders standalone in v0's preview.
```

---

## Prompt 3 — Discover page (`/discover`)

Open a fresh v0 chat.

```
You are designing the discovery hub of Mizan, a multi-scholar halal stock screener. /discover is where users go when they don't have a specific ticker in mind. It's the "Zoya equivalent" page — but Mizan's edge is showing the multi-scholar lens at every turn.

Design language: identical to Mizan home — FT editorial restraint, Georgia serif headlines, navy + gold accent, no gradients, no shadows, raw Tailwind, lucide-react icons, no shadcn.

PAGE STRUCTURE, max-w-6xl:

1. Page header: kicker "DISCOVER", serif "Find your next halal investment" at 36px, subhead "Curated by scholar — re-screened against your selected methodology."

2. Trending halal mega-caps (under current scholar): a 4-column grid of cards, each showing ticker, company name, market cap, current price, and a small green pass pill. Example data: AAPL, MSFT, GOOGL, NVDA.

3. WHERE SCHOLARS DISAGREE — a table, this is the differentiator section. Header: kicker + serif "Where the scholars split". 6 rows, each a ticker (AMZN, TSLA, JPM, META, BRK.B, V) with 3 verdict columns (AAOIFI / Mufti Taqi / Strict) showing pass/fail/doubtful pills. Make the disagreements visually obvious — one row of mixed colors per stock.

4. TOP DIVIDEND YIELDERS — same card grid format as trending. Example: T, VZ, KO, CSCO.

5. SECTOR PASS-RATE RANKING — a horizontal bar list. Each row: sector name on the left, a thin horizontal bar showing % of stocks passing the current scholar's screen, percentage label on the right. Sectors: Tech, Healthcare, Consumer Staples, Industrials, Energy, Financials. Use navy bars on gray-100 background — no rainbow.

6. CROSS-ASSET TILES — three plain bordered cards in a row: "Crypto · Multi-scholar views", "Sukuk · Islamic bonds", "Compare stocks · Side-by-side". Each links to /crypto, /sukuk, /vs respectively.

Output a single `page.tsx` file with all data hardcoded for standalone preview.
```

---

## After v0 — recommended order

1. **Ship Prompt 1 first.** Get home page right before touching anything else. Home is your highest-traffic page and sets the visual tone everyone else inherits.
2. **A/B yourself.** Keep the old `page.tsx.bak` and toggle between them for a day. If the new one wins on every spot-check, commit.
3. **Only then move to Prompt 2.** Don't try to redesign three pages in parallel — you'll lose the through-line.
4. **After all three pages, extract the patterns into your design system.** v0 will likely converge on a `<Card>`, a `<Pill>`, a `<Kicker>`, a `<DataRow>` that look great. Move those into `src/components/ui/` so the rest of the site (Lists, About, Trust, Zakat) inherits the upgrade for free.

## If v0 disappoints

It will sometimes default to rounded shadowy cards no matter how clearly you prompt against them. Two fixes:
- Add to the prompt: "If you reach for a `shadow-` class, stop and use a 1px `border-gray-200` instead. If you reach for a `rounded-2xl`, use `rounded-xl` or `rounded-lg`."
- Paste a screenshot of your current home page into the chat with the message "match this restraint level, then improve typographic hierarchy and section rhythm."

That's usually enough to snap it out of SaaS-default mode.
