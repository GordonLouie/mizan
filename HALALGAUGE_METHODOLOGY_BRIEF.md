# HalalGauge — Methodology Brief
*A one-page overview of how HalalGauge screens equities. Prepared for scholarly review.*

## What it is
HalalGauge is a halal stock screener that lets a user choose **which scholarly standard** to screen under, and shows the **cited reasoning** behind every verdict — no black-box score. The screening logic is deterministic: the same inputs always produce the same verdict, and every threshold traces to a published primary source.

## Standards implemented (verbatim from published methodologies)

| Standard | Tradition / source | Primary reference |
|---|---|---|
| **AAOIFI** | Mainstream global standard, used by most Islamic banks | AAOIFI Shariah Standard No. 21 (Financial Papers — Shares & Bonds) |
| **Mufti Taqi Usmani** | Stricter (Hanafi/Deobandi) — adds the illiquid-asset rule | Mufti Taqi Usmani's published equity-screening rulings |
| **Dow Jones Islamic Market (DJIM)** | Widely-used index standard; most lenient thresholds | S&P Dow Jones Islamic Market Indices — Index Methodology |
| **Ja'fari (Sistani-aligned)** | Shia methodology | Ayatollah Sistani — Code of Practice (sistani.org) |
| **Strict / zero-tolerance** | Minority view: any riba exposure impermissible | Minority scholars holding zero-tolerance on riba |
| **Custom** | User sets their own thresholds | User-defined |

## How the thresholds differ

| Standard | Impermissible income | Debt / mkt cap | Cash + securities | Receivables | Illiquid-asset floor | Purification |
|---|---|---|---|---|---|---|
| AAOIFI | ≤ 5% | ≤ 30% | ≤ 30% | — | — | Dividends |
| Mufti Taqi | ≤ 5% | ≤ 30% | ≤ 30% | — | ≥ 20% | Dividends + gains |
| DJIM | ≤ 5% | ≤ 33% | ≤ 33% | ≤ 33% | — | Dividends |
| Ja'fari | ≤ 5% | ≤ 33% | ≤ 33% | — | — | Dividends + gains (khums on net annual surplus) |
| Strict | 0% | 0% | 0% | — | — | Dividends + gains |

*All standards also apply sector exclusions (alcohol, gambling, tobacco, conventional finance, weapons, pork, adult entertainment, and — for most — non-halal food).*

## Two-step screen
1. **Sector / business check** — is the company's core business impermissible?
2. **Financial ratio check** — debt, interest-bearing cash & securities, impermissible income share (and, where the standard requires, receivables and the illiquid-asset floor), each measured against that standard's threshold and traced to the source.

Stocks that pass but sit close to a limit are flagged ("borderline" / drift), and the tool estimates **purification** (the impermissible slice of income to give to charity) per the standard's scope.

## What we are *not* claiming
- These are **contemporary screening standards, not schools of fiqh** (madhhabs). We do not equate, e.g., "Hanafi" with one standard.
- HalalGauge provides **information, not a fatwa**, and is not a substitute for a qualified scholar on a user's specific situation.
- We do not yet have formal scholarly oversight — establishing it is the explicit purpose of this review.

## Open questions for scholarly input
1. Is presenting five standards **side by side** sound, or does it risk implying false equivalence?
2. How should users be guided to a standard **without misrepresenting** the standard-vs-madhhab distinction?
3. Is treating **khums (20% on net annual surplus)** as the Ja'fari purification mechanism a defensible simplification?
4. Is offering a **"zero-tolerance"** screen (which fails almost all equities) responsible, or misleading?
5. What is the **credible path** to scholarly endorsement — a named advisor, a review board, certification?
