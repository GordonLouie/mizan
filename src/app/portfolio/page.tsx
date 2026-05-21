"use client";

import { useEffect, useMemo, useState } from "react";
import { findStock } from "@/lib/data";
import { getScholar, SCHOLAR_PROFILES } from "@/lib/scholars";
import { loadCustomProfile } from "@/lib/customProfile";
import { screenPortfolio } from "@/lib/screen";
import ScholarPicker from "@/components/ScholarPicker";
import StockLogo from "@/components/StockLogo";
import CurrencyInput from "@/components/CurrencyInput";
import {
  ProgressRing, DonutChart, DonutLegend, HorizontalBars,
  LineChart, LineLegend, sectorColor,
} from "@/components/Charts";
import { VERDICT_LABEL } from "@/lib/verdictLabels";
import type { Verdict } from "@/lib/types";
import { Plus, Trash2, Check, RotateCcw } from "lucide-react";

interface Row { ticker: string; weight: number; }

const STORAGE_KEY = "mizan.portfolio.v2";

const DEFAULT_ROWS: Row[] = [
  { ticker: "AAPL", weight: 15 },
  { ticker: "MSFT", weight: 15 },
  { ticker: "GOOGL", weight: 10 },
  { ticker: "AMZN", weight: 10 },
  { ticker: "META", weight: 8 },
  { ticker: "NVDA", weight: 10 },
  { ticker: "TSLA", weight: 7 },
  { ticker: "WMT", weight: 5 },
  { ticker: "JPM", weight: 10 },
  { ticker: "JNJ", weight: 10 },
];

const VERDICT_COLORS: Record<Verdict, string> = {
  pass: "#16A34A", borderline: "#D97706", fail: "#DC2626",
};

// Generate plausible mock performance data: portfolio vs SPY vs SPUS over 24 months
function generatePerformanceData() {
  const labels: string[] = [];
  const portfolio: number[] = [];
  const spy: number[] = [];
  const spus: number[] = [];

  const months = 24;
  const baseDate = new Date(2024, 4, 1); // May 2024
  let p = 100, sp = 100, sps = 100;

  for (let i = 0; i < months; i++) {
    const d = new Date(baseDate.getFullYear(), baseDate.getMonth() + i, 1);
    labels.push(d.toLocaleDateString("en-US", { month: "short", year: i % 12 === 0 ? "2-digit" : undefined }));
    // Plausible monthly returns
    p *= 1 + (Math.random() * 0.06 - 0.02);  // mean ~+2%/mo, vol 6%
    sp *= 1 + (Math.random() * 0.05 - 0.018);
    sps *= 1 + (Math.random() * 0.05 - 0.019);
    portfolio.push(p);
    spy.push(sp);
    spus.push(sps);
  }
  return { labels, portfolio, spy, spus };
}

export default function PortfolioPage() {
  const [scholarId, setScholarId] = useState("aaoifi");
  const [rows, setRows] = useState<Row[]>(DEFAULT_ROWS);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [bump, setBump] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("mizan.scholarId");
      if (saved && SCHOLAR_PROFILES.some((p) => p.id === saved)) setScholarId(saved);
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) setRows(parsed);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(rows)); } catch {}
    }, 500);
    return () => clearTimeout(t);
  }, [rows]);

  useEffect(() => {
    const onFocus = () => setBump((b) => b + 1);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const scholar = useMemo(
    () => (scholarId === "custom" ? loadCustomProfile() : getScholar(scholarId)),
    [scholarId, bump],
  );

  const { holdings, missing } = useMemo(() => {
    const found: Array<{ ticker: string; weight: number; stock: any }> = [];
    const miss: string[] = [];
    for (const r of rows) {
      const s = findStock(r.ticker);
      if (s) found.push({ ticker: r.ticker, weight: r.weight, stock: s });
      else if (r.ticker.trim()) miss.push(r.ticker);
    }
    return { holdings: found, missing: miss };
  }, [rows]);

  const score = useMemo(
    () => (holdings.length ? screenPortfolio(holdings, scholar) : null),
    [holdings, scholar],
  );

  // Performance data (regenerated only on mount or scholar change for a small visual shift)
  const performance = useMemo(generatePerformanceData, [scholarId]);

  // Allocation segments by holding (color by verdict)
  const allocationByVerdict = useMemo(() => {
    if (!score) return [];
    return holdings.map((h, i) => ({
      label: h.ticker,
      value: h.weight,
      color: VERDICT_COLORS[score.results[i].verdict],
    }));
  }, [holdings, score]);

  // Sector breakdown
  const sectorBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    holdings.forEach((h) => map.set(h.stock.sector, (map.get(h.stock.sector) ?? 0) + h.weight));
    return Array.from(map.entries())
      .map(([label, value]) => ({ label, value, color: sectorColor(label) }))
      .sort((a, b) => b.value - a.value);
  }, [holdings]);

  function saveNow() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
      const t = new Date().toLocaleTimeString();
      setSavedAt(t);
      setTimeout(() => setSavedAt(null), 3000);
    } catch {}
  }
  function resetDefaults() { setRows(DEFAULT_ROWS); }
  function clearAll() {
    if (!confirm("Clear all holdings?")) return;
    setRows([{ ticker: "", weight: 0 }]);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }

  return (
    <div className="space-y-10">
      <div>
        <div className="text-xs font-semibold uppercase tracking-widest text-gold-600">Portfolio score</div>
        <h1 className="mt-2 text-3xl font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
          How halal is your portfolio?
        </h1>
        <p className="mt-2 max-w-xl text-sm text-gray-600">
          Enter your holdings with their weights. Mizan saves them to your browser and scores
          the portfolio under your chosen scholar in real time.
        </p>
      </div>

      <ScholarPicker value={scholarId} onChange={setScholarId} />

      {/* HERO SUMMARY */}
      {score && (
        <section className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 sm:grid-cols-3">
          <div className="flex flex-col items-center justify-center bg-white p-8">
            <ProgressRing
              percent={score.weightedPassRate * 100}
              size={200}
              color={score.weightedPassRate >= 0.85 ? "#16A34A" : score.weightedPassRate >= 0.6 ? "#D97706" : "#DC2626"}
              sublabel="Weighted halal"
            />
            <p className="mt-4 max-w-xs text-center text-xs text-gray-500">
              of your portfolio by weight passes under {scholar.label}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center bg-white p-8">
            <DonutChart
              segments={allocationByVerdict}
              size={220}
              thickness={26}
              centerLabel={`${holdings.length}`}
              centerSublabel="Holdings"
            />
            <p className="mt-4 text-xs font-medium uppercase tracking-widest text-gray-500">Allocation by verdict</p>
          </div>
          <div className="bg-white p-8">
            <div className="text-xs font-semibold uppercase tracking-widest text-gray-500">Breakdown</div>
            <div className="mt-3 space-y-3">
              {(["pass", "borderline", "fail"] as Verdict[]).map((v) => {
                const filtered = holdings.filter((_, i) => score.results[i].verdict === v);
                const count = filtered.length;
                const wt = filtered.reduce((s, h) => s + h.weight, 0);
                const color = VERDICT_COLORS[v];
                return (
                  <div key={v}>
                    <div className="flex items-baseline justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: color }} />
                        <span className="font-medium text-gray-800">{VERDICT_LABEL[v]}</span>
                      </div>
                      <span className="tabular-nums text-gray-500">{count} / {wt.toFixed(0)}%</span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-gray-100">
                      <div className="h-full rounded-full" style={{ width: `${wt}%`, backgroundColor: color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* PERFORMANCE CHART */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-gray-500">24-month performance</div>
            <h2 className="mt-1 text-xl font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
              Your portfolio vs benchmarks
            </h2>
          </div>
          <span className="text-[11px] uppercase tracking-widest text-gray-400">Simulated · live data on roadmap</span>
        </div>
        <div className="mt-6">
          <LineChart
            labels={performance.labels}
            series={[
              { label: "Your portfolio", color: "#1F3A5F", data: performance.portfolio, bold: true },
              { label: "S&P 500 (SPY)", color: "#94A3B8", data: performance.spy },
              { label: "Halal S&P 500 (SPUS)", color: "#B8860B", data: performance.spus },
            ]}
          />
        </div>
        <div className="mt-4 border-t border-gray-100 pt-4">
          <LineLegend
            series={[
              { label: "Your portfolio", color: "#1F3A5F", data: [], bold: true },
              { label: "S&P 500 (SPY)", color: "#94A3B8", data: [] },
              { label: "Halal S&P 500 (SPUS)", color: "#B8860B", data: [] },
            ]}
          />
        </div>
      </section>

      {/* SECTOR + LEGEND ROW */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-gray-500">Sector exposure</div>
          <h3 className="mt-1 text-lg font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>By industry</h3>
          <div className="mt-5">
            <HorizontalBars items={sectorBreakdown} />
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-gray-500">Holdings</div>
          <h3 className="mt-1 text-lg font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>Where your money is</h3>
          <div className="mt-5">
            <DonutLegend segments={allocationByVerdict} totalLabel={`${allocationByVerdict.length} positions · ${holdings.reduce((s, h) => s + h.weight, 0).toFixed(1)}% allocated`} />
          </div>
        </div>
      </section>

      {/* HOLDINGS TABLE */}
      {score && (
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-6 py-5">
            <div className="text-xs font-semibold uppercase tracking-widest text-gray-500">Holdings table</div>
            <h3 className="mt-1 text-lg font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>Every position, scored</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-[10px] uppercase tracking-widest text-gray-500">
              <tr>
                <th className="px-6 py-3">Stock</th>
                <th className="px-6 py-3 text-right">Weight</th>
                <th className="px-6 py-3">Sector</th>
                <th className="px-6 py-3 text-right">Verdict</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h, i) => {
                const r = score.results[i];
                return (
                  <tr key={h.ticker} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <StockLogo ticker={h.ticker} name={h.stock.name} size={28} />
                        <div>
                          <div className="font-mono text-sm font-semibold text-gray-900">{h.ticker}</div>
                          <div className="text-xs text-gray-500">{h.stock.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-right tabular-nums text-gray-700">{h.weight}%</td>
                    <td className="px-6 py-3 text-xs text-gray-600">{h.stock.sector}</td>
                    <td className="px-6 py-3 text-right">
                      <span className="text-sm font-semibold" style={{ fontFamily: "Georgia, serif", color: VERDICT_COLORS[r.verdict] }}>
                        {VERDICT_LABEL[r.verdict]}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}

      {/* EDITOR */}
      <section className="rounded-2xl border border-gray-200 bg-white">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-gray-100 px-6 py-5">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-gray-500">Edit your holdings</div>
            <h3 className="mt-1 text-lg font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>Holdings editor</h3>
          </div>
          <div className="flex items-center gap-2 text-xs">
            {savedAt && <span className="inline-flex items-center gap-1 text-emerald-700"><Check size={12} /> Saved {savedAt}</span>}
            <button type="button" onClick={resetDefaults} className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-gray-700 hover:bg-gray-50">
              <RotateCcw size={11} /> Defaults
            </button>
            <button type="button" onClick={clearAll} className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-rose-700 hover:bg-rose-50">
              <Trash2 size={11} /> Clear
            </button>
          </div>
        </div>
        <div className="px-6 py-5">
          <div className="grid grid-cols-12 gap-3 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
            <div className="col-span-6 sm:col-span-7">Ticker</div>
            <div className="col-span-4 sm:col-span-3">Weight</div>
            <div className="col-span-2"></div>
          </div>
          <div className="mt-3 space-y-2">
            {rows.map((r, i) => (
              <div key={i} className="grid grid-cols-12 items-center gap-3">
                <input
                  type="text"
                  value={r.ticker}
                  placeholder="AAPL"
                  onChange={(e) => setRows((rs) => rs.map((x, j) => j === i ? { ...x, ticker: e.target.value.toUpperCase() } : x))}
                  className="col-span-6 rounded-md border border-gray-200 px-3 py-2 font-mono text-sm uppercase tracking-tight focus:border-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-700/10 sm:col-span-7"
                />
                <div className="col-span-4 sm:col-span-3">
                  <CurrencyInput
                    value={r.weight}
                    onChange={(v) => setRows((rs) => rs.map((x, j) => j === i ? { ...x, weight: v } : x))}
                    prefix=""
                    suffix="%"
                    placeholder="0"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))}
                  className="col-span-2 inline-flex items-center justify-center rounded-md border border-gray-200 px-3 py-2 text-xs text-gray-500 hover:bg-gray-50 hover:text-rose-700"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setRows((rs) => [...rs, { ticker: "", weight: 0 }])}
            className="mt-4 inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Plus size={14} /> Add holding
          </button>
          {missing.length > 0 && (
            <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              Not in sample dataset (skipped from analysis): <span className="font-mono">{missing.join(", ")}</span>.
              Production version supports any listed equity.
            </div>
          )}
          <button type="button" onClick={saveNow} className="mt-3 hidden">save</button>
        </div>
      </section>
    </div>
  );
}
