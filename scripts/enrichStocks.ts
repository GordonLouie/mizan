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

// ─── FULL-UNIVERSE MODE ──────────────────────────────────────────────────────
// Set MIZAN_UNIVERSE to pull entire exchange universes from FMP's screener
// (instead of just SEED_TICKERS) — this is how you grow from ~340 tickers to
// thousands. Accepts a comma list of markets:
//   MIZAN_UNIVERSE=us       → NASDAQ + NYSE + AMEX
//   MIZAN_UNIVERSE=hk       → HKEX (HalalGauge's home market)
//   MIZAN_UNIVERSE=us,hk    → both
// A market-cap floor (default $1B) keeps out illiquid micro-caps that have poor
// data and no search demand; lower it via MIZAN_MIN_MARKETCAP to go deeper.
// Needs a paid FMP tier for the request volume (thousands of tickers × ~10 reqs
// each). Run in chunks — the script is resumable, so you can stop/restart.
//
//   # Fill out HK coverage (home market) above HK$ ~8B ≈ US$1B:
//   MIZAN_UNIVERSE=hk npx tsx --env-file=.env.local scripts/enrichStocks.ts
//
//   MIZAN_UNIVERSE=us,hk MIZAN_MIN_MARKETCAP=2000000000 \
//     npx tsx --env-file=.env.local scripts/enrichStocks.ts
const UNIVERSE_MODE = process.env.MIZAN_UNIVERSE || "";
const UNIVERSE_MIN_MARKETCAP = Number(process.env.MIZAN_MIN_MARKETCAP || "1000000000");

/**
 * Fetch all actively-traded US common stocks above the market-cap floor from
 * FMP's stable screener. Returns ticker symbols. Defensive: returns [] on any
 * error so a failed universe fetch never wipes the seed list. NOTE: adjust the
 * endpoint/params if your FMP plan differs (some plans use /company-screener,
 * others the legacy /api/v3/stock-screener).
 */
async function fetchUsUniverse(apiKey: string): Promise<string[]> {
  return fetchExchangeUniverse(apiKey, "NASDAQ,NYSE,AMEX", /^[A-Z][A-Z.\-]{0,6}$/, "US");
}

/**
 * Fetch the HKEX universe above the market-cap floor. HK symbols come back as
 * e.g. "0700.HK"; we keep the digit-coded .HK form the rest of the pipeline
 * (and FMP) expects. Run with MIZAN_UNIVERSE=hk. HKD figures are FX-normalized
 * downstream (FX_PER_USD.HKD), so ratios come out correct.
 */
async function fetchHkUniverse(apiKey: string): Promise<string[]> {
  return fetchExchangeUniverse(apiKey, "HKSE", /^\d{3,5}\.HK$/i, "HK");
}

/**
 * Shared screener fetch for any exchange set. Defensive: returns [] on any
 * error so a failed universe fetch never wipes the seed list.
 */
async function fetchExchangeUniverse(
  apiKey: string,
  exchanges: string,
  symFilter: RegExp,
  label: string,
): Promise<string[]> {
  const url =
    `https://financialmodelingprep.com/stable/company-screener?` +
    `marketCapMoreThan=${UNIVERSE_MIN_MARKETCAP}` +
    `&exchange=${encodeURIComponent(exchanges)}&isEtf=false&isFund=false&isActivelyTrading=true` +
    `&limit=10000&apikey=${apiKey}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`${label} universe fetch failed: HTTP ${res.status}. Falling back to SEED_TICKERS only.`);
      return [];
    }
    const data = await res.json();
    if (!Array.isArray(data)) {
      console.warn(`${label} universe fetch: unexpected response shape. Falling back to SEED only.`);
      return [];
    }
    const symbols = data
      .map((r: { symbol?: string }) => (r.symbol ?? "").toUpperCase())
      .filter((s): s is string => typeof s === "string" && symFilter.test(s));
    console.log(`${label} universe: ${symbols.length} tickers above $${(UNIVERSE_MIN_MARKETCAP / 1e9).toFixed(1)}B market cap.`);
    return symbols;
  } catch (e) {
    console.warn(`${label} universe fetch error:`, e, "— falling back to SEED only.");
    return [];
  }
}

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

  // ═══════════════════════════════════════════════════════════════════════
  // HONG KONG (HKEX) — HalalGauge's home market. Expanded to the most-searched
  // ~55 HKEX names so HK isn't a token 2-stock presence. Includes names that
  // will FAIL the screen (banks, insurers, alcohol, gambling, pork) on purpose
  // — transparency means showing the verdict, not pre-filtering the universe.
  // For full HKEX coverage, run with MIZAN_UNIVERSE=hk (see below).
  // ═══════════════════════════════════════════════════════════════════════
  // Tech / internet / platforms
  "0700.HK", "9988.HK", "3690.HK", "9618.HK", "1810.HK", "1024.HK", "9999.HK",
  "9626.HK", "9961.HK", "0981.HK", "0992.HK", "2382.HK", "0285.HK", "1347.HK",
  // EV / autos / industrials
  "1211.HK", "2015.HK", "9868.HK", "9866.HK", "0175.HK", "2333.HK", "0489.HK",
  "0669.HK", "1766.HK",
  // Consumer / staples / retail / apparel
  "2020.HK", "2331.HK", "1929.HK", "6862.HK", "2313.HK", "0322.HK", "0288.HK",
  "0291.HK", "0151.HK", "1044.HK",
  // Healthcare / pharma / biotech
  "1093.HK", "1177.HK", "2269.HK", "6160.HK", "1801.HK", "2196.HK",
  // Energy / materials / telecom / utilities
  "0883.HK", "0386.HK", "0857.HK", "0941.HK", "0762.HK", "0728.HK", "1088.HK",
  "2628.HK",
  // Property / conglomerates / infrastructure
  "0001.HK", "0016.HK", "0688.HK", "1109.HK", "0823.HK", "0066.HK",
  // Financials / exchange / insurers (will mostly FAIL — shown transparently)
  "0005.HK", "0939.HK", "1398.HK", "3988.HK", "2318.HK", "1299.HK", "0388.HK",
  "0011.HK", "2628.HK",
  // Gaming / hospitality (sector exclusions — shown transparently)
  "0027.HK", "1928.HK",

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

  // Optional: pull full exchange universes (MIZAN_UNIVERSE=us, =hk, or =us,hk).
  // Otherwise just the curated seed + whatever's already in stocks.json.
  const modes = new Set(UNIVERSE_MODE.split(",").map((m) => m.trim().toLowerCase()).filter(Boolean));
  let universeTickers: string[] = [];
  if (modes.has("us")) {
    console.log("MIZAN_UNIVERSE includes us → fetching full US universe from FMP screener…");
    universeTickers = universeTickers.concat(await fetchUsUniverse(apiKey));
  }
  if (modes.has("hk")) {
    console.log("MIZAN_UNIVERSE includes hk → fetching full HKEX universe from FMP screener…");
    universeTickers = universeTickers.concat(await fetchHkUniverse(apiKey));
  }

  const targetTickers = Array.from(
    new Set([...existingTickers, ...SEED_TICKERS, ...universeTickers]),
  );

  const progress = loadProgress();
  const remaining = targetTickers.filter((t) => !(t in progress.done));

  console.log(
    `Enriching ${targetTickers.length} tickers (${existingTickers.length} existing + ${SEED_TICKERS.length} seed` +
    `${universeTickers.length ? ` + ${universeTickers.length} universe` : ""}, ${remaining.length} remaining)…`,
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
