/**
 * Financial Modeling Prep client + Mizan ratio computation.
 *
 * Used by scripts/enrichStocks.ts at build time to populate src/data/stocks.json.
 * NOT used at runtime — production reads from the pre-computed JSON.
 *
 * Uses the new "stable" API surface (post-Aug-2025). Legacy /api/v3/ endpoints
 * are inaccessible to new accounts.
 *
 * Required env var: FMP_API_KEY  (loaded from .env.local)
 */

import type { StockFundamentals, ProhibitedSector } from "./types";

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
 * Map FMP industry strings to Mizan's ProhibitedSector taxonomy.
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
 * Compute Mizan's StockFundamentals from FMP raw data.
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

  const mktCap = profile.marketCap || 1; // avoid divide-by-zero
  const totalAssets = bs.totalAssets || 1;

  // ── Debt ratio ──
  const totalDebt =
    bs.totalDebt ?? ((bs.shortTermDebt ?? 0) + (bs.longTermDebt ?? 0));
  const debtToMarketCapPct = (totalDebt / mktCap) * 100;

  // ── Cash + securities ratio ──
  const cashAndSecurities =
    bs.cashAndShortTermInvestments ??
    (bs.cashAndCashEquivalents ?? 0) + (bs.shortTermInvestments ?? 0);
  const cashSecuritiesToMarketCapPct = (cashAndSecurities / mktCap) * 100;

  // ── Receivables ratio ──
  const receivablesToMarketCapPct = ((bs.netReceivables ?? 0) / mktCap) * 100;

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
