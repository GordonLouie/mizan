/**
 * /indexes/compare — compare the baskets on what they ARE today (no backtest):
 * size, weighted dividend yield, median debt, the dividend slice to purify, and
 * how many holdings are drifting toward a limit. Gated (Pro).
 */
import type { Metadata } from "next";
import Link from "next/link";
import { INDEXES, indexAnalytics } from "@/lib/indexes";
import LockedFeature from "@/components/LockedFeature";
import IndexesTabs from "@/components/IndexesTabs";

const SITE = "https://halalgauge.com";

export const metadata: Metadata = {
  title: "Compare halal baskets — yield, debt, purification & drift — HalalGauge",
  description:
    "Side-by-side comparison of HalalGauge's halal baskets on present-tense characteristics: holdings, weighted dividend yield, median debt, the dividend slice to purify, and compliance-drift count.",
  alternates: { canonical: `${SITE}/indexes/compare` },
};

export default function IndexesComparePage() {
  const rows = INDEXES.map((def) => ({ def, a: indexAnalytics(def) }));

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">Halal baskets</div>
      <h1 className="mt-2 text-[30px] font-bold leading-tight text-gray-900 sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>
        Compare the baskets.
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-gray-700">
        What each basket is made of today — yield, leverage, the dividend slice to purify, and how
        many holdings are nearing a compliance limit. No return claims: a screened-universe backtest
        would be biased, so we compare characteristics instead.
      </p>

      <div className="mt-8"><IndexesTabs /></div>

      <LockedFeature feature="indexes" label="Basket comparison">
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full min-w-[640px] border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-gray-200 text-left text-[11px] uppercase tracking-wide text-gray-500">
                <th className="px-4 py-3 font-semibold">Basket</th>
                <th className="px-4 py-3 text-right font-semibold">Holdings</th>
                <th className="px-4 py-3 text-right font-semibold">Wtd. div. yield</th>
                <th className="px-4 py-3 text-right font-semibold">Median debt/cap</th>
                <th className="px-4 py-3 text-right font-semibold">Div. to purify</th>
                <th className="px-4 py-3 text-right font-semibold">Drift watch</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ def, a }) => (
                <tr key={def.slug} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/indexes/${def.slug}`} className="font-semibold text-navy-800 hover:underline">{def.name}</Link>
                    <div className="text-[11px] text-gray-500">{def.risk}</div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono">{a.count}</td>
                  <td className="px-4 py-3 text-right font-mono">{a.weightedDivYieldPct.toFixed(1)}%</td>
                  <td className="px-4 py-3 text-right font-mono">{a.medianDebtPct.toFixed(0)}%</td>
                  <td className="px-4 py-3 text-right font-mono">~{a.purificationPctOfDividends.toFixed(1)}%</td>
                  <td className="px-4 py-3 text-right font-mono">{a.atRisk.length === 0 ? "—" : `${a.atRisk.length} near limit`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LockedFeature>

      <p className="mt-8 text-[11px] leading-relaxed text-gray-400">
        Baskets are informational, screened lists — not investable funds, and not investment advice.
        Characteristics are computed from current fundamentals. Verify with a qualified scholar.
      </p>
    </main>
  );
}
