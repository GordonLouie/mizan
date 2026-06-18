/**
 * /indexes/compare — risk/reward comparison of every HalalGauge index against
 * the S&P 500, on real backtested numbers. Split out of /indexes so the hub
 * reads as Explore · Compare · Build rather than one crammed page. Gated (Pro).
 */
import type { Metadata } from "next";
import { INDEXES } from "@/lib/indexes";
import { indexPerformance, benchmarkStats } from "@/lib/indexes.server";
import LockedFeature from "@/components/LockedFeature";
import IndexCompare, { type CompareRow } from "@/components/IndexCompare";
import IndexesTabs from "@/components/IndexesTabs";

const SITE = "https://halalgauge.com";

export const metadata: Metadata = {
  title: "Compare halal indexes — returns, risk & Sharpe vs the S&P 500 — HalalGauge",
  description:
    "Side-by-side comparison of HalalGauge's halal indexes — annualized return, volatility, Sharpe, max drawdown and beta — against the S&P 500, all on the same backtest.",
  alternates: { canonical: `${SITE}/indexes/compare` },
};

export default function IndexesComparePage() {
  const compareRows: CompareRow[] = INDEXES.map((def) => {
    const p = indexPerformance(def);
    return { slug: def.slug, name: def.name, risk: def.risk, totalReturnPct: p.totalReturn, stats: p.stats };
  });
  const spy = benchmarkStats("SPY");
  compareRows.push({ slug: null, name: "S&P 500", risk: "Benchmark", totalReturnPct: spy.totalReturnPct, stats: spy.stats });

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">Halal indexes</div>
      <h1 className="mt-2 text-[30px] font-bold leading-tight text-gray-900 sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>
        Compare the indexes.
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-gray-700">
        Every index against the S&amp;P 500 on the same backtest — return, volatility, Sharpe,
        drawdown and beta — so you can see what the halal screen costs or earns.
      </p>

      <div className="mt-8"><IndexesTabs /></div>

      <LockedFeature feature="indexes" label="Index comparison">
        <IndexCompare rows={compareRows} />
      </LockedFeature>

      <p className="mt-8 text-[11px] leading-relaxed text-gray-400">
        Indexes are informational, screened baskets — not investable funds, and not investment
        advice. Methodology is published on each index page. Verify with a qualified scholar.
      </p>
    </main>
  );
}
