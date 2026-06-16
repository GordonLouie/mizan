# Reminder: publish a FRESH LinkedIn post for the new banner

Gordon — the new navy banner should now be the default link-preview image, so it's worth a fresh post. Quick status and the steps, then drafted copy.

## 1. Deploy check (what I could verify)

mizaninvesting.com is live and serving the latest assets. The OG tags are correct for LinkedIn:

- `og:image` = `https://mizaninvesting.com/og-image.png?v=3` (cache-busted to v3 — good)
- 1200×630, `twitter:card` = `summary_large_image`
- SEO is healthy: `robots: index, follow`, methodology / lists / trust pages all linking, keywords set
- Universe expansion is showing: "657+ tickers" on the homepage

**One thing to eyeball before you post.** I can't render the image pixels from here, and the metadata text doesn't match the banner you described:

- The task describes the banner as "Halal investing, calibrated to your **scholar**."
- But the live `og:title` and page title read "calibrated to your **conscience**," and `og:image:alt` reads "multi-scholar halal investing screener."

So either the banner image and the page copy say different things, or the new "scholar" banner didn't fully deploy. **Confirm visually in step 4 before publishing.** Also: I can't see the Vercel dashboard from here — give it a glance to confirm the latest deploy is actually green.

Minor copy nit (not blocking): the homepage says both "**5** scholars / 657+ tickers" and "**six** methodologies / all six scholars." Worth reconciling since the post copy below leans on "six."

## 2. Force LinkedIn to re-scrape (critical)

LinkedIn freezes the preview at publish time and caches per URL, so editing your old post will **not** update its thumbnail.

1. Open the [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/), paste `https://mizaninvesting.com`, and run it. This forces a fresh scrape and clears the cache.
2. Confirm the inspector shows the new navy banner (not the old image).
3. Publish a **brand-new post** — do not edit the old one.

## 3. Verify the preview independently

Paste `https://mizaninvesting.com` into [opengraph.xyz](https://www.opengraph.xyz) and confirm the navy "calibrated to your scholar" banner renders, title/description look right, and there's no broken image.

## 4. Draft post copy (yours to edit)

No emojis, on-message, ends with a specific ask:

---

I'm not Muslim. I built a halal stock screener anyway.

That makes people pause, which is fair, so here's the honest version. I kept hearing the same frustration from friends who invest: every halal screening app hands you a verdict with no math behind it, and each one picks a single methodology and hides the rest. If your scholar disagrees with the app, you're stuck.

Mizan is my attempt to fix that. Free, no signup. You type a ticker and see it screened under all six methodologies side by side — AAOIFI, Mufti Taqi Usmani, S&P DJIM, Ja'fari, a strict profile, and your own custom thresholds. Every verdict shows the exact ratio and cites the published threshold it came from. No black-box score.

It's also the only screener I know of that actually implements Mufti Taqi Usmani's illiquid-asset rule — the one most apps quietly skip because it's hard to do.

I can't vouch for the fiqh myself, which is exactly why Miqdad came on as Founding Advisor to keep the methodology honest.

If you invest and care about this: pull up a stock you actually own at mizaninvesting.com and tell me where it's wrong. Honest critique is what I'm after.

---

Want a shorter variant or a different opening line? Say the word and I'll redraft.
