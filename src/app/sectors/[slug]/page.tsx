"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SCHOLAR_PROFILES } from "@/lib/scholars";
import { sectorFromSlug, sectorRows, listSectors } from "@/lib/sectors";
import { fmtMarketCap } from "@/lib/lists";
import { VERDICT_LABEL } from "@/lib/verdictLabels";
import { Card, PageHeader, Pill } from "@/components/ui";
import ScholarPicker from "@/components/ScholarPicker";
import StockLogo from "@/components/StockLogo";
import type { Verdict } from "@/lib/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function SectorDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const sectorName = sectorFromSlug(slug);
  if (!sectorName) notFound();

  const [scholarId, setScholarId] = useState("aaoifi");
  useEffect(() => {
    try {
      const saved = localStorage.getItem("mizan.scholarId");
      if (saved && SCHOLAR_PROFILES.some((p) => p.id === saved)) setScholarId(saved);
    } catch {}
  }, []);

  const id = scholarId === "custom" ? "aaoifi" : scholarId;
  const rows = useMemo(() => sectorRows(sectorName, id), [sectorName, id]);
  const sectorList = useMemo(() => listSectors(id), [id]);
  const summary = sectorList.find((s) => s.slug === slug);

  if (!summary) return null;

  return (
    <div className="space-y-6">
      <nav className="text-xs text-gray-500">
        <Link href="/sectors" className="hover:text-navy-800">Sectors</Link>{" "}
        / <span className="text-gray-700">{sectorName}</span>
      </nav>

      <PageHeader
        kicker="Sector deep-dive"
        title={sectorName}
        description={`${summary.total} tracked names — ${summary.pass} halal, ${summary.borderline} doubtful, ${summary.fail} not halal under your scholar.`}
      />

      <ScholarPicker value={scholarId} onChange={setScholarId} />

      {/* Sector stats */}
      <Card padded={false}>
        <div className="grid grid-cols-2 divide-x divide-y divide-gray-100 sm:grid-cols-4 sm:divide-y-0">
          <Stat label="Halal rate" value={`${Math.round(summary.passPct * 100)}%`} sub="by count" tone="pass" />
          <Stat
            label="Halal by mcap"
            value={`${Math.round((summary.passMarketCapUsd / Math.max(1, summary.totalMarketCapUsd)) * 100)}%`}
            sub="weighted"
            tone="pass"
          />
          <Stat label="Aggregate cap" value={fmtMarketCap(summary.totalMarketCapUsd)} />
          <Stat
            label="Avg passing yield"
            value={summary.avgPassingDividendYield > 0 ? `${summary.avgPassingDividendYield.toFixed(1)}%` : "—"}
            sub="dividend"
          />
        </div>
      </Card>

      {/* The table */}
      <Card padded={false} className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              <th className="px-5 py-3">Company</th>
              <th className="px-5 py-3 text-right">Market cap</th>
              <th className="hidden px-5 py-3 text-right md:table-cell">Div yield</th>
              <th className="hidden px-5 py-3 text-right md:table-cell">Debt/cap</th>
              <th className="hidden px-5 py-3 text-right lg:table-cell">Tangible</th>
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
                      <div className="font-mono text-xs font-semibold text-gray-900 group-hover:text-navy-800">
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
                  {stock.dividendYieldPct > 0 ? `${stock.dividendYieldPct.toFixed(1)}%` : "—"}
                </td>
                <td className="hidden px-5 py-3 text-right tabular-nums text-gray-800 md:table-cell">
                  {stock.debtToMarketCapPct.toFixed(1)}%
                </td>
                <td className="hidden px-5 py-3 text-right tabular-nums text-gray-800 lg:table-cell">
                  {stock.illiquidAssetsToTotalAssetsPct.toFixed(0)}%
                </td>
                <td className="px-5 py-3 text-right">
                  <VerdictPill verdict={verdict} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Cross-sector navigation */}
      <Card className="bg-gray-50">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
          Browse other sectors
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {sectorList
            .filter((s) => s.slug !== slug)
            .map((s) => (
              <Link
                key={s.slug}
                href={`/sectors/${s.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:border-navy-300 hover:text-navy-800"
              >
                {s.sector}
                <span className="font-mono text-[10px] text-emerald-700">
                  {Math.round(s.passPct * 100)}%
                </span>
              </Link>
            ))}
        </div>
      </Card>

      <p className="text-center text-xs text-gray-500">
        Tap any company for the full per-scholar breakdown. Back to{" "}
        <Link href="/sectors" className="text-navy-700 underline">sectors</Link> ·{" "}
        <Link href="/discover" className="text-navy-700 underline">discover</Link>.
      </p>
    </div>
  );
}

function VerdictPill({ verdict }: { verdict: Verdict }) {
  const tone = verdict === "pass" ? "pass" : verdict === "borderline" ? "warn" : "fail";
  return <Pill tone={tone}>{VERDICT_LABEL[verdict]}</Pill>;
}

function Stat({
  label,
  value,
  sub,
  tone = "neutral",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "pass" | "neutral";
}) {
  const cls = tone === "pass" ? "text-emerald-700" : "text-gray-900";
  return (
    <div className="px-5 py-4">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">{label}</div>
      <div className={`mt-1 text-lg font-bold ${cls}`} style={{ fontFamily: "Georgia, serif" }}>
        {value}
      </div>
      {sub && <div className="mt-0.5 text-[10px] text-gray-500">{sub}</div>}
    </div>
  );
}
