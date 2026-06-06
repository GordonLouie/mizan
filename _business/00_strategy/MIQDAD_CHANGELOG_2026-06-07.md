# For Miqdad — what shipped today

**Date:** 7 June 2026
**Live URL:** mizaninvesting.com (auto-deploys after Gordon pushes)

You sent a bunch of feedback over the last couple of days. Here's everything
that's now live on the site, plus what's still queued.

---

## Shipped today — go click these

### 1. Scholar-first browsing on /universe
*Your "wow, under STRICT there are only X halal stocks" idea.*

Open `/universe`. The page now reads as a narrative:
**"Under AAOIFI, 185 of 342 stocks pass. Change scholar to see how the
investable universe expands or contracts."**

Below the summary, a new row of clickable scholar pills shows the pass count
under each (AAOIFI / Mufti Taqi / DJIM / Ja'fari / Strict). Tap one and the
whole table re-screens. The contrast between Strict (almost nothing passes)
and DJIM (most things pass) becomes visible in one screen — the
"disagreement is the product" moment.

### 2. Halal alternatives moved up
When a stock fails, "here are 3 halal stocks in the same sector" now appears
right after the multi-scholar verdict table — not buried at the bottom. The
"shopping cart" instinct: shown a "no," show the "but here's this" next.

Try: `/screen?ticker=AMZN` with Mufti Taqi selected.

### 3. Per-ratio breach-risk indicator
*Your "is this halal stable or about to flip?" idea, extended to every ratio.*

On any stock detail page, each of the 4 halal checks now shows a horizontal
bar with color zones (safe / stable / near limit / breached) and a marker
showing exactly where the current ratio sits versus the threshold. Plus a
small pill in the corner saying "Comfortable," "Stable," "Near limit," or
"Breached."

Means you can scan a passing stock and instantly see *how* it's passing — is
it nowhere near the line, or one bad quarter from failing? Try AAPL (super
comfortable on most) vs MSFT vs anything in tech with heavier debt.

### 4. Inline scholar tick-marks on /custom
*Your "make it feel like hotel booking" idea.*

The custom-profile page already had sliders, but they were free-floating —
no context for what numbers mean. Now each slider shows little notches above
the track marking where each established scholar sits. So when you drag the
debt slider you see: "oh, AAOIFI is at 30, DJIM is at 33, Strict is at 0."
The notches highlight in navy when you land exactly on a scholar's value.

### 5. Universe dropdowns restyled
The native Sector and Verdict dropdowns looked out of place. Now they match
the borderless search-input aesthetic — clean underline, custom chevron, same
focus state.

### 6. (already shipped earlier this week)
- Custom scholar card click bug — clicking anywhere on the card now navigates
- Tools dropdown closing too quickly — added 180ms hover delay
- Stability Score on the 8-quarter timeline — your "set it and forget it" idea
- PostHog analytics scaffolded — events start flowing once Gordon adds the key

---

## Still queued (not done today)

Mostly because they need backend or external partnerships:

- **Live notifications when a borderline stock crosses into fail** — needs
  auth, push infrastructure, scheduled screens. Phase 4.
- **One-click donation routing for purification amounts** — needs charity
  partnerships (legal + commercial work, not engineering).
- **Zakat coverage for more sects** — deferred. Zakat is a reference tool,
  not the headline. Will revisit once core screening is bulletproof.
- **AI prediction of next-quarter verdict shifts** — explicitly NOT building
  this. Refined into the Stability Score + Breach-Risk indicators above, which
  are pure math from current ratios. No black-box predictions.

---

## What I want your eyes on Monday

1. Does the scholar-comparison row on `/universe` feel like a discovery
   moment, or just another stat?
2. Is the breach-risk bar legible at a glance, or does it need a legend?
3. On `/custom`, do the scholar tick-marks help, or are they noise?
4. Anything else — bug reports, copy that reads wrong, missing features.

Reply in WhatsApp or text Gordon directly.
