"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SCHOLAR_PROFILES } from "@/lib/scholars";
import { listSectors } from "@/lib/sectors";
import { fmtMarketCap } from "@/lib/lists";
import { Card, PageHeader } from "@/components/ui";
import ScholarPicker from "@/components/ScholarPicker";

export default function SectorsIndex() {
  const [scholarId, setScholarId] = useState("aaoifi");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("mizan.scholarId");
      if (saved && SCHOLAR_PROFILES.some((p) => p.id === saved)) setScholarId(saved);
    } catch {}
  }, []);

  const sectors = useMemo(() => {
    // Custom profile reads from localStorage; fall back to AAOIFI for index aggregates
    const id = scholarId === "custom" ? "aaoifi" : scholarId;
    return listSectors(id);
  }, [scholarId]);

  const totalMcap = sectors.reduce((s, x) => s + x.totalMarketCapUsd, 0);
  const totalPassMcap = sectors.reduce((s, x) => s + x.passMarketCapUsd, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        kicker="By industry"
        title="Sectors"
        description="Every industry, with its halal pass-rate and the biggest names inside. Click any sector for the full ranked list."
      />

      <ScholarPicker value={scholarId} onChange={setScholarId} />

      {/* Universe-wide summary */}
      <Card padded={false}>
        <div className="grid grid-cols-2 divide-x divide-y divide-gray-100 sm:grid-cols-4 sm:divide-y-0">
          <Stat label="Sectors" value={String(sectors.length)} />
          <Stat
            label="Halal by market cap"
            value={`${Math.round((totalPassMcap / Math.max(1, totalMcap)) * 100)}%`}
            sub="weighted across all sectors"
            tone="pass"
          />
          <Stat label="Aggregate market cap" value={fmtMarketCap(totalMcap)} />
          <Stat label="Halal market cap" value={fmtMarketCap(totalPassMcap)} tone="pass" />
        </div>
      </Card>

      {/* Sector list */}
      <Card padded={false}>
        <ul className="divide-y divide-gray-100">
          {sectors.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/sectors/${s.slug}`}
                className="flex flex-wrap items-center gap-4 px-6 py-4 transition hover:bg-gray-50 sm:px-8"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-base font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
                      {s.sector}
                    </h3>
                    <span className="text-xs text-gray-500">{fmtMarketCap(s.totalMarketCapUsd)} aggregate</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    <span className="font-semibold text-emerald-700">{s.pass}</span> halal ·{" "}
                    <span className="font-semibold text-amber-700">{s.borderline}</span> doubtful ·{" "}
                    <span className="font-semibold text-rose-700">{s.fail}</span> not halal{" "}
                    <span className="text-gray-400">·</span> {s.total} tracked
                    {s.avgPassingDividendYield > 0 && (
                      <span> <span className="text-gray-400">·</span> {s.avgPassingDividendYield.toFixed(1)}% avg passing yield</span>
                    )}
                  </div>
                </div>

                <div className="flex w-full items-center gap-3 sm:w-auto">
                  <div className="h-2 w-full flex-1 overflow-hidden rounded-full bg-gray-100 sm:w-40">
                    <div
                      className="h-full rounded-full bg-emerald-600"
                      style={{ width: `${Math.round(s.passPct * 100)}%` }}
                    />
                  </div>
                  <span className="w-12 text-right font-mono text-sm font-bold tabular-nums text-gray-900">
                    {Math.round(s.passPct * 100)}%
                  </span>
                  <ArrowRight size={14} className="text-gray-400" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Card>

      <p className="text-center text-xs text-gray-500">
        Pass-rates reflect the prototype dataset of 163 representative tickers. Production
        coverage scales to any listed equity.
      </p>
    </div>
  );
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
