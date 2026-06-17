/**
 * Technical indicators + return math (Phase 1). Pure functions over a close
 * series (oldest → newest). No dependencies. All return arrays aligned to the
 * input length, with leading nulls where the window isn't filled yet.
 */

export function sma(values: number[], period: number): (number | null)[] {
  const out: (number | null)[] = [];
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    if (i >= period) sum -= values[i - period];
    out.push(i >= period - 1 ? sum / period : null);
  }
  return out;
}

export function ema(values: number[], period: number): (number | null)[] {
  const out: (number | null)[] = [];
  const k = 2 / (period + 1);
  let prev: number | null = null;
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) { out.push(null); continue; }
    if (prev === null) {
      // seed with SMA of first `period`
      let s = 0;
      for (let j = i - period + 1; j <= i; j++) s += values[j];
      prev = s / period;
    } else {
      prev = values[i] * k + prev * (1 - k);
    }
    out.push(prev);
  }
  return out;
}

/** Wilder's RSI. Returns 0–100, leading nulls until `period` filled. */
export function rsi(values: number[], period = 14): (number | null)[] {
  const out: (number | null)[] = new Array(values.length).fill(null);
  if (values.length <= period) return out;
  let gain = 0, loss = 0;
  for (let i = 1; i <= period; i++) {
    const d = values[i] - values[i - 1];
    if (d >= 0) gain += d; else loss -= d;
  }
  let avgG = gain / period, avgL = loss / period;
  out[period] = avgL === 0 ? 100 : 100 - 100 / (1 + avgG / avgL);
  for (let i = period + 1; i < values.length; i++) {
    const d = values[i] - values[i - 1];
    const g = d > 0 ? d : 0;
    const l = d < 0 ? -d : 0;
    avgG = (avgG * (period - 1) + g) / period;
    avgL = (avgL * (period - 1) + l) / period;
    out[i] = avgL === 0 ? 100 : 100 - 100 / (1 + avgG / avgL);
  }
  return out;
}

/** EMA over a nullable series (used for MACD signal line). */
function emaNullable(vals: (number | null)[], period: number): (number | null)[] {
  const out: (number | null)[] = new Array(vals.length).fill(null);
  const k = 2 / (period + 1);
  const idxs: number[] = [];
  for (let i = 0; i < vals.length; i++) if (vals[i] != null) idxs.push(i);
  if (idxs.length < period) return out;
  let s = 0;
  for (let j = 0; j < period; j++) s += vals[idxs[j]] as number;
  let prev = s / period;
  out[idxs[period - 1]] = prev;
  for (let j = period; j < idxs.length; j++) {
    const i = idxs[j];
    prev = (vals[i] as number) * k + prev * (1 - k);
    out[i] = prev;
  }
  return out;
}

export interface MACD {
  macd: (number | null)[];
  signal: (number | null)[];
  hist: (number | null)[];
}
export function macd(values: number[], fast = 12, slow = 26, signalPeriod = 9): MACD {
  const ef = ema(values, fast);
  const es = ema(values, slow);
  const macdLine = values.map((_, i) => (ef[i] != null && es[i] != null ? (ef[i] as number) - (es[i] as number) : null));
  const signal = emaNullable(macdLine, signalPeriod);
  const hist = values.map((_, i) => (macdLine[i] != null && signal[i] != null ? (macdLine[i] as number) - (signal[i] as number) : null));
  return { macd: macdLine, signal, hist };
}

export interface Bollinger {
  mid: (number | null)[];
  upper: (number | null)[];
  lower: (number | null)[];
}
export function bollinger(values: number[], period = 20, k = 2): Bollinger {
  const mid = sma(values, period);
  const upper: (number | null)[] = new Array(values.length).fill(null);
  const lower: (number | null)[] = new Array(values.length).fill(null);
  for (let i = period - 1; i < values.length; i++) {
    const m = mid[i];
    if (m == null) continue;
    let v = 0;
    for (let j = i - period + 1; j <= i; j++) v += (values[j] - m) ** 2;
    const sd = Math.sqrt(v / period);
    upper[i] = m + k * sd;
    lower[i] = m - k * sd;
  }
  return { mid, upper, lower };
}

/** Normalize a series to % change from its first value (for ROI comparison). */
export function toReturnPct(values: number[]): number[] {
  if (!values.length) return [];
  const base = values[0] || 1;
  return values.map((v) => ((v - base) / base) * 100);
}

export function totalReturn(values: number[]): number | null {
  if (values.length < 2) return null;
  const a = values[0], b = values[values.length - 1];
  if (!a) return null;
  return ((b - a) / a) * 100;
}
