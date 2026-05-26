"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { SCHOLAR_PROFILES } from "@/lib/scholars";
import { sectorFromSlug, sectorRows, listSectors } from "@/lib/sectors";
import { fmtMarketCap } from "@/lib/lists";
import { VERDICT_LABEL } from "@/lib/verdictLabels";
import ScholarPicker from "@/components/ScholarPicker";
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
    <div className="pb-20">
      {/* BREADCRUMB */}
      <nav className="pt-6 text-[12px] text-gray-500">
        <Link
          href="/sectors"
          className="inline-flex items-center gap-1 hover:text-navy-700"
        >
          <ChevronLeft size={12} /> All sectors
        </Link>
      </nav>

      {/* PAGE HEADER */}
      <header className="mt-6">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Sector deep-dive
        </div>
        <h1
          className="mt-3 text-[36px] font-bold leading-[1.1] text-gray-900 sm:text-[44px]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {sectorName}
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-gray-600">
          {summary.total} tracked names — {summary.pass} halal, {summary.borderline}{" "}
          doubtful, {summary.fail} not halal under your scholar.
        </p>
      </header>

      {/* SCHOLAR PICKER */}
      <div className="mt-8 sm:max-w-md">
        <ScholarPicker value={scholarId} onChange={setScholarId} />
      </div>

      {/* SECTOR STATS */}
      <div className="mt-10 grid grid-cols-2 gap-y-5 border-y border-gray-200 py-5 sm:grid-cols-4">
        <StatPlain
          label="Halal rate"
          value={`${Math.round(summary.passPct * 100)}%`}
          sub="by count"
          tone="emerald"
        />
        <StatPlain
          label="Halal by mcap"
          value={`${Math.round(
            (summary.passMarketCapUsd / Math.max(1, summary.totalMarketCapUsd)) * 100,
          )}%`}
          sub="weighted"
          tone="emerald"
        />
        <StatPlain label="Aggregate cap" value={fmtMarketCap(summary.totalMarketCapUsd)} />
        <StatPlain
          label="Avg passing yield"
          value={
            summary.avgPassingDividendYield > 0
              ? `${summary.avgPassingDividendYield.toFixed(1)}%`
              : "—"
          }
          sub="dividend"
        />
      </div>

      {/* STOCKS TABLE */}
      <div className="mt-10 overflow-x-auto">
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
                Tangible
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
                  {stock.dividendYieldPct > 0 ? `${stock.dividendYieldPct.toFixed(1)}%` : "—"}
                </td>
                <td className="hidden py-3 pr-4 text-right font-mono text-[13px] tabular-nums text-gray-800 md:table-cell">
                  {stock.debtToMarketCapPct.toFixed(1)}%
                </td>
                <td className="hidden py-3 pr-4 text-right font-mono text-[13px] tabular-nums text-gray-800 lg:table-cell">
                  {stock.illiquidAssetsToTotalAssetsPct.toFixed(0)}%
                </td>
                <td className="py-3 pr-2 text-right">
                  <VerdictPill verdict={verdict} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* OTHER SECTORS */}
      <div className="mt-16 border-t border-gray-200 pt-8">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Browse other sectors
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {sectorList
            .filter((s) => s.slug !== slug)
            .map((s) => (
              <Link
                key={s.slug}
                href={`/sectors/${s.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[12px] font-medium text-gray-700 transition hover:border-navy-300 hover:text-navy-800"
              >
                {s.sector}
                <span className="font-mono text-[10px] text-emerald-700">
                  {Math.round(s.passPct * 100)}%
                </span>
              </Link>
            ))}
        </div>
      </div>

      <p className="mt-12 text-center text-[11px] text-gray-500">
        Tap any company for the full per-scholar breakdown. Back to{" "}
        <Link href="/sectors" className="text-navy-700 underline hover:text-navy-900">
          sectors
        </Link>{" "}
        ·{" "}
        <Link href="/discover" className="text-navy-700 underline hover:text-navy-900">
          discover
        </Link>.
      </p>
    </div>
  );
}

function VerdictPill({ verdict }: { verdict: Verdict }) {
  const tone =
    verdict === "pass" ? "bg-emerald-50 text-emerald-700"
      : verdict === "fail" ? "bg-rose-50 text-rose-700"
        : "bg-amber-50 text-amber-700";
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${tone}`}
    >
      {VERDICT_LABEL[verdict]}
    </span>
  );
}

function StatPlain({
  label,
  value,
  sub,
  tone = "neutral",
}: {
  label: string;
  value: string;
  sub?: string;
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
        style={{ fontFamily: "Georgia, serif" }}
      >
        {value}
      </div>
      {sub && <div className="mt-1 text-[11px] text-gray-500">{sub}</div>}
    </div>
  );
}
