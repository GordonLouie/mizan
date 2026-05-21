# Consumer fintech UI/UX study — what we should steal

Studied: Robinhood, Wealthsimple, Public, Fidelity, Schwab, Cash App Investing, Webull, eToro, TradingView, Revolut, Stripe (for SaaS web), Linear (for design system reference).

The goal isn't to copy these. It's to identify the specific design patterns that make them feel *real* — like products from a billion-dollar company — and apply them to Mizan.

---

## Why our current UI feels "AI-generated"

When users say something "feels AI," they usually mean one or more of:

1. **Pages don't share a rhythm.** Spacing varies. Section sizes vary. Vertical gaps between elements feel arbitrary. → Solution: an 8pt spacing grid applied strictly.
2. **Generic Tailwind defaults.** Buttons look like default `bg-blue-500` buttons. Cards have default `rounded-lg`. → Solution: a custom component library with intentional choices.
3. **Decoration without purpose.** Borders + shadows + rounded corners + tinted backgrounds, all at once. → Solution: pick ONE visual treatment per element type and use it consistently.
4. **Color used inconsistently.** Navy here, gray there, gold somewhere else, without semantic meaning. → Solution: define exactly what each color means and never break it.
5. **Same font weight everywhere.** Bold for everything, or nothing distinguishable. → Solution: clear weight hierarchy — light/regular for body, semibold for emphasis, bold reserved for headlines.
6. **Cards in cards in cards.** Container nesting without breathing room. → Solution: flatten layouts. Use whitespace, not borders, to separate content.
7. **Stock/finance feel missing.** No "as of" timestamps. No tickers in monospace. No price-feel typography. → Solution: small financial UI signifiers — monospaced numbers, "data as of" labels, ticker chips.
8. **No micro-detail.** No hover states with intent. No focus indicators. No empty state illustrations. No loading-state warmth. → Solution: small touches that signal someone cared.

---

## Specific patterns to steal from each

### Robinhood — minimalist consumer mobile-first

**What they do well:**
- **Big bold numbers, sparingly applied.** The price of a stock is presented in massive type. Nothing else competes for visual weight.
- **5-item bottom tab nav on mobile.** Only the absolute essentials.
- **Charts/visualizations are hero.** Stock pages lead with the chart; everything else is below.
- **Action buttons feel like commitments.** Big, full-width, in their distinctive green. Almost never a small "Submit" button hidden in a form.
- **Subtle motion.** Numbers tick up. Sparkles when you buy your first stock. Color shifts subtly when prices move.
- **Empty states have personality.** A line of friendly copy with a single CTA, not just blank space.

**Apply to Mizan:**
- The verdict word ("Halal" / "Not halal") should be the biggest type on the screen — bigger than the stock name.
- Bottom mobile nav for the 4 primary actions.
- Empty `/screen` page should feel inviting, not blank.

### Wealthsimple — editorial polish

**What they do well:**
- **Serif typography as a brand voice.** Headlines in a beautiful serif (think Tiempos or similar). Body in clean sans. This combo signals "thoughtful, established."
- **Negative space as design.** Pages feel breathing-room-rich, almost magazine-like. Content has room to be considered.
- **Color is restrained.** Mostly white, gray, black, with one brand color used only for primary actions and key data points.
- **No drop shadows.** Borders are hairlines. Depth comes from spacing, not effects.
- **Content-first.** When you land on a Wealthsimple page about an investment topic, you get the explanation, not a wall of CTAs. They trust the writing.

**Apply to Mizan:**
- We already use Georgia for headlines — strengthen it: use it consistently, larger, more confidently. Stop fighting it with sans-serif "more professional" headers.
- Strip ALL drop shadows. Replace with hairline borders + whitespace.
- Increase page padding/margins. Let things breathe.

### Public — clean social-finance

**What they do well:**
- **Real company logos.** Every stock has its actual brand logo next to its ticker. Immediately makes the app feel "real."
- **Cards with intentional textures.** Subtle background tints that signal asset class (stocks one color, ETFs another) without being heavy.
- **"Why?" expansions inline.** Click any data point, get a short explanation.
- **Followable themes/lists.** "Halal investing" as a curated list of stocks would resonate.

**Apply to Mizan:**
- Add company logos to every ticker. They exist as PNGs from common APIs (we can fetch from clearbit or similar). Massive feel upgrade.
- "Why?" inline expansions on each ratio (we have tooltips — make them more accessible/visible).

### Cash App Investing — radical simplicity

**What they do well:**
- **One CTA per screen.** No tab bar fighting with a primary button.
- **Cards have ONE focal point.** A number, a stock name, an action. Not all three competing.
- **Bottom-aligned actions on mobile.** Thumb-friendly.

**Apply to Mizan:**
- Each compliance card has too many competing focal points. Strip to: VERDICT WORD, stock identity below, reason text below that, math hidden behind a click.

### TradingView / Webull — power-user respect

**What they do well:**
- **Density done right.** Information-dense without feeling cluttered — strict grid, monospaced numbers, clear column alignment.
- **Color codes intentional.** Green/red used ONLY for direction (price up/down, verdict pass/fail).
- **Customization without overwhelm.** Power users can configure deeply; new users see sensible defaults.

**Apply to Mizan:**
- The /universe page is the closest thing we have to a power-user view. Tighten its grid, use monospaced numbers in the ratio columns.

### Stripe / Linear — SaaS web aesthetic

**What they do well:**
- **Single brand color used sparingly.** Stripe purple, Linear's accent. Only used for primary CTAs and key data.
- **Typography is the design.** Almost no decoration. Hairlines, whitespace, type — that's it.
- **Marketing pages with strong narrative voice.** Each page makes one argument.
- **Inline code/data styled with care.** Monospaced, tinted, treated as first-class content.

**Apply to Mizan:**
- We already lean editorial. Lean harder. Strip more.
- Use monospaced numbers anywhere we show ratios, ticker symbols, market caps.
- One color, used with restraint: our gold accent.

---

## The visual rules Mizan should adopt — explicit

After all that, here are the rules a designer would write down:

**Color**
- One brand accent (gold #B8860B) — used only for: primary CTA buttons, key data points, and the "Mizan" wordmark
- One scholarly tradition accent (navy #1F3A5F) — used for: secondary text emphasis, link color, logo background
- Pass/fail semantics (emerald #047857, rose #BE123C) — used only for verdict-related semantics, never decoratively
- Grayscale ramp for everything else (slate-50 through slate-900). No other colors.

**Typography**
- Serif (Georgia) for: page titles, big numbers, scholar names. Always weight 700.
- Sans-serif (system-ui) for: body text, labels, controls. Weight 400 default, 600 emphasized.
- Mono (system mono) for: ticker symbols, ratio values, market cap.
- Sizes follow a clear scale: 11/12/14/16/20/28/40/64 pt. Never use any other.

**Layout**
- Page wrapper: max-width 6xl (1152px) for content pages; 3xl (768px) for editorial reading.
- Vertical rhythm: section margins of 16/24/40/64 pt only.
- Container padding: always 24 horizontal, varied vertical based on content.
- No drop shadows. Use 1px hairline borders (color: gray-200) for separation.
- Rounded corners: 6px for buttons/inputs, 12px for major content containers, 0 for full-bleed sections.

**Components**
- Buttons: 3 types only — primary (filled gold/navy), secondary (border gray), link (underline navy).
- Inputs: single style — gray-50 background, focus to white with navy border.
- Cards: one style — white background, gray-200 hairline border, 12px radius. Never nested.
- Pills/badges: one style — small rounded rectangle, semantic color background.

**Interactions**
- Hover: slight color shift OR subtle border darken. Never both.
- Focus: navy ring (Tailwind `ring-2 ring-navy-300`). Always visible.
- Transitions: 150ms ease-out for most things.
- Loading: skeleton screens or single spinner — never both on one page.

**Data presentation**
- Ticker symbols: monospaced, uppercase, navy color.
- Stock names: serif, regular weight.
- Verdicts (Halal/Doubtful/Not halal): serif, bold, large (40-64pt).
- Numbers (ratios, prices, percentages): monospaced or tabular, body size unless they're "hero" numbers.
- Timestamps: small caps, tracked out, gray.

**Mobile**
- Bottom tab nav with 4-5 items.
- Tap targets minimum 44×44 pt.
- Modals slide up from bottom.
- Lists are clean, no card-on-card.

If we apply these strictly, "AI feel" disappears.

