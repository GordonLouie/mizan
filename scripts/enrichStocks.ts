/**
 * Run-once data enrichment script.
 *
 * Reads SEED_TICKERS (below), fetches FMP fundamentals for each,
 * computes Mizan's screening ratios, writes src/data/stocks.json.
 *
 * Usage:
 *   1. Put your FMP API key in .env.local as FMP_API_KEY=xxx
 *   2. npm install -D tsx dotenv     (one-time)
 *   3. npx tsx --env-file=.env.local scripts/enrichStocks.ts
 *
 * Burns ~4 FMP requests per ticker on Free tier.
 * Burns ~10 FMP requests per ticker on Premium tier (when PREMIUM_FEATURES
 * is true): adds full balance sheet line items, next earnings date, and
 * 8-quarter verdict history. Premium's 750/min rate limit handles this
 * easily — 65 tickers ≈ 650 requests in 1 minute window.
 *
 * The script saves progress after each batch and is safely resumable.
 */

import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import {
  fetchStockFundamentals,
  fetchBalanceSheetDetails,
  fetchNextEarningsDate,
  fetchVerdictHistory,
} from "../src/lib/fmpFetch";
import { SCHOLAR_PROFILES } from "../src/lib/scholars";
import type { StockFundamentals } from "../src/lib/types";

/**
 * Premium feature toggle. When true, the script fetches additional data
 * (full balance sheet line items, earnings calendar, 8-quarter verdict
 * history) for each ticker — requires FMP Premium tier or higher.
 *
 * When false, fetches only the basic aggregate ratios (Free tier works).
 */
const PREMIUM_FEATURES = process.env.MIZAN_PREMIUM === "true" || true;

// ─── CONFIGURATION ─────────────────────────────────────────────────────────

const OUTPUT_PATH = join(process.cwd(), "src", "data", "stocks.json");
const PROGRESS_PATH = join(process.cwd(), ".enrich-progress.json");

// Throttle: how many concurrent requests, and pause between batches (ms).
// FMP free tier ≈ 250 req/day. We're polite — 5 concurrent, 1s between batches.
const CONCURRENCY = 5;
const BATCH_DELAY_MS = 1000;

// ─── SEED TICKER LIST ──────────────────────────────────────────────────────
// Curated list of the ~500 most-traded tickers a Muslim investor is likely to
// search for. Grouped by region. Add/remove as needed.

const SEED_TICKERS: string[] = [
  // ═══════════════════════════════════════════════════════════════════════
  // EXPANDED LIST — Day 9 (Saturday). Target: S&P 500 mainstays + popular
  // Muslim-investor names + international ADRs + halal ETFs. ~300 tickers.
  // Direct response to Ibrahim + Saifuddin's "more stocks" feedback.
  // ═══════════════════════════════════════════════════════════════════════

  // ── Mega-caps (top home-page chips, /vs pairs, /discover refs) ──
  "AAPL", "MSFT", "GOOGL", "GOOG", "AMZN", "NVDA", "META", "TSLA", "BRK.B", "V", "MA",
  "JPM", "BAC", "WFC", "C", "GS", "MS", "BLK", "AXP", "USB", "PNC",
  "LLY", "UNH", "JNJ", "PFE", "MRK", "ABBV", "AVGO", "TMO", "ABT", "DHR", "BMY",
  "AMGN", "GILD", "CVS", "CI", "ELV", "HUM", "MDT", "ISRG", "REGN", "VRTX", "BIIB",
  "ZTS", "BSX", "EW", "SYK", "BDX", "MCK", "COR", "CAH", "HCA", "ANTM",

  // ── Consumer discretionary + staples ──
  "WMT", "PG", "KO", "PEP", "COST", "HD", "MCD", "SBUX", "DIS", "NKE",
  "LOW", "TGT", "DG", "DLTR", "KR", "TJX", "ROST", "BBY", "AZO", "ORLY",
  "F", "GM", "RIVN", "LCID", "STLA", "TM", "HMC", "MBG.DE",
  "BKNG", "ABNB", "MAR", "HLT", "MGM", "CCL", "RCL", "NCLH", "UAL", "DAL", "LUV", "AAL",
  "PM", "MO", "BTI", "STZ", "DEO", "BUD", "TAP",  // not all halal — let user see
  "EL", "CL", "KMB", "CHD", "CLX", "ULTA", "LULU", "DECK", "RL", "VFC", "PVH",
  "YUM", "CMG", "DPZ", "QSR", "WEN", "DRI", "BLMN",
  "MNST", "KDP", "KHC", "GIS", "K", "CPB", "CAG", "HSY", "MDLZ", "SJM",

  // ── Communications + Media ──
  "T", "VZ", "TMUS", "CMCSA", "CHTR", "DISH", "WBD", "PARA",
  "NFLX", "ROKU", "SPOT", "EA", "TTWO", "ATVI", "RBLX", "U",
  "SNAP", "PINS", "TWTR", "RDDT", "MTCH",

  // ── Tech extended ──
  "CSCO", "INTC", "IBM", "TXN", "QCOM", "AMD", "TSM", "ASML", "ARM",
  "ORCL", "CRM", "ADBE", "INTU", "NOW", "SHOP", "SQ", "PYPL", "FIS", "FISV",
  "PANW", "CRWD", "ZS", "NET", "FTNT", "OKTA", "DDOG", "MDB", "SNOW", "PLTR",
  "WDAY", "ADSK", "ANSS", "CDNS", "SNPS", "KLAC", "LRCX", "AMAT", "MU", "NXPI",
  "TEAM", "ZM", "DOCU", "TWLO", "BILL", "ESTC", "GTLB", "PATH", "S",
  "UBER", "LYFT", "DASH",

  // ── Energy ──
  "XOM", "CVX", "COP", "EOG", "PSX", "MPC", "VLO", "PXD", "OXY", "HES", "WMB",
  "KMI", "OKE", "EPD", "ET", "MPLX", "BKR", "HAL", "SLB", "FANG", "DVN",

  // ── Industrials + materials ──
  "UPS", "FDX", "UNP", "CSX", "NSC", "ODFL", "JBHT", "EXPD", "CHRW",
  "HON", "GE", "RTX", "LMT", "BA", "NOC", "GD", "LHX", "TDG", "HII",
  "CAT", "DE", "EMR", "ETN", "PH", "ROK", "IR", "DOV", "ITW", "FAST",
  "PLD", "NEM", "FCX", "LIN", "APD", "ECL", "SHW", "DD", "DOW",
  "GFS", "STLD", "NUE", "AA", "X",

  // ── Real estate + utilities ──
  "PLD", "AMT", "EQIX", "CCI", "PSA", "O", "WELL", "DLR", "SBAC", "AVB", "EQR",
  "NEE", "DUK", "SO", "AEP", "EXC", "XEL", "SRE", "WEC", "ED", "PEG",

  // ── ETFs (US broad-market + halal-specific) ──
  "SPY", "QQQ", "VOO", "VTI", "IWM", "DIA", "VEA", "VWO",
  "SPUS", "HLAL", "SPSK", "AMNA", "WSHR", "UMMA",

  // ── International ADRs frequently screened ──
  "BABA", "JD", "PDD", "BIDU", "NTES", "LI", "XPEV", "NIO",
  "TM", "SONY", "MUFG", "SMFG",
  "SAP", "ASML", "NVO", "AZN", "GSK", "UL", "RIO", "BHP", "STM",
  "INFY", "WIT", "HDB", "IBN", "RDY",

  // ── Hong Kong / Singapore / Malaysia (Mizan's HK home market) ──
  "9988.HK", "0700.HK", "9618.HK", "1810.HK", "3690.HK",

  // ── Saudi Arabia (Tadawul) — top names ──
  "2222.SR", "1180.SR", "7010.SR",
];

// ─── MAIN ──────────────────────────────────────────────────────────────────

interface Progress {
  done: Record<string, StockFundamentals | null>;
  failed: string[];
}

function loadProgress(): Progress {
  if (existsSync(PROGRESS_PATH)) {
    return JSON.parse(readFileSync(PROGRESS_PATH, "utf-8"));
  }
  return { done: {}, failed: [] };
}

function saveProgress(p: Progress) {
  writeFileSync(PROGRESS_PATH, JSON.stringify(p, null, 2));
}

async function processBatch(
  tickers: string[],
  apiKey: string,
  progress: Progress,
): Promise<void> {
  await Promise.all(
    tickers.map(async (t) => {
      try {
        // Step 1: basic fundamentals (always)
        const result = await fetchStockFundamentals(t, apiKey);
        if (!result) {
          progress.done[t] = null;
          progress.failed.push(t);
          console.log(`  ✗ ${t} — no data returned`);
          return;
        }

        // Step 2: Premium-tier extras (balance sheet detail, earnings, history)
        if (PREMIUM_FEATURES) {
          const [bsDetails, nextEarnings, verdictHistory] = await Promise.all([
            fetchBalanceSheetDetails(t, apiKey).catch(() => null),
            fetchNextEarningsDate(t, apiKey).catch(() => null),
            fetchVerdictHistory(
              t,
              apiKey,
              SCHOLAR_PROFILES.filter((s) => s.id !== "custom"),
            ).catch(() => []),
          ]);

          if (bsDetails) result.balanceSheet = bsDetails;
          if (nextEarnings) result.nextEarningsDate = nextEarnings;
          if (verdictHistory && verdictHistory.length > 0) {
            result.verdictHistory = verdictHistory;
          }
        }

        progress.done[t] = result;
        const extras = PREMIUM_FEATURES
          ? ` [bs:${result.balanceSheet ? "✓" : "—"} earn:${result.nextEarningsDate ? "✓" : "—"} hist:${result.verdictHistory?.length ?? 0}q]`
          : "";
        console.log(`  ✓ ${t} — ${result.name}${extras}`);
      } catch (err) {
        progress.failed.push(t);
        console.log(`  ✗ ${t} — error: ${(err as Error).message}`);
      }
    }),
  );
}

async function main() {
  const apiKey = process.env.FMP_API_KEY;
  if (!apiKey) {
    console.error("ERROR: FMP_API_KEY environment variable not set.");
    console.error("Put it in .env.local and run with: npx tsx --env-file=.env.local scripts/enrichStocks.ts");
    process.exit(1);
  }

  // ── Build the full ticker list: union of existing stocks.json + SEED_TICKERS.
  // This ensures we process every ticker the site already serves (so they all
  // get refreshed with Premium fields), not just SEED_TICKERS.
  let existingTickers: string[] = [];
  let existingStocksByTicker: Record<string, StockFundamentals> = {};
  try {
    const existing = JSON.parse(readFileSync(OUTPUT_PATH, "utf-8")) as StockFundamentals[];
    if (Array.isArray(existing)) {
      existingTickers = existing.map((s) => s.ticker);
      existingStocksByTicker = Object.fromEntries(existing.map((s) => [s.ticker, s]));
    }
  } catch {
    // No existing file — start fresh from SEED_TICKERS
  }

  const targetTickers = Array.from(
    new Set([...existingTickers, ...SEED_TICKERS]),
  );

  const progress = loadProgress();
  const remaining = targetTickers.filter((t) => !(t in progress.done));

  console.log(
    `Enriching ${targetTickers.length} tickers (${existingTickers.length} existing + ${SEED_TICKERS.length} seed, ${remaining.length} remaining)…`,
  );

  for (let i = 0; i < remaining.length; i += CONCURRENCY) {
    const batch = remaining.slice(i, i + CONCURRENCY);
    console.log(`\nBatch ${Math.floor(i / CONCURRENCY) + 1}: ${batch.join(", ")}`);
    await processBatch(batch, apiKey, progress);
    saveProgress(progress);
    if (i + CONCURRENCY < remaining.length) {
      await new Promise((r) => setTimeout(r, BATCH_DELAY_MS));
    }
  }

  // Merge: for any ticker that failed fresh fetch, fall back to existing data
  // so we never LOSE coverage. New data wins where available.
  const merged: StockFundamentals[] = [];
  for (const ticker of targetTickers) {
    const fresh = progress.done[ticker];
    if (fresh) {
      merged.push(fresh);
    } else if (existingStocksByTicker[ticker]) {
      merged.push(existingStocksByTicker[ticker]);
      console.log(`  ↺ ${ticker} — kept existing data (fresh fetch failed)`);
    }
  }

  // DEFENSIVE: never overwrite with an empty array.
  if (merged.length === 0) {
    console.log(`\n⚠  Zero stocks total. ${OUTPUT_PATH} is UNCHANGED.`);
    return;
  }

  // Sort by market cap descending for stable, readable output
  merged.sort((a, b) => b.marketCapUsd - a.marketCapUsd);

  writeFileSync(OUTPUT_PATH, JSON.stringify(merged, null, 2));

  const withBs = merged.filter((s) => s.balanceSheet).length;
  const withHist = merged.filter((s) => s.verdictHistory).length;
  const withEarn = merged.filter((s) => s.nextEarningsDate).length;

  console.log(`\n✓ Wrote ${merged.length} stocks to ${OUTPUT_PATH}`);
  console.log(`  Premium data: ${withBs} have balance sheet, ${withHist} have verdict history, ${withEarn} have earnings dates`);
  console.log(`  ${progress.failed.length} tickers failed this run (see .enrich-progress.json)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
