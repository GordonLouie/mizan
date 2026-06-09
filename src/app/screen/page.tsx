"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { findStock, listStocks } from "@/lib/data";
import { getScholar, SCHOLAR_PROFILES } from "@/lib/scholars";
import { loadCustomProfile } from "@/lib/customProfile";
import { screenStock } from "@/lib/screen";
import ScholarPicker from "@/components/ScholarPicker";
import HalalChecks from "@/components/HalalChecks";
import VerdictTimeline from "@/components/VerdictTimeline";
import TickerSearch from "@/components/TickerSearch";
import FeaturedTickers from "@/components/FeaturedTickers";
import DemoBanner from "@/components/DemoBanner";
import HalalAlternatives from "@/components/HalalAlternatives";
import WatchlistButton from "@/components/WatchlistButton";
import StockStats from "@/components/StockStats";
import { Card } from "@/components/ui";
import CompanyLogo from "@/components/CompanyLogo";
import { VERDICT_LABEL } from "@/lib/verdictLabels";
import { fmtMarketCap } from "@/lib/lists";
import { ArrowRight, BarChart3, CheckCircle2, XCircle, AlertCircle, Share2 } from "lucide-react";

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

  // Vote tally across scholars — used in the "3 of 5 say halal" summary.
  const verdictCounts = useMemo(() => {
    const counts = { pass: 0, fail: 0, borderline: 0 };
    for (const v of allVerdicts) counts[v.verdict]++;
    return counts;
  }, [allVerdicts]);

  // ─── EMPTY STATE: no ticker selected ──────────────────────────────────────
  if (!stock) {
    const currentScholar = SCHOLAR_PROFILES.find((p) => p.id === scholarId);
    return (
      <div className="space-y-8 pb-16">
        <div className="pt-2">
          <h1
            className="text-[32px] font-bold leading-tight text-gray-900 sm:text-[40px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Is your stock halal?
          </h1>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-gray-600">
            Set your scholar, then search any ticker. See it under every mainstream
            methodology — including Mufti Taqi Usmani&apos;s illiquid-asset rule
            that no other halal app implements.
          </p>
        </div>

        {/* PRIMARY DECISION ROW — scholar picker FIRST, then search.
            Direct response to user feedback: "the first thing they would do
            is pick their scholar then make their decision." Scholar isn't an
            adjustment — it's the lens through which every verdict is read.
            Mirrors the stock-selected view's toolbar so the page reads
            consistently across states. */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,260px)_1fr]">
          <div className="sm:min-w-[260px]">
            <ScholarPicker value={scholarId} onChange={setScholarId} />
          </div>
          <TickerSearch value={ticker} onChange={(t) => setTicker(t)} autoFocus={!ticker} />
        </div>

        {/* Current-scholar pointer — small visible "you are here" anchor.
            Especially valuable for users who land via /screen?ticker=X from
            a friend's share: lets them notice + adjust their lens before
            interpreting the verdict. */}
        {currentScholar && !ticker && (
          <div className="-mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-gray-500">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>
              Viewing as{" "}
              <strong className="text-navy-800">{currentScholar.short}</strong>.
            </span>
            <span className="text-gray-300">·</span>
            <Link
              href="/learn"
              className="text-navy-700 underline hover:text-navy-900"
            >
              Don&apos;t know which scholar you follow?
            </Link>
          </div>
        )}

        {!ticker && <FeaturedTickers onPick={(t) => setTicker(t)} />}

        {/* Universe CTA — discoverability fix (Toby's feedback 2026-06-06):
            users want to filter a LIST of stocks by scholar, not click into
            each. /universe does this — make sure they find it. */}
        {!ticker && (
          <div className="rounded-lg border border-gray-200 bg-white p-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-700">
                Rather browse than search?
              </div>
              <p className="mt-1 text-[13px] text-gray-600">
                See every stock Mizan covers, filtered by your scholar &amp; verdict.
              </p>
            </div>
            <Link
              href="/universe"
              className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-navy-800 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-navy-700 sm:mt-0 sm:flex-shrink-0"
            >
              Browse all stocks <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {!ticker && <DemoBanner />}

        {ticker && !stock && (
          <TickerNotFound
            ticker={ticker}
            covered={stocks.length}
            onPick={(t) => setTicker(t)}
          />
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
          <div className="flex items-center gap-3">
            <CompanyLogo ticker={stock.ticker} size={42} />
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
              {stock.ticker} · {stock.sector}
            </div>
          </div>
          <h1
            className="mt-3 text-[32px] font-bold leading-[1.1] text-gray-900 sm:text-[40px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {stock.name}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <Stat label="Market cap" value={fmtMarketCap(stock.marketCapUsd)} />
            <Stat label="Debt/cap" value={`${stock.debtToMarketCapPct.toFixed(1)}%`} />
            <Stat label="Cash+sec/cap" value={`${stock.cashSecuritiesToMarketCapPct.toFixed(1)}%`} />
            <Stat label="Illiq assets" value={`${stock.illiquidAssetsToTotalAssetsPct.toFixed(0)}%`} />
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <WatchlistButton ticker={stock.ticker} />
            <ShareVerdictButton
              ticker={stock.ticker}
              name={stock.name}
              scholarShort={scholar.short}
              verdictLabel={VERDICT_LABEL[result!.verdict]}
            />
          </div>
        </div>

        {/* VERDICT CARD — the visual focal point */}
        <div className="col-span-12 lg:col-span-5">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
              Under {scholar.short}
            </div>
            <div className="mt-3 flex items-center gap-3">
              <VerdictIcon verdict={result!.verdict} />
              <div
                className={`text-[56px] font-bold leading-none ${verdictColor}`}
                style={{ fontFamily: "var(--font-display)" }}
              >
                {VERDICT_LABEL[result!.verdict]}
              </div>
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
          style={{ fontFamily: "var(--font-display)" }}
        >
          {scholarsAgree ? "All five scholars agree." : "The scholars disagree."}
        </h2>
        <p className="mt-1 max-w-xl text-sm text-gray-600">
          {scholarsAgree
            ? `Every mainstream methodology reaches the same verdict on ${stock.ticker}.`
            : `Same stock, different rulebooks. Click any row to make it your active scholar.`}
        </p>

        {/* Vote tally — fast scan: "3 of 5 say halal." */}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px]">
          {verdictCounts.pass > 0 && (
            <span className="inline-flex items-center gap-1.5 text-emerald-700">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="font-semibold tabular-nums">{verdictCounts.pass}</span>
              <span className="text-gray-600">
                of {allVerdicts.length} say halal
              </span>
            </span>
          )}
          {verdictCounts.fail > 0 && (
            <span className="inline-flex items-center gap-1.5 text-rose-700">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-rose-500" />
              <span className="font-semibold tabular-nums">{verdictCounts.fail}</span>
              <span className="text-gray-600">say not halal</span>
            </span>
          )}
          {verdictCounts.borderline > 0 && (
            <span className="inline-flex items-center gap-1.5 text-amber-700">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />
              <span className="font-semibold tabular-nums">{verdictCounts.borderline}</span>
              <span className="text-gray-600">borderline</span>
            </span>
          )}
        </div>

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

      {/* HALAL ALTERNATIVES — surfaced HIGH on fail. Miqdad: when a stock is
          ruled out, the next question is always "what should I buy instead?"
          Was previously buried below the company stats. */}
      {result!.verdict === "fail" && (
        <section>
          <HalalAlternatives failedStock={stock} scholar={scholar} />
        </section>
      )}

      {/* VERDICT TIMELINE — 8-quarter track record across active scholar.
          Direct response to Saifuddin Abbas: "track that over time as well bc
          balance sheet may look v diff YoY." Surfaces next earnings date. */}
      <VerdictTimeline stock={stock} scholar={scholar} />

      {/* HALAL CHECKS — collapsed cards by default, expand for math.
          Lean view. Full balance sheet lives at /balance-sheet/[ticker]. */}
      <HalalChecks stock={stock} result={result!} scholar={scholar} />

      {/* COMPANY STATS */}
      <section>
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Company snapshot
        </div>
        <div className="mt-4">
          <StockStats stock={stock} />
        </div>
      </section>

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

/**
 * Verdict icon for the hero card — instant visual cue before the user reads
 * the prose explanation. Matches the verdict color used for the wordmark.
 */
function VerdictIcon({ verdict }: { verdict: "pass" | "fail" | "borderline" }) {
  if (verdict === "pass") {
    return <CheckCircle2 size={44} className="shrink-0 text-emerald-600" strokeWidth={1.5} />;
  }
  if (verdict === "fail") {
    return <XCircle size={44} className="shrink-0 text-rose-600" strokeWidth={1.5} />;
  }
  return <AlertCircle size={44} className="shrink-0 text-amber-600" strokeWidth={1.5} />;
}

/**
 * TickerNotFound — replaces the old "isn't in our sample dataset" dead end.
 *
 * Three jobs in order of importance:
 *   1. Acknowledge honestly (you don't have it)
 *   2. Keep them engaged (show what you DO have, with one-tap suggestions)
 *   3. Capture intent (mailto request so we can track demand + reply manually)
 *
 * This single change turns the highest-bounce moment on the site into
 * an engagement loop. Direct response to Ibrahim Malik's "more stocks is
 * the most important" — until coverage catches up, mitigate the gap.
 */
function TickerNotFound({
  ticker,
  covered,
  onPick,
}: {
  ticker: string;
  covered: number;
  onPick: (ticker: string) => void;
}) {
  const mailtoSubject = encodeURIComponent(`Mizan ticker request: ${ticker}`);
  const mailtoBody = encodeURIComponent(
    `Hi Gordon,\n\nI tried to screen ${ticker} on Mizan but it's not in the universe yet. Could you add it?\n\nThanks.`,
  );
  const mailtoHref = `mailto:hello@mizaninvesting.com?subject=${mailtoSubject}&body=${mailtoBody}`;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-5">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-800">
          Not in the universe yet
        </div>
        <h2
          className="mt-2 text-[20px] font-bold leading-tight text-gray-900"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {ticker} isn&apos;t covered — yet.
        </h2>
        <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-gray-700">
          Mizan covers {covered} tickers today and is expanding weekly toward
          the full Russell 3000 + major international names. The fastest way
          to get {ticker} prioritised is to ask for it directly.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <a
            href={mailtoHref}
            className="inline-flex items-center gap-1.5 rounded-md bg-navy-800 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-navy-700"
          >
            Request {ticker} <ArrowRight size={13} />
          </a>
          <Link
            href="/universe"
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-4 py-2 text-[13px] font-semibold text-gray-700 transition hover:border-gray-400 hover:text-gray-900"
          >
            Browse what&apos;s covered <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      <div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Or try one of these instead
        </div>
        <div className="mt-4">
          <FeaturedTickers onPick={onPick} />
        </div>
      </div>
    </div>
  );
}

/**
 * ShareVerdictButton — uses navigator.share when available (mobile), copies
 * a pre-formatted message to clipboard on desktop. The shared text is
 * specifically designed to feel like something a Muslim friend would forward:
 * the verdict + scholar + link, no marketing fluff.
 */
function ShareVerdictButton({
  ticker,
  name,
  scholarShort,
  verdictLabel,
}: {
  ticker: string;
  name: string;
  scholarShort: string;
  verdictLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = `https://mizaninvesting.com/screen?ticker=${ticker}`;
    const text = `${ticker} (${name}) under ${scholarShort}: ${verdictLabel}.\nSee all 6 scholars on Mizan: ${url}`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: `${ticker} — ${verdictLabel} under ${scholarShort}`,
          text,
          url,
        });
        return;
      }
    } catch {
      // Fall through to clipboard
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-[13px] font-medium text-gray-700 transition hover:border-gray-400 hover:text-gray-900"
      aria-label="Share verdict"
    >
      <Share2 size={13} />
      {copied ? "Copied" : "Share verdict"}
    </button>
  );
}

