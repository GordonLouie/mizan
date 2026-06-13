# Mizan — a starter brief for a contributing engineer

*(Gordon: forward the short message below, and send this brief as the attachment.
Swap {Name} for his name.)*

---

## The message to paste

> Hey {Name} — seriously appreciate you offering to help, and you're exactly the
> right kind of help. Mizan's a free halal stock screener I've been building
> (mizaninvesting.com). The honest gap right now isn't the product — people who
> try it like it — it's that nobody *finds* it: almost all traffic comes from me
> manually messaging people. That's a pure engineering problem, and it's where you
> could move the needle more than anyone.
>
> I wrote up a one-pager (attached) with the highest-leverage thing to build plus
> a couple of alternatives. No pressure on scope — even the first one would be a
> big deal. Want to jump on a quick call this week and I'll give you repo access?

---

## What Mizan is (30 seconds)

A free halal stock screener. You type a ticker, it shows whether the stock is
Shariah-compliant under all 6 mainstream scholarly methodologies side-by-side,
with every threshold cited to its primary source. No account, no data collected.
Live at mizaninvesting.com.

**Stack:** Next.js 15 (App Router), React, TypeScript, Tailwind v4. Deployed on
Vercel. All data lives in a single file (`src/data/stocks.json`, ~340 tickers);
the screening logic is pure functions in `src/lib/screen.ts` + `src/lib/scholars.ts`.
No backend/database — it's a static-ish app that reads precomputed JSON.

---

## The #1 task: programmatic "Is {TICKER} halal?" pages (SEO)

**The problem it solves.** Right now the only way people reach Mizan is me DMing
them — analytics show basically zero organic discovery. Our biggest competitor
(Musaffa) wins because when someone googles *"is Tesla halal"*, they land on a
Musaffa page. We have the data and the verdicts to do this better, but our screener
is client-rendered, so Google can't index per-ticker results. Fixing that turns
search into a free, compounding distribution channel.

**What to build.** A server-rendered, statically-generated page per ticker:

- Route like `/halal/[ticker]` (e.g. `/halal/aapl`), generated for all ~340
  tickers via `generateStaticParams()` reading `stocks.json`.
- Server component: run the existing `screenStock()` for each scholar at build
  time and render the verdicts as real HTML (no client fetch), so it's fully
  indexable.
- `generateMetadata()` per page: title `Is {Company} ({TICKER}) halal? — Mizan`,
  a meta description with the headline verdict, OpenGraph image.
- Content on the page: the 6-scholar verdict table, the deciding metric per
  scholar, the cited sources, and a clear CTA into the live `/screen` tool.
- Add a `sitemap.xml` listing every ticker page, and JSON-LD structured data so
  Google can show rich results.

**Acceptance criteria.** `/halal/nvda` (etc.) loads as static HTML with the full
verdict visible in "view source"; every ticker has a page; sitemap submitted in
Google Search Console; pages start getting impressions within a few weeks.

**Why it's a clean fit:** self-contained, reuses logic that already exists, needs
no community/trust context, and directly attacks our single biggest gap.

---

## Two alternatives (if he'd rather)

**A) Coverage expansion + ingestion pipeline.** Every tester says "add more
stocks." There's a working ingestion script (`scripts/enrichStocks.ts` + FMP API)
that pulls fundamentals and computes the ratios; a currency bug in it was just
fixed. The job: run it against the full US universe (Russell 3000-ish), set up a
refresh cron, and grow `stocks.json` from ~340 to thousands. Needs an FMP API key
(I have one). Pure data/infra work.

**B) Retention + share instrumentation.** Two parts: (1) set up proper
returning-visitor / cohort analytics so we can see if people come back (the metric
I most need right now), and (2) build better share mechanics — richer share cards
and a one-tap "share this verdict" flow, so the tool can actually spread. Virality
is an engineering problem too.

---

## Logistics / role

Informal contributor helping on the tech side — no obligations, work on whatever
of the above interests you, at your own pace. I'll give you GitHub access and a
walkthrough of the codebase on a call. If this turns into something bigger we can
talk about what that looks like then; for now it's just two people building
something useful. Repo runs locally with `npm install && npm run dev`.

Thank you, genuinely — free, capable engineering help is the most valuable thing
anyone's offered this project.
