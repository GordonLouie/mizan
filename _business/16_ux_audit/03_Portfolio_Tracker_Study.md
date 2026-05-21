# Portfolio tracker UI/UX study

Studied: Snowball Analytics, Blossom Social Investment, Yahoo Finance Portfolio, Sharesight, Stockanalysis.com, Public.com Portfolio, Robinhood Portfolio, Wealthsimple Portfolio, Personal Capital / Empower.

What makes a portfolio tracker feel premium vs hobbyist.

---

## The patterns that matter

### Hero number, single focus

Every premium portfolio app leads with **one big number**. Snowball: total portfolio value in a 60pt+ display. Yahoo: market value. Robinhood: portfolio value with the day change in green/red below.

Mizan equivalent: **weighted halal-compliance percentage** as the hero. Not "10 of 12 holdings pass" buried in a stat card. A massive serif "85%" with "of your portfolio is halal under AAOIFI" below it.

### Allocation visualization

Every serious tracker has an allocation chart, typically a donut. Some show:
- By holding (each ticker a slice)
- By sector (Tech, Healthcare, etc.)
- By geography (US, EU, EM)
- By asset class (stocks, bonds, cash, alternatives)

The donut is preferred over the pie because the hole in the middle holds a "Total" number — visual + textual at once.

Mizan equivalent: an allocation donut where each holding is a slice, colored by Halal/Doubtful/Not halal. The center of the donut shows the compliance %. Two views, toggle: "By holding" and "By verdict."

### Performance vs benchmark

The line chart is the signature feature. Snowball, Yahoo, Public, Robinhood all show it. Portfolio value over time, compared to a benchmark line (typically S&P 500 / SPY).

Style notes:
- Two lines, your portfolio in the brand color, the benchmark in muted gray
- Hover anywhere on the chart → tooltip with date + both values
- Time period selector at top: 1D, 1W, 1M, 3M, 1Y, ALL
- The portfolio line is bolder; the benchmark line is thinner
- A baseline of 0% or 100% (your starting value), so both lines are comparable

Mizan equivalent: portfolio vs SPY or QQQ benchmark, with **a third line**: "halal-only ETF SPUS" — uniquely-Mizan data point that no other tracker shows.

### Holdings table

Premium versions of this table have:
- Stock logo + ticker (Public, Robinhood)
- Position size + market value + day change with arrow
- Sortable columns, click any header
- Subtle row hover
- Click row → full position detail page

Mizan equivalent: same structure plus a verdict pill in the rightmost column. Click a row → drill into that ticker's full Mizan compliance card.

### Number inputs — what NOT to do

The default `<input type="number">` shows up/down spinner arrows. These are universally hated by designers because:
- They're an OS-default look that doesn't match any custom design system
- The arrows are tiny and hard to hit
- Mobile keyboards already provide number entry better
- They mess with currency formatting

The fix: hide them via CSS, use only the input box itself, and add currency formatting on blur. Optionally, larger increment/decrement buttons that match the design system (large, custom-styled) — but most premium apps just hide them.

### Currency formatting

Premium apps format currency live: type 10000, see $10,000.00 after a moment. Sharesight, Robinhood, Personal Capital all do this. Two patterns:
1. **Format on blur**: simpler. Type "10000", lose focus, displays "$10,000".
2. **Format on input with mask**: harder, more polished. As you type "10000" it becomes "$10,000".

Snowball uses format-on-blur. We'll do the same.

### Time period filters

Premium apps consistently use a horizontal pill row: `1D | 1W | 1M | 3M | YTD | 1Y | ALL`. Default to 1Y. Hover/click changes the chart and stats below.

### Empty states

Empty portfolios in premium apps are charming, not blank. Public.com shows a friendly illustration with a CTA. Robinhood shows a "Get started" graphic. Wealthsimple shows curated portfolio templates.

Mizan equivalent: empty portfolio → "Try a starter portfolio" with 3-5 templates (e.g., "Halal Tech Heavy," "Diversified Halal," "Halal Income").

### Color use for finance

Convention is strict:
- **Green = up / gain / passing** (use a single specific green, e.g., #16A34A)
- **Red = down / loss / failing** (one specific red, e.g., #DC2626)
- Never use these for anything else

We've been using emerald/rose. That's fine. Just keep the assignment strict.

### Numbers in monospace, prices and percentages

Premium apps render financial data in monospaced fonts (or proportionally-spaced figures via `font-variant-numeric: tabular-nums`). This keeps decimal points aligned in columns, makes the data feel structured.

Mizan equivalent: apply `tabular-nums` everywhere we show ratios, percentages, prices, market caps.

### Sector colors

When showing a sector breakdown, premium apps use distinct but coordinated colors per sector. Snowball uses a soft palette: tech blue, healthcare teal, finance gray, energy mustard, consumer staples salmon, etc.

Mizan equivalent: a 13-color palette (one per sector) tied to our brand — derived from our navy + gold, not random rainbow colors.

---

## Specific charts to build for Mizan

For the Portfolio page:

**1. Hero compliance ring.** A circular progress (donut with 1 segment) showing the weighted compliance percentage. The number sits inside. Underneath: "of your portfolio is halal under AAOIFI."

**2. Allocation donut by verdict.** Each holding is a slice. Color: green if halal, amber if doubtful, red if not halal. Hovering a slice highlights the holding in the table below.

**3. Sector breakdown horizontal bars.** Stacked or grouped horizontal bars showing your portfolio's exposure by sector. Most important: see your concentration.

**4. Performance line chart vs benchmark.** Portfolio value over time (mock data for now) compared to SPY and SPUS (halal S&P 500). Three lines, two-year window, hover tooltip with values.

**5. Holdings table.** Logo + ticker + name + weight + market value + day change + verdict pill. Sortable.

For the Zakat page:

**1. Asset composition donut.** Where your wealth is: cash, stocks, gold, crypto. Same visual language as portfolio donut.

**2. Nisab progress bar.** Horizontal bar showing how close to / above the threshold. With visible markers for silver vs gold nisab.

**3. Visual zakat flow.** Smaller version of the /learn diagram showing wealth → 2.5% → charity.

**4. Clean number inputs everywhere.** No spinners, comma-formatted, currency-prefixed for USD fields.

---

## The aesthetic glue — consistency rules

Across Portfolio, Zakat, Screen, Universe, every tool page:

- **Hero number on every page**, in 64-72pt serif, top-of-fold.
- **Single accent color usage** — gold for "this is the key answer," everything else navy/gray.
- **Tabular-nums everywhere** financial.
- **Subtle row separators (hairlines, not borders)** in tables.
- **Action buttons** — one style. Primary filled-gold or filled-navy, never a third option.
- **Spacing rhythm** — 8pt grid, vertical section gaps of 40/64 pt only.
- **Page padding** consistent: 24px horizontal everywhere.
- **Captions and labels** in small caps, tracked-out, gray.

If we apply these strictly, Portfolio + Zakat + Screen will feel like the same product instead of three different prototypes.

