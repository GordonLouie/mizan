"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { CURATED_LISTS, getList, rowsForList, statsForList, fmtMarketCap } from "@/lib/lists";
import { SCHOLAR_PROFILES } from "@/lib/scholars";
import { VERDICT_LABEL } from "@/lib/verdictLabels";
import ScholarPicker from "@/components/ScholarPicker";
import type { Verdict } from "@/lib/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CuratedListPage({ params }: PageProps) {
  const { slug } = use(params);
  const list = getList(slug);
  if (!list) notFound();

  const [scholarId, setScholarId] = useState(list.defaultScholarId);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("mizan.scholarId");
      if (saved && SCHOLAR_PROFILES.some((p) => p.id === saved)) {
        setScholarId(saved);
      }
    } catch {}
  }, []);

  const stats = useMemo(() => statsForList(list, scholarId), [list, scholarId]);
  const rows = useMemo(() => rowsForList(list, scholarId), [list, scholarId]);

  const passPct = stats.total ? Math.round((stats.pass / stats.total) * 100) : 0;

  return (
    <div className="pb-20">
      {/* BREADCRUMB */}
      <nav className="pt-6 text-[12px] text-gray-500">
        <Link href="/lists" className="inline-flex items-center gap-1 hover:text-navy-700">
          <ChevronLeft size={12} /> All curated lists
        </Link>
      </nav>

      {/* PAGE HEADER */}
      <header className="mt-6">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          {list.kicker}
        </div>
        <h1
          className="mt-3 text-[36px] font-bold leading-[1.1] text-gray-900 sm:text-[44px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {list.title}
        </h1>
        <p className="mt-3 max-w-xl text-[15px] italic leading-relaxed text-gray-600">
          {list.audience}
        </p>
      </header>

      {/* BLURB + OPTIONAL NOTE */}
      <div className="mt-8 max-w-2xl">
        <p className="text-[14px] leading-relaxed text-gray-700">{list.blurb}</p>
        {list.note && (
          <p className="mt-4 border-l-2 border-gray-300 py-1 pl-4 text-[12px] italic leading-relaxed text-gray-600">
            {list.note}
          </p>
        )}
      </div>

      {/* UNIVERSE STATS — hairline-separated, no card chrome */}
      <div className="mt-10 grid grid-cols-2 gap-y-5 border-y border-gray-200 py-5 sm:grid-cols-4">
        <StatPlain label="Stocks" value={String(stats.total)} />
        <StatPlain label="Halal" value={`${stats.pass} (${passPct}%)`} tone="emerald" />
        <StatPlain label="Avg yield" value={`${stats.avgDividendYield.toFixed(1)}%`} />
        <StatPlain label="Total cap" value={fmtMarketCap(stats.totalMarketCapUsd)} />
      </div>

      {/* SCHOLAR PICKER */}
      <div className="mt-10">
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Screen against
        </div>
        <div className="sm:max-w-md">
          <ScholarPicker value={scholarId} onChange={setScholarId} />
        </div>
      </div>

      {/* STOCKS TABLE */}
      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-left">
              <th className="pb-3 pr-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                Company
              </th>
              <th className="pb-3 pr-4 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                Market cap
              </th>
              <th className="hidden pb-3 pr-4 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500 md:table-cell">
                Div yield
              </th>
              <th className="hidden pb-3 pr-4 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500 md:table-cell">
                Debt/cap
              </th>
              <th className="hidden pb-3 pr-4 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500 lg:table-cell">
                Impure inc.
              </th>
              <th className="pb-3 pr-2 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                Verdict
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ stock, verdict }, idx) => (
              <tr
                key={stock.ticker}
                className={idx !== rows.length - 1 ? "border-b border-gray-100" : ""}
              >
                <td className="py-3 pr-4">
                  <Link
                    href={`/screen?ticker=${stock.ticker}`}
                    className="group block"
                  >
                    <div className="font-mono text-sm font-semibold text-gray-900 group-hover:text-navy-800">
                      {stock.ticker}
                    </div>
                    <div className="mt-0.5 text-[11px] text-gray-500">{stock.name}</div>
                  </Link>
                </td>
                <td className="py-3 pr-4 text-right font-mono text-[13px] tabular-nums text-gray-800">
                  {fmtMarketCap(stock.marketCapUsd)}
                </td>
                <td className="hidden py-3 pr-4 text-right font-mono text-[13px] tabular-nums text-gray-800 md:table-cell">
                  {stock.dividendYieldPct
                    ? `${stock.dividendYieldPct.toFixed(1)}%`
                    : "—"}
                </td>
                <td className="hidden py-3 pr-4 text-right font-mono text-[13px] tabular-nums text-gray-800 md:table-cell">
                  {stock.debtToMarketCapPct.toFixed(1)}%
                </td>
                <td className="hidden py-3 pr-4 text-right font-mono text-[13px] tabular-nums text-gray-800 lg:table-cell">
                  {stock.impermissibleIncomePct.toFixed(1)}%
                </td>
                <td className="py-3 pr-2 text-right">
                  <VerdictPill verdict={verdict} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MORE LISTS */}
      <div className="mt-16 border-t border-gray-200 pt-8">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          More lists
        </div>
        <h2
          className="mt-2 text-[20px] font-bold text-gray-900"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Other curated collections
        </h2>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CURATED_LISTS.filter((l) => l.slug !== list.slug).map((l) => (
            <Link
              key={l.slug}
              href={`/lists/${l.slug}`}
              className="group block border border-gray-200 bg-white p-4 transition hover:border-gray-400"
            >
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                {l.kicker}
              </div>
              <div
                className="mt-2 text-[15px] font-bold leading-snug text-gray-900 group-hover:text-navy-800"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {l.title}
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px]">
                <span className="text-gray-500">{l.tickers.length} stocks</span>
                <ArrowRight size={12} className="text-gray-400 transition group-hover:text-gray-700" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* DISCLAIMER */}
      <p className="mt-12 text-center text-[11px] leading-relaxed text-gray-500">
        Curated lists are starting points for research, not investment advice. Names are
        re-screened on every page load against the scholar you select above.
      </p>
    </div>
  );
}

/* ─── HELPERS ─────────────────────────────────────────────────────────────── */

function StatPlain({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "emerald";
}) {
  const cls = tone === "emerald" ? "text-emerald-700" : "text-gray-900";
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
    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${tone}`}>
      {VERDICT_LABEL[verdict]}
    </span>
  );
}
