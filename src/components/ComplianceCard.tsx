"use client";

import { useState } from "react";
import type { ScreeningResult, StockFundamentals } from "@/lib/types";
import RatioBar from "./RatioBar";
import GlossaryTerm from "./GlossaryTerm";
import { GLOSSARY } from "@/lib/glossaryEntries";

interface Props {
  stock: StockFundamentals;
  result: ScreeningResult;
}

function plainExplanation(stock: StockFundamentals, result: ScreeningResult): { headline: string; reason: string; details: string[] } {
  if (result.verdict === "pass") {
    return {
      headline: `Yes — ${stock.ticker} is permissible under ${result.scholarLabel}.`,
      reason: `${stock.name}'s business is permissible, and its finances are within this scholar's limits.`,
      details: [
        "It earns money from a permissible business (no alcohol, gambling, conventional banking, etc.).",
        "Its borrowing is within the limit your scholar accepts.",
        "Its cash and interest-earning holdings are within limits.",
      ],
    };
  }
  if (result.verdict === "borderline") {
    const failed = result.ratioChecks.find((c) => !c.passes);
    return {
      headline: `Borderline — ${stock.ticker} fails one check under ${result.scholarLabel}.`,
      reason: `Everything else passes, but ${failed?.label.toLowerCase()} is above this scholar's threshold.`,
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
      headline: `No — ${stock.ticker} isn't permissible under ${result.scholarLabel}.`,
      reason: `${stock.name}'s main business is in a sector your scholar excludes.`,
      details: [result.sectorReason],
    };
  }
  const fails = result.ratioChecks.filter((c) => !c.passes);
  return {
    headline: `No — ${stock.ticker} fails under ${result.scholarLabel}.`,
    reason: `${stock.name}'s business is permissible, but its finances exceed this scholar's limits.`,
    details: fails.map((c) => `${c.label}: ${c.value.toFixed(1)}% (limit ${c.threshold}%) — ${c.explanation}`),
  };
}

const VERDICT_STYLES: Record<string, { card: string; pill: string; emoji: string }> = {
  pass: {
    card: "border-emerald-200",
    pill: "bg-emerald-50 text-emerald-700 border-emerald-200",
    emoji: "✓",
  },
  borderline: {
    card: "border-amber-200",
    pill: "bg-amber-50 text-amber-700 border-amber-200",
    emoji: "⚠",
  },
  fail: {
    card: "border-rose-200",
    pill: "bg-rose-50 text-rose-700 border-rose-200",
    emoji: "✗",
  },
};

export default function ComplianceCard({ stock, result }: Props) {
  const [mode, setMode] = useState<"simple" | "detailed">("simple");
  const styles = VERDICT_STYLES[result.verdict];
  const plain = plainExplanation(stock, result);

  return (
    <div className={"rounded-xl border bg-white p-5 shadow-sm " + styles.card}>
      {/* Top: ticker + name + verdict pill */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">{stock.sector}</div>
          <div className="text-2xl font-bold text-gray-900">
            {stock.ticker}
            <span className="ml-2 text-sm font-normal text-gray-500">{stock.name}</span>
          </div>
        </div>
        <div className={"rounded-md border px-3 py-1.5 text-sm font-semibold uppercase " + styles.pill}>
          <span className="mr-1">{styles.emoji}</span>{result.verdict}
        </div>
      </div>

      {/* Plain-language headline */}
      <div className="mt-4 rounded-md border border-gray-200 bg-gray-50 p-4">
        <div className="text-lg font-semibold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
          {plain.headline}
        </div>
        <p className="mt-2 text-sm leading-6 text-gray-700">{plain.reason}</p>
      </div>

      {/* Mode toggle */}
      <div className="mt-4 flex gap-2 border-b border-gray-100 pb-3">
        <button type="button" onClick={() => setMode("simple")}
          className={
            "rounded-md border px-3 py-1.5 text-xs font-medium transition " +
            (mode === "simple"
              ? "border-navy-700 bg-navy-50 text-navy-800"
              : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50")
          }>
          Plain English
        </button>
        <button type="button" onClick={() => setMode("detailed")}
          className={
            "rounded-md border px-3 py-1.5 text-xs font-medium transition " +
            (mode === "detailed"
              ? "border-navy-700 bg-navy-50 text-navy-800"
              : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50")
          }>
          Show me the math
        </button>
      </div>

      {/* Body: simple vs detailed */}
      {mode === "simple" ? (
        <div className="mt-4 space-y-3">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Why this verdict</div>
            <ul className="mt-2 ml-5 list-disc space-y-1.5 text-sm leading-6 text-gray-700">
              {plain.details.map((d, i) => <li key={i}>{d}</li>)}
            </ul>
          </div>

          <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <strong className="block text-amber-900">{result.scholarLabel} on{" "}
              <GlossaryTerm term="purification" def={GLOSSARY["purification"]}>purification</GlossaryTerm>:
            </strong>
            <span className="mt-1 block">{result.purificationNote}</span>
          </div>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
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
            {result.ratioChecks.map((c, i) => (<RatioBar key={i} check={c} />))}
          </div>

          <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <strong>Purification:</strong> {result.purificationNote}
          </div>
        </div>
      )}
    </div>
  );
}
