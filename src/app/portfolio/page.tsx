"use client";

import { useEffect, useMemo, useState } from "react";
import { findStock } from "@/lib/data";
import { getScholar, SCHOLAR_PROFILES } from "@/lib/scholars";
import { loadCustomProfile } from "@/lib/customProfile";
import { screenStock } from "@/lib/screen";
import { loadPortfolio, savePortfolio, newPosition, type Position } from "@/lib/portfolio";
import { currentPrice } from "@/lib/prices";
import ScholarPicker from "@/components/ScholarPicker";
import CurrencyInput from "@/components/CurrencyInput";
import EarningsWidget from "@/components/EarningsWidget";
import {
  ProgressRing, DonutChart, DonutLegend, HorizontalBars,
  LineChart, LineLegend, sectorColor,
} from "@/components/Charts";
import { VERDICT_LABEL } from "@/lib/verdictLabels";
import type { Verdict, StockFundamentals, ScreeningResult } from "@/lib/types";
import { Plus, Trash2, RotateCcw, ArrowUpRight, ArrowDownRight } from "lucide-react";

const VERDICT_COLORS: Record<Verdict, string> = {
  pass: "#047857", borderline: "#B45309", fail: "#BE123C",
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

interface EnrichedPosition {
  pos: Position;
  stock: StockFundamentals;
  price: number;
  value: number;
  cost: number;
  gain: number;
  gainPct: number;
  result: ScreeningResult;
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

  const enriched: EnrichedPosition[] = useMemo(() => {
    return positions
      .map((pos): EnrichedPosition | null => {
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
      .filter((x): x is EnrichedPosition => x !== null);
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
    color: VERDICT_COLORS[e.result.verdict],
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
    <div className="pb-20">
      {/* PAGE HEADER */}
      <header className="pt-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
              Portfolio
            </div>
            <h1
              className="mt-3 text-[36px] font-bold leading-[1.1] text-gray-900 sm:text-[44px]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Your halal investing dashboard
            </h1>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-gray-600">
              Real positions with cost basis. Track gain/loss, sector exposure, and
              compliance under your scholar. Saved to your browser.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowEditor((s) => !s)}
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:text-gray-900"
          >
            <Plus size={14} /> {showEditor ? "Hide editor" : "Edit positions"}
          </button>
        </div>
      </header>

      {/* SCHOLAR PICKER */}
      <div className="mt-8 sm:max-w-md">
        <ScholarPicker value={scholarId} onChange={setScholarId} />
      </div>

      {/* UPCOMING EARNINGS WIDGET — flags at-risk holdings */}
      {positions.length > 0 && (
        <EarningsWidget
          tickers={positions.map((p) => p.ticker)}
          title="Upcoming earnings · your portfolio"
        />
      )}

      {/* HERO METRICS */}
      <section className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200 sm:grid-cols-4">
        <div className="bg-white p-6">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
            Total value
          </div>
          <div
            className="mt-2 text-[28px] font-bold leading-none tabular-nums text-gray-900"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {fmtMoneyShort(totalValue)}
          </div>
          <div
            className={
              "mt-2 inline-flex items-center gap-1 text-[12px] font-medium tabular-nums " +
              (totalGain >= 0 ? "text-emerald-700" : "text-rose-700")
            }
          >
            {totalGain >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {fmtPct(totalGainPct)}
            <span className="font-normal text-gray-500">
              ({fmtMoneyShort(totalGain)})
            </span>
          </div>
        </div>

        <div className="bg-white p-6">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
            Cost basis
          </div>
          <div
            className="mt-2 text-[28px] font-bold leading-none tabular-nums text-gray-900"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {fmtMoneyShort(totalCost)}
          </div>
          <div className="mt-2 text-[11px] text-gray-500">
            Across {enriched.length} {enriched.length === 1 ? "position" : "positions"}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center bg-white p-4">
          <ProgressRing
            percent={halalPct}
            size={120}
            thickness={10}
            color={halalPct >= 85 ? "#047857" : halalPct >= 60 ? "#B45309" : "#BE123C"}
            sublabel="Halal"
          />
        </div>

        <div className="bg-white p-6">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
            Halal value
          </div>
          <div
            className="mt-2 text-[28px] font-bold leading-none tabular-nums"
            style={{
              fontFamily: "Georgia, serif",
              color:
                halalPct >= 85 ? "#047857" : halalPct >= 60 ? "#B45309" : "#BE123C",
            }}
          >
            {fmtMoneyShort(halalValue)}
          </div>
          <div className="mt-2 text-[11px] text-gray-500">Under {scholar.short}</div>
        </div>
      </section>

      {/* PERFORMANCE CHART */}
      <section className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
              Performance
            </div>
            <h2
              className="mt-2 text-[24px] font-bold leading-tight text-gray-900 sm:text-[28px]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Your portfolio vs benchmarks
            </h2>
          </div>
          <div className="flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 p-1">
            {(["1M", "3M", "6M", "1Y", "2Y", "ALL"] as Period[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={
                  "rounded px-2.5 py-1 text-[11px] font-semibold transition-colors " +
                  (period === p
                    ? "bg-white text-navy-800 shadow-sm"
                    : "text-gray-500 hover:text-gray-900")
                }
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
          <LineChart
            labels={performance.labels}
            series={[
              { label: "Your portfolio", color: "#1F3A5F", data: performance.portfolio, bold: true },
              { label: "S&P 500 (SPY)", color: "#94A3B8", data: performance.spy },
              { label: "Halal S&P 500 (SPUS)", color: "#B8860B", data: performance.spus },
            ]}
          />
          <div className="mt-5 border-t border-gray-100 pt-4">
            <LineLegend
              series={[
                { label: "Your portfolio", color: "#1F3A5F", data: [], bold: true },
                { label: "S&P 500 (SPY)", color: "#94A3B8", data: [] },
                { label: "Halal S&P 500 (SPUS)", color: "#B8860B", data: [] },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ALLOCATION + SECTOR */}
      <section className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
            Allocation
          </div>
          <h3
            className="mt-2 text-[18px] font-bold text-gray-900"
            style={{ fontFamily: "Georgia, serif" }}
          >
            By holding
          </h3>
          <div className="mt-5 grid grid-cols-2 gap-4">
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
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
            Sector exposure
          </div>
          <h3
            className="mt-2 text-[18px] font-bold text-gray-900"
            style={{ fontFamily: "Georgia, serif" }}
          >
            By industry
          </h3>
          <div className="mt-5">
            {sectorBreakdown.length > 0 ? (
              <HorizontalBars items={sectorBreakdown} />
            ) : (
              <p className="text-sm text-gray-500">Add positions to see sector breakdown</p>
            )}
          </div>
        </div>
      </section>

      {/* HOLDINGS TABLE */}
      <section className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
              Holdings
            </div>
            <h2
              className="mt-2 text-[24px] font-bold leading-tight text-gray-900 sm:text-[28px]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Every position, scored
            </h2>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-gray-500">Sort by:</span>
            {[
              { k: "value" as const, l: "Value" },
              { k: "ticker" as const, l: "Ticker" },
              { k: "gain" as const, l: "Gain %" },
            ].map((opt) => (
              <button
                key={opt.k}
                type="button"
                onClick={() => setSortKey(opt.k)}
                className={
                  "rounded-md px-2 py-1 font-medium transition-colors " +
                  (sortKey === opt.k
                    ? "bg-navy-50 text-navy-800"
                    : "text-gray-500 hover:text-gray-900")
                }
              >
                {opt.l}
              </button>
            ))}
          </div>
        </div>

        {sortedHoldings.length === 0 ? (
          <div className="mt-8 border-y border-gray-200 py-12 text-center">
            <p className="text-[14px] text-gray-500">
              No positions yet. Click <strong>Edit positions</strong> above to add one.
            </p>
          </div>
        ) : (
          <>
          <div className="mb-2 text-[11px] italic text-gray-500 sm:hidden">← Swipe to see more →</div>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="pb-3 pr-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                    Stock
                  </th>
                  <th className="pb-3 pr-4 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                    Shares
                  </th>
                  <th className="pb-3 pr-4 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                    Avg cost
                  </th>
                  <th className="pb-3 pr-4 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                    Price
                  </th>
                  <th className="pb-3 pr-4 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                    Value
                  </th>
                  <th className="pb-3 pr-4 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                    Gain
                  </th>
                  <th className="pb-3 pr-2 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                    Verdict
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedHoldings.map((e, idx) => (
                  <tr
                    key={e.pos.id}
                    className={idx !== sortedHoldings.length - 1 ? "border-b border-gray-100" : ""}
                  >
                    <td className="py-3 pr-4">
                      <div className="font-mono text-sm font-semibold text-gray-900">
                        {e.stock.ticker}
                      </div>
                      <div className="mt-0.5 text-[11px] text-gray-500">{e.stock.name}</div>
                    </td>
                    <td className="py-3 pr-4 text-right font-mono text-[13px] tabular-nums text-gray-700">
                      {e.pos.shares}
                    </td>
                    <td className="py-3 pr-4 text-right font-mono text-[13px] tabular-nums text-gray-700">
                      {fmtMoney(e.pos.avgCost)}
                    </td>
                    <td className="py-3 pr-4 text-right font-mono text-[13px] tabular-nums text-gray-700">
                      {fmtMoney(e.price)}
                    </td>
                    <td className="py-3 pr-4 text-right font-mono text-[13px] font-semibold tabular-nums text-gray-900">
                      {fmtMoneyShort(e.value)}
                    </td>
                    <td
                      className={
                        "py-3 pr-4 text-right font-mono text-[13px] font-semibold tabular-nums " +
                        (e.gain >= 0 ? "text-emerald-700" : "text-rose-700")
                      }
                    >
                      {fmtPct(e.gainPct)}
                      <div className="text-[11px] font-normal text-gray-500">
                        {fmtMoneyShort(e.gain)}
                      </div>
                    </td>
                    <td className="py-3 pr-2 text-right">
                      <VerdictPill verdict={e.result.verdict} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
        )}
      </section>

      {/* EDITOR */}
      {showEditor && (
        <section className="mt-12 border-t border-gray-200 pt-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
                Positions editor
              </div>
              <h2
                className="mt-2 text-[22px] font-bold leading-tight text-gray-900 sm:text-[26px]"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Add, edit, remove positions
              </h2>
              <p className="mt-1 text-[13px] text-gray-600">
                All changes save automatically.
              </p>
            </div>
            <button
              type="button"
              onClick={resetDefaults}
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-[12px] font-medium text-gray-700 transition hover:border-gray-400 hover:text-gray-900"
            >
              <RotateCcw size={11} /> Reset to sample
            </button>
          </div>

          <div className="mt-6 space-y-3">
            {positions.map((p) => {
              const stock = findStock(p.ticker);
              return (
                <div
                  key={p.id}
                  className="grid grid-cols-12 gap-2 rounded-lg border border-gray-200 bg-gray-50 p-4"
                >
                  <div className="col-span-12 sm:col-span-3">
                    <label className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                      Ticker
                    </label>
                    <input
                      type="text"
                      value={p.ticker}
                      onChange={(e) => updatePosition(p.id, { ticker: e.target.value.toUpperCase() })}
                      placeholder="AAPL"
                      className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 font-mono text-sm uppercase tracking-tight focus:border-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-700/10"
                    />
                    {stock && (
                      <div className="mt-1 text-[10px] text-gray-500">{stock.name}</div>
                    )}
                  </div>
                  <div className="col-span-6 sm:col-span-2">
                    <label className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                      Shares
                    </label>
                    <CurrencyInput
                      value={p.shares}
                      onChange={(v) => updatePosition(p.id, { shares: v })}
                      prefix=""
                      placeholder="0"
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-2">
                    <label className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                      Avg cost
                    </label>
                    <CurrencyInput
                      value={p.avgCost}
                      onChange={(v) => updatePosition(p.id, { avgCost: v })}
                    />
                  </div>
                  <div className="col-span-9 sm:col-span-3">
                    <label className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                      Purchase date
                    </label>
                    <input
                      type="date"
                      value={p.purchaseDate}
                      onChange={(e) => updatePosition(p.id, { purchaseDate: e.target.value })}
                      className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-700/10"
                    />
                  </div>
                  <div className="col-span-3 sm:col-span-2 flex items-end justify-end">
                    <button
                      type="button"
                      onClick={() => removePosition(p.id)}
                      className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-2 text-gray-400 transition hover:bg-rose-50 hover:text-rose-700"
                      aria-label="Remove position"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
            <button
              type="button"
              onClick={addPosition}
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:text-gray-900"
            >
              <Plus size={14} /> Add position
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

function VerdictPill({ verdict }: { verdict: Verdict }) {
  const tone =
    verdict === "pass" ? "bg-emerald-50 text-emerald-700"
      : verdict === "fail" ? "bg-rose-50 text-rose-700"
        : "bg-amber-50 text-amber-700";
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${tone}`}
    >
      {VERDICT_LABEL[verdict]}
    </span>
  );
}
