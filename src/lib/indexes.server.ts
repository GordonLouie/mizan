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

export interface IndexStats {
  annReturnPct: number;
  annVolPct: number;
  sharpe: number | null;
  maxDrawdownPct: number;
  beta: number | null;
}

export interface IndexPerformance {
  dates: string[];
  indexPct: number[];
  spyPct: number[] | null;
  spusPct: number[] | null;
  /** Risk/reward metrics for the index over the window (null if too little data). */
  stats: IndexStats | null;
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

// ── risk/reward metrics ──────────────────────────────────────────────────────
const TRADING_DAYS = 252;
function mean(xs: number[]): number {
  return xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0;
}
function dailyReturns(vals: number[]): number[] {
  const r: number[] = [];
  for (let i = 1; i < vals.length; i++) if (vals[i - 1] > 0) r.push(vals[i] / vals[i - 1] - 1);
  return r;
}
/** vals = gross-multiple series starting at ~1; spyRel = benchmark gross multiple. */
function computeStats(vals: number[], spyRel: number[] | null): IndexStats | null {
  const n = vals.length;
  if (n < 20 || vals[0] <= 0) return null;
  const years = (n - 1) / TRADING_DAYS;
  const gross = vals[n - 1] / vals[0];
  const annReturn = years > 0 ? Math.pow(gross, 1 / years) - 1 : gross - 1;

  const idxDaily = dailyReturns(vals);
  const m = mean(idxDaily);
  const variance = idxDaily.reduce((s, x) => s + (x - m) ** 2, 0) / Math.max(1, idxDaily.length);
  const annVol = Math.sqrt(variance) * Math.sqrt(TRADING_DAYS);
  const sharpe = annVol > 0 ? annReturn / annVol : null; // rf assumed 0

  let peak = vals[0], maxDD = 0;
  for (const v of vals) {
    if (v > peak) peak = v;
    const dd = v / peak - 1;
    if (dd < maxDD) maxDD = dd;
  }

  let beta: number | null = null;
  if (spyRel && spyRel.length === vals.length) {
    const spyDaily = dailyReturns(spyRel);
    const k = Math.min(idxDaily.length, spyDaily.length);
    const a = idxDaily.slice(0, k), b = spyDaily.slice(0, k);
    const ma = mean(a), mb = mean(b);
    let cov = 0, varb = 0;
    for (let i = 0; i < k; i++) { cov += (a[i] - ma) * (b[i] - mb); varb += (b[i] - mb) ** 2; }
    beta = varb > 0 ? cov / varb : null;
  }

  return {
    annReturnPct: annReturn * 100,
    annVolPct: annVol * 100,
    sharpe,
    maxDrawdownPct: maxDD * 100,
    beta,
  };
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

/** Total return + risk stats for a single benchmark ticker (e.g. SPY) over its
 *  full available window. Used for the index comparison table. */
export function benchmarkStats(symbol: string): { totalReturnPct: number | null; stats: IndexStats | null } {
  const ser = priceSeries(symbol);
  if (ser.length < 20 || ser[0].close <= 0) return { totalReturnPct: null, stats: null };
  const base = ser[0].close;
  const vals = ser.map((p) => p.close / base);
  return { totalReturnPct: (vals[vals.length - 1] - 1) * 100, stats: computeStats(vals, ser.map((p) => p.close / base)) };
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
    dates: [], indexPct: [], spyPct: null, spusPct: null, stats: null,
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
  const spyRel = spyPct ? spyPct.map((p) => 1 + p / 100) : null;
  const stats = computeStats(indexVal, spyRel);

  const lastOrNull = (a: number[] | null) => (a && a.length ? a[a.length - 1] : null);
  return {
    dates,
    indexPct,
    spyPct,
    spusPct,
    stats,
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
