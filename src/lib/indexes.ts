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
  risk: IndexRisk;
  /** screen the constituents must PASS (default: Mufti Taqi — strictest mainstream) */
  scholarId: string;
  /** optional theme filter on top of the halal screen */
  filter?: (s: StockFundamentals) => boolean;
  size: number;
}

export const INDEXES: IndexDef[] = [
  {
    slug: "mizan-halal-50",
    name: "Mizan Halal 50",
    tagline: "The 50 largest companies that pass the mainstream AAOIFI halal screen.",
    risk: "Core",
    scholarId: "aaoifi",
    size: 50,
  },
  {
    slug: "mizan-halal-tech",
    name: "Mizan Halal Tech",
    tagline: "Halal-screened technology leaders — higher growth, higher volatility.",
    risk: "Growth",
    scholarId: "aaoifi",
    filter: (s) => s.sector === "Technology",
    size: 25,
  },
  {
    slug: "mizan-halal-income",
    name: "Mizan Halal Income",
    tagline: "Halal-screened dividend payers for investors who want cash flow.",
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
