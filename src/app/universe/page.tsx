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
import { SelectField } from "@/components/ui";
import { Search, ArrowUpDown } from "lucide-react";
import CompanyLogo from "@/components/CompanyLogo";
import { VERDICT_LABEL } from "@/lib/verdictLabels";

type SortKey = "verdict" | "ticker" | "name" | "sector" | "marketCap" | "illiquid" | "debt";

export default function UniversePage() {
  return (
    <Suspense fallback={<div className="py-8 text-sm text-gray-500">Loading…</div>}>
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
  const sectors = useMemo(
    () => Array.from(new Set(allStocks.map((s) => s.sector))).sort(),
    [allStocks],
  );

  const enriched = useMemo(
    () => allStocks.map((s) => ({ stock: s, result: screenStock(s, scholar) })),
    [allStocks, scholar],
  );

  // Scholar comparison row — Miqdad + Toby's "scholar-first" lens.
  // Show pass count under each scholar so the user sees how the
  // investable universe expands/contracts based on which scholar they pick.
  // ("Wow, under Strict only X stocks pass.") Custom is excluded because the
  // label "Custom" doesn't communicate what threshold is being applied.
  const scholarStats = useMemo(() => {
    return SCHOLAR_PROFILES.filter((p) => p.id !== "custom").map((p) => {
      let pass = 0;
      for (const s of allStocks) {
        if (screenStock(s, p).verdict === "pass") pass++;
      }
      return { id: p.id, short: p.short, label: p.label, pass, total: allStocks.length };
    });
  }, [allStocks]);

  const activeScholarLabel =
    SCHOLAR_PROFILES.find((p) => p.id === scholarId)?.short ?? "your scholar";

  const filtered = useMemo(() => {
    let rows = enriched;
    if (query.trim()) {
      const q = query.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.stock.ticker.toLowerCase().includes(q) ||
          r.stock.name.toLowerCase().includes(q),
      );
    }
    if (sector) rows = rows.filter((r) => r.stock.sector === sector);
    if (verdictFilter) rows = rows.filter((r) => r.result.verdict === verdictFilter);

    rows = [...rows].sort((a, b) => {
      let av: string | number = 0;
      let bv: string | number = 0;
      switch (sortBy) {
        case "verdict": {
          const order = { pass: 0, borderline: 1, fail: 2 } as const;
          av = order[a.result.verdict];
          bv = order[b.result.verdict];
          break;
        }
        case "ticker":
          av = a.stock.ticker;
          bv = b.stock.ticker;
          break;
        case "name":
          av = a.stock.name;
          bv = b.stock.name;
          break;
        case "sector":
          av = a.stock.sector;
          bv = b.stock.sector;
          break;
        case "marketCap":
          av = a.stock.marketCapUsd;
          bv = b.stock.marketCapUsd;
          break;
        case "illiquid":
          av = a.stock.illiquidAssetsToTotalAssetsPct;
          bv = b.stock.illiquidAssetsToTotalAssetsPct;
          break;
        case "debt":
          av = a.stock.debtToMarketCapPct;
          bv = b.stock.debtToMarketCapPct;
          break;
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
    else {
      setSortBy(key);
      setSortDir("asc");
    }
  }

  function fmtCap(n: number) {
    if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
    if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
    if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
    return `$${n.toLocaleString()}`;
  }

  return (
    <div className="pb-20">
      {/* PAGE HEADER */}
      <header className="pt-6">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Browse
        </div>
        <h1
          className="mt-3 text-[36px] font-bold leading-[1.1] text-gray-900 sm:text-[44px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Universe
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-gray-600">
          Under{" "}
          <span className="font-semibold text-navy-800">{activeScholarLabel}</span>,{" "}
          <span className="font-semibold text-emerald-700 tabular-nums">{stats.pass}</span>{" "}
          of{" "}
          <span className="tabular-nums">{stats.total}</span> stocks pass. Change scholar to
          see how the investable universe expands or contracts — every other halal app hides
          this disagreement behind one default.
        </p>
      </header>

      <div className="mt-8">
        <DemoBanner />
      </div>

      {/* SCHOLAR PICKER */}
      <div className="mt-8 sm:max-w-md">
        <ScholarPicker value={scholarId} onChange={setScholarId} />
      </div>

      {/* SUMMARY STATS */}
      <div className="mt-10 grid grid-cols-2 gap-y-5 border-y border-gray-200 py-5 sm:grid-cols-4">
        <StatPlain label="Total" value={stats.total.toString()} />
        <StatPlain label="Halal" value={stats.pass.toString()} tone="emerald" />
        <StatPlain label="Borderline" value={stats.border.toString()} tone="amber" />
        <StatPlain label="Not halal" value={stats.fail.toString()} tone="rose" />
      </div>

      {/* SCHOLAR COMPARISON ROW — Miqdad + Toby's "scholar-first" lens.
          See how the investable universe shrinks/expands per scholar. */}
      <div className="mt-8">
        <div className="flex items-baseline justify-between">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
            Compare scholars
          </div>
          <div className="text-[11px] text-gray-400">Tap to switch</div>
        </div>
        <div className="mt-3 -mx-1 flex gap-2 overflow-x-auto pb-2">
          {scholarStats.map((s) => {
            const active = s.id === scholarId;
            const pct = s.total > 0 ? Math.round((s.pass / s.total) * 100) : 0;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setScholarId(s.id)}
                className={
                  "min-w-[124px] shrink-0 rounded-lg border px-3 py-2.5 text-left transition " +
                  (active
                    ? "border-navy-700 bg-navy-50 ring-1 ring-navy-700/10"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50")
                }
                aria-pressed={active}
              >
                <div
                  className={
                    "text-[10px] font-semibold uppercase tracking-[0.14em] " +
                    (active ? "text-navy-700" : "text-gray-500")
                  }
                >
                  {s.short}
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span
                    className="font-mono text-[20px] font-bold tabular-nums text-emerald-700"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {s.pass}
                  </span>
                  <span className="text-[11px] text-gray-500 tabular-nums">
                    / {s.total}
                  </span>
                </div>
                <div className="mt-0.5 text-[10px] text-gray-500 tabular-nums">
                  {pct}% pass
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* FILTERS */}
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
            Search
          </label>
          <div className="mt-2 flex items-center gap-2 border-b border-gray-200 px-1 py-2 focus-within:border-navy-700">
            <Search size={14} className="text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ticker or company"
              className="w-full bg-transparent text-[14px] text-gray-900 outline-none placeholder:text-gray-400"
            />
          </div>
        </div>
        <SelectField
          label="Sector"
          value={sector}
          onChange={(e) => setSector(e.target.value)}
        >
          <option value="">All sectors</option>
          {sectors.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </SelectField>
        <SelectField
          label="Verdict"
          value={verdictFilter}
          onChange={(e) => setVerdictFilter(e.target.value as "" | Verdict)}
        >
          <option value="">All verdicts</option>
          <option value="pass">Halal only</option>
          <option value="borderline">Borderline only</option>
          <option value="fail">Not halal only</option>
        </SelectField>
      </div>

      {/* "VIEWING UNDER" CHIP — Tyler's feedback 2026-06-07:
          "when you switch scholar on the lists page, nothing visibly changes,
          even just a small 'viewing under: Mufti Taqi' tag would make it
          obvious the filter actually did something". This pill sits directly
          above the table so the scholar switch reads as cause-and-effect. */}
      <div className="mt-8 flex items-center gap-2 text-[12px] text-gray-600">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
          Viewing under
        </span>
        <span
          key={scholarId} /* re-mount on change → triggers the fade animation */
          className="inline-flex animate-in fade-in slide-in-from-left-1 items-center rounded-full bg-navy-50 px-3 py-1 text-[12px] font-semibold text-navy-800 ring-1 ring-navy-700/15"
        >
          {SCHOLAR_PROFILES.find((p) => p.id === scholarId)?.label ?? "your scholar"}
        </span>
      </div>

      {/* TABLE */}
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <SortHeader label="Ticker" k="ticker" sortBy={sortBy} sortDir={sortDir} onClick={toggleSort} />
              <SortHeader label="Name" k="name" sortBy={sortBy} sortDir={sortDir} onClick={toggleSort} />
              <SortHeader label="Sector" k="sector" sortBy={sortBy} sortDir={sortDir} onClick={toggleSort} />
              <SortHeader label="Market cap" k="marketCap" sortBy={sortBy} sortDir={sortDir} onClick={toggleSort} className="text-right" />
              <SortHeader label="Illiquid" k="illiquid" sortBy={sortBy} sortDir={sortDir} onClick={toggleSort} className="text-right" />
              <SortHeader label="Debt/MC" k="debt" sortBy={sortBy} sortDir={sortDir} onClick={toggleSort} className="text-right" />
              <SortHeader label="Verdict" k="verdict" sortBy={sortBy} sortDir={sortDir} onClick={toggleSort} className="text-right" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-12 text-center text-[14px] text-gray-500">
                  No matches with current filters.
                </td>
              </tr>
            )}
            {filtered.map(({ stock, result }, idx) => (
              <tr
                key={stock.ticker}
                className={idx !== filtered.length - 1 ? "border-b border-gray-100" : ""}
              >
                <td className="py-3 pr-4">
                  <Link
                    href={`/screen?ticker=${stock.ticker}`}
                    className="inline-flex items-center gap-2 font-mono text-sm font-semibold text-navy-700 hover:text-navy-900 hover:underline"
                  >
                    <CompanyLogo ticker={stock.ticker} size={22} />
                    {stock.ticker}
                  </Link>
                </td>
                <td className="py-3 pr-4 text-[13px] text-gray-700">{stock.name}</td>
                <td className="py-3 pr-4 text-[12px] text-gray-500">{stock.sector}</td>
                <td className="py-3 pr-4 text-right font-mono text-[13px] tabular-nums text-gray-700">
                  {fmtCap(stock.marketCapUsd)}
                </td>
                <td className="py-3 pr-4 text-right font-mono text-[13px] tabular-nums text-gray-700">
                  {stock.illiquidAssetsToTotalAssetsPct}%
                </td>
                <td className="py-3 pr-4 text-right font-mono text-[13px] tabular-nums text-gray-700">
                  {stock.debtToMarketCapPct.toFixed(1)}%
                </td>
                <td className="py-3 pr-2 text-right">
                  <VerdictPill verdict={result.verdict} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-[11px] text-gray-500">
        Showing {filtered.length} of {enriched.length} tickers under{" "}
        <span className="font-semibold text-gray-700">{activeScholarLabel}</span>.
      </p>
    </div>
  );
}

function StatPlain({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "emerald" | "amber" | "rose";
}) {
  const cls =
    tone === "emerald" ? "text-emerald-700" :
    tone === "amber" ? "text-amber-700" :
    tone === "rose" ? "text-rose-700" :
    "text-gray-900";
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
        {label}
      </div>
      <div
        className={`mt-1 text-[22px] font-bold leading-none tabular-nums ${cls}`}
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
      </div>
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

function SortHeader({
  label,
  k,
  sortBy,
  sortDir,
  onClick,
  className,
}: {
  label: string;
  k: SortKey;
  sortBy: SortKey;
  sortDir: "asc" | "desc";
  onClick: (k: SortKey) => void;
  className?: string;
}) {
  const active = sortBy === k;
  return (
    <th
      className={
        "pb-3 pr-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500 " +
        (className ?? "text-left")
      }
    >
      <button
        type="button"
        onClick={() => onClick(k)}
        className={
          "inline-flex items-center gap-1 transition " +
          (active ? "text-navy-800" : "hover:text-gray-700")
        }
      >
        {label}
        <ArrowUpDown
          size={11}
          className={active ? (sortDir === "asc" ? "" : "rotate-180") : "opacity-30"}
        />
      </button>
    </th>
  );
}
