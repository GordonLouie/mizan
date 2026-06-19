/**
 * twelveDataFetch.ts — Twelve Data adapter. SERVER/SCRIPT-ONLY.
 *
 * A drop-in alternative to fmpFetch.fetchStockFundamentals that maps Twelve Data's
 * fundamentals endpoints to HalalGauge's StockFundamentals + screening ratios.
 * Selected at ingestion time via DATA_PROVIDER=twelvedata in scripts/enrichStocks.ts.
 *
 * Why this provider: Twelve Data has a self-serve, commercial PUBLIC-DISPLAY license
 * (Venture tier) that includes global/HKEX fundamentals — unlike most vendors that
 * sales-gate commercial display. Endpoints used per ticker: /profile, /statistics,
 * /balance_sheet, /income_statement  (~260 API credits/ticker — throttle accordingly).
 *
 * CURRENCY: Twelve Data returns market cap AND statements in the instrument's local
 * currency (meta.currency). Ratios (numerator/denominator both local) need NO FX.
 * We only convert market cap to USD (marketCapUsd) for ranking/display.
 *
 * Field paths verified against twelvedata.com/docs (2026-06). HK symbols use the bare
 * local code + mic_code=XHKG (NOT the "0700.HK" suffix).
 */
import { fxPerUsd, industryToProhibitedFlags, normalizeSector } from "./fmpFetch";
import type { StockFundamentals } from "./types";

const TD_BASE = "https://api.twelvedata.com";
const RISK_FREE_RATE = 0.04; // proxy interest yield when interest income isn't reported

/** Map a HalalGauge ticker (possibly suffixed) to a Twelve Data symbol + disambiguation params. */
const SUFFIX_TO_MIC: Record<string, string> = {
  HK: "XHKG", SR: "XSAU", T: "XTKS", DE: "XETR", PA: "XPAR", SW: "XSWX",
  CO: "XCSE", L: "XLON", SI: "XSES", KS: "XKRX", TW: "XTAI", AX: "XASX", TO: "XTSE",
};
function tdSymbol(ticker: string): { symbol: string; extra: Record<string, string> } {
  const t = ticker.toUpperCase().trim();
  const dot = t.lastIndexOf(".");
  if (dot > 0) {
    const base = t.slice(0, dot);
    const suffix = t.slice(dot + 1);
    const mic = SUFFIX_TO_MIC[suffix];
    if (mic) return { symbol: base, extra: { mic_code: mic } };
  }
  return { symbol: t, extra: {} };
}

interface TdError { code?: number; status?: string; message?: string }

async function tdGet<T>(endpoint: string, symbol: string, apiKey: string, extra: Record<string, string> = {}): Promise<T | null> {
  const params = new URLSearchParams({ symbol, ...extra, apikey: apiKey });
  const res = await fetch(`${TD_BASE}/${endpoint}?${params.toString()}`);
  let json: unknown;
  try { json = await res.json(); } catch { return null; }
  // A 200 can still wrap an error body; check status/code in the payload too.
  const maybeErr = json as TdError;
  if (!res.ok || maybeErr?.status === "error") {
    console.warn(`TD ${endpoint} ${symbol}${extra.mic_code ? ` (${extra.mic_code})` : ""} → ${maybeErr?.code ?? res.status}: ${maybeErr?.message ?? "error"}`);
    return null;
  }
  return json as T;
}

interface TdProfile { name?: string; sector?: string; industry?: string; exchange?: string }
interface TdStatistics {
  meta?: { currency?: string };
  statistics?: {
    valuations_metrics?: { market_capitalization?: number };
    dividends_and_splits?: { trailing_annual_dividend_yield?: number; forward_annual_dividend_yield?: number };
  };
}
interface TdBalanceSheet {
  meta?: { currency?: string };
  balance_sheet?: Array<{
    assets?: {
      current_assets?: { cash_and_cash_equivalents?: number; other_short_term_investments?: number; accounts_receivable?: number; inventory?: number };
      non_current_assets?: { properties?: number; land_and_improvements?: number; machinery_furniture_equipment?: number; construction_in_progress?: number; accumulated_depreciation?: number };
      total_assets?: number;
    };
    liabilities?: {
      current_liabilities?: { short_term_debt?: number };
      non_current_liabilities?: { long_term_debt?: number };
    };
  }>;
}
interface TdIncome {
  income_statement?: Array<{ sales?: number; non_operating_interest?: { income?: number; expense?: number } }>;
}

const num = (v: unknown): number => (typeof v === "number" && isFinite(v) ? v : 0);

/** Twelve Data → StockFundamentals. Returns null if essential data (profile + balance sheet) is missing. */
export async function fetchStockFundamentalsTD(ticker: string, apiKey: string): Promise<StockFundamentals | null> {
  if (!apiKey) throw new Error("TWELVE_DATA_API_KEY is required");
  const tk = ticker.toUpperCase().trim();
  const { symbol, extra } = tdSymbol(tk);

  const [profile, stats, bsRes, incRes] = await Promise.all([
    tdGet<TdProfile>("profile", symbol, apiKey, extra),
    tdGet<TdStatistics>("statistics", symbol, apiKey, extra),
    tdGet<TdBalanceSheet>("balance_sheet", symbol, apiKey, { ...extra, period: "annual", outputsize: "1" }),
    tdGet<TdIncome>("income_statement", symbol, apiKey, { ...extra, period: "annual", outputsize: "1" }),
  ]);

  if (!profile) return null;
  const bs = bsRes?.balance_sheet?.[0];
  if (!bs) return null; // can't honestly screen without a balance sheet

  // Local currency (market cap + statements share it) — ratios need no FX.
  const currency = bsRes?.meta?.currency || stats?.meta?.currency || "USD";
  const mktCapLocal = num(stats?.statistics?.valuations_metrics?.market_capitalization) || 1;

  const ca = bs.assets?.current_assets ?? {};
  const nca = bs.assets?.non_current_assets ?? {};
  const totalAssets = num(bs.assets?.total_assets) || 1;

  const totalDebt = num(bs.liabilities?.current_liabilities?.short_term_debt) + num(bs.liabilities?.non_current_liabilities?.long_term_debt);
  const cashAndSecurities = num(ca.cash_and_cash_equivalents) + num(ca.other_short_term_investments);
  const receivables = num(ca.accounts_receivable);
  // Net PP&E ≈ gross property components + accumulated_depreciation (negative).
  const netPPE =
    num(nca.properties) + num(nca.land_and_improvements) + num(nca.machinery_furniture_equipment) +
    num(nca.construction_in_progress) + num(nca.accumulated_depreciation);
  const illiquid = Math.max(0, netPPE) + num(ca.inventory);

  const inc = incRes?.income_statement?.[0];
  const revenue = num(inc?.sales) || 1;
  let interestIncome = num(inc?.non_operating_interest?.income);
  if (!interestIncome) interestIncome = cashAndSecurities * RISK_FREE_RATE;

  // Dividend yield (Twelve Data returns a fraction, e.g. 0.0057 → 0.57%).
  const dy = stats?.statistics?.dividends_and_splits;
  const dividendYieldPct = (num(dy?.trailing_annual_dividend_yield) || num(dy?.forward_annual_dividend_yield)) * 100;

  const sectorFlags = industryToProhibitedFlags(profile.industry ?? null, profile.sector ?? null);

  return {
    ticker: tk,
    name: profile.name ?? tk,
    sector: normalizeSector(profile.sector ?? null),
    marketCapUsd: mktCapLocal / fxPerUsd(currency),
    impermissibleIncomePct: round((interestIncome / revenue) * 100, 2),
    debtToMarketCapPct: round((totalDebt / mktCapLocal) * 100, 2),
    cashSecuritiesToMarketCapPct: round((cashAndSecurities / mktCapLocal) * 100, 2),
    receivablesToMarketCapPct: round((receivables / mktCapLocal) * 100, 2),
    illiquidAssetsToTotalAssetsPct: round((illiquid / totalAssets) * 100, 0),
    sectorFlags,
    dividendYieldPct: round(dividendYieldPct, 2),
  };
}

function round(n: number, decimals: number): number {
  const f = Math.pow(10, decimals);
  return Math.round(n * f) / f;
}
