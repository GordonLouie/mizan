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
  // ── Mega-caps everyone knows (covers all home-page chips, /vs pairs, /discover hardcoded refs) ──
  "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA", "BRK.B", "V", "MA",
  "JPM", "BAC", "WFC", "LLY", "UNH", "JNJ", "PFE", "MRK", "ABBV", "AVGO",

  // ── Big consumer + staples (dividend yielders on /discover and curated lists) ──
  "WMT", "PG", "KO", "PEP", "COST", "HD", "MCD", "SBUX", "DIS", "NKE",

  // ── Dividend / income names (linked from /lists "Halal dividend payers") ──
  "T", "VZ", "CSCO", "INTC", "IBM", "TXN", "QCOM",

  // ── Energy (curated list constituents) ──
  "XOM", "CVX", "COP", "EOG",

  // ── Industrials + materials (curated list) ──
  "UPS", "UNP", "HON", "CAT", "BA", "GE", "PLD", "NEM",

  // ── Tech extended (popular Muslim investor searches) ──
  "ORCL", "CRM", "ADBE", "NFLX", "AMD", "TSM", "ASML", "ARM",

  // ── International ADRs that come up a lot ──
  "BABA", "TM", "SAP", "NVO",

  // ── Halal-specific ETFs (must work — these are pillars of the product) ──
  "SPUS", "HLAL", "SPSK",
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

  // DEFENSIVE: never overwrite an existing stocks.json with an empty array.
  // If this run produced zero results (e.g. quota exhausted, all 4xx), leave
  // the existing data alone so we don't break the site.
  if (stocks.length === 0) {
    console.log(`\n⚠  Zero stocks succeeded this run. ${OUTPUT_PATH} is UNCHANGED.`);
    console.log(`   ${progress.failed.length} tickers failed. Likely FMP quota.`);
    console.log(`   Wait for quota reset, then rerun.`);
    return;
  }

  // Also defensive: if current file has MORE stocks than this run produced,
  // don't shrink it. (Run failed partway after a previous successful run.)
  try {
    const existing = JSON.parse(readFileSync(OUTPUT_PATH, "utf-8"));
    if (Array.isArray(existing) && existing.length > stocks.length) {
      console.log(`\n⚠  Existing ${OUTPUT_PATH} has ${existing.length} stocks; this run produced ${stocks.length}.`);
      console.log(`   File NOT overwritten. Delete .enrich-progress.json and rerun if you want a full refresh.`);
      return;
    }
  } catch {
    // ignore — file may be missing or unparseable; we'll write fresh below
  }

  // Sort by market cap descending for stable, readable output
  stocks.sort((a, b) => b.marketCapUsd - a.marketCapUsd);

  writeFileSync(OUTPUT_PATH, JSON.stringify(stocks, null, 2));

  console.log(`\n✓ Wrote ${stocks.length} stocks to ${OUTPUT_PATH}`);
  console.log(`  ${progress.failed.length} tickers failed (see .enrich-progress.json)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
