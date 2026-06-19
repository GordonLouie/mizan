# Mizan — your action items (the Stage-1 gates Claude can't do)

These are the things that genuinely need you. Ordered by impact on credibility.
After each, what Claude does once you've done it.

---

## 1. Engage a Shariah scholar / advisor  ⭐ the #1 credibility unlock
Without scholarly review, the product isn't credibly "halal" for serious users or
institutions — citations aren't a substitute for sign-off.
- **Easiest first step:** ask Prof. Chong if he can refer an Islamic-finance scholar
  (he's well-connected; this is a natural ask given his interest).
- **Or** contact a Shariah advisory firm for a methodology-review quote — e.g.
  Amanie Advisors, Shariyah Review Bureau, or a local AAOIFI-certified scholar.
- **Ask for:** (a) a one-off methodology review, then (b) ongoing sign-off + an
  annual public Shariah report. Even one named reviewing scholar changes everything.
- *Then Claude:* publish the scholar/board on the Trust + Methodology pages.

## 2. Re-verify the data + expand coverage  (the integrity gate)
- **Re-run enrichment with the FX fix** (fixes the Toyota/MUFG/TSM type errors):
  ```
  cd ~/mizan
  MIZAN_UNIVERSE=us node --env-file=.env.local scripts/enrichStocks.ts
  node --env-file=.env.local scripts/fetch_prices.mjs
  ```
  (Tell Claude before running if you want the exact flags confirmed.)
- **Spot-check accuracy:** pick ~15 names and compare Mizan's verdict to Zoya /
  Musaffa / the published AAOIFI rules. Send Claude any mismatches.
- *Then Claude:* re-run the data audit, shrink the "under review" set, and (later)
  add HK + international coverage.

## 3. Register the HK company + open a bank account  (unlocks real payments)
- Use an incorporation service (Sleek, Osome, or a local accountant) for an HK Ltd.
- Open a business bank account (or a fintech like Airwallex/Statrys for speed).
- *Then:* you can complete Stripe activation and accept real money.

## 4. Flip production keys  (after #3)
- **Stripe:** switch the dashboard to **Live**, recreate the two prices live, add a
  live webhook, and swap the 4 STRIPE_* env vars in Vercel to live values.
- **Clerk:** create a **Production** instance, add your domain to it, swap the 2
  Clerk keys in Vercel. (You're on test/dev keys now — fine for testing only.)
- *Then Claude:* verify the live checkout + login end-to-end.

## 5. Legal review  (you're taking accounts + payments now)
- Have a lawyer review Terms + Privacy (financial-info disclaimers, PII, payments).
  A startup/fintech lawyer, or start from Termly/iubenda but get it professionally
  reviewed — don't ship a finance product on a template alone.

## 6. Register the domain  (in progress — reminder set for tomorrow 11am)
- Cloudflare Registrar → halalscan.com (~$10/yr), or Namecheap/Porkbun.
- *Then Claude:* connect it in Vercel, rename the app to HalalScan, set 301 redirects.

## 7. Validate with real users  (proves demand)
- Recruit 10–20 beta users: Muslim-investing communities (r/IslamicFinance,
  r/MuslimPersonalFinance, X/Twitter Muslim-fintech), your network, MSA groups.
- Land one **institutional design partner** via Chong's intros (MPFA / HKMA).
- *Then Claude:* iterate on the feedback.

---

## Data provider decision — FMP → Twelve Data  (open, 2026-06-19)

**Why this came up:** HK fundamentals are blocked on the current FMP plan, and — more
importantly — **FMP Personal-Use doesn't license public commercial display of their
data.** HalalGauge publicly shows FMP-derived metrics in a paid product, so the current
US setup already sits outside FMP's Personal license (it "works" because nothing enforces
it, not because it's permitted). FMP's commercial public-display = sales-led **Enterprise**
(custom quote, account-manager funnel). Researched alternatives; **Twelve Data** is the
only provider with a self-serve, **commercial external-display** tier that also includes
global/HKEX fundamentals.

**The plan:** move fundamentals (and US prices) to **Twelve Data Venture** (~$499/mo, or
$4,990/yr). Code is ready — a provider-selectable adapter (`DATA_PROVIDER=twelvedata`)
for both `enrichStocks.ts` (fundamentals) and `fetch_prices.mjs` (US prices). Switching is
just env + a re-run; nothing in production changes until new data is committed.

**Open / waiting on you + Twelve Data:**
- **Twelve Data licensing confirmation (human, in progress).** Their bot couldn't confirm,
  escalated to a human (replying "later today" as of 19 Jun). The decisive question:
  *is commercial external display of non-US (HKEX) **fundamentals**-derived metrics to
  anonymous web users permitted on Venture without extra approval?* Their bot flagged that
  non-US **price** data needs extra approval and **HK historical prices need a separate
  direct-exchange license** — so on Venture, **HK = screen-only (no price chart), US = full.**
- **De-risk before annual:** subscribe **monthly first (~$499)**, run the smoke-test curls
  on `0700`/`3690`/`1810` to confirm HK fundamentals actually populate (coverage
  completeness is undocumented), then go annual. Ask for the **20% startup discount**.
- **Don't cancel FMP** until a Twelve Data run completes cleanly + deploys.
- *Then Claude:* if confirmed, finalize the cutover (set provider, help run, verify
  `stocks.json`), and the US price chart moves to Twelve Data so FMP can be dropped.

**Legal note (not legal advice):** the public-display license question is contractual.
Get Twelve Data's answer in writing; for the commercial-display terms, a quick read by
counsel (or your law-grad brother as a first pass) is worth it before relying on it —
especially since institutional buyers will scrutinize data licensing in due diligence.

---

### What's already done on Claude's side (so you know the split)
Product built + hardened: multi-scholar screening, TradingView-grade charts, halal
indexes + comparison + **custom index builder** with risk/reward, grounded AI
reports + portfolio assistant + Q&A, Clerk auth, Stripe (test), institutional API,
data-integrity guard, accurate privacy, SEO metadata, responsive UI. Runtime-clean
in production. The gates above are what stand between this and a credible launch.
