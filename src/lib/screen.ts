import type {
  ScholarProfile, StockFundamentals, ScreeningResult,
  RatioCheck, Verdict, ProhibitedSector
} from "./types";
import { fundamentalsReliable } from "./dataQuality";

const SECTOR_LABELS: Record<ProhibitedSector, string> = {
  alcohol: "Alcohol production / sales",
  gambling: "Gambling / casinos",
  tobacco: "Tobacco",
  conventional_finance: "Conventional banking / insurance / interest-based lending",
  weapons: "Weapons / defense",
  pork: "Pork products",
  adult_entertainment: "Adult entertainment",
  non_halal_food: "Non-halal food processing",
};

function checkSector(
  flags: ProhibitedSector[],
  excluded: ProhibitedSector[],
): { passes: boolean; reason: string } {
  const hits = flags.filter((f) => excluded.includes(f));
  if (hits.length === 0) {
    return { passes: true, reason: "No prohibited business activities flagged." };
  }
  return {
    passes: false,
    reason: `Excluded sector: ${hits.map((h) => SECTOR_LABELS[h]).join(", ")}.`,
  };
}

function maxCheck(
  label: string,
  value: number,
  threshold: number | null,
  explainPass: string,
  explainFail: string,
): RatioCheck {
  if (threshold === null) {
    return {
      label, value, threshold: null, direction: "max",
      passes: true,
      explanation: "Not screened under this standard.",
    };
  }
  const passes = value <= threshold;
  return {
    label, value, threshold, direction: "max",
    passes,
    explanation: passes ? explainPass : explainFail,
  };
}

function minCheck(
  label: string,
  value: number,
  threshold: number | null,
  explainPass: string,
  explainFail: string,
): RatioCheck {
  if (threshold === null) {
    return {
      label, value, threshold: null, direction: "min",
      passes: true,
      explanation: "Not screened under this standard.",
    };
  }
  const passes = value >= threshold;
  return {
    label, value, threshold, direction: "min",
    passes,
    explanation: passes ? explainPass : explainFail,
  };
}

export function screenStock(
  stock: StockFundamentals,
  scholar: ScholarProfile,
): ScreeningResult {
  const sector = checkSector(stock.sectorFlags, scholar.excludedSectors);

  const ratioChecks: RatioCheck[] = [
    maxCheck(
      "Impermissible income / revenue",
      stock.impermissibleIncomePct,
      scholar.maxImpermissibleIncomePct,
      `Below the ${scholar.maxImpermissibleIncomePct}% cap.`,
      `Exceeds the ${scholar.maxImpermissibleIncomePct}% cap on non-permissible income.`,
    ),
    maxCheck(
      "Interest-bearing debt / market cap",
      stock.debtToMarketCapPct,
      scholar.maxDebtToMarketCapPct,
      `Below the ${scholar.maxDebtToMarketCapPct}% cap.`,
      `Exceeds the ${scholar.maxDebtToMarketCapPct}% debt cap.`,
    ),
    maxCheck(
      "Cash + interest-bearing securities / market cap",
      stock.cashSecuritiesToMarketCapPct,
      scholar.maxCashSecuritiesToMarketCapPct,
      `Below the ${scholar.maxCashSecuritiesToMarketCapPct}% cap.`,
      `Exceeds the ${scholar.maxCashSecuritiesToMarketCapPct}% cap on interest-bearing assets.`,
    ),
    maxCheck(
      "Accounts receivable / market cap",
      stock.receivablesToMarketCapPct,
      scholar.maxReceivablesToMarketCapPct,
      `Below the ${scholar.maxReceivablesToMarketCapPct}% cap.`,
      `Exceeds the ${scholar.maxReceivablesToMarketCapPct}% cap.`,
    ),
    minCheck(
      "Illiquid (tangible) assets / total assets",
      stock.illiquidAssetsToTotalAssetsPct,
      scholar.minIlliquidAssetsToTotalAssetsPct,
      `Meets the ${scholar.minIlliquidAssetsToTotalAssetsPct}% floor required by this scholar.`,
      `Below the ${scholar.minIlliquidAssetsToTotalAssetsPct}% floor that this scholar requires — a key differentiator.`,
    ),
  ];

  const ratiosPass = ratioChecks.every((c) => c.passes);
  const verdict: Verdict =
    sector.passes && ratiosPass
      ? "pass"
      : sector.passes && ratioChecks.filter((c) => !c.passes).length === 1
        ? "borderline"
        : "fail";

  const purificationNote =
    scholar.purificationScope === "dividends_and_gains"
      ? "Under this scholar: purify BOTH dividend income AND capital gains."
      : "Under this scholar: purify dividend income only.";

  return {
    ticker: stock.ticker,
    scholarId: scholar.id,
    scholarLabel: scholar.label,
    scholarSourceLabel: scholar.sourceLabel,
    verdict,
    sectorPasses: sector.passes,
    sectorReason: sector.reason,
    ratioChecks,
    purificationNote,
    dataReliable: fundamentalsReliable(stock),
  };
}

export interface PortfolioScreeningResult {
  scholarId: string;
  scholarLabel: string;
  results: ScreeningResult[];
  /** Holdings that pass / total holdings. */
  passRate: number;
  /** Sum of market value of passing holdings / total market value. Weight by user input below. */
  weightedPassRate: number;
}

export function screenPortfolio(
  holdings: Array<{ ticker: string; weight: number; stock: StockFundamentals }>,
  scholar: ScholarProfile,
): PortfolioScreeningResult {
  const results = holdings.map((h) => screenStock(h.stock, scholar));
  const passing = results.filter((r) => r.verdict === "pass").length;
  const passRate = results.length === 0 ? 0 : passing / results.length;
  const totalWeight = holdings.reduce((s, h) => s + h.weight, 0) || 1;
  const passingWeight = holdings.reduce(
    (s, h, i) => s + (results[i].verdict === "pass" ? h.weight : 0),
    0,
  );
  return {
    scholarId: scholar.id,
    scholarLabel: scholar.label,
    results,
    passRate,
    weightedPassRate: passingWeight / totalWeight,
  };
}
