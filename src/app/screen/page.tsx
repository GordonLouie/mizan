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
import StockStats from "@/components/StockStats";
import { Card } from "@/components/ui";
import { VERDICT_LABEL } from "@/lib/verdictLabels";
import { fmtMarketCap } from "@/lib/lists";
import { ArrowRight, BarChart3 } from "lucide-react";

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
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("mizan.scholarId");
      if (saved && SCHOLAR_PROFILES.some((p) => p.id === saved)) setScholarId(saved);
      // Welcome banner: show only if user has never dismissed AND never saved a scholar.
      // Per Miqdad: "if the choosing + explanation pops up over and over itll be annoying"
      const dismissed = localStorage.getItem("mizan.welcomeDismissed");
      if (!dismissed && !saved) setShowWelcome(true);
    } catch {}
    const urlTicker = params.get("ticker");
    if (urlTicker) setTicker(urlTicker.toUpperCase());
  }, [params]);

  const dismissWelcome = () => {
    try {
      localStorage.setItem("mizan.welcomeDismissed", "true");
    } catch {}
    setShowWelcome(false);
  };

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

  // Run the screen against every non-custom scholar so the evidence table
  // can always show all five mainstream verdicts side by side.
  const allVerdicts = useMemo(() => {
    if (!stock) return [];
    return SCHOLAR_PROFILES.filter((p) => p.id !== "custom").map((p) => {
      const r = screenStock(stock, p);
      const failing = r.ratioChecks.find((c) => !c.passes);
      const decidingMetric = !r.sectorPasses
        ? r.sectorReason
        : failing
          ? `${failing.label} ${failing.value.toFixed(1)}% ${failing.direction === "max" ? "≤" : "≥"} ${failing.threshold}%`
          : "All ratios pass";
      return { scholar: p, verdict: r.verdict, decidingMetric, isFailing: !!failing || !r.sectorPasses };
    });
  }, [stock]);

  const scholarsAgree = allVerdicts.length > 0 &&
    allVerdicts.every((v) => v.verdict === allVerdicts[0].verdict);

  // ─── EMPTY STATE: no ticker selected ──────────────────────────────────────
  if (!stock) {
    const currentScholar = SCHOLAR_PROFILES.find((p) => p.id === scholarId);
    return (
      <div className="space-y-8 pb-16">
        <div className="pt-2">
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
            Stock screener
          </div>
          <h1
            className="mt-3 text-[32px] font-bold leading-tight text-gray-900 sm:text-[40px]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Search a stock
          </h1>
          <p className="mt-2 max-w-xl text-[15px] text-gray-600">
            Type any ticker. See the verdict and every threshold the moment you do.
          </p>
        </div>

        <TickerSearch value={ticker} onChange={(t) => setTicker(t)} autoFocus={!ticker} />

        {/* First-visit welcome banner — disappears forever after dismiss.
            Per Miqdad: return users shouldn't see this every visit. */}
        {showWelcome && (
          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-5">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-navy-700">
              First time on Mizan?
            </div>
            <p className="mt-2 text-[14px] leading-relaxed text-gray-800">
              You&apos;re currently set to <strong>AAOIFI</strong> — the gold standard used by Islamic banks across the Middle East. Most users keep this.
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-gray-600">
              If you follow a specific scholar (Mufti Taqi Usmani, Ja&apos;fari, the strict view, etc.), set it once and Mizan will remember.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => {
                  dismissWelcome();
                  document
                    .getElementById("scholar-picker")
                    ?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
                className="rounded-md bg-navy-800 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-navy-700"
              >
                Set my scholar →
              </button>
              <button
                onClick={dismissWelcome}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-[13px] font-semibold text-gray-700 transition hover:border-gray-400 hover:text-gray-900"
              >
                Keep AAOIFI default
              </button>
              <Link
                href="/methodology"
                className="ml-1 self-center text-[12px] font-medium text-navy-700 hover:text-navy-900"
              >
                Why these defaults?
              </Link>
            </div>
          </div>
        )}

        {!ticker && <FeaturedTickers onPick={(t) => setTicker(t)} />}

        {/* Scholar picker — its own internal "Scholar" label is the heading. */}
        <div id="scholar-picker">
          <ScholarPicker value={scholarId} onChange={setScholarId} />
        </div>

        {!ticker && <DemoBanner />}

        {ticker && !stock && (
          <Card>
            <p className="text-sm text-amber-800">
              <strong>{ticker}</strong> isn&apos;t in Mizan&apos;s current sample dataset.
              The prototype ships with {stocks.length} representative tickers; production version supports any listed equity.
            </p>
          </Card>
        )}
      </div>
    );
  }

  // ─── STOCK SELECTED: hero + evidence table + breakdown ────────────────────
  const verdictColor =
    result!.verdict === "pass" ? "text-emerald-700" :
    result!.verdict === "fail" ? "text-rose-700" : "text-amber-700";

  return (
    <div className="space-y-10 pb-16">
      {/* TICKER + SCHOLAR TOOLBAR */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
        <TickerSearch value={ticker} onChange={(t) => setTicker(t)} />
        <div className="sm:min-w-[260px]">
          <ScholarPicker value={scholarId} onChange={setScholarId} />
        </div>
      </div>

      {/* HERO ROW — company info LEFT, verdict card RIGHT */}
      <section className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7">
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
            {stock.ticker} · {stock.sector}
          </div>
          <h1
            className="mt-2 text-[32px] font-bold leading-[1.1] text-gray-900 sm:text-[40px]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {stock.name}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <Stat label="Market cap" value={fmtMarketCap(stock.marketCapUsd)} />
            <Stat label="Debt/cap" value={`${stock.debtToMarketCapPct.toFixed(1)}%`} />
            <Stat label="Cash+sec/cap" value={`${stock.cashSecuritiesToMarketCapPct.toFixed(1)}%`} />
            <Stat label="Illiq assets" value={`${stock.illiquidAssetsToTotalAssetsPct.toFixed(0)}%`} />
          </div>
          <div className="mt-5">
            <WatchlistButton ticker={stock.ticker} />
          </div>
        </div>

        {/* VERDICT CARD — the visual focal point */}
        <div className="col-span-12 lg:col-span-5">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
              Under {scholar.short}
            </div>
            <div
              className={`mt-3 text-[56px] font-bold leading-none ${verdictColor}`}
              style={{ fontFamily: "Georgia, serif" }}
            >
              {VERDICT_LABEL[result!.verdict]}
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-gray-600">
              {result!.sectorPasses
                ? result!.ratioChecks.find((c) => !c.passes)?.explanation ?? "All ratio thresholds pass under this methodology."
                : result!.sectorReason}
            </p>
            <Link
              href="/methodology"
              className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-navy-700 hover:text-navy-900"
            >
              See methodology <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* EVIDENCE TABLE — centerpiece, all 5 scholars at once */}
      <section>
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Multi-scholar view
        </div>
        <h2
          className="mt-2 text-[24px] font-bold leading-tight text-gray-900 sm:text-[28px]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {scholarsAgree ? "All five scholars agree." : "The scholars disagree."}
        </h2>
        <p className="mt-1 max-w-xl text-sm text-gray-600">
          {scholarsAgree
            ? `Every mainstream methodology reaches the same verdict on ${stock.ticker}.`
            : `Same stock, different rulebooks. Click any row to make it your active scholar.`}
        </p>

        <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                <th className="px-5 py-3">Scholar</th>
                <th className="px-5 py-3">Verdict</th>
                <th className="px-5 py-3 text-right">Deciding metric</th>
              </tr>
            </thead>
            <tbody>
              {allVerdicts.map(({ scholar: p, verdict, decidingMetric }, idx) => {
                const verdictTone =
                  verdict === "pass" ? "bg-emerald-50 text-emerald-700" :
                  verdict === "fail" ? "bg-rose-50 text-rose-700" :
                  "bg-amber-50 text-amber-700";
                const isCurrent = p.id === scholarId;
                return (
                  <tr
                    key={p.id}
                    onClick={() => setScholarId(p.id)}
                    className={`cursor-pointer transition hover:bg-gray-50 ${idx !== allVerdicts.length - 1 ? "border-b border-gray-100" : ""} ${isCurrent ? "bg-navy-50/40" : ""}`}
                  >
                    <td className="px-5 py-4">
                      <div className="text-sm font-semibold text-gray-900">{p.short}</div>
                      {isCurrent && (
                        <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-navy-700">
                          Your scholar
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${verdictTone}`}>
                        {VERDICT_LABEL[verdict]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="font-mono text-xs text-gray-600">{decidingMetric}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* FULL COMPLIANCE BREAKDOWN — kept from original */}
      <section>
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Full breakdown
        </div>
        <h2
          className="mt-2 text-[22px] font-bold leading-tight text-gray-900 sm:text-[26px]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Every check, every threshold
        </h2>
        <div className="mt-6">
          <ComplianceCard stock={stock} result={result!} />
        </div>
      </section>

      {/* COMPANY STATS */}
      <section>
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Company snapshot
        </div>
        <div className="mt-4">
          <StockStats stock={stock} />
        </div>
      </section>

      {/* HALAL ALTERNATIVES — only when fail */}
      {result!.verdict === "fail" && (
        <section>
          <HalalAlternatives failedStock={stock} scholar={scholar} />
        </section>
      )}

      {/* FOOTER ACTIONS */}
      <section className="border-t border-gray-200 pt-8">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href={`/vs?a=${stock.ticker}&b=MSFT`}
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:text-gray-900"
          >
            Compare side-by-side <ArrowRight size={14} />
          </Link>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:text-gray-900"
          >
            <BarChart3 size={14} /> Add to portfolio score
          </Link>
          <Link
            href="/lists"
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:text-gray-900"
          >
            Curated lists <ArrowRight size={14} />
          </Link>
          <Link
            href={`/methodology`}
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:text-gray-900"
          >
            How verdicts are computed <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-[11px] uppercase tracking-[0.14em] text-gray-500">{label}</span>
      <span className="font-mono text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
}

