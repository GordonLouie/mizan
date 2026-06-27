/**
 * EarningsWidget
 *
 * Shows upcoming earnings dates for a list of tickers, sorted by date.
 * Flags "at-risk" holdings (currently passing but close to a threshold).
 *
 * Used on /watchlist + /portfolio + (in expanded form) /calendar.
 *
 * Direct response to Saifuddin's feedback:
 *   "interesting to track that over time as well bc balance sheet may
 *    look v diff YoY"
 *
 * Graceful degradation: tickers without nextEarningsDate are omitted.
 * If NONE of the tickers have earnings data, the widget shows a
 * "data being ingested" notice with a helpful next-step.
 */

"use client";

import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { findStock } from "@/lib/data";
import CompanyLogo from "@/components/CompanyLogo";
import { getScholar, SCHOLAR_PROFILES } from "@/lib/scholars";
import { loadCustomProfile } from "@/lib/customProfile";
import { screenStock } from "@/lib/screen";
import type { Verdict, ScholarProfile, StockFundamentals } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";

interface Props {
  /** Tickers to look up (from watchlist or portfolio) */
  tickers: string[];
  /** Title shown at top of widget */
  title?: string;
  /** Max number of earnings to show (default 8) */
  limit?: number;
  /**
   * Row ordering.
   *   - "date" (default): chronological, most-imminent first.
   *   - "at-risk-first": at-risk rows top of list, sorted by ratio buffer
   *     ascending (most fragile first), then everything else by date.
   *     Used on /calendar so the page leads with the stocks most likely to
   *     flip — HalalGauge's actual differentiator.
   */
  sortMode?: "date" | "at-risk-first";
  /** Subtitle next to the title; defaults to "next 90 days". */
  subtitle?: string;
}

interface EarningsRow {
  stock: StockFundamentals;
  date: string;
  daysAway: number;
  verdict: Verdict;
  /** "at risk" when verdict is pass/borderline AND buffer to threshold is small */
  atRisk: boolean;
  /** Plain-English why it's at risk */
  riskReason?: string;
  /** Smallest buffer to any threshold (used for at-risk-first sort) */
  smallestBuffer: number;
}

const TONE_BY_VERDICT: Record<Verdict, { dot: string; label: string; text: string }> = {
  pass: { dot: "bg-emerald-500", label: "✓", text: "text-emerald-700" },
  borderline: { dot: "bg-amber-400", label: "◐", text: "text-amber-700" },
  fail: { dot: "bg-rose-500", label: "✗", text: "text-rose-700" },
};

function daysBetween(target: string): number {
  const t = new Date(target).getTime();
  const now = Date.now();
  return Math.floor((t - now) / 86400000);
}

export default function EarningsWidget({
  tickers,
  title = "Upcoming earnings",
  limit = 8,
  sortMode = "date",
  subtitle = "next 90 days",
}: Props) {
  const [scholarId, setScholarId] = useState("aaoifi");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("mizan.scholarId");
      if (saved && SCHOLAR_PROFILES.some((p) => p.id === saved)) {
        setScholarId(saved);
      }
    } catch {}
  }, []);

  const scholar: ScholarProfile = useMemo(
    () => (scholarId === "custom" ? loadCustomProfile() : getScholar(scholarId)),
    [scholarId],
  );

  const rows: EarningsRow[] = useMemo(() => {
    const built = tickers
      .map((t): EarningsRow | null => {
        const stock = findStock(t);
        if (!stock || !stock.nextEarningsDate) return null;
        const result = screenStock(stock, scholar);
        const daysAway = daysBetween(stock.nextEarningsDate);

        // "At risk" = passing but a max-direction ratio sits within 15% of its cap
        // (value >= 85% of threshold). Same logic as the Compliance Drift Watch, so
        // the two features never contradict each other. (The old absolute 5pp buffer
        // wrongly flagged e.g. 0.5% income as "close to the 5% limit".)
        const nearRatio = result.ratioChecks
          .filter((c) => c.direction === "max" && c.passes && c.threshold != null && c.threshold > 0 && c.value >= 0.85 * c.threshold)
          .sort((a, b) => b.value / (b.threshold ?? 1) - a.value / (a.threshold ?? 1))[0];

        const atRisk = (result.verdict === "pass" || result.verdict === "borderline") && !!nearRatio;

        const riskReason =
          atRisk && nearRatio
            ? `${nearRatio.label} at ${nearRatio.value.toFixed(1)}% — close to the ${nearRatio.threshold}% cap`
            : undefined;

        return {
          stock,
          date: stock.nextEarningsDate,
          daysAway,
          verdict: result.verdict,
          atRisk,
          riskReason,
          smallestBuffer: nearRatio ? (nearRatio.threshold ?? 0) - nearRatio.value : Infinity,
        };
      })
      .filter((r): r is EarningsRow => r !== null)
      .filter((r) => r.daysAway >= -3 && r.daysAway <= 90); // next 90 days

    const sorted =
      sortMode === "at-risk-first"
        ? built.sort((a, b) => {
            // At-risk rows first (sorted by smallest buffer = most fragile)
            if (a.atRisk && !b.atRisk) return -1;
            if (b.atRisk && !a.atRisk) return 1;
            if (a.atRisk && b.atRisk) return a.smallestBuffer - b.smallestBuffer;
            // Both safe → fall back to chronological
            return a.daysAway - b.daysAway;
          })
        : built.sort((a, b) => a.daysAway - b.daysAway);

    return sorted.slice(0, limit);
  }, [tickers, scholar, limit, sortMode]);

  if (tickers.length === 0) {
    return null;
  }

  return (
    <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
      <header className="flex flex-wrap items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <Calendar size={14} className="text-gold-600" />
          <h3
            className="text-[16px] font-bold text-gray-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </h3>
          <span className="text-[11px] text-gray-500">{subtitle}</span>
        </div>
        <Link
          href="/calendar"
          className="text-[12px] font-medium text-navy-700 hover:text-navy-900"
        >
          Full earnings calendar →
        </Link>
      </header>

      {rows.length === 0 ? (
        <div className="mt-5 rounded-md border border-amber-200 bg-amber-50/60 p-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-800">
            Earnings data being ingested
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-gray-700">
            None of your tickers have earnings dates loaded yet. We&apos;re
            ingesting these progressively. AAPL has full coverage today as the
            reference example.
          </p>
        </div>
      ) : (
        <ul className="mt-5 divide-y divide-gray-100">
          {rows.map((row) => (
            <li key={row.stock.ticker} className="py-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <CompanyLogo ticker={row.stock.ticker} size={26} />
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${
                      TONE_BY_VERDICT[row.verdict].dot
                    }`}
                    aria-hidden
                  />
                  <Link
                    href={`/screen?ticker=${row.stock.ticker}`}
                    className="font-mono text-[14px] font-semibold text-navy-800 hover:underline"
                  >
                    {row.stock.ticker}
                  </Link>
                  <span className="text-[13px] text-gray-700">{row.stock.name}</span>
                </div>
                <div className="flex items-baseline gap-3 text-[12px] text-gray-600">
                  <span className="font-mono">{row.date}</span>
                  <span className="font-semibold text-gray-800">
                    {row.daysAway >= 0 ? `in ${row.daysAway}d` : `${Math.abs(row.daysAway)}d ago`}
                  </span>
                  <span className={`text-[11px] font-semibold uppercase tracking-wide ${TONE_BY_VERDICT[row.verdict].text}`}>
                    {row.verdict}
                  </span>
                </div>
              </div>
              {row.atRisk && row.riskReason && (
                <div className="mt-1.5 flex items-start gap-1.5 pl-5 text-[12px] text-amber-700">
                  <span className="font-semibold">⚠ At risk:</span>
                  <span>{row.riskReason}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 border-t border-gray-100 pt-3 text-[11px] italic text-gray-500">
        At-risk flag triggers when a passing ratio sits within ~15% of its
        limit (the same proximity the drift watch uses) and earnings are
        coming soon.
      </div>
    </section>
  );
}
