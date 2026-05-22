# HKSTP / Cyberport application answers — copy-paste ready

These answers work for HKSTP Ideation Programme, HKSTP Incubation Programme, and Cyberport CIP applications. Most ask the same questions.

---

## Background fields

| Field | Answer |
|---|---|
| Country of Origin | Hong Kong |
| Company Name (English) | Mizan Operations (HK) Limited (or "Mizan" pre-incorporation) |
| Company Name (Chinese) | Leave blank or 米贊 |
| Business Registration No. | (after incorporation) |
| Subsidiary of parent company | Yes — Mizan Holdings Ltd (Cayman Islands) |
| Date of Establishment | (after incorporation) |
| Financial Year End | 31 March |
| Current Office Address | (residential HK address for now) |
| Company Website | mizanhq.com (or current Vercel URL) |
| License of Technology | No |
| Awards / Patents / Trademarks | None filed yet |

---

## Nature of Business

Software-as-a-Service for halal investment research. Mizan is a stock screening platform that adapts to the user's chosen Islamic scholar's methodology — the first product to support multiple scholarly standards in a single screening engine. Adjacent tools include a zakat calculator, a portfolio compliance scorer, and an AI scholar Q&A system supervised by a Shariah Supervisory Board.

---

## Product / Service to be Developed

Mizan is a web and mobile application that lets Muslim investors:

(1) Screen any publicly-listed stock against six scholarly methodologies — AAOIFI, Mufti Taqi Usmani, Dow Jones Islamic Market, Ja'fari (Sistani-aligned), strict zero-tolerance, and a customizable Custom profile.

(2) Score their portfolio under their chosen scholar, with weighted compliance percentage and per-holding verdicts.

(3) Calculate annual zakat and dividend / capital-gain purification owed.

(4) Ask common halal-finance questions through a Shariah-supervised AI scholar Q&A grounded in scholar-vetted reasoning.

The core differentiator is multi-scholar architecture — every verdict is computed against the user's selected methodology, with transparent ratio reasoning shown. A working prototype is currently deployed on Vercel covering 163 representative tickers and 49 seeded scholarly Q&A entries; production roadmap includes live financial data ingestion (Financial Modeling Prep, graduating to Refinitiv), brokerage portfolio sync (Plaid), and a B2B compliance API for fintechs adding halal-mode functionality.

---

## Innovativeness / Challenge

### i. Unique features

Mizan is the first halal-investing product with native multi-scholar architecture rather than a toggle on top of a single AAOIFI engine. Specifically: it implements Mufti Taqi Usmani's published illiquid-asset rule (≥20% of total assets must be tangible) — a requirement not implemented in any other major halal-investing app despite being foundational to South Asian Hanafi screening since the 1980s. Every verdict surfaces the underlying financial ratio math rather than a black-box score, and the AI scholar Q&A uses Anthropic Claude with bounded, board-reviewed system prompts and citation-first answers.

### ii. Advantages over existing or complementary products

Direct competitors Wahed Invest, Zoya, Musaffa, Islamicly, Amana Funds all screen against a single AAOIFI default. Mizan serves the substantial population of Muslims who follow other scholars — particularly the ~5 million Hanafi-leaning Western diaspora investors who follow Mufti Taqi Usmani, the 200M+ South Asian Hanafi audience reachable via geographic expansion, and Ja'fari Shia investors served by no existing app. Educational integration (a public learn page with diagrams, an inline glossary, primary-source methodology citations) makes Mizan accessible to first-time Muslim investors, not just finance-literate users.

### iii. Foreseeable technical challenges

(a) Live financial data ingestion at scale — planned via Financial Modeling Prep API in Year 1, graduating to Refinitiv Tick History at >50K MAU.

(b) Maintaining methodology integrity as scholarly views evolve — mitigated by a Shariah Supervisory Board reviewing every methodology release with quarterly cadence.

(c) AI scholar Q&A scope control to prevent hallucination — mitigated by bounded Claude system prompts published openly, with quarterly sample audits by the board secretary.

(d) International stock coverage with multi-currency normalization, planned for Year 2.

---

## Business Viability

### i. Target market

Global Islamic finance assets reached USD 5.2 trillion in 2025, growing at 11-15% annually. The Islamic fintech segment is projected at USD 341 billion by 2029 (DinarStandard / Economy Middle East). Mizan's initial beachhead is the ~5 million Western diaspora Muslim investors (US/UK/Canada) currently underserved by AAOIFI-only screening apps, expanding to the 200M+ Muslim investor universe globally.

### ii. Target customers (paying) and end-users

Paying customers and end-users are the same: individual Muslim investors aged 25-45 with existing brokerage accounts (Robinhood, Fidelity, Schwab, etc.) and household incomes above local median. Secondary B2B segment from Year 2: retail brokerages, robo-advisors, and 401(k) providers integrating Mizan's compliance API to offer "halal mode" to their existing customers.

### iii. Potential market size and target share

Initial addressable: ~500K immediately-reachable paying-eligible users in the Western Hanafi diaspora segment. Year 2 target: 30K paying users (~6% segment share). Year 3 target: 90K paying users globally (~USD 10M ARR), 50% from consumer subscriptions and 50% from B2B compliance API contracts.

### iv. Pricing and sales strategy

Consumer tiers: Free (5 screens/day, AAOIFI default) · Plus USD 7.99/mo (unlimited, all scholars, AI Q&A) · Pro USD 14.99/mo (adds portfolio sync, purification automation, filing alerts) · Family USD 19.99/mo (4 seats) · Masjid USD 4.99/seat (min 10).

B2B API tiers: Starter USD 99/mo (10K calls) through Enterprise (custom, white-label, dedicated scholar consult).

Acquisition channels: founder content engine (YouTube, X, podcast tour) for first 5K users; masjid partnerships in NYC/NJ/Chicago/Houston/Toronto/London for next 5K; programmatic SEO targeting "is X halal" queries for organic compounding; Meta/TikTok paid acquisition against Muslim affinity audiences for scale; B2B partnerships with brokerages year 2.

---

## Why Hong Kong (often asked by HK programmes)

- Hong Kong is the only major financial centre with an active mandate to promote Islamic finance via the HKMA, positioning Mizan to access institutional Islamic-finance distribution unavailable to US/UK competitors.
- Direct flight connectivity to MENA (Dubai, Riyadh), Southeast Asia (Jakarta, Kuala Lumpur), and South Asia (Karachi) — all of Mizan's geographic expansion markets.
- ~300,000 Muslims in Hong Kong including an established Pakistani-origin business community, providing an immediate angel investor pool and beta user base.
- HK's territorial tax system allows SaaS revenue earned outside HK to qualify for offshore profits exemption — material for a globally-positioned product.
- Cayman holdco + HK operating subsidiary structure provides regulatory clarity and VC-friendliness while accessing HK-specific government support programmes (Cyberport, HKSTP).

---

## Use of Funds

If asked how the grant would be deployed:

- 40% — Senior engineering hire (one full-time backend engineer for 12 months) to build the live financial data pipeline.
- 25% — Data subscription costs (Financial Modeling Prep enterprise tier, eventually Refinitiv POC).
- 15% — Legal and structuring (Cayman SAFE templates, HK employment templates, Shariah Supervisory Board engagement documentation).
- 10% — Shariah Supervisory Board cash retainers.
- 10% — Workstations, infrastructure, and HKSTP/Cyberport campus tenancy.

---

## Founder Background

(Fill in your specifics — replace bracketed bits)

Gordon Louie, founder and CEO of Mizan. [Brief education and prior work history — 2-3 sentences]. Based in Hong Kong. Began building Mizan after observing that Muslim friends and family using halal-investing apps were receiving the same one-standard verdict despite following different scholars. The thesis — that scholarly diversity is a feature, not a bug — drove the founding of Mizan in 2026.

---

## Milestones (12-month plan)

- Months 1-3: HK incorporation complete, Shariah Supervisory Board chair signed publicly, first three engineering hires, alpha product released to 100 hand-picked testers.
- Months 4-6: Public beta launch, paid subscription tiers go live, 1,000 paying users.
- Months 7-9: UK and Canada geographic expansion, 5,000 paying users.
- Months 10-12: $400K ARR exit run-rate, seed-round materials complete, pre-pitch conversations with 12 named VC funds.
