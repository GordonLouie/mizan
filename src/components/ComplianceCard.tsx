"use client";

import { useState } from "react";
import type { ScreeningResult, StockFundamentals } from "@/lib/types";
import RatioBar from "./RatioBar";
import StockLogo from "./StockLogo";
import { VERDICT_LABEL } from "@/lib/verdictLabels";

interface Props {
  stock: StockFundamentals;
  result: ScreeningResult;
}

function plainReason(stock: StockFundamentals, result: ScreeningResult): string {
  if (result.verdict === "pass") {
    return `${stock.name}'s business is permissible and its finances are within this scholar's limits.`;
  }
  if (result.verdict === "borderline") {
    const failed = result.ratioChecks.find((c) => !c.passes);
    return `Everything passes except ${failed?.label.toLowerCase()} — ${failed?.value.toFixed(1)}% versus a limit of ${failed?.threshold}%.`;
  }
  if (!result.sectorPasses) {
    return `${stock.name}'s main business falls in a sector this scholar excludes (${result.sectorReason.replace("Excluded sector: ", "").replace(".", "")}).`;
  }
  const failed = result.ratioChecks.filter((c) => !c.passes);
  if (failed.length === 1) {
    return `Business is permissible, but ${failed[0].label.toLowerCase()} comes in at ${failed[0].value.toFixed(1)}% versus a limit of ${failed[0].threshold}%.`;
  }
  return `${stock.name}'s business is permissible, but ${failed.length} financial ratios exceed this scholar's limits.`;
}

const VERDICT_COLOR: Record<string, { text: string; bg: string; border: string }> = {
  pass:       { text: "text-emerald-700", bg: "bg-emerald-50",  border: "border-emerald-100" },
  borderline: { text: "text-amber-700",   bg: "bg-amber-50",    border: "border-amber-100" },
  fail:       { text: "text-rose-700",    bg: "bg-rose-50",     border: "border-rose-100" },
};

export default function ComplianceCard({ stock, result }: Props) {
  const [showMath, setShowMath] = useState(false);
  const reason = plainReason(stock, result);
  const colors = VERDICT_COLOR[result.verdict];
  const dataAsOf = "Q1 2026";

  return (
    <article className={`overflow-hidden rounded-2xl border ${colors.border} bg-white`}>
      {/* Hero verdict */}
      <div className={`${colors.bg} px-6 py-10 sm:px-10 sm:py-14`}>
        {/* Top row: logo + meta */}
        <div className="flex items-center gap-3">
          <StockLogo ticker={stock.ticker} name={stock.name} size={40} />
          <div>
            <div className="font-mono text-sm font-semibold tracking-tight text-gray-900">{stock.ticker}</div>
            <div className="text-xs text-gray-600">{stock.name}</div>
          </div>
        </div>

        {/* The verdict word */}
        <div className={`mt-8 text-6xl font-bold leading-none sm:text-7xl ${colors.text}`} style={{ fontFamily: "Georgia, serif" }}>
          {VERDICT_LABEL[result.verdict]}
        </div>
        <p className="mt-5 max-w-xl text-sm leading-6 text-gray-700">
          {reason}
        </p>

        {/* Meta row */}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-gray-200/60 pt-5 text-xs">
          <div>
            <span className="font-semibold uppercase tracking-widest text-gray-500">Scholar</span>
            <span className="ml-2 text-gray-800">{result.scholarLabel}</span>
          </div>
          <div>
            <span className="font-semibold uppercase tracking-widest text-gray-500">Data as of</span>
            <span className="ml-2 font-mono text-gray-800">{dataAsOf}</span>
          </div>
          <div>
            <span className="font-semibold uppercase tracking-widest text-gray-500">Purification</span>
            <span className="ml-2 text-gray-800">
              {result.purificationNote.includes("BOTH") ? "Dividends + gains" : "Dividends only"}
            </span>
          </div>
        </div>

        {/* Primary source citation — Ibrahim Malik feedback (2026-06-04):
            "reference where the numbers are coming from, cross check if needed" */}
        <div className="mt-3 flex flex-wrap items-baseline gap-x-2 text-xs">
          <span className="font-semibold uppercase tracking-widest text-gray-500">Source</span>
          <span className="text-gray-700">{result.scholarSourceLabel}</span>
          <a
            href="/methodology"
            className="ml-1 inline-flex items-center text-[11px] font-medium text-navy-700 hover:text-navy-900"
          >
            full citation chain →
          </a>
        </div>
      </div>

      {/* Show the math (collapsed by default) */}
      <div className="border-t border-gray-100">
        <button
          type="button"
          onClick={() => setShowMath((s) => !s)}
          className="flex w-full items-center justify-between px-6 py-3 text-xs font-medium text-navy-700 hover:bg-gray-50 sm:px-10"
        >
          <span>{showMath ? "Hide" : "Show"} the math</span>
          <span className="text-gray-400">{showMath ? "−" : "+"}</span>
        </button>

        {showMath && (
          <div className="space-y-3 border-t border-gray-100 px-6 py-5 sm:px-10">
            <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-sm">
              <div className="text-xs font-semibold uppercase tracking-widest text-gray-500">Sector check</div>
              <div className="mt-1 text-gray-700">
                {result.sectorPasses ? (
                  <span className="text-emerald-700">✓ {result.sectorReason}</span>
                ) : (
                  <span className="text-rose-700">✗ {result.sectorReason}</span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {result.ratioChecks.map((c, i) => <RatioBar key={i} check={c} />)}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
