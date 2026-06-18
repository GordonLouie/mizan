/**
 * /indexes — halal index family (Phase 2). Free discovery page listing each
 * index, its risk profile, and live constituent count (real fundamentals).
 */
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { INDEXES, indexConstituents } from "@/lib/indexes";
import IndexesTabs from "@/components/IndexesTabs";

const SITE = "https://halalgauge.com";

export const metadata: Metadata = {
  title: "Halal stock baskets — thesis-driven, screened lists you can act on — HalalGauge",
  description:
    "HalalGauge's halal baskets: thesis-driven lists of companies that pass the mainstream AAOIFI Shariah screen. See each basket's current characteristics, the dividend slice to purify, a compliance-drift watch, and export the holdings. Core, growth and income.",
  alternates: { canonical: `${SITE}/indexes` },
};

const RISK_TONE: Record<string, string> = {
  Core: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Growth: "bg-amber-50 text-amber-700 border-amber-200",
  Income: "bg-navy-50 text-navy-800 border-navy-200",
};

export default function IndexesPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">Halal baskets</div>
      <h1 className="mt-2 text-[30px] font-bold leading-tight text-gray-900 sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>
        Halal baskets you can act on.
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-gray-700">
        Each basket is a thesis-driven list of companies that pass the mainstream AAOIFI halal
        screen. See what it&apos;s made of today, the dividend slice to purify, and which holdings are
        drifting toward a limit — then export the holdings to your broker. Constituents and methodology
        are open; analytics, drift watch and export are Pro.
      </p>

      <div className="mt-8"><IndexesTabs /></div>

      <div className="grid gap-4 sm:grid-cols-2">
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
              <p className="mt-1 text-[13px] leading-relaxed text-gray-600">{def.thesis}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-navy-700">
                View basket <ArrowRight size={13} className="transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </div>

      {/* Next steps — keep the hub cohesive: point to Compare + Build */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/indexes/compare" className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 px-4 py-2 text-[13px] font-semibold text-gray-700 transition hover:border-gray-400">
          Compare the baskets <ArrowRight size={14} />
        </Link>
        <Link href="/indexes/build" className="inline-flex items-center gap-1.5 rounded-md border border-navy-800 px-4 py-2 text-[13px] font-semibold text-navy-800 transition hover:bg-navy-50">
          Build your own basket <ArrowRight size={14} />
        </Link>
      </div>

      <p className="mt-8 text-[11px] leading-relaxed text-gray-400">
        Baskets are informational, screened lists — not investable funds, and not investment
        advice. We deliberately don&apos;t attach a backtest (a screened-universe backtest is biased by
        survivorship and look-ahead). Methodology is on each basket page. Verify with a qualified scholar.
      </p>
    </main>
  );
}
