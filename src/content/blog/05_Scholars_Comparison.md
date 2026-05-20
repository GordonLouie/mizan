---
title: "AAOIFI vs Mufti Taqi vs DJIM vs Ja'fari: a side-by-side comparison"
slug: aaoifi-vs-mufti-taqi-vs-djim-vs-jafari
date: 2026-08-01
author: jk
seo_description: "A comprehensive side-by-side comparison of the five major Shariah screening methodologies — AAOIFI, Mufti Taqi Usmani, Dow Jones Islamic Market, Ja'fari, and strict zero-tolerance. With worked examples."
keywords: ["aaoifi vs mufti taqi", "halal screening methodologies", "shariah standards comparison", "djim methodology", "jafari halal investing"]
---

# AAOIFI vs Mufti Taqi vs DJIM vs Ja'fari: a complete comparison

Most Muslim investors have heard of at least one Shariah screening standard. Few have a clear picture of how the major standards differ from each other.

This is the side-by-side comparison I wished existed when I started building Mizan. It covers the five methodologies that matter for English-speaking diaspora investors, with the actual thresholds each one applies, and worked examples showing where they diverge.

## The five methodologies

| Methodology | Tradition | Most relevant audience |
|---|---|---|
| **Strict / zero-tolerance** | Minority view across traditions | Investors who reject any interest exposure |
| **Mufti Taqi Usmani (stricter Hanafi)** | Hanafi, South Asian diaspora | Pakistani / Indian / Bangladeshi diaspora |
| **AAOIFI** | Cross-tradition Sunni standards body | Gulf-region default; many institutional users |
| **Dow Jones Islamic Market (DJIM)** | Western index provider | US/UK index funds and ETFs |
| **Ja'fari (Sistani-aligned)** | Twelver Shia | Iraqi, Lebanese, Bahraini, Iranian diaspora |

## Sector exclusions: what every standard agrees on

All five methodologies exclude companies whose primary business is in any of these sectors:

- Alcohol production or sales
- Gambling / casinos
- Conventional banking, insurance, interest-based lending
- Pork-related products
- Adult entertainment

Where they vary: weapons & defense (most exclude; DJIM is more lenient on dual-use cases), non-halal food processing (typically excluded by Mufti Taqi and Ja'fari but not always by DJIM).

## Financial ratio thresholds, side-by-side

Where the real divergence happens:

| Ratio | Strict | Mufti Taqi | AAOIFI | DJIM | Ja'fari (Sistani-aligned) |
|-------|--------|------------|--------|------|---------------------------|
| Impermissible income / revenue | 0% | ≤ 5% | ≤ 5% | ≤ 5% | ≤ 5% |
| Interest-bearing debt / market cap | 0% | ≤ 30% | ≤ 30% | ≤ 33% | ≤ 33% |
| Cash + securities / market cap | 0% | ≤ 30% | ≤ 30% | ≤ 33% | ≤ 33% |
| Receivables / market cap | — | — | — | ≤ 33% | — |
| **Illiquid assets / total assets** | — | **≥ 20%** | — | — | — |

The single most underappreciated entry in this table is Mufti Taqi Usmani's illiquid-asset floor. It's the most consequential differentiator in mainstream halal investing — and the one that almost no consumer halal-investing app implements.

## Purification differences

Almost as important as the screen itself: what happens after you hold the stock.

**Dividend purification:** All five methodologies require purification of the impermissible-income portion of dividend income, donated to charity without expectation of reward. The math: impure-income-percentage × dividend received = amount to donate.

**Capital gains purification:** Here they split.

- **AAOIFI, DJIM:** Capital gains are NOT purified. Only dividends.
- **Mufti Taqi Usmani, Ja'fari, strict:** BOTH dividends AND capital gains are purified, at the same impure-income rate.

Over a long holding period with meaningful capital gains, this difference is large. A $100K position with a $20K realized gain on a stock with 3% impermissible income owes $0 in capital-gain purification under AAOIFI and $600 under Mufti Taqi.

**Ja'fari adds khums.** Beyond purification, Ja'fari Shia practice includes khums — the obligation to pay one-fifth (20%) of net annual surplus wealth (after expenses) annually. This is a religious obligation, not a screening requirement, but it changes how Ja'fari investors think about realized gains and accumulated wealth.

## Worked examples: same stock, four verdicts

Let's run four stocks through each methodology.

### Amazon (AMZN)

| Methodology | Verdict | Key reason |
|---|---|---|
| Strict | FAIL | Has some interest-bearing debt (any debt fails strict view) |
| Mufti Taqi | FAIL | Illiquid assets (12%) below 20% floor |
| AAOIFI | PASS | All ratios within thresholds |
| DJIM | PASS | All ratios within thresholds |
| Ja'fari | PASS | All ratios within thresholds; khums applies on gains |

### Tesla (TSLA)

| Methodology | Verdict | Key reason |
|---|---|---|
| Strict | FAIL | Has some interest-bearing debt |
| Mufti Taqi | PASS | All ratios within thresholds, including illiquid floor (52%) |
| AAOIFI | PASS | All ratios within thresholds |
| DJIM | PASS | All ratios within thresholds |
| Ja'fari | PASS | All ratios within thresholds; khums applies on gains |

### Apple (AAPL)

| Methodology | Verdict | Key reason |
|---|---|---|
| Strict | FAIL | Has some interest-bearing debt; cash position significant |
| Mufti Taqi | PASS | Illiquid 28%; just above floor |
| AAOIFI | PASS | All ratios within thresholds |
| DJIM | PASS | All ratios within thresholds |
| Ja'fari | PASS | All ratios within thresholds |

### Berkshire Hathaway (BRK.B)

| Methodology | Verdict | Key reason |
|---|---|---|
| All five | FAIL | Sector exclusion (conventional finance / insurance) |

## Which methodology is right?

This is the wrong question. The right question is: **which scholar do you follow?**

Most Muslims grow up in a tradition (Hanafi, Shafi'i, Hanbali, Maliki, Ja'fari) and tend to follow contemporary scholars within that tradition by default. South Asian diaspora overwhelmingly follow Mufti Taqi Usmani or scholars in his lineage. Saudi and Gulf Muslims often follow scholars aligned with AAOIFI's broad approach. Western converts often follow whichever local scholar shaped their understanding. Iraqi, Lebanese, and Iranian Shia follow Ja'fari scholars, with Ayatollah Sistani being the most-followed today.

If you genuinely don't know which scholar you follow, the right answer isn't "default to AAOIFI because the app says so." It's "have a conversation with someone in your community whose religious judgment you trust." That conversation is bigger than any app.

## What this means for product

The mainstream halal-investing apps you've used (Wahed, Zoya, Musaffa, Islamicly) all screen against a single default — typically AAOIFI. They built a defensible product, but they built it for the most-served audience. Everyone outside that audience — the Hanafi diaspora following Mufti Taqi, Ja'fari Shia investors, conservative Hanbalis, anyone who wants a customizable view — has been left to either accept the default or maintain their own spreadsheet.

Mizan exists because we believe that should change. Six profiles ship at launch, plus Custom. Every verdict surfaces the underlying ratios transparently. If you select Mufti Taqi's profile, you see the illiquid-asset floor. If you select Ja'fari, you see the purification scope and khums applicability. If you select Strict, you see exactly why almost nothing passes.

That's not us picking a winner. That's us giving you the right answer for *your* scholar.

---

*[Try Mizan](https://mizan.app). Six scholar profiles plus a Custom builder. Free tier includes screening; paid tiers add portfolio sync and purification automation.*
