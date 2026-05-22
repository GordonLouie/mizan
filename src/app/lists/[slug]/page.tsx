"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CURATED_LISTS, getList, rowsForList, statsForList, fmtMarketCap } from "@/lib/lists";
import { SCHOLAR_PROFILES } from "@/lib/scholars";
import { VERDICT_LABEL } from "@/lib/verdictLabels";
import { Card, PageHeader, Pill } from "@/components/ui";
import StockLogo from "@/components/StockLogo";
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
    <div className="space-y-6">
      <nav className="text-xs text-gray-500">
        <Link href="/lists" className="hover:text-navy-800">
          Curated lists
        </Link>{" "}
        / <span className="text-gray-700">{list.title}</span>
      </nav>

      <PageHeader
        kicker={list.kicker}
        title={list.title}
        description={list.audience}
      />

      <Card>
        <p className="text-sm leading-relaxed text-gray-700">{list.blurb}</p>
        {list.note && (
          <p className="mt-3 border-l-2 border-amber-300 bg-amber-50/40 px-4 py-2 text-xs italic text-gray-700">
            {list.note}
          </p>
        )}
      </Card>

      <Card padded={false}>
        <div className="grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4">
          <Stat label="Stocks" value={String(stats.total)} />
          <Stat label="Halal" value={`${stats.pass} (${passPct}%)`} tone="pass" />
          <Stat label="Avg yield" value={`${stats.avgDividendYield.toFixed(1)}%`} />
          <Stat label="Total cap" value={fmtMarketCap(stats.totalMarketCapUsd)} />
        </div>
      </Card>

      <div>
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-gray-500">
          Screen against
        </div>
        <ScholarPicker value={scholarId} onChange={setScholarId} />
      </div>

      <Card padded={false} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-5 py-3">Company</th>
                <th className="px-5 py-3 text-right">Market cap</th>
                <th className="hidden px-5 py-3 text-right md:table-cell">Div yield</th>
                <th className="hidden px-5 py-3 text-right md:table-cell">Debt/cap</th>
                <th className="hidden px-5 py-3 text-right lg:table-cell">Impure inc.</th>
                <th className="px-5 py-3 text-right">Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map(({ stock, verdict }) => (
                <tr key={stock.ticker} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <Link
                      href={`/screen?ticker=${stock.ticker}`}
                      className="flex items-center gap-3 group"
                    >
                      <StockLogo ticker={stock.ticker} name={stock.name} size={28} />
                      <div>
                        <div className="font-semibold text-gray-900 group-hover:text-navy-800">
                          {stock.ticker}
                        </div>
                        <div className="text-xs text-gray-500">{stock.name}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-gray-800">
                    {fmtMarketCap(stock.marketCapUsd)}
                  </td>
                  <td className="hidden px-5 py-3 text-right tabular-nums text-gray-800 md:table-cell">
                    {stock.dividendYieldPct
                      ? `${stock.dividendYieldPct.toFixed(1)}%`
                      : "—"}
                  </td>
                  <td className="hidden px-5 py-3 text-right tabular-nums text-gray-800 md:table-cell">
                    {stock.debtToMarketCapPct.toFixed(1)}%
                  </td>
                  <td className="hidden px-5 py-3 text-right tabular-nums text-gray-800 lg:table-cell">
                    {stock.impermissibleIncomePct.toFixed(1)}%
                  </td>
                  <td className="px-5 py-3 text-right">
                    <VerdictPill verdict={verdict} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="bg-gray-50">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
          More lists
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {CURATED_LISTS.filter((l) => l.slug !== list.slug).map((l) => (
            <Link
              key={l.slug}
              href={`/lists/${l.slug}`}
              className="inline-flex items-center rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:border-navy-300 hover:bg-navy-50 hover:text-navy-800"
            >
              {l.title}
            </Link>
          ))}
        </div>
      </Card>

      <p className="text-center text-xs text-gray-500">
        Curated lists are starting points for research, not investment advice. Names are
        re-screened on every page load against the scholar you select above.
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "pass" | "neutral";
}) {
  const cls = tone === "pass" ? "text-emerald-700" : "text-gray-900";
  return (
    <div className="px-5 py-4">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </div>
      <div
        className={`mt-1 text-2xl font-bold ${cls}`}
        style={{ fontFamily: "Georgia, serif" }}
      >
        {value}
      </div>
    </div>
  );
}

function VerdictPill({ verdict }: { verdict: Verdict }) {
  const tone = verdict === "pass" ? "pass" : verdict === "borderline" ? "warn" : "fail";
  return <Pill tone={tone}>{VERDICT_LABEL[verdict]}</Pill>;
}
