"use client";

/**
 * IndexCompare (v2) — side-by-side risk/reward of every halal index vs the S&P 500.
 * This is the comparison Chong asked for: halal-vs-conventional and halal-vs-halal
 * by risk and reward. Wrap in <LockedFeature feature="indexes">.
 */
import Link from "next/link";

interface Stats {
  annReturnPct: number;
  annVolPct: number;
  sharpe: number | null;
  maxDrawdownPct: number;
  beta: number | null;
}
export interface CompareRow {
  slug: string | null; // null = benchmark row
  name: string;
  risk?: string;
  totalReturnPct: number | null;
  stats: Stats | null;
}

function fmtPct(n: number | null, sign = false) {
  if (n == null) return "—";
  return `${sign && n >= 0 ? "+" : ""}${n.toFixed(1)}%`;
}
function fmtNum(n: number | null) {
  return n == null ? "—" : n.toFixed(2);
}

export default function IndexCompare({ rows }: { rows: CompareRow[] }) {
  // Best (highest) Sharpe among real indexes — highlight it.
  const bestSharpe = Math.max(...rows.filter((r) => r.slug && r.stats?.sharpe != null).map((r) => r.stats!.sharpe!), -Infinity);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-5 py-4">
        <h3 className="text-[15px] font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
          Risk &amp; reward — side by side
        </h3>
        <p className="mt-0.5 text-[12px] text-gray-500">Each halal index vs the S&amp;P 500. Higher Sharpe = better risk-adjusted return.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-[13px]">
          <thead>
            <tr className="border-b border-gray-200 text-left text-[11px] uppercase tracking-wide text-gray-500">
              <th className="px-5 py-2.5 font-medium">Index</th>
              <th className="px-3 py-2.5 text-right font-medium">Total</th>
              <th className="px-3 py-2.5 text-right font-medium">Return p.a.</th>
              <th className="px-3 py-2.5 text-right font-medium">Volatility</th>
              <th className="px-3 py-2.5 text-right font-medium">Sharpe</th>
              <th className="px-3 py-2.5 text-right font-medium">Max DD</th>
              <th className="px-3 py-2.5 text-right font-medium">Beta</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const isBench = !r.slug;
              const best = r.stats?.sharpe != null && r.stats.sharpe === bestSharpe;
              return (
                <tr key={r.name} className={"border-b border-gray-100 last:border-0 " + (isBench ? "bg-gray-50/60" : best ? "bg-emerald-50/40" : "")}>
                  <td className="px-5 py-2.5">
                    {r.slug ? (
                      <Link href={`/indexes/${r.slug}`} className="font-semibold text-navy-700 hover:underline">{r.name}</Link>
                    ) : (
                      <span className="font-semibold text-gray-600">{r.name}</span>
                    )}
                    {r.risk && <span className="ml-2 text-[11px] text-gray-400">{r.risk}</span>}
                    {best && <span className="ml-2 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">Best Sharpe</span>}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono">{fmtPct(r.totalReturnPct, true)}</td>
                  <td className="px-3 py-2.5 text-right font-mono">{fmtPct(r.stats?.annReturnPct ?? null, true)}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-gray-600">{fmtPct(r.stats?.annVolPct ?? null)}</td>
                  <td className="px-3 py-2.5 text-right font-mono font-semibold text-navy-800">{fmtNum(r.stats?.sharpe ?? null)}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-red-600">{fmtPct(r.stats?.maxDrawdownPct ?? null)}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-gray-600">{fmtNum(r.stats?.beta ?? null)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="px-5 py-3 text-[11px] leading-relaxed text-gray-400">
        Annualized; Sharpe assumes 0% risk-free rate; beta vs S&amp;P 500. Each index measured over its
        own inception window (constituents differ); illustrative, not a live fund record.
      </p>
    </div>
  );
}
