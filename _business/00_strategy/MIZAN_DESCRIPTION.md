# Mizan — description for AI design briefs

Paste this whole document into another AI when you want a UI/UX critique, a
landing-page idea, a feature mockup prompt, or any other design brief. It
covers what Mizan is, who it serves, what makes it distinctive, and the
brand direction it should never drift from.

---

## 1 · What Mizan is

Mizan is a halal stock screener for Muslim retail investors. The user
types a ticker (AAPL, AMZN, TSLA), picks a scholarly methodology
(AAOIFI, Mufti Taqi Usmani, S&P DJIM, Ja'fari, the strict view, or a custom
profile they build), and Mizan returns a verdict — Halal, Doubtful, or Not
halal — together with the full math: which financial ratios were checked,
what the thresholds are, where those thresholds come from, and the line
items inside the company's filings that drive each ratio.

It is currently a web application (Next.js, Tailwind, TypeScript, deployed
on Vercel). It covers around 342 publicly traded tickers across US, UK,
Saudi, Hong Kong, and Japan listings, with full quarterly balance-sheet
data on the highest-coverage names. It runs a single-file screening engine
with no external API calls at request time.

Mizan is in private beta. There is no paid tier yet. There is no
account system; user preferences (active scholar, watchlist, custom
profile) persist in browser localStorage.

## 2 · Who Mizan is for

Three distinct user types:

1. **The serious Muslim investor** who already understands halal investing
   and is frustrated with every existing app pretending there's one right
   answer. They want Mufti Taqi Usmani's illiquid-asset rule properly
   implemented. They want to see the math, not a black-box compliance score.
2. **The casual Muslim investor** — younger, often new to investing — who
   doesn't know which scholar they follow but wants to make sure their
   Robinhood holdings are basically clean. They want the AAOIFI default
   plus a friendly explanation of what each ratio means.
3. **The non-Muslim curious user** — academics, fintech founders, the
   Cyberport judges — who want to understand the field. They want
   pedagogical clarity.

The product surfaces all three at once: a serious user can drill into a
balance sheet, while a casual user can see a verdict in three taps.

## 3 · What makes Mizan distinctive (the moat)

Five things, in priority order:

1. **Multi-scholar transparency.** Every other halal app screens against
   one rulebook (almost always AAOIFI) and hides the disagreement.
   Mizan shows the verdict under six methodologies side-by-side on every
   stock. The disagreement IS the product.
2. **Mufti Taqi Usmani's illiquid-asset rule.** No other app implements
   this properly. It's the single most-asked-about omission in the
   Hanafi-following diaspora. Mizan is the only place a Hanafi user can
   actually see whether AMZN passes Mufti Taqi's framework (it doesn't —
   12% tangible vs the 20% floor).
3. **Primary-source citations.** Every threshold traces back to a
   published document: AAOIFI Shariah Standard No. 21, Mufti Taqi's
   published rulings, S&P DJIM's index methodology PDF, sistani.org's
   Code of Practice, the SEC 10-Q/10-K for the underlying numbers. No
   third-party scores, no algorithmic proprietary anything.
4. **Show the math.** Click any check and expand to see the line items
   that built the numerator and denominator, the calculation, the
   threshold, and the citation. Built on the trust principle that what
   can be verified will be.
5. **Breach-risk indicators.** A passing stock can flip next quarter when
   debt creeps up or illiquid assets fall. Mizan computes a per-ratio
   "buffer to threshold" and a per-stock stability score across the last
   8 quarters, so users can see which holdings are about to fail before
   they do.

## 4 · Brand attributes (locked direction)

The visual identity is a deliberate cross between **Financial Times print
journalism** and **Bloomberg Terminal seriousness**, modernized with
confident typography. Mizan should look like an editorial newspaper that
runs the world's most rigorous halal screening engine.

The reason this is moat-building: every halal-investing competitor (Wahed,
Zoya, Musaffa, Islamicly) looks like a generic fintech consumer app —
gradients, mascots, friendly green palettes. Mizan looking like the FT
crossed with Bloomberg is positioning by visual identity alone.

### Color foundation
- Background: cream (#FAF7F0) for editorial sections, white for data
  sections.
- Primary: navy 800 (#1F3A5F) for headlines and brand.
- Accent: gold 600 (#B8860B), used sparingly — one accent moment per page,
  never two.
- Verdict colors: emerald 700 for pass, amber 700 for borderline, rose
  700 for fail. These are reserved for verdict states and should never
  appear as decorative color.

### Typography
- Display: Georgia serif (or any old-style serif). Big, confident,
  generous leading. Used for every H1, every section headline, and any
  word that needs editorial weight ("Halal", "Mizan", "The scholars
  disagree.").
- Body: system sans, 14–16px, generous line-height.
- Data: monospaced (Liberation Mono / Menlo), tabular nums on every
  number. Every percentage, every dollar amount, every threshold, every
  ratio, every market cap. Even inline in prose: "with a debt ratio of
  28.4%."
- Eyebrows: 10–11px, semibold, uppercase, wide tracking (`tracking-[0.18em]`).

### The signature move
Every page must have at least one pairing of editorial Georgia serif
copy directly next to dense monospace tabular data on the same surface.
That contrast IS the brand. If a page only has one and not the other,
it's drifted off-brand.

Example: the verdict card on the screen page has the word "Halal" in 56px
Georgia next to `DEBT / MKT CAP   6.5%   cap 30%` in 11px mono. Same card,
two voices in conversation.

### Layout density (two modes)
- **Editorial mode:** max-w-2xl, generous vertical rhythm (mt-20 to
  mt-28 between sections), centered when single-column. Used on home,
  /learn, /about, /methodology.
- **Bloomberg / data mode:** max-w-6xl or full-width, tight vertical
  rhythm, tables dominate with hairline gridlines and no row backgrounds.
  Used on /universe, /portfolio, /screen below the verdict, /custom editor.

### Motion (subtle, deliberate)
- 200ms ease on hover/focus transitions
- Numbers that change on screen (scholar switch, slider drag) briefly
  highlight with `bg-amber-50/60` for ~600ms then fade
- No framer-motion choreography, no parallax, no "playful" anything
- The one big motion moment is the homepage iPad — a scroll-driven 3D
  tilt that reveals the actual product UI

### What Mizan is NOT
Important so we don't drift:
- Not Robinhood-green wash. Verdict colors are reserved for verdict states.
- Not dark-mode default. Cream and white are foundational.
- Not gradient-heavy. Solid colors only. No `from-X to-Y` Tailwind gradients
  anywhere.
- Not iconography-heavy. Lucide line icons, used sparingly. No filled
  icons, no mascot, no illustration.
- Not fintech-app-friendly. Slightly intimidating reads as competent.
  It's allowed to look serious.

## 5 · Current product surface

These pages exist and work:

- `/` — homepage (search, marketing)
- `/screen?ticker=XYZ` — single-stock detail with verdict, multi-scholar
  comparison, expandable line-item math, halal alternatives on fail,
  8-quarter stability timeline
- `/universe` — browsable table of every covered ticker with scholar +
  sector + verdict filters
- `/discover` — curated trending lists, sector breakdowns, "where the
  scholars split" examples
- `/learn` — pedagogical primer on halal investing, scholar profiles
- `/methodology` — the principles document
- `/custom` — slider-based custom scholar profile builder with live
  preview
- `/portfolio` — holdings tracker with gain/loss, halal share, sector
  allocation, time-period chart, earnings calendar
- `/watchlist` — saved tickers list
- `/zakat` — annual zakat calculator with nisab progress
- `/purification` — dividend purification calculator
- `/lists` and `/lists/[slug]` — curated stock collections
- `/ask` — 49 pre-answered scholarly Q&A
- `/trust`, `/about`, `/contact`, `/calendar`, `/crypto`, `/sukuk`,
  `/vs` — supporting pages

## 6 · How to brief another AI

If you want a critique, a landing-page mockup, a single-feature redesign,
or a copy review from another AI, give it:

1. **This document** as context.
2. **Specifically what you want** — "redesign the verdict card on /screen
   to feel more Bloomberg Terminal," or "write five hero H1 options for
   the homepage that beat 'Is your stock halal?'", or "critique the visual
   hierarchy of the /portfolio dashboard."
3. **The constraints** — "keep the FT + Bloomberg aesthetic locked in.
   Cream + navy + gold + verdict colors only. Georgia for display,
   monospace for data. No SaaS gradients, no mascot, no stock-photo
   humans."
4. **What feeling you want** — "more confident," "less busy," "more
   editorial," "more terminal-y." Taste calls drive integration choices.

If the other AI's output drifts off the FT + Bloomberg identity, ignore
it. The moat is the look. Don't trade it for generic clean SaaS.
