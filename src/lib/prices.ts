import pricesJson from "@/data/prices.json";
import { listStocks } from "./data";
import type { StockFundamentals } from "./types";

/**
 * Prices (Phase 0b).
 *
 * Real EOD prices come from src/data/prices.json, populated by
 * `scripts/fetch_prices.mjs` (run with your FMP key). When a ticker has real
 * data we use it; otherwise we fall back to a SAMPLE price (clearly marked via
 * isSamplePrice / hasRealPrices) so the UI can label it honestly.
 *
 * priceSeries returns [] when there's no real history — we never fabricate a
 * return series. Charts/ROI must show "data loading" rather than fake numbers.
 */

interface PriceEntry {
  currency: string;
  series: [string, number][]; // [ISO date, close], oldest → newest
}
const PRICES = pricesJson as Record<string, PriceEntry>;

// SAMPLE fallback prices (order-of-magnitude only). Used until real data is
// ingested; surfaced as "sample" in the UI, never presented as real.
const PRICE_OVERRIDES: Record<string, number> = {
  AAPL: 192, MSFT: 415, GOOGL: 168, AMZN: 178, META: 540, NVDA: 950,
  NFLX: 660, TSLA: 175, ORCL: 175, UBER: 80, WMT: 86, COST: 950,
  PG: 165, JNJ: 152, PFE: 28, KO: 65, XOM: 115, TSM: 175, ASML: 920,
  JPM: 212, BAC: 42, GS: 510, V: 280, MA: 460, BABA: 86, "BRK.B": 410,
  AVGO: 1700, AMD: 165, INTC: 33, DIS: 100, CRM: 285, ADBE: 550,
  SPUS: 32, HLAL: 50, SPSK: 21, SPRE: 30, UMMA: 27, SPY: 540, QQQ: 470,
};

export function hasRealPrices(ticker: string): boolean {
  const e = PRICES[ticker.toUpperCase()];
  return !!(e && e.series && e.series.length);
}

export function isSamplePrice(ticker: string): boolean {
  return !hasRealPrices(ticker);
}

export function currentPrice(stock: StockFundamentals): number {
  const real = PRICES[stock.ticker];
  if (real && real.series.length) return real.series[real.series.length - 1][1];
  return PRICE_OVERRIDES[stock.ticker] ?? Math.max(10, stock.marketCapUsd / 1e10);
}

export function priceForTicker(ticker: string): number {
  const s = listStocks().find((x) => x.ticker === ticker.toUpperCase());
  return s ? currentPrice(s) : 0;
}

/** Real historical series, or [] if none (never fabricated). */
export function priceSeries(ticker: string): { date: string; close: number }[] {
  const e = PRICES[ticker.toUpperCase()];
  if (!e || !e.series?.length) return [];
  return e.series.map(([date, close]) => ({ date, close }));
}

/** % return between first and last available real close, or null if no data. */
export function totalReturnPct(ticker: string): number | null {
  const s = priceSeries(ticker);
  if (s.length < 2) return null;
  const first = s[0].close;
  const last = s[s.length - 1].close;
  if (!first) return null;
  return ((last - first) / first) * 100;
}
