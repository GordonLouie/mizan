"use client";

import { useState } from "react";
import type { ScreeningResult, StockFundamentals } from "@/lib/types";
import RatioBar from "./RatioBar";
import GlossaryTerm from "./GlossaryTerm";
import { GLOSSARY } from "@/lib/glossaryEntries";
import { VERDICT_LABEL } from "@/lib/verdictLabels";

interface Props {
  stock: StockFundamentals;
  result: ScreeningResult;
}

function plainExplanation(stock: StockFundamentals, result: ScreeningResult): { headline: string; reason: string; details: string[] } {
  if (result.verdict === "pass") {
    return {
      headline: `Yes — ${stock.ticker} is halal under ${result.scholarLabel}.`,
      reason: `${stock.name}'s business is permissible, and its finances are within this scholar's limits.`,
      details: [
        "It earns from a permissible business (no alcohol, gambling, conventional banking, etc.).",
        "Its borrowing is within the limit your scholar accepts.",
        "Its cash and interest-earning holdings are within limits.",
      ],
    };
  }
  if (result.verdict === "borderline") {
    const failed = result.ratioChecks.find((c) => !c.passes);
    return {
      headline: `Doubtful — ${stock.ticker} fails one check under ${result.scholarLabel}.`,
      reason: `Everything else passes, but ${failed?.label.toLowerCase()} is outside this scholar's threshold.`,
      details: [
        "The business itself is permissible.",
        "Most ratios are within limits.",
        `${failed?.label} comes in at ${failed?.value.toFixed(1)}% versus a limit of ${failed?.threshold}% — that's why it didn't fully pass.`,
      ],
    };
  }
  // fail
  if (!result.sectorPasses) {
    return {
      headline: `No — ${stock.ticker} is not halal under ${result.scholarLabel}.`,
      reason: `${stock.name}'s main business is in a sector your scholar excludes.`,
      details: [result.sectorReason],
    };
  }
  const fails = result.ratioChecks.filter((c) => !c.passes);
  return {
    headline: `No — ${stock.ticker} is not halal under ${result.scholarLabel}.`,
    reason: `${stock.name}'s business is permissible, but its finances exceed this scholar's limits.`,
    details: fails.map((c) => `${c.label}: ${c.value.toFixed(1)}% (limit ${c.threshold}%) — ${c.explanation}`),
  };
}

const VERDICT_COLOR: Record<string, { text: string; bg: string }> = {
  pass:        { text: "text-emerald-700", bg: "bg-emerald-50" },
  borderline:  { text: "text-amber-700",  bg: "bg-amber-50" },
  fail:        { text: "text-rose-700",   bg: "bg-rose-50" },
};

export default function ComplianceCard({ stock, result }: Props) {
  const [showMath, setShowMath] = useState(false);
  const plain = plainExplanation(stock, result);
  const colors = VERDICT_COLOR[result.verdict];

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      {/* Headline strip */}
      <div className={`${colors.bg} px-6 py-8 sm:px-10 sm:py-12`}>
        <div className="text-xs font-semibold uppercase tracking-widest text-gray-500">
          {stock.ticker}  ·  {stock.name}  ·  {result.scholarLabel}
        </div>
        <div className={`mt-4 text-5xl font-bold sm:text-6xl ${colors.text}`} style={{ fontFamily: "Georgia, serif" }}>
          {VERDICT_LABEL[result.verdict]}
        </div>
        <p className="mt-4 max-w-xl text-base leading-7 text-gray-800">
          {plain.headline}
        </p>
        <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600">
          {plain.reason}
        </p>
      </div>

      {/* Plain-language details */}
      <div className="border-t border-gray-100 px-6 py-6 sm:px-10">
        <div className="text-xs font-semibold uppercase tracking-widest text-gray-500">Why this verdict</div>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-700">
          {plain.details.map((d, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-2 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-gray-400" />
              <span>{d}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          <strong>{result.scholarLabel} on{" "}
            <GlossaryTerm term="purification" def={GLOSSARY["purification"]}>purification</GlossaryTerm>:
          </strong>{" "}
          {result.purificationNote}
        </div>

        {/* Toggle */}
        <button
          type="button"
          onClick={() => setShowMath((s) => !s)}
          className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-navy-700 hover:text-navy-900"
        >
          {showMath ? "Hide" : "Show"} the math →
        </button>

        {showMath && (
          <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
            <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-sm">
              <div className="font-medium text-gray-800">Business activity check</div>
              <div className="mt-0.5 text-gray-700">
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
