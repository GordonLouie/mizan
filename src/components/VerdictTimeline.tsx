/**
 * VerdictTimeline
 *
 * Track record of a stock's halal verdict across the last 8 quarters under
 * the active scholar. Direct response to Saifuddin Abbas's feedback:
 *   "interesting to track that over time as well bc a balance sheet may
 *    look v diff YoY"
 *
 * Visual: a band chart. Each quarter is a colored block (emerald = pass,
 * amber = borderline, rose = fail). Hover/tap a block to see that
 * quarter's deciding metric.
 *
 * Graceful degradation: stocks without verdictHistory show a friendly
 * "Historical tracking being ingested" notice.
 */

"use client";

import { useState } from "react";
import type {
  StockFundamentals,
  ScholarProfile,
  Verdict,
  VerdictHistoryEntry,
} from "@/lib/types";

interface Props {
  stock: StockFundamentals;
  scholar: ScholarProfile;
}

const TONE_BY_VERDICT: Record<Verdict, { bg: string; ring: string; text: string; label: string }> = {
  pass: {
    bg: "bg-emerald-500",
    ring: "ring-emerald-700",
    text: "text-emerald-700",
    label: "PASS",
  },
  borderline: {
    bg: "bg-amber-400",
    ring: "ring-amber-600",
    text: "text-amber-700",
    label: "BORDERLINE",
  },
  fail: {
    bg: "bg-rose-500",
    ring: "ring-rose-700",
    text: "text-rose-700",
    label: "FAIL",
  },
};

export default function VerdictTimeline({ stock, scholar }: Props) {
  const history = stock.verdictHistory;
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!history || history.length === 0) {
    return (
      <section className="mt-12 rounded-xl border border-gray-200 bg-white p-6">
        <header>
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
            Verdict track record
          </div>
          <h2
            className="mt-2 text-[20px] font-bold leading-tight text-gray-900 sm:text-[22px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            How has {stock.name}&apos;s halal status changed over time?
          </h2>
        </header>
        <div className="mt-5 rounded-md border border-amber-200 bg-amber-50/60 p-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-800">
            Historical tracking being ingested
          </div>
          <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-gray-700">
            We&apos;re progressively pulling quarterly history for every ticker so you can see when a
            company&apos;s halal status has shifted. AAPL already has full 8-quarter coverage —
            others will follow as we ingest from primary filings.
          </p>
        </div>
      </section>
    );
  }

  // Get the verdicts for the active scholar
  const series = history.map((entry) => ({
    ...entry,
    verdict: entry.verdictByScholar[scholar.id] ?? ("borderline" as Verdict),
    deciding: entry.decidingByScholar[scholar.id] ?? "All checks pass",
  }));

  // Count how many quarters in each verdict — for the summary line
  const passCount = series.filter((s) => s.verdict === "pass").length;
  const borderlineCount = series.filter((s) => s.verdict === "borderline").length;
  const failCount = series.filter((s) => s.verdict === "fail").length;

  // Detect verdict flips (consecutive entries with different verdicts)
  const flips = series.reduce((n, e, i) => {
    if (i === 0) return n;
    return e.verdict !== series[i - 1].verdict ? n + 1 : n;
  }, 0);

  const summaryText =
    flips === 0
      ? `Consistent ${series[0].verdict.toUpperCase()} for all 8 quarters under ${scholar.short}.`
      : `${flips} verdict change${flips > 1 ? "s" : ""} in the last 8 quarters — worth watching.`;

  // Stability Score (Miqdad feedback 2026-06-06): rewards consistency.
  // Pure pass-only history = 100. Each flip subtracts 15. Each borderline
  // quarter subtracts 5. Each fail subtracts 8. Floor at 0.
  let stabilityScore = 100;
  stabilityScore -= flips * 15;
  stabilityScore -= borderlineCount * 5;
  stabilityScore -= failCount * 8;
  stabilityScore = Math.max(0, Math.min(100, stabilityScore));
  const stabilityLabel =
    stabilityScore >= 85 ? "rock-solid" :
    stabilityScore >= 65 ? "stable" :
    stabilityScore >= 40 ? "watchful" :
    "volatile";
  const stabilityTone =
    stabilityScore >= 85 ? "text-emerald-700 border-emerald-200 bg-emerald-50" :
    stabilityScore >= 65 ? "text-emerald-700 border-emerald-200 bg-emerald-50/60" :
    stabilityScore >= 40 ? "text-amber-700 border-amber-200 bg-amber-50" :
    "text-rose-700 border-rose-200 bg-rose-50";

  return (
    <section className="mt-12 rounded-xl border border-gray-200 bg-white p-6">
      <header>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
            Verdict track record · last 8 quarters
          </div>
          {/* Stability Score badge — Miqdad's "set it and forget it" idea */}
          <div className={`inline-flex items-baseline gap-1.5 rounded-md border px-2 py-0.5 text-[11px] ${stabilityTone}`}>
            <span className="font-mono font-bold tabular-nums">{stabilityScore}</span>
            <span className="font-semibold uppercase tracking-[0.14em]">{stabilityLabel}</span>
            <span className="text-[10px] uppercase tracking-[0.12em] opacity-70">stability</span>
          </div>
        </div>
        <h2
          className="mt-2 text-[20px] font-bold leading-tight text-gray-900 sm:text-[22px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          How has {stock.name}&apos;s halal status changed over time?
        </h2>
        <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-gray-600">
          {summaryText} Halal compliance can shift quarter-to-quarter as debt levels, cash
          holdings, and income mix change. Hover any block to see that period&apos;s details.
        </p>
      </header>

      {/* ─── BAND CHART ─── */}
      <div className="mt-6">
        <div className="flex gap-1.5">
          {series.map((entry, i) => {
            const tone = TONE_BY_VERDICT[entry.verdict];
            const isHover = hoveredIdx === i;
            const isLast = i === series.length - 1;
            return (
              <button
                key={i}
                type="button"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                onFocus={() => setHoveredIdx(i)}
                onBlur={() => setHoveredIdx(null)}
                className={`group relative flex-1 cursor-default focus:outline-none`}
                aria-label={`${entry.quarter}: ${tone.label}`}
              >
                {/* The color band */}
                <div
                  className={`h-12 rounded-sm transition-all ${tone.bg} ${
                    isHover ? "ring-2 ring-offset-1 " + tone.ring : ""
                  } ${isLast ? "ring-1 " + tone.ring : ""}`}
                  style={{ opacity: isHover ? 1 : 0.85 }}
                />
                {/* Quarter label below */}
                <div
                  className={`mt-2 font-mono text-[10px] uppercase tracking-wider ${
                    isHover ? "font-bold text-gray-900" : "text-gray-500"
                  }`}
                >
                  {entry.quarter}
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail panel — shows hovered quarter, or the latest by default */}
        <DetailPanel
          entry={hoveredIdx !== null ? series[hoveredIdx] : series[series.length - 1]}
          scholar={scholar}
          isLatest={hoveredIdx === null || hoveredIdx === series.length - 1}
        />

        {/* Legend + summary stats */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-4 text-[11px] text-gray-600">
            <LegendDot color="bg-emerald-500" label={`${passCount} pass`} />
            {borderlineCount > 0 && (
              <LegendDot color="bg-amber-400" label={`${borderlineCount} borderline`} />
            )}
            {failCount > 0 && (
              <LegendDot color="bg-rose-500" label={`${failCount} fail`} />
            )}
          </div>
          {stock.nextEarningsDate && (
            <div className="text-[11px] text-gray-600">
              <span className="font-semibold uppercase tracking-[0.14em] text-gray-500">
                Next earnings:
              </span>{" "}
              <span className="font-mono text-gray-900">{stock.nextEarningsDate}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`inline-block h-2.5 w-2.5 rounded-sm ${color}`} />
      <span>{label}</span>
    </span>
  );
}

function DetailPanel({
  entry,
  scholar,
  isLatest,
}: {
  entry: VerdictHistoryEntry & { verdict: Verdict; deciding: string };
  scholar: ScholarProfile;
  isLatest: boolean;
}) {
  const tone = TONE_BY_VERDICT[entry.verdict];
  return (
    <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50/60 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
            {isLatest ? "Latest period" : "Period detail"}
          </span>
          <div
            className="mt-1 text-[16px] font-bold text-gray-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {entry.quarter}{" "}
            <span className="font-normal text-gray-500">({entry.periodEnd})</span>
          </div>
        </div>
        <div className={`text-[14px] font-bold ${tone.text}`} style={{ fontFamily: "var(--font-display)" }}>
          {entry.verdict === "pass" ? "✓ PASS" : entry.verdict === "fail" ? "✗ FAIL" : "◐ BORDERLINE"}{" "}
          <span className="text-[11px] font-normal text-gray-500">under {scholar.short}</span>
        </div>
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-gray-700">{entry.deciding}</p>
    </div>
  );
}
