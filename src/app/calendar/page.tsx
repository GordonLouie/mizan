/**
 * /calendar
 *
 * Dedicated page showing upcoming earnings across the user's watchlist
 * and portfolio in one view. Tab between "All", "Watchlist only",
 * "Portfolio only".
 *
 * Direct response to Saifuddin's & Ibrahim's "track over time" feedback —
 * users need a single place to see what's coming up so they can plan when
 * to re-check halal status.
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Calendar as CalendarIcon, Bookmark, BarChart3 } from "lucide-react";
import { getWatchlist } from "@/lib/watchlist";
import { loadPortfolio } from "@/lib/portfolio";
import EarningsWidget from "@/components/EarningsWidget";
import EarningsCalendarGrid from "@/components/EarningsCalendarGrid";
import EarningsCalendar from "@/components/EarningsCalendar";

type FilterMode = "all" | "watchlist" | "portfolio";

export default function CalendarPage() {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [portfolio, setPortfolio] = useState<string[]>([]);
  const [filter, setFilter] = useState<FilterMode>("all");

  useEffect(() => {
    setWatchlist(getWatchlist());
    setPortfolio(loadPortfolio().positions.map((p) => p.ticker));

    const onWatchlistChange = () => setWatchlist(getWatchlist());
    window.addEventListener("mizan.watchlist.changed", onWatchlistChange);
    return () => window.removeEventListener("mizan.watchlist.changed", onWatchlistChange);
  }, []);

  const tickersToShow = useMemo(() => {
    if (filter === "watchlist") return watchlist;
    if (filter === "portfolio") return portfolio;
    // "all" = union, deduplicated
    return Array.from(new Set([...watchlist, ...portfolio]));
  }, [filter, watchlist, portfolio]);

  const isEmpty = watchlist.length === 0 && portfolio.length === 0;

  return (
    <div className="pb-20">
      {/* PAGE HEADER */}
      <header className="pt-6">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Earnings calendar
        </div>
        <h1
          className="mt-3 text-[36px] font-bold leading-[1.1] text-gray-900 sm:text-[44px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          When your stocks report next
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-gray-600">
          A company&apos;s halal status can shift each quarter when it files
          new financials. Use this calendar to know when to re-check the stocks
          you care about. At-risk holdings — those with a passing ratio close
          to its threshold — are flagged.
        </p>
      </header>

      {/* EMPTY STATE */}
      {isEmpty ? (
        <div className="mt-12 flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <CalendarIcon size={20} className="text-gray-400" />
          </div>
          <h3
            className="text-[20px] font-bold text-gray-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Nothing in your watchlist or portfolio yet
          </h3>
          <p className="mt-2 max-w-md text-[14px] text-gray-600">
            Add stocks you want to track or own — HalalGauge will show their
            upcoming earnings dates here so you know when to re-verify the
            halal verdict.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/screen"
              className="inline-flex items-center gap-1.5 rounded-md bg-navy-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-700"
            >
              Find a stock to track
            </Link>
            <Link
              href="/watchlist"
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:text-gray-900"
            >
              <Bookmark size={14} /> View watchlist
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:text-gray-900"
            >
              <BarChart3 size={14} /> View portfolio
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* FILTER TABS */}
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <FilterTab
              active={filter === "all"}
              onClick={() => setFilter("all")}
              count={Array.from(new Set([...watchlist, ...portfolio])).length}
            >
              All
            </FilterTab>
            <FilterTab
              active={filter === "watchlist"}
              onClick={() => setFilter("watchlist")}
              count={watchlist.length}
            >
              Watchlist
            </FilterTab>
            <FilterTab
              active={filter === "portfolio"}
              onClick={() => setFilter("portfolio")}
              count={portfolio.length}
            >
              Portfolio
            </FilterTab>
          </div>

          {/* 14-DAY RADAR — "Who reports next" is now purely about urgency:
              the next ~2 weeks of reporters, scoped to the active filter.
              Anything beyond 14 days is the calendar grid's job. */}
          <section
            className="relative mt-10 overflow-hidden rounded-2xl border border-gray-200 px-4 py-7 sm:px-7 sm:py-9"
            style={{
              background:
                "linear-gradient(180deg, rgba(250,247,240,1) 0%, rgba(250,247,240,0.55) 70%, rgba(255,255,255,1) 100%)",
            }}
          >
            <EarningsCalendar
              tickers={tickersToShow}
              limit={24}
              maxDaysAway={14}
            />
          </section>

          {/* AT-RISK FIRST FEED — same data, different question. Sorted so
              the holdings whose ratios are closest to flipping land at the
              top. This is HalalGauge's real differentiator — not "what reports
              next" but "what's about to break." */}
          <div className="mt-10">
            <EarningsWidget
              tickers={tickersToShow}
              title="At risk first"
              subtitle="ratios closest to threshold, top of list"
              sortMode="at-risk-first"
              limit={50}
            />
          </div>

          {/* VISUAL CALENDAR GRID — at-a-glance month view */}
          <EarningsCalendarGrid tickers={tickersToShow} />

          {/* HONESTY NOTICE */}
          <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-5 text-[13px] leading-relaxed text-gray-700">
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
              About this calendar
            </div>
            <p className="mt-2">
              HalalGauge is ingesting earnings dates progressively from primary
              filings. Some tickers won&apos;t appear here yet — those have data
              coming. AAPL has full coverage today as the reference example.
            </p>
            <p className="mt-2">
              Earnings dates can shift as companies confirm or move their report
              dates. We mark estimated vs. confirmed where possible.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function FilterTab({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition " +
        (active
          ? "border-navy-800 bg-navy-800 text-white"
          : "border-gray-200 bg-white text-gray-700 hover:border-gray-400")
      }
    >
      <span>{children}</span>
      <span
        className={
          "rounded-full px-1.5 py-0.5 text-[10px] font-semibold " +
          (active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600")
        }
      >
        {count}
      </span>
    </button>
  );
}
