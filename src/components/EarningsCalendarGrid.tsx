/**
 * EarningsCalendarGrid
 *
 * Visual month-grid calendar showing the next 3 months with earnings
 * events marked. Each day with an earnings event gets a colored dot
 * (green=pass, amber=borderline, rose=fail) reflecting the current
 * verdict under the active scholar.
 *
 * Lives below the list view on /calendar — a "glanceable" complement to
 * the chronological list above.
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { findStock } from "@/lib/data";
import { getScholar, SCHOLAR_PROFILES } from "@/lib/scholars";
import { loadCustomProfile } from "@/lib/customProfile";
import { screenStock } from "@/lib/screen";
import type { ScholarProfile, Verdict } from "@/lib/types";

interface Props {
  tickers: string[];
}

interface EarningsEvent {
  date: string; // ISO yyyy-mm-dd
  ticker: string;
  name: string;
  verdict: Verdict;
}

const VERDICT_DOT: Record<Verdict, string> = {
  pass: "bg-emerald-500",
  borderline: "bg-amber-400",
  fail: "bg-rose-500",
};

const VERDICT_TEXT: Record<Verdict, string> = {
  pass: "text-emerald-700",
  borderline: "text-amber-700",
  fail: "text-rose-700",
};

const DAY_HEADERS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}
function isoDate(year: number, month: number, day: number): string {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

export default function EarningsCalendarGrid({ tickers }: Props) {
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

  // Build events from tickers
  const events: EarningsEvent[] = useMemo(() => {
    return tickers
      .map((t): EarningsEvent | null => {
        const stock = findStock(t);
        if (!stock || !stock.nextEarningsDate) return null;
        const result = screenStock(stock, scholar);
        return {
          date: stock.nextEarningsDate,
          ticker: stock.ticker,
          name: stock.name,
          verdict: result.verdict,
        };
      })
      .filter((e): e is EarningsEvent => e !== null);
  }, [tickers, scholar]);

  // Group events by date for fast lookup
  const eventsByDate = useMemo(() => {
    const m = new Map<string, EarningsEvent[]>();
    for (const e of events) {
      const arr = m.get(e.date) ?? [];
      arr.push(e);
      m.set(e.date, arr);
    }
    return m;
  }, [events]);

  // Compute the next 3 months to render
  const months = useMemo(() => {
    const today = new Date();
    return [0, 1, 2].map((offset) => {
      const d = new Date(today.getFullYear(), today.getMonth() + offset, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }, []);

  if (events.length === 0) {
    return null; // The list above already shows the "no data" message
  }

  return (
    <section className="mt-10">
      <header className="mb-5">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Calendar view · next 3 months
        </div>
        <h2
          className="mt-2 text-[22px] font-bold leading-tight text-gray-900 sm:text-[24px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          At a glance
        </h2>
        <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-gray-600">
          Dates with upcoming earnings are marked with a colored dot — green
          if currently halal, amber if borderline, rose if failing. Hover any
          marked day to see which holding reports.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {months.map(({ year, month }) => (
          <MonthGrid
            key={`${year}-${month}`}
            year={year}
            month={month}
            eventsByDate={eventsByDate}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-gray-100 pt-4 text-[11px] text-gray-600">
        <LegendDot color="bg-emerald-500" label="Currently halal" />
        <LegendDot color="bg-amber-400" label="Borderline" />
        <LegendDot color="bg-rose-500" label="Currently failing" />
      </div>
    </section>
  );
}

function MonthGrid({
  year,
  month,
  eventsByDate,
}: {
  year: number;
  month: number; // 0-11
  eventsByDate: Map<string, EarningsEvent[]>;
}) {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = firstDay.getDay(); // 0 = Sun

  // Build the cells: leading empty cells, then 1..daysInMonth
  const cells: Array<{ day: number | null; date: string | null }> = [];
  for (let i = 0; i < startWeekday; i++) {
    cells.push({ day: null, date: null });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, date: isoDate(year, month, d) });
  }
  // Pad to a multiple of 7 for visual symmetry
  while (cells.length % 7 !== 0) {
    cells.push({ day: null, date: null });
  }

  const todayIso = new Date().toISOString().slice(0, 10);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <header className="mb-3 flex items-baseline justify-between">
        <h3
          className="text-[14px] font-bold text-gray-900"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {MONTH_NAMES[month]} {year}
        </h3>
      </header>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-400">
        {DAY_HEADERS.map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="mt-2 grid grid-cols-7 gap-1 text-center">
        {cells.map((cell, i) => {
          if (cell.day === null || cell.date === null) {
            return <div key={i} className="aspect-square" />;
          }
          const events = eventsByDate.get(cell.date) ?? [];
          const isToday = cell.date === todayIso;
          const hasEvents = events.length > 0;
          const primaryVerdict = events[0]?.verdict;

          return (
            <DayCell
              key={i}
              day={cell.day}
              isToday={isToday}
              hasEvents={hasEvents}
              verdict={primaryVerdict}
              events={events}
            />
          );
        })}
      </div>
    </div>
  );
}

function DayCell({
  day,
  isToday,
  hasEvents,
  verdict,
  events,
}: {
  day: number;
  isToday: boolean;
  hasEvents: boolean;
  verdict: Verdict | undefined;
  events: EarningsEvent[];
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  const dotClass =
    hasEvents && verdict ? VERDICT_DOT[verdict] : "";

  if (hasEvents) {
    return (
      <div className="relative">
        <Link
          href={`/screen?ticker=${events[0].ticker}`}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onFocus={() => setShowTooltip(true)}
          onBlur={() => setShowTooltip(false)}
          className={
            "flex aspect-square flex-col items-center justify-center rounded-md text-[12px] transition hover:bg-gray-100 " +
            (isToday ? "ring-2 ring-navy-800" : "")
          }
        >
          <span
            className={
              "font-mono " +
              (isToday ? "font-bold text-navy-800" : "text-gray-900")
            }
          >
            {day}
          </span>
          <span
            className={`mt-0.5 inline-block h-1.5 w-1.5 rounded-full ${dotClass}`}
            aria-hidden
          />
        </Link>
        {showTooltip && (
          <div
            role="tooltip"
            className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-1 w-44 -translate-x-1/2 rounded-md bg-gray-900 px-2 py-1.5 text-left text-[11px] leading-snug text-white shadow-lg"
          >
            {events.map((e, i) => (
              <div key={i} className="flex items-baseline justify-between gap-2">
                <span className="font-mono font-semibold">{e.ticker}</span>
                <span className={"text-[10px] " + VERDICT_TEXT[e.verdict].replace("text-", "text-")}>
                  {e.verdict}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={
        "flex aspect-square items-center justify-center rounded-md text-[12px] " +
        (isToday
          ? "font-bold text-navy-800 ring-2 ring-navy-800"
          : "text-gray-400")
      }
    >
      <span className="font-mono">{day}</span>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`inline-block h-2.5 w-2.5 rounded-full ${color}`} />
      <span>{label}</span>
    </span>
  );
}
