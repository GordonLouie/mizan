/**
 * ScrollDashboardHero — the scroll-tilting product showcase.
 *
 * Embeds a Mizan-specific mock (multi-scholar verdict comparison for a real
 * ticker) inside ContainerScroll. The product reveals itself with a 3D tilt
 * as the user scrolls into the section.
 *
 * Why the multi-scholar table: that's our actual differentiator. Every other
 * halal app hides scholar disagreement; we surface it. The scroll-in moment
 * IS the product pitch, not a generic dashboard.
 *
 * Defaults to AMZN (the most dramatic case: HALAL under AAOIFI, NOT HALAL
 * under Mufti Taqi). Pass `ticker` to override.
 */

"use client";

import { useMemo } from "react";
import { ContainerScroll } from "@/components/ui/ContainerScroll";
import CompanyLogo from "@/components/CompanyLogo";
import { findStock } from "@/lib/data";
import { SCHOLAR_PROFILES, getScholar } from "@/lib/scholars";
import { screenStock } from "@/lib/screen";
import type { Verdict } from "@/lib/types";
import { Search } from "lucide-react";

interface Props {
  /** Ticker to display in the mock. Defaults to AMZN. */
  ticker?: string;
  /** Title block — appears above the tilting card. */
  title?: React.ReactNode;
}

const VERDICT_LABEL: Record<Verdict, string> = {
  pass: "Halal",
  borderline: "Doubtful",
  fail: "Not halal",
};
const VERDICT_TEXT: Record<Verdict, string> = {
  pass: "text-emerald-700",
  borderline: "text-amber-700",
  fail: "text-rose-700",
};
const VERDICT_BG: Record<Verdict, string> = {
  pass: "bg-emerald-50",
  borderline: "bg-amber-50",
  fail: "bg-rose-50",
};

export default function ScrollDashboardHero({
  ticker = "AMZN",
  title,
}: Props) {
  const stock = findStock(ticker) ?? findStock("AAPL");

  const rows = useMemo(() => {
    if (!stock) return [];
    return SCHOLAR_PROFILES.filter((p) => p.id !== "custom").map((p) => {
      const r = screenStock(stock, getScholar(p.id));
      return {
        id: p.id,
        short: p.short,
        verdict: r.verdict,
      };
    });
  }, [stock]);

  return (
    <ContainerScroll
      titleComponent={
        title ?? (
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-600">
              See it in action
            </div>
            <h2
              className="mt-4 text-[34px] font-bold leading-[1.05] text-gray-900 sm:text-[56px]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Six scholars.
              <br />
              <span className="text-navy-800">One screen.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-gray-600">
              Same stock, six methodologies, side by side. No black-box scores —
              every threshold cited, every number sourced.
            </p>
          </div>
        )
      }
    >
      {stock ? (
        <DashboardMock stock={stock} rows={rows} />
      ) : (
        <div className="grid h-full place-items-center text-sm text-gray-500">
          Loading preview…
        </div>
      )}
    </ContainerScroll>
  );
}

function DashboardMock({
  stock,
  rows,
}: {
  stock: NonNullable<ReturnType<typeof findStock>>;
  rows: { id: string; short: string; verdict: Verdict }[];
}) {
  return (
    <div className="grid h-full grid-rows-[auto_1fr] gap-4 p-4 md:p-6">
      {/* Top: search-bar mock + ticker title */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 rounded-md border border-gray-200 bg-white px-3 py-2 sm:max-w-md sm:flex-1">
          <Search size={14} className="text-gray-400" />
          <span className="font-mono text-[13px] text-gray-700">{stock.ticker}</span>
          <span className="text-[13px] text-gray-400">— {stock.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <CompanyLogo ticker={stock.ticker} size={32} />
          <div className="text-right">
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-gray-400">
              {stock.sector}
            </div>
            <div className="font-mono text-[12px] tabular-nums text-gray-700">
              Mkt cap ${(stock.marketCapUsd / 1e9).toFixed(0)}B
            </div>
          </div>
        </div>
      </div>

      {/* Body: scholar comparison table — the Mizan signature */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="grid grid-cols-[1fr_auto_auto] gap-3 border-b border-gray-100 bg-gray-50 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-gray-500">
          <span>Scholar</span>
          <span className="text-right">Deciding metric</span>
          <span className="text-right">Verdict</span>
        </div>
        <div className="divide-y divide-gray-100">
          {rows.map((r) => (
            <div
              key={r.id}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-3"
            >
              <div>
                <div
                  className="text-[14px] font-semibold text-gray-900"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {r.short}
                </div>
              </div>
              <div className="text-right font-mono text-[11px] tabular-nums text-gray-500">
                {r.verdict === "fail"
                  ? "sector / ratio fail"
                  : r.verdict === "borderline"
                    ? "near threshold"
                    : "all checks pass"}
              </div>
              <div className="text-right">
                <span
                  className={
                    "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold " +
                    VERDICT_BG[r.verdict] +
                    " " +
                    VERDICT_TEXT[r.verdict]
                  }
                >
                  {VERDICT_LABEL[r.verdict]}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 bg-gray-50 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-gray-400">
          Source · AAOIFI §3 / Mufti Taqi published rulings / S&P DJIM methodology
        </div>
      </div>
    </div>
  );
}
