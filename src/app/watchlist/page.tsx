"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Bookmark, Trash2, ArrowRight } from "lucide-react";
import { getWatchlist, removeFromWatchlist } from "@/lib/watchlist";
import { findStock } from "@/lib/data";
import { getScholar, SCHOLAR_PROFILES } from "@/lib/scholars";
import { loadCustomProfile } from "@/lib/customProfile";
import { screenStock } from "@/lib/screen";
import ScholarPicker from "@/components/ScholarPicker";
import EarningsWidget from "@/components/EarningsWidget";
import CompanyLogo from "@/components/CompanyLogo";
import { VERDICT_LABEL } from "@/lib/verdictLabels";
import type { StockFundamentals, Verdict, ScreeningResult } from "@/lib/types";

export default function WatchlistPage() {
  const [tickers, setTickers] = useState<string[]>([]);
  const [scholarId, setScholarId] = useState("aaoifi");
  const [bump, setBump] = useState(0);

  useEffect(() => {
    setTickers(getWatchlist());
    const onChange = () => setTickers(getWatchlist());
    window.addEventListener("mizan.watchlist.changed", onChange);

    try {
      const saved = localStorage.getItem("mizan.scholarId");
      if (saved && SCHOLAR_PROFILES.some((p) => p.id === saved)) setScholarId(saved);
    } catch {}

    return () => window.removeEventListener("mizan.watchlist.changed", onChange);
  }, []);

  useEffect(() => {
    const onFocus = () => setBump((b) => b + 1);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const scholar = useMemo(
    () => (scholarId === "custom" ? loadCustomProfile() : getScholar(scholarId)),
    [scholarId, bump],
  );

  const items = useMemo(() => {
    return tickers
      .map((t) => {
        const stock = findStock(t);
        if (!stock) return null;
        return { stock, result: screenStock(stock, scholar) };
      })
      .filter((x): x is { stock: StockFundamentals; result: ScreeningResult } => x !== null);
  }, [tickers, scholar]);

  return (
    <div className="pb-20">
      {/* PAGE HEADER */}
      <header className="pt-6">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Watchlist
        </div>
        <h1
          className="mt-3 text-[36px] font-bold leading-[1.1] text-gray-900 sm:text-[44px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Stocks you&apos;re tracking
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-gray-600">
          Save stocks you want to revisit. Verdicts update automatically when you change
          scholars. Stored locally in your browser.
        </p>
      </header>

      {/* SCHOLAR PICKER */}
      <div className="mt-8 sm:max-w-md">
        <ScholarPicker value={scholarId} onChange={setScholarId} />
      </div>

      {/* UPCOMING EARNINGS WIDGET — at-risk flagging for items in watchlist */}
      {tickers.length > 0 && (
        <EarningsWidget tickers={tickers} title="Upcoming earnings · your watchlist" />
      )}

      {/* EMPTY STATE OR TABLE */}
      {items.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center border-y border-gray-200 py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <Bookmark size={20} className="text-gray-400" />
          </div>
          <h3
            className="text-[20px] font-bold text-gray-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            No stocks saved yet
          </h3>
          <p className="mx-auto mt-2 max-w-md text-[14px] text-gray-600">
            Search any stock from the screener and click the &ldquo;Save&rdquo; button to
            add it here.
          </p>
          <Link
            href="/screen"
            className="mt-6 inline-flex items-center gap-1.5 rounded-md bg-navy-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-700"
          >
            Open screener <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="pb-3 pr-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                  Stock
                </th>
                <th className="hidden pb-3 pr-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500 sm:table-cell">
                  Sector
                </th>
                <th className="pb-3 pr-4 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                  Verdict
                </th>
                <th className="pb-3 pr-2"></th>
              </tr>
            </thead>
            <tbody>
              {items.map(({ stock, result }, idx) => (
                <tr
                  key={stock.ticker}
                  className={idx !== items.length - 1 ? "border-b border-gray-100" : ""}
                >
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2.5">
                      <CompanyLogo ticker={stock.ticker} size={28} />
                      <div>
                        <div className="font-mono text-sm font-semibold text-gray-900">
                          {stock.ticker}
                        </div>
                        <div className="mt-0.5 text-[11px] text-gray-500">{stock.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden py-3 pr-4 text-[12px] text-gray-600 sm:table-cell">
                    {stock.sector}
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <VerdictPill verdict={result.verdict} />
                  </td>
                  <td className="py-3 pr-2 text-right">
                    <div className="inline-flex items-center justify-end gap-2">
                      <Link
                        href={`/screen?ticker=${stock.ticker}`}
                        className="inline-flex items-center gap-1 text-[12px] font-medium text-navy-700 hover:text-navy-900"
                      >
                        Open <ArrowRight size={11} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeFromWatchlist(stock.ticker)}
                        className="rounded p-1 text-gray-400 transition hover:bg-rose-50 hover:text-rose-700"
                        aria-label={`Remove ${stock.ticker}`}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function VerdictPill({ verdict }: { verdict: Verdict }) {
  const tone =
    verdict === "pass" ? "bg-emerald-50 text-emerald-700"
      : verdict === "fail" ? "bg-rose-50 text-rose-700"
        : "bg-amber-50 text-amber-700";
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${tone}`}
    >
      {VERDICT_LABEL[verdict]}
    </span>
  );
}
