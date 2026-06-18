# HalalGauge — Product Teardown & Critique

A competitor's-eye, first-principles critique of the live product. Researched against Zoya, Musaffa, Islamicly, Wahed, PIF (halal), and TradingView, thinkorswim, IBKR, Sharesight, Empower (UX). Written to be uncomfortable, because that's the useful version.

---

## The one-sentence diagnosis

Your **moat is the rigorous, multi-scholar, deterministic, source-cited screen** — nobody else shows the same stock under AAOIFI *and* DJIM *and* a strict view side by side, and that directly attacks the #1 user complaint in this market ("every app gives a different answer"). But right now you're **burying that one trustworthy asset under two unreliable layers** (free-text AI prose and a biased backtest) and a **navigation/IA that reads as a pile of tools, not a product.** The fix is not more features — it's subtraction, hierarchy, and pointing everything at the moat.

A blunt market fact to internalize: for most retail Muslims, **SPUS/HLAL already are the answer** — one click, screened, rebalanced, purified, ~0.45%/yr. Every feature you ship is implicitly competing with that. So the question for each feature is: *does this help someone decide or act in a way a one-click halal ETF doesn't?* Where the answer is no, it's a vanity feature.

---

## Priorities (what to do, in order)

**P0 — credibility/liability (do first, mostly subtraction):**
1. Neuter the AI report into a grounded, templated explainer — no fiqh, no scholars, no scripture, no investment opinion, every number validated against the screen. (Or pull it until it is.)
2. Kill the index backtest in its current form (it is biased upward in every dimension and is a misleading-performance liability).

**P1 — the "feels like a product" pass:**
3. Rebuild the nav/IA into ≤5 outcome-based groups; move Pricing→Billing under account when logged in.
4. Fix the chart: replace the `<select>` compare, unify the toolbar, add a real legend + crosshair.
5. Rebuild the portfolio tracker around IBKR's summary→drill-down model; add a benchmark picker (incl. SPUS); fix the return methodology + label it.

**P2 — the moat & differentiation:**
6. Reposition "indexes" as thesis-driven, *actionable* halal watchlists with the one thing nobody has: **Shariah compliance-drift alerts + basket-level purification.**
7. Make the institutional page concrete (kill the generic 3-pillar AI-template feel).

---

## 1. Navigation / IA — "a cluster of things with no categorisation"

You're right, and it's the highest-leverage visible fix. Current state: top nav is Screen · Indexes · Learn · Pricing · **Tools** (a 640px 3-column mega-menu with 15 items across "Explore stocks / Your stocks / Reference"). That's ~20 destinations with weak grouping, and "Tools" is a junk drawer.

**Why it's weak:** best-practice SaaS nav caps top-level at ~5 and uses mega-menus *only* where a group genuinely has many children, grouped by **what the user is trying to do**, not by internal category. "Tools" tells the user nothing. Fifteen flat items is cognitive overload, and the same destination (Indexes) appears twice.

**Fix — collapse to outcome-based groups:**
- **Screen** (the core action — keep it first and prominent, maybe with an inline ticker search in the header so users can search from anywhere; you currently have none).
- **Research ▾** → Discover, Sectors, Curated lists, Universe, Compare stocks, Earnings calendar.
- **Portfolio ▾** → Holdings & compliance score, Watchlist, Indexes/baskets.
- **Calculators ▾** → Zakat, Purification, Custom thresholds.
- **Learn** → keep (Learn + Ask-a-scholar Q&A).
- Right side: account.

Crypto/Sukuk are labeled "Early development" — pull them out of the main nav entirely (a footer "Coming soon" or a roadmap link). Shipping half-built things in the primary nav is one of the biggest "not a real product yet" tells.

**Pricing placement (your instinct is right):** Logged-out, keep "Pricing" in the top nav — that's the universal SaaS conversion pattern. **Logged-in, remove it** and put Billing/Plan under the account-avatar menu, then trigger a contextual "Upgrade" prompt *at the moment* a free user hits a gated feature (you already gate features — wire the upgrade CTA to those walls). A permanent "Pricing" link in a paying user's working nav is clutter.

---

## 2. Price chart — the compare dropdown and scattered controls

Current state (`PriceChart.tsx`): real TradingView lightweight-charts, with Type (Area/Line), Overlays (MA50/EMA20/Bollinger), Indicators (RSI/MACD sub-panes), and a **raw `<select>`** for the benchmark compare. Range buttons (1M/6M/1Y/All) live up in the header, separate from the toolbar. In compare mode, the Type/Overlay buttons are disabled-but-still-visible.

**Why it feels "AI-obvious / thrown on screen":**
- A raw HTML `<select>` is the dead giveaway — no pro charting tool uses one for symbol compare.
- Controls are split across two zones (range in header, everything else in toolbar) with no clear hierarchy.
- Disabled-but-visible buttons in compare mode read as broken.
- No persistent legend/data-window; the benchmark line isn't even labeled on the chart.

**What TradingView/thinkorswim actually do (copy this):**
- **One top toolbar**: chart-type as a small **segmented icon control** (area/line/candle), an **"Indicators" button** opening a single dialog split into *Overlays* vs *Oscillators* (the tool auto-routes RSI/MACD to a sub-pane), and a separate **"Compare ＋" button**.
- **Compare** opens a **typeahead with quick-pick benchmark chips** (S&P 500, **SPUS**, sector ETF) — never a `<select>`. On add, **auto-rebase the Y-axis to % change** and render each series as a **removable colored legend pill**. Cap at ~3 overlaid series.
- **Range selector as its own dedicated bottom bar** (segmented buttons), not floating in the header.
- **Persistent, color-coded legend + a shared crosshair tooltip** synced across the price and RSI/MACD panes — this single thing is the biggest "professional vs amateur" signal.
- Don't disable-and-show; either hide irrelevant controls in compare mode or keep them live.

This is mostly a re-layout of components you already have plus a proper compare control — high polish-per-hour.

---

## 3. Portfolio tracker — "a random chart thrown on the screen"

Current state (`portfolio/page.tsx`, `PortfolioPerformance.tsx`): hero metrics (value, cost basis, halal %, halal value), a custom-SVG "% return vs S&P 500" line, a verdict donut, a sector bar, a holdings table, an AI assistant, localStorage positions. The performance line is a **naive price-weighted buy-and-hold** of *current* share counts, **hardcoded to SPY**, no dividends, no deposits/withdrawals handling.

**Why it falls short of the IBKR screenshot you sent:**
- **Methodology is naive and unlabeled.** IBKR leads with **Time-Weighted Return (TWR)** and lets you toggle **Money-Weighted (MWR)**, and *names the method*. Yours silently assumes you always held today's shares — backtesting a position you didn't own. Sharesight's lesson: **ambiguous return methodology is a trust killer.** At minimum, label it honestly ("hypothetical: current holdings tracked back over the window, price-only, excludes dividends & cash flows"). Better: compute a real TWR.
- **No benchmark picker.** It's SPY-only. IBKR/Fidelity/Schwab let you pick and overlay up to 3–5 benchmarks rebased to %. You should *at least* offer **SPUS/HLAL** — the honest comparison a halal investor actually cares about is "am I beating the halal ETF I could just buy?", not the S&P.
- **No information hierarchy.** IBKR's whole feel comes from **summary cards that expand into detail** (progressive disclosure). Yours is a flat stack of charts of equal visual weight — which is exactly why it reads "random."
- **Allocation is static.** Empower/IBKR make allocation **drill-down** (asset class → sector → holding) and ideally **goal-relative** (current vs target). A static donut feels like a screenshot.

**Fix:** lead with 3–4 summary tiles (Value · Return % vs benchmark · Halal % · Purification owed), each expandable; one performance chart with a **benchmark picker (SPY/SPUS/NASDAQ)** rebased to %, range **and** frequency selectors; a **labeled methodology**; drill-down allocation. Your *unique* tile that IBKR can't have: **Halal % over time** and **purification owed** — lead with those, they're your reason to exist.

---

## 4. AI report — stress-tested, and it's a liability in its current shape

Current state (`aiReport.ts`): Claude writes exec summary, sector assessment, financial analysis, scholarly rationale, purification guidance, risks, bottom line — grounded on the deterministic JSON, temp 0.3, with good guardrails in the prompt ("never change the verdict, never invent numbers"). Validation only checks that two fields are non-empty.

**The uncomfortable truth (well-sourced):**
- LLMs fail *most dangerously where they look most authoritative* — fluent, confident, wrong. Even 10–20% hallucination rates on financial reasoning are catastrophic at scale.
- **"scholarlyRationale" is the single riskiest field you ship.** Scholars are near-unanimous that **AI cannot issue fatwas**, and peer-reviewed evaluations document LLMs **misattributing Qur'an/hadith and fabricating scholarly positions.** A made-up "according to AAOIFI Standard 21, scholars hold…" is a credibility-ending event for a *religious* product.
- **Generic filler erodes trust even when correct.** User trust drops ~50% when content is *perceived* as AI-generated. "If it could be swapped with a competitor's and nobody would notice, it isn't building trust." Templated "X has a strong balance sheet and diversified revenue" is exactly that.
- **Investment-opinion drift = unregistered-adviser risk.** The moment the prose says "good/safe/attractive," you're flirting with regulation.

**Fix (don't kill it — neuter and re-aim it):** make the LLM a **translator of your deterministic outputs, never an analyst or a mufti.**
- Feed it *only* the screen's structured outputs; **programmatically validate** that every number in the text exists in that payload, else regenerate/fall back. Cache per stock (kills inconsistency).
- **Fixed template**, stock-specific: "Verdict & the one driver" · "Which ratio mattered / what to monitor" · "Purification owed." Kill the free-form essay.
- **No scripture, no hadith, no named scholars, no fiqh reasoning** generated by the model — point to a human-reviewed methodology page instead.
- A **structural, persistent caveat**: "Plain-language explanation of HalalGauge's automated screen — not a fatwa or investment advice." (You have the fatwa footer; make the scoping structural, not cosmetic.)

If you can't commit to grounding + validation + templating + no-fiqh, pull the report until you can. It's the highest-liability, lowest-trust thing in the product right now.

---

## 5. Indexes — "no direction, just a curated list you can't buy"

You're essentially right, and this is where to be most ruthless. Current state: 3 curated baskets (Halal 50 / Tech / Income) + a Pro "build your own" that runs an **equal-weight, buy-and-hold, price-only backtest vs the S&P 500**, using **current constituents and current fundamentals**. Not investable, not exportable, no alerts.

**Two separate problems:**

**(a) The backtest is not just weak — it's misleading, and a liability.** It hits *every* classic bias, all pushing returns *upward*:
- **Survivorship bias** (only stocks that exist & are halal today) — historically overstates returns ~1–5%/yr.
- **Look-ahead bias** — you screen with *today's* compliance/fundamentals applied to the past; Shariah status is time-varying, so you're "holding" 2018 stocks because you know they're compliant in 2026.
- **Equal-weight** structurally tilts small-cap and needs constant rebalancing — your basket may "beat" the S&P purely from the weighting scheme, nothing to do with being halal. You'd be selling a size-factor bet dressed as a halal edge.
- **No purification, no costs** in the return series — overstates the *halal* return actually kept.

Publishing backtests that imply outperformance is squarely in SEC "misleading performance / AI-washing" territory. Recall **Wahed was fined $300k by the SEC partly for marketing indexes it couldn't deliver.** **Recommendation: remove the backtest** unless you commit to point-in-time, survivorship-free, time-varying-screen, net-of-cost-and-purification data (expensive, hard, and even then must be labeled hypothetical). Most teams should not attempt this.

**(b) The baskets need a thesis and an action, or they're "a random list."** What makes a basket valuable, from the direct-indexing playbook:
- **Drop the "index" word and the S&P comparison.** "Index" implies investability + benchmark rigor you don't have. Call them **curated halal baskets / model watchlists.**
- **Give each a stated thesis** ("AAOIFI-strict, debt < 20%", "compliant US large-cap tech", "halal dividend payers") and show **current** characteristics, not a fabricated history.
- **Make it actionable cheaply** (you don't need to be a broker): **exportable holdings (CSV)**, per-holding **broker deep-links**, and a "target vs your current holdings" diff if they input a portfolio.
- **Then build your actual moat:** **Shariah compliance-drift alerts** ("2 holdings crossed the debt threshold this quarter — review") and **basket-level purification owed.** No generic direct-indexing or portfolio tool does Shariah drift monitoring. *That* is a defensible, recurring-value feature — the thing that turns a vanity list into a reason to subscribe.

The decision-useful question for a halal investor isn't "would this have beaten the S&P" — it's "is this *staying* compliant, and what do I owe in purification."

---

## 6. Institutional landing page — "good, but so AI-obvious"

Current state: navy hero "Shariah infrastructure you can put your name on" + three generic pillar cards (index construction / data API / white-label reports) + a contact band. It's clean but it's the **canonical AI-generated B2B template**: vague value props, no proof, no specificity, interchangeable with any fintech.

**Why it reads AI-generated:** every claim is generic ("auditable methodology, ongoing maintenance") with zero concreteness — no sample report, no real API response, no methodology depth, no named standard coverage, no logos/credibility, no pricing or process. A sophisticated institutional buyer (MPFA, a bank, an asset manager) bounces off this instantly because it shows nothing they can evaluate.

**Fix — replace generic claims with concrete artifacts:**
- A **real, viewable sample**: an actual white-label compliance report PDF, and a **live API request/response** (you already have a spec block — make it real and copyable).
- **Specificity that proves depth**: which standards (AAOIFI, DJIM, etc.), how many securities, refresh cadence, the audit trail a regulator would see, the point-in-time methodology.
- **A concrete process**: "pilot → methodology sign-off → integration," not "let's talk about your mandate."
- **Honesty about stage** if pre-revenue — institutions respect "early, transparent, rigorous" more than vague grandiosity.
- Tie it to the moat: the multi-standard transparency + Shariah-drift monitoring is the institutional pitch (MPF providers and banks need *auditable* screening they can defend to regulators) — say *that*, concretely.

Caveat: I'm assessing this as UX/credibility, not as someone who knows the HK institutional sales motion. The research supports "concrete proof beats generic claims," but validate the actual buyer needs with a real prospect (this ties to your Cheng/Lee/Frankel outreach).

---

## 7. The broader "AI-obvious" feel — what actually causes it

It's rarely one thing; it's an accumulation of tells. The ones present here:
- **Uniform visual weight** — everything is a rounded-xl card with the same padding, so nothing feels designed for *its* job. Vary density and hierarchy intentionally.
- **Generic microcopy** — "Comprehensive fundamental data," "auditable methodology," templated "next steps." Replace with specific, opinionated, human copy.
- **Features that don't connect to a decision** — backtests, essays, charts that look right but don't change what the user does next.
- **Half-built things shipped in primary surfaces** ("Early development" crypto/sukuk in the nav).
- **Default component patterns** (`<select>` compare, flat chart stacks) instead of considered, domain-specific UI.

The cure is the same everywhere: **subtract, prioritize one job per surface, and make every feature point at a decision the user can act on.**

---

## What NOT to change (the strengths — protect these)

- The **deterministic, multi-scholar, source-cited screen** — this is the moat. Zoya/Musaffa are AAOIFI-only; Islamicly is DJIM-only; nobody shows the disagreement transparently. Lean *harder* into "see where the scholars split."
- **Integrity-first data** — honest "ingesting/insufficient history" states, withholding verdicts on broken data, real prices throughout. This rigor is rare and valuable; don't dilute it.
- **No-signup, SEO-indexed verdict pages** — good acquisition engine.
- The **cross-linking** you just shipped (stock ↔ index ↔ screen) — right direction; keep weaving features together.

---

## Summary

You don't have a features problem — you have a focus and finish problem. The differentiation is *rigor and transparency*. Right now an unreliable AI narrative layer and a biased backtest are diluting exactly that, and the IA makes a strong toolset feel like a junk drawer. Cut the two liabilities (free-text AI, backtest), rebuild nav + chart + portfolio around best-in-class hierarchy, and reposition baskets around the one thing no competitor has — **Shariah compliance-drift alerts + purification.** That's the path from "impressive AI-built MVP" to "credible product."
