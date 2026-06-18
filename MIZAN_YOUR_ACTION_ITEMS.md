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

### What's already done on Claude's side (so you know the split)
Product built + hardened: multi-scholar screening, TradingView-grade charts, halal
indexes + comparison + **custom index builder** with risk/reward, grounded AI
reports + portfolio assistant + Q&A, Clerk auth, Stripe (test), institutional API,
data-integrity guard, accurate privacy, SEO metadata, responsive UI. Runtime-clean
in production. The gates above are what stand between this and a credible launch.
