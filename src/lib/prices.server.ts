import pricesJson from "@/data/prices.json";

/**
 * Server-only price HISTORY (Phase 1d). Imports the multi-MB prices.json.
 * ⚠ DO NOT import this from a client component — it would bundle 6.7MB of price
 * history into the browser. Only API routes / server components may use it.
 * Client code gets current prices from prices-latest.json (prices.ts) and
 * historical series via /api/prices/[ticker].
 */
interface PriceEntry {
  currency: string;
  series: [string, number][];
}
const PRICES = pricesJson as unknown as Record<string, PriceEntry>;

export function hasHistory(ticker: string): boolean {
  const e = PRICES[ticker.toUpperCase()];
  return !!(e && e.series && e.series.length);
}

export function priceSeries(ticker: string): { date: string; close: number }[] {
  const e = PRICES[ticker.toUpperCase()];
  if (!e || !e.series?.length) return [];
  return e.series.map(([date, close]) => ({ date, close }));
}
