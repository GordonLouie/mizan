"use client";

import { useEffect, useMemo, useState } from "react";
import { findStock } from "@/lib/data";
import { getScholar, SCHOLAR_PROFILES } from "@/lib/scholars";
import { loadCustomProfile } from "@/lib/customProfile";
import { screenStock } from "@/lib/screen";
import { loadPortfolio, savePortfolio, newPosition, type Position } from "@/lib/portfolio";
import { currentPrice } from "@/lib/prices";
import ScholarPicker from "@/components/ScholarPicker";
import StockLogo from "@/components/StockLogo";
import CurrencyInput from "@/components/CurrencyInput";
import { Card, PageHeader, Button, Pill, SectionHeader } from "@/components/ui";
import {
  ProgressRing, DonutChart, DonutLegend, HorizontalBars,
  LineChart, LineLegend, sectorColor,
} from "@/components/Charts";
import { VERDICT_LABEL } from "@/lib/verdictLabels";
import type { Verdict } from "@/lib/types";
import { Plus, Trash2, RotateCcw, ArrowUpRight, ArrowDownRight } from "lucide-react";

const VERDICT_COLORS: Record<Verdict, string> = {
  pass: "#16A34A", borderline: "#D97706", fail: "#DC2626",
};

type Period = "1M" | "3M" | "6M" | "1Y" | "2Y" | "ALL";

function generatePerformanceData(period: Period) {
  const monthsByPeriod: Record<Period, number> = {
    "1M": 1, "3M": 3, "6M": 6, "1Y": 12, "2Y": 24, "ALL": 36,
  };
  const months = monthsByPeriod[period];
  const labels: string[] = [];
  const portfolio: number[] = [];
  const spy: number[] = [];
  const spus: number[] = [];

  const baseDate = new Date(2026, 4, 1);
  baseDate.setMonth(baseDate.getMonth() - months);
  let p = 100, sp = 100, sps = 100;

  for (let i = 0; i <= months; i++) {
    const d = new Date(baseDate.getFullYear(), baseDate.getMonth() + i, 1);
    labels.push(d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }));
    // Seeded-ish deterministic walk
    const seed = Math.sin(i * 13.7);
    p *= 1 + (seed * 0.03 + 0.012);
    sp *= 1 + (Math.cos(i * 7.3) * 0.025 + 0.008);
    sps *= 1 + (Math.sin(i * 11.1) * 0.025 + 0.010);
    portfolio.push(p);
    spy.push(sp);
    spus.push(sps);
  }
  return { labels, portfolio, spy, spus };
}

function fmtMoney(n: number): string {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtMoneyShort(n: number): string {
  if (Math.abs(n) >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
  if (Math.abs(n) >= 1e3) return "$" + (n / 1e3).toFixed(1) + "K";
  return fmtMoney(n);
}
function fmtPct(n: number): string {
  return (n >= 0 ? "+" : "") + n.toFixed(2) + "%";
}

export default function PortfolioPage() {
  const [scholarId, setScholarId] = useState("aaoifi");
  const [positions, setPositions] = useState<Position[]>([]);
  const [bump, setBump] = useState(0);
  const [period, setPeriod] = useState<Period>("1Y");
  const [showEditor, setShowEditor] = useState(false);
  const [sortKey, setSortKey] = useState<"value" | "ticker" | "gain">("value");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("mizan.scholarId");
      if (saved && SCHOLAR_PROFILES.some((p) => p.id === saved)) setScholarId(saved);
    } catch {}
    setPositions(loadPortfolio().positions);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const t = setTimeout(() => savePortfolio({ positions }), 400);
    return () => clearTimeout(t);
  }, [positions, hydrated]);

  useEffect(() => {
    const onFocus = () => setBump((b) => b + 1);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const scholar = useMemo(
    () => (scholarId === "custom" ? loadCustomProfile() : getScholar(scholarId)),
    [scholarId, bump],
  );

  // Enrich positions with stock data, price, cost, gain
  const enriched = useMemo(() => {
    return positions
      .map((pos) => {
        const stock = findStock(pos.ticker);
        if (!stock) return null;
        const price = currentPrice(stock);
        const value = pos.shares * price;
        const cost = pos.shares * pos.avgCost;
        const gain = value - cost;
        const gainPct = cost > 0 ? (gain / cost) * 100 : 0;
        const result = screenStock(stock, scholar);
        return { pos, stock, price, value, cost, gain, gainPct, result };
      })
      .filter(Boolean) as Array<{
        pos: Position; stock: any; price: number; value: number;
        cost: number; gain: number; gainPct: number; result: any;
      }>;
  }, [positions, scholar]);

  const totalValue = enriched.reduce((s, e) => s + e.value, 0);
  const totalCost = enriched.reduce((s, e) => s + e.cost, 0);
  const totalGain = totalValue - totalCost;
  const totalGainPct = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;

  const halalValue = enriched
    .filter((e) => e.result.verdict === "pass")
    .reduce((s, e) => s + e.value, 0);
  const halalPct = totalValue > 0 ? (halalValue / totalValue) * 100 : 0;

  const allocationByVerdict = enriched.map((e) => ({
    label: e.stock.ticker,
    value: e.value,
    color: VERDICT_COLORS[e.result.verdict as Verdict],
  }));

  const sectorBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    enriched.forEach((e) => map.set(e.stock.sector, (map.get(e.stock.sector) ?? 0) + e.value));
    const total = totalValue || 1;
    return Array.from(map.entries())
      .map(([label, value]) => ({ label, value: (value / total) * 100, color: sectorColor(label) }))
      .sort((a, b) => b.value - a.value);
  }, [enriched, totalValue]);

  const sortedHoldings = useMemo(() => {
    const out = [...enriched];
    if (sortKey === "value") out.sort((a, b) => b.value - a.value);
    else if (sortKey === "ticker") out.sort((a, b) => a.stock.ticker.localeCompare(b.stock.ticker));
    else if (sortKey === "gain") out.sort((a, b) => b.gainPct - a.gainPct);
    return out;
  }, [enriched, sortKey]);

  const performance = useMemo(() => generatePerformanceData(period), [period]);

  function updatePosition(id: string, patch: Partial<Position>) {
    setPositions((ps) => ps.map((p) => p.id === id ? { ...p, ...patch } : p));
  }
  function removePosition(id: string) {
    setPositions((ps) => ps.filter((p) => p.id !== id));
  }
  function addPosition() {
    setPositions((ps) => [...ps, newPosition()]);
    setShowEditor(true);
  }
  function resetDefaults() {
    if (!confirm("Reset to sample portfolio?")) return;
    try { localStorage.removeItem("mizan.portfolio.v3"); } catch {}
    location.reload();
  }

  return (
    <div className="space-y-10">
      <PageHeader
        kicker="Portfolio"
        title="Your halal investing dashboard"
        description="Real positions with cost basis. Track gain/loss, sector exposure, and compliance under your scholar. Saved to your browser."
        action={
          <Button onClick={() => setShowEditor((s) => !s)} variant="secondary" leftIcon={<Plus size={14} />}>
            {showEditor ? "Hide editor" : "Edit positions"}
          </Button>
        }
      />

      <ScholarPicker value={scholarId} onChange={setScholarId} />

      {/* HERO METRICS */}
      <section className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 sm:grid-cols-4">
        <div className="bg-white p-6">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">Total value</div>
          <div className="mt-2 text-3xl font-bold text-gray-900 tabular-nums" style={{ fontFamily: "Georgia, serif" }}>
            {fmtMoneyShort(totalValue)}
          </div>
          <div className={"mt-1 inline-flex items-center gap-1 text-xs font-medium tabular-nums " +
            (totalGain >= 0 ? "text-emerald-700" : "text-rose-700")}>
            {totalGain >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {fmtPct(totalGainPct)}
            <span className="text-gray-500 font-normal">({fmtMoneyShort(totalGain)})</span>
          </div>
        </div>

        <div className="bg-white p-6">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">Cost basis</div>
          <div className="mt-2 text-3xl font-bold text-gray-900 tabular-nums" style={{ fontFamily: "Georgia, serif" }}>
            {fmtMoneyShort(totalCost)}
          </div>
          <div className="mt-1 text-xs text-gray-500">
            Across {enriched.length} {enriched.length === 1 ? "position" : "positions"}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center bg-white p-4">
          <ProgressRing
            percent={halalPct}
            size={120}
            thickness={10}
            color={halalPct >= 85 ? "#16A34A" : halalPct >= 60 ? "#D97706" : "#DC2626"}
            sublabel="Halal"
          />
        </div>

        <div className="bg-white p-6">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">Halal value</div>
          <div className="mt-2 text-3xl font-bold tabular-nums" style={{ fontFamily: "Georgia, serif", color: halalPct >= 85 ? "#047857" : halalPct >= 60 ? "#B45309" : "#BE123C" }}>
            {fmtMoneyShort(halalValue)}
          </div>
          <div className="mt-1 text-xs text-gray-500">Under {scholar.short}</div>
        </div>
      </section>

      {/* PERFORMANCE CHART */}
      <Card padded={false}>
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-gray-100 px-6 py-5 sm:px-8">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Performance</div>
            <h2 className="mt-1 text-lg font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
              Your portfolio vs benchmarks
            </h2>
          </div>
          <div className="flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 p-1">
            {(["1M","3M","6M","1Y","2Y","ALL"] as Period[]).map((p) => (
              <button key={p} type="button" onClick={() => setPeriod(p)}
                className={
                  "rounded px-2.5 py-1 text-[11px] font-semibold transition-colors " +
                  (period === p
                    ? "bg-white text-navy-800 shadow-sm"
                    : "text-gray-500 hover:text-gray-900")
                }>
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="px-6 pt-6 sm:px-8">
          <LineChart
            labels={performance.labels}
            series={[
              { label: "Your portfolio", color: "#1F3A5F", data: performance.portfolio, bold: true },
              { label: "S&P 500 (SPY)", color: "#94A3B8", data: performance.spy },
              { label: "Halal S&P 500 (SPUS)", color: "#B8860B", data: performance.spus },
            ]}
          />
        </div>
        <div className="border-t border-gray-100 px-6 py-4 sm:px-8">
          <LineLegend series={[
            { label: "Your portfolio", color: "#1F3A5F", data: [], bold: true },
            { label: "S&P 500 (SPY)", color: "#94A3B8", data: [] },
            { label: "Halal S&P 500 (SPUS)", color: "#B8860B", data: [] },
          ]} />
        </div>
      </Card>

      {/* ALLOCATION + SECTOR */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card padded={false}>
          <div className="border-b border-gray-100 px-6 py-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Allocation</div>
            <h3 className="mt-1 text-lg font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>By holding</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 p-6">
            <div className="flex items-center justify-center">
              {allocationByVerdict.length > 0 ? (
                <DonutChart
                  segments={allocationByVerdict}
                  size={180}
                  thickness={22}
                  centerLabel={fmtMoneyShort(totalValue)}
                  centerSublabel="Total"
                />
              ) : (
                <p className="text-sm text-gray-500">No holdings yet</p>
              )}
            </div>
            <div>
              {allocationByVerdict.length > 0 && (
                <DonutLegend segments={allocationByVerdict.slice(0, 8)} />
              )}
            </div>
          </div>
        </Card>

        <Card padded={false}>
          <div className="border-b border-gray-100 px-6 py-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Sector exposure</div>
            <h3 className="mt-1 text-lg font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>By industry</h3>
          </div>
          <div className="p-6">
            {sectorBreakdown.length > 0 ? (
              <HorizontalBars items={sectorBreakdown} />
            ) : (
              <p className="text-sm text-gray-500">Add positions to see sector breakdown</p>
            )}
          </div>
        </Card>
      </section>

      {/* HOLDINGS TABLE */}
      <Card padded={false}>
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-gray-100 px-6 py-5 sm:px-8">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Holdings</div>
            <h3 className="mt-1 text-lg font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>Every position, scored</h3>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500">Sort by:</span>
            {([{ k: "value" as const, l: "Value" }, { k: "ticker" as const, l: "Ticker" }, { k: "gain" as const, l: "Gain %" }]).map((opt) => (
              <button key={opt.k} type="button" onClick={() => setSortKey(opt.k)}
                className={
                  "rounded-md px-2 py-1 font-medium transition-colors " +
                  (sortKey === opt.k ? "bg-navy-50 text-navy-800" : "text-gray-500 hover:text-gray-900")
                }>{opt.l}</button>
            ))}
          </div>
        </div>
        {sortedHoldings.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-gray-500">No positions yet. Click <strong>Edit positions</strong> above to add one.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-[10px] uppercase tracking-widest text-gray-500">
              <tr>
                <th className="px-6 py-3">Stock</th>
                <th className="px-6 py-3 text-right">Shares</th>
                <th className="px-6 py-3 text-right">Avg cost</th>
                <th className="px-6 py-3 text-right">Price</th>
                <th className="px-6 py-3 text-right">Value</th>
                <th className="px-6 py-3 text-right">Gain</th>
                <th className="px-6 py-3 text-right">Verdict</th>
              </tr>
            </thead>
            <tbody>
              {sortedHoldings.map((e) => (
                <tr key={e.pos.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <StockLogo ticker={e.stock.ticker} name={e.stock.name} size={32} />
                      <div>
                        <div className="font-mono text-sm font-semibold text-gray-900">{e.stock.ticker}</div>
                        <div className="text-xs text-gray-500">{e.stock.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-right tabular-nums text-gray-700">{e.pos.shares}</td>
                  <td className="px-6 py-3 text-right tabular-nums text-gray-700">{fmtMoney(e.pos.avgCost)}</td>
                  <td className="px-6 py-3 text-right tabular-nums text-gray-700">{fmtMoney(e.price)}</td>
                  <td className="px-6 py-3 text-right tabular-nums font-semibold text-gray-900">{fmtMoneyShort(e.value)}</td>
                  <td className={"px-6 py-3 text-right tabular-nums font-semibold " + (e.gain >= 0 ? "text-emerald-700" : "text-rose-700")}>
                    {fmtPct(e.gainPct)}
                    <div className="text-xs font-normal text-gray-500">{fmtMoneyShort(e.gain)}</div>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <Pill tone={e.result.verdict === "pass" ? "pass" : e.result.verdict === "borderline" ? "warn" : "fail"}>
                      {VERDICT_LABEL[e.result.verdict as keyof typeof VERDICT_LABEL]}
                    </Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {/* EDITOR */}
      {showEditor && (
        <Card padded={false}>
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-gray-100 px-6 py-5">
            <SectionHeader kicker="Positions editor" title="Add, edit, remove positions" description="All changes save automatically." />
            <div className="flex items-center gap-2 text-xs">
              <Button variant="secondary" size="sm" leftIcon={<RotateCcw size={11} />} onClick={resetDefaults}>
                Reset to sample
              </Button>
            </div>
          </div>
          <div className="space-y-3 px-6 py-5">
            {positions.map((p) => {
              const stock = findStock(p.ticker);
              return (
                <div key={p.id} className="grid grid-cols-12 gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 sm:p-4">
                  <div className="col-span-12 sm:col-span-3">
                    <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-500">Ticker</label>
                    <input
                      type="text" value={p.ticker}
                      onChange={(e) => updatePosition(p.id, { ticker: e.target.value.toUpperCase() })}
                      placeholder="AAPL"
                      className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 font-mono text-sm uppercase tracking-tight focus:border-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-700/10"
                    />
                    {stock && <div className="mt-1 text-[10px] text-gray-500">{stock.name}</div>}
                  </div>
                  <div className="col-span-6 sm:col-span-2">
                    <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-500">Shares</label>
                    <CurrencyInput
                      value={p.shares}
                      onChange={(v) => updatePosition(p.id, { shares: v })}
                      prefix=""
                      placeholder="0"
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-2">
                    <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-500">Avg cost</label>
                    <CurrencyInput
                      value={p.avgCost}
                      onChange={(v) => updatePosition(p.id, { avgCost: v })}
                    />
                  </div>
                  <div className="col-span-9 sm:col-span-3">
                    <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-500">Purchase date</label>
                    <input
                      type="date"
                      value={p.purchaseDate}
                      onChange={(e) => updatePosition(p.id, { purchaseDate: e.target.value })}
                      className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-700/10"
                    />
                  </div>
                  <div className="col-span-3 sm:col-span-2 flex items-end justify-end">
                    <button
                      type="button" onClick={() => removePosition(p.id)}
                      className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-2 text-gray-400 hover:bg-rose-50 hover:text-rose-700"
                      aria-label="Remove position"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
            <Button onClick={addPosition} variant="secondary" leftIcon={<Plus size={14} />}>
              Add position
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
