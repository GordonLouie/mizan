/**
 * ScrollDashboardHero — the scroll-tilting product showcase.
 *
 * Embeds a faithful slice of HalalGauge's actual /screen page (company header
 * + verdict hero + multi-scholar comparison table) inside the iPad chrome
 * from ContainerScroll. The card tilts in as the user scrolls.
 *
 * Real engine: scholar verdicts here are computed by screenStock() against
 * the actual stocks.json data, exactly the way the live page does it.
 */

"use client";

import { useMemo } from "react";
import { ContainerScroll } from "@/components/ui/ContainerScroll";
import CompanyLogo from "@/components/CompanyLogo";
import { findStock } from "@/lib/data";
import { SCHOLAR_PROFILES, getScholar } from "@/lib/scholars";
import { screenStock } from "@/lib/screen";
import type { Verdict } from "@/lib/types";
import { ArrowRight } from "lucide-react";

interface Props {
  /** Ticker to feature in the mock. Default AMZN — the most dramatic split. */
  ticker?: string;
  /** Active scholar for the verdict card. Default AAOIFI. */
  scholarId?: string;
  /** Title block — appears above the device. */
  title?: React.ReactNode;
}

const VERDICT_LABEL: Record<Verdict, string> = {
  pass: "Halal",
  borderline: "Borderline",
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
  scholarId = "aaoifi",
  title,
}: Props) {
  const stock = findStock(ticker) ?? findStock("AAPL");
  const scholar = getScholar(scholarId);
  const result = stock ? screenStock(stock, scholar) : null;

  const allVerdicts = useMemo(() => {
    if (!stock) return [];
    return SCHOLAR_PROFILES.filter((p) => p.id !== "custom").map((p) => {
      const r = screenStock(stock, getScholar(p.id));
      return { id: p.id, short: p.short, verdict: r.verdict };
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
              className="mt-5 text-[40px] font-bold leading-[0.95] text-gray-900 sm:text-[64px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Five scholars.
              <br />
              <span className="text-navy-900">One screen.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-gray-600">
              Same stock, six methodologies, side by side. No black-box scores
              — every threshold cited, every number sourced.
            </p>
          </div>
        )
      }
    >
      {stock && result ? (
        <ScreenSnapshot
          stock={stock}
          scholarShort={scholar.short}
          activeVerdict={result.verdict}
          allVerdicts={allVerdicts}
        />
      ) : (
        <div className="grid h-full place-items-center text-sm text-gray-500">
          Loading preview…
        </div>
      )}
    </ContainerScroll>
  );
}

function ScreenSnapshot({
  stock,
  scholarShort,
  activeVerdict,
  allVerdicts,
}: {
  stock: NonNullable<ReturnType<typeof findStock>>;
  scholarShort: string;
  activeVerdict: Verdict;
  allVerdicts: { id: string; short: string; verdict: Verdict }[];
}) {
  // Compact stat row for the company header
  const stats = [
    { label: "Mkt cap", value: fmtCap(stock.marketCapUsd) },
    { label: "Debt/cap", value: `${stock.debtToMarketCapPct.toFixed(1)}%` },
    { label: "Cash+sec/cap", value: `${stock.cashSecuritiesToMarketCapPct.toFixed(1)}%` },
    { label: "Illiq assets", value: `${stock.illiquidAssetsToTotalAssetsPct}%` },
  ];

  return (
    <div className="h-full overflow-hidden font-sans">
      {/* CONTENT WRAPPER — clip overflowing bottom so it looks like the
          top half of the screen page, in screenshot fashion */}
      <div className="grid h-full grid-rows-[auto_1fr]">
        {/* HERO ROW: company info LEFT, verdict card RIGHT */}
        <div className="grid grid-cols-12 gap-4 px-5 pt-5 sm:px-7 sm:pt-7 md:gap-6">
          {/* LEFT: company */}
          <div className="col-span-12 lg:col-span-7">
            <div className="flex items-center gap-3">
              <CompanyLogo ticker={stock.ticker} size={36} />
              <div className="text-[9px] font-semibold uppercase tracking-[0.22em] text-gray-500">
                {stock.ticker} · {stock.sector}
              </div>
            </div>
            <h1
              className="mt-3 text-[24px] font-bold leading-[1.1] text-gray-900 sm:text-[32px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {stock.name}
            </h1>
            <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-2 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="flex items-baseline gap-1.5">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                    {s.label}
                  </span>
                  <span className="font-mono text-[12px] font-semibold tabular-nums text-gray-800">
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: verdict hero card */}
          <div className="col-span-12 lg:col-span-5">
            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
              <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                Under {scholarShort}
              </div>
              <div
                className={
                  "mt-2 text-[42px] font-bold leading-none sm:text-[52px] " +
                  VERDICT_TEXT[activeVerdict]
                }
                style={{ fontFamily: "var(--font-display)" }}
              >
                {VERDICT_LABEL[activeVerdict]}
              </div>
              <p className="mt-3 text-[12px] leading-relaxed text-gray-600">
                {activeVerdict === "pass"
                  ? "All ratio thresholds pass under this methodology."
                  : activeVerdict === "borderline"
                    ? "One or more checks sit close to the threshold."
                    : "Sector or ratio fails this methodology."}
              </p>
              <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-navy-700">
                See methodology
                <ArrowRight size={11} />
              </div>
            </div>
          </div>
        </div>

        {/* MULTI-SCHOLAR TABLE */}
        <div className="overflow-hidden px-5 pb-5 pt-6 sm:px-7 md:pb-7">
          <div className="text-[9px] font-semibold uppercase tracking-[0.22em] text-gray-500">
            Multi-scholar view
          </div>
          <h3
            className="mt-1.5 text-[20px] font-bold leading-tight text-gray-900 sm:text-[24px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            The scholars disagree.
          </h3>

          <div className="mt-3 overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="grid grid-cols-[1fr_auto_auto] gap-3 border-b border-gray-100 bg-gray-50 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-gray-500 sm:px-5">
              <span>Scholar</span>
              <span className="text-right">Verdict</span>
              <span className="text-right">Deciding metric</span>
            </div>
            <div className="divide-y divide-gray-100">
              {allVerdicts.slice(0, 5).map((row) => (
                <div
                  key={row.id}
                  className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-2.5 sm:px-5"
                >
                  <div
                    className="text-[13px] font-semibold text-gray-900"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {row.short}
                  </div>
                  <div className="text-right">
                    <span
                      className={
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold " +
                        VERDICT_BG[row.verdict] +
                        " " +
                        VERDICT_TEXT[row.verdict]
                      }
                    >
                      {VERDICT_LABEL[row.verdict]}
                    </span>
                  </div>
                  <div className="text-right font-mono text-[10px] tabular-nums text-gray-500">
                    {row.verdict === "fail"
                      ? "sector / ratio fail"
                      : row.verdict === "borderline"
                        ? "near threshold"
                        : "all checks pass"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function fmtCap(usd: number): string {
  if (usd >= 1e12) return `$${(usd / 1e12).toFixed(1)}T`;
  if (usd >= 1e9) return `$${(usd / 1e9).toFixed(0)}B`;
  if (usd >= 1e6) return `$${(usd / 1e6).toFixed(0)}M`;
  return `$${usd.toLocaleString()}`;
}
