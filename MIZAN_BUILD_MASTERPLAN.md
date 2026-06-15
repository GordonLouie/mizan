# Mizan — master build plan (post-Chong)

Everything from the Chong meeting, sequenced. This is the blueprint; we build in
order, phase by phase. Read top to bottom before we start Phase 0.

---

## 0. Locked decisions (the frame)
- **Mizan is a company** (Chong confirmed). Building for paying customers.
- **Dual model:** a **Free** tier + **Paid** tiers. Paid features appear in the
  UI **faded/blurred with an "Unlock" button** → upgrade flow.
- **Two paid tiers:** **Retail** (cheaper, individuals — SEA/India focus) and
  **Institutional** (expensive, funds/banks/MPF — HK focus).
- **Data integrity is non-negotiable.** No fabricated prices, returns, or
  performance — ever. Our audience (an econometrician's network + regulators)
  will scrutinise. Real data or clearly-labelled "sample," nothing in between.
- **SEO pages stay free + open** (they're the discovery engine — never gate them).
- **Free tier stays no-account**; accounts only required for paid features (keeps
  the "no signup to try" promise intact).

## 1. New subsystems this requires (the big architectural adds)
These don't exist yet and gate the paid model:
1. **Historical price data** — currently prices are *mock*. Everything
   return-related needs a real price feed + storage.
2. **Accounts / auth** — paid features need login. (Free tier stays anonymous.)
3. **Billing** — Stripe (subscriptions, the "Unlock" → checkout).
4. **Entitlements/gating** — a flag system (free / retail / institutional) + the
   faded-lock UI pattern.
*(1 needs your FMP key + a run; 2–3 need you to create Stripe + an auth provider
and add keys. I build the code around them.)*

---

## BUILD ORDER

### PHASE 0 — Foundations (unblocks everything else)
- **0a. Historical price ingestion** — script pulls FMP historical EOD prices for
  the universe; store as compact per-ticker series. *(I build · you run with key)*
- **0b. Replace mock prices** with real current + historical. Remove/clearly
  label any remaining sample data. *(depends 0a)*
- **0c. Auth + Stripe scaffolding** — anonymous free; account for paid; Stripe
  subscription + webhook. *(I build · you create Stripe/auth accounts + keys)*
- **0d. Entitlement system + "locked feature" UI** — the reusable faded/blurred
  overlay + "Unlock with Pro/Institutional" button → checkout. *(I build)*

### PHASE 1 — Returns & data features (Chong's core — needs 0a)
- **1a. Real stock price charts** on each stock page.
- **1b. ROI / performance** — stock vs benchmark index over time.
- **1c. Technical analysis** overlays (MA, RSI…) — **gated (paid)**.
- **1d. Portfolio v2** — real past-performance + benchmark vs indexes (rebuild
  the sloppy/static current one).

### PHASE 2 — Halal index product (Chong's flagship)
- **2a. Index definitions** — strict-screen constituent baskets (e.g. "Mizan
  Halal 50"). *(real fundamentals — no data dep, can prototype early)*
- **2b. Index performance + ROI vs conventional** (S&P 500 etc). *(needs 0a)*
- **2c. Multiple risk/growth tiers** + comparison view; "choose your
  growth/risk." Institutional-grade index methodology doc.

### PHASE 3 — AI layer
- **3a. AI compliance report** (stock / portfolio / index) — the institutional
  deliverable; **gated**. *(needs an LLM API key)*
- **3b. AI portfolio assistant** — "you're 80% compliant; here are halal swaps"
  (builds on existing HalalAlternatives). **gated**.
- **3c. Extend AI Q&A** to portfolio-level.

### PHASE 4 — Tiering & monetisation go-live
- **4a. Finalise the free / retail / institutional feature matrix** (draft §2).
- **4b. Wire the paywall** — faded locks + Unlock → Stripe, both tiers.
- **4c. Institutional-only features** — API/bulk export, white-label reports,
  index as a licensable feed, multi-seat.

### PHASE 5 — Coverage & scale
- **5a. Full universe** — US + HK + London + international (your FMP run; pipeline
  already supports `MIZAN_UNIVERSE`).
- **5b. Perf** — on-demand OG/pages already done; revisit if needed at scale.

### PHASE 6 — Brand & business (parallel — your actions)
- **6a. Register the company** (HK limited co.) + bank account → enables billing.
- **6b. Naming decision** — keep "Mizan" + clearer tagline, or rename for instant
  legibility (Chong's point). Decide before heavy brand spend.
- **6c. One-pager, institutional outreach (after product ready), startup
  competitions, YouTube channel, media.**

---

## 2. Free vs Paid — draft feature matrix (we'll finalise in 4a)
| Feature | Free | Retail (paid) | Institutional |
|---|---|---|---|
| 6-scholar verdict + cited sources | ✅ | ✅ | ✅ |
| Per-ticker SEO pages, crypto, methodology | ✅ | ✅ | ✅ |
| Save watchlist (local) | ✅ | ✅ | ✅ |
| Custom thresholds (saved to account) | – | ✅ | ✅ |
| Price charts | – | ✅ | ✅ |
| Technical analysis (MA/RSI) | – | ✅ | ✅ |
| ROI vs index, portfolio performance | – | ✅ | ✅ |
| Halal indexes (view) | teaser | ✅ | ✅ |
| AI compliance report | – | limited | ✅ unlimited |
| Verdict-change / earnings alerts | – | ✅ | ✅ |
| API / bulk data export | – | – | ✅ |
| White-label / licensable index feed | – | – | ✅ |
| Multi-seat, priority support | – | – | ✅ |
| Pricing (Chong's ballpark) | $0 | ~US$X/yr | ~US$10k/yr |

## 3. The "locked feature" UX (your spec)
Paid features render **visible but blurred/faded**, with a small lock + **"Unlock
with Pro"** (retail) or **"Talk to us"** (institutional) button. Clicking →
Stripe checkout (retail) or a contact/demo form (institutional). This shows value
before asking for money — better conversion than hiding features entirely.

## 4. Who does what
- **I build:** all code — ingestion scripts, charts, ROI, indexes, AI features,
  paywall/entitlements UI, the report generator.
- **You provide:** FMP key (prices/coverage), Stripe account + keys, an auth
  provider, an LLM API key (for AI), and the company registration (for billing &
  contracts). Each phase I'll tell you exactly which key/step is needed.

## 5. Honest sequencing notes
- **Phase 0 is the gate.** Without real prices + auth/billing, Phases 1–4 can't be
  real. Start there.
- **This is months of work for a solo part-time founder.** Resist doing all
  phases at once. Realistic: 0 → 1 → 2 first (that's already a strong paid
  product), then 3–4, then institutional polish.
- **You can send the institutional emails before all this is built** — they ask
  for a meeting, and Phase 0–2 is what you'd show *in* the meeting. Don't let the
  full build block the outreach; but don't show fake data either.
- **Accounts/billing slightly changes positioning** ("no signup, no data") — keep
  free tier anonymous; only paid requires an account. Say so explicitly on-site.

---

## Proposed start
Phase **0a (historical price ingestion)** — I write the script, you run it with
your FMP key. That single step unlocks charts, ROI, indexes, and portfolio
performance. Confirm the plan and I'll build 0a first.
