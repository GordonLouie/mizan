"use client";

import { useEffect, useMemo, useState } from "react";
import { findStock, listStocks } from "@/lib/data";
import { getScholar, SCHOLAR_PROFILES } from "@/lib/scholars";
import { loadCustomProfile } from "@/lib/customProfile";
import { screenPortfolio } from "@/lib/screen";
import ScholarPicker from "@/components/ScholarPicker";
import DemoBanner from "@/components/DemoBanner";
import { Save, RotateCcw, Trash2, Check } from "lucide-react";

interface Row { ticker: string; weight: number; }

const STORAGE_KEY = "mizan.portfolio.v1";

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

  // Autosave on rows change (debounced)
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
      } catch {}
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

  function saveNow() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
      const t = new Date().toLocaleTimeString();
      setSavedAt(t);
      setTimeout(() => setSavedAt(null), 3000);
    } catch {}
  }

  function clearAll() {
    if (!confirm("Clear all holdings and start over?")) return;
    setRows([{ ticker: "", weight: 0 }]);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }

  function resetToDefaults() {
    setRows(DEFAULT_ROWS);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Portfolio score</h1>
        <p className="mt-1 text-sm text-gray-600">
          Enter your holdings. Mizan saves them to your browser so they&apos;re
          here when you return. The score updates live as you edit.
        </p>
      </div>

      <DemoBanner />

      <ScholarPicker value={scholarId} onChange={setScholarId} />

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Your holdings</h2>
          <div className="flex items-center gap-2">
            {savedAt && <span className="inline-flex items-center gap-1 text-xs text-emerald-700"><Check size={12} /> Saved at {savedAt}</span>}
            <button type="button" onClick={saveNow} className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50">
              <Save size={12} /> Save now
            </button>
            <button type="button" onClick={resetToDefaults} className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50">
              <RotateCcw size={12} /> Defaults
            </button>
            <button type="button" onClick={clearAll} className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-rose-700 hover:bg-rose-50">
              <Trash2 size={12} /> Clear all
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-2 text-xs font-medium uppercase tracking-wide text-gray-500">
          <div className="col-span-6 sm:col-span-7">Ticker</div>
          <div className="col-span-4 sm:col-span-3">Weight (%)</div>
          <div className="col-span-2"></div>
        </div>
        <div className="mt-2 space-y-2">
          {rows.map((r, i) => (
            <div key={i} className="grid grid-cols-12 items-center gap-2">
              <input
                value={r.ticker}
                onChange={(e) =>
                  setRows((rs) =>
                    rs.map((x, j) => (j === i ? { ...x, ticker: e.target.value.toUpperCase() } : x)),
                  )
                }
                className="col-span-6 rounded-md border border-gray-200 px-2 py-1 text-sm sm:col-span-7"
                placeholder="AAPL"
              />
              <input
                type="number"
                value={r.weight}
                onChange={(e) =>
                  setRows((rs) =>
                    rs.map((x, j) => (j === i ? { ...x, weight: parseFloat(e.target.value) || 0 } : x)),
                  )
                }
                className="col-span-4 rounded-md border border-gray-200 px-2 py-1 text-sm sm:col-span-3"
              />
              <button
                type="button"
                onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))}
                className="col-span-2 rounded-md border border-gray-200 px-2 py-1 text-sm text-gray-600 hover:bg-gray-50"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setRows((rs) => [...rs, { ticker: "", weight: 0 }])}
          className="mt-3 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-800 hover:bg-gray-50"
        >
          + Add holding
        </button>
        {missing.length > 0 && (
          <div className="mt-3 text-xs text-amber-700">
            Not in sample dataset (skipped): {missing.join(", ")}
          </div>
        )}
      </div>

      {score && score.results.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Stat label="Holdings that pass" value={`${score.results.filter((r) => r.verdict === "pass").length} / ${score.results.length}`} />
            <Stat label="Pass rate" value={`${(score.passRate * 100).toFixed(0)}%`} />
            <Stat label="Weight-adjusted pass rate" value={`${(score.weightedPassRate * 100).toFixed(0)}%`} />
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                  <th className="py-2">Ticker</th>
                  <th>Verdict</th>
                  <th>Failed checks</th>
                </tr>
              </thead>
              <tbody>
                {score.results.map((r) => (
                  <tr key={r.ticker} className="border-t border-gray-100">
                    <td className="py-2 font-semibold">{r.ticker}</td>
                    <td>
                      <span className={
                        "rounded px-2 py-0.5 text-xs font-semibold uppercase " +
                        (r.verdict === "pass" ? "bg-emerald-50 text-emerald-700"
                         : r.verdict === "borderline" ? "bg-amber-50 text-amber-700"
                         : "bg-rose-50 text-rose-700")
                      }>
                        {r.verdict}
                      </span>
                    </td>
                    <td className="text-gray-600">
                      {!r.sectorPasses && <div className="text-rose-700">Sector: {r.sectorReason}</div>}
                      {r.ratioChecks.filter((c) => !c.passes).map((c, i) => (
                        <div key={i}>
                          {c.label}:{" "}
                          <span className="text-rose-700">{c.value.toFixed(1)}%</span>{" "}
                          (limit {c.threshold}%)
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}
