import stocksJson from "@/data/stocks.json";
import type { StockFundamentals } from "./types";

const stocks = stocksJson as StockFundamentals[];

export function listStocks(): StockFundamentals[] {
  return stocks;
}

export function findStock(ticker: string): StockFundamentals | undefined {
  const t = ticker.toUpperCase().trim();
  return stocks.find((s) => s.ticker === t);
}
