import latestJson from "@/data/prices-latest.json";
import { listStocks } from "./data";
import type { StockFundamentals } from "./types";

/**
 * Client-safe prices (Phase 1d). Imports only the tiny prices-latest.json
 * (~9KB, real latest closes) for current-price display — NOT the 6.7MB history,
 * which is server-only (prices.server.ts) and reached via /api/prices/[ticker].
 *
 * Real latest close when available; a clearly-labelled SAMPLE otherwise
 * (isSamplePrice / hasRealPrices). Never fabricated.
 */
const LATEST = latestJson as Record<string, number>;

// SAMPLE fallback (order-of-magnitude only) — used until a ticker has real data.
const PRICE_OVERRIDES: Record<string, number> = {
  AAPL: 192, MSFT: 415, GOOGL: 168, AMZN: 178, META: 540, NVDA: 950,
  NFLX: 660, TSLA: 175, ORCL: 175, UBER: 80, WMT: 86, COST: 950,
  PG: 165, JNJ: 152, PFE: 28, KO: 65, XOM: 115, TSM: 175, ASML: 920,
  JPM: 212, BAC: 42, GS: 510, V: 280, MA: 460, BABA: 86, "BRK.B": 410,
  AVGO: 1700, AMD: 165, INTC: 33, DIS: 100, CRM: 285, ADBE: 550,
  SPUS: 32, HLAL: 50, SPSK: 21, SPRE: 30, UMMA: 27, SPY: 540, QQQ: 470,
};

export function hasRealPrices(ticker: string): boolean {
  return typeof LATEST[ticker.toUpperCase()] === "number";
}

export function isSamplePrice(ticker: string): boolean {
  return !hasRealPrices(ticker);
}

export function currentPrice(stock: StockFundamentals): number {
  const real = LATEST[stock.ticker];
  if (typeof real === "number") return real;
  return PRICE_OVERRIDES[stock.ticker] ?? Math.max(10, stock.marketCapUsd / 1e10);
}

export function priceForTicker(ticker: string): number {
  const t = ticker.toUpperCase();
  const real = LATEST[t];
  if (typeof real === "number") return real;
  const s = listStocks().find((x) => x.ticker === t);
  return s ? currentPrice(s) : 0;
}
