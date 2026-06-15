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
const KEY = process.env.FMP_API_KEY;
const DAYS = Number(process.env.PRICE_DAYS || "730");
const SAMPLE = process.env.PRICE_SAMPLE || "daily";
const CONCURRENCY = 5;

if (!KEY) {
  console.error("ERROR: set FMP_API_KEY. e.g. FMP_API_KEY=xxx node scripts/fetch_prices.mjs");
  process.exit(1);
}

const tickers = JSON.parse(readFileSync(join(ROOT, "src/data/stocks.json"), "utf-8")).map((s) => s.ticker);
const fromDate = new Date(Date.now() - DAYS * 86_400_000).toISOString().slice(0, 10);

async function fetchOne(ticker) {
  // FMP stable historical EOD. Adjust endpoint to your plan if needed.
  const url =
    `https://financialmodelingprep.com/stable/historical-price-eod/light` +
    `?symbol=${encodeURIComponent(ticker)}&from=${fromDate}&apikey=${KEY}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    // FMP returns an array of { date, price } (light) or { date, close }.
    const rows = Array.isArray(data) ? data : data?.historical ?? [];
    if (!rows.length) return null;
    let series = rows
      .map((r) => [String(r.date), Number(r.price ?? r.close)])
      .filter(([, p]) => Number.isFinite(p))
      .sort((a, b) => a[0].localeCompare(b[0])); // oldest → newest
    if (SAMPLE === "weekly") series = series.filter((_, i) => i % 5 === 0 || i === series.length - 1);
    return series.length ? { currency: "USD", series } : null;
  } catch {
    return null;
  }
}

async function main() {
  const out = existsSync(join(ROOT, "src/data/prices.json"))
    ? JSON.parse(readFileSync(join(ROOT, "src/data/prices.json"), "utf-8"))
    : {};
  console.log(`Fetching ${SAMPLE} prices since ${fromDate} for ${tickers.length} tickers…`);
  let ok = 0, fail = 0;
  for (let i = 0; i < tickers.length; i += CONCURRENCY) {
    const batch = tickers.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map(fetchOne));
    results.forEach((r, j) => {
      if (r) { out[batch[j]] = r; ok++; } else { fail++; }
    });
    process.stdout.write(`\r  ${i + batch.length}/${tickers.length}  ok=${ok} fail=${fail}`);
    await new Promise((r) => setTimeout(r, 250));
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
