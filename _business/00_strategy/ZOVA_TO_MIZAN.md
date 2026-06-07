# Zova → Mizan transformation plan

**Reference:** [Zova demo](https://zova-saas.webflow.io/) — designed by Lunis, available on Lovable/Framer/Webflow. The user pointed at this as the aesthetic target.

**Mandate:** zero changes to Mizan's functionality. The screening engine, scholar profiles, ratio thresholds, custom builder, zakat calculator, portfolio tracking, watchlist — all untouched. We only change *how things look and feel*, not *what they do*.

**Time estimate (with me, iteratively):** roughly 6–10 work sessions, broken into phases below. Each phase is shippable on its own.

---

## 1 · Zova teardown — what's actually doing the work

Zova reads as "clean modern fintech SaaS" because of a small number of distinct moves repeated everywhere. Here's the actual structure I extracted from the demo:

### Visual fundamentals

| Element | Zova does it | Mizan today |
|---|---|---|
| Background | Off-white / very light cream with subtle BG pattern PNG | Solid cream — close, no texture |
| Hero typography | Single very large sans-serif H1 ("Real-time insight for modern finance") with confident leading | Georgia serif H1 — different but on-brand for us |
| Body copy | One-line sentences, large 16–18px, generous line-height | Similar but lighter (gray-600) |
| Accent color | Soft warm orange / coral, used very sparingly on CTAs | Navy + gold — different palette, same restraint principle |
| Buttons | Pill-shaped, dark filled primary + light outline secondary, always paired | We have rounded-md, single primary mostly |
| Card surfaces | Cream cards on cream bg, separated by **hairline borders only**, no shadows | Same — Mizan already does this ✓ |
| Section dividers | Big empty space, no rules | Same ✓ |
| Motion | Hover lift on cards, subtle entrance animations, marquee scrolls for logos/integrations | None yet |
| Imagery | Real product screenshots embedded in every section + stock-photo human faces in some panels + soft pattern PNG behind hero | None currently |

### Section pattern Zova repeats

```
[ TAG ]                               ← small uppercase label, gold/orange tone
Big section headline                  ← serif/sans display, ~32–44px
One-paragraph explanation             ← light gray, generous leading
[ MOCK UI OR ANCHOR LINKS ]           ← product screenshot, integration grid, or feature tabs
```

That's the rhythm of the whole site. Hero → 4-up feature grid → "Why us" tabs → 3-step process → integrations marquee → pricing → testimonial → FAQ → blog → contact → final CTA → footer.

### The 8 distinctive moves Zova makes

1. **Hero with product screenshot** — large embedded dashboard image directly under the H1 ("Investment dashboard showing total invested $150,000…"). Sells the product by showing it.
2. **Animated brand strip marquee** — a row of customer/integration logos scrolling horizontally, infinite loop. Subtle social proof.
3. **"Why us" tabs section** — three anchor links (Real-time intelligence / Effortless workflow / Reliable accuracy) each unfolding into its own screenshot + description block.
4. **3-step numbered process** — "01 Connect / 02 Analyze / 03 View" with illustrations. Onboarding promise in one screen.
5. **Integrations grid** — 9-tile grid of logo + one-line description ("Connect Framer to display live financial data…"). Reads as "this fits into your stack."
6. **Pricing table** — 3 tiers (Starter free / Growth $49 / Pro $99), feature lists with checkmarks, primary CTA per tier.
7. **Testimonial with face** — one customer quote, big, with portrait + company logo. Single human moment.
8. **FAQ accordion** — collapsible Q&A, takes pressure off the hero copy by hiding objections answers.

---

## 2 · How each Zova move translates to Mizan (without changing functionality)

The trick is to take the *structural pattern* but keep Mizan's **FT-print + Bloomberg-Terminal** identity (cream backgrounds, gold accents, Georgia serif, monospace tabular data). We don't become Zova-clone; we become "Mizan, refined with Zova's rhythm."

### Move 1 → Hero with product screenshot
Mizan has the *AMZN under AAOIFI vs Mufti Taqi* wedge above the search. That's our "embedded dashboard." We should:

- **Make it taller** — the verdict panels can be 1.5× current height
- **Add a faint background pattern PNG** behind the page (or a CSS gradient mesh) so it doesn't feel as flat
- **Replace the static text-only verdict with a live mock card** that shows the actual verdict for AMZN under whichever scholar the user has saved, animated to appear on page load

**File to touch:** `src/app/page.tsx` lines for the Why Mizan wedge.

### Move 2 → Brand strip marquee
Mizan's "Sourced from" badges (AAOIFI · S&P DJIM · Mufti Taqi · Sistani · SEC) are already in place. To Zova-ify:

- **Animate them as a marquee scroll** — slow infinite horizontal scroll
- Add a second row of *covered company logos* below: AAPL · MSFT · TSLA · AMZN · JPM · ... — also scrolling, the opposite direction
- Tagline above: "Mizan screens 342 companies across 6 scholars"

This becomes a *visible-proof-of-coverage moment* that Mizan currently lacks.

**File to touch:** `src/app/page.tsx` "Sourced from" section. Build a small `<MarqueeRow>` component that scrolls children with CSS `@keyframes`.

### Move 3 → "Why us" tabs section
Currently Mizan has three static feature cards on home. Convert them to Zova-style tabs:

- **Anchor links across the top:** "Multi-scholar / Show-the-math / Halal alternatives"
- **Below each link:** a mock screenshot showing that feature, plus a 2-line description
- **Click → smooth-scroll** to that block (no JS state, just anchors)

Concretely:
- *Multi-scholar:* mock of the 5-scholar comparison table from /screen
- *Show-the-math:* mock of an expanded CalculationCard showing line items + division
- *Halal alternatives:* mock of three suggested halal stocks when one fails

The mocks are *real* — generated by the engine, not Photoshop. That's Mizan's edge: the marketing IS the product.

**File to touch:** `src/app/page.tsx` (replace the three FeatureCards section). New component: `<FeatureTabs>` in `src/components/`.

### Move 4 → 3-step numbered process
Mizan should have this. Steps:
- **01 · Pick your scholar.** *Six options + a custom builder. Pick once, change anytime.*
- **02 · Screen any stock.** *Type a ticker. See the verdict + the math. No black-box scores.*
- **03 · Build your portfolio.** *Track holdings, watchlist tickers, get earnings alerts.*

Render as three numbered cards in a row with one icon each + 2-line description. Big "01 / 02 / 03" in Georgia serif, gold-600.

**File to touch:** `src/app/page.tsx` — new section after the wedge.

### Move 5 → Integrations grid
We don't have integrations in the SaaS sense, but the equivalent for Mizan is **methodology sources** plus the **brokerage/import paths** users will care about. A grid like this:

| AAOIFI | "Standard No. 21, every threshold cited." |
| S&P DJIM | "Cross-checked against the index methodology." |
| Mufti Taqi Usmani | "Published rulings — illiquid-asset rule, only on Mizan." |
| Sistani.org | "Ja'fari verdicts from the Code of Practice." |
| SEC Edgar | "10-Q/10-K line items, sourced directly." |
| FMP API | "Live company fundamentals, refreshed quarterly." |

Each tile: small icon/logo or just a Georgia abbreviation, then plain-English line. Cream cards, hairline border. *This is where editorial Mizan beats SaaS Zova — these are sources of authority, not vendors.*

**File to touch:** `src/app/page.tsx` — new section, can replace the "Sourced from" pill row.

### Move 6 → Pricing table
**Skip for now.** Mizan is pre-revenue, free in private beta. Pricing makes no sense yet. When you eventually want to charge, this section gets built then. Lock for v4.

### Move 7 → Testimonial
Currently we have nothing. When users start saying nice things (Tyler's been positive, Miqdad has endorsed the methodology), capture quotes. For now, the equivalent on-brand move is a **scholar endorsement quote** when you get one. Mufti Faraz Adam's response, if positive, goes here.

Reserve the section but leave it commented out until there's a real quote.

### Move 8 → FAQ accordion
We already have one on `/learn`. **Promote it.** Add a "Common questions" section on the homepage — a 6-question accordion lifted from /learn. Specifically the ones tested users actually asked:

- *"Are you a scholar?"*
- *"Who decides which threshold belongs to which scholar?"*
- *"Why are some stocks halal under AAOIFI but not Mufti Taqi?"*
- *"What does 'show the math' actually mean?"*
- *"Do I need an account?"*
- *"How current is the data?"*

**File to touch:** `src/app/page.tsx` — new accordion section. Reuse the `<Q>` component from `/learn`.

---

## 3 · Phased delivery plan

Six phases. Each is one focused session, each ships independently. We don't try to do all of this in one push — that's how you break things.

### Phase 1 — Foundation (~1 session, 1–2 hours)
- Background texture (subtle SVG pattern or CSS noise) on the homepage cream
- Button system upgrade: pill-shaped primary (filled navy), pill outline secondary, paired by default everywhere
- Animation foundation: install nothing (no framer-motion) — use Tailwind's built-in `animate-in fade-in slide-in-from-*` + CSS `@keyframes` for marquees
- Add hover-lift utility class: `transition shadow hover:-translate-y-0.5 hover:shadow-sm`
- Update `DESIGN_DIRECTION.md` with the Zova-borrowed patterns and v3.1 tokens

### Phase 2 — Hero refresh (~1 session)
- Bigger Why Mizan wedge with the new background texture
- Pill CTA buttons under the H1 ("Try a stock →" + "Read the methodology")
- Replace the static AAOIFI/Mufti Taqi panel with a *live* mock card driven by the engine

### Phase 3 — Marquees and integrations (~1–2 sessions)
- Build `<MarqueeRow>` component (pure CSS, infinite scroll)
- "Sourced from" → marquee of source badges + scholar names
- New "Stocks covered" marquee row with company logos (AAPL, MSFT, etc.)
- New methodology-sources grid (Move 5) replacing the current pill row

### Phase 4 — Feature tabs & 3-step process (~2 sessions)
- Replace the three static feature cards with the `<FeatureTabs>` section (Move 3) — embeds real mock screenshots driven by the engine
- Add 3-step "How it works" section (Move 4) above the feature tabs
- Move the EarningsCalendar below the 3-step process (the live data block is the proof of "View clear insights")

### Phase 5 — Social proof & FAQ (~1 session)
- Promote 6 FAQ questions from `/learn` to homepage as accordion
- Add scholar-endorsement placeholder card (commented out until first endorsement signed)
- Add "Reviewed by [scholar names]" line under the H1 once signed

### Phase 6 — Polish (~1 session)
- Apply the same hero/button/marquee polish to other top-level pages (`/screen`, `/universe`, `/learn`)
- Sweep typography sizes for consistency vs the v3.1 spec
- Apply hover-lift to every interactive card across the app
- Audit accessibility: focus rings, alt text, semantic headings (Zova actually skimps on this; we won't)

---

## 4 · What this does NOT change

To be crystal clear about preserving functionality:

- **Screening engine:** untouched. Same `screenStock(stock, scholar)` → `ScreeningResult`
- **Scholar profiles:** untouched. Same six + custom builder
- **Ratio thresholds:** untouched. Same AAOIFI 30% debt cap, Mufti Taqi 20% illiquid floor, DJIM 33% caps, etc.
- **Custom builder:** untouched. Sliders + tick-marks already shipped
- **Zakat calculator:** untouched. Inputs → Calculate button → result hero already shipped
- **Portfolio tracking:** untouched. Position model, gain/loss math, sector allocation already shipped
- **Watchlist:** untouched. Save/unsave, localStorage persistence already shipped
- **Routes:** unchanged. `/` `/screen` `/universe` `/portfolio` `/watchlist` `/learn` `/zakat` `/custom` `/methodology` `/about` `/trust` `/lists` — all stay where they are
- **Data:** `src/data/stocks.json` untouched. 342 tickers, real fundamentals, no changes
- **APIs:** none added. No new services to integrate. No new accounts to create

Every change is *cosmetic + structural* on the marketing/discovery surface. Engine + data layer is sacred.

---

## 5 · Risks and how I'll mitigate them

| Risk | Mitigation |
|---|---|
| Zova-style polish makes us look generic SaaS | We keep editorial Mizan signature (Georgia serifs, cream + gold, FT spreads) — Zova just informs the rhythm |
| Background pattern looks tacky | Test 3 options (mesh gradient, subtle noise SVG, plain), commit only what reads as restrained |
| Marquees feel desperate | Keep them slow (40s+ per loop), low contrast, single-row max |
| Feature tabs require JS state | Use anchor links + `scroll-margin-top` instead. No state, no flicker |
| FAQ accordion bloats the page | Six questions max, the most-asked ones, with a "see all" link to `/learn` |
| New backgrounds break print/contrast on `/portfolio` data tables | Background texture is homepage-only, not pages-wide |

---

## 6 · One Zova move I think we should SKIP

Stock-photo human faces. Zova has a smiling-woman headshot on a panel. For Mizan that's wrong on three counts:

1. We don't have customers yet, fake faces lie
2. Stock-photo people instantly tank credibility for a financial app
3. Editorial / FT aesthetic doesn't use them

When we have real scholars on the board, use *real* portraits — Mufti Taqi's published photo, Sheikh Joe Bradford if signed, etc. Never stock.

---

## 7 · Final note on aesthetic vs. function

The reason this plan works is that Mizan's *function* and Zova's *aesthetic* don't fight each other. Both are about "look serious enough to be trusted with money decisions." We just have *more* function and *better* sources to back it up — Zova fakes the gravitas; Mizan earns it.

When we finish Phase 6, Mizan won't look like Zova. It'll look like *what Zova would have been if it had Mizan's actual product underneath*. That's the moat.
