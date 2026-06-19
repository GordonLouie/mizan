#!/usr/bin/env node
/**
 * fetch_prices.mjs — historical price ingestion (Phase 0a).
 *
 * Pulls daily EOD closes for every ticker in stocks.json from FMP and writes a
 * compact src/data/prices.json:
 *     { "AAPL": { "currency": "USD", "series": [["2025-01-02", 243.1], ...] }, ... }
 *
 * This is the foundation for real charts, ROI, indexes and portfolio
 * performance. Without it, the app falls back to mock prices.
 *
 * RUN (needs Node 18+, open network, FMP key):
 *     FMP_API_KEY=xxx node scripts/fetch_prices.mjs
 *   options (env):
 *     PRICE_DAYS=730       how many days of history (default 730 ≈ 2y)
 *     PRICE_SAMPLE=daily   daily | weekly (weekly = smaller file)
 *
 * Resumable: re-running refreshes. FMP historical-price calls = 1 request/ticker.
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
// DATA_PROVIDER=fmp (default) or =twelvedata. NOTE: on Twelve Data's Venture tier,
// HK (XHKG) historical PRICES require a separate direct-exchange license, so HK
// tickers will be skipped here (HK still screens fine via fundamentals — it just
// won't have a price chart). US + most other markets work.
const PROVIDER = (process.env.DATA_PROVIDER || "fmp").toLowerCase();
const IS_TD = PROVIDER === "twelvedata";
const KEY = IS_TD ? process.env.TWELVE_DATA_API_KEY : process.env.FMP_API_KEY;
const DAYS = Number(process.env.PRICE_DAYS || "730");
const SAMPLE = process.env.PRICE_SAMPLE || "daily";
const CONCURRENCY = 5;
// Twelve Data /time_series = 1 credit/ticker. Pace batches to stay under the
// per-minute credit budget (TD_CREDITS_PER_MIN, default 610). FMP keeps 250ms.
const TD_CREDITS_PER_MIN = Number(process.env.TD_CREDITS_PER_MIN || "610");
const BATCH_DELAY_MS = IS_TD ? Math.ceil((CONCURRENCY / TD_CREDITS_PER_MIN) * 60_000) : 250;

if (!KEY) {
  const k = IS_TD ? "TWELVE_DATA_API_KEY" : "FMP_API_KEY";
  console.error(`ERROR: set ${k}. e.g. ${k}=xxx DATA_PROVIDER=${PROVIDER} node scripts/fetch_prices.mjs`);
  process.exit(1);
}

// Map a HalalGauge ticker (possibly suffixed) → Twelve Data symbol + mic_code.
const SUFFIX_TO_MIC = {
  HK: "XHKG", SR: "XSAU", T: "XTKS", DE: "XETR", PA: "XPAR", SW: "XSWX",
  CO: "XCSE", L: "XLON", SI: "XSES", KS: "XKRX", TW: "XTAI", AX: "XASX", TO: "XTSE",
};
function tdSymbol(ticker) {
  const t = String(ticker).toUpperCase().trim();
  const dot = t.lastIndexOf(".");
  if (dot > 0) {
    const mic = SUFFIX_TO_MIC[t.slice(dot + 1)];
    if (mic) return { symbol: t.slice(0, dot), mic };
  }
  return { symbol: t, mic: null };
}

const tickers = JSON.parse(readFileSync(join(ROOT, "src/data/stocks.json"), "utf-8")).map((s) => s.ticker);
const fromDate = new Date(Date.now() - DAYS * 86_400_000).toISOString().slice(0, 10);

async function fetchOneFMP(ticker) {
  // FMP stable historical EOD — FULL endpoint so we can use the split/dividend
  // ADJUSTED close (adjClose). The "light" endpoint's `price` field proved
  // unreliable (semis inflated, NFLX ~10x off). adjClose is the correct series
  // for returns/charts. Adjust the endpoint to your plan if needed.
  const url =
    `https://financialmodelingprep.com/stable/historical-price-eod/full` +
    `?symbol=${encodeURIComponent(ticker)}&from=${fromDate}&apikey=${KEY}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const rows = Array.isArray(data) ? data : data?.historical ?? [];
    if (!rows.length) return null;
    let series = rows
      .map((r) => [String(r.date), Number(r.adjClose ?? r.adjustedClose ?? r.close ?? r.price)])
      .filter(([, p]) => Number.isFinite(p) && p > 0)
      .sort((a, b) => a[0].localeCompare(b[0])); // oldest → newest
    if (SAMPLE === "weekly") series = series.filter((_, i) => i % 5 === 0 || i === series.length - 1);
    return series.length ? { currency: "USD", series } : null;
  } catch {
    return null;
  }
}

async function fetchOneTD(ticker) {
  // Twelve Data /time_series. adjust=all → split + dividend adjusted (matches FMP's
  // adjClose, the right series for returns). Values come back as STRINGS — parse.
  const { symbol, mic } = tdSymbol(ticker);
  const params = new URLSearchParams({
    symbol, interval: "1day", outputsize: "5000", order: "asc", adjust: "all",
    start_date: fromDate, apikey: KEY,
  });
  if (mic) params.set("mic_code", mic);
  try {
    const res = await fetch(`https://api.twelvedata.com/time_series?${params.toString()}`);
    const data = await res.json();
    if (!res.ok || data?.status === "error" || !Array.isArray(data?.values)) return null; // e.g. HK price needs exchange license
    const currency = data?.meta?.currency || "USD";
    let series = data.values
      .map((r) => [String(r.datetime), Number(r.close)])
      .filter(([, p]) => Number.isFinite(p) && p > 0)
      .sort((a, b) => a[0].localeCompare(b[0]));
    if (SAMPLE === "weekly") series = series.filter((_, i) => i % 5 === 0 || i === series.length - 1);
    return series.length ? { currency, series } : null;
  } catch {
    return null;
  }
}

const fetchOne = IS_TD ? fetchOneTD : fetchOneFMP;

async function main() {
  const out = existsSync(join(ROOT, "src/data/prices.json"))
    ? JSON.parse(readFileSync(join(ROOT, "src/data/prices.json"), "utf-8"))
    : {};
  console.log(`Provider: ${PROVIDER}. Fetching ${SAMPLE} prices since ${fromDate} for ${tickers.length} tickers…`);
  if (IS_TD) console.log("Note: HK (XHKG) prices need a separate exchange license on Venture — HK tickers will be skipped (they still screen via fundamentals).");
  let ok = 0, fail = 0;
  for (let i = 0; i < tickers.length; i += CONCURRENCY) {
    const batch = tickers.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map(fetchOne));
    results.forEach((r, j) => {
      if (r) { out[batch[j]] = r; ok++; } else { fail++; }
    });
    process.stdout.write(`\r  ${i + batch.length}/${tickers.length}  ok=${ok} fail=${fail}`);
    await new Promise((r) => setTimeout(r, BATCH_DELAY_MS));
  }
  writeFileSync(join(ROOT, "src/data/prices.json"), JSON.stringify(out));
  // Also emit a tiny latest-close map for client-safe current prices (the full
  // history is server-only — see src/lib/prices.server.ts).
  const latest = {};
  for (const [t, v] of Object.entries(out)) {
    if (v?.series?.length) latest[t] = Math.round(v.series[v.series.length - 1][1] * 10000) / 10000;
  }
  writeFileSync(join(ROOT, "src/data/prices-latest.json"), JSON.stringify(latest));
  console.log(`\nWrote src/data/prices.json (${ok} tickers with history, ${fail} without) + prices-latest.json.`);
  console.log("Next: commit it, and the app will use real prices automatically.");
}

main();
