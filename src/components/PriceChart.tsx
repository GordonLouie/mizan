"use client";

/**
 * PriceChart (v3) — TradingView-grade chart via lightweight-charts.
 *
 * Real data only (/api/prices/[ticker]). Controls sit ABOVE the chart (standard
 * placement). Compare uses quick-pick benchmark CHIPS (incl. the halal S&P, SPUS),
 * not a dropdown, and rebases the axis to % return. A live crosshair readout shows
 * the value under the cursor. Honest empty state when a ticker has no real history.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  createChart, ColorType, LineStyle, CrosshairMode,
  type IChartApi, type ISeriesApi, type Time,
} from "lightweight-charts";
import { sma, ema, rsi, macd, bollinger, toReturnPct, totalReturn } from "@/lib/indicators";

type Pt = { date: string; close: number };
interface Bench { ticker: string; label?: string; series: Pt[] }
interface ApiResp {
  ticker: string;
  real: boolean;
  series: Pt[];
  benchmark: Bench | null;
  benchmarks?: { sym: string; label: string }[];
}

const RANGES: Record<string, number> = { "1M": 21, "6M": 126, "1Y": 252, All: Number.POSITIVE_INFINITY };
const NAVY = "#1B2D4A", GOLD = "#C89030", GRAY = "#9ca3af", EMERALD = "#059669", PURPLE = "#6d28d9";
// Quick-pick benchmarks shown as chips when comparing (the halal S&P is first-class).
const DEFAULT_BENCHES = [
  { sym: "SPY", label: "S&P 500" },
  { sym: "SPUS", label: "Halal S&P (SPUS)" },
  { sym: "QQQ", label: "Nasdaq 100" },
];

const LINE_OPTS = { lineWidth: 2 as const, priceLineVisible: false, lastValueVisible: false };
const baseChart = (el: HTMLDivElement, height: number): IChartApi =>
  createChart(el, {
    height,
    autoSize: true,
    localization: { locale: "en-US" },
    layout: { background: { type: ColorType.Solid, color: "transparent" }, textColor: "#6b7280", fontSize: 11, fontFamily: "inherit" },
    grid: { vertLines: { color: "#f3f4f6" }, horzLines: { color: "#f3f4f6" } },
    rightPriceScale: { borderVisible: false },
    timeScale: { borderVisible: false, fixLeftEdge: true, fixRightEdge: true },
    crosshair: { mode: CrosshairMode.Normal },
    handleScale: { axisPressedMouseMove: false },
  });

function pairs(dates: string[], vals: (number | null)[]) {
  const out: { time: Time; value: number }[] = [];
  for (let i = 0; i < dates.length; i++) {
    const v = vals[i];
    if (v != null && Number.isFinite(v)) out.push({ time: dates[i] as Time, value: v });
  }
  return out;
}

export default function PriceChart({ ticker }: { ticker: string }) {
  const [data, setData] = useState<ApiResp | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("1Y");
  const [bench, setBench] = useState("SPY");
  const [chartType, setChartType] = useState<"area" | "line">("area");
  const [compare, setCompare] = useState(false);
  const [ov, setOv] = useState({ ma: true, ema: false, bb: false });
  const [sub, setSub] = useState({ rsi: false, macd: false });
  const [hover, setHover] = useState<string | null>(null);

  const mainRef = useRef<HTMLDivElement>(null);
  const rsiRef = useRef<HTMLDivElement>(null);
  const macdRef = useRef<HTMLDivElement>(null);

  // fetch (re-fetch when the benchmark changes)
  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch(`/api/prices/${encodeURIComponent(ticker)}?bench=${encodeURIComponent(bench)}`)
      .then((r) => r.json())
      .then((d: ApiResp) => { if (alive) { setData(d); setLoading(false); } })
      .catch(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [ticker, bench]);

  const view = useMemo(() => {
    if (!data?.series?.length) return null;
    const n = RANGES[range];
    const slice = <T,>(a: T[]) => (n === Number.POSITIVE_INFINITY ? a : a.slice(Math.max(0, a.length - n)));
    const s = slice(data.series);
    const dates = s.map((p) => p.date);
    const closes = s.map((p) => p.close);
    const benchCloses = data.benchmark?.series?.length ? slice(data.benchmark.series).map((p) => p.close) : null;
    return { dates, closes, benchCloses };
  }, [data, range]);

  const stockRet = view ? totalReturn(view.closes) : null;
  const benchRet = view?.benchCloses ? totalReturn(view.benchCloses) : null;

  // build charts
  useEffect(() => {
    if (!view || !mainRef.current) return;
    const { dates, closes, benchCloses } = view;
    const charts: IChartApi[] = [];
    const inCompare = compare && !!benchCloses;
    let primary: ISeriesApi<"Area"> | ISeriesApi<"Line"> | null = null;

    // ── main pane ──
    const main = baseChart(mainRef.current, 300);
    charts.push(main);

    if (inCompare && benchCloses) {
      const sPct = pairs(dates, toReturnPct(closes));
      const bPct = pairs(dates, toReturnPct(benchCloses));
      const ls1 = main.addLineSeries({ color: NAVY, ...LINE_OPTS });
      ls1.setData(sPct);
      ls1.createPriceLine({ price: 0, color: "#d1d5db", lineStyle: LineStyle.Dashed, lineWidth: 1, axisLabelVisible: false, title: "" });
      const ls2 = main.addLineSeries({ color: GRAY, ...LINE_OPTS, lineWidth: 1 });
      ls2.setData(bPct);
      primary = ls1;
    } else {
      if (chartType === "area") {
        const a = main.addAreaSeries({ lineColor: NAVY, topColor: "rgba(27,45,74,0.18)", bottomColor: "rgba(27,45,74,0.01)", lineWidth: 2, priceLineVisible: false });
        a.setData(pairs(dates, closes));
        primary = a;
      } else {
        const l = main.addLineSeries({ color: NAVY, ...LINE_OPTS });
        l.setData(pairs(dates, closes));
        primary = l;
      }
      if (ov.ma) main.addLineSeries({ color: GOLD, lineWidth: 1, priceLineVisible: false, lastValueVisible: false }).setData(pairs(dates, sma(closes, 50)));
      if (ov.ema) main.addLineSeries({ color: EMERALD, lineWidth: 1, priceLineVisible: false, lastValueVisible: false }).setData(pairs(dates, ema(closes, 20)));
      if (ov.bb) {
        const bb = bollinger(closes, 20, 2);
        const opt = { color: "#cbd5e1", lineWidth: 1 as const, priceLineVisible: false, lastValueVisible: false, lineStyle: LineStyle.Dotted };
        main.addLineSeries(opt).setData(pairs(dates, bb.upper));
        main.addLineSeries(opt).setData(pairs(dates, bb.lower));
      }
    }
    main.timeScale().fitContent();

    // ── live crosshair readout ──
    if (primary) {
      const ps = primary;
      main.subscribeCrosshairMove((param) => {
        if (!param.time || !param.point) { setHover(null); return; }
        const sd = param.seriesData.get(ps) as { value?: number } | undefined;
        const val = sd?.value;
        if (val == null || !Number.isFinite(val)) { setHover(null); return; }
        const d = String(param.time);
        setHover(inCompare ? `${d} · ${val >= 0 ? "+" : ""}${val.toFixed(1)}%` : `${d} · $${val.toFixed(2)}`);
      });
    }

    // ── RSI sub-pane ──
    if (sub.rsi && rsiRef.current) {
      const c = baseChart(rsiRef.current, 110);
      charts.push(c);
      const s = c.addLineSeries({ color: PURPLE, lineWidth: 1, priceLineVisible: false, lastValueVisible: true });
      s.setData(pairs(dates, rsi(closes, 14)));
      s.createPriceLine({ price: 70, color: "#fca5a5", lineStyle: LineStyle.Dashed, lineWidth: 1, axisLabelVisible: true, title: "70" });
      s.createPriceLine({ price: 30, color: "#fca5a5", lineStyle: LineStyle.Dashed, lineWidth: 1, axisLabelVisible: true, title: "30" });
      c.timeScale().fitContent();
    }

    // ── MACD sub-pane ──
    if (sub.macd && macdRef.current) {
      const c = baseChart(macdRef.current, 110);
      charts.push(c);
      const m = macd(closes);
      const hist = c.addHistogramSeries({ priceLineVisible: false, lastValueVisible: false });
      hist.setData(
        dates.map((d, i) => ({ time: d as Time, value: m.hist[i] ?? 0, color: (m.hist[i] ?? 0) >= 0 ? "rgba(5,150,105,0.5)" : "rgba(220,38,38,0.5)" }))
          .filter((_, i) => m.hist[i] != null),
      );
      c.addLineSeries({ color: NAVY, lineWidth: 1, priceLineVisible: false, lastValueVisible: false }).setData(pairs(dates, m.macd));
      c.addLineSeries({ color: GOLD, lineWidth: 1, priceLineVisible: false, lastValueVisible: false }).setData(pairs(dates, m.signal));
      c.timeScale().fitContent();
    }

    return () => { charts.forEach((c) => c.remove()); };
  }, [view, chartType, compare, ov, sub]);

  if (loading) return <div className="p-6 text-center text-sm text-gray-400">Loading chart…</div>;
  if (!data || !data.real || !view || view.closes.length < 2) {
    return (
      <div className="rounded-md border border-amber-200 bg-amber-50/60 p-4 text-[13px] leading-relaxed text-amber-800">
        Price history for {ticker} is being ingested — the chart will appear once it&apos;s in. We
        don&apos;t show estimated or fabricated prices.
      </div>
    );
  }

  const benchLabel = data.benchmark?.label ?? "S&P 500";
  const benches = data.benchmarks?.length ? data.benchmarks : DEFAULT_BENCHES;
  const compareNoData = compare && !view.benchCloses;
  const chip = (active: boolean) =>
    "rounded-md px-2.5 py-1 text-[12px] font-medium transition " +
    (active ? "bg-navy-800 text-white" : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50");

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      {/* header: return / live readout + range */}
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-[13px] text-gray-700">
          {hover ? (
            <span className="font-mono text-[12px] text-gray-600">{ticker} {hover}</span>
          ) : (
            <>
              <span className="font-semibold text-gray-900">{ticker}</span>{" "}
              <span className={stockRet != null && stockRet >= 0 ? "text-emerald-700" : "text-rose-700"}>
                {stockRet != null ? `${stockRet >= 0 ? "+" : ""}${stockRet.toFixed(1)}%` : "—"}
              </span>{" "}
              <span className="text-gray-400">over {range}</span>
              {compare && benchRet != null && (
                <span className="text-gray-500"> · {benchLabel} {benchRet >= 0 ? "+" : ""}{benchRet.toFixed(1)}%</span>
              )}
            </>
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          {Object.keys(RANGES).map((r) => (
            <button key={r} type="button" onClick={() => setRange(r)} className={chip(range === r)}>{r}</button>
          ))}
        </div>
      </div>

      {/* toolbar — above the chart (standard placement). Type/Overlays hidden in compare. */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-gray-100 py-2.5">
        {!compare && (
          <>
            <div className="flex items-center gap-1">
              <span className="mr-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400">Type</span>
              <button type="button" onClick={() => setChartType("area")} className={chip(chartType === "area")}>Area</button>
              <button type="button" onClick={() => setChartType("line")} className={chip(chartType === "line")}>Line</button>
            </div>
            <div className="flex items-center gap-1">
              <span className="mr-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400">Overlays</span>
              <button type="button" onClick={() => setOv((o) => ({ ...o, ma: !o.ma }))} className={chip(ov.ma)}>MA 50</button>
              <button type="button" onClick={() => setOv((o) => ({ ...o, ema: !o.ema }))} className={chip(ov.ema)}>EMA 20</button>
              <button type="button" onClick={() => setOv((o) => ({ ...o, bb: !o.bb }))} className={chip(ov.bb)}>Bollinger</button>
            </div>
          </>
        )}
        <div className="flex items-center gap-1">
          <span className="mr-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400">Indicators</span>
          <button type="button" onClick={() => setSub((s) => ({ ...s, rsi: !s.rsi }))} className={chip(sub.rsi)}>RSI</button>
          <button type="button" onClick={() => setSub((s) => ({ ...s, macd: !s.macd }))} className={chip(sub.macd)}>MACD</button>
        </div>
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={() => setCompare((c) => !c)} className={chip(compare)}>Compare</button>
          {compare && (
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">vs</span>
              {benches.map((b) => (
                <button key={b.sym} type="button" onClick={() => setBench(b.sym)} className={chip(bench === b.sym)}>{b.label}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* main chart */}
      <div ref={mainRef} className="mt-3 w-full" style={{ height: 300 }} />
      {compareNoData && (
        <p className="mt-2 text-[12px] text-amber-700">No price history for that benchmark yet — pick another.</p>
      )}
      <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-gray-500">
        <span className="flex items-center gap-1"><span className="inline-block h-0.5 w-4" style={{ background: NAVY }} /> {ticker}{compare ? " (% return)" : ""}</span>
        {compare && view.benchCloses && <span className="flex items-center gap-1"><span className="inline-block h-0.5 w-4" style={{ background: GRAY }} /> {benchLabel} (% return)</span>}
        {!compare && ov.ma && <span className="flex items-center gap-1"><span className="inline-block h-0.5 w-4" style={{ background: GOLD }} /> MA 50</span>}
        {!compare && ov.ema && <span className="flex items-center gap-1"><span className="inline-block h-0.5 w-4" style={{ background: EMERALD }} /> EMA 20</span>}
        {!compare && ov.bb && <span className="flex items-center gap-1"><span className="inline-block h-0.5 w-4 border-t border-dotted border-gray-400" /> Bollinger</span>}
      </div>

      {sub.rsi && (
        <div className="mt-3">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">RSI (14)</div>
          <div ref={rsiRef} className="mt-1 w-full" style={{ height: 110 }} />
        </div>
      )}
      {sub.macd && (
        <div className="mt-3">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">MACD (12, 26, 9)</div>
          <div ref={macdRef} className="mt-1 w-full" style={{ height: 110 }} />
        </div>
      )}
    </div>
  );
}
