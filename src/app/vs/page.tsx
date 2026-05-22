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
import StockLogo from "@/components/StockLogo";
import TickerSearch from "@/components/TickerSearch";
import { Card, PageHeader, Pill } from "@/components/ui";
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

  // Keep URL in sync
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
    <div className="space-y-6">
      <PageHeader
        kicker="Side by side"
        title="Compare two stocks"
        description="Pick any two tickers. See the verdict, the financial ratios, and the price of each — under whichever scholar you follow."
      />

      <Card padded={false}>
        <div className="grid grid-cols-1 gap-px bg-gray-100 md:grid-cols-[1fr_auto_1fr]">
          <div className="bg-white p-5">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-gray-500">
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
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-gray-500">
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
      </Card>

      <div>
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-gray-500">
          Screen against
        </div>
        <ScholarPicker value={scholarId} onChange={setScholarId} />
      </div>

      {(!stockA || !stockB) && (
        <Card>
          <p className="text-sm text-amber-800">
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
          </p>
        </Card>
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
    <div className="space-y-4">
      <Card padded={false} className="overflow-hidden">
        <div className="grid grid-cols-2">
          <Hero stock={a} result={ra} />
          <Hero stock={b} result={rb} bordered />
        </div>
      </Card>

      <Card padded={false} className="overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-4">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
            Compared under
          </div>
          <h2 className="mt-1 text-lg font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
            {scholarLabel}
          </h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              <th className="px-6 py-3">Metric</th>
              <th className="px-6 py-3 text-right">{a.ticker}</th>
              <th className="px-6 py-3 text-right">{b.ticker}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <MetricRow
              label="Sector"
              valueA={a.sector}
              valueB={b.sector}
              winner={null}
            />
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
              label="Interest-bearing debt / market cap"
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
              label="Illiquid (tangible) assets / total assets"
              valueA={fmtPct(a.illiquidAssetsToTotalAssetsPct)}
              valueB={fmtPct(b.illiquidAssetsToTotalAssetsPct)}
              winner={winners.illiquid}
              winnerHint="higher passes Mufti Taqi"
            />
          </tbody>
        </table>
      </Card>

      <Card>
        <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
          All five scholars
        </div>
        <h3 className="mt-1 text-lg font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
          How each tradition sees these two
        </h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                <th className="py-2 pr-4">Scholar</th>
                <th className="py-2 pr-4">{a.ticker}</th>
                <th className="py-2">{b.ticker}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {SCHOLAR_PROFILES.filter((p) => p.id !== "custom").map((p) => {
                const va = screenStock(a, p).verdict;
                const vb = screenStock(b, p).verdict;
                return (
                  <tr key={p.id}>
                    <td className="py-3 pr-4 font-semibold text-gray-700">{p.short}</td>
                    <td className="py-3 pr-4"><Pill tone={toneFor(va)}>{VERDICT_LABEL[va]}</Pill></td>
                    <td className="py-3"><Pill tone={toneFor(vb)}>{VERDICT_LABEL[vb]}</Pill></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="text-center text-xs text-gray-500">
        Side-by-side comparison shows the underlying financials behind each verdict. Open either ticker in the full{" "}
        <Link href={`/screen?ticker=${a.ticker}`} className="text-navy-700 underline">screener</Link> for the complete ratio breakdown.
      </p>
    </div>
  );
}

function Hero({
  stock, result, bordered,
}: {
  stock: StockFundamentals;
  result: ScreeningResult;
  bordered?: boolean;
}) {
  const color =
    result.verdict === "pass" ? "text-emerald-700"
      : result.verdict === "borderline" ? "text-amber-700"
        : "text-rose-700";
  return (
    <div className={"p-6 sm:p-8 " + (bordered ? "border-l border-gray-100" : "")}>
      <div className="flex items-center gap-3">
        <StockLogo ticker={stock.ticker} name={stock.name} size={32} />
        <div>
          <div className="font-mono text-sm font-semibold text-gray-900">{stock.ticker}</div>
          <div className="text-xs text-gray-500">{stock.name}</div>
        </div>
      </div>
      <div className={`mt-5 text-4xl font-bold sm:text-5xl ${color}`} style={{ fontFamily: "Georgia, serif" }}>
        {VERDICT_LABEL[result.verdict]}
      </div>
      <div className="mt-2 text-xs text-gray-500">
        {stock.sector} · {fmtMarketCap(stock.marketCapUsd)}
      </div>
    </div>
  );
}

function MetricRow({
  label, valueA, valueB, winner, winnerHint,
}: {
  label: string;
  valueA: string;
  valueB: string;
  winner: "a" | "b" | "tie" | null;
  winnerHint?: string;
}) {
  return (
    <tr>
      <td className="px-6 py-3 text-gray-700">
        {label}
        {winner && winner !== "tie" && winnerHint && (
          <span className="ml-2 text-[10px] uppercase tracking-wider text-gray-400">
            ({winnerHint})
          </span>
        )}
      </td>
      <td className={"px-6 py-3 text-right tabular-nums " + winnerClass(winner, "a")}>{valueA}</td>
      <td className={"px-6 py-3 text-right tabular-nums " + winnerClass(winner, "b")}>{valueB}</td>
    </tr>
  );
}

function winnerClass(winner: "a" | "b" | "tie" | null, col: "a" | "b") {
  if (winner === col) return "font-semibold text-emerald-700";
  if (winner === "tie") return "text-gray-700";
  return "text-gray-700";
}

function toneFor(v: Verdict): "pass" | "warn" | "fail" {
  return v === "pass" ? "pass" : v === "borderline" ? "warn" : "fail";
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
    <Card className="bg-gray-50">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
        Try a comparison
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {SUGGESTED_PAIRS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => onPick(p.a, p.b)}
            className="inline-flex items-center rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:border-navy-300 hover:bg-navy-50 hover:text-navy-800"
          >
            {p.label}
          </button>
        ))}
      </div>
    </Card>
  );
}

