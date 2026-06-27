"use client";

/**
 * /scholars — the "Your scholar" hub (the CALIBRATE stage).
 *
 * The single home for the one decision that personalises the whole product:
 * which scholarly standard HalalGauge screens under. Choosing here persists to
 * localStorage ("mizan.scholarId") and flows into every verdict, the portfolio,
 * the drift watch and purification — so it's framed as a one-time setup, not a
 * throwaway dropdown.
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ScanSearch, BarChart3, Check } from "lucide-react";
import ScholarPicker from "@/components/ScholarPicker";
import { SCHOLAR_PROFILES } from "@/lib/scholars";
import type { ScholarProfile } from "@/lib/types";

function maxPct(n: number | null): string {
  return n == null ? "—" : `≤ ${n}%`;
}
function minPct(n: number | null): string {
  return n == null ? "—" : `≥ ${n}%`;
}
function purif(scope: ScholarProfile["purificationScope"]): string {
  return scope === "dividends_and_gains" ? "Dividends + gains" : "Dividends";
}

const COLS: { key: string; head: string; get: (p: ScholarProfile) => string }[] = [
  { key: "income", head: "Impermissible income", get: (p) => maxPct(p.maxImpermissibleIncomePct) },
  { key: "debt", head: "Debt / mkt cap", get: (p) => maxPct(p.maxDebtToMarketCapPct) },
  { key: "cash", head: "Cash + securities", get: (p) => maxPct(p.maxCashSecuritiesToMarketCapPct) },
  { key: "recv", head: "Receivables", get: (p) => maxPct(p.maxReceivablesToMarketCapPct) },
  { key: "illiq", head: "Illiquid-asset floor", get: (p) => minPct(p.minIlliquidAssetsToTotalAssetsPct) },
  { key: "purif", head: "Purification", get: (p) => purif(p.purificationScope) },
];

export default function ScholarsPage() {
  const [scholarId, setScholarId] = useState("aaoifi");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem("mizan.scholarId");
      if (s && SCHOLAR_PROFILES.some((p) => p.id === s)) setScholarId(s);
    } catch {}
    setHydrated(true);
  }, []);

  const current = useMemo(
    () => SCHOLAR_PROFILES.find((p) => p.id === scholarId) ?? SCHOLAR_PROFILES[0],
    [scholarId],
  );

  return (
    <div className="pb-20">
      {/* HEADER */}
      <header className="pt-6">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Your scholar
        </div>
        <h1
          className="mt-3 text-[36px] font-bold leading-[1.1] text-gray-900 sm:text-[44px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Pick your scholar once.
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-gray-600">
          This is the one setting that personalises everything. HalalGauge applies
          your chosen standard to every verdict, your portfolio, the drift watch
          and your purification total — and remembers it across visits.
        </p>
      </header>

      {/* CURRENT SELECTION */}
      <div className="mt-8 flex flex-wrap items-center gap-3 rounded-xl border border-navy-200 bg-navy-50/50 px-4 py-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy-800 text-white">
          <Check size={14} />
        </span>
        <div className="text-[14px] text-gray-700">
          You&apos;re currently screening under{" "}
          <span className="font-bold text-gray-900">{current.label}</span>.
        </div>
      </div>

      {/* PICKER (expanded card grid + help-me-choose lives in the component) */}
      <section className="mt-8">
        {hydrated && (
          <ScholarPicker value={scholarId} onChange={setScholarId} expanded />
        )}
      </section>

      {/* COMPARISON TABLE — the transparent, side-by-side view. */}
      <section className="mt-12">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Side by side
        </div>
        <h2
          className="mt-2 text-[24px] font-bold leading-tight text-gray-900 sm:text-[28px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          How the standards differ
        </h2>
        <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-gray-600">
          The same company can pass under one standard and fail under another —
          this is exactly where they diverge. Every threshold traces to a
          published primary source.
        </p>

        <div className="mt-5 overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                  Standard
                </th>
                {COLS.map((c) => (
                  <th
                    key={c.key}
                    className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500"
                  >
                    {c.head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SCHOLAR_PROFILES.filter((p) => p.id !== "custom").map((p) => {
                const isCurrent = p.id === scholarId;
                return (
                  <tr
                    key={p.id}
                    className={
                      "border-b border-gray-100 last:border-0 " +
                      (isCurrent ? "bg-navy-50/40" : "")
                    }
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-gray-900">{p.short}</span>
                        {isCurrent && (
                          <span className="rounded-full bg-navy-800 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
                            Yours
                          </span>
                        )}
                      </div>
                    </td>
                    {COLS.map((c) => (
                      <td key={c.key} className="px-4 py-3 font-mono text-[12px] tabular-nums text-gray-700">
                        {c.get(p)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-[11px] leading-relaxed text-gray-500">
          These are contemporary screening <em>standards</em>, not schools of fiqh.
          Read the full sourcing on the{" "}
          <Link href="/methodology" className="font-medium text-navy-700 hover:text-navy-900">
            methodology page
          </Link>
          . If you&apos;re unsure, AAOIFI is a safe, mainstream default.
        </p>
      </section>

      {/* NEXT STEPS */}
      <section className="mt-12 flex flex-col gap-3 rounded-2xl border border-navy-200 bg-navy-50/50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div>
          <h3
            className="text-[20px] font-bold leading-tight text-gray-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Set — now put {current.short} to work.
          </h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-gray-600">
            Screen any stock under your standard, or build a portfolio HalalGauge
            keeps watch on.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2.5">
          <Link
            href="/screen"
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-navy-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-700"
          >
            <ScanSearch size={15} /> Screen a stock
          </Link>
          <Link
            href="/portfolio"
            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:text-gray-900"
          >
            <BarChart3 size={15} /> Build your portfolio <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
