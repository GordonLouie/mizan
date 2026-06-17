/**
 * /indexes — halal index family (Phase 2). Free discovery page listing each
 * index, its risk profile, and live constituent count (real fundamentals).
 */
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { INDEXES, indexConstituents } from "@/lib/indexes";
import { indexPerformance, benchmarkStats } from "@/lib/indexes.server";
import LockedFeature from "@/components/LockedFeature";
import IndexCompare, { type CompareRow } from "@/components/IndexCompare";

const SITE = "https://mizaninvesting.com";

export const metadata: Metadata = {
  title: "Halal stock indexes — screened, with real returns vs the S&P 500 — Mizan",
  description:
    "Mizan's halal indexes: baskets of the largest companies that pass the strictest mainstream Shariah screen, with real backtested performance vs the S&P 500 and SPUS. Core, growth and income profiles.",
  alternates: { canonical: `${SITE}/indexes` },
};

const RISK_TONE: Record<string, string> = {
  Core: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Growth: "bg-amber-50 text-amber-700 border-amber-200",
  Income: "bg-navy-50 text-navy-800 border-navy-200",
};

export default function IndexesPage() {
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
        Halal indexes, with the returns shown.
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-gray-700">
        Each index is a basket of the largest companies that pass the mainstream AAOIFI halal
        screen, with a real, backtested return you can compare to the S&amp;P 500.
        Constituents and methodology are open; full performance is a Pro feature.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {INDEXES.map((def) => {
          const n = indexConstituents(def).length;
          return (
            <Link key={def.slug} href={`/indexes/${def.slug}`}
              className="group rounded-xl border border-gray-200 bg-white p-5 transition hover:border-gray-400">
              <div className="flex items-center justify-between">
                <span className={"rounded-full border px-2.5 py-0.5 text-[11px] font-semibold " + (RISK_TONE[def.risk] ?? "")}>{def.risk}</span>
                <span className="text-[11px] text-gray-400">{n} holdings</span>
              </div>
              <h2 className="mt-3 text-[18px] font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>{def.name}</h2>
              <p className="mt-1 text-[13px] leading-relaxed text-gray-600">{def.tagline}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-navy-700">
                View index <ArrowRight size={13} className="transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </div>

      {/* Risk/reward comparison — gated Pro */}
      <section className="mt-10">
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">Compare</div>
        <div className="mt-3">
          <LockedFeature feature="indexes" label="Index comparison">
            <IndexCompare rows={compareRows} />
          </LockedFeature>
        </div>
      </section>

      <p className="mt-8 text-[11px] leading-relaxed text-gray-400">
        Indexes are informational, screened baskets — not investable funds, and not investment
        advice. Methodology is published on each index page. Verify with a qualified scholar.
      </p>
    </main>
  );
}
