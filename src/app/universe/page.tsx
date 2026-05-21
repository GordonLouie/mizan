"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { listStocks } from "@/lib/data";
import { SCHOLAR_PROFILES, getScholar } from "@/lib/scholars";
import { loadCustomProfile } from "@/lib/customProfile";
import { screenStock } from "@/lib/screen";
import type { Verdict } from "@/lib/types";
import ScholarPicker from "@/components/ScholarPicker";
import DemoBanner from "@/components/DemoBanner";
import { Search, ArrowUpDown } from "lucide-react";

type SortKey = "verdict" | "ticker" | "name" | "sector" | "marketCap" | "illiquid" | "debt";

export default function UniversePage() {
  return (
    <Suspense fallback={<div className="text-sm text-gray-500">Loading…</div>}>
      <UniverseInner />
    </Suspense>
  );
}

function UniverseInner() {
  const [scholarId, setScholarId] = useState("aaoifi");
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState<string>("");
  const [verdictFilter, setVerdictFilter] = useState<"" | Verdict>("");
  const [sortBy, setSortBy] = useState<SortKey>("verdict");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [bump, setBump] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("mizan.scholarId");
      if (saved && SCHOLAR_PROFILES.some((p) => p.id === saved)) setScholarId(saved);
    } catch {}
  }, []);

  useEffect(() => {
    const onFocus = () => setBump((b) => b + 1);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const scholar = useMemo(
    () => (scholarId === "custom" ? loadCustomProfile() : getScholar(scholarId)),
    [scholarId, bump],
  );
  const allStocks = listStocks();
  const sectors = useMemo(() => Array.from(new Set(allStocks.map((s) => s.sector))).sort(), [allStocks]);

  const enriched = useMemo(
    () => allStocks.map((s) => ({ stock: s, result: screenStock(s, scholar) })),
    [allStocks, scholar],
  );

  const filtered = useMemo(() => {
    let rows = enriched;
    if (query.trim()) {
      const q = query.toLowerCase();
      rows = rows.filter((r) => r.stock.ticker.toLowerCase().includes(q) || r.stock.name.toLowerCase().includes(q));
    }
    if (sector) rows = rows.filter((r) => r.stock.sector === sector);
    if (verdictFilter) rows = rows.filter((r) => r.result.verdict === verdictFilter);

    rows = [...rows].sort((a, b) => {
      let av: any, bv: any;
      switch (sortBy) {
        case "verdict":
          { const order = { pass: 0, borderline: 1, fail: 2 } as const;
            av = order[a.result.verdict]; bv = order[b.result.verdict]; break; }
        case "ticker": av = a.stock.ticker; bv = b.stock.ticker; break;
        case "name": av = a.stock.name; bv = b.stock.name; break;
        case "sector": av = a.stock.sector; bv = b.stock.sector; break;
        case "marketCap": av = a.stock.marketCapUsd; bv = b.stock.marketCapUsd; break;
        case "illiquid": av = a.stock.illiquidAssetsToTotalAssetsPct; bv = b.stock.illiquidAssetsToTotalAssetsPct; break;
        case "debt": av = a.stock.debtToMarketCapPct; bv = b.stock.debtToMarketCapPct; break;
      }
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [enriched, query, sector, verdictFilter, sortBy, sortDir]);

  const stats = useMemo(() => {
    let pass = 0, border = 0, fail = 0;
    for (const r of enriched) {
      if (r.result.verdict === "pass") pass++;
      else if (r.result.verdict === "borderline") border++;
      else fail++;
    }
    return { pass, border, fail, total: enriched.length };
  }, [enriched]);

  function toggleSort(key: SortKey) {
    if (sortBy === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortBy(key); setSortDir("asc"); }
  }
  function fmtCap(n: number) {
    if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
    if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
    if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
    return `$${n.toLocaleString()}`;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Universe</h1>
        <p className="mt-1 max-w-2xl text-sm text-gray-600">
          Every ticker, screened against your scholar. Filter by sector and verdict, sort by any column, click any ticker for the full breakdown.
        </p>
      </div>

      <DemoBanner />

      <ScholarPicker value={scholarId} onChange={setScholarId} />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <Stat label="Total tickers" value={stats.total.toString()} />
        <Stat label="Pass under your scholar" value={stats.pass.toString()} color="emerald" />
        <Stat label="Borderline" value={stats.border.toString()} color="amber" />
        <Stat label="Fail" value={stats.fail.toString()} color="rose" />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-gray-500">Search</label>
            <div className="mt-1 flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 focus-within:border-navy-400 focus-within:bg-white">
              <Search size={14} className="text-gray-400" />
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ticker or company" className="w-full bg-transparent text-sm outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-gray-500">Sector</label>
            <select value={sector} onChange={(e) => setSector(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-200 bg-gray-50 px-2 py-1.5 text-sm focus:border-navy-400 focus:bg-white focus:outline-none">
              <option value="">All sectors</option>
              {sectors.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-gray-500">Verdict</label>
            <select value={verdictFilter} onChange={(e) => setVerdictFilter(e.target.value as any)}
              className="mt-1 w-full rounded-md border border-gray-200 bg-gray-50 px-2 py-1.5 text-sm focus:border-navy-400 focus:bg-white focus:outline-none">
              <option value="">All verdicts</option>
              <option value="pass">Pass only</option>
              <option value="borderline">Borderline only</option>
              <option value="fail">Fail only</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <SortHeader label="Ticker" k="ticker" sortBy={sortBy} sortDir={sortDir} onClick={toggleSort} />
              <SortHeader label="Name" k="name" sortBy={sortBy} sortDir={sortDir} onClick={toggleSort} />
              <SortHeader label="Sector" k="sector" sortBy={sortBy} sortDir={sortDir} onClick={toggleSort} />
              <SortHeader label="Market cap" k="marketCap" sortBy={sortBy} sortDir={sortDir} onClick={toggleSort} className="text-right" />
              <SortHeader label="Illiquid" k="illiquid" sortBy={sortBy} sortDir={sortDir} onClick={toggleSort} className="text-right" />
              <SortHeader label="Debt/MC" k="debt" sortBy={sortBy} sortDir={sortDir} onClick={toggleSort} className="text-right" />
              <SortHeader label="Verdict" k="verdict" sortBy={sortBy} sortDir={sortDir} onClick={toggleSort} className="text-center" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-sm text-gray-500">No matches with current filters.</td></tr>}
            {filtered.map(({ stock, result }) => (
              <tr key={stock.ticker} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-2"><Link href={`/screen?ticker=${stock.ticker}`} className="font-semibold text-navy-700 hover:text-navy-900 hover:underline">{stock.ticker}</Link></td>
                <td className="px-4 py-2 text-gray-700">{stock.name}</td>
                <td className="px-4 py-2 text-xs text-gray-500">{stock.sector}</td>
                <td className="px-4 py-2 text-right tabular-nums text-gray-700">{fmtCap(stock.marketCapUsd)}</td>
                <td className="px-4 py-2 text-right tabular-nums text-gray-700">{stock.illiquidAssetsToTotalAssetsPct}%</td>
                <td className="px-4 py-2 text-right tabular-nums text-gray-700">{stock.debtToMarketCapPct.toFixed(1)}%</td>
                <td className="px-4 py-2 text-center">
                  <span className={
                    "rounded px-2 py-0.5 text-xs font-semibold uppercase " +
                    (result.verdict === "pass" ? "bg-emerald-50 text-emerald-700"
                     : result.verdict === "borderline" ? "bg-amber-50 text-amber-700"
                     : "bg-rose-50 text-rose-700")
                  }>{result.verdict}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-500">Showing {filtered.length} of {enriched.length} tickers.</p>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color?: "emerald" | "amber" | "rose" }) {
  const cmap: Record<string, string> = {
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    rose: "border-rose-200 bg-rose-50 text-rose-700",
  };
  return (
    <div className={"rounded-lg border p-3 " + (color ? cmap[color] : "border-gray-200 bg-gray-50 text-gray-800")}>
      <div className="text-xs uppercase tracking-wide opacity-70">{label}</div>
      <div className="mt-1 text-2xl font-bold tabular-nums">{value}</div>
    </div>
  );
}

function SortHeader({ label, k, sortBy, sortDir, onClick, className }: {
  label: string; k: SortKey; sortBy: SortKey; sortDir: "asc" | "desc"; onClick: (k: SortKey) => void; className?: string;
}) {
  const active = sortBy === k;
  return (
    <th className={"px-4 py-2 " + (className ?? "")}>
      <button type="button" onClick={() => onClick(k)} className={"inline-flex items-center gap-1 " + (active ? "text-navy-800" : "")}>
        {label}<ArrowUpDown size={11} className={active ? "" : "opacity-30"} />
      </button>
    </th>
  );
}
