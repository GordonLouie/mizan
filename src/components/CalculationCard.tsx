/**
 * CalculationCard
 *
 * Progressive-disclosure card for a single halal screening check.
 * Collapsed: verdict + ratio + buffer (5-second read)
 * Expanded: line items + math + sources (60-second read)
 *
 * Design principles (Day 8 redesign):
 *   - Verdict-first hierarchy: the number you care about is the LARGEST element
 *   - Math typography: CSS grid for proper division-line + equals alignment
 *     (fixes the wonky-spacing AI-toss issue flagged by Gordon)
 *   - Plain-English tooltips on financial terms (Tooltip component)
 *   - Calm color palette: navy + cream + gold + verdict tones
 *   - Reference patterns: Stripe billing detail, Wikipedia infobox math
 *
 * Replaces the inline CalculationBox in AnnotatedBalanceSheet.
 */

"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import Tooltip from "./Tooltip";

interface LineItem {
  label: string;
  value: number;
  tooltip?: string;
}

export interface CalculationCardProps {
  /** 1-4 — gets a circled numeral glyph */
  checkNumber: number;
  /** Short ratio name — e.g., "Cash + Securities Ratio" */
  title: string;
  /** Active scholar short name — e.g., "AAOIFI" */
  scholarShort: string;
  /** Line items that sum into the numerator */
  lineItems: LineItem[];
  /** Numerator sum (matches sum of line items) */
  sum: number;
  /** Label for the sum row — e.g., "Total cash + securities" */
  sumLabel: string;
  /** Label of the numerator in the math expression */
  numeratorLabel: string;
  /** Numerator value (usually = sum) */
  numerator: number;
  /** Label of the denominator — e.g., "Market cap" */
  denominatorLabel: string;
  /** Denominator value */
  denominator: number;
  /** Tooltip for the denominator (plain English) */
  denominatorTooltip?: string;
  /** The resulting ratio (0-100) */
  ratio: number;
  /** Threshold value (0-100) */
  thresholdValue: number;
  /** "max" → ratio ≤ threshold passes; "min" → ratio ≥ threshold passes */
  thresholdDirection: "max" | "min";
  /** Final verdict */
  verdict: "pass" | "fail";
  /** Underlying data source — e.g., "SEC 10-Q · Note 4" */
  dataSource: string;
  /** Optional URL to the data source */
  dataSourceUrl?: string;
  /** Methodology source — e.g., "AAOIFI Standard No. 21, §3.5.1" */
  thresholdSource: string;
  /** Optional URL to the methodology source */
  thresholdSourceUrl?: string;
  /** Plain-English explanation of what this ratio measures */
  whatThisMeans?: string;
  /** Hide the full breakdown (when only aggregate data is available) */
  ratioOnly?: boolean;
}

const fmtUSD = (millions: number) =>
  millions.toLocaleString("en-US", { maximumFractionDigits: 0 });

const GLYPHS = ["", "①", "②", "③", "④", "⑤", "⑥"];

export default function CalculationCard(props: CalculationCardProps) {
  const [expanded, setExpanded] = useState(false);

  const {
    checkNumber,
    title,
    scholarShort,
    lineItems,
    sum,
    sumLabel,
    numeratorLabel,
    numerator,
    denominatorLabel,
    denominator,
    denominatorTooltip,
    ratio,
    thresholdValue,
    thresholdDirection,
    verdict,
    dataSource,
    dataSourceUrl,
    thresholdSource,
    thresholdSourceUrl,
    whatThisMeans,
    ratioOnly = false,
  } = props;

  const glyph = GLYPHS[checkNumber] || `#${checkNumber}`;
  const meetsThreshold =
    thresholdDirection === "max" ? ratio <= thresholdValue : ratio >= thresholdValue;
  const diff = Math.abs(ratio - thresholdValue);

  // Breach risk — Miqdad: "a stock that's halal today can flip next quarter."
  // Buffer as % of threshold tells us how close we are to failing. Tiers:
  //   safe    : buffer ≥ 25% of threshold
  //   watch   : buffer 10-25%
  //   near    : buffer < 10% but still passing
  //   breached: already failed
  let breach: "safe" | "watch" | "near" | "breached";
  if (!meetsThreshold) {
    breach = "breached";
  } else {
    const bufferPct = thresholdValue > 0 ? (diff / thresholdValue) * 100 : 100;
    if (bufferPct >= 25) breach = "safe";
    else if (bufferPct >= 10) breach = "watch";
    else breach = "near";
  }

  const verdictTone =
    verdict === "pass"
      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
      : "text-rose-700 bg-rose-50 border-rose-200";
  const ratioTone =
    verdict === "pass"
      ? "text-emerald-700"
      : "text-rose-700";

  return (
    <article className="mx-auto max-w-2xl">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* ─── HEADER (always visible) ─────────────────────────── */}
        <header className="border-b border-gray-100 px-6 py-4">
          <div className="flex items-baseline justify-between gap-3">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[13px] font-semibold text-gold-600">
                CHECK {glyph}
              </span>
              <h3
                className="text-[16px] font-semibold text-gray-900"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {title}
              </h3>
            </div>
            <span className="text-[10px] uppercase tracking-[0.16em] text-gray-500">
              under {scholarShort}
            </span>
          </div>
        </header>

        {/* ─── ALWAYS-VISIBLE: verdict + ratio + buffer ──────────── */}
        <div className="grid grid-cols-1 gap-4 px-6 py-6 sm:grid-cols-[auto_1fr] sm:gap-8">
          {/* Big ratio number */}
          <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 px-6 py-4 sm:min-w-[140px]">
            <div
              className={`text-[40px] font-bold leading-none ${ratioTone}`}
              style={{ fontFamily: "var(--font-display)" }}
            >
              {ratio.toFixed(1)}%
            </div>
            <div
              className={`mt-2 inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${verdictTone}`}
            >
              {verdict === "pass" ? "✓ PASS" : "✗ FAIL"}
            </div>
          </div>

          {/* Right side: threshold + buffer */}
          <div className="flex flex-col justify-center gap-2">
            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-[13px]">
              <span className="font-semibold uppercase tracking-[0.14em] text-gray-500">
                Threshold
              </span>
              <span className="text-gray-800">
                {thresholdDirection === "max" ? "≤" : "≥"} {thresholdValue}%
              </span>

              <span className="font-semibold uppercase tracking-[0.14em] text-gray-500">
                {meetsThreshold ? "Buffer" : "Shortfall"}
              </span>
              <span className="text-gray-700">
                {diff.toFixed(1)} percentage points{" "}
                {meetsThreshold ? "to spare" : "over the limit"}
              </span>
            </div>

            {/* Breach risk bar — Miqdad's "is this stable, or about to flip?" */}
            <BreachRiskBar
              ratio={ratio}
              threshold={thresholdValue}
              direction={thresholdDirection}
              breach={breach}
            />

            {whatThisMeans && (
              <div className="mt-2 flex items-start gap-1.5 text-[12px] italic text-gray-500">
                <span>{whatThisMeans}</span>
              </div>
            )}
          </div>
        </div>

        {/* ─── ALWAYS-VISIBLE CITATION STRIP ────────────────────────
            Per-ratio primary-source links, surfaced on the page itself
            (not buried behind the expand). Direct response to Ibrahim
            Malik's ask: "reference where the numbers are coming from,
            cross-check if needed." */}
        {(thresholdSourceUrl || dataSourceUrl || thresholdSource) && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-gray-100 px-6 py-2.5 text-[11px] text-gray-500">
            <span className="font-semibold uppercase tracking-[0.14em] text-gray-400">
              Source
            </span>
            {thresholdSourceUrl ? (
              <a
                href={thresholdSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-navy-700 hover:text-navy-900 hover:underline"
              >
                {thresholdSource} <ExternalLink size={9} />
              </a>
            ) : (
              <span>{thresholdSource}</span>
            )}
            {dataSourceUrl && (
              <>
                <span className="text-gray-300">·</span>
                <a
                  href={dataSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 text-navy-700 hover:text-navy-900 hover:underline"
                >
                  {dataSource} <ExternalLink size={9} />
                </a>
              </>
            )}
          </div>
        )}

        {/* ─── EXPAND / COLLAPSE TOGGLE ─────────────────────────── */}
        {!ratioOnly && (
          <>
            <button
              type="button"
              onClick={() => setExpanded((x) => !x)}
              className="flex w-full items-center justify-between border-t border-gray-100 px-6 py-3 text-[12px] font-medium text-navy-700 transition hover:bg-gray-50"
              aria-expanded={expanded}
            >
              <span>{expanded ? "Hide the math" : "Show the math"}</span>
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {expanded && (
              <div className="border-t border-gray-100 bg-gray-50/40 px-6 py-6 sm:px-8">
                {/* WHAT WE COUNTED — line items */}
                {lineItems.length > 0 && (
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                      What we counted
                    </div>
                    <dl className="mt-3 space-y-1">
                      {lineItems.map((li, i) => (
                        <div
                          key={i}
                          className="flex items-baseline gap-3 py-0.5"
                        >
                          <dt className="flex flex-1 items-baseline gap-1.5 text-[13px] text-gray-700">
                            {li.label}
                            {li.tooltip && (
                              <Tooltip text={li.tooltip} size={11} />
                            )}
                          </dt>
                          <dd
                            className="font-mono text-[13px] tabular-nums text-gray-900"
                            style={{ minWidth: "7rem", textAlign: "right" }}
                          >
                            ${fmtUSD(li.value)} M
                          </dd>
                        </div>
                      ))}
                      <div className="mt-1 flex items-baseline gap-3 border-t border-gray-300 pt-2">
                        <dt className="flex-1 text-[13px] font-semibold text-gray-800">
                          {sumLabel}
                        </dt>
                        <dd
                          className="font-mono text-[13px] font-semibold tabular-nums text-gray-900"
                          style={{ minWidth: "7rem", textAlign: "right" }}
                        >
                          ${fmtUSD(sum)} M
                        </dd>
                      </div>
                    </dl>
                  </div>
                )}

                {/* DIVIDED BY — denominator */}
                <div className="mt-5">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                    Divided by
                  </div>
                  <div className="mt-2 flex items-baseline gap-3">
                    <div className="flex flex-1 items-baseline gap-1.5 text-[13px] text-gray-700">
                      <span>{denominatorLabel}</span>
                      {denominatorTooltip && (
                        <Tooltip text={denominatorTooltip} size={11} />
                      )}
                    </div>
                    <div
                      className="font-mono text-[13px] tabular-nums text-gray-900"
                      style={{ minWidth: "7rem", textAlign: "right" }}
                    >
                      ${fmtUSD(denominator)} M
                    </div>
                  </div>
                </div>

                {/* CALCULATION — math typography via CSS grid */}
                <div className="mt-6">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                    Calculation
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-4 rounded-md bg-white px-6 py-5">
                    <MathFraction
                      numerator={`$${fmtUSD(numerator)}`}
                      denominator={`$${fmtUSD(denominator)}`}
                    />
                    <div className="text-[20px] font-light text-gray-400">
                      =
                    </div>
                    <div
                      className={`text-[22px] font-bold ${ratioTone}`}
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {ratio.toFixed(1)}%
                    </div>
                  </div>
                  <div className="mt-1 text-center font-mono text-[10px] text-gray-400">
                    {numeratorLabel} ÷ {denominatorLabel}
                  </div>
                </div>

                {/* SOURCES */}
                <div className="mt-6 border-t border-gray-200 pt-4">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                    Sources
                  </div>
                  <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-[11px] text-gray-600">
                    <dt className="font-semibold uppercase tracking-[0.14em]">
                      Data
                    </dt>
                    <dd>
                      {dataSourceUrl ? (
                        <a
                          href={dataSourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-0.5 text-navy-700 hover:text-navy-900"
                        >
                          {dataSource} <ExternalLink size={9} />
                        </a>
                      ) : (
                        <span>{dataSource}</span>
                      )}
                    </dd>
                    <dt className="font-semibold uppercase tracking-[0.14em]">
                      Threshold
                    </dt>
                    <dd>
                      {thresholdSourceUrl ? (
                        <a
                          href={thresholdSourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-0.5 text-navy-700 hover:text-navy-900"
                        >
                          {thresholdSource} <ExternalLink size={9} />
                        </a>
                      ) : (
                        <span>{thresholdSource}</span>
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </article>
  );
}

/**
 * MathFraction
 * Renders a vertical fraction using CSS grid for proper division-line
 * alignment. Replaces the brittle flex+border pattern that produced the
 * "wonky math typography" Gordon flagged.
 */
function MathFraction({
  numerator,
  denominator,
}: {
  numerator: string;
  denominator: string;
}) {
  return (
    <div
      className="grid place-items-center font-mono text-[14px] tabular-nums text-gray-900"
      style={{
        gridTemplateRows: "auto 1px auto",
        gap: "0.35rem 0",
        fontFamily: "Liberation Mono, Menlo, monospace",
      }}
    >
      <div className="px-2">{numerator}</div>
      <div className="h-px w-full bg-gray-700" />
      <div className="px-2">{denominator}</div>
    </div>
  );
}

/**
 * BreachRiskBar — horizontal indicator showing where the current ratio sits
 * relative to the scholar's threshold, with color zones for breach proximity.
 *
 * Miqdad feedback (2026-06-06): "Knowing PASS isn't enough — a stock that
 * barely passes can flip next quarter. I want to see at-a-glance how stable
 * the pass is." Extends the Stability Score idea to per-ratio level.
 *
 * Zones (for max-direction ratios; mirrored for min):
 *   safe zone     [0% .. 0.75 × threshold]
 *   watch zone    [0.75 × .. 0.90 × threshold]
 *   near zone     [0.90 × .. threshold]
 *   breach zone   [threshold .. scale max]
 */
function BreachRiskBar({
  ratio,
  threshold,
  direction,
  breach,
}: {
  ratio: number;
  threshold: number;
  direction: "max" | "min";
  breach: "safe" | "watch" | "near" | "breached";
}) {
  // Scale covers up to 1.5× threshold so breach zone is always visible.
  const scaleMax = Math.max(threshold * 1.5, ratio * 1.1, 5);
  const thresholdPct = Math.min(100, (threshold / scaleMax) * 100);
  const ratioPct = Math.min(100, (ratio / scaleMax) * 100);

  const tone =
    breach === "safe"
      ? { dot: "bg-emerald-600", label: "Comfortable", labelTone: "text-emerald-700 bg-emerald-50" }
      : breach === "watch"
        ? { dot: "bg-emerald-500", label: "Stable", labelTone: "text-emerald-700 bg-emerald-50" }
        : breach === "near"
          ? { dot: "bg-amber-500", label: "Near limit", labelTone: "text-amber-700 bg-amber-50" }
          : { dot: "bg-rose-600", label: "Breached", labelTone: "text-rose-700 bg-rose-50" };

  // For "min" direction (illiquid ratio), we mirror the visualization mentally:
  // ratios ABOVE threshold pass, below it fail. The scale still works because
  // the user just reads "marker right of line = pass" or vice versa.
  const passSideText =
    direction === "max"
      ? "← Pass zone | Fail zone →"
      : "← Fail zone | Pass zone →";

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500">
          Breach risk
        </div>
        <span
          className={
            "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] " +
            tone.labelTone
          }
        >
          {tone.label}
        </span>
      </div>

      <div className="relative mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
        {direction === "max" ? (
          <>
            {/* safe zone */}
            <div
              className="absolute top-0 h-full bg-emerald-200/60"
              style={{ left: "0%", width: `${thresholdPct * 0.75}%` }}
            />
            {/* watch zone */}
            <div
              className="absolute top-0 h-full bg-emerald-300/70"
              style={{ left: `${thresholdPct * 0.75}%`, width: `${thresholdPct * 0.15}%` }}
            />
            {/* near zone */}
            <div
              className="absolute top-0 h-full bg-amber-300/70"
              style={{ left: `${thresholdPct * 0.9}%`, width: `${thresholdPct * 0.1}%` }}
            />
            {/* breach zone */}
            <div
              className="absolute top-0 h-full bg-rose-300/70"
              style={{ left: `${thresholdPct}%`, right: "0%" }}
            />
          </>
        ) : (
          <>
            {/* breach (fail) zone on left */}
            <div
              className="absolute top-0 h-full bg-rose-300/70"
              style={{ left: "0%", width: `${thresholdPct}%` }}
            />
            {/* near zone */}
            <div
              className="absolute top-0 h-full bg-amber-300/70"
              style={{ left: `${thresholdPct}%`, width: `${thresholdPct * 0.1}%` }}
            />
            {/* safe zone */}
            <div
              className="absolute top-0 h-full bg-emerald-300/70"
              style={{ left: `${thresholdPct * 1.1}%`, right: "0%" }}
            />
          </>
        )}

        {/* threshold line */}
        <div
          className="absolute top-[-2px] h-3 w-px bg-gray-700"
          style={{ left: `${thresholdPct}%` }}
          title={`Threshold ${threshold}%`}
        />

        {/* current ratio marker */}
        <div
          className={"absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow " + tone.dot}
          style={{ left: `${ratioPct}%` }}
          title={`Current ${ratio.toFixed(1)}%`}
        />
      </div>

      <div className="mt-1 flex justify-between text-[10px] text-gray-400">
        <span>0%</span>
        <span className="text-gray-500">{passSideText}</span>
        <span>{scaleMax.toFixed(0)}%</span>
      </div>
    </div>
  );
}
