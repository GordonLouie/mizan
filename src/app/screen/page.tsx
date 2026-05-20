"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { listStocks, findStock } from "@/lib/data";
import { getScholar, SCHOLAR_PROFILES } from "@/lib/scholars";
import { loadCustomProfile } from "@/lib/customProfile";
import { screenStock } from "@/lib/screen";
import ScholarPicker from "@/components/ScholarPicker";
import ComplianceCard from "@/components/ComplianceCard";
import { Search, Settings } from "lucide-react";

export default function ScreenPage() {
  return (
    <Suspense fallback={<div className="text-sm text-gray-500">Loading…</div>}>
      <ScreenInner />
    </Suspense>
  );
}

function ScreenInner() {
  const params = useSearchParams();
  const [scholarId, setScholarId] = useState("aaoifi");
  const [ticker, setTicker] = useState("");
  const [bump, setBump] = useState(0); // force re-evaluation after custom save

  useEffect(() => {
    try {
      const saved = localStorage.getItem("mizan.scholarId");
      if (saved && SCHOLAR_PROFILES.some((p) => p.id === saved)) setScholarId(saved);
    } catch {}
    const urlTicker = params.get("ticker");
    if (urlTicker) setTicker(urlTicker);
  }, [params]);

  // Re-load custom profile when window regains focus (so edits in /custom propagate)
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

  const showSideBySide =
    stock && (stock.ticker === "AMZN" || stock.ticker === "META" || stock.ticker === "NFLX");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Stock screener</h1>
        <p className="mt-1 text-sm text-gray-600">
          Search a ticker. Mizan returns a transparent compliance verdict and the
          underlying ratios — calibrated to your selected scholar.
        </p>
      </div>

      <ScholarPicker value={scholarId} onChange={setScholarId} />

      {scholarId === "custom" && (
        <div className="flex items-center justify-between rounded-md border border-navy-200 bg-navy-50 px-4 py-3 text-sm text-navy-800">
          <span>Using your custom thresholds. <Link href="/custom" className="font-medium underline">Edit</Link> to change them.</span>
          <Link href="/custom" className="inline-flex items-center gap-1 text-xs text-navy-700"><Settings size={12} /> Configure</Link>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">Ticker</label>
        <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 focus-within:border-navy-400 focus-within:bg-white">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            placeholder="Try AMZN, AAPL, JPM, TSLA…"
            className="w-full bg-transparent text-base outline-none"
          />
        </div>
        <div className="mt-3 text-xs text-gray-500">
          Or <Link href="/universe" className="text-navy-700 underline">browse the universe</Link> of all {stocks.length} tickers Mizan ships with.
        </div>
      </div>

      {ticker && !stock && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <strong>{ticker}</strong> isn&apos;t in Mizan&apos;s current sample dataset.
          In production we ingest live financial data; this prototype ships with{" "}
          {stocks.length} representative tickers across global markets.
        </div>
      )}

      {stock && result && !showSideBySide && (
        <ComplianceCard stock={stock} result={result} />
      )}

      {stock && result && showSideBySide && (
        <>
          <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <strong>Heads up:</strong> {stock.ticker} is a great demo of why
            single-standard apps miss the nuance. Below is your selected scholar&apos;s
            verdict — and, side-by-side, Mufti Taqi Usmani&apos;s, which adds an
            illiquid-asset floor.
          </div>
          <ComplianceCard stock={stock} result={result} />
          {scholarId !== "taqi_usmani" && (
            <ComplianceCard
              stock={stock}
              result={screenStock(stock, getScholar("taqi_usmani"))}
            />
          )}
        </>
      )}
    </div>
  );
}
