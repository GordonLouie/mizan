/**
 * dataQuality.ts — guards against showing a confident verdict on numbers we
 * can't stand behind. Some foreign ADRs in the dataset have un-normalized
 * local-currency balance sheets (e.g. Toyota showing ~18,000% debt/market cap),
 * which would otherwise yield a misleading verdict. We detect implausible
 * fundamentals and withhold/flag rather than mislead — credibility first.
 */
import type { StockFundamentals } from "./types";

// A debt/cash/receivables ratio above this (% of market cap) is, for our
// purposes, almost certainly a data error rather than reality. Genuinely
// leveraged names (banks, REITs) that exceed it are conservatively withheld too —
// we'd rather say "under review" than publish a verdict we can't defend.
const MAX_PLAUSIBLE_RATIO = 500;

export function fundamentalsReliable(s: StockFundamentals): boolean {
  if (!(s.marketCapUsd > 0)) return false;
  const ratios = [
    s.impermissibleIncomePct,
    s.debtToMarketCapPct,
    s.cashSecuritiesToMarketCapPct,
    s.receivablesToMarketCapPct,
    s.illiquidAssetsToTotalAssetsPct,
  ];
  if (ratios.some((v) => v == null || !Number.isFinite(v) || v < 0)) return false;
  // Percentages of a total can't exceed 100.
  if (s.impermissibleIncomePct > 100 || s.illiquidAssetsToTotalAssetsPct > 100) return false;
  // Balance-sheet-vs-market-cap ratios above the plausibility cap → data error.
  if (
    s.debtToMarketCapPct > MAX_PLAUSIBLE_RATIO ||
    s.cashSecuritiesToMarketCapPct > MAX_PLAUSIBLE_RATIO ||
    s.receivablesToMarketCapPct > MAX_PLAUSIBLE_RATIO
  ) return false;
  if ((s.dividendYieldPct ?? 0) > 40) return false;
  // A NON-financial company holding more cash/securities or receivables than its
  // entire market cap is almost always a data error (e.g. un-normalised FX), even
  // below the hard cap above. Banks/insurers legitimately do — but they fail the
  // sector screen anyway, so excluding them here is harmless.
  const isFinancial = (s.sectorFlags ?? []).includes("conventional_finance");
  if (!isFinancial && (s.cashSecuritiesToMarketCapPct > 120 || s.receivablesToMarketCapPct > 120)) return false;
  return true;
}
