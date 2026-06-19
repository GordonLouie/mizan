/**
 * Financial Modeling Prep client + HalalGauge ratio computation.
 *
 * Used by scripts/enrichStocks.ts at build time to populate src/data/stocks.json.
 * NOT used at runtime — production reads from the pre-computed JSON.
 *
 * Uses the new "stable" API surface (post-Aug-2025). Legacy /api/v3/ endpoints
 * are inaccessible to new accounts.
 *
 * Required env var: FMP_API_KEY  (loaded from .env.local)
 */

import type {
  StockFundamentals,
  ProhibitedSector,
  BalanceSheetDetails,
  VerdictHistoryEntry,
  ScholarProfile,
  Verdict,
} from "./types";

const FMP_BASE = "https://financialmodelingprep.com/stable";

// Approximate risk-free yield used to estimate interest income when companies
// don't report it separately. 4% is a conservative US Treasury-ish proxy.
const RISK_FREE_RATE = 0.04;

interface FMPProfile {
  symbol: string;
  companyName: string;
  sector: string | null;
  industry: string | null;
  marketCap: number;
  price: number;
  beta: number;
  lastDividend: number;
  isEtf: boolean;
  exchange: string;
}

interface FMPBalanceSheet {
  symbol: string;
  date: string;
  cashAndCashEquivalents: number;
  shortTermInvestments: number;
  cashAndShortTermInvestments: number;
  netReceivables: number;
  inventory: number;
  propertyPlantEquipmentNet: number;
  goodwill: number;
  intangibleAssets: number;
  totalAssets: number;
  shortTermDebt: number;
  longTermDebt: number;
  totalDebt: number;
  reportedCurrency?: string;
}

/**
 * FX normalization. FMP returns each company's balance sheet in its OWN
 * reporting currency, but marketCap is in USD. Dividing a local-currency
 * numerator by a USD market cap produced absurd ratios (Toyota debt = 18,793%
 * of market cap). We convert every monetary balance-sheet figure to USD first.
 *
 * Rates are local units per 1 USD, snapshot June 2026 — REFRESH periodically
 * (e.g. before a big ingestion run). Unknown currencies fall back to 1.0 and
 * log a warning so you know to add them.
 *   Sources: ECB euro reference rates; MTFX historical USD/JPY etc.
 */
const FX_PER_USD: Record<string, number> = {
  USD: 1,
  JPY: 160.24, CNY: 6.78, HKD: 7.82, TWD: 31.59, KRW: 1370,
  INR: 95.65, SGD: 1.34, EUR: 0.87, GBP: 0.79, CHF: 0.81,
  DKK: 6.49, SEK: 9.6, NOK: 10.2, CAD: 1.37, AUD: 1.5,
  BRL: 5.4, MXN: 18.5, SAR: 3.75, AED: 3.67, ZAR: 18.3,
  ILS: 3.7, THB: 35.5, IDR: 16200, MYR: 4.5, PHP: 57,
};

/** Returns local-units-per-USD for a currency code; 1.0 if USD/unknown. */
export function fxPerUsd(currency: string | undefined | null): number {
  if (!currency || currency === "USD") return 1;
  const rate = FX_PER_USD[currency.toUpperCase()];
  if (!rate) {
    console.warn(`[fx] No FX rate for "${currency}" — leaving values unconverted. Add it to FX_PER_USD.`);
    return 1;
  }
  return rate;
}

interface FMPIncome {
  symbol: string;
  date: string;
  revenue: number;
  interestIncome: number;
  interestExpense: number;
}

interface FMPRatios {
  symbol: string;
  date: string;
  dividendYield: number;
}

async function fmpGet<T>(
  path: string,
  symbol: string,
  apiKey: string,
  extraParams: Record<string, string> = {},
): Promise<T | null> {
  const params = new URLSearchParams({ symbol, ...extraParams, apikey: apiKey });
  const url = `${FMP_BASE}${path}?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`FMP ${path}?symbol=${symbol} returned ${res.status}`);
    return null;
  }
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/**
 * Map FMP industry strings to HalalGauge's ProhibitedSector taxonomy.
 * Conservative: only flag explicit matches.
 */
export function industryToProhibitedFlags(
  industry: string | null,
  sector: string | null,
): ProhibitedSector[] {
  const flags: ProhibitedSector[] = [];
  const i = (industry ?? "").toLowerCase();
  const s = (sector ?? "").toLowerCase();

  if (/\b(beer|wine|spirits|liquor|brewer|distill|alcohol)\b/.test(i)) {
    flags.push("alcohol");
  }
  if (/\btobacco\b/.test(i)) {
    flags.push("tobacco");
  }
  if (/\b(gambling|casino|gaming|lottery)\b/.test(i)) {
    flags.push("gambling");
  }
  if (
    /\b(bank|insurance|credit services|capital markets|asset management|mortgage|consumer finance|reinsurance)\b/.test(i) ||
    (/\bfinancial services\b/.test(s) && /\b(bank|insurance|credit)\b/.test(i))
  ) {
    flags.push("conventional_finance");
  }
  if (/\b(aerospace.*defense|defense|weapons|firearms)\b/.test(i)) {
    flags.push("weapons");
  }
  if (/\b(adult|gentlemen|entertainment.*adult)\b/.test(i)) {
    flags.push("adult_entertainment");
  }
  if (/\bpork|swine\b/.test(i)) {
    flags.push("pork");
  }
  return flags;
}

export function normalizeSector(fmpSector: string | null): string {
  if (!fmpSector) return "Other";
  const s = fmpSector.trim();
  const known = [
    "Technology", "Healthcare", "Financial Services", "Consumer Discretionary",
    "Consumer Staples", "Energy", "Industrials", "Materials", "Real Estate",
    "Utilities", "Communication Services",
  ];
  for (const k of known) {
    if (s.toLowerCase() === k.toLowerCase()) return k;
  }
  return s;
}

/**
 * Compute HalalGauge's StockFundamentals from FMP raw data.
 * Returns null if essential data (profile) is missing.
 */
export async function fetchStockFundamentals(
  ticker: string,
  apiKey: string,
): Promise<StockFundamentals | null> {
  if (!apiKey) throw new Error("FMP_API_KEY is required");
  const tk = ticker.toUpperCase().trim();

  // Fetch all endpoints in parallel
  const [profileRes, bsRes, incomeRes, ratiosRes] = await Promise.all([
    fmpGet<FMPProfile[]>("/profile", tk, apiKey),
    fmpGet<FMPBalanceSheet[]>("/balance-sheet-statement", tk, apiKey, { limit: "1" }),
    fmpGet<FMPIncome[]>("/income-statement", tk, apiKey, { limit: "1" }),
    fmpGet<FMPRatios[]>("/ratios", tk, apiKey, { limit: "1" }),
  ]);

  const profile = profileRes?.[0];
  if (!profile) return null;

  const bs = bsRes?.[0];
  // Require balance sheet — without it we can't honestly compute the screening
  // ratios that matter (debt, cash, illiquid assets). Skip rather than report 0s.
  if (!bs) return null;

  const income = incomeRes?.[0];
  const ratios = ratiosRes?.[0];

  const mktCap = profile.marketCap || 1; // avoid divide-by-zero (USD)
  const totalAssets = bs.totalAssets || 1;

  // FMP reports the balance sheet in the company's own currency; marketCap is
  // USD. Convert local-currency numerators to USD before dividing by mktCap.
  const fx = fxPerUsd(bs.reportedCurrency);

  // ── Debt ratio ──
  const totalDebt =
    bs.totalDebt ?? ((bs.shortTermDebt ?? 0) + (bs.longTermDebt ?? 0));
  const debtToMarketCapPct = (totalDebt / fx / mktCap) * 100;

  // ── Cash + securities ratio ──
  const cashAndSecurities =
    bs.cashAndShortTermInvestments ??
    (bs.cashAndCashEquivalents ?? 0) + (bs.shortTermInvestments ?? 0);
  const cashSecuritiesToMarketCapPct = (cashAndSecurities / fx / mktCap) * 100;

  // ── Receivables ratio ──
  const receivablesToMarketCapPct = ((bs.netReceivables ?? 0) / fx / mktCap) * 100;

  // ── Illiquid assets ratio ──
  const illiquid = (bs.propertyPlantEquipmentNet ?? 0) + (bs.inventory ?? 0);
  const illiquidAssetsToTotalAssetsPct = (illiquid / totalAssets) * 100;

  // ── Impermissible income estimate ──
  let interestIncome = income?.interestIncome ?? 0;
  if (!interestIncome) {
    interestIncome = cashAndSecurities * RISK_FREE_RATE;
  }
  const revenue = income?.revenue || 1;
  const impermissibleIncomePct = (interestIncome / revenue) * 100;

  // ── Dividend yield ──
  // /ratios returns dividendYield as a fraction (0.025 = 2.5%); convert to pct.
  // Fall back to profile.lastDividend / price if ratios missing.
  let dividendYieldPct = (ratios?.dividendYield ?? 0) * 100;
  if (!dividendYieldPct && profile.lastDividend && profile.price) {
    dividendYieldPct = (profile.lastDividend / profile.price) * 100;
  }

  // ── Sector flags ──
  const sectorFlags = industryToProhibitedFlags(profile.industry, profile.sector);

  return {
    ticker: tk,
    name: profile.companyName,
    sector: normalizeSector(profile.sector),
    marketCapUsd: mktCap,
    impermissibleIncomePct: round(impermissibleIncomePct, 2),
    debtToMarketCapPct: round(debtToMarketCapPct, 2),
    cashSecuritiesToMarketCapPct: round(cashSecuritiesToMarketCapPct, 2),
    receivablesToMarketCapPct: round(receivablesToMarketCapPct, 2),
    illiquidAssetsToTotalAssetsPct: round(illiquidAssetsToTotalAssetsPct, 0),
    sectorFlags,
    dividendYieldPct: round(dividendYieldPct, 2),
  };
}

function round(n: number, decimals: number): number {
  const f = Math.pow(10, decimals);
  return Math.round(n * f) / f;
}

/* ───────────────────────────────────────────────────────────────────────
   PREMIUM-TIER FUNCTIONS — added after FMP Premium subscription (Day 8)
   These power the new features: Annotated Balance Sheet line items,
   Earnings Calendar, and Verdict-Over-Time chart.
   ─────────────────────────────────────────────────────────────────────── */

/** SEC EDGAR filing URL helper. CIK is fetched from /profile. */
function secFilingUrlForCIK(cik: string | null): string | undefined {
  if (!cik) return undefined;
  const cleanCik = cik.replace(/^0+/, "");
  return `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${cleanCik}&type=10-Q`;
}

/** Quarter label from an ISO date — e.g., "2026-03-29" → "Q1 2026". */
function quarterLabel(isoDate: string): string {
  const d = new Date(isoDate);
  const m = d.getMonth() + 1;
  const q = Math.ceil(m / 3);
  return `Q${q} ${d.getFullYear()}`;
}

interface FMPProfileWithCIK extends FMPProfile {
  cik?: string;
}

/**
 * Fetch a single quarter's full balance sheet line items for the
 * Annotated Balance Sheet view. Premium-tier endpoint.
 */
export async function fetchBalanceSheetDetails(
  ticker: string,
  apiKey: string,
): Promise<BalanceSheetDetails | null> {
  const tk = ticker.toUpperCase().trim();

  const [profileRes, bsRes, incomeRes] = await Promise.all([
    fmpGet<FMPProfileWithCIK[]>("/profile", tk, apiKey),
    fmpGet<Record<string, number | string>[]>(
      "/balance-sheet-statement",
      tk,
      apiKey,
      { period: "quarter", limit: "1" },
    ),
    fmpGet<Record<string, number | string>[]>(
      "/income-statement",
      tk,
      apiKey,
      { period: "quarter", limit: "4" }, // TTM = last 4 quarters
    ),
  ]);

  const profile = profileRes?.[0];
  const bs = bsRes?.[0];
  if (!profile || !bs) return null;

  const reportedDate = String(bs.date ?? "");
  // FMP reports in the company's own currency; normalize everything to USD
  // millions so the line items, totals, and ratios are all in one unit.
  const reportedCurrency = String(bs.reportedCurrency ?? "USD").toUpperCase();
  const fx = fxPerUsd(reportedCurrency);
  const num = (k: string): number => Number(bs[k] ?? 0) / 1_000_000 / fx; // → USD millions

  // TTM = sum of last 4 quarters, converted to USD millions
  const ttm = (k: string): number =>
    (incomeRes ?? []).slice(0, 4).reduce((s, row) => s + Number(row[k] ?? 0), 0) /
    1_000_000 /
    fx;

  return {
    quarter: quarterLabel(reportedDate),
    reportedDate,
    filingUrl: secFilingUrlForCIK(profile.cik ?? null),
    currency: "USD",
    ...(reportedCurrency !== "USD"
      ? { reportingCurrency: reportedCurrency, fxRateToUsd: fx }
      : {}),
    cash: num("cashAndCashEquivalents"),
    marketableSecurities: num("shortTermInvestments"),
    longTermMarketableSecurities: num("longTermInvestments"),
    accountsReceivable: num("netReceivables"),
    inventories: num("inventory"),
    otherCurrentAssets: num("otherCurrentAssets"),
    propertyPlantEquipment: num("propertyPlantEquipmentNet"),
    operatingLeaseAssets:
      Number(bs.operatingLeaseRightOfUseAssets ?? 0) / 1_000_000,
    goodwill: num("goodwill"),
    intangibleAssets: num("intangibleAssets"),
    otherNonCurrentAssets: num("otherNonCurrentAssets"),
    otherIllidquidTangible: 0,
    totalAssets: num("totalAssets"),
    accountsPayable: num("accountPayables"),
    otherCurrentLiabilities: num("otherCurrentLiabilities"),
    deferredRevenue: num("deferredRevenue"),
    shortTermDebt: num("shortTermDebt"),
    commercialPaper: Number(bs.commercialPaper ?? 0) / 1_000_000,
    longTermDebt: num("longTermDebt"),
    otherNonCurrentLiabilities: num("otherNonCurrentLiabilities"),
    totalLiabilities: num("totalLiabilities"),
    totalRevenueTTM: ttm("revenue"),
    productServicesRevenueTTM: ttm("revenue"), // FMP doesn't split — best estimate
    interestIncomeTTM: ttm("interestIncome"),
  };
}

interface FMPEarning {
  date: string;
  symbol: string;
  eps?: number | null;
  epsEstimated?: number | null;
  revenue?: number | null;
  fiscalDateEnding?: string;
}

/**
 * Fetch the next upcoming earnings date for a single ticker.
 * Premium-tier endpoint. Returns ISO date or null.
 */
export async function fetchNextEarningsDate(
  ticker: string,
  apiKey: string,
): Promise<string | null> {
  const tk = ticker.toUpperCase().trim();
  // Pull last 4 entries (mix of past + future); pick first future one.
  const res = await fmpGet<FMPEarning[]>("/earnings", tk, apiKey, { limit: "4" });
  if (!res || res.length === 0) return null;
  const today = new Date().toISOString().slice(0, 10);
  const future = res
    .filter((e) => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
  return future[0]?.date ?? null;
}

/**
 * Fetch historical quarterly fundamentals (8 quarters back), compute the
 * verdict under each mainstream scholar for each quarter, and build the
 * VerdictHistory time series. Premium-tier — pulls 8 balance sheets + 8
 * income statements per ticker.
 */
export async function fetchVerdictHistory(
  ticker: string,
  apiKey: string,
  scholars: ScholarProfile[],
): Promise<VerdictHistoryEntry[]> {
  const tk = ticker.toUpperCase().trim();

  const [profileRes, bsRes, incomeRes] = await Promise.all([
    fmpGet<FMPProfileWithCIK[]>("/profile", tk, apiKey),
    fmpGet<Record<string, number | string>[]>(
      "/balance-sheet-statement",
      tk,
      apiKey,
      { period: "quarter", limit: "8" },
    ),
    fmpGet<Record<string, number | string>[]>(
      "/income-statement",
      tk,
      apiKey,
      { period: "quarter", limit: "8" },
    ),
  ]);

  const profile = profileRes?.[0];
  if (!profile || !bsRes || bsRes.length === 0) return [];

  const mktCap = profile.marketCap || 1;

  // Align balance sheets and income statements by date
  const incomeByDate = new Map<string, Record<string, number | string>>();
  for (const row of incomeRes ?? []) {
    incomeByDate.set(String(row.date), row);
  }

  const history: VerdictHistoryEntry[] = [];

  for (const bs of bsRes.slice(0, 8).reverse()) {
    const date = String(bs.date ?? "");
    if (!date) continue;
    const income = incomeByDate.get(date);

    const num = (k: string): number => Number(bs[k] ?? 0);
    // Convert local-currency balance-sheet figures to USD before dividing by
    // the USD market cap (per-quarter currency, same fix as the other paths).
    const fx = fxPerUsd(bs.reportedCurrency != null ? String(bs.reportedCurrency) : "USD");

    const totalDebt =
      num("totalDebt") || num("shortTermDebt") + num("longTermDebt");
    const cashSec =
      num("cashAndShortTermInvestments") ||
      num("cashAndCashEquivalents") + num("shortTermInvestments");
    const totalAssets = num("totalAssets") || 1;
    const illiquid = num("propertyPlantEquipmentNet") + num("inventory");

    const debtPct = (totalDebt / fx / mktCap) * 100;
    const cashPct = (cashSec / fx / mktCap) * 100;
    const illiquidPct = (illiquid / totalAssets) * 100;

    const interestIncome =
      income && income.interestIncome
        ? Number(income.interestIncome)
        : cashSec * RISK_FREE_RATE;
    const revenue = income && income.revenue ? Number(income.revenue) : 1;
    const impPct = (interestIncome / revenue) * 100;

    const verdictByScholar: Record<string, Verdict> = {};
    const decidingByScholar: Record<string, string> = {};

    for (const scholar of scholars) {
      const failed: string[] = [];
      if (debtPct > scholar.maxDebtToMarketCapPct) failed.push(`Debt ${debtPct.toFixed(1)}%`);
      if (cashPct > scholar.maxCashSecuritiesToMarketCapPct) failed.push(`Cash ${cashPct.toFixed(1)}%`);
      if (impPct > scholar.maxImpermissibleIncomePct) failed.push(`Income ${impPct.toFixed(1)}%`);
      if (
        scholar.minIlliquidAssetsToTotalAssetsPct !== null &&
        illiquidPct < scholar.minIlliquidAssetsToTotalAssetsPct
      ) {
        failed.push(`Illiquid ${illiquidPct.toFixed(1)}%`);
      }
      verdictByScholar[scholar.id] = failed.length === 0 ? "pass" : "fail";
      decidingByScholar[scholar.id] = failed.length === 0
        ? "All checks pass"
        : `Failed: ${failed.join(", ")}`;
    }

    history.push({
      quarter: quarterLabel(date),
      periodEnd: date,
      verdictByScholar,
      decidingByScholar,
    });
  }

  return history;
}
