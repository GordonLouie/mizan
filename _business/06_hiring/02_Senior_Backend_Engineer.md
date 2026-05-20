# Senior Backend Engineer — Mizan  ·  Fully remote

**The role.** Own the data pipeline that powers every screening verdict in Mizan. You'll work directly with the CTO, contribute to architecture decisions, and ship code that millions of religiously-meaningful financial decisions will eventually flow through.

## What you'd ship in your first 90 days

- **Production data pipeline.** Daily ingest from Financial Modeling Prep API → normalize → compute Mizan-defined ratios → cache. Hard-stop on data integrity errors; we don't ship bad ratios.
- **Filing-event listener.** When a company files a 10-K or 10-Q, we recompute affected verdicts within 4 hours and notify affected users.
- **Backend for AI scholar Q&A.** Stateless service in front of Anthropic Claude, with rate limiting, prompt versioning, and audit logging the board can review.
- **Brokerage sync.** Plaid US first; design the abstraction so TrueLayer (UK) and Salt Edge (MENA) can swap in.

## Stack

- TypeScript end-to-end. Node.js (Fastify) + Postgres on Fly.io.
- pg-typed for type-safe queries. Drizzle ORM where we need it.
- BullMQ for background jobs.
- OpenTelemetry tracing through to the LLM layer.

## Who I'm looking for

- 5+ years backend experience, at least 2 of those building data-intensive financial or scientific systems.
- Has owned an ETL pipeline that processed messy real-world data and had to debug it on weekends. Has opinions about idempotency, retries, and dead-letter queues.
- Strong TypeScript. Comfortable in SQL beyond ORM hand-holding.
- Has worked with at least one third-party financial data API (Bloomberg, Refinitiv, FMP, Alpha Vantage, Polygon).
- Cares about correctness. The product owns religious-grade trust; if you ship a bug that produces a wrong verdict, that's bad in a way most fintech bugs aren't.
- Bonus: built or maintained a system involving LLMs in production. Bonus: experience with anything Plaid-shaped.

## Comp

- **$70K base** (remote, location-adjusted; we'll talk if your local market is materially higher).
- **1.5% equity** (4-year vest, 1-year cliff).
- Full remote. Quarterly 1-week team meet-up (HK, then Istanbul, then Karachi rotating).

## Trial

Two-week paid trial at $3K flat. We build one piece of the pipeline together. If we both want to continue, you sign.

## How to apply

90-second Loom answering one technical question (we'll send it after you say hello) + your GitHub. Email jk@mizan.app with the subject "Backend role."
