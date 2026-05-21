"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { findStock, listStocks } from "@/lib/data";
import { getScholar, SCHOLAR_PROFILES } from "@/lib/scholars";
import { loadCustomProfile } from "@/lib/customProfile";
import { screenStock } from "@/lib/screen";
import ScholarPicker from "@/components/ScholarPicker";
import ComplianceCard from "@/components/ComplianceCard";
import TickerSearch from "@/components/TickerSearch";
import FeaturedTickers from "@/components/FeaturedTickers";
import DemoBanner from "@/components/DemoBanner";
import { VERDICT_LABEL } from "@/lib/verdictLabels";

export default function ScreenPage() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <ScreenInner />
    </Suspense>
  );
}

function ScreenLoader() {
  return (
    <div className="space-y-4 py-8">
      <div className="h-10 w-80 animate-pulse rounded bg-gray-100" />
      <div className="h-5 w-96 animate-pulse rounded bg-gray-100" />
      <div className="h-32 w-full animate-pulse rounded bg-gray-100" />
    </div>
  );
}

function ScreenInner() {
  const params = useSearchParams();
  const [scholarId, setScholarId] = useState("aaoifi");
  const [ticker, setTicker] = useState("");
  const [bump, setBump] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("mizan.scholarId");
      if (saved && SCHOLAR_PROFILES.some((p) => p.id === saved)) setScholarId(saved);
    } catch {}
    const urlTicker = params.get("ticker");
    if (urlTicker) setTicker(urlTicker.toUpperCase());
  }, [params]);

  useEffect(() => {
    const onFocus = () => setBump((b) => b + 1);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const stocks = listStocks();
  const stock = ticker ? findStock(ticker) : undefined;
  const scholar = useMemo(
    () => (scholarId === "custom" ? loadCustomProfile() : getScholar(scholarId)),
    [scholarId, bump],
  );
  const result = useMemo(
    () => (stock ? screenStock(stock, scholar) : null),
    [stock, scholar],
  );

  // Compute verdicts for ALL scholars at once, for the side-by-side panel
  const allVerdicts = useMemo(() => {
    if (!stock) return [];
    return SCHOLAR_PROFILES.filter((p) => p.id !== "custom").map((p) => ({
      scholar: p,
      verdict: screenStock(stock, scholarId === "custom" && p.id === scholarId ? scholar : p === scholar ? scholar : p).verdict,
    }));
  }, [stock, scholar, scholarId]);

  return (
    <div className="space-y-6">
      {/* Header strip */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-widest text-gold-600">Stock screener</div>
        <h1 className="mt-2 text-3xl font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
          Search a stock
        </h1>
      </div>

      {/* Search */}
      <TickerSearch value={ticker} onChange={(t) => setTicker(t)} autoFocus={!ticker} />

      {!ticker && <DemoBanner />}

      {/* Scholar picker — compact */}
      <ScholarPicker value={scholarId} onChange={setScholarId} />

      {!ticker && (
        <div className="pt-2">
          <FeaturedTickers onPick={(t) => setTicker(t)} />
        </div>
      )}

      {ticker && !stock && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <strong>{ticker}</strong> isn&apos;t in Mizan&apos;s current sample dataset.
          The prototype ships with {stocks.length} representative tickers; in production we ingest live financial data from any listed equity.
        </div>
      )}

      {/* The headline verdict */}
      {stock && result && (
        <ComplianceCard stock={stock} result={result} />
      )}

      {/* Universal multi-scholar verdict strip — ALL scholars at once */}
      {stock && allVerdicts.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-6 py-4 sm:px-8">
            <div className="text-xs font-semibold uppercase tracking-widest text-gray-500">All five scholars on {stock.ticker}</div>
            <h2 className="mt-1 text-lg font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
              The verdict differs. The right answer is yours.
            </h2>
          </div>
          <div className="divide-y divide-gray-100 sm:grid sm:grid-cols-5 sm:divide-x sm:divide-y-0">
            {allVerdicts.map(({ scholar: p, verdict }) => {
              const v = verdict;
              const color = v === "pass" ? "text-emerald-700" : v === "borderline" ? "text-amber-700" : "text-rose-700";
              const isCurrent = p.id === scholarId;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setScholarId(p.id)}
                  className={
                    "block px-6 py-5 text-left transition hover:bg-gray-50 " +
                    (isCurrent ? "bg-navy-50" : "")
                  }
                >
                  <div className="text-xs font-semibold text-gray-500">{p.short}</div>
                  <div className={`mt-2 text-xl font-bold ${color}`} style={{ fontFamily: "Georgia, serif" }}>
                    {VERDICT_LABEL[v]}
                  </div>
                  {isCurrent && (
                    <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-navy-700">your scholar</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {stock && (
        <p className="text-center text-xs text-gray-500">
          <Link href="/universe" className="text-navy-700 underline">Browse all {stocks.length} tickers</Link>
          {" · "}
          <Link href="/methodology" className="text-navy-700 underline">How we compute these verdicts</Link>
        </p>
      )}
    </div>
  );
}
