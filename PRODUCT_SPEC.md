# Mizan — Product Spec: Quarterly Tracking & Earnings Calendar

**Status:** Spec — not yet implemented
**Author:** Gordon (with Claude)
**Source feedback:** Ibrahim Malik (CUHK MSA), Saifuddin Abbas (via Miqdad), HKUSTSU brother
**Drafted:** 2026-06-05 (Day 8)
**Target ship window:** 4 weeks (Phases 1–3)
**Cyberport pitch deck:** This spec IS the "use of funds" narrative

---

## 1. Vision

Halal compliance is a **moving target**. A stock that's halal today can flip next quarter when its balance sheet shifts — debt creeps up, illiquid assets fall below Mufti Taqi's 20% floor, non-permissible income breaches the 5% cap.

Existing apps (Zoya, Wahed, Musaffa) treat halal verdicts as **snapshots**. Mizan should treat them as **time series**.

**North Star:** *"At any moment, a Muslim investor can see (a) is my stock still halal, (b) when does it report next, (c) how close to the threshold am I, (d) where do these numbers come from."*

If we ship this well, Mizan becomes the **only halal screener that tracks compliance over time** — a defensible moat nobody else has.

---

## 2. Jobs-to-be-done (from actual user feedback)

| Job | Verbatim source |
|---|---|
| "I want to know when my stock reports next" | Saifuddin, Ibrahim (implied) |
| "I want to know if my stock just flipped halal/non-halal" | Saifuddin: *"track that over time as well bc balance sheet may look v diff YoY"* |
| "I want to see how close each ratio is to its threshold" | Implied from "show the math" requests |
| "I want to see the trend, not just today's snapshot" | Saifuddin (above) |
| "I want to be alerted when something changes" | Implied — they check manually |
| "I want to verify each number against its source" | Ibrahim: *"reference where the numbers are coming from, cross check if needed"* |

---

## 3. Feature inventory — 6 interconnected pieces

### A. Quarterly Tracking Engine *(data layer)*
- Per ticker: time series of fundamentals — `{quarter, debt_pct, cash_pct, receivables_pct, illiquid_pct, non_perm_income_pct, sector}`
- Verdict re-computed for each scholar at each quarter, stored
- 8 quarters minimum history

### B. Earnings Calendar *(data layer + UI)*
- Per ticker: `next_earnings_date`, `last_earnings_date`, `confirmed/estimated` flag
- Surfaces in verdict views + portfolio + watchlist + dedicated calendar page

### C. Verdict-Over-Time Chart *(UI component)*
- Mini band chart on each verdict page
- Last 8 quarters under active scholar
- Hover shows that quarter's numbers
- Emerald / amber / rose zones (existing palette)

### D. Buffer Indicators *(UI on RatioBar)*
- Each ratio: *"28.4% / 30% allowed — 5% buffer to threshold"*
- Visual: bar with current value, threshold marker, "danger zone" shading
- At-glance: how close to failing

### E. Per-Ratio Source Citations *(extends TICKET-002)*
- Each `RatioBar` gets small *"per AAOIFI 21 §X.Y"* tag
- Click expands to full citation with link to primary document
- TICKET-002 already shipped scholar-level citations; this extends to ratio-level

### F. Alerts / Notifications *(requires auth, Phase 4)*
- Email: *"Your AAPL holding had earnings yesterday — new verdict: still PASS, but illiquid floor now 22% (was 25%)"*
- *"Your META just flipped from PASS to BORDERLINE under AAOIFI — debt now 31% (was 28%)"*

---

## 4. UI/UX — page by page

### `/screen?ticker=AAPL` — enhanced verdict view

```
[Hero verdict block — existing]

NEW: ┌──────────────────────────────────────────────────────┐
     │  Next earnings: Aug 1, 2026 (28 days away)           │
     │  Last earnings: May 2, 2026 (verdict reconfirmed)    │
     └──────────────────────────────────────────────────────┘

NEW: [VERDICT OVER 8 QUARTERS]   under AAOIFI
     ████ ████ ████ ▓▓▓▓ ████ ████ ████ ████
     Q3'24 Q4'24 Q1'25 Q2'25 Q3'25 Q4'25 Q1'26 Q2'26
                       ↑ borderline once (debt spike)

[ENHANCED RATIO BARS — each now shows:]
  Debt / mkt cap     [████████░░░░░] 18.4%  threshold 30%   buffer 11.6pp ✓
                      per AAOIFI Standard No. 21, §3.4.2

  Cash / mkt cap     [██████░░░░░░░] 12.8%  threshold 30%   buffer 17.2pp ✓
                      per AAOIFI Standard No. 21, §3.5.1

  Non-perm income    [██░░░░░░░░░░░] 1.2%   threshold 5%    buffer 3.8pp ✓
                      per AAOIFI Standard No. 21, §3.6
```

### `/portfolio` — enhanced
- "4 of 5 holdings PASS, weighted compliance 87% of value"
- AT-RISK panel: holdings with earnings ≤30 days + close buffers
- Compliance-over-time stacked band chart

### `/watchlist` — same earnings indicators

### NEW `/calendar`
At-a-glance upcoming earnings across user's watchlist + portfolio.
Vertical agenda. Click any → `/screen?ticker=X`.

### NEW `/track/[ticker]`
Deep history page:
- 8-quarter verdict timeline across all 5 scholars (matrix)
- Quarterly fundamentals table
- Changes highlighted

### Mobile UX
- Verdict page: swipe stack (hero → ratios → trend → multi-scholar)
- Bottom tab bar (`MobileTabBar` exists): Home / Screen / Watchlist / Portfolio
- Earnings calendar on mobile: vertical agenda list

---

## 5. Tech / data architecture

### New types

```typescript
interface QuarterlyFundamentals {
  ticker: string;
  quarter: string;
  reportedDate: string;
  debtToMarketCapPct: number;
  cashSecuritiesToMarketCapPct: number;
  receivablesToMarketCapPct: number | null;
  illiquidAssetsToTotalAssetsPct: number;
  impermissibleIncomePct: number;
  sector: string;
  marketCapUsd: number;
}

interface EarningsDate {
  ticker: string;
  date: string;
  confirmed: boolean;
  type: "quarterly" | "annual";
}
```

### Data sources
- FMP `/historical-balance-sheet-statement` (paid tier required)
- FMP `/earning-calendar` (paid tier required)
- FMP `/income-statement` quarterly (for income breakdown)
- Refresh: weekly cron, prioritize tickers in user watchlists

### Storage
- Phase 1: `src/data/historical_fundamentals.json` per ticker (file-based)
- Phase 2: real database when auth lands

### New components
- `<VerdictTimeline />` — 8-quarter band chart (Recharts)
- `<EarningsBadge />` — "Next earnings in N days" pill
- `<BufferIndicator />` — within `RatioBar`
- `<SourceTag />` — small clickable citation chip
- `<EarningsCalendar />` — `/calendar` page main

---

## 6. Phased roadmap

### Phase 1 — Foundation (Week 1, ~10 hrs)
- [ ] FMP tier upgrade decision (see Pricing section below)
- [ ] Extend `fmpFetch.ts` for historical + calendar endpoints
- [ ] Add `historical_fundamentals.json` to `src/data/`
- [ ] Re-run `enrichStocks.ts` for full history on existing 163 tickers
- [ ] New types in `src/lib/types.ts`

### Phase 2 — Read-only UI (Week 2, ~10 hrs)
- [ ] `<EarningsBadge />`
- [ ] `<VerdictTimeline />` with Recharts
- [ ] `<SourceTag />` per-ratio on `RatioBar`
- [ ] `<BufferIndicator />` distance-to-threshold
- [ ] Integrate into `/screen` verdict view
- [ ] Mobile responsive for new components

### Phase 3 — Portfolio + calendar (Week 3, ~8 hrs)
- [ ] At-risk panel on `/portfolio`
- [ ] Compliance-over-time chart
- [ ] `/calendar` page
- [ ] `/track/[ticker]` deep-history page

### Phase 4 — Alerts (Week 4+, auth required, defer)
- [ ] Auth (NextAuth + Supabase)
- [ ] User accounts, cross-device sync
- [ ] Email via Resend
- [ ] Notification preferences

---

## 7. Success metrics

| Metric | Day-30 target |
|---|---|
| % `/screen` views with earnings badge surfaced | 100% |
| % return visits to same ticker | >20% |
| Avg time on `/screen` | >90 sec |
| Watchlist median size | >5 tickers |
| Unprompted shares from feature launch post | ≥3 |

---

## 8. Risks & mitigations

| Risk | Mitigation |
|---|---|
| FMP historical data expensive | Start with S&P 100, expand by usage signal |
| Calendar accuracy varies | Show "confirmed/estimated" flag prominently |
| Alert fatigue | Frequency cap + granular opt-in |
| Auth adds friction | Defer Phase 4; let Phase 1-3 work via localStorage |
| Charts feel busy | Restraint — band chart with hover, not multi-line |

---

## 9. Monetization position (current)

**100% FREE during the entire roadmap above.** No paywalls on any feature in Phases 1–3.

Rationale documented in `OUTREACH.md` and in conversation with potential users:
- Methodology stays free forever (it IS the brand)
- Watchlist + portfolio free (drives habit)
- Verdict-over-time + earnings calendar free (the moat)
- Premium tier *(future, post-100-DAU)* may add: email alerts, push notifications, multi-portfolio, API access for advisors, longer history

Reason to NOT charge yet:
1. Day 8 of project. 0 paying users either way.
2. Friction kills early-stage adoption
3. Cyberport CIP is the funding bridge (~$500k if accepted), not subscriptions
4. Network effects in halal-finance = recommendation > revenue
5. Brand position "we don't claim authority" needs free distribution
6. Competition (Zoya, Wahed, Musaffa) all have free tiers — being entirely free with better methodology is distinctive

When to introduce Premium:
- ≥100 daily active users sustained for 2+ weeks
- ≥10 unprompted shares logged
- Clear willingness-to-pay signal (3+ users asking "do you have a paid tier with X")

---
