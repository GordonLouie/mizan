/**
 * Halal index performance backtest (Phase 2b + point-in-time upgrade). SERVER-ONLY.
 *
 * Methodology: equal-weight, buy-and-hold from the start of the common date
 * window — index value[t] = average over constituents of (close_i[t]/close_i[t0]);
 * reported as % return. Benchmarks: S&P 500 (SPY) + halal S&P (SPUS).
 *
 * POINT-IN-TIME SELECTION (the credibility fix): constituents are the N largest by
 * ESTIMATED market cap AT THE START of the backtest window — not today's largest.
 * Picking today's biggest names would be survivorship/look-ahead bias (they're big
 * because they won). We estimate size at t0 as currentMktCap × price_t0/price_now
 * (assumes ~constant shares — fine for ranking). The halal screen still uses
 * current fundamentals (we don't have historical balance sheets); that residual
 * bias is small and disclosed on-page.
 */
import { priceSeries } from "./prices.server";
import { type IndexDef, indexConstituents } from "./indexes";
import { listStocks } from "./data";
import { getScholar } from "./scholars";
import { screenStock } from "./screen";
import type { StockFundamentals } from "./types";

export interface IndexPerformance {
  dates: string[];
  indexPct: number[];
  spyPct: number[] | null;
  spusPct: number[] | null;
  /** The point-in-time selected constituents (for display + the table). */
  constituents: StockFundamentals[];
  constituentsUsed: string[];
  excluded: string[];
  excludedAnomalous: string[];
  /** The inception date the backtest/selection is anchored to. */
  inceptionDate: string | null;
  totalReturn: number | null;
  spyReturn: number | null;
  spusReturn: number | null;
}

const MAX_DAY_UP = 5.0; // +400% one-day = almost certainly an unadjusted action
const MIN_DAY_DOWN = 0.2; // -80%

function hasGlitch(map: Map<string, number>, dates: string[]): boolean {
  let prev: number | undefined;
  for (const d of dates) {
    const v = map.get(d);
    if (v == null || v <= 0) continue;
    if (prev != null) {
      const r = v / prev;
      if (r > MAX_DAY_UP || r < MIN_DAY_DOWN) return true;
    }
    prev = v;
  }
  return false;
}

function alignPct(series: { date: string; close: number }[], dates: string[]): number[] | null {
  if (!series.length) return null;
  const m = new Map(series.map((p) => [p.date, p.close]));
  let last: number | undefined;
  const vals = dates.map((d) => {
    const x = m.get(d);
    if (x != null) last = x;
    return last;
  });
  if (vals[0] == null) return null;
  const base = vals[0]!;
  return vals.map((v) => (v == null ? 0 : ((v - base) / base) * 100));
}

/** First close on or after `t0` in an ascending-by-date series. */
function priceOnOrAfter(series: { date: string; close: number }[], t0: string): number | undefined {
  for (const p of series) if (p.date >= t0) return p.close;
  return undefined;
}

/**
 * Point-in-time constituent selection: the `size` largest by estimated market cap
 * at the backtest inception date, among current halal-passing names that already
 * traded at inception. Falls back to current-size selection if prices are missing.
 */
export function selectConstituentsPIT(def: IndexDef, inception: string | null): StockFundamentals[] {
  if (!inception) return indexConstituents(def);
  const scholar = getScholar(def.scholarId);
  const pool = listStocks()
    .filter((s) => s.sector !== "ETF")
    .filter((s) => screenStock(s, scholar).verdict === "pass")
    .filter((s) => (def.filter ? def.filter(s) : true));

  const ranked = pool
    .map((s) => {
      const ser = priceSeries(s.ticker);
      if (!ser.length) return null;
      const pT0 = priceOnOrAfter(ser, inception);
      const pNow = ser[ser.length - 1].close;
      if (pT0 == null || pNow <= 0) return null; // didn't trade at inception
      const estCapT0 = s.marketCapUsd * (pT0 / pNow);
      return { stock: s, estCapT0 };
    })
    .filter((x): x is { stock: StockFundamentals; estCapT0: number } => x !== null)
    .sort((a, b) => b.estCapT0 - a.estCapT0)
    .slice(0, def.size);

  // If price coverage is too thin to form the basket, fall back gracefully.
  return ranked.length >= Math.min(def.size, 5) ? ranked.map((r) => r.stock) : indexConstituents(def);
}

export function indexPerformance(def: IndexDef): IndexPerformance {
  const spy = priceSeries("SPY");
  const spus = priceSeries("SPUS");
  const inception = spy.length ? spy[0].date : null;

  const constituents = selectConstituentsPIT(def, inception);

  const used: { ticker: string; map: Map<string, number> }[] = [];
  const excluded: string[] = [];
  for (const s of constituents) {
    const ser = priceSeries(s.ticker);
    if (ser.length) used.push({ ticker: s.ticker, map: new Map(ser.map((p) => [p.date, p.close])) });
    else excluded.push(s.ticker);
  }

  const excludedAnomalous: string[] = [];
  const empty: IndexPerformance = {
    dates: [], indexPct: [], spyPct: null, spusPct: null,
    constituents, constituentsUsed: used.map((u) => u.ticker), excluded, excludedAnomalous,
    inceptionDate: inception, totalReturn: null, spyReturn: null, spusReturn: null,
  };
  if (used.length === 0) return empty;

  const axisDates = (set: typeof used) => {
    const axis = spy.length ? spy.map((p) => p.date) : [...set[0].map.keys()];
    return axis.filter((d) => set.every((u) => u.map.has(d)));
  };

  // Pass 1: drop only true data glitches (unadjusted corporate actions).
  let dates = axisDates(used);
  if (dates.length >= 2) {
    const clean = used.filter((u) => {
      const bad = hasGlitch(u.map, dates);
      if (bad) excludedAnomalous.push(u.ticker);
      return !bad;
    });
    if (clean.length) {
      used.length = 0;
      used.push(...clean);
    }
  }
  // Pass 2: recompute the window on the cleaned set.
  dates = axisDates(used);
  if (dates.length < 2) return empty;

  const t0 = dates[0];
  const indexVal = dates.map((d) => {
    let sum = 0;
    for (const u of used) sum += u.map.get(d)! / u.map.get(t0)!;
    return sum / used.length;
  });
  const indexPct = indexVal.map((v) => (v - 1) * 100);
  const spyPct = alignPct(spy, dates);
  const spusPct = alignPct(spus, dates);

  const lastOrNull = (a: number[] | null) => (a && a.length ? a[a.length - 1] : null);
  return {
    dates,
    indexPct,
    spyPct,
    spusPct,
    constituents,
    constituentsUsed: used.map((u) => u.ticker),
    excluded,
    excludedAnomalous,
    inceptionDate: t0,
    totalReturn: indexPct.length ? indexPct[indexPct.length - 1] : null,
    spyReturn: lastOrNull(spyPct),
    spusReturn: lastOrNull(spusPct),
  };
}
