# Mizan

**Halal investing, calibrated to your conscience.**

This is the working prototype + complete business operating set for Mizan, the first stock screener that adapts to the user's scholar.

**Start here:** open [START_HERE.md](./START_HERE.md). It tells you exactly what to do, in order.

## Quick start (run the app)

```bash
npm install
npm run dev
```

Open http://localhost:3000. Suggested first stops:
- `/screen?ticker=AMZN` — the 60-second investor demo
- `/universe` — browse all 163 tickers, filter by sector and verdict
- `/ask` — try "Is staking ETH halal?" or "Is my 401(k) halal?"
- `/custom` — build your own scholar profile with live preview

## What's running locally

- **15 pages** including Screen, Universe (browse + filter), Portfolio, Purification, Ask (49-question Q&A), Custom profile builder, Compare, Methodology, About, Roadmap, Help, Contact, Terms, Privacy
- **163 tickers** across US large/mid cap, international (UK, EU, Japan, KSA, HK), ETFs, REITs
- **6 scholar profiles** + editable Custom with localStorage persistence
- **49-question seeded AI Q&A** with keyword-matched search
- **PWA-installable** via manifest.webmanifest
- **SEO-ready** with sitemap.ts, robots.txt, full OG meta tags
- **39 passing engine tests** (run via `npm run test:engine`; fallback `npm run test:engine:compiled` if tsx fails)

## Project layout

- `src/` — Next.js 15 app source
- `public/` — logos, favicon, manifest, robots.txt
- `_business/` — every non-code deliverable across 12 categories. See [START_HERE.md](./START_HERE.md).

## Stray test files

`test.txt`, `test2.txt`, `test3.txt` are sandbox artifacts. Safe to `rm`.

```bash
rm test*.txt
```
