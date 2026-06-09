"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SCHOLAR_PROFILES } from "@/lib/scholars";
import { listSectors } from "@/lib/sectors";
import { fmtMarketCap } from "@/lib/lists";
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
    const id = scholarId === "custom" ? "aaoifi" : scholarId;
    return listSectors(id);
  }, [scholarId]);

  const totalMcap = sectors.reduce((s, x) => s + x.totalMarketCapUsd, 0);
  const totalPassMcap = sectors.reduce((s, x) => s + x.passMarketCapUsd, 0);

  return (
    <div className="pb-20">
      {/* PAGE HEADER */}
      <header className="pt-6">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          By industry
        </div>
        <h1
          className="mt-3 text-[36px] font-bold leading-[1.1] text-gray-900 sm:text-[44px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Sectors
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-gray-600">
          Every industry, with its halal pass-rate and the biggest names inside. Click any
          sector for the full ranked list.
        </p>
      </header>

      {/* SCHOLAR PICKER */}
      <div className="mt-8 sm:max-w-md">
        <ScholarPicker value={scholarId} onChange={setScholarId} />
      </div>

      {/* UNIVERSE SUMMARY */}
      <div className="mt-10 grid grid-cols-2 gap-y-5 border-y border-gray-200 py-5 sm:grid-cols-4">
        <StatPlain label="Sectors" value={String(sectors.length)} />
        <StatPlain
          label="Halal by mkt cap"
          value={`${Math.round((totalPassMcap / Math.max(1, totalMcap)) * 100)}%`}
          sub="weighted"
          tone="emerald"
        />
        <StatPlain label="Aggregate cap" value={fmtMarketCap(totalMcap)} />
        <StatPlain label="Halal cap" value={fmtMarketCap(totalPassMcap)} tone="emerald" />
      </div>

      {/* SECTOR LIST */}
      <section className="mt-12">
        <ul className="divide-y divide-gray-100 border-y border-gray-200">
          {sectors.map((s) => {
            const pct = Math.round(s.passPct * 100);
            return (
              <li key={s.slug}>
                <Link
                  href={`/sectors/${s.slug}`}
                  className="grid grid-cols-1 items-center gap-4 py-5 transition hover:bg-gray-50 sm:grid-cols-[1fr_auto] sm:gap-6"
                >
                  <div className="min-w-0">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3
                        className="text-[17px] font-bold text-gray-900 group-hover:text-navy-800"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {s.sector}
                      </h3>
                      <span className="font-mono text-[11px] text-gray-500">
                        {fmtMarketCap(s.totalMarketCapUsd)}
                      </span>
                    </div>
                    <div className="mt-1 text-[12px] text-gray-500">
                      <span className="font-semibold text-emerald-700">{s.pass}</span>{" "}
                      halal ·{" "}
                      <span className="font-semibold text-amber-700">{s.borderline}</span>{" "}
                      doubtful ·{" "}
                      <span className="font-semibold text-rose-700">{s.fail}</span> not
                      halal <span className="text-gray-400">·</span> {s.total} tracked
                      {s.avgPassingDividendYield > 0 && (
                        <span>
                          {" "}
                          <span className="text-gray-400">·</span>{" "}
                          {s.avgPassingDividendYield.toFixed(1)}% avg passing yield
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:w-auto">
                    <div className="h-2 w-full overflow-hidden bg-gray-100 sm:w-44">
                      <div
                        className="h-full bg-navy-800 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-12 text-right font-mono text-sm font-bold tabular-nums text-gray-900">
                      {pct}%
                    </span>
                    <ArrowRight size={14} className="text-gray-400" />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <p className="mt-12 text-center text-[11px] text-gray-500">
        Pass-rates reflect Mizan&apos;s current {sectors.reduce((s, x) => s + x.total, 0)}-ticker
        representative sample. Live FMP integration is wired in for production expansion.
      </p>
    </div>
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
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
      </div>
      {sub && <div className="mt-1 text-[11px] text-gray-500">{sub}</div>}
    </div>
  );
}
