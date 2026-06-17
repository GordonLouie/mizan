# Mizan — Game Plan v2 (post UX review)

Supersedes MIZAN_BUILD_MASTERPLAN.md as the working plan. Written after a full
top-to-bottom review where the gaps below were flagged. Honest accounting of
what's solid, what's sloppy, what's missing, and how we move forward.

**Last updated:** 2026-06-16
**One line:** the plumbing works (live in Stripe test mode); the *product depth
and the polish* are where the next phase of work is. The strategic core — halal
**index comparison + construction**, and the **trust/verification** story — is
under-built relative to what Chong actually asked for.

**Progress log (v2):**
- ✅ A (partial) — index **risk/reward metrics** (return p.a., vol, Sharpe, max
  drawdown, beta) on each index page; **comparison table** on /indexes (all halal
  indexes vs S&P, gated). Custom index *builder* still to do.
- ✅ C — AI compliance **report redesigned** (verdict banner, exec-summary callout,
  status-dot ratios, iconed sections, bottom-line callout).
- ✅ D (partial) — **trust/screening depth**: "beyond the balance sheet" section on
  /methodology; fixed stale "prototype sample" copy. Per-stock provenance still to do.
- ✅ I — **halal swaps with deterministic reasoning**, now shown on pass too.
- ✅ H — **/institutions** page (index licensing, data API, white-label, audit screening).
- ✅ Integration/QA — /indexes linked in nav+footer; footer cleaned; a11y polish.
- ✅ B — **charts/technicals overhaul** (TradingView `lightweight-charts`: crosshair,
  Area/Line, MA/EMA/Bollinger overlays, RSI+MACD sub-panels, selectable benchmark,
  clean toolbar; forced en-US axis). Candlesticks pending OHLC ingestion.
- ✅ A (complete) — **custom index builder** (/indexes/build): pick standard + theme
  + size → live point-in-time backtest + risk/reward vs S&P. Gated Pro; institutional
  licensing pitched.
- ✅ Header now reflects signed-in state (Account vs Sign up).
- ⏳ Remaining: **E auth → Clerk** (keys added; needs the code migration — next),
  **J rename → HalalScan** (domain checkout failing — reminder set 2026-06-18),
  **G coverage** (your FMP run), per-stock data provenance, candlestick OHLC data.

---

## 1. Where we are (snapshot)
Live end-to-end in test mode: real prices, screening engine, AI layer, paywall,
auth, Stripe, institutional API — all provisioned and verified. See
MIZAN_BUILD_MASTERPLAN.md for the build history. This doc is about what's NEXT.

---

## 2. Honest assessment — solid vs sloppy vs not-established

### Solid (keep)
- **Real data** (verified accurate). The integrity discipline is our brand.
- Deterministic screening engine + multi-scholar verdicts with cited thresholds.
- Index backtest is now point-in-time (survivorship bias removed).
- AI grounding architecture (numbers deterministic, AI writes prose only).
- Billing/auth/entitlement plumbing.

### Sloppy / weak (flagged in review — needs rework)
- **Charts & technicals** — the compare-to-S&P / technicals buttons look sloppy;
  the chart itself is basic; only RSI + MA; benchmark hard-coded to S&P.
- **AI compliance report** — information is there but it's a tiring wall of text;
  dull colour, poor layout, hard to read; not the institutional artifact it should be.
- **Navigation / Tools menu** — features crammed into one cluttered dropdown
  "bubble"; sign-in/sign-up is obscure; "Try a stock" CTA where sign-up should be.
- **Auth UX** — magic-link-only is friction; no password, no Google/social login.
- **Universe page** — US-only; doesn't convey (future) international coverage.

### Discussed but poorly built / not established yet
- **Index ROI *comparison* product** — Chong's actual ask. We have per-stock ROI
  vs S&P and single-index backtests, but NOT: halal-vs-conventional index
  comparison, halal-vs-halal by risk/reward, or custom index construction. This is
  the strategic core and it's the least built.
- **Risk/reward metrics** — backtests show total return only; no volatility,
  Sharpe, max drawdown, or beta. Chong specifically framed it as risk-reward.
- **Trust / verification depth** — Chong (and institutions) need to *trust* the
  halal verdict. We show ratios + sources, but haven't addressed his "what about
  things outside the balance sheet" question (subsidiary/associate income, the
  company's own investments, etc.).
- **Institutional offering** — vague. It's just a "contact us" column; no clear,
  compelling thing to upcharge for.
- **Halal swaps** — only appear on fail, with no reasoning for *why* a given swap.
- **Naming** — "Mizan" doesn't instantly say "halal investing/screening."

---

## 3. Strategic reframe (read this first)

**Chong's thesis, corrected and sharpened:** Islamic finance is under-served in HK
and institutions may pay for halal-index solutions. The nuance: HK-linked Shariah
indices *do* exist (DJIM China/HK Titans ~30 names, S&P China HK Shariah, Hang Seng
Islamic China fund) — but they are **narrow, opaque, single-standard fund
products**, not transparent, customizable, multi-scholar *tools*. 

**So Mizan's wedge is not "first HK halal index."** It's: **the transparent,
multi-scholar, customizable halal-index and screening platform** — for retail to
explore and compare, and for institutions to license/construct bespoke indices and
trust the screening. Transparency + integrity + customization + accessibility is
the moat against S&P/DJIM at the index level.

**Two products, one engine:**
1. **Retail** — explore stocks + halal indexes, compare halal vs conventional and
   halal vs halal by risk/reward, screen your portfolio. ($9.99/mo)
2. **Institutional** — custom halal index construction + licensing, screening data
   API/feed, white-label compliance reports, audit-grade fund screening. (high-ticket)

---

## 4. Workstreams (synthesis of the review)

### A. Index comparison + construction + risk metrics  ⭐ P0 strategic
The core of Chong's ask and the institutional product.
- **Comparison view:** any halal index vs a conventional benchmark (S&P, Nasdaq,
  Hang Seng) AND vs other halal indexes, on one chart.
- **Risk/reward metrics** on every index/backtest: annualized return, volatility,
  Sharpe, max drawdown, beta vs benchmark — not just total return.
- **Custom index builder:** pick universe + scholar/screen + weighting + size +
  rebalance → get a backtested index. This *is* the institutional licensable product.
- Add a **Greater-China / HK halal index** once coverage expands; position against
  DJIM China/HK Titans (broader, transparent, multi-scholar).

### B. Charts & technicals overhaul (TradingView-grade)  P1
- Replace the hand-rolled SVG with **TradingView's `lightweight-charts`** (free,
  open-source) — candles/line, zoom/pan, crosshair, clean timeframe selector.
- **Indicator picker** like TradingView: SMA, EMA, RSI, MACD, Bollinger Bands,
  Stochastic, ATR, volume — selectable + configurable, not just RSI/MA.
- **Selectable benchmark** for compare (S&P, Nasdaq, Hang Seng, any halal index,
  any ticker) — not hard-coded to S&P.
- Redesign the compare/technical controls (the "sloppy buttons") into a clean
  toolbar. Reference: TradingView, Koyfin.

### C. AI compliance report redesign  P1
- Keep the depth, fix the form. Make it **skimmable**: verdict hero at top,
  pass/fail **ratio cards/gauges** with colour, collapsible detail sections,
  generous whitespace, real typography hierarchy, section icons.
- Lead with a 2-line executive verdict; details on demand. Print/PDF-clean.
- Reference: institutional research notes (clean/typographic) but more visual.

### D. Trust & screening depth (the credibility play)  ⭐ P0
This is what wins institutions and answers Chong directly.
- **Provenance:** show the data source + the exact line items behind each ratio;
  flag estimated/low-confidence values; date-stamp the data.
- **Beyond the balance sheet:** make explicit that the impermissible-income screen
  captures incidental haram income (interest, non-compliant rental/associate
  income). Where data allows, surface **investment/associate income** and
  **subsidiary** exposure; where it doesn't, *disclose the limitation honestly*.
- **"What we screen vs what we don't"** honesty section + an optional
  scholar/manual-review flag for top names. Trust-as-a-feature.

### E. Auth & onboarding — easy, multiple methods  P1
- Replace magic-link-only with **email+password, Google (and Apple) sign-in, plus
  magic link** as an option.
- This justifies adopting a managed auth provider rather than hand-rolling OAuth.
  **Decision needed (see §6):** Clerk (fastest, social logins, prebuilt UI, secure)
  vs Auth.js/NextAuth (free, flexible) vs Supabase (auth + DB for cross-device
  saved portfolios). Leaning **Clerk** for speed + UX, or **Supabase** if we want a
  real DB next.
- Make **Sign up / Sign in prominent** (top-right), and surface upgrade paths.

### F. Navigation / IA / UX overhaul  P1
- The Tools mega-menu is overwhelming. Simplify top-level nav; group by intent;
  give Screen, Indexes, Pricing clear spots; **prominent Sign up** button
  (replace/complement "Try a stock").
- Tighten the cluttered list UI into scannable sections or dedicated landing pages.
- Reference: Stripe, Linear, Zoya (clean fintech IA).

### G. Coverage expansion — HK + international  P1 (strategic for HK)
- Run `MIZAN_UNIVERSE=us` first, then add **HK + Greater China**, London, and
  major international markets → "screens everything" positioning.
- Rework `/universe` to emphasize **international coverage** (filter by market /
  country / exchange). Feeds the HK halal index product.

### H. Institutional offering + monetization  P1 strategic
Make it concrete and obviously worth paying for:
1. **Custom halal index construction + licensing** (build/maintain a bespoke index
   for a fund/MPF provider) — recurring license. *The Chong play.*
2. **Screening data API / feed** (per-seat or usage).
3. **White-label compliance reports** (branded for their clients).
4. **Audit-grade fund/portfolio screening** (periodic compliance certification).
5. Custom coverage + SLA + support.
- Add a dedicated **"For institutions"** page; make the value explicit (today it's
  just "contact us").

### I. Halal swaps + reasoning  P2
- Show swaps **even when the verdict is halal** (e.g., better-diversified, more
  liquid, lower purification, larger cap) — with **reasoning**.
- Always explain *why* a swap (same sector + passes + specific advantage); for
  fails, why it fails AND why the alternative is better.

### J. Naming / rebrand  P1 decision
- "Mizan" (balance/scale) is meaningful but not instantly legible.
- Options: (a) **Keep Mizan + always-on descriptor lockup + tagline**
  ("Mizan — Halal Investing & Screening" / "Know it's halal, and why"); cheapest,
  preserves SEO/domain equity. (b) **Rename** to something self-describing (the
  "halal" space is crowded: Zoya, Musaffa, Wahed, Islamicly, HalalScreener).
- Recommendation: don't rename hastily — start with the descriptor lockup +
  tagline and test; only rename if legibility testing demands it. (Decision in §6.)

---

## 5. Suggested sequencing (solo, part-time)
1. **Credibility + strategic core first:** D (trust/screening depth) + A (index
   comparison + risk metrics). These are Chong's real asks and the institutional wedge.
2. **Kill the "sloppy" feeling:** C (AI report redesign) → B (charts/technicals) →
   F (nav + sign-up) → E (auth methods). These drive perceived quality.
3. **Coverage + institutional clarity:** G (HK/international) + H (institutional page
   & licensing) — needed for the HK pitch.
4. **Polish:** I (swaps reasoning), J (naming lockup).
- Business in parallel (yours): register HK company + bank (Stripe live), send the
  Chong introductions.

---

## 6. Open decisions for you
- **Auth provider** for multi-method login (Clerk vs Auth.js vs Supabase)?
- **Naming**: descriptor lockup + keep Mizan, or commit to a rename?
- **Institutional priority**: lead with index licensing, the data API, or
  white-label reports? (Shapes what we build first in H.)
- **Charts**: OK to add the `lightweight-charts` dependency (small, free) for a
  TradingView-grade chart?

---

## 7. Carried-over status (unchanged truths)
- Live in Stripe **test** mode; real money needs HK company + bank.
- Auth is currently hand-rolled (will be replaced per E) — security review moot if
  we migrate to a provider.
- Index backtest residual caveat (current-fundamentals screen, buy-and-hold) —
  disclosed; partially addressed by D.
- Live UI/UX stress test still pending (needs Chrome extension connected).
