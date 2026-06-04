// ---- Core domain types for Mizan's screening engine ----

export type ProhibitedSector =
  | "alcohol"
  | "gambling"
  | "tobacco"
  | "conventional_finance"
  | "weapons"
  | "pork"
  | "adult_entertainment"
  | "non_halal_food";

/** Fundamentals required to screen a security. */
export interface StockFundamentals {
  ticker: string;
  name: string;
  sector: string;
  marketCapUsd: number;
  /** Income from impermissible activities (mostly interest) as % of total revenue. 0-100. */
  impermissibleIncomePct: number;
  /** Interest-bearing debt as % of market cap. 0-100. */
  debtToMarketCapPct: number;
  /** Cash + interest-bearing securities as % of market cap. 0-100. */
  cashSecuritiesToMarketCapPct: number;
  /** Accounts receivable as % of market cap. 0-100. */
  receivablesToMarketCapPct: number;
  /** Illiquid (real / tangible) assets as % of total assets. 0-100. */
  illiquidAssetsToTotalAssetsPct: number;
  /** Primary business activities — used for sector exclusion. */
  sectorFlags: ProhibitedSector[];
  /** Dividend yield, used for purification calc. 0-100. */
  dividendYieldPct: number;
}

export type Verdict = "pass" | "fail" | "borderline";

export interface RatioCheck {
  label: string;
  /** The value observed in the stock, as a % (0-100). */
  value: number;
  /** The scholar's threshold, as a % (0-100). null means no threshold. */
  threshold: number | null;
  /** "max" means value must be <= threshold. "min" means value must be >= threshold. */
  direction: "max" | "min";
  passes: boolean;
  explanation: string;
}

export interface ScreeningResult {
  ticker: string;
  scholarId: string;
  scholarLabel: string;
  /** Primary source attribution for the active scholar's methodology.
   *  Shown inline on the verdict page (per Ibrahim Malik feedback, 2026-06-04). */
  scholarSourceLabel: string;
  verdict: Verdict;
  sectorPasses: boolean;
  sectorReason: string;
  ratioChecks: RatioCheck[];
  purificationNote: string;
}

/** A scholar / standard profile that defines screening rules. */
export interface ScholarProfile {
  id: string;
  label: string;
  short: string;
  blurb: string;
  /** Primary source attribution — shown inline on verdict pages so users can
   *  cross-check the thresholds against the published methodology themselves.
   *  Direct response to user feedback: "reference where the numbers are coming
   *  from, cross check if needed" (Ibrahim Malik, CUHK, 2026-06-04). */
  sourceLabel: string;
  /** Sectors that automatically disqualify a company. */
  excludedSectors: ProhibitedSector[];
  /** Max impermissible-income ratio, % of revenue. null = no cap (i.e. zero-tolerance handled separately). */
  maxImpermissibleIncomePct: number;
  /** Max interest-bearing debt to market cap. */
  maxDebtToMarketCapPct: number;
  /** Max (cash + securities) to market cap. */
  maxCashSecuritiesToMarketCapPct: number;
  /** Max receivables/market cap. null = not screened. */
  maxReceivablesToMarketCapPct: number | null;
  /** Min illiquid assets / total assets. null = not screened. */
  minIlliquidAssetsToTotalAssetsPct: number | null;
  /** "dividends" or "dividends_and_gains". */
  purificationScope: "dividends" | "dividends_and_gains";
  /** Whether this profile is editable by the user (the Custom profile). */
  custom?: boolean;
}
