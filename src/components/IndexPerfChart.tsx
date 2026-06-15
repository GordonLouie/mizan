"use client";

/**
 * IndexPerfChart (Phase 2) — renders a halal index's REAL backtested return vs
 * S&P 500 (SPY) and halal S&P (SPUS). Series are precomputed server-side
 * (indexes.server) and passed as props — the client only draws. No fabrication.
 */
import { useMemo, useState } from "react";

const W = 660, H = 260, PAD = 32;
const RANGES: Record<string, number> = { "6M": 126, "1Y": 252, "2Y": 504, All: Number.POSITIVE_INFINITY };

function rebase(pct: number[]): number[] {
  // Re-normalise a %-return series to start at 0 for the sliced window.
  if (!pct.length) return pct;
  const base = pct[0];
  // pct are returns from original t0; convert to price-relative then rebase
  return pct.map((p) => ((1 + p / 100) / (1 + base / 100) - 1) * 100);
}

function path(values: number[], min: number, max: number): string {
  const span = max - min || 1;
  const n = values.length;
  return values
    .map((v, i) => {
      const x = PAD + (i / Math.max(1, n - 1)) * (W - 2 * PAD);
      const y = H - PAD - ((v - min) / span) * (H - 2 * PAD);
      return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export default function IndexPerfChart({
  name,
  indexPct,
  spyPct,
  spusPct,
}: {
  name: string;
  indexPct: number[];
  spyPct: number[] | null;
  spusPct: number[] | null;
}) {
  const [range, setRange] = useState<string>("1Y");

  const view = useMemo(() => {
    const n = RANGES[range];
    const sl = (a: number[] | null) =>
      a == null ? null : n === Number.POSITIVE_INFINITY ? a : a.slice(Math.max(0, a.length - n));
    const idx = rebase(sl(indexPct) ?? []);
    const spy = spyPct ? rebase(sl(spyPct)!) : null;
    const spus = spusPct ? rebase(sl(spusPct)!) : null;
    return { idx, spy, spus };
  }, [range, indexPct, spyPct, spusPct]);

  if (!view.idx.length) {
    return <div className="rounded-md border border-amber-200 bg-amber-50/60 p-4 text-[13px] text-amber-800">Backtest data is being prepared for this index.</div>;
  }

  const all = [...view.idx, ...(view.spy ?? []), ...(view.spus ?? [])];
  const min = Math.min(...all), max = Math.max(...all);
  const zeroY = H - PAD - ((0 - min) / (max - min || 1)) * (H - 2 * PAD);
  const last = (a: number[] | null) => (a && a.length ? a[a.length - 1] : null);
  const fmt = (v: number | null) => (v == null ? "—" : `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`);

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-[13px] text-gray-700">
          <span className="font-semibold text-navy-800">{name} {fmt(last(view.idx))}</span>
          {view.spy && <span className="text-gray-500"> · S&amp;P {fmt(last(view.spy))}</span>}
          {view.spus && <span className="text-gray-500"> · SPUS {fmt(last(view.spus))}</span>}
          <span className="text-gray-400"> over {range}</span>
        </div>
        <div className="flex gap-1">
          {Object.keys(RANGES).map((r) => (
            <button key={r} type="button" onClick={() => setRange(r)}
              className={"rounded px-2 py-0.5 text-[12px] " + (range === r ? "bg-navy-800 text-white" : "text-gray-500 hover:bg-gray-100")}>{r}</button>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full" preserveAspectRatio="none" style={{ height: 260 }}>
        <line x1={PAD} y1={zeroY} x2={W - PAD} y2={zeroY} stroke="#d1d5db" strokeDasharray="3 3" />
        {view.spy && <path d={path(view.spy, min, max)} fill="none" stroke="#94a3b8" strokeWidth={1.5} />}
        {view.spus && <path d={path(view.spus, min, max)} fill="none" stroke="#C89030" strokeWidth={1.5} />}
        <path d={path(view.idx, min, max)} fill="none" stroke="#1B2D4A" strokeWidth={2.5} />
        <text x={PAD} y={14} className="fill-gray-400" style={{ fontSize: 10 }}>{fmt(max)}</text>
        <text x={PAD} y={H - PAD + 14} className="fill-gray-400" style={{ fontSize: 10 }}>{fmt(min)}</text>
      </svg>

      <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-gray-500">
        <span className="flex items-center gap-1"><span className="inline-block h-0.5 w-4" style={{ background: "#1B2D4A" }} /> {name}</span>
        {view.spy && <span className="flex items-center gap-1"><span className="inline-block h-0.5 w-4" style={{ background: "#94a3b8" }} /> S&amp;P 500</span>}
        {view.spus && <span className="flex items-center gap-1"><span className="inline-block h-0.5 w-4" style={{ background: "#C89030" }} /> SPUS (halal S&amp;P)</span>}
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-gray-400">
        Equal-weight, buy-and-hold, price-return backtest from real closes. Not advice; past
        performance isn&apos;t indicative of future results.
      </p>
    </div>
  );
}
