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
 * Burns ~4 FMP requests per ticker × SEED_TICKERS.length. The free tier is
 * ~250 req/day, so a 500-ticker run takes 2+ days. The script saves
 * progress after each batch and is safely resumable.
 */

import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import { fetchStockFundamentals } from "../src/lib/fmpFetch";
import type { StockFundamentals } from "../src/lib/types";

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
  // ── US Mega-caps ──
  "AAPL", "MSFT", "GOOGL", "GOOG", "AMZN", "NVDA", "META", "TSLA", "BRK.B",
  "AVGO", "LLY", "JPM", "V", "MA", "UNH", "XOM", "JNJ", "WMT", "PG", "HD",
  "ORCL", "COST", "ABBV", "MRK", "CVX", "BAC", "KO", "PEP", "TMO", "ADBE",
  "CRM", "MCD", "ACN", "ABT", "LIN", "AMD", "CSCO", "TXN", "DHR", "WFC",
  "NFLX", "PM", "DIS", "NKE", "VZ", "INTC", "QCOM", "AMGN", "IBM", "T",

  // ── US Large-cap dividend / industrial ──
  "INTU", "PFE", "HON", "UNP", "NEE", "RTX", "GE", "CAT", "MS", "GS",
  "BLK", "BMY", "SPGI", "AXP", "LOW", "LMT", "BKNG", "DE", "MDT", "NOW",
  "BA", "ELV", "PLD", "TJX", "ISRG", "SYK", "ADP", "GILD", "MMC", "VRTX",
  "ETN", "C", "REGN", "AMAT", "CB", "MO", "PYPL", "SCHW", "PGR", "ZTS",
  "MDLZ", "BSX", "FI", "DUK", "EOG", "SO", "ANET", "BDX", "CCI", "ICE",

  // ── US Mid-cap + growth ──
  "ABNB", "UBER", "SHOP", "SQ", "PLTR", "SNOW", "CRWD", "PANW", "FTNT",
  "MELI", "TEAM", "DDOG", "ZS", "OKTA", "MDB", "NET", "WDAY", "VEEV",
  "ETSY", "PINS", "ROKU", "DKNG", "RBLX", "U", "TWLO", "DOCU", "ZM",
  "COIN", "HOOD", "SOFI", "RIVN", "LCID", "F", "GM", "BA", "DAL", "UAL",
  "LUV", "AAL", "JBLU", "SAVE", "AAL", "ALK", "MTN", "HLT", "MAR", "H",
  "WYNN", "MGM", "LVS", "CZR", "RCL", "CCL", "NCLH", "PARA", "WBD",

  // ── US Tech secondary ──
  "TSM", "ASML", "AMAT", "LRCX", "KLAC", "MRVL", "ON", "MU", "WDC", "STX",
  "NTNX", "DELL", "HPQ", "HPE", "GLW", "ARM", "MCHP", "ADI", "MPWR", "TER",
  "NTAP", "ANSS", "CTSH", "CDW", "EPAM", "GLOB", "TYL", "CDNS", "SNPS", "FIS",
  "FISV", "GPN", "JKHY", "PAYC", "PCTY", "WIX", "PEGA", "BILL", "FROG",

  // ── US Healthcare + biotech ──
  "TMO", "BMY", "CVS", "WBA", "CI", "HCA", "MCK", "COR", "BAX", "BIO",
  "MTD", "RMD", "IDXX", "WST", "STE", "ZBH", "EW", "ALGN", "DXCM", "PODD",
  "MOH", "CNC", "HUM", "ANTM", "BIIB", "INCY", "MRNA", "BNTX", "ALNY",
  "VRTX", "REGN", "GILD", "BMRN", "TECH", "EXAS", "AMN", "GMED",

  // ── US Energy + materials ──
  "XOM", "CVX", "COP", "EOG", "SLB", "PSX", "MPC", "VLO", "PXD", "OXY",
  "DVN", "FANG", "HES", "MRO", "APA", "EQT", "HAL", "BKR", "FTI", "OKE",
  "WMB", "ET", "EPD", "KMI", "LNG", "TRGP", "CLF", "FCX", "NEM", "GOLD",
  "AA", "X", "STLD", "NUE", "RS", "ATI", "VMC", "MLM", "CRH", "EXP",

  // ── US Consumer staples + retail ──
  "KO", "PEP", "WMT", "COST", "PG", "CL", "KMB", "GIS", "K", "HSY",
  "MDLZ", "MO", "PM", "STZ", "BUD", "DEO", "TAP", "SAM", "BF.B",
  "KR", "WBA", "TGT", "DG", "DLTR", "ROST", "TJX", "BBY", "ULTA", "LULU",
  "TPR", "RL", "CPB", "CAG", "SJM", "HRL", "MKC", "CHD", "CLX", "ENR",

  // ── US REITs ──
  "PLD", "AMT", "CCI", "EQIX", "PSA", "SPG", "WELL", "DLR", "O", "AVB",
  "EXR", "ARE", "VTR", "WY", "BXP", "ESS", "MAA", "UDR", "CPT", "REG",

  // ── International ETFs + ADRs ──
  "BABA", "NIO", "XPEV", "LI", "PDD", "JD", "BIDU", "TCOM", "ZTO", "NTES",
  "TSM", "ASML", "SAP", "NVO", "AZN", "RIO", "BHP", "VALE", "TM", "HMC",
  "SONY", "SE", "MELI", "GLOB", "STM", "INFY", "WIT", "RDY", "ITUB", "BBD",

  // ── Halal-specific ETFs ──
  "SPUS", "HLAL", "SPSK", "SHRA.L", "FALCON",

  // ── Saudi / GCC (FMP coverage may be limited; will fail-soft) ──
  "2222.SR", "1120.SR", "1180.SR", "1211.SR", "7010.SR", "4001.SR",
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
        const result = await fetchStockFundamentals(t, apiKey);
        progress.done[t] = result;
        if (!result) {
          progress.failed.push(t);
          console.log(`  ✗ ${t} — no data returned`);
        } else {
          console.log(`  ✓ ${t} — ${result.name}`);
        }
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

  const progress = loadProgress();
  const remaining = SEED_TICKERS.filter((t) => !(t in progress.done));

  console.log(`Enriching ${SEED_TICKERS.length} tickers (${remaining.length} remaining)…`);

  for (let i = 0; i < remaining.length; i += CONCURRENCY) {
    const batch = remaining.slice(i, i + CONCURRENCY);
    console.log(`\nBatch ${Math.floor(i / CONCURRENCY) + 1}: ${batch.join(", ")}`);
    await processBatch(batch, apiKey, progress);
    saveProgress(progress);
    if (i + CONCURRENCY < remaining.length) {
      await new Promise((r) => setTimeout(r, BATCH_DELAY_MS));
    }
  }

  // Write final stocks.json — successful entries only
  const stocks = Object.values(progress.done).filter(
    (s): s is StockFundamentals => s !== null,
  );

  // Sort by market cap descending for stable, readable output
  stocks.sort((a, b) => b.marketCapUsd - a.marketCapUsd);

  writeFileSync(OUTPUT_PATH, JSON.stringify(stocks, null, 2));

  console.log(`\n✓ Wrote ${stocks.length} stocks to ${OUTPUT_PATH}`);
  console.log(`  ${progress.failed.length} tickers failed (see .enrich-progress.json)`);
  console.log(`\nRotate your FMP key now if you pasted it anywhere public.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
