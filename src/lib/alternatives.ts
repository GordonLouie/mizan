import { listStocks } from "./data";
import { screenStock } from "./screen";
import type { ScholarProfile, StockFundamentals } from "./types";

/**
 * Find up to N stocks in the same sector that PASS under the given scholar.
 * Excludes the input stock itself.
 */
export function findHalalAlternatives(
  stock: StockFundamentals,
  scholar: ScholarProfile,
  n: number = 3,
): StockFundamentals[] {
  const all = listStocks();
  const candidates = all.filter(
    (s) => s.ticker !== stock.ticker && s.sector === stock.sector,
  );
  const passing = candidates.filter((s) => screenStock(s, scholar).verdict === "pass");

  // Prefer larger market cap (more established / familiar) for alternatives
  passing.sort((a, b) => b.marketCapUsd - a.marketCapUsd);
  return passing.slice(0, n);
}
