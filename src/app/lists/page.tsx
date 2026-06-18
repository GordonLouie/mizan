import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CURATED_LISTS, statsForList, fmtMarketCap } from "@/lib/lists";

export const metadata = {
  title: "Curated lists · HalalGauge",
  description:
    "Hand-picked halal investing collections — mega-caps, dividend payers, ETFs, " +
    "tech leaders, consumer staples, and stricter-Hanafi-only equities.",
};

export default function ListsIndex() {
  return (
    <div className="pb-20">
      {/* PAGE HEADER */}
      <header className="pt-6">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Discover · Curated lists
        </div>
        <h1
          className="mt-3 text-[36px] font-bold leading-[1.1] text-gray-900 sm:text-[44px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Hand-picked halal collections
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-gray-600">
          Editorial starting points for research. Every list is re-screened against
          your scholar — names that drift out are visibly marked.
        </p>
      </header>

      {/* LIST GRID */}
      <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200 md:grid-cols-2">
        {CURATED_LISTS.map((list) => {
          const stats = statsForList(list, list.defaultScholarId);
          const passPct = stats.total
            ? Math.round((stats.pass / stats.total) * 100)
            : 0;
          return (
            <Link
              key={list.slug}
              href={`/lists/${list.slug}`}
              className="group block bg-white p-7 transition hover:bg-gray-50"
            >
              <div className="flex items-baseline justify-between gap-3">
                <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
                  {list.kicker}
                </div>
                <div className="font-mono text-[11px] text-gray-500">
                  {stats.total} stocks
                </div>
              </div>

              <h2
                className="mt-3 text-[22px] font-bold leading-tight text-gray-900 group-hover:text-navy-800 sm:text-[26px]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {list.title}
              </h2>

              <p className="mt-2 text-[13px] italic text-gray-600">{list.audience}</p>

              <p className="mt-4 line-clamp-3 text-[13px] leading-relaxed text-gray-600">
                {list.blurb}
              </p>

              {/* Mini-stats row */}
              <div className="mt-6 grid grid-cols-3 gap-4 border-t border-gray-100 pt-5">
                <MiniStat label="Pass" value={`${passPct}%`} tone="emerald" />
                <MiniStat
                  label="Avg yield"
                  value={`${stats.avgDividendYield.toFixed(1)}%`}
                />
                <MiniStat
                  label="Total cap"
                  value={fmtMarketCap(stats.totalMarketCapUsd)}
                />
              </div>

              {/* Footer */}
              <div className="mt-5 flex items-center justify-between text-[11px]">
                <span className="text-gray-500">
                  Default scholar:{" "}
                  <span className="font-semibold text-gray-800">
                    {scholarShort(list.defaultScholarId)}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1 font-medium text-navy-700 group-hover:text-navy-900">
                  View list <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* DISCLAIMER */}
      <div className="mt-12 border-t border-gray-200 pt-6">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          About these lists
        </div>
        <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-gray-600">
          Curated lists are <strong className="text-gray-900">not investment recommendations</strong>.
          They are starting points for research — HalalGauge does not assess whether a stock fits
          your financial goals, risk tolerance, or tax situation. Always do your own due
          diligence, and consider speaking with a registered financial adviser before acting.
        </p>
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "emerald" | "neutral";
}) {
  const cls = tone === "emerald" ? "text-emerald-700" : "text-gray-900";
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500">
        {label}
      </div>
      <div
        className={`mt-1 text-[18px] font-bold leading-none tabular-nums ${cls}`}
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
      </div>
    </div>
  );
}

function scholarShort(id: string): string {
  switch (id) {
    case "aaoifi":
      return "AAOIFI";
    case "taqi_usmani":
      return "Mufti Taqi";
    case "djim":
      return "DJIM";
    case "jafari":
      return "Ja'fari";
    case "strict":
      return "Strict";
    default:
      return id;
  }
}
