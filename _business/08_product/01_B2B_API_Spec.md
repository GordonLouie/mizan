# Mizan Compliance API — design spec  ·  Year 2 product

## What this is

A B2B REST API that lets any fintech embed Mizan's multi-scholar Shariah screening into their own product, without building scholar relationships, methodology infrastructure, or screening logic themselves.

Customers (target): retail brokerages, robo-advisors, neobanks, financial advisor platforms, B2B SaaS tools (e.g., Carta-style cap-table products for Muslim founders).

Positioning: "Stripe for halal screening." A neobank wants a halal-mode toggle? One API call. A robo-advisor wants to filter the universe before recommendation? One API call. A 401(k) provider wants to label funds for Muslim employees? One API call.

## Why this is the Year-2 product (not Year-1)

Three preconditions need to hold before this ships:

1. **Named scholar credibility.** The B2B sales motion is "license our scholar-vetted methodology." This is worthless without recognized scholars on the supervisory board. By year 2, we have signed Mufti Faraz Adam, Sheikh Joe Bradford, and one Ja'fari scholar publicly.

2. **Consumer scale as proof.** B2B customers will ask "how many consumers use Mizan?" An answer of "30K paying" makes the sales conversation easy. An answer of "we're new" makes it impossible.

3. **Engine stability.** The screening engine needs to handle 100x the load of consumer usage, with audit logs for B2B customers' compliance teams. That's a year-1 build that we test on the consumer product first.

---

## Pricing model

Tiered, usage-based.

| Tier | Monthly fee | Included calls | Overage |
|------|-------------|----------------|---------|
| Starter | $99/mo | 10,000 | $0.01/call |
| Growth | $499/mo | 100,000 | $0.005/call |
| Scale | $2,499/mo | 1,000,000 | $0.0025/call |
| Enterprise | Custom | Custom | Custom — includes white-label, SLA, dedicated scholar consult |

Enterprise tier additionally includes:
- A named scholar consultation per quarter for the customer's specific use case.
- Custom screening profile development.
- White-label support (badge swap in compliance reports).
- 99.9% SLA with credit-back.

---

## Authentication

API key in header: `Authorization: Bearer mzn_live_xxxxxxxxxxxx`

Test mode: `mzn_test_xxxxxxxxxxxx`. Same surface, sandboxed dataset.

---

## Endpoints

### `GET /v1/screen/{ticker}`

Returns the compliance verdict for a single ticker, against a specified scholar profile.

**Query parameters:**
- `scholar` (required): one of `aaoifi`, `taqi_usmani`, `djim`, `jafari`, `strict`, or a custom-profile ID
- `as_of` (optional): ISO date. Defaults to latest available filing.
- `verbose` (optional): `true` to include all ratio reasoning; defaults to `false` for compact response.

**Example:**
```
GET /v1/screen/AMZN?scholar=taqi_usmani&verbose=true
Authorization: Bearer mzn_live_xxx
```

**Response (200):**
```json
{
  "ticker": "AMZN",
  "name": "Amazon.com Inc.",
  "scholar": {
    "id": "taqi_usmani",
    "label": "Mufti Taqi Usmani (stricter Hanafi)",
    "methodology_version": "2026.05"
  },
  "verdict": "fail",
  "verdict_reason": "Below illiquid-asset floor required by this scholar.",
  "sector_check": {
    "passes": true,
    "reason": "No prohibited business activities flagged."
  },
  "ratio_checks": [
    {
      "label": "Impermissible income / revenue",
      "value": 2.8,
      "threshold": 5.0,
      "direction": "max",
      "passes": true,
      "unit": "percent"
    },
    {
      "label": "Interest-bearing debt / market cap",
      "value": 6.5,
      "threshold": 30.0,
      "direction": "max",
      "passes": true,
      "unit": "percent"
    },
    {
      "label": "Cash + interest-bearing securities / market cap",
      "value": 4.2,
      "threshold": 30.0,
      "direction": "max",
      "passes": true,
      "unit": "percent"
    },
    {
      "label": "Illiquid (tangible) assets / total assets",
      "value": 12.0,
      "threshold": 20.0,
      "direction": "min",
      "passes": false,
      "unit": "percent"
    }
  ],
  "purification": {
    "scope": "dividends_and_gains",
    "rate": 2.8,
    "rate_unit": "percent_of_income"
  },
  "as_of": "2026-04-30",
  "data_source": "FMP / SEC 10-Q",
  "computed_at": "2026-05-18T08:31:12Z"
}
```

### `POST /v1/screen/portfolio`

Screens an entire portfolio in one call.

**Body:**
```json
{
  "scholar": "taqi_usmani",
  "holdings": [
    { "ticker": "AAPL", "weight": 0.15 },
    { "ticker": "AMZN", "weight": 0.10 },
    { "ticker": "JPM", "weight": 0.05 }
  ]
}
```

**Response:** Summary statistics + per-holding ratio breakdown. Same per-ticker structure as `/screen/{ticker}`.

### `GET /v1/scholars`

List all available scholar profiles.

**Response:**
```json
{
  "scholars": [
    {
      "id": "aaoifi",
      "label": "AAOIFI Standard",
      "blurb": "...",
      "methodology_url": "https://mizan.app/methodology/aaoifi",
      "thresholds": {
        "max_impermissible_income_pct": 5,
        "max_debt_to_market_cap_pct": 30,
        "max_cash_securities_pct": 30,
        "min_illiquid_assets_pct": null
      },
      "supervised_by": ["Mizan Shariah Supervisory Board"]
    },
    ...
  ]
}
```

### `POST /v1/scholars/custom`

Create a customer-specific custom scholar profile. Returns an ID usable in subsequent `/screen` calls.

**Body:**
```json
{
  "name": "ACME Custom Standard",
  "thresholds": {
    "max_impermissible_income_pct": 4,
    "max_debt_to_market_cap_pct": 25,
    "max_cash_securities_pct": 25,
    "max_receivables_pct": 33,
    "min_illiquid_assets_pct": 25
  },
  "excluded_sectors": ["alcohol", "gambling", "tobacco", "conventional_finance", "weapons", "pork", "adult_entertainment"],
  "purification_scope": "dividends_and_gains"
}
```

### `GET /v1/purification`

Calculate purification owed on a position.

**Query parameters:**
- `ticker` (required)
- `scholar` (required)
- `position_value_usd` (required)
- `realized_gain_usd` (optional, defaults to 0)

**Response:**
```json
{
  "ticker": "AAPL",
  "scholar": "taqi_usmani",
  "annual_dividend_usd": 500.00,
  "impure_dividend_usd": 7.00,
  "impure_gain_usd": 280.00,
  "total_purification_usd": 287.00,
  "scope": "dividends_and_gains"
}
```

### `GET /v1/methodology/{scholar}`

Returns the full published methodology document for a scholar profile. Used by customers to expose "Methodology" pages in their products.

### `POST /v1/ask`

AI scholar Q&A endpoint. Bounded scope per scholar profile, citation-first response.

**Body:**
```json
{
  "scholar": "taqi_usmani",
  "question": "Is staking ETH considered riba?",
  "context": "user_is_individual_investor"
}
```

**Response:**
```json
{
  "answer": "Under Mufti Taqi Usmani's published rulings, returns from ETH staking are likely considered riba because...",
  "citations": [
    {
      "scholar": "Mufti Taqi Usmani",
      "source": "An Introduction to Islamic Finance (2002), Chapter 7",
      "page": "112-114"
    }
  ],
  "scope_note": "This response addresses general application of cited rulings; it is not individual investment advice.",
  "out_of_scope": false
}
```

---

## Rate limits

| Tier | Rate limit |
|------|------------|
| Starter | 100 req/minute |
| Growth | 500 req/minute |
| Scale | 2,000 req/minute |
| Enterprise | Custom |

Limits enforced via 429 responses with `Retry-After` header.

---

## Data freshness

| Data type | Refresh cadence |
|-----------|-----------------|
| Stock fundamentals | Daily (post-market close) |
| Filing-triggered re-screens | Within 4 hours of filing |
| Methodology updates | Within 24 hours of scholar publication |

---

## SDKs

Year-2 launch: official SDKs for TypeScript/Node, Python, Ruby, Go.

Each SDK is a thin wrapper with idiomatic types + retries + telemetry.

---

## Security & compliance

- All endpoints HTTPS only. TLS 1.3 minimum.
- API keys rotatable from the dashboard. Audit log of every call.
- SOC 2 Type 2 by end of Y3.
- GDPR / PDPO / CCPA compliant.
- Data residency: customer can opt for EU-resident inference (Anthropic EU endpoint).

---

## Launch plan

| Month | Milestone |
|-------|-----------|
| Y2 M1 | Internal alpha. Consumer product traffic shadow-mirrored to API. |
| Y2 M3 | Closed beta with 3-5 hand-picked partners (likely Wealthsimple, Hejaz, smaller regional brokers). |
| Y2 M6 | Public launch at Money 20/20 USA or Singapore FinTech Festival. |
| Y2 M9 | First Enterprise contract. Target ACV: $50K-$100K. |
| Y3 EOY | $1M ARR from API alone. 50 active customers. |

---

## Open design questions for the engineering team

1. Caching strategy for `/screen/{ticker}` — most requests will be the same handful of tickers. Cloudflare Worker cache + invalidation on filing events?
2. Custom-profile abuse — what prevents a customer from creating "100% interest income, 100% debt is fine" as a custom profile and labeling it halal? Answer: profiles are customer-named only; we don't endorse them; ToS forbids passing them off as Mizan-approved.
3. Latency for `/v1/ask` — Claude API has variable latency. Do we cache common Q&A? Pre-compute the top 100? Open.
4. Multi-currency display. International tickers (Toronto, London, KSE, BSE) — how do we normalize ratios in non-USD? Inherit from underlying currency.
