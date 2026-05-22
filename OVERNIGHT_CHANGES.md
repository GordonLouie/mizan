# Overnight changes — read this first when you're back

Date: 22 May 2026 (overnight session)

## What's new

### 1. Design system foundation
- `src/lib/design.ts` — single source of truth for colors, typography, spacing, radii
- `src/components/ui/` — reusable primitives: `Button`, `Card`, `Pill`, `Section`, `PageHeader`, `SectionHeader`
- Pages now import these instead of duplicating styles. Means future visual consistency is enforced by the system.

### 2. Portfolio v3 — real position tracking
The biggest functional upgrade. Replaces the old "ticker + weight %" model with proper investing semantics:
- **Position model**: ticker, shares, average cost, purchase date.
- **Real metrics**: total value, cost basis, gain/loss (absolute + %), halal value share.
- **Performance chart** now has a time-period selector: 1M · 3M · 6M · 1Y · 2Y · ALL.
- **Holdings table** is sortable by value, ticker, or gain %, with proper gain indicators (green up arrow, red down arrow), monospaced numbers, and tabular figures.
- **Editor** lets you add positions with shares, avg cost, and purchase date — all in one row, clean inputs, no spinner arrows.
- Mock prices for ~120 well-known tickers in `src/lib/prices.ts`. Replace with FMP API when ready.

### 3. Halal alternatives feature (unique to Mizan)
- When a stock fails screening, Mizan now suggests 3 similar passing stocks in the same sector.
- Example: AMZN fails under Mufti Taqi → see WMT, COST, NKE as alternatives.
- No competitor (Zoya, Musaffa, Wahed, Islamicly) does this. It's a genuine differentiator.

### 4. Watchlist
- New `/watchlist` page in the Tools dropdown.
- "Save" / "Saved" toggle button appears on every stock detail page.
- Persists in localStorage; reflects current scholar's verdict for each saved stock.
- Empty state with friendly CTA.

### 5. Updated navigation
- Header now includes Watchlist in the Tools dropdown.

## What's still on the roadmap

Things that didn't make this session, ranked by impact:

1. **Per-page design system refactor.** I built the primitives; only Screen, Portfolio, and Watchlist pages use them yet. Universe, Zakat, Ask, Custom, Learn, Methodology — these still have their own ad-hoc styling. Consistent application = better feel. ~2-3 hours.

2. **Transaction log on Portfolio.** Currently positions are static records (one row per holding with avg cost). True transaction tracking (BUY/SELL events that update average cost automatically) is a separate model. ~1-2 hours.

3. **Live data via FMP.** Mock prices are in `src/lib/prices.ts`. Swap to real once you have the API key. ~30 min once key is in `.env.local`.

4. **Watchlist + alert.** Save a stock, get notified when its verdict changes (requires backend + email). Year-2 feature.

5. **Mobile bottom nav.** Standard for fintech apps. Replaces the hamburger menu on mobile. ~30 min.

## How to deploy

Run these in Terminal when you're back:

```
cd ~/mizan
git add .
git commit -m "Design system + Portfolio v3 + Halal alternatives + Watchlist"
git push
```

Vercel auto-deploys. Within ~90 seconds your live URL has all the new features.

## Where to look

After deploying, open these on your live URL:

1. **`/portfolio`** — completely redesigned. Open with the sample portfolio to see the gain/loss tracking, sector breakdown, time-period chart.
2. **`/watchlist`** — empty by default. Visit `/screen?ticker=AAPL`, click "Save", then come back to see it populated.
3. **`/screen?ticker=AMZN`** — see the new "Halal alternatives" section appear when a stock fails. Toggle scholar to AAOIFI (AMZN passes — no alternatives) then to Mufti Taqi (AMZN fails — three alternatives appear).
4. **`/screen?ticker=JPM`** — same alternatives section appears for sector-fail stocks (JPM fails on conventional finance; alternatives show passing financial-sector adjacent stocks).

## Engine tests

39/39 still passing. TypeScript still compiles clean. Mobile responsive (basic test). No new dependencies installed — kept the bundle lean.
