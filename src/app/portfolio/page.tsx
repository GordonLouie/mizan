"use client";

import { useEffect, useMemo, useState } from "react";
import { listStocks, findStock } from "@/lib/data";
import { getScholar, SCHOLAR_PROFILES } from "@/lib/scholars";
import { screenPortfolio } from "@/lib/screen";
import ScholarPicker from "@/components/ScholarPicker";

interface Row { ticker: string; weight: number; }

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

  useEffect(() => {
    try {
      const saved = localStorage.getItem("mizan.scholarId");
      if (saved && SCHOLAR_PROFILES.some((p) => p.id === saved)) setScholarId(saved);
    } catch {}
  }, []);

  const scholar = getScholar(scholarId);

  const { holdings, missing } = useMemo(() => {
    const found: Array<{ ticker: string; weight: number; stock: any }> = [];
    const missing: string[] = [];
    for (const r of rows) {
      const s = findStock(r.ticker);
      if (s) found.push({ ticker: r.ticker, weight: r.weight, stock: s });
      else if (r.ticker) missing.push(r.ticker);
    }
    return { holdings: found, missing };
  }, [rows]);

  const score = useMemo(
    () => (holdings.length ? screenPortfolio(holdings, scholar) : null),
    [holdings, scholar],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Portfolio score</h1>
        <p className="mt-1 text-sm text-gray-600">
          Enter your holdings. Mizan tells you what passes under your scholar — by count
          and by weight.
        </p>
      </div>

      <ScholarPicker value={scholarId} onChange={setScholarId} />

      <div className="rounded-xl border border-gray-200 bg-white p-4">
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
                    rs.map((x, j) =>
                      j === i ? { ...x, ticker: e.target.value.toUpperCase() } : x,
                    ),
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
                    rs.map((x, j) =>
                      j === i ? { ...x, weight: parseFloat(e.target.value) || 0 } : x,
                    ),
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

      {score && (
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Stat
              label="Holdings that pass"
              value={`${score.results.filter((r) => r.verdict === "pass").length} / ${score.results.length}`}
            />
            <Stat
              label="Pass rate"
              value={`${(score.passRate * 100).toFixed(0)}%`}
            />
            <Stat
              label="Weight-adjusted pass rate"
              value={`${(score.weightedPassRate * 100).toFixed(0)}%`}
            />
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
                      <span
                        className={
                          "rounded px-2 py-0.5 text-xs font-semibold uppercase " +
                          (r.verdict === "pass"
                            ? "bg-emerald-50 text-emerald-700"
                            : r.verdict === "borderline"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-rose-50 text-rose-700")
                        }
                      >
                        {r.verdict}
                      </span>
                    </td>
                    <td className="text-gray-600">
                      {!r.sectorPasses && (
                        <div className="text-rose-700">Sector: {r.sectorReason}</div>
                      )}
                      {r.ratioChecks
                        .filter((c) => !c.passes)
                        .map((c, i) => (
                          <div key={i}>
                            {c.label}:{" "}
                            <span className="text-rose-700">
                              {c.value.toFixed(1)}%
                            </span>{" "}
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
