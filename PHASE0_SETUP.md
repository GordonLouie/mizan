# Phase 0 — setup & activation

All Phase 0 code is built and the app builds/runs unchanged. Here's what each
piece does and exactly what you provision to turn it on. Nothing here is live
until you add the relevant keys, by design.

## 0a — Real prices (DO THIS FIRST; unlocks Phases 1–2)
- Built: `scripts/fetch_prices.mjs`, reads `src/data/stocks.json`, writes
  `src/data/prices.json` (currently `{}`).
- **Run it:**
  ```bash
  FMP_API_KEY=your_key node scripts/fetch_prices.mjs
  # options: PRICE_DAYS=730  PRICE_SAMPLE=daily|weekly
  ```
- Then `git add src/data/prices.json && commit && push`. The app uses real
  prices automatically (see 0b). Re-run anytime to refresh.

## 0b — Real-price wiring (done, no action)
- `src/lib/prices.ts` now uses real data when present, a **clearly-labelled
  sample** otherwise (`isSamplePrice`, `hasRealPrices`). `priceSeries()` returns
  `[]` when there's no real history — **we never fabricate returns.** After 0a,
  charts/ROI/portfolio (Phase 1) have real data to draw.

## 0d — Free vs paid gating (done, no action)
- `src/lib/entitlements.ts` — tiers (free / retail / institutional) + which
  feature needs which tier. Edit `FEATURE_TIER` to re-gate anything.
- `src/components/LockedFeature.tsx` — wrap any paid feature; non-entitled users
  see it blurred with an "Unlock with Pro" / "Talk to us" button.
- Until billing is wired, tier = "free" (read from localStorage, so it's
  testable: set `localStorage.mizan_tier = "retail"` in the console to preview
  unlocked state).

## 0c — Billing (built, inert until you provision Stripe)
- `src/app/api/checkout/route.ts` — creates a Stripe Checkout session (REST).
- `src/app/api/stripe/webhook/route.ts` — on payment, records the customer's
  tier in KV; verifies the Stripe signature.
- **To activate (do this in Phase 4 when paid features exist — not yet):**
  1. Create a Stripe account → a Product + recurring Price → copy the price id.
  2. Set env: `STRIPE_SECRET_KEY`, `STRIPE_PRICE_RETAIL`, `STRIPE_WEBHOOK_SECRET`,
     `NEXT_PUBLIC_SITE_URL`.
  3. Add a Stripe webhook → `https://mizaninvesting.com/api/stripe/webhook`.
  4. Create a Vercel KV store (sets `KV_REST_API_URL`/`KV_REST_API_TOKEN`).

## ⚠ The one deliberately-deferred piece: sign-in
A paywall needs the browser to know *who* the user is so it can read their tier.
The billing→KV half is built; the **login half is not** (it needs an auth
provider + session, and shipping untested auth to a live site is risky). Options
when you're ready: Auth.js, Clerk, or a Resend magic-link (we already have Resend
plumbing). **Recommendation:** wire + test auth together in Phase 4, when there
are actually paid features to protect — there's nothing to sell yet, so the lock
UI running on a localStorage tier is the right interim.

## Order from here
1. **Run 0a** (real prices) → commit.
2. Build **Phase 1** (charts, ROI, portfolio) on the real data, each wrapped in
   `LockedFeature`.
3. Build **Phase 2** (halal indexes).
4. **Phase 4**: provision Stripe + auth, flip the paywall live, test end-to-end.
