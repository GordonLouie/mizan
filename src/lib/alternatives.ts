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

export interface HalalAlternative {
  stock: StockFundamentals;
  reason: string;
}

/** A short, DETERMINISTIC reason why `alt` is a sound halal pick vs `orig`. */
function buildReason(orig: StockFundamentals, alt: StockFundamentals): string {
  const bits: string[] = [];
  if (alt.impermissibleIncomePct < orig.impermissibleIncomePct - 0.2)
    bits.push(`cleaner income (${alt.impermissibleIncomePct.toFixed(1)}% impermissible)`);
  if (alt.debtToMarketCapPct < orig.debtToMarketCapPct - 1) bits.push("lower interest-bearing debt");
  if (alt.marketCapUsd > orig.marketCapUsd * 1.2) bits.push("larger, more established");
  if ((alt.dividendYieldPct ?? 0) > (orig.dividendYieldPct ?? 0) + 0.5) bits.push("higher dividend yield");
  if (bits.length === 0) return "Passes the screen cleanly in the same sector.";
  return `Passes cleanly · ${bits.slice(0, 2).join(", ")}.`;
}

/** Same-sector halal names, each with a deterministic reason. Works whether the
 *  input stock passes (diversification ideas) or fails (replacements). */
export function findHalalAlternativesWithReason(
  stock: StockFundamentals,
  scholar: ScholarProfile,
  n = 3,
): HalalAlternative[] {
  return findHalalAlternatives(stock, scholar, n).map((alt) => ({ stock: alt, reason: buildReason(stock, alt) }));
}
