# Mizan — builder's distribution scaling plan

You can build it yourself, so the strategy is **product-as-distribution**: turn the
codebase into a growth engine that runs without you in the room. Four engines,
sequenced by leverage. Each is something you ship, not someone you hire.

Two honest guardrails up front:
- **Validate retention first / in parallel.** Scaling traffic into a product
  people don't return to just fills a leaky bucket faster. Engine 3 (retention)
  is *not* optional — build it early.
- **The one thing you can't build is credibility.** Engineering scales *reach*,
  not legitimacy. The non-Muslim-founder / no-scholar trust ceiling needs one
  credible scholar relationship. Code can't substitute for that — pair the build
  with it.

---

## Engine 1 — Programmatic SEO (the core flywheel)

This is how Musaffa wins. Someone googles "is Tesla halal" → lands on you. It's
free, compounds forever, and it directly fixes your zero-organic-discovery
problem. Your screener is currently client-rendered, so Google can't index
verdicts — that's the whole gap.

**Build:**
- `app/halal/[ticker]/page.tsx` — server-rendered page per ticker. Run
  `screenStock()` at build time, render the 6-scholar verdict table + deciding
  metric + cited sources as real HTML. `generateStaticParams()` over
  `stocks.json` → one static page per ticker.
- `generateMetadata()` per page: title `Is {Company} ({TICKER}) halal? — Mizan`,
  description with the headline verdict. This is what ranks.
- **JSON-LD structured data** (FAQPage / Product schema) on each page → rich
  Google results.
- `app/sitemap.ts` listing every ticker page; submit to **Google Search Console**
  + **Bing Webmaster Tools**. This is the step most people skip — do it.
- **Internal linking:** each ticker page links to same-sector tickers + the
  relevant methodology page. Builds crawl depth and keeps visitors on-site.

**Then expand the keyword surface (all programmatic):**
- Long-tail variants per ticker: "is X halal under Mufti Taqi", "X shariah
  compliant", "X halal AAOIFI".
- **Comparison pages:** "Mizan vs Zoya", "Mizan vs Musaffa", "best free halal
  screener" — high-intent comparison searches.
- **ETF + crypto pages:** "is SPUS halal", "halal ETFs explained", "is Bitcoin
  halal" — the Reddit threads proved this demand exists.
- **List/sector pages:** "halal tech stocks", "halal dividend stocks", "is the
  S&P 500 halal".
- **Methodology pillar pages:** "What is Mufti Taqi's illiquid-asset rule",
  "AAOIFI vs DJIM screening", "how to purify dividends" — educational SEO that
  ranks *and* builds the trust you need.

**Metric:** indexed pages, Search Console impressions → clicks. Expect 6–12 weeks
to compound; it's slow then sudden.

---

## Engine 2 — Coverage expansion (feeds Engine 1)

Every ticker is a new indexable page, so coverage = search real estate, not just
a product feature. Ibrahim's "more stocks" blocker and your SEO engine are the
same project.

**Build:** run `enrichStocks.ts` (FX bug now fixed) against the full US universe
(Russell 3000-ish) on your FMP key; add a refresh cron. 340 → thousands of
tickers = thousands of SEO pages. Prioritize the most-searched names first.

---

## Engine 3 — Retention loop (build EARLY — it compounds everything)

Traffic without return visits doesn't become users. This is also the exact
signal your validation gate needs, so it does double duty.

**Build:**
- **Optional email capture** (value-first, never a wall): "email me before a
  watchlist stock reports" + "alert me if a holding changes halal status".
- **Verdict-change + earnings alerts** via a cron + email (Resend) or **web push**
  (no email needed). "AAPL reports in 3 days" / "a stock on your watchlist just
  flipped under Mufti Taqi" — these are *reasons to come back*, which is what you
  don't have yet.
- Weekly digest: "halal stock movements this week".

**Metric:** returning-visitor rate (your true north), alert opt-in rate.

---

## Engine 4 — Product-led virality (build sharing into the product)

Make the product spread itself. All buildable.

- **Dynamic share cards:** `@vercel/og` (`ImageResponse`) at
  `app/halal/[ticker]/opengraph-image.tsx` — auto-generate a beautiful verdict
  image (6 scholars, deciding metrics) so when someone shares a link in WhatsApp/
  X/IG it looks designed, not like a bare URL. Shareability is a feature.
- **One-tap "Share this verdict"** → pre-filled message + the share-card + link.
- **Embeddable badge/widget:** "Is this stock halal? [Mizan]" that bloggers,
  newsletters, and community sites can embed → backlinks (which boost Engine 1)
  + distribution into others' audiences.
- **Lightweight referral:** "invite a friend" — track it so you can see sharing
  happen (and it counts toward your gate).

**Metric:** shares per session, embeds/backlinks, referral installs.

---

## Engine 5 — Data-as-marketing (periodic, high-leverage)

You own a dataset nobody else exposes — turn it into shareable content.
- Auto-generated reports: "What % of the S&P 500 is halal under AAOIFI vs Mufti
  Taqi" / "Halal stock of the week". These earn mentions, links, and Reddit/X
  discussion without you pitching.
- **Open data / simple API** later: let others build on your verdicts →
  developer distribution + backlinks.

---

## Sequencing (realistic for solo, part-time)

- **Weeks 1–2:** Engine 1 foundation (`/halal/[ticker]` pages + sitemap + Search
  Console) and Engine 4 share cards. Highest leverage, self-contained.
- **Weeks 3–4:** Engine 2 coverage expansion (more pages) + Engine 1 long-tail
  (methodology, comparison, ETF, crypto pages) + internal linking.
- **Weeks 5–8:** Engine 3 retention loop (alerts/digest) + embeddable widget +
  referral.
- **Ongoing:** Engine 5 data reports; double down on whatever Search Console says
  is ranking.

## What this does NOT replace

- **Retention validation** — confirm people come back before/while you scale.
- **One scholar relationship** — the trust ceiling is the one thing you can't
  ship. Build the engine *and* land the credibility, in parallel.
- **Focus** — resist adding a sixth channel. SEO + product virality + retention
  is the whole game for a builder. Depth, not breadth.
