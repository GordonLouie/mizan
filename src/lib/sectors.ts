// Sector deep-dive helpers — derives per-sector aggregates from the screening engine.

import { listStocks } from "./data";
import { getScholar } from "./scholars";
import { screenStock } from "./screen";
import type { StockFundamentals, Verdict } from "./types";

export interface SectorRow {
  stock: StockFundamentals;
  verdict: Verdict;
}

export interface SectorSummary {
  sector: string;
  slug: string;
  total: number;
  pass: number;
  borderline: number;
  fail: number;
  passPct: number;
  totalMarketCapUsd: number;
  passMarketCapUsd: number;
  /** Average dividend yield of the passing names. */
  avgPassingDividendYield: number;
}

export function sectorSlug(sector: string): string {
  return sector.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function sectorFromSlug(slug: string): string | undefined {
  const all = listStocks();
  const seen = new Set<string>();
  for (const s of all) {
    if (!seen.has(s.sector)) {
      seen.add(s.sector);
      if (sectorSlug(s.sector) === slug) return s.sector;
    }
  }
  return undefined;
}

export function listSectors(scholarId: string): SectorSummary[] {
  const scholar = getScholar(scholarId);
  const all = listStocks();
  const map = new Map<string, {
    rows: SectorRow[];
    mcap: number;
    passMcap: number;
    divSum: number;
    divCount: number;
  }>();

  for (const stock of all) {
    const verdict = screenStock(stock, scholar).verdict;
    const entry = map.get(stock.sector) ?? {
      rows: [], mcap: 0, passMcap: 0, divSum: 0, divCount: 0,
    };
    entry.rows.push({ stock, verdict });
    entry.mcap += stock.marketCapUsd;
    if (verdict === "pass") {
      entry.passMcap += stock.marketCapUsd;
      if (stock.dividendYieldPct > 0) {
        entry.divSum += stock.dividendYieldPct;
        entry.divCount += 1;
      }
    }
    map.set(stock.sector, entry);
  }

  return [...map.entries()]
    .map(([sector, e]) => {
      const pass = e.rows.filter((r) => r.verdict === "pass").length;
      const borderline = e.rows.filter((r) => r.verdict === "borderline").length;
      const fail = e.rows.filter((r) => r.verdict === "fail").length;
      return {
        sector,
        slug: sectorSlug(sector),
        total: e.rows.length,
        pass, borderline, fail,
        passPct: e.rows.length ? pass / e.rows.length : 0,
        totalMarketCapUsd: e.mcap,
        passMarketCapUsd: e.passMcap,
        avgPassingDividendYield: e.divCount ? e.divSum / e.divCount : 0,
      };
    })
    .sort((a, b) => b.totalMarketCapUsd - a.totalMarketCapUsd);
}

export function sectorRows(sector: string, scholarId: string): SectorRow[] {
  const scholar = getScholar(scholarId);
  return listStocks()
    .filter((s) => s.sector === sector)
    .map((stock) => ({ stock, verdict: screenStock(stock, scholar).verdict }))
    .sort((a, b) => {
      // Halal first, then by market cap descending
      const order = { pass: 0, borderline: 1, fail: 2 } as const;
      const av = order[a.verdict], bv = order[b.verdict];
      if (av !== bv) return av - bv;
      return b.stock.marketCapUsd - a.stock.marketCapUsd;
    });
}
