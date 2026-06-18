/**
 * EarningsCalendar
 *
 * Horizontal-scroll earnings calendar — HalalGauge's adaptation of the 21st.dev
 * "economic calendar" pattern. Borrowed the structure (cards in a scrollable
 * row, impact bars, scroll buttons), dropped the SaaS chrome:
 *
 *   - No framer-motion. Pure CSS transitions; lighter bundle.
 *   - No rounded-2xl shadow cards. Hairline borders, FT-print rhythm.
 *   - No red bg time pill. Monospace date + days-away in our type system.
 *   - Real flag images replaced with our CompanyLogo (Clearbit).
 *   - Impact bars repurposed as a "stability flag" — derived from each stock's
 *     current verdict + buffer to the active scholar's threshold.
 *
 * Data source: every stock in src/data/stocks.json with a `nextEarningsDate`.
 * Sorted ascending by date so the next reporter is leftmost.
 */

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CompanyLogo from "@/components/CompanyLogo";
import { listStocks } from "@/lib/data";
import { getScholar } from "@/lib/scholars";
import { screenStock } from "@/lib/screen";
import type { ScholarProfile, StockFundamentals, Verdict } from "@/lib/types";

interface EarningsCalendarProps {
  /** Optional list of tickers to filter to (e.g. watchlist or portfolio). */
  tickers?: string[];
  /** Override scholar; defaults to AAOIFI for the homepage. */
  scholarId?: string;
  /** Max cards rendered. Default 24 (4-5 weeks of common reporters). */
  limit?: number;
  /**
   * Hard cap on how many days out a card can be (radar mode). When set,
   * anything reporting beyond this is excluded, even if it would fit
   * under `limit`. Used by /calendar to scope this rail to "next ~2 weeks"
   * while the chronological widget and month grid handle longer horizons.
   */
  maxDaysAway?: number;
  /** Anchor className for the outer wrapper. */
  className?: string;
}

interface CardData {
  stock: StockFundamentals;
  dateLabel: string;
  daysAway: number;
  verdict: Verdict;
  stabilityLabel: "stable" | "watch" | "fragile";
}

const VERDICT_DOT: Record<Verdict, string> = {
  pass: "bg-emerald-500",
  borderline: "bg-amber-500",
  fail: "bg-rose-500",
};

const VERDICT_TEXT: Record<Verdict, string> = {
  pass: "text-emerald-700",
  borderline: "text-amber-700",
  fail: "text-rose-700",
};

const VERDICT_LABEL: Record<Verdict, string> = {
  pass: "PASS",
  borderline: "DOUBTFUL",
  fail: "FAIL",
};

function formatDateLabel(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function daysFromToday(iso: string, now = new Date()): number {
  const d = new Date(iso + "T00:00:00Z");
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((d.getTime() - today) / (1000 * 60 * 60 * 24));
}

/**
 * Stability flag — adapted from the 21st "impact" bars. We compute how close
 * the stock is to its scholar's most binding threshold. Closer = more fragile.
 */
function getStabilityLabel(
  stock: StockFundamentals,
  scholar: ScholarProfile,
): "stable" | "watch" | "fragile" {
  const result = screenStock(stock, scholar);
  if (result.verdict === "fail") return "fragile";
  let minBufferPct = 100;
  for (const c of result.ratioChecks) {
    if (c.threshold === null) continue;
    const diff = Math.abs(c.value - c.threshold);
    const bufferPct = c.threshold > 0 ? (diff / c.threshold) * 100 : 100;
    if (c.passes && bufferPct < minBufferPct) minBufferPct = bufferPct;
  }
  if (minBufferPct < 10) return "fragile";
  if (minBufferPct < 25) return "watch";
  return "stable";
}

/** Tiny three-bar stability indicator — adapted from the 21st volatility icon. */
function StabilityBars({ label }: { label: "stable" | "watch" | "fragile" }) {
  const filled = label === "fragile" ? 3 : label === "watch" ? 2 : 1;
  const tone =
    label === "fragile"
      ? "bg-rose-500"
      : label === "watch"
      ? "bg-amber-500"
      : "bg-emerald-500";
  return (
    <div className="flex h-3 items-end gap-[2px]" title={`Stability: ${label}`}>
      {[2, 3, 4].map((h, i) => (
        <span
          key={i}
          className={
            "w-[3px] rounded-sm " +
            (i < filled ? tone : "bg-gray-200")
          }
          style={{ height: `${h * 3}px` }}
        />
      ))}
    </div>
  );
}

export default function EarningsCalendar({
  tickers,
  scholarId = "aaoifi",
  limit = 24,
  maxDaysAway,
  className,
}: EarningsCalendarProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scholar = useMemo(() => getScholar(scholarId), [scholarId]);

  const cards: CardData[] = useMemo(() => {
    const universe = listStocks();
    const filtered = tickers
      ? universe.filter((s) => tickers.includes(s.ticker))
      : universe;
    return filtered
      .filter((s) => s.nextEarningsDate)
      .map((stock) => {
        const result = screenStock(stock, scholar);
        return {
          stock,
          dateLabel: formatDateLabel(stock.nextEarningsDate!),
          daysAway: daysFromToday(stock.nextEarningsDate!),
          verdict: result.verdict,
          stabilityLabel: getStabilityLabel(stock, scholar),
        };
      })
      .filter((c) => c.daysAway >= -1) // hide stale dates (allow 1 day grace)
      .filter((c) => (maxDaysAway === undefined ? true : c.daysAway <= maxDaysAway))
      .sort((a, b) => a.daysAway - b.daysAway)
      .slice(0, limit);
  }, [tickers, scholar, limit, maxDaysAway]);

  function updateScrollState() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }

  function scroll(direction: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState();
    return () => el.removeEventListener("scroll", updateScrollState);
  }, [cards.length]);

  if (cards.length === 0) {
    return (
      <div
        className={
          "rounded-lg border border-gray-200 bg-white px-5 py-6 text-center text-[13px] text-gray-500 " +
          (className ?? "")
        }
      >
        {maxDaysAway !== undefined
          ? `Nothing reporting in the next ${maxDaysAway} days.`
          : "No upcoming earnings in this set."}
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header row — small editorial eyebrow + scroll controls */}
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-600">
            Earnings calendar
          </div>
          <h3
            className="mt-2 text-[22px] font-bold leading-tight text-gray-900 sm:text-[26px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Who reports next
          </h3>
          <p className="mt-1 max-w-xl text-[12px] leading-relaxed text-gray-600">
            Earnings can flip a halal verdict. We surface upcoming reports so you can
            watch which holdings might shift next quarter.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className={
              "rounded-md border p-1.5 transition " +
              (canScrollLeft
                ? "border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:text-gray-900"
                : "cursor-not-allowed border-gray-100 bg-white text-gray-300")
            }
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className={
              "rounded-md border p-1.5 transition " +
              (canScrollRight
                ? "border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:text-gray-900"
                : "cursor-not-allowed border-gray-100 bg-white text-gray-300")
            }
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Scroll row */}
      <div
        ref={scrollRef}
        className="mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((c) => (
          <Link
            key={c.stock.ticker}
            href={`/screen?ticker=${c.stock.ticker}`}
            className="group block w-[260px] shrink-0 snap-start rounded-lg border border-gray-200 bg-white p-4 transition hover:border-navy-300 hover:shadow-sm"
          >
            {/* Top row: date + stability bars */}
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-gray-500">
                  {c.dateLabel}
                </span>
                <span
                  className={
                    "rounded-sm px-1.5 py-0.5 font-mono text-[10px] font-semibold tabular-nums " +
                    (c.daysAway <= 1
                      ? "bg-rose-50 text-rose-700"
                      : c.daysAway <= 7
                      ? "bg-amber-50 text-amber-700"
                      : "bg-gray-50 text-gray-600")
                  }
                >
                  {c.daysAway <= 0
                    ? "TODAY"
                    : c.daysAway === 1
                    ? "+1d"
                    : `+${c.daysAway}d`}
                </span>
              </div>
              <StabilityBars label={c.stabilityLabel} />
            </div>

            {/* Middle: logo + name */}
            <div className="mt-3 flex items-center gap-3">
              <CompanyLogo ticker={c.stock.ticker} size={36} />
              <div className="min-w-0">
                <div className="font-mono text-sm font-semibold text-gray-900">
                  {c.stock.ticker}
                </div>
                <div className="truncate text-[12px] text-gray-500">
                  {c.stock.name}
                </div>
              </div>
            </div>

            {/* Bottom: current verdict ribbon (Bloomberg ticker tape) */}
            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 font-mono text-[10px] uppercase tracking-[0.14em] tabular-nums">
              <span className="flex items-center gap-1.5 text-gray-500">
                <span className={"inline-block h-1.5 w-1.5 rounded-full " + VERDICT_DOT[c.verdict]} />
                Under {scholar.short}
              </span>
              <span className={"font-bold " + VERDICT_TEXT[c.verdict]}>
                {VERDICT_LABEL[c.verdict]}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
