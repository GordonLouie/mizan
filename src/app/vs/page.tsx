"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeftRight } from "lucide-react";
import { findStock } from "@/lib/data";
import { getScholar, SCHOLAR_PROFILES } from "@/lib/scholars";
import { loadCustomProfile } from "@/lib/customProfile";
import { screenStock } from "@/lib/screen";
import { priceForTicker } from "@/lib/prices";
import { fmtMarketCap } from "@/lib/lists";
import { VERDICT_LABEL } from "@/lib/verdictLabels";
import ScholarPicker from "@/components/ScholarPicker";
import TickerSearch from "@/components/TickerSearch";
import type { ScreeningResult, StockFundamentals, Verdict } from "@/lib/types";

export default function VsPage() {
  return (
    <Suspense fallback={<Loader />}>
      <VsInner />
    </Suspense>
  );
}

function Loader() {
  return (
    <div className="space-y-4 py-8">
      <div className="h-10 w-80 animate-pulse rounded bg-gray-100" />
      <div className="h-64 w-full animate-pulse rounded-xl bg-gray-100" />
    </div>
  );
}

function VsInner() {
  const params = useSearchParams();
  const router = useRouter();

  const initialA = (params.get("a") || "AAPL").toUpperCase();
  const initialB = (params.get("b") || "MSFT").toUpperCase();
  const [tickerA, setTickerA] = useState(initialA);
  const [tickerB, setTickerB] = useState(initialB);
  const [scholarId, setScholarId] = useState("aaoifi");
  const [bump, setBump] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("mizan.scholarId");
      if (saved && SCHOLAR_PROFILES.some((p) => p.id === saved)) {
        setScholarId(saved);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const onFocus = () => setBump((b) => b + 1);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  useEffect(() => {
    const sp = new URLSearchParams();
    if (tickerA) sp.set("a", tickerA);
    if (tickerB) sp.set("b", tickerB);
    router.replace(`/vs?${sp.toString()}`, { scroll: false });
  }, [tickerA, tickerB, router]);

  const stockA = findStock(tickerA);
  const stockB = findStock(tickerB);
  const scholar = useMemo(
    () => (scholarId === "custom" ? loadCustomProfile() : getScholar(scholarId)),
    [scholarId, bump],
  );

  const resultA = useMemo(() => (stockA ? screenStock(stockA, scholar) : null), [stockA, scholar]);
  const resultB = useMemo(() => (stockB ? screenStock(stockB, scholar) : null), [stockB, scholar]);

  function swap() {
    setTickerA(tickerB);
    setTickerB(tickerA);
  }

  return (
    <div className="pb-32">
      {/* PAGE HEADER */}
      <header className="pt-6">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Side by side
        </div>
        <h1
          className="mt-3 text-[36px] font-bold leading-[1.1] text-gray-900 sm:text-[44px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Compare two stocks
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-gray-600">
          Pick any two tickers. See the verdict, the financial ratios, and the price of
          each — under whichever scholar you follow.
        </p>
      </header>

      {/* TICKER SELECTORS */}
      <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200 md:grid-cols-[1fr_auto_1fr]">
        <div className="bg-white p-5">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
            Stock A
          </div>
          <TickerSearch
            value={tickerA}
            onChange={(t) => setTickerA(t.toUpperCase())}
            placeholder="Search ticker A"
            autoFocus={false}
          />
        </div>
        <div className="flex items-center justify-center bg-white px-3 py-4 md:py-0">
          <button
            type="button"
            onClick={swap}
            title="Swap"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-navy-300 hover:bg-navy-50 hover:text-navy-700"
          >
            <ArrowLeftRight size={14} />
          </button>
        </div>
        <div className="bg-white p-5">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
            Stock B
          </div>
          <TickerSearch
            value={tickerB}
            onChange={(t) => setTickerB(t.toUpperCase())}
            placeholder="Search ticker B"
            autoFocus={false}
          />
        </div>
      </div>

      {/* SCHOLAR PICKER */}
      <div className="mt-6">
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Screen against
        </div>
        <div className="sm:max-w-md">
          <ScholarPicker value={scholarId} onChange={setScholarId} />
        </div>
      </div>

      {(!stockA || !stockB) && (
        <div className="mt-6 rounded-md border border-amber-200 bg-amber-50/60 px-4 py-3 text-[13px] text-amber-900">
          {!stockA && (
            <span>
              <strong>{tickerA}</strong> isn&apos;t in the prototype dataset.{" "}
            </span>
          )}
          {!stockB && (
            <span>
              <strong>{tickerB}</strong> isn&apos;t in the prototype dataset.{" "}
            </span>
          )}
          Try one of the suggested pairs below.
        </div>
      )}

      {stockA && stockB && resultA && resultB && (
        <ComparisonGrid
          a={stockA}
          b={stockB}
          ra={resultA}
          rb={resultB}
          scholarLabel={scholar.label}
        />
      )}

      <SuggestedPairs onPick={(a, b) => { setTickerA(a); setTickerB(b); }} />
    </div>
  );
}

function ComparisonGrid({
  a, b, ra, rb, scholarLabel,
}: {
  a: StockFundamentals;
  b: StockFundamentals;
  ra: ScreeningResult;
  rb: ScreeningResult;
  scholarLabel: string;
}) {
  const winners = winnersByMetric(a, b);

  return (
    <div className="mt-12 space-y-10">
      {/* HERO ROW — two verdict cards side-by-side */}
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200 sm:grid-cols-2">
        <Hero stock={a} result={ra} />
        <Hero stock={b} result={rb} />
      </div>

      {/* METRIC COMPARISON */}
      <section>
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Compared under
        </div>
        <h2
          className="mt-2 text-[24px] font-bold leading-tight text-gray-900 sm:text-[28px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {scholarLabel}
        </h2>
        <div className="mb-2 text-[11px] italic text-gray-500 sm:hidden">← Swipe to see more →</div>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="pb-3 pr-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                  Metric
                </th>
                <th className="pb-3 pr-4 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                  {a.ticker}
                </th>
                <th className="pb-3 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                  {b.ticker}
                </th>
              </tr>
            </thead>
            <tbody>
              <MetricRow label="Sector" valueA={a.sector} valueB={b.sector} winner={null} />
              <MetricRow
                label="Market cap"
                valueA={fmtMarketCap(a.marketCapUsd)}
                valueB={fmtMarketCap(b.marketCapUsd)}
                winner={winners.marketCap}
                winnerHint="bigger"
              />
              <MetricRow
                label="Last price"
                valueA={fmtPrice(priceForTicker(a.ticker))}
                valueB={fmtPrice(priceForTicker(b.ticker))}
                winner={null}
              />
              <MetricRow
                label="Dividend yield"
                valueA={fmtPct(a.dividendYieldPct)}
                valueB={fmtPct(b.dividendYieldPct)}
                winner={winners.dividend}
                winnerHint="higher yield"
              />
              <MetricRow
                label="Impure income / revenue"
                valueA={fmtPct(a.impermissibleIncomePct)}
                valueB={fmtPct(b.impermissibleIncomePct)}
                winner={winners.impure}
                winnerHint="lower is cleaner"
              />
              <MetricRow
                label="Debt / market cap"
                valueA={fmtPct(a.debtToMarketCapPct)}
                valueB={fmtPct(b.debtToMarketCapPct)}
                winner={winners.debt}
                winnerHint="lower is cleaner"
              />
              <MetricRow
                label="Cash + securities / market cap"
                valueA={fmtPct(a.cashSecuritiesToMarketCapPct)}
                valueB={fmtPct(b.cashSecuritiesToMarketCapPct)}
                winner={winners.cash}
                winnerHint="lower is cleaner"
              />
              <MetricRow
                label="Receivables / market cap"
                valueA={fmtPct(a.receivablesToMarketCapPct)}
                valueB={fmtPct(b.receivablesToMarketCapPct)}
                winner={winners.receivables}
                winnerHint="lower is cleaner"
              />
              <MetricRow
                label="Illiquid assets / total assets"
                valueA={fmtPct(a.illiquidAssetsToTotalAssetsPct)}
                valueB={fmtPct(b.illiquidAssetsToTotalAssetsPct)}
                winner={winners.illiquid}
                winnerHint="higher passes Mufti Taqi"
                isLast
              />
            </tbody>
          </table>
        </div>
      </section>

      {/* ALL SCHOLARS COMPARISON */}
      <section className="border-t border-gray-200 pt-10">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Every scholar
        </div>
        <h2
          className="mt-2 text-[24px] font-bold leading-tight text-gray-900 sm:text-[28px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          How each tradition sees these two
        </h2>
        <div className="mb-2 text-[11px] italic text-gray-500 sm:hidden">← Swipe to see more →</div>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="pb-3 pr-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                  Scholar
                </th>
                <th className="pb-3 pr-4 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                  {a.ticker}
                </th>
                <th className="pb-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                  {b.ticker}
                </th>
              </tr>
            </thead>
            <tbody>
              {SCHOLAR_PROFILES.filter((p) => p.id !== "custom").map((p, idx, arr) => {
                const va = screenStock(a, p).verdict;
                const vb = screenStock(b, p).verdict;
                return (
                  <tr
                    key={p.id}
                    className={idx !== arr.length - 1 ? "border-b border-gray-100" : ""}
                  >
                    <td className="py-3 pr-4 text-[13px] font-semibold text-gray-900">
                      {p.short}
                    </td>
                    <td className="py-3 pr-4 text-center">
                      <VerdictPill verdict={va} />
                    </td>
                    <td className="py-3 text-center">
                      <VerdictPill verdict={vb} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <p className="text-center text-[11px] text-gray-500">
        Side-by-side comparison shows the underlying financials behind each verdict. Open
        either ticker in the full{" "}
        <Link
          href={`/screen?ticker=${a.ticker}`}
          className="text-navy-700 underline hover:text-navy-900"
        >
          screener
        </Link>{" "}
        for the complete ratio breakdown.
      </p>
    </div>
  );
}

function Hero({ stock, result }: { stock: StockFundamentals; result: ScreeningResult }) {
  const color =
    result.verdict === "pass" ? "text-emerald-700" :
    result.verdict === "borderline" ? "text-amber-700" :
    "text-rose-700";
  return (
    <div className="bg-white p-7 sm:p-9">
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
        {stock.sector}
      </div>
      <div className="mt-2 font-mono text-[14px] font-bold text-gray-900">
        {stock.ticker}
      </div>
      <div
        className="mt-0.5 text-[15px] text-gray-700"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {stock.name}
      </div>
      <div
        className={`mt-6 text-[44px] font-bold leading-none sm:text-[56px] ${color}`}
        style={{ fontFamily: "var(--font-display)" }}
      >
        {VERDICT_LABEL[result.verdict]}
      </div>
      <div className="mt-4 font-mono text-[12px] text-gray-500">
        {fmtMarketCap(stock.marketCapUsd)} market cap
      </div>
    </div>
  );
}

function MetricRow({
  label,
  valueA,
  valueB,
  winner,
  winnerHint,
  isLast,
}: {
  label: string;
  valueA: string;
  valueB: string;
  winner: "a" | "b" | "tie" | null;
  winnerHint?: string;
  isLast?: boolean;
}) {
  return (
    <tr className={isLast ? "" : "border-b border-gray-100"}>
      <td className="py-3 pr-4 text-[13px] text-gray-700">
        {label}
        {winner && winner !== "tie" && winnerHint && (
          <span className="ml-2 text-[10px] uppercase tracking-[0.14em] text-gray-400">
            ({winnerHint})
          </span>
        )}
      </td>
      <td className={"py-3 pr-4 text-right font-mono text-[13px] tabular-nums " + winnerClass(winner, "a")}>
        {valueA}
      </td>
      <td className={"py-3 text-right font-mono text-[13px] tabular-nums " + winnerClass(winner, "b")}>
        {valueB}
      </td>
    </tr>
  );
}

function VerdictPill({ verdict }: { verdict: Verdict }) {
  const tone =
    verdict === "pass" ? "bg-emerald-50 text-emerald-700"
      : verdict === "fail" ? "bg-rose-50 text-rose-700"
        : "bg-amber-50 text-amber-700";
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${tone}`}>
      {VERDICT_LABEL[verdict]}
    </span>
  );
}

function winnerClass(winner: "a" | "b" | "tie" | null, col: "a" | "b") {
  if (winner === col) return "font-semibold text-emerald-700";
  return "text-gray-700";
}

function fmtPct(v: number) {
  return `${v.toFixed(1)}%`;
}

function fmtPrice(v: number | null) {
  if (v == null) return "—";
  return `$${v.toFixed(2)}`;
}

function winnersByMetric(a: StockFundamentals, b: StockFundamentals) {
  const lower = (av: number, bv: number): "a" | "b" | "tie" =>
    av < bv ? "a" : bv < av ? "b" : "tie";
  const higher = (av: number, bv: number): "a" | "b" | "tie" =>
    av > bv ? "a" : bv > av ? "b" : "tie";
  return {
    marketCap: higher(a.marketCapUsd, b.marketCapUsd),
    dividend: higher(a.dividendYieldPct, b.dividendYieldPct),
    impure: lower(a.impermissibleIncomePct, b.impermissibleIncomePct),
    debt: lower(a.debtToMarketCapPct, b.debtToMarketCapPct),
    cash: lower(a.cashSecuritiesToMarketCapPct, b.cashSecuritiesToMarketCapPct),
    receivables: lower(a.receivablesToMarketCapPct, b.receivablesToMarketCapPct),
    illiquid: higher(a.illiquidAssetsToTotalAssetsPct, b.illiquidAssetsToTotalAssetsPct),
  };
}

const SUGGESTED_PAIRS: Array<{ a: string; b: string; label: string }> = [
  { a: "AAPL", b: "MSFT", label: "AAPL vs MSFT" },
  { a: "GOOGL", b: "META", label: "GOOGL vs META" },
  { a: "TSLA", b: "MBG.DE", label: "TSLA vs Mercedes" },
  { a: "AMZN", b: "WMT", label: "AMZN vs WMT" },
  { a: "JNJ", b: "PFE", label: "JNJ vs PFE" },
  { a: "XOM", b: "CVX", label: "XOM vs CVX" },
  { a: "SPUS", b: "HLAL", label: "SPUS vs HLAL" },
];

function SuggestedPairs({ onPick }: { onPick: (a: string, b: string) => void }) {
  return (
    <div className="mt-16 border-t border-gray-200 pt-8">
      <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
        Try a comparison
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {SUGGESTED_PAIRS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => onPick(p.a, p.b)}
            className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[12px] font-medium text-gray-700 transition hover:border-navy-300 hover:bg-navy-50 hover:text-navy-800"
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
