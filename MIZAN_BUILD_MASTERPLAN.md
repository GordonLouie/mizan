# Mizan — master build plan & status

The blueprint from the Chong meeting, now annotated with what's actually been
built. This is the single source of truth for where the product stands and where
it's going.

**Last updated:** 2026-06-16
**State in one line:** Phases 1–4 built + provisioned + a QA/polish pass done.
The product is **live in Stripe TEST mode** end-to-end — auth, KV, Resend email,
Stripe checkout, and AI reports are all verified working. The only things left
before taking real money are *business setup* (HK company + bank → Stripe live)
and a *live UI stress test + security review*.

**Provisioning status (all DONE, 2026-06-16):**
KV (Upstash `mizan-kv`) ✅ · Resend + verified domain ✅ · Stripe test (product +
$9.99mo/$89yr prices + webhook) ✅ · AUTH_SECRET ✅ · ANTHROPIC_API_KEY ✅ · own
email seeded as institutional in KV ✅. Verified: sign-in email → signed in →
paywall enforced → test-card checkout flips a fresh account to Pro.

---

## 0. The frame (locked decisions — unchanged, all honoured)
- **Mizan is a company**, building for paying customers.
- **Free tier + paid tiers**, with paid features shown faded/blurred behind an
  "Unlock" button. ✅ Built (LockedFeature).
- **Two paid tiers:** Retail (individuals — SEA/India/global) and Institutional
  (funds/banks/MPF — HK). ✅ Both in the entitlement system + pricing page.
- **Data integrity is non-negotiable** — no fabricated prices/returns. ✅ Held
  throughout. We removed two fake-data sources (FX-broken ratios; a fabricated
  portfolio line) and a survivorship caveat is shown on index backtests.
- **SEO pages stay free + open.** ✅ Untouched; AI Q&A added as a free hook.
- **Free tier stays no-account.** ✅ Accounts are required only for paid features.

---

## Build status by phase

Legend: ✅ done · 🔶 ready, pending your run/keys · ⬜ not started / deferred

### PHASE 0 — Foundations ✅
- 0a Historical price ingestion — ✅ `scripts/fetch_prices.mjs` (adjusted close).
- 0b Real prices replace mock — ✅ client/server split (9KB client vs 6.7MB
  server). **Verified accurate** against live quotes (the AI/memory boom is real).
- 0c Auth + Stripe scaffolding — ✅ built (see Phase 4).
- 0d Entitlement system + locked-feature UI — ✅ `entitlements.ts` + `LockedFeature`.

### PHASE 1 — Returns & data features ✅
- 1a Price charts — ✅ `PriceChart` (SVG, no dep) on `/screen`.
- 1b ROI vs benchmark — ✅ price vs S&P %, in the chart.
- 1c Technical analysis (MA/RSI) — ✅ gated.
- 1d Portfolio v2 — ✅ real performance vs SPY (`PortfolioPerformance`); the old
  fabricated line was deleted.

### PHASE 2 — Halal index product ✅
- 2a Index definitions — ✅ Mizan Halal 50 / Tech / Income (AAOIFI screen).
- 2b Index performance vs S&P 500 + SPUS — ✅ real equal-weight backtest.
- 2c Risk/growth tiers + methodology — ✅ three risk profiles + published method.
  **Known limitation (disclosed on-page):** constituents are current-as-of-today,
  so the backtest carries look-ahead/survivorship bias → it's framed as "today's
  basket's trailing performance," not a live track record. *Point-in-time
  rebalancing is the main quality upgrade still owed here.*

### PHASE 3 — AI layer ✅
- 3a AI compliance report (stock) — ✅ `/screen`, grounded (verdict/numbers
  deterministic, Claude writes only prose), downloadable, gated Pro.
- 3b AI portfolio assistant — ✅ "you're X% halal" + halal swaps + follow-up Q&A.
- 3c AI Q&A — ✅ `/ask` wired to Claude (free, grounded in the vetted KB) +
  portfolio-level Q&A.
- *Optional later:* AI report on `/indexes/[slug]`.

### PHASE 4 — Tiering, paywall & auth ✅
- 4a Feature matrix finalised — ✅ `/pricing` page.
- 4b Paywall wired — ✅ passwordless magic-link auth (`auth.ts`), Stripe checkout
  (monthly/annual), billing portal, `/account`, and **server-side entitlement
  enforcement** on the AI endpoints (the real fix beyond client gating).
- 4c Institutional features — ✅ read-only bulk **screening API** (`/api/v1/screen`,
  key-gated). ⬜ White-label reports + multi-seat deferred (demand-driven).

### PHASE 5 — Coverage & scale 🔶
- 5a Full universe — 🔶 pipeline ready (`MIZAN_UNIVERSE=us`); needs your FMP run.
- 5b Perf — ✅ on-demand OG/pages already done; revisit at scale.

### PHASE 6 — Brand & business ⬜ (your decisions/actions)
- 6a Register HK company + bank → enables Stripe payouts.
- 6b Naming decision (keep "Mizan" + sharper tagline vs rename — Chong's point).
- 6c One-pager, institutional outreach, competitions, YouTube, media. *(Claude can
  draft the one-pager + outreach on request.)*

---

## What changed vs the original plan
- **Auth:** chose **custom passwordless magic-link** over a vendor (Clerk/Supabase)
  — it fits the no-dependency, inert-until-keyed stack and reuses KV + Resend.
  Trade-off: hand-rolled, so it should get a security review before heavy reliance.
- **Index screen:** switched constituent selection from Mufti Taqi (too strict —
  it emptied the Tech index by rejecting asset-light tech) to **AAOIFI**, the basis
  for mainstream halal indices. More robust, properly-sized baskets.
- **Pricing decided:** **Pro $9.99/mo or $89/yr**; institutional sales-led. Set at
  market (Zoya ~$8/mo·$100/yr; Musaffa $7.49+/mo), justified by the extra depth.
- **A real data scare, correctly resolved:** an apparent price-corruption alarm
  turned out to be the genuine 2025–26 AI semiconductor/memory boom (Micron
  ~$1,060, SanDisk +692% YTD, Netflix post-split). Verified against live quotes;
  the feed is accurate. Lesson reinforced: verify before alarming.
- **Free AI Q&A** added as an acquisition hook (the plan only had gated AI).

---

## What's left to do
**Provisioning:** ✅ DONE (see status block at the top).

**Done since last update:**
- Point-in-time index selection — survivorship bias removed; honest numbers
  (Halal 50 +35.5% vs S&P +37.6%, Tech +78.7%, Income +16.1%).
- Webhook `customer.subscription.updated/deleted` lifecycle (customer→email map).
- QA polish: a11y labels/aria, stale URL-param cleanup, mobile table widths.
- Integration fixes: `/indexes` was unlinked in nav → added to Tools menu +
  footer; footer now links Pricing + Indexes; removed the stale "sample data"
  disclaimer and the not-yet-registered "(HK) Limited" entity name.

**Remaining code follow-ups:**
- **Live UI/UX stress test** (Claude in Chrome) — needs the browser extension
  connected; drive real flows at mobile + desktop widths, watch console.
- **Security review** of the hand-rolled magic-link auth before heavy reliance
  (CSRF is largely covered by SameSite=Lax cookies — confirm/document).
- Optional/demand-driven: AI report on `/indexes/[slug]`; white-label reports +
  multi-seat.

**Business (yours) — the real critical path now:**
- Register HK company + bank → unlocks Stripe **live** mode (then restore the
  legal entity name in the footer) and adds weight to institutional talks.
- Send the warm intros (drafted in `OUTREACH_INSTITUTIONAL_EMAILS.md`) — ideally
  ask Chong to introduce you to Cheng Yan-chee (MPFA) and Howard Lee (HKMA).
- Optional: expand the universe (`MIZAN_UNIVERSE=us`) + re-fetch prices.

---

## Positioning — how Mizan wins
**One line:** *The halal screener that shows its work — every verdict tied to a
named scholar and a cited source, with the analytics and AI reports serious
investors and institutions actually need.*

**The wedge (what competitors don't do):**
- **Multi-scholar transparency.** Zoya/Musaffa pick a standard; Mizan shows the
  verdict across standards, *where scholars disagree*, with primary-source
  citations. This is the trust differentiator for a religiously-sensitive purchase.
- **Data integrity as a brand.** Built deliberately for an econometrician's network
  and regulators — real data or clearly-labelled, never fabricated. Most retail
  apps don't carry that burden; it's exactly what unlocks institutions.
- **Institutional deliverables retail apps lack:** halal indexes with real
  backtests, grounded AI compliance reports, and a screening **API/feed**.
- **A distribution wedge competitors ignore:** **HK + institutional**. Zoya/Musaffa
  are US-retail-first. Mizan has a warm path into HK institutions (Chong's network)
  and a real gap to fill — there is no Shariah MPF option, and HK is actively
  promoting Islamic finance.

**Two-sided market:**
- *Retail* (SEA/India/global Muslim investors) — $9.99/mo, acquired via the free
  SEO pages + free AI Q&A. Validates the funnel and funds the business.
- *Institutional* (HK funds, MPF providers, banks) — custom/high-ticket, landed via
  warm intros, sold on the index feed + API + white-label reports.

**Competitive read:** Zoya = polished US retail; Musaffa = broad coverage + trading
+ academy. Mizan's defensible position is **transparency + integrity + institutional
depth + an underserved HK beachhead** — not "another screener," but the credible,
auditable layer that both careful individuals and institutions can stand behind.

---

## Future outlook (next 1–2 quarters)
1. **Flip the switches** (this week): keys in, paywall + AI live.
2. **Validate retail** — watch free→Pro conversion off the SEO/Q&A funnel; iterate
   on the upgrade moment. This is the 30-day-gate evidence.
3. **Land one institutional pilot** — use the warm Chong intros; the meeting demo
   is the live indexes + AI report + API. One reference customer changes everything.
4. **Earn the index claim** — ship point-in-time rebalancing so the index numbers
   are defensible to a quant, then pitch the index as a licensable feed.
5. **Deepen legitimacy** — formalise a scholar/advisory touchpoint (the citations
   promise a review process; making it real is a moat).
6. **Scale coverage** — global universe once the funnel justifies the FMP cost.
7. **Decide the brand** (6b) before heavy spend; then one-pager + outreach cadence.

**Bottom line:** the engineering risk is largely behind us. The next chapter is
distribution and proof — turning a complete, credible product into its first
paying retail cohort and its first institutional logo.
