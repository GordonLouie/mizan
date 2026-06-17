# Mizan — Game Plan v3: honest maturity & path to credible launch

This replaces the earlier "it's launch-ready" framing. It is deliberately
critical. Rule: **"a feature renders in a demo" ≠ "mature, defensible, launch-ready."**
We will not call Mizan launch-ready, or pitch it as such, until the Stage gates below are met.

**Last updated:** 2026-06-18
**Honest status:** a polished, feature-complete **MVP/prototype**. Core journeys
work (screen, charts, AI report, indexes, auth, checkout — all in test mode).
It is **not** yet credible/mature to a retail-paid or institutional standard.

---

## 1. Maturity scorecard (be honest)

| Dimension | State | Grade |
|---|---|---|
| Core flows work end-to-end (demo) | Yes | 🟡 MVP |
| Data coverage | ~650 US tickers (curated sample) | 🔴 thin; no HK/intl |
| Data accuracy at scale | ~5 tickers hand-verified; 1 FX bug + 1 scare already | 🔴 unaudited |
| Scholarly legitimacy | "No Shariah board yet" (stated on-site) | 🔴 the biggest gap |
| Index rigor | equal-weight, ~2yr window, no rebalancing, current-screen | 🔴 illustrative, not a benchmark |
| AI report reliability | 1 report tested (a clean pass) | 🔴 untested on fail/borderline/foreign |
| Auth / payments | Clerk **test** + Stripe **test** | 🔴 cannot take real money |
| Mobile / accessibility | desktop only verified | 🟡 unverified at 375px |
| Legal / privacy | unreviewed; now storing PII (email, tier) | 🔴 needs review |
| Validation | zero users, no design partner | 🔴 unproven demand |
| Brand | still "Mizan"; rename pending | 🟡 unresolved |

Note (correction to an earlier over-criticism): prices are **adjusted close**, which
already includes dividends — so index returns are effectively **total return**, not
price-only. The window (~2yr), equal weighting, and current-screen bias remain real limits.

---

## 2. The bar — three honest stages

### Stage 0 — MVP (where we are) ✅
Everything builds, core flows demoable in test mode. Good enough to *show* in a
meeting with heavy caveats. NOT good enough to charge or to call "halal-certified."

### Stage 1 — Credible retail beta (the next real milestone)
Gate to charge retail money and invite real users:
- [ ] **Data audited** — screening outputs spot-checked across the universe vs a
      reference (AAOIFI rules / Zoya); FX, ETFs, borderline, zero-data names verified.
- [ ] **Coverage expanded** — at least the full liquid US universe (your FMP run).
- [ ] **AI safety** — reports tested across pass/fail/borderline/foreign; visible
      "AI-generated, not a fatwa" framing; deterministic facts verified for each verdict class.
- [ ] **Index honesty** — relabel as "screened baskets," disclose methodology limits,
      or upgrade rigor (rebalancing, longer window).
- [ ] **Production infra** — Clerk prod instance, Stripe live (needs company), basic
      security review of the entitlement flow.
- [ ] **Mobile + a11y QA** passed.
- [ ] **Legal** — Terms + Privacy reviewed for accounts/payments/PII.
- [ ] **Validation** — 10–20 real beta users; iterate.

### Stage 2 — Institutional-grade (the Chong / MPFA pitch)
Gate to credibly sell to funds/MPF/banks:
- [ ] **Scholarly board / sign-off** — at least one qualified scholar reviewing
      methodology and AI outputs. Without this it is not credibly "halal" for institutions.
- [ ] **Auditable data lineage** — provenance + change log per verdict; defensible to a regulator.
- [ ] **Index methodology doc** to institutional standard (point-in-time on screen too,
      total-return confirmed, rebalancing rules, benchmark licensing terms).
- [ ] **SLA, multi-seat, API hardening, white-label** proven with a design partner.

---

## 3. Who does what

**Claude can execute now (no dependency on you):**
- Data-integrity audit script + fixes for obvious issues.
- Index relabel / honesty + methodology disclosure.
- AI prompt guardrails + "not a fatwa" framing + verify deterministic facts across verdict classes.
- Mobile/accessibility QA pass (via the connected browser) + fixes.
- Draft an improved Privacy Policy + Terms (draft, not legal advice).
- Honest coverage messaging (no "international" claims until data exists).

**Needs you:**
- Register the domain (reminder set) → then Claude renames + redirects.
- FMP universe run (coverage). Stripe live + company. Clerk production instance.
- Engage a scholar / advisory (the credibility unlock). Legal review by a professional.
- Recruit beta users / a design partner.

---

## 3b. Data audit findings (2026-06-18) — real issues found

The audit was honest and surfaced two data-curation problems (both need the
Stage-1 reference pass to fully fix; a safety guard now withholds the affected names):

1. **Foreign-ADR FX normalisation** — ~33 ADRs (Toyota, MUFG, Sony, Indian/Japanese
   banks, etc.) have un-normalised local-currency balance sheets → absurd ratios
   (Toyota "18,793% debt"). Even subtler cases (TSM showing 145% cash vs a real ~3–4%)
   slip below a naive cap. Root fix: re-run FMP enrichment (FX code is in fmpFetch.ts)
   and cross-check vs a reference.
2. **Inconsistent sector flags** — some financials carry `conventional_finance`
   (GS, MS) and some don't (JPM, BAC, C, HSBC), so banks pass the sector screen and
   only fail on ratios. We do NOT auto-exclude all "Financial Services" because that
   bucket also holds Visa/Mastercard/exchanges/ratings that scholars treat differently.
   Needs manual curation against a reference list.

**Interim guard shipped:** `fundamentalsReliable()` withholds a verdict (shows
"under review", excludes from indexes, blocks AI report) for sector-passing names
with implausible ratios — currently ~47 names (~7%). Honest, not a real fix.
The **screening LOGIC is verified correct** across pass/borderline/fail; the issue
is input-data quality, which is a Stage-1 gate.

## 4. Immediate execution queue (Claude, now)
1. **Data-integrity audit** — run across all tickers; flag zero/implausible fundamentals,
   FX/foreign issues, ETF handling, verdict distribution; fix what's clearly broken.
2. **Index honesty pass** — relabel + disclosures.
3. **AI safety pass** — guardrails + framing; verify fail/borderline facts.
4. **Mobile/a11y QA** — drive the site at 375px; fix overflows.
5. **Privacy/Terms draft** for the new data we collect.

Everything else waits on you. We do NOT market this as launch-ready until Stage 1.
