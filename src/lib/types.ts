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
  /** OPTIONAL: full balance sheet line items, when ingested from primary filings.
   *  When present, the Annotated Balance Sheet view shows full detail.
   *  When absent, the view falls back to totals-only with a transparency note. */
  balanceSheet?: BalanceSheetDetails;
  /** OPTIONAL: last 8 quarters of verdict history per scholar.
   *  When present, the VerdictTimeline component shows the track record.
   *  When absent, the component shows "historical data being ingested". */
  verdictHistory?: VerdictHistoryEntry[];
  /** OPTIONAL: when the company's next earnings report is expected.
   *  ISO date string, e.g. "2026-07-28". */
  nextEarningsDate?: string;
}

/** A single quarter's verdict for a stock, across all scholars.
 *  When ingested from FMP historical fundamentals, computed at build time. */
export interface VerdictHistoryEntry {
  /** Reporting quarter — e.g., "Q2 2026" */
  quarter: string;
  /** ISO date the period ended */
  periodEnd: string;
  /** Verdict under each scholar, keyed by scholar id */
  verdictByScholar: Record<string, Verdict>;
  /** The "deciding" metric that drove a non-PASS verdict (for hover detail) */
  decidingByScholar: Record<string, string>;
}

/** Full balance sheet line items for a single reporting period.
 *  All values in USD millions to match how 10-Q filings are typically reported.
 *  Sourced from primary filings (SEC 10-Q for US, equivalent abroad). */
export interface BalanceSheetDetails {
  /** Reporting period — e.g. "Q1 2026" */
  quarter: string;
  /** When the underlying filing was reported, ISO date */
  reportedDate: string;
  /** Underlying primary source URL (SEC EDGAR for US) */
  filingUrl?: string;
  /** Currency code, default USD */
  currency: string;

  // --- ASSETS ---
  cash: number;
  marketableSecurities: number;
  longTermMarketableSecurities: number;
  accountsReceivable: number;
  inventories: number;
  otherCurrentAssets: number;
  propertyPlantEquipment: number;
  operatingLeaseAssets: number;
  goodwill: number;
  intangibleAssets: number;
  otherNonCurrentAssets: number;
  /** Other tangible illiquid assets (counted toward Mufti Taqi's illiquid floor) */
  otherIllidquidTangible?: number;
  /** Total assets — should equal sum of above */
  totalAssets: number;

  // --- LIABILITIES ---
  accountsPayable: number;
  otherCurrentLiabilities: number;
  deferredRevenue: number;
  shortTermDebt: number;
  commercialPaper: number;
  longTermDebt: number;
  otherNonCurrentLiabilities: number;
  /** Total liabilities */
  totalLiabilities: number;

  // --- INCOME STATEMENT EXCERPT ---
  totalRevenueTTM: number;
  productServicesRevenueTTM: number;
  interestIncomeTTM: number;
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
