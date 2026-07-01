/**
 * basketScreen.ts — "look-through" Shariah screening for baskets (ETFs & REITs).
 *
 * A fund is only as halal as what it holds. This module takes a fund and its
 * declared holdings (ticker + weight), screens each holding through the SAME
 * `screenStock` engine used for individual stocks (under a chosen scholar), and
 * rolls the results up into a "basket compliance" summary:
 *
 *   - how many holdings pass (count and %),
 *   - how much of the fund's WEIGHT passes (the number that actually matters for
 *     purification and comfort),
 *   - the failing holdings, each with a plain-English reason,
 *   - for a REIT, the interest-bearing debt surfaced explicitly,
 *   - an overall, deliberately-conservative verdict.
 *
 * Honesty rules baked in:
 *   - Holdings not present in our stock dataset are marked "not covered" and are
 *     EXCLUDED from the pass math (not silently counted as a pass). The share of
 *     un-covered weight is reported so the user knows how much we couldn't see.
 *   - Nothing here is a fatwa. This is an educational look-through, not a ruling.
 */

import type {
  ScreeningResult,
  ScholarProfile,
  StockFundamentals,
  Verdict,
} from "./types";
import { screenStock } from "./screen";
import { findStock } from "./data";

/** One declared holding of a fund. */
export interface Holding {
  ticker: string;
  /** Portfolio weight as a % (0-100). Weights need not sum to 100 — the top
   *  holdings of a fund rarely do; we normalise against the disclosed total. */
  weight: number;
}

/** A fund (ETF or REIT) with its representative top holdings. */
export interface Basket {
  ticker: string;
  name: string;
  kind: "etf" | "reit";
  /** Short human category, e.g. "Halal equity ETF", "Diversified REIT". */
  category: string;
  /** True when the fund markets itself as Shariah-screened. Purely descriptive —
   *  it does NOT short-circuit the look-through; we still screen every holding. */
  shariahBranded: boolean;
  /** One-line plain-English description. */
  blurb: string;
  /** For a single REIT, its own interest-bearing debt / market cap (%). We
   *  surface this prominently because leverage is the usual sticking point for
   *  REITs. Absent for diversified ETFs. */
  reitDebtToMarketCapPct?: number;
  holdings: Holding[];
}

/** Per-holding row after look-through. */
export interface HoldingResult {
  ticker: string;
  weight: number;
  /** Normalised weight as a share (0-100) of the DISCLOSED holdings total. */
  weightShare: number;
  /** True when we found the ticker in our dataset and could actually screen it. */
  covered: boolean;
  /** Company name (from the dataset when covered, else the raw ticker). */
  name: string;
  /** Present only when covered. */
  result?: ScreeningResult;
  /** The single most important reason this holding failed, plain English.
   *  Empty when it passes or isn't covered. */
  failReason: string;
}

export type BasketVerdict = "pass" | "mostly" | "mixed" | "fail" | "unknown";

export interface BasketScreenResult {
  basket: Basket;
  scholarId: string;
  scholarLabel: string;
  scholarSourceLabel: string;
  rows: HoldingResult[];

  /** Counts over the disclosed holdings. */
  totalHoldings: number;
  coveredHoldings: number;
  notCoveredHoldings: number;

  /** Of the COVERED holdings, how many pass (verdict === "pass"). */
  passingCovered: number;
  /** passingCovered / coveredHoldings, as a share 0-100. 0 when none covered. */
  countPassPct: number;

  /** Disclosed weight totals, all as shares 0-100 of disclosed total. */
  coveredWeightPct: number;
  notCoveredWeightPct: number;
  /** Passing weight as a share of COVERED weight (the honest denominator). */
  weightPassPct: number;
  /** Passing weight as a share of ALL disclosed weight (covered + not). Lower —
   *  the conservative reading that treats "we can't see it" as "not counted". */
  weightPassPctOfDisclosed: number;

  /** Failing holdings, sorted by weight descending. */
  failing: HoldingResult[];
  /** Covered holdings that landed on "borderline" (one ratio short). */
  borderline: HoldingResult[];

  overall: BasketVerdict;
  /** For a single REIT: its own leverage, surfaced for clarity. */
  reitDebtToMarketCapPct?: number;
  /** Scholar-flavoured educational note for this basket. */
  scholarNote: string;
}

const SECTOR_LABELS: Record<string, string> = {
  alcohol: "alcohol",
  gambling: "gambling",
  tobacco: "tobacco",
  conventional_finance: "conventional finance (interest-based)",
  weapons: "weapons / defense",
  pork: "pork",
  adult_entertainment: "adult entertainment",
  non_halal_food: "non-halal food",
};

/** Distil a full ScreeningResult into one short, honest failure reason. */
function firstFailReason(r: ScreeningResult): string {
  if (!r.dataReliable) {
    return "Fundamentals look unreliable — verdict withheld (under review).";
  }
  if (!r.sectorPasses) {
    return r.sectorReason;
  }
  const failedRatio = r.ratioChecks.find((c) => !c.passes);
  if (failedRatio) {
    // e.g. "Interest-bearing debt / market cap 58% vs ≤ 30% cap"
    const cap =
      failedRatio.direction === "max"
        ? `≤ ${failedRatio.threshold}%`
        : `≥ ${failedRatio.threshold}%`;
    return `${failedRatio.label}: ${round(failedRatio.value)}% vs ${cap}.`;
  }
  return "Does not pass this scholar's screen.";
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

function verdictOf(r: ScreeningResult | undefined): Verdict | "uncovered" {
  if (!r) return "uncovered";
  // Withheld data is treated as NOT a clean pass for basket math — we only count
  // holdings we can stand behind.
  if (!r.dataReliable) return "borderline";
  return r.verdict;
}

/**
 * Roll up a look-through screen for one basket under one scholar.
 */
export function screenBasket(
  basket: Basket,
  scholar: ScholarProfile,
): BasketScreenResult {
  const disclosedTotal =
    basket.holdings.reduce((s, h) => s + h.weight, 0) || 1;

  const rows: HoldingResult[] = basket.holdings.map((h) => {
    const stock: StockFundamentals | undefined = findStock(h.ticker);
    const weightShare = (h.weight / disclosedTotal) * 100;
    if (!stock) {
      return {
        ticker: h.ticker,
        weight: h.weight,
        weightShare,
        covered: false,
        name: h.ticker,
        failReason: "",
      };
    }
    const result = screenStock(stock, scholar);
    const v = verdictOf(result);
    return {
      ticker: h.ticker,
      weight: h.weight,
      weightShare,
      covered: true,
      name: stock.name,
      result,
      failReason: v === "pass" ? "" : firstFailReason(result),
    };
  });

  const covered = rows.filter((r) => r.covered);
  const notCovered = rows.filter((r) => !r.covered);

  const passingCoveredRows = covered.filter(
    (r) => r.result && verdictOf(r.result) === "pass",
  );
  const borderline = covered.filter(
    (r) => r.result && verdictOf(r.result) === "borderline",
  );
  const failing = covered
    .filter((r) => r.result && verdictOf(r.result) === "fail")
    .concat(borderline)
    .sort((a, b) => b.weightShare - a.weightShare);

  const coveredWeight = covered.reduce((s, r) => s + r.weightShare, 0);
  const notCoveredWeight = notCovered.reduce((s, r) => s + r.weightShare, 0);
  const passingWeight = passingCoveredRows.reduce(
    (s, r) => s + r.weightShare,
    0,
  );

  const countPassPct =
    covered.length === 0 ? 0 : (passingCoveredRows.length / covered.length) * 100;
  const weightPassPct = coveredWeight === 0 ? 0 : (passingWeight / coveredWeight) * 100;
  const weightPassPctOfDisclosed = passingWeight; // already a share of disclosed total

  const overall = deriveVerdict(
    covered.length,
    weightPassPct,
    notCoveredWeight,
  );

  return {
    basket,
    scholarId: scholar.id,
    scholarLabel: scholar.label,
    scholarSourceLabel: scholar.sourceLabel,
    rows,
    totalHoldings: rows.length,
    coveredHoldings: covered.length,
    notCoveredHoldings: notCovered.length,
    passingCovered: passingCoveredRows.length,
    countPassPct,
    coveredWeightPct: coveredWeight,
    notCoveredWeightPct: notCoveredWeight,
    weightPassPct,
    weightPassPctOfDisclosed,
    failing,
    borderline,
    overall,
    reitDebtToMarketCapPct: basket.reitDebtToMarketCapPct,
    scholarNote: buildScholarNote(basket, scholar, weightPassPct, notCoveredWeight),
  };
}

function deriveVerdict(
  coveredCount: number,
  weightPassPct: number,
  notCoveredWeight: number,
): BasketVerdict {
  // If we could barely see the fund, don't pretend to a verdict.
  if (coveredCount === 0 || notCoveredWeight >= 60) return "unknown";
  if (weightPassPct >= 95) return "pass";
  if (weightPassPct >= 80) return "mostly";
  if (weightPassPct >= 40) return "mixed";
  return "fail";
}

function buildScholarNote(
  basket: Basket,
  scholar: ScholarProfile,
  weightPassPct: number,
  notCoveredWeight: number,
): string {
  const parts: string[] = [];

  if (basket.shariahBranded) {
    parts.push(
      `${basket.name} markets itself as Shariah-screened. This look-through re-checks its representative top holdings under ${scholar.label} rather than taking that label on trust.`,
    );
  } else {
    parts.push(
      `${basket.name} is a conventional fund with no Shariah screen. We apply ${scholar.label}'s thresholds to its representative top holdings to show what a Muslim investor would actually be exposed to.`,
    );
  }

  if (basket.kind === "reit") {
    parts.push(
      "For a REIT, the usual sticking point is riba (interest) — REITs typically carry sizeable interest-bearing debt and may earn interest on cash. Watch the debt-to-market-cap figure below closely under your scholar's cap.",
    );
  }

  if (weightPassPct >= 95) {
    parts.push(
      "On the holdings we cover, the fund looks broadly clean under this standard — but a passing basket can still carry a small non-permissible income slice, so purification of the tainted portion still applies.",
    );
  } else if (weightPassPct < 40) {
    parts.push(
      "A large share of the covered weight fails this standard. A broad conventional fund typically holds banks and other interest-based names, which is why it rarely passes as a whole.",
    );
  }

  if (notCoveredWeight >= 20) {
    parts.push(
      `We could not screen roughly ${Math.round(notCoveredWeight)}% of the disclosed weight (those tickers aren't in our dataset). Treat the compliant figure as a ceiling, not a guarantee.`,
    );
  }

  return parts.join(" ");
}

export const BASKET_VERDICT_META: Record<
  BasketVerdict,
  { label: string; tone: "pass" | "warn" | "fail" | "muted"; blurb: string }
> = {
  pass: {
    label: "Broadly compliant",
    tone: "pass",
    blurb: "Nearly all of the covered weight passes this standard.",
  },
  mostly: {
    label: "Mostly compliant",
    tone: "warn",
    blurb: "Most of the covered weight passes, with a meaningful failing slice.",
  },
  mixed: {
    label: "Mixed",
    tone: "warn",
    blurb: "A substantial share of the covered weight fails this standard.",
  },
  fail: {
    label: "Not compliant",
    tone: "fail",
    blurb: "Most of the covered weight fails this standard.",
  },
  unknown: {
    label: "Not enough coverage",
    tone: "muted",
    blurb: "Too little of the fund is in our dataset to reach a verdict.",
  },
};
