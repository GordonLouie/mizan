# Mizan data audit — 2026-06-09 (Day 11)

Full audit of `src/data/stocks.json` (342 tickers). Triaged the items flagged
in the project-state file, found the real root cause behind the "implausible
ratios," fixed it, and mapped the remaining data debt.

---

## TL;DR

- **Mega-cap market caps are CORRECT, not wrong.** The worry that GOOGL/AAPL
  read ~$4.5T was based on stale late-2025 figures. As of June 2026 those are
  real: Nvidia ~$5.2T, Apple ~$4.5T, Alphabet ~$4.5T (Alphabet crossed $4T in
  Jan 2026), Microsoft ~$3.1T. No correction needed. *(verified via web)*
- **The "11 implausible ratios" were a single systemic bug:** foreign-listed
  companies had their balance sheets ingested in **local currency** (JPY, INR,
  CNY, EUR, TWD, DKK) but tagged `currency: "USD"`, then the debt/cash/
  receivables-to-market-cap ratios were computed by dividing a local-currency
  numerator by a USD market cap. Result: Toyota showed **debt = 18,793% of
  market cap**, Honda 39,078%, etc.
- **Fixed 21 tickers** by FX-normalizing their balance sheets to USD and
  recomputing the three ratios. Post-fix total assets validate against publicly
  known values (Toyota $661B, Wipro $14.8B, TSMC $274B, etc.).
- **The fix corrected verdicts, not just display:** Sony, Wipro, Dr Reddy's,
  TSMC, Novo Nordisk, Baidu were *wrongly failing all scholars* and now pass
  the standards they should.
- **Still open (needs your call):** ~11 delisted/renamed tickers, 22 ETFs/
  foreign names with no balance sheet, and 12 pre-existing engine-test failures.

---

## 1. Market-cap verification (the original worry) — CLEAR

| Ticker | Stored cap | Real (June 2026) | Verdict |
|---|---|---|---|
| NVDA | $4.97T | ~$5.2–5.4T | OK (if anything slightly low) |
| AAPL | $4.51T | ~$4.5T | Correct |
| GOOGL | $4.46T | ~$4.2–4.6T | Correct |
| MSFT | $3.10T | ~$3.1–3.3T | Correct |
| AMZN | $2.65T | ~$2.8T | OK (slightly low) |

The late-2025 mental model ("GOOGL ~$2T") was simply out of date. Nothing to fix here.

## 2. The currency bug (root cause) — FIXED

Every foreign balance sheet was stored with `currency: "USD"` while the numbers
were clearly local currency (Toyota "revenue" of $51 *trillion* is ¥51T). The
income ratio is currency-independent (numerator and denominator both local) so
it was fine — only the three market-cap ratios were corrupted.

**Fix applied** (`scripts/fix_fx_currency.py`, fully reversible via git):
convert every monetary balance-sheet field local→USD millions at documented
June-2026 FX rates, recompute debt/cash/receivables ratios, record the original
`reportingCurrency` + `fxRateToUsd` on each balance sheet for transparency.

FX rates used: JPY 160.24, INR 95.65, CNY 6.78, EUR 0.87, TWD 31.59, DKK 6.49.

**21 tickers corrected:**

| Currency | Tickers |
|---|---|
| JPY | TM, SONY, MUFG, SMFG, HMC |
| INR | HDB, IBN, WIT, RDY |
| CNY | BABA, JD, PDD, BIDU, NTES, NIO, LI, XPEV, TCEHY |
| EUR | STLA |
| TWD | TSM |
| DKK | NVO |

Example before→after (debt % of market cap): Toyota 18,793%→117%, Honda
39,078%→244%, Sony 1,301%→5.5%, TSMC 49%→1.6% (was TWD), Novo 69%→12% (was DKK).

**Verdict corrections** (these now pass where they wrongly failed): Sony,
Wipro, Dr Reddy's, TSMC, Novo Nordisk, Baidu, NetEase across the standards
they qualify for. Genuinely-leveraged names (Toyota, Honda, the banks) still
fail correctly.

**Note on history:** the 8-quarter `verdictHistory` for these 21 tickers was
computed from the corrupted ratios and can't be reliably rebuilt without
period-matched historical balance sheets + FX. Rather than show contradictory
numbers, I cleared it for those tickers — the UI falls back to its honest
"Historical tracking being ingested" state, while the live verdict is computed
fresh from the corrected ratios. Re-ingesting clean history for these is a
pipeline task.

## 3. Remaining high ratios are LEGITIMATE (no action)

After the fix, every ratio still above ~100% is either a sector-excluded
financial (banks genuinely hold securities books many times their market cap —
verdict is `fail` on sector regardless) or a genuinely high-debt USD company
(DISH 1,690%, Charter 521%, MGM, AAL, Carnival, most utilities/energy MLPs/
REITs). These fail the debt screen correctly.

## 4. Delisted / renamed tickers — NEEDS YOUR CALL

These appear acquired, delisted, or re-tickered (based on events through
2024–2025; please confirm before acting). Showing dead tickers dents
credibility; removing them slightly cuts coverage. Recommend remove or remap:

| Ticker | Status |
|---|---|
| ATVI | Activision Blizzard — acquired by Microsoft (2023), delisted |
| TWTR | Twitter — taken private (2022), now X |
| PXD | Pioneer Natural Resources — acquired by ExxonMobil (2024) |
| ANTM | Anthem — renamed Elevance Health, ticker ELV |
| SQ | Block — re-tickered to XYZ (2025) |
| HES | Hess — acquired by Chevron |
| X | U.S. Steel — acquired by Nippon Steel |
| DISH | DISH Network — merged into EchoStar (SATS) |
| FISV | Fiserv — re-tickered to FI (2024) |
| ANSS | Ansys — acquired by Synopsys |
| PARA | Paramount — merged with Skydance |

Also: **7203.T and TM are both Toyota** (Tokyo + ADR); **9984.T** (SoftBank)
and several `.T`/`.SR`/`.HK` listings have no balance sheet at all (see §5).

## 5. Missing data (by category)

22 tickers have no balance sheet / verdict history, and 33 have no next-earnings
date. They fall into clean buckets:

- **ETFs** (SPY, QQQ, SPUS, HLAL, SPSK, SPRE, UMMA) — these shouldn't be
  screened like single stocks at all; they need separate handling or removal.
- **Foreign primary listings** (2222.SR Aramco, NOVO-B.CO, MC.PA, NESN.SW,
  SAP.DE, 0700.HK Tencent-HK, 7203.T, 6758.T, 9988.HK, 9984.T, MBG.DE, the
  .SR Saudi names) — many duplicate an ADR already in the set.
- **Delisted** (the §4 list) — overlaps the missing-earnings set.

## 6. Pre-existing engine-test failures (not caused by this fix)

`npm run test:engine` shows **12 failing assertions** that were already failing
before this work (verified against the pre-fix file): JPM and BUD verdict-shape
checks, the AMZN/META "fails Mufti Taqi on illiquid floor" headline-demo
assertions. The currency fix resolved the TSM failure and introduced none.
Worth a separate session — the headline AMZN demo failing is notable since
it's the landing-page example.

## Recommended next steps

1. **Push the currency fix** (this audit's main deliverable) — review the diff,
   commit.
2. Decide on the §4 delisted tickers (remove vs remap) — quick win for trust.
3. Give ETFs their own handling or drop them from the stock screener.
4. Fix the headline AMZN/META engine-test failures (landing-page credibility).
5. Bigger project: re-ingest foreign history with FX-aware pipeline, and the
   coverage expansion Ibrahim asked for (this audit shows the pipeline needs a
   per-currency normalization step regardless).

---

## Addendum — same-day follow-up (logos, pipeline, coverage)

**Logos (the "still loading" problem).** Every logo was fetched live from
Clearbit, whose free API has degraded — that's why most logos showed gray
monogram placeholders and the marquee had blank tiles. Fixed two ways:
`CompanyLogo` now tries a self-hosted `/logos/<TICKER>.png` first (instant, from
your own CDN) and only falls back to the network cascade for tickers not yet
downloaded. Run `node scripts/fetch_logos.mjs` locally to populate
`public/logos/` with HD logos (512px Clearbit / FMP), then commit them. Re-run
any time to refresh.

**Pipeline root-cause fix.** The currency bug wasn't just in the data — it was
in `fmpFetch.ts`, which hardcoded `currency: "USD"` and divided local-currency
balance sheets by USD market cap. Fixed all three ratio paths
(`fetchStockFundamentals`, `fetchBalanceSheetDetails`, the verdict-history
builder) to read FMP's `reportedCurrency` and convert to USD via a documented
`FX_PER_USD` table before computing ratios. **This means any future ingestion —
including a full US-universe expansion — will be correct.** Refresh the FX table
before big runs.

**Delisted tickers.** Removed ATVI (acquired by Microsoft, 2023) and TWTR (taken
private, 2022) — both confirmed delisted. The other suspects (PXD, ANSS, HES,
ANTM, SQ, FISV, DISH, PARA, X) couldn't be confirmed via search and weren't
hard-deleted; the re-ingestion run resolves them automatically since FMP returns
no current data for dead symbols. Universe now 340.

**Coverage / "US only?"** You are NOT US-only — the universe includes major
international names (Toyota, Sony, Alibaba, TSMC, Novo, etc., now FX-correct), so
a hard "US stocks only" label would be inaccurate. The /screen empty state
already sets honest expectations ("covers N tickers today, expanding weekly
toward the full Russell 3000 + major international names"). The real path to "all
US stocks" is an ingestion run on your FMP key — see the handoff notes.

**Current data status (340 tickers):** no absurd ratios remain except DISH
(genuinely USD, tiny-cap + huge debt — real, fails correctly). 22 without a
balance sheet are all ETFs (SPY/QQQ/SPUS…) and foreign primary listings that
duplicate an ADR already covered — inherent, not data errors. ETFs arguably
shouldn't run through a single-company screen at all (a separate decision).
