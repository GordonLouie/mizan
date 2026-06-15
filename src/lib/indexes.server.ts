/**
 * Halal index performance backtest (Phase 2b). SERVER-ONLY (imports the price
 * history via prices.server). Methodology: equal-weight, buy-and-hold from the
 * start of the common date window — index value[t] = average over constituents
 * of (close_i[t] / close_i[t0]); reported as % return. Benchmarks (S&P 500 via
 * SPY, halal S&P via SPUS) normalised the same way. Real prices only.
 */
import { priceSeries } from "./prices.server";
import { indexConstituents, type IndexDef } from "./indexes";

export interface IndexPerformance {
  dates: string[];
  indexPct: number[];
  spyPct: number[] | null;
  spusPct: number[] | null;
  constituentsUsed: string[];
  excluded: string[];
  /** constituents dropped for a true data glitch (single-day move > +400%, i.e.
   *  an unadjusted corporate action) — verified-real explosive moves are kept */
  excludedAnomalous: string[];
  totalReturn: number | null;
  spyReturn: number | null;
  spusReturn: number | null;
}

// Minimal glitch guard ONLY. The price feed is split/dividend-adjusted and was
// verified accurate against live quotes (e.g. SanDisk +692% YTD, Micron ~$1,060,
// Netflix post-split ~$80 are all REAL in the 2025-26 AI/memory boom), so we do
// NOT filter on magnitude — that would hide genuine top performers. We exclude a
// constituent only if it has a single-day move so large (> +400% or < -80%) that
// it almost certainly reflects an unadjusted corporate action / bad print.
const MAX_DAY_UP = 5.0; // +400%
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

/** Forward-filled % return of a series, aligned to `dates`. null if unusable. */
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

export function indexPerformance(def: IndexDef): IndexPerformance {
  const cons = indexConstituents(def);
  const used: { ticker: string; map: Map<string, number> }[] = [];
  const excluded: string[] = [];
  for (const s of cons) {
    const ser = priceSeries(s.ticker);
    if (ser.length) used.push({ ticker: s.ticker, map: new Map(ser.map((p) => [p.date, p.close])) });
    else excluded.push(s.ticker);
  }

  const spy = priceSeries("SPY");
  const spus = priceSeries("SPUS");
  const excludedAnomalous: string[] = [];
  const empty: IndexPerformance = {
    dates: [], indexPct: [], spyPct: null, spusPct: null,
    constituentsUsed: used.map((u) => u.ticker), excluded, excludedAnomalous,
    totalReturn: null, spyReturn: null, spusReturn: null,
  };
  if (used.length === 0) return empty;

  // Reference axis: SPY dates (or first constituent's) where EVERY used
  // constituent has a close — keeps the equal-weight maths exact.
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
    constituentsUsed: used.map((u) => u.ticker),
    excluded,
    excludedAnomalous,
    totalReturn: indexPct.length ? indexPct[indexPct.length - 1] : null,
    spyReturn: lastOrNull(spyPct),
    spusReturn: lastOrNull(spusPct),
  };
}
