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
import HalalAlternatives from "@/components/HalalAlternatives";
import WatchlistButton from "@/components/WatchlistButton";
import StockLogo from "@/components/StockLogo";
import StockStats from "@/components/StockStats";
import { Card, PageHeader } from "@/components/ui";
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
      <div className="h-48 w-full animate-pulse rounded-2xl bg-gray-100" />
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
  const result = useMemo(() => (stock ? screenStock(stock, scholar) : null), [stock, scholar]);

  const allVerdicts = useMemo(() => {
    if (!stock) return [];
    return SCHOLAR_PROFILES.filter((p) => p.id !== "custom").map((p) => ({
      scholar: p,
      verdict: screenStock(stock, p).verdict,
    }));
  }, [stock]);

  const scholarsAgree = allVerdicts.length > 0 &&
    allVerdicts.every((v) => v.verdict === allVerdicts[0].verdict);

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Stock screener"
        title="Search a stock"
        description="Find any ticker; see the verdict under your scholar."
        action={stock ? <WatchlistButton ticker={stock.ticker} /> : undefined}
      />

      <TickerSearch value={ticker} onChange={(t) => setTicker(t)} autoFocus={!ticker} />

      {!ticker && <DemoBanner />}

      <ScholarPicker value={scholarId} onChange={setScholarId} />

      {!ticker && (
        <div className="pt-2">
          <FeaturedTickers onPick={(t) => setTicker(t)} />
        </div>
      )}

      {ticker && !stock && (
        <Card>
          <p className="text-sm text-amber-800">
            <strong>{ticker}</strong> isn&apos;t in Mizan&apos;s current sample dataset.
            The prototype ships with {stocks.length} representative tickers; production version supports any listed equity.
          </p>
        </Card>
      )}

      {stock && result && <ComplianceCard stock={stock} result={result} />}

      {/* Company stats — at-a-glance numbers behind the verdict */}
      {stock && <StockStats stock={stock} />}

      {/* Halal alternatives — show ONLY when stock fails */}
      {stock && result && result.verdict === "fail" && (
        <HalalAlternatives failedStock={stock} scholar={scholar} />
      )}

      {/* Multi-scholar strip — ONLY when scholars disagree */}
      {stock && allVerdicts.length > 0 && !scholarsAgree && (
        <Card padded={false} className="overflow-hidden">
          <div className="border-b border-gray-100 px-6 py-5 sm:px-8">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
              All five scholars on {stock.ticker}
            </div>
            <h2 className="mt-1 text-lg font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
              They disagree. The right answer is yours.
            </h2>
          </div>
          <div className="divide-y divide-gray-100 sm:grid sm:grid-cols-5 sm:divide-x sm:divide-y-0">
            {allVerdicts.map(({ scholar: p, verdict }) => {
              const color = verdict === "pass" ? "text-emerald-700" : verdict === "borderline" ? "text-amber-700" : "text-rose-700";
              const isCurrent = p.id === scholarId;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setScholarId(p.id)}
                  className={"block w-full px-6 py-5 text-left transition hover:bg-gray-50 " + (isCurrent ? "bg-navy-50/50" : "")}
                >
                  <div className="text-xs font-semibold text-gray-500">{p.short}</div>
                  <div className={`mt-2 text-xl font-bold ${color}`} style={{ fontFamily: "Georgia, serif" }}>
                    {VERDICT_LABEL[verdict]}
                  </div>
                  {isCurrent && (
                    <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-navy-700">your scholar</div>
                  )}
                </button>
              );
            })}
          </div>
        </Card>
      )}

      {stock && allVerdicts.length > 0 && scholarsAgree && (
        <div className="flex items-center gap-3 rounded-md border border-gray-200 bg-white px-4 py-3 text-sm">
          <div className="flex-shrink-0">
            <StockLogo ticker={stock.ticker} name={stock.name} size={24} />
          </div>
          <div className="flex-1 text-gray-700">
            <strong>Unanimous.</strong> All five mainstream scholars reach the same verdict on {stock.ticker}: <span className="font-semibold">{VERDICT_LABEL[allVerdicts[0].verdict]}</span>.
          </div>
        </div>
      )}

      {stock && (
        <p className="text-center text-xs text-gray-500">
          <Link href={`/vs?a=${stock.ticker}&b=MSFT`} className="text-navy-700 underline">Compare {stock.ticker} side-by-side</Link>
          {" · "}
          <Link href="/lists" className="text-navy-700 underline">Curated lists</Link>
          {" · "}
          <Link href="/universe" className="text-navy-700 underline">Browse all {stocks.length} tickers</Link>
          {" · "}
          <Link href="/methodology" className="text-navy-700 underline">How verdicts are computed</Link>
        </p>
      )}
    </div>
  );
}
