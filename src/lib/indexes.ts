/**
 * Halal index definitions + constituent selection (Phase 2a). Client-safe —
 * uses fundamentals only (no price history). Performance/backtest lives in
 * indexes.server.ts.
 *
 * Methodology: constituents are the largest companies (by market cap) that PASS
 * the chosen scholar's full screen (default AAOIFI — the basis for most
 * mainstream halal indices, which yields robust, properly-sized baskets),
 * optionally filtered to a theme, capped at `size`. ETFs are excluded.
 */
import { listStocks } from "./data";
import { getScholar } from "./scholars";
import { screenStock } from "./screen";
import { fundamentalsReliable } from "./dataQuality";
import type { StockFundamentals } from "./types";

export type IndexRisk = "Core" | "Growth" | "Income";

export interface IndexDef {
  slug: string;
  name: string;
  tagline: string;
  /** A one-line investment THESIS — what idea this basket expresses (not a return claim). */
  thesis: string;
  risk: IndexRisk;
  /** screen the constituents must PASS (default: Mufti Taqi — strictest mainstream) */
  scholarId: string;
  /** optional theme filter on top of the halal screen */
  filter?: (s: StockFundamentals) => boolean;
  size: number;
}

export const INDEXES: IndexDef[] = [
  {
    slug: "halal-50",
    name: "HalalGauge Halal 50",
    tagline: "The 50 largest companies that pass the mainstream AAOIFI halal screen.",
    thesis: "Broad, large-cap halal exposure — the compliant core of the US market in one list.",
    risk: "Core",
    scholarId: "aaoifi",
    size: 50,
  },
  {
    slug: "halal-tech",
    name: "HalalGauge Halal Tech",
    tagline: "Halal-screened technology leaders.",
    thesis: "Concentrated bet on compliant technology leaders — higher growth, higher volatility.",
    risk: "Growth",
    scholarId: "aaoifi",
    filter: (s) => s.sector === "Technology",
    size: 25,
  },
  {
    slug: "halal-income",
    name: "HalalGauge Halal Income",
    tagline: "Halal-screened dividend payers.",
    thesis: "For investors who want cash flow — compliant companies that actually pay a dividend.",
    risk: "Income",
    scholarId: "aaoifi",
    filter: (s) => (s.dividendYieldPct ?? 0) >= 1.5,
    size: 25,
  },
];

export function getIndexDef(slug: string): IndexDef | undefined {
  return INDEXES.find((i) => i.slug === slug);
}

/** The constituent tickers for an index (real fundamentals + halal screen). */
export function indexConstituents(def: IndexDef): StockFundamentals[] {
  const scholar = getScholar(def.scholarId);
  return listStocks()
    .filter((s) => s.sector !== "ETF")
    .filter((s) => fundamentalsReliable(s)) // never index a name we can't trust the data on
    .filter((s) => screenStock(s, scholar).verdict === "pass")
    .filter((s) => (def.filter ? def.filter(s) : true))
    .sort((a, b) => b.marketCapUsd - a.marketCapUsd)
    .slice(0, def.size);
}

/**
 * Cross-link helper: which indexes currently include this ticker. Powers the
 * "Appears in" chips on a stock page so the screener, indexes and builder feel
 * like one product rather than separate tools.
 */
export function indexesContaining(ticker: string): { slug: string; name: string; risk: IndexRisk }[] {
  const t = ticker.toUpperCase();
  return INDEXES.filter((def) => indexConstituents(def).some((s) => s.ticker.toUpperCase() === t)).map((def) => ({
    slug: def.slug,
    name: def.name,
    risk: def.risk,
  }));
}

/** A constituent flagged as close to breaching a ratio limit — basket "drift" risk. */
export interface DriftFlag {
  ticker: string;
  name: string;
  note: string;
}

/**
 * Present-tense analytics for a basket — computed from CURRENT fundamentals only
 * (no price history, no backtest). This replaces the misleading historical
 * backtest: it tells the user what the basket IS today, what it would cost to
 * purify, and which holdings are drifting toward non-compliance.
 */
export interface BasketAnalytics {
  count: number;
  sectorMix: { sector: string; pct: number }[];
  /** Cap-weighted dividend yield of the basket (%). */
  weightedDivYieldPct: number;
  /** Cap-weighted impermissible-income share — the slice of dividends to purify (%). */
  purificationPctOfDividends: number;
  /** Median interest-bearing debt / market cap across constituents (%). */
  medianDebtPct: number;
  /** Passing holdings sitting close to a ratio limit (drift watch). */
  atRisk: DriftFlag[];
}

export function indexAnalytics(def: IndexDef): BasketAnalytics {
  const scholar = getScholar(def.scholarId);
  const cons = indexConstituents(def);
  const totalCap = cons.reduce((s, c) => s + (c.marketCapUsd || 0), 0) || 1;

  // Sector mix by count.
  const sectorCount = new Map<string, number>();
  for (const c of cons) sectorCount.set(c.sector, (sectorCount.get(c.sector) ?? 0) + 1);
  const sectorMix = Array.from(sectorCount.entries())
    .map(([sector, n]) => ({ sector, pct: cons.length ? (n / cons.length) * 100 : 0 }))
    .sort((a, b) => b.pct - a.pct);

  // Cap-weighted dividend yield + impermissible-income share.
  let wYield = 0;
  let wImperm = 0;
  for (const c of cons) {
    const w = (c.marketCapUsd || 0) / totalCap;
    wYield += w * (c.dividendYieldPct ?? 0);
    wImperm += w * (c.impermissibleIncomePct ?? 0);
  }

  // Median debt ratio.
  const debts = cons.map((c) => c.debtToMarketCapPct ?? 0).sort((a, b) => a - b);
  const medianDebtPct = debts.length ? debts[Math.floor(debts.length / 2)] : 0;

  // Drift watch: passing holdings whose any max-direction ratio sits ≥ 85% of its cap.
  const atRisk: DriftFlag[] = [];
  for (const c of cons) {
    const r = screenStock(c, scholar);
    for (const chk of r.ratioChecks) {
      if (chk.direction === "max" && chk.passes && chk.threshold != null && chk.threshold > 0) {
        if (chk.value >= 0.85 * chk.threshold) {
          atRisk.push({ ticker: c.ticker, name: c.name, note: `${chk.label} at ${chk.value.toFixed(1)}% (cap ${chk.threshold}%)` });
          break;
        }
      }
    }
  }

  return {
    count: cons.length,
    sectorMix,
    weightedDivYieldPct: wYield,
    purificationPctOfDividends: wImperm,
    medianDebtPct,
    atRisk: atRisk.slice(0, 8),
  };
}
