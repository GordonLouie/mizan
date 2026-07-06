"use client";

/**
 * /baskets — "look-through" Shariah screening for ETFs & REITs.
 *
 * A fund is only as halal as what it holds. Individual-stock screening answers
 * "is THIS company compliant?"; this page answers the natural next question:
 * "is this FUND compliant, given everything inside it?" — by re-running the same
 * screening engine over each declared holding under your chosen scholar, then
 * rolling it up by weight.
 *
 * This is a REFERENCE + education surface with illustrative sample holdings.
 * It is deliberately NOT a fatwa, and it does not modify the stock engine.
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ScanSearch,
  Layers,
  Building2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
} from "lucide-react";
import ScholarPicker from "@/components/ScholarPicker";
import { SCHOLAR_PROFILES, getScholar } from "@/lib/scholars";
import {
  screenBasket,
  BASKET_VERDICT_META,
  type Basket,
} from "@/lib/basketScreen";
import basketsJson from "@/data/baskets.json";

const BASKETS = basketsJson as Basket[];

const TONE_CLASSES: Record<
  "pass" | "warn" | "fail" | "muted",
  { badge: string; bar: string; ring: string }
> = {
  pass: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    bar: "bg-emerald-500",
    ring: "border-emerald-200",
  },
  warn: {
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    bar: "bg-amber-500",
    ring: "border-amber-200",
  },
  fail: {
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    bar: "bg-rose-500",
    ring: "border-rose-200",
  },
  muted: {
    badge: "bg-gray-100 text-gray-600 border-gray-200",
    bar: "bg-gray-400",
    ring: "border-gray-200",
  },
};

function pct(n: number): string {
  return `${Math.round(n)}%`;
}

export default function BasketsPage() {
  const [scholarId, setScholarId] = useState("aaoifi");
  const [basketTicker, setBasketTicker] = useState(BASKETS[0].ticker);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem("mizan.scholarId");
      if (s && SCHOLAR_PROFILES.some((p) => p.id === s)) setScholarId(s);
    } catch {}
    setHydrated(true);
  }, []);

  const scholar = useMemo(() => {
    try {
      return getScholar(scholarId);
    } catch {
      return getScholar("aaoifi");
    }
  }, [scholarId]);

  const basket = useMemo(
    () => BASKETS.find((b) => b.ticker === basketTicker) ?? BASKETS[0],
    [basketTicker],
  );

  const result = useMemo(
    () => screenBasket(basket, scholar),
    [basket, scholar],
  );

  const meta = BASKET_VERDICT_META[result.overall];
  const tone = TONE_CLASSES[meta.tone];

  return (
    <div className="pb-20">
      {/* HEADER */}
      <header className="pt-6">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Look-through screening · ETFs &amp; REITs
        </div>
        <h1
          className="mt-3 text-[36px] font-bold leading-[1.05] text-gray-900 sm:text-[46px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          A fund is only as halal as what it holds.
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-gray-600">
          Screening a single stock answers &ldquo;is this company compliant?&rdquo;
          A fund needs the next question: &ldquo;given everything inside it, how
          much of it is?&rdquo; HalalGauge re-runs the same screen over each
          holding under your scholar and rolls it up by weight.
        </p>
      </header>

      {/* DISCLAIMER — illustrative data + not a fatwa. */}
      <div className="mt-5 rounded-xl border border-gold-200 bg-gold-50/60 px-4 py-3">
        <p className="text-[12.5px] leading-relaxed text-gray-700">
          <span className="font-semibold text-gray-900">
            Illustrative sample data — not a fatwa.
          </span>{" "}
          The holdings below are a small, representative sample of each fund&apos;s
          top positions for demonstration, not its live, complete book. Real funds
          hold hundreds of names that rebalance constantly. HalalGauge has no
          credentialed scholar on staff; this is education showing where mainstream
          screening standards generally land, not a religious ruling. Always verify
          a fund&apos;s current holdings and consult a qualified scholar.
        </p>
      </div>

      {/* CONTROLS: fund picker + scholar picker */}
      <section className="mt-8 grid gap-4 lg:grid-cols-[1fr_320px] lg:items-start">
        <div>
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
            Pick a fund
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {BASKETS.map((b) => {
              const active = b.ticker === basketTicker;
              const Icon = b.kind === "reit" ? Building2 : Layers;
              return (
                <button
                  key={b.ticker}
                  type="button"
                  onClick={() => setBasketTicker(b.ticker)}
                  aria-pressed={active}
                  className={
                    "flex flex-col rounded-lg border p-3 text-left transition " +
                    (active
                      ? "border-navy-700 bg-navy-50/40 ring-1 ring-navy-100"
                      : "border-gray-200 bg-white hover:border-navy-300 hover:bg-gray-50")
                  }
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-[13px] font-bold text-gray-900">
                      <Icon size={13} className="text-navy-700" />
                      {b.ticker}
                    </span>
                    <span
                      className={
                        "rounded-full border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide " +
                        (b.shariahBranded
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-gray-200 bg-gray-50 text-gray-500")
                      }
                    >
                      {b.shariahBranded ? "Halal-branded" : "Conventional"}
                    </span>
                  </div>
                  <div className="mt-1 text-[12px] font-medium leading-snug text-gray-700">
                    {b.category}
                  </div>
                  <div className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-gray-500">
                    {b.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
            Screening under
          </div>
          {hydrated && (
            <ScholarPicker value={scholarId} onChange={setScholarId} />
          )}
          <p className="mt-2 text-[11px] leading-relaxed text-gray-500">
            The same standard as the stock screen. Change it and every holding
            re-screens instantly.
          </p>
        </div>
      </section>

      {/* VERDICT SUMMARY */}
      <section className={"mt-8 rounded-2xl border bg-white p-5 sm:p-6 " + tone.ring}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
              {basket.ticker} · look-through under {result.scholarLabel}
            </div>
            <h2
              className="mt-1 text-[24px] font-bold leading-tight text-gray-900 sm:text-[28px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {basket.name}
            </h2>
            <p className="mt-1.5 max-w-xl text-[13px] leading-relaxed text-gray-600">
              {basket.blurb}
            </p>
          </div>
          <span
            className={
              "shrink-0 rounded-full border px-3 py-1.5 text-[12px] font-semibold " +
              tone.badge
            }
          >
            {meta.label}
          </span>
        </div>

        {/* KEY METRIC: % of weight compliant */}
        <div className="mt-6 grid gap-5 sm:grid-cols-[1fr_1fr]">
          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                % of sampled weight compliant
              </span>
              <span
                className="text-[26px] font-bold tabular-nums text-gray-900"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {pct(result.weightPassPct)}
              </span>
            </div>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className={"h-full rounded-full " + tone.bar}
                style={{ width: `${Math.min(100, result.weightPassPct)}%` }}
              />
            </div>
            <p className="mt-2 text-[11.5px] leading-relaxed text-gray-500">
              {meta.blurb} Of the weight we can actually see (
              {pct(result.coveredWeightPct)} of disclosed), this share passes{" "}
              {result.scholarLabel}.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Stat
              label="Holdings pass"
              value={`${result.passingCovered}/${result.coveredHoldings}`}
              sub={`${pct(result.countPassPct)} of covered`}
            />
            <Stat
              label="Failing weight"
              value={pct(
                Math.max(0, result.coveredWeightPct - (result.weightPassPct / 100) * result.coveredWeightPct),
              )}
              sub="of disclosed"
              tone="fail"
            />
            <Stat
              label="Not covered"
              value={`${result.notCoveredHoldings}`}
              sub={`${pct(result.notCoveredWeightPct)} of weight`}
              tone="muted"
            />
          </div>
        </div>

        {/* REIT leverage callout */}
        {basket.kind === "reit" && result.reitDebtToMarketCapPct != null && (
          <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50/60 px-3.5 py-3">
            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-600" />
            <div className="text-[12.5px] leading-relaxed text-gray-700">
              <span className="font-semibold text-gray-900">
                Interest-bearing debt: {result.reitDebtToMarketCapPct}% of market cap.
              </span>{" "}
              For a REIT this is the number that usually decides the verdict —
              leverage is riba (interest) exposure. Your scholar&apos;s debt cap is{" "}
              {scholar.maxDebtToMarketCapPct}% of market cap, so this{" "}
              {result.reitDebtToMarketCapPct <= scholar.maxDebtToMarketCapPct
                ? "sits within"
                : "exceeds"}{" "}
              the limit.
            </div>
          </div>
        )}

        {/* Coverage honesty note */}
        {result.notCoveredHoldings > 0 && (
          <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-3">
            <Info size={15} className="mt-0.5 shrink-0 text-gray-500" />
            <div className="text-[12px] leading-relaxed text-gray-600">
              We could screen {result.coveredHoldings} of {result.totalHoldings}{" "}
              sampled holdings. The rest aren&apos;t in our dataset, so they&apos;re
              marked <em>not covered</em> and left out of the pass math rather than
              assumed compliant. Read the compliant figure as a ceiling.
            </div>
          </div>
        )}
      </section>

      {/* SCHOLAR NOTE */}
      <section className="mt-6 rounded-xl border border-navy-200 bg-navy-50/50 p-5">
        <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
          Where scholars generally land · {result.scholarLabel}
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-gray-700">
          {result.scholarNote}
        </p>
        <p className="mt-2 text-[11px] leading-relaxed text-gray-500">
          Source for thresholds: {result.scholarSourceLabel}. This is educational,
          not a fatwa.
        </p>
      </section>

      {/* FAILING HOLDINGS */}
      {result.failing.length > 0 && (
        <section className="mt-8">
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
            What drags it down
          </div>
          <h3
            className="mt-2 text-[20px] font-bold leading-tight text-gray-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Failing &amp; borderline holdings
          </h3>
          <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-gray-600">
            The specific positions that don&apos;t pass {result.scholarLabel},
            heaviest first, each with the deciding reason in plain English.
          </p>
          <div className="mt-4 space-y-2">
            {result.failing.map((r) => {
              const isBorderline =
                r.result && r.result.dataReliable && r.result.verdict === "borderline";
              return (
                <div
                  key={r.ticker}
                  className={
                    "flex items-start gap-3 rounded-lg border bg-white px-3.5 py-3 " +
                    (isBorderline ? "border-amber-200" : "border-rose-200")
                  }
                >
                  {isBorderline ? (
                    <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-600" />
                  ) : (
                    <XCircle size={16} className="mt-0.5 shrink-0 text-rose-500" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="text-[13px] font-bold text-gray-900">
                        {r.ticker}
                      </span>
                      <span className="truncate text-[12px] text-gray-600">
                        {r.name}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[12px] leading-relaxed text-gray-600">
                      {r.failReason}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-[12px] tabular-nums text-gray-500">
                    {r.weightShare.toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* FULL HOLDINGS TABLE */}
      <section className="mt-10">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Every sampled holding
        </div>
        <h3
          className="mt-2 text-[20px] font-bold leading-tight text-gray-900"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Line-by-line look-through
        </h3>
        <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full min-w-[620px] border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                  Holding
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                  Weight
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                  Verdict
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                  Note
                </th>
              </tr>
            </thead>
            <tbody>
              {result.rows.map((r) => {
                const v =
                  !r.covered
                    ? "uncovered"
                    : r.result && !r.result.dataReliable
                      ? "review"
                      : r.result?.verdict ?? "uncovered";
                return (
                  <tr
                    key={r.ticker}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="px-4 py-3">
                      <div className="text-[13px] font-semibold text-gray-900">
                        {r.ticker}
                      </div>
                      <div className="text-[11px] text-gray-500">{r.name}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-[12px] tabular-nums text-gray-700">
                      {r.weightShare.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3">
                      <VerdictPill v={v} />
                    </td>
                    <td className="px-4 py-3 text-[12px] leading-relaxed text-gray-600">
                      {r.covered
                        ? r.failReason || "Passes this scholar's screen."
                        : "Not in our dataset — excluded from the pass math."}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-gray-500">
          Weights are normalised against the disclosed sample total, which is why
          they may not sum to 100%. Each verdict is computed by the same engine
          the single-stock screen uses.
        </p>
      </section>

      {/* NEXT STEPS */}
      <section className="mt-12 flex flex-col gap-3 rounded-2xl border border-navy-200 bg-navy-50/50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div>
          <h3
            className="text-[20px] font-bold leading-tight text-gray-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Want the individual verdict?
          </h3>
          <p className="mt-1.5 max-w-lg text-[13px] leading-relaxed text-gray-600">
            Every holding above is a real screen you can open on its own — see the
            full ratio breakdown and purification note for any one name.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2.5">
          <Link
            href="/screen"
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-navy-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-700"
          >
            <ScanSearch size={15} /> Screen a stock
          </Link>
          <Link
            href="/assets"
            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:text-gray-900"
          >
            See the halal asset map <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: string;
  sub: string;
  tone?: "default" | "fail" | "muted";
}) {
  const valueColor =
    tone === "fail"
      ? "text-rose-600"
      : tone === "muted"
        ? "text-gray-500"
        : "text-gray-900";
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
      <div className="text-[9.5px] font-semibold uppercase tracking-[0.1em] text-gray-500">
        {label}
      </div>
      <div
        className={"mt-1 text-[18px] font-bold tabular-nums " + valueColor}
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
      </div>
      <div className="text-[10px] text-gray-500">{sub}</div>
    </div>
  );
}

function VerdictPill({ v }: { v: string }) {
  const map: Record<
    string,
    { label: string; cls: string; icon: React.ReactNode }
  > = {
    pass: {
      label: "Pass",
      cls: "border-emerald-200 bg-emerald-50 text-emerald-700",
      icon: <CheckCircle2 size={11} />,
    },
    fail: {
      label: "Fail",
      cls: "border-rose-200 bg-rose-50 text-rose-700",
      icon: <XCircle size={11} />,
    },
    borderline: {
      label: "Borderline",
      cls: "border-amber-200 bg-amber-50 text-amber-700",
      icon: <AlertTriangle size={11} />,
    },
    review: {
      label: "Under review",
      cls: "border-amber-200 bg-amber-50 text-amber-700",
      icon: <AlertTriangle size={11} />,
    },
    uncovered: {
      label: "Not covered",
      cls: "border-gray-200 bg-gray-100 text-gray-500",
      icon: <Info size={11} />,
    },
  };
  const m = map[v] ?? map.uncovered;
  return (
    <span
      className={
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold " +
        m.cls
      }
    >
      {m.icon}
      {m.label}
    </span>
  );
}
