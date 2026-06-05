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

### F. Annotated Balance Sheet *(NEW — expanded from "breakdown panel")*

**Design intent:** read like a financial textbook that grades itself. Show the WHOLE balance sheet in its natural sections (Assets → Liabilities → Income statement excerpt). Mark line items used in each halal check with circled numerals (①②③④). After each balance sheet section, show the halal calculation that uses those line items — inline, with full math.

#### Document structure (top to bottom)

1. **Hero verdict** (existing — unchanged)
2. **Quick-reference source line** (TICKET-002 — unchanged)
3. **Annotated Balance Sheet** (NEW, replaces "Show the math" collapsible):
   - Title block: company name, quarter, filing source, currency
   - `ASSETS` section — current + non-current, with line items
   - `CHECK #1 — Cash + Securities Ratio` inset box (uses ① items)
   - `CHECK #2 — Illiquid / Total Assets` inset box (uses ② items)
   - `LIABILITIES` section
   - `CHECK #3 — Interest-bearing Debt` inset box (uses ③ items)
   - `INCOME STATEMENT EXCERPT` (revenue + interest income)
   - `CHECK #4 — Non-permissible Income` inset box (uses ④ items)
   - `FINAL VERDICT` summary (all 4 checks under active scholar)
   - `ALSO TESTED UNDER` (other 5 scholars, brief)
4. **Multi-scholar comparison table** (existing — unchanged)
5. **Stock stats snapshot** (existing — moved below)

#### Calculation inset box format (every one of the 4 checks)

```
── CHECK #N ──   <Ratio name>
                 under <active scholar>

Line items used  (marked ① above)
   <item 1>             $X
   <item 2>             $Y
                       ─────
   Total                $Z

Calculation
   <numerator>       $Z
   ──────────  =  ──────  =  N.N%
   <denominator>     $D

Threshold       <≤ or ≥ X%>   (<scholar source ref>)
Verdict         <PASS / BORDERLINE / FAIL>
Buffer/short    <N.Npp under/over the threshold>

Data source     SEC Form 10-Q · Note N ↗
Threshold src   <Specific scholar document + clause> ↗
```

#### Visual / typography design

| Element | Treatment |
|---|---|
| Section headers | Georgia serif, ALL-CAPS, letter-spaced |
| Line item labels | Georgia serif regular |
| All numbers | Liberation Mono / monospace, right-aligned columns |
| Calculations | Monospace with generous spacing — textbook proof feel |
| Marked line items (①②③④) | Gold underline + small gold circled numeral |
| Calculation inset boxes | Slightly different background, light border, like textbook example callouts |
| Sources `↗` icon | Gold, clickable to open primary doc |
| Page width | Max ~720px desktop for readability |
| Whitespace between sections | ≥32px |
| Background | Cream `#F4ECD8` (brand) |

#### Interaction
- **Hover marked line item**: brief gold highlight on that item AND its calculation block (visual cross-reference)
- **Click `↗`**: opens SEC filing OR AAOIFI/Mufti Taqi document in new tab
- **Top of page link**: "Hide breakdown · just show the verdict" (for users in a hurry — collapses to just hero + multi-scholar table)
- **Bottom of page**: "Open full SEC filing ↗" deep link to EDGAR

#### Mobile UX
- Same single-column layout (already vertical)
- Calculation boxes get full width
- Number columns still right-align where possible
- Below 480px: math division-line stack converts to vertical key-value:
  ```
  Cash + Securities = $163,218
  Market cap        = $537,420
  Ratio             = 30.4%
  ```

#### What this REPLACES on `/screen`
- The current `RatioBar` grid + "Show the math" collapsible → replaced by full Annotated Balance Sheet
- `ComplianceCard` keeps hero + meta row + source line (TICKET-002), drops the `<RatioBar>` grid

#### What this addresses
Direct response to:
- **Ibrahim Malik:** *"reference where the numbers are coming from, cross check if needed"* + *"proper breakdown on math is really important"*
- **Saifuddin Abbas:** implied — wants to see the underlying balance sheet to verify
- **HKUSTSU brother:** scholarly-rigor concern — showing the WHOLE balance sheet with cited line items makes the methodology defensible

#### Data requirements
ALL needed line items are available on FMP's FREE tier today:
- `/balance-sheet-statement` — assets, liabilities (all line items shown)
- `/income-statement` — revenue + interest income
- `/sec-filings` — links to underlying 10-Q

**No FMP upgrade required to ship this for the current 163-ticker prototype.**

### G. Alerts / Notifications *(requires auth, Phase 4)*
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
- `<BalanceSheetBreakdown />` — collapsible panel showing all line items, math, buffer/shortfall, dual-sourced (data + threshold)

---

## 6. Phased roadmap

### Phase 1 — Foundation (Week 1, ~10 hrs)
- [ ] FMP tier upgrade decision (see Pricing section below)
- [ ] Extend `fmpFetch.ts` for historical + calendar endpoints
- [ ] Add `historical_fundamentals.json` to `src/data/`
- [ ] Re-run `enrichStocks.ts` for full history on existing 163 tickers
- [ ] New types in `src/lib/types.ts`

### Phase 2 — Read-only UI (Week 2, ~12 hrs)
- [ ] `<EarningsBadge />`
- [ ] `<VerdictTimeline />` with Recharts
- [ ] `<SourceTag />` per-ratio on `RatioBar`
- [ ] `<BufferIndicator />` distance-to-threshold
- [ ] **`<BalanceSheetBreakdown />` — full line-item panel with dual sources**
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
