"use client";

/**
 * PriceChart (Phase 1) — dependency-free SVG price chart.
 *
 * Fetches /api/prices/[ticker] (real data only — never fabricated). Modes:
 *  - Price line + optional 50-day moving average
 *  - "Compare to S&P 500": both normalised to % return (ROI comparison)
 *  - Optional RSI(14) sub-panel
 * If a ticker has no real history yet, it shows an honest "being ingested" note.
 */
import { useEffect, useMemo, useState } from "react";
import { sma, rsi, toReturnPct, totalReturn } from "@/lib/indicators";

type Pt = { date: string; close: number };
interface ApiResp {
  ticker: string;
  real: boolean;
  series: Pt[];
  benchmark: { ticker: string; series: Pt[] } | null;
}

const RANGES: Record<string, number> = { "1M": 21, "6M": 126, "1Y": 252, All: Number.POSITIVE_INFINITY };
const W = 640, H = 220, PAD = 28;

function path(values: (number | null)[], min: number, max: number, w = W, h = H, pad = PAD): string {
  const span = max - min || 1;
  const n = values.length;
  let d = "";
  let started = false;
  values.forEach((v, i) => {
    if (v === null || !Number.isFinite(v)) { started = false; return; }
    const x = pad + (i / Math.max(1, n - 1)) * (w - 2 * pad);
    const y = h - pad - ((v - min) / span) * (h - 2 * pad);
    d += `${started ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)} `;
    started = true;
  });
  return d.trim();
}

export default function PriceChart({ ticker }: { ticker: string }) {
  const [data, setData] = useState<ApiResp | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<string>("1Y");
  const [compare, setCompare] = useState(false);
  const [showMA, setShowMA] = useState(true);
  const [showRSI, setShowRSI] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch(`/api/prices/${encodeURIComponent(ticker)}`)
      .then((r) => r.json())
      .then((d: ApiResp) => { if (alive) { setData(d); setLoading(false); } })
      .catch(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [ticker]);

  const view = useMemo(() => {
    if (!data || !data.series?.length) return null;
    const n = RANGES[range];
    const slice = <T,>(arr: T[]) => (n === Number.POSITIVE_INFINITY ? arr : arr.slice(Math.max(0, arr.length - n)));
    const s = slice(data.series);
    const closes = s.map((p) => p.close);
    const benchCloses = compare && data.benchmark?.series?.length ? slice(data.benchmark.series).map((p) => p.close) : null;
    return { dates: s.map((p) => p.date), closes, benchCloses };
  }, [data, range, compare]);

  if (loading) return <div className="p-6 text-center text-sm text-gray-400">Loading chart…</div>;
  if (!data || !data.real || !view || view.closes.length < 2) {
    return (
      <div className="rounded-md border border-amber-200 bg-amber-50/60 p-4 text-[13px] leading-relaxed text-amber-800">
        Price history for {ticker} is being ingested — the chart will appear once it&apos;s in. We
        don&apos;t show estimated or fabricated prices.
      </div>
    );
  }

  const { closes, benchCloses } = view;
  const stockRet = totalReturn(closes);
  const benchRet = benchCloses ? totalReturn(benchCloses) : null;

  // Build series for the chosen mode
  let line1: number[], line2: number[] | null = null, maLine: (number | null)[] | null = null, unit: string;
  if (compare && benchCloses) {
    line1 = toReturnPct(closes);
    line2 = toReturnPct(benchCloses);
    unit = "%";
  } else {
    line1 = closes;
    maLine = showMA ? sma(closes, 50) : null;
    unit = "$";
  }
  const all = [...line1, ...(line2 ?? []), ...((maLine ?? []).filter((v): v is number => v !== null))];
  const min = Math.min(...all), max = Math.max(...all);

  const rsiVals = showRSI ? rsi(closes, 14) : null;
  const fmt = (v: number | null) => (v === null ? "—" : unit === "%" ? `${v >= 0 ? "+" : ""}${v.toFixed(1)}%` : `$${v.toFixed(0)}`);

  const Toggle = ({ on, set, children }: { on: boolean; set: (b: boolean) => void; children: React.ReactNode }) => (
    <button type="button" onClick={() => set(!on)}
      className={"rounded-md border px-2.5 py-1 text-[12px] font-medium transition " + (on ? "border-navy-700 bg-navy-50 text-navy-800" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50")}>
      {children}
    </button>
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      {/* header: ROI summary */}
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-[13px] text-gray-700">
          <span className="font-semibold text-gray-900">{ticker}</span>{" "}
          <span className={stockRet != null && stockRet >= 0 ? "text-emerald-700" : "text-rose-700"}>
            {stockRet != null ? `${stockRet >= 0 ? "+" : ""}${stockRet.toFixed(1)}%` : "—"}
          </span>{" "}
          <span className="text-gray-400">over {range}</span>
          {benchRet != null && (
            <span className="text-gray-500"> · S&amp;P {benchRet >= 0 ? "+" : ""}{benchRet.toFixed(1)}%</span>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Object.keys(RANGES).map((r) => (
            <button key={r} type="button" onClick={() => setRange(r)}
              className={"rounded px-2 py-0.5 text-[12px] " + (range === r ? "bg-navy-800 text-white" : "text-gray-500 hover:bg-gray-100")}>{r}</button>
          ))}
        </div>
      </div>

      {/* main chart */}
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full" preserveAspectRatio="none" style={{ height: 220 }}>
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#e5e7eb" />
        {compare && (
          <line x1={PAD} y1={H - PAD - ((0 - min) / (max - min || 1)) * (H - 2 * PAD)} x2={W - PAD}
            y2={H - PAD - ((0 - min) / (max - min || 1)) * (H - 2 * PAD)} stroke="#d1d5db" strokeDasharray="3 3" />
        )}
        {maLine && <path d={path(maLine, min, max)} fill="none" stroke="#C89030" strokeWidth={1.5} opacity={0.9} />}
        {line2 && <path d={path(line2, min, max)} fill="none" stroke="#9ca3af" strokeWidth={1.5} />}
        <path d={path(line1, min, max)} fill="none" stroke="#1B2D4A" strokeWidth={2} />
        <text x={PAD} y={14} className="fill-gray-400" style={{ fontSize: 10 }}>{fmt(max)}</text>
        <text x={PAD} y={H - PAD + 14} className="fill-gray-400" style={{ fontSize: 10 }}>{fmt(min)}</text>
      </svg>

      {/* legend */}
      <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-gray-500">
        <span className="flex items-center gap-1"><span className="inline-block h-0.5 w-4" style={{ background: "#1B2D4A" }} /> {ticker}</span>
        {line2 && <span className="flex items-center gap-1"><span className="inline-block h-0.5 w-4" style={{ background: "#9ca3af" }} /> S&amp;P 500</span>}
        {maLine && <span className="flex items-center gap-1"><span className="inline-block h-0.5 w-4" style={{ background: "#C89030" }} /> 50-day MA</span>}
      </div>

      {/* RSI panel */}
      {rsiVals && (
        <div className="mt-3">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">RSI (14)</div>
          <svg viewBox={`0 0 ${W} 80`} className="mt-1 w-full" preserveAspectRatio="none" style={{ height: 80 }}>
            <line x1={PAD} y1={80 - 60 * 0.3 - 10} x2={W - PAD} y2={80 - 60 * 0.3 - 10} stroke="#fca5a5" strokeDasharray="3 3" />
            <line x1={PAD} y1={80 - 60 * 0.7 - 10} x2={W - PAD} y2={80 - 60 * 0.7 - 10} stroke="#fca5a5" strokeDasharray="3 3" />
            <path d={path(rsiVals, 0, 100, W, 80, 10)} fill="none" stroke="#6d28d9" strokeWidth={1.5} />
            <text x={PAD} y={12} className="fill-gray-400" style={{ fontSize: 9 }}>70</text>
            <text x={PAD} y={72} className="fill-gray-400" style={{ fontSize: 9 }}>30</text>
          </svg>
        </div>
      )}

      {/* controls */}
      <div className="mt-3 flex flex-wrap gap-2">
        <Toggle on={compare} set={setCompare}>Compare to S&amp;P 500</Toggle>
        {!compare && <Toggle on={showMA} set={setShowMA}>50-day MA</Toggle>}
        <Toggle on={showRSI} set={setShowRSI}>RSI</Toggle>
      </div>
    </div>
  );
}
