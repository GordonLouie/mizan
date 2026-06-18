"use client";

/**
 * PortfolioPerformance (Phase 1d) — REAL portfolio performance vs S&P 500.
 *
 * Replaces the old fabricated performance line. Values your CURRENT holdings
 * (shares × real close) across the price window and compares the normalised
 * return to the S&P 500. Honest framing: this is "how today's holdings would
 * have tracked," from real prices via /api/prices — never synthesised.
 */
import { useEffect, useMemo, useState } from "react";
import { toReturnPct, totalReturn } from "@/lib/indicators";

type Holding = { ticker: string; shares: number };
type Pt = { date: string; close: number };

const RANGES: Record<string, number> = { "6M": 126, "1Y": 252, "2Y": 504, All: Number.POSITIVE_INFINITY };
const BENCHES = [
  { sym: "SPY", label: "S&P 500" },
  { sym: "SPUS", label: "Halal S&P (SPUS)" },
  { sym: "QQQ", label: "Nasdaq 100" },
];
const W = 640, H = 240, PAD = 30;

function buildPath(values: number[], min: number, max: number): string {
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

export default function PortfolioPerformance({ holdings }: { holdings: Holding[] }) {
  const [maps, setMaps] = useState<Record<string, Map<string, number>> | null>(null);
  const [spy, setSpy] = useState<Pt[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState<string[]>([]);
  const [range, setRange] = useState<string>("1Y");
  const [bench, setBench] = useState<string>("SPY");

  const tickers = useMemo(
    () => Array.from(new Set(holdings.map((h) => h.ticker.toUpperCase()).filter(Boolean))),
    [holdings],
  );
  const benchLabel = BENCHES.find((b) => b.sym === bench)?.label ?? bench;

  useEffect(() => {
    let alive = true;
    setLoading(true);
    (async () => {
      // Fetch holdings + the chosen benchmark's own series (so the picker actually switches it).
      const [results, benchRes] = await Promise.all([
        Promise.all(tickers.map((t) =>
          fetch(`/api/prices/${encodeURIComponent(t)}`).then((r) => r.json()).catch(() => null))),
        fetch(`/api/prices/${encodeURIComponent(bench)}`).then((r) => r.json()).catch(() => null),
      ]);
      if (!alive) return;
      const m: Record<string, Map<string, number>> = {};
      const miss: string[] = [];
      results.forEach((res, i) => {
        if (res?.series?.length) m[tickers[i]] = new Map(res.series.map((p: Pt) => [p.date, p.close]));
        else miss.push(tickers[i]);
      });
      // Prefer the benchmark's own series; fall back to the incidental one on a holding response.
      let benchSeries: Pt[] | null = benchRes?.series?.length ? benchRes.series : null;
      if (!benchSeries) {
        for (const res of results) if (res?.benchmark?.series?.length) { benchSeries = res.benchmark.series; break; }
      }
      setMaps(m);
      setSpy(benchSeries);
      setMissing(miss);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [tickers, bench]);

  const computed = useMemo(() => {
    if (!maps || !spy?.length) return null;
    const sharesByT = new Map<string, number>();
    for (const h of holdings) {
      const t = h.ticker.toUpperCase();
      if (maps[t]) sharesByT.set(t, (sharesByT.get(t) ?? 0) + h.shares);
    }
    if (sharesByT.size === 0) return null;
    // Reference dates = SPY dates where every held ticker also has a close.
    const refDates = spy
      .map((p) => p.date)
      .filter((d) => [...sharesByT.keys()].every((t) => maps[t]!.has(d)));
    if (refDates.length < 2) return null;
    const n = RANGES[range];
    const dates = n === Number.POSITIVE_INFINITY ? refDates : refDates.slice(Math.max(0, refDates.length - n));
    const spyMap = new Map(spy.map((p) => [p.date, p.close]));
    const portfolioVal = dates.map((d) =>
      [...sharesByT.entries()].reduce((s, [t, sh]) => s + sh * (maps[t]!.get(d) ?? 0), 0));
    const spyVal = dates.map((d) => spyMap.get(d) ?? 0);
    return {
      dates,
      port: toReturnPct(portfolioVal),
      spy: toReturnPct(spyVal),
      portRet: totalReturn(portfolioVal),
      spyRet: totalReturn(spyVal),
    };
  }, [maps, spy, holdings, range]);

  if (loading) return <div className="p-6 text-center text-sm text-gray-400">Loading performance…</div>;
  if (!computed) {
    return (
      <div className="rounded-md border border-amber-200 bg-amber-50/60 p-4 text-[13px] leading-relaxed text-amber-800">
        Not enough real price history to chart this portfolio yet
        {missing.length ? ` (no data for: ${missing.join(", ")})` : ""}. We don&apos;t show estimated
        performance — add holdings with covered tickers, or check back as coverage expands.
      </div>
    );
  }

  const all = [...computed.port, ...computed.spy];
  const min = Math.min(...all), max = Math.max(...all);
  const zeroY = H - PAD - ((0 - min) / (max - min || 1)) * (H - 2 * PAD);

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-[13px] text-gray-700">
          <span className={computed.portRet != null && computed.portRet >= 0 ? "font-semibold text-emerald-700" : "font-semibold text-rose-700"}>
            Your holdings {computed.portRet != null ? `${computed.portRet >= 0 ? "+" : ""}${computed.portRet.toFixed(1)}%` : "—"}
          </span>
          {computed.spyRet != null && (
            <span className="text-gray-500"> · {benchLabel} {computed.spyRet >= 0 ? "+" : ""}{computed.spyRet.toFixed(1)}% over {range}</span>
          )}
        </div>
        <div className="flex gap-1">
          {Object.keys(RANGES).map((r) => (
            <button key={r} type="button" onClick={() => setRange(r)}
              className={"rounded px-2 py-0.5 text-[12px] " + (range === r ? "bg-navy-800 text-white" : "text-gray-500 hover:bg-gray-100")}>{r}</button>
          ))}
        </div>
      </div>

      {/* benchmark picker */}
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Benchmark</span>
        {BENCHES.map((b) => (
          <button key={b.sym} type="button" onClick={() => setBench(b.sym)}
            className={"rounded-md px-2.5 py-1 text-[12px] font-medium transition " + (bench === b.sym ? "bg-navy-800 text-white" : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50")}>{b.label}</button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full" preserveAspectRatio="none" style={{ height: 240 }}>
        <line x1={PAD} y1={zeroY} x2={W - PAD} y2={zeroY} stroke="#d1d5db" strokeDasharray="3 3" />
        <path d={buildPath(computed.spy, min, max)} fill="none" stroke="#94a3b8" strokeWidth={1.5} />
        <path d={buildPath(computed.port, min, max)} fill="none" stroke="#1B2D4A" strokeWidth={2.5} />
        <text x={PAD} y={14} className="fill-gray-400" style={{ fontSize: 10 }}>+{(max).toFixed(0)}%</text>
        <text x={PAD} y={H - PAD + 14} className="fill-gray-400" style={{ fontSize: 10 }}>{(min).toFixed(0)}%</text>
      </svg>

      <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-gray-500">
        <span className="flex items-center gap-1"><span className="inline-block h-0.5 w-4" style={{ background: "#1B2D4A" }} /> Your holdings</span>
        <span className="flex items-center gap-1"><span className="inline-block h-0.5 w-4" style={{ background: "#94a3b8" }} /> {benchLabel}</span>
        {missing.length > 0 && <span className="text-amber-700">· excl. {missing.join(", ")} (no history)</span>}
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-gray-400">
        <span className="font-semibold text-gray-500">Method:</span> your current share counts valued at
        real daily closes, indexed to 0% at the window start, vs {benchLabel} normalised the same way.
        Price-return only — excludes dividends, and deposits/withdrawals (it is not a true account
        time-weighted return). Illustrative; past performance isn&apos;t indicative of future returns.
      </p>
    </div>
  );
}
