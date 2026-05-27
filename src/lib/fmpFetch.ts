/**
 * Financial Modeling Prep client + Mizan ratio computation.
 *
 * Used by scripts/enrichStocks.ts at build time to populate src/data/stocks.json.
 * NOT used at runtime — production reads from the pre-computed JSON.
 *
 * Required env var: FMP_API_KEY  (loaded from .env.local)
 */

import type { StockFundamentals, ProhibitedSector } from "./types";

const FMP_BASE = "https://financialmodelingprep.com/api/v3";

// Approximate risk-free yield used to estimate interest income when companies
// don't report it separately. 4% is a conservative US Treasury-ish proxy as of 2026.
const RISK_FREE_RATE = 0.04;

interface FMPProfile {
  symbol: string;
  companyName: string;
  sector: string | null;
  industry: string | null;
  mktCap: number;
  price: number;
  beta: number;
  lastDiv: number;
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

interface FMPKeyMetrics {
  symbol: string;
  date: string;
  dividendYield: number;
  marketCap: number;
}

async function fmpGet<T>(path: string, apiKey: string): Promise<T | null> {
  const sep = path.includes("?") ? "&" : "?";
  const url = `${FMP_BASE}${path}${sep}apikey=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`FMP ${path} returned ${res.status}`);
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
 * Conservative: only flag explicit matches. Ambiguous industries flag nothing
 * and rely on the ratio screen to catch problems.
 */
export function industryToProhibitedFlags(
  industry: string | null,
  sector: string | null,
): ProhibitedSector[] {
  const flags: ProhibitedSector[] = [];
  const i = (industry ?? "").toLowerCase();
  const s = (sector ?? "").toLowerCase();

  // Alcohol
  if (/\b(beer|wine|spirits|liquor|brewer|distill|alcohol)\b/.test(i)) {
    flags.push("alcohol");
  }
  // Tobacco
  if (/\btobacco\b/.test(i)) {
    flags.push("tobacco");
  }
  // Gambling
  if (/\b(gambling|casino|gaming|lottery)\b/.test(i)) {
    flags.push("gambling");
  }
  // Conventional finance — banks, insurance, credit services, asset managers
  if (
    /\b(bank|insurance|credit services|capital markets|asset management|mortgage|consumer finance|reinsurance)\b/.test(i) ||
    /\bfinancial services\b/.test(s) && /\b(bank|insurance|credit)\b/.test(i)
  ) {
    flags.push("conventional_finance");
  }
  // Weapons / defense
  if (/\b(aerospace.*defense|defense|weapons|firearms)\b/.test(i)) {
    flags.push("weapons");
  }
  // Pork — rarely a standalone industry; defer to ratio + manual flagging
  // Adult entertainment
  if (/\b(adult|gentlemen|entertainment.*adult)\b/.test(i)) {
    flags.push("adult_entertainment");
  }
  // Non-halal food — packaged foods that aren't certified; flag if explicit
  if (/\bpork|swine\b/.test(i)) {
    flags.push("pork");
  }

  return flags;
}

/**
 * Map FMP sector strings to Mizan's display sector taxonomy.
 * Mizan's sectors are looser — used only for display + sector pages.
 */
export function normalizeSector(fmpSector: string | null): string {
  if (!fmpSector) return "Other";
  const s = fmpSector.trim();
  // Direct passthroughs that already match Mizan's display vocabulary
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
 * Returns null if essential data (profile or balance sheet) is missing.
 */
export async function fetchStockFundamentals(
  ticker: string,
  apiKey: string,
): Promise<StockFundamentals | null> {
  if (!apiKey) throw new Error("FMP_API_KEY is required");
  const tk = ticker.toUpperCase().trim();

  // Fetch all 4 endpoints in parallel
  const [profileRes, bsRes, incomeRes, keyMetricsRes] = await Promise.all([
    fmpGet<FMPProfile[]>(`/profile/${tk}`, apiKey),
    fmpGet<FMPBalanceSheet[]>(`/balance-sheet-statement/${tk}?limit=1`, apiKey),
    fmpGet<FMPIncome[]>(`/income-statement/${tk}?limit=1`, apiKey),
    fmpGet<FMPKeyMetrics[]>(`/key-metrics/${tk}?limit=1`, apiKey),
  ]);

  const profile = profileRes?.[0];
  const bs = bsRes?.[0];
  if (!profile || !bs) return null;

  const income = incomeRes?.[0];
  const keyMetrics = keyMetricsRes?.[0];

  const mktCap = profile.mktCap || 1; // avoid divide-by-zero
  const totalAssets = bs.totalAssets || 1;

  // ── Debt ratio ──────────────────────────────────────────────────────────
  const totalDebt = bs.totalDebt ?? (bs.shortTermDebt ?? 0) + (bs.longTermDebt ?? 0);
  const debtToMarketCapPct = (totalDebt / mktCap) * 100;

  // ── Cash + securities ratio ─────────────────────────────────────────────
  const cashAndSecurities =
    bs.cashAndShortTermInvestments ??
    (bs.cashAndCashEquivalents ?? 0) + (bs.shortTermInvestments ?? 0);
  const cashSecuritiesToMarketCapPct = (cashAndSecurities / mktCap) * 100;

  // ── Receivables ratio ───────────────────────────────────────────────────
  const receivablesToMarketCapPct = ((bs.netReceivables ?? 0) / mktCap) * 100;

  // ── Illiquid assets ratio ───────────────────────────────────────────────
  // Mufti Taqi's framework: tangible / total. We approximate as PPE + inventory
  // (most defensible "real, physical" share). Intangibles excluded.
  const illiquid = (bs.propertyPlantEquipmentNet ?? 0) + (bs.inventory ?? 0);
  const illiquidAssetsToTotalAssetsPct = (illiquid / totalAssets) * 100;

  // ── Impermissible income estimate ───────────────────────────────────────
  // Prefer reported interest income; fall back to cash × risk-free-rate proxy.
  let interestIncome = income?.interestIncome ?? 0;
  if (!interestIncome) {
    interestIncome = cashAndSecurities * RISK_FREE_RATE;
  }
  const revenue = income?.revenue || 1;
  const impermissibleIncomePct = (interestIncome / revenue) * 100;

  // ── Dividend yield ──────────────────────────────────────────────────────
  // FMP returns yield as a fraction (0.025 = 2.5%); convert to pct.
  const dividendYieldPct = (keyMetrics?.dividendYield ?? 0) * 100;

  // ── Sector flags ────────────────────────────────────────────────────────
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
