"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ExternalLink, Bookmark, BarChart3, ArrowRight } from "lucide-react";

const SCHOLARS = [
  { id: "aaoifi", short: "AAOIFI" },
  { id: "mufti-taqi", short: "Mufti Taqi Usmani" },
  { id: "djim", short: "DJIM" },
  { id: "jafari", short: "Ja'fari" },
  { id: "strict", short: "Strict" },
  { id: "custom", short: "Custom" },
];

// Hardcoded AMZN data for standalone preview
const AMZN = {
  ticker: "AMZN",
  name: "Amazon.com, Inc.",
  exchange: "NASDAQ",
  sector: "Consumer Discretionary",
  marketCap: "$1.87T",
  price: "$186.20",
  pe: "42.1",
  subSector: "Retail",
};

const SCHOLAR_VERDICTS = [
  {
    id: "aaoifi",
    name: "AAOIFI",
    verdict: "halal" as const,
    decidingMetric: "Debt / market cap 6.5%",
  },
  {
    id: "mufti-taqi",
    name: "Mufti Taqi Usmani",
    verdict: "not-halal" as const,
    decidingMetric: "Tangible assets 12% < 20%",
  },
  {
    id: "djim",
    name: "DJIM",
    verdict: "halal" as const,
    decidingMetric: "All ratios pass",
  },
  {
    id: "jafari",
    name: "Ja'fari",
    verdict: "halal" as const,
    decidingMetric: "Debt ratio 6.5%",
  },
  {
    id: "strict",
    name: "Strict",
    verdict: "doubtful" as const,
    decidingMetric: "Illiquid assets 18% < 20%",
  },
  {
    id: "custom",
    name: "Custom",
    verdict: "halal" as const,
    decidingMetric: "All thresholds pass",
  },
];

export default function ScreenPage() {
  const [ticker, setTicker] = useState("AMZN");
  const [selectedScholar, setSelectedScholar] = useState("mufti-taqi");

  const currentScholar = SCHOLAR_VERDICTS.find((s) => s.id === selectedScholar) || SCHOLAR_VERDICTS[1];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* STICKY TOP BAR */}
      <div className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
          {/* Ticker search input */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              className="h-9 w-44 rounded border border-gray-300 bg-white pl-9 pr-3 font-mono text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              placeholder="Enter ticker…"
            />
          </div>

          {/* Scholar selector pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {SCHOLARS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedScholar(s.id)}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  selectedScholar === s.id
                    ? "bg-gray-900 text-white"
                    : "border border-gray-300 bg-white text-gray-600 hover:border-gray-400 hover:text-gray-900"
                }`}
              >
                {s.short}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* HERO ROW */}
        <div className="grid grid-cols-12 gap-8">
          {/* LEFT: Company info */}
          <div className="col-span-12 lg:col-span-7">
            <h1
              className="text-3xl font-bold leading-tight text-gray-900"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {AMZN.name}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              {AMZN.ticker} · {AMZN.exchange} · {AMZN.sector}
            </p>

            {/* Stats row */}
            <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
              <Stat label="Market cap" value={AMZN.marketCap} />
              <Stat label="Price" value={AMZN.price} />
              <Stat label="P/E" value={AMZN.pe} />
              <Stat label="Sector" value={AMZN.subSector} />
            </div>
          </div>

          {/* RIGHT: Verdict card - visual focal point */}
          <div className="col-span-12 lg:col-span-5">
            <div className="rounded border border-gray-200 bg-white p-6">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                Under {currentScholar.name}
              </div>
              <div
                className={`mt-3 text-5xl font-bold leading-none ${
                  currentScholar.verdict === "halal"
                    ? "text-emerald-700"
                    : currentScholar.verdict === "not-halal"
                      ? "text-rose-700"
                      : "text-amber-600"
                }`}
                style={{ fontFamily: "Georgia, serif" }}
              >
                {currentScholar.verdict === "halal"
                  ? "Halal"
                  : currentScholar.verdict === "not-halal"
                    ? "Not halal"
                    : "Doubtful"}
              </div>
              <p className="mt-4 font-mono text-xs text-gray-500">
                {currentScholar.decidingMetric}
              </p>
            </div>
          </div>
        </div>

        {/* EVIDENCE TABLE - centerpiece */}
        <div className="mt-14">
          <h2
            className="text-xl font-bold text-gray-900"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Six scholars, six verdicts
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            The same stock screened under different methodologies.
          </p>

          <div className="mt-6 overflow-hidden rounded border border-gray-200 bg-white">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-3">Scholar</th>
                  <th className="px-6 py-3">Verdict</th>
                  <th className="px-6 py-3 text-right">Deciding metric</th>
                </tr>
              </thead>
              <tbody>
                {SCHOLAR_VERDICTS.map((scholar, idx) => (
                  <tr
                    key={scholar.id}
                    className={`${
                      idx !== SCHOLAR_VERDICTS.length - 1 ? "border-b border-gray-100" : ""
                    } ${selectedScholar === scholar.id ? "bg-gray-50" : ""}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-900">{scholar.name}</span>
                        <Link
                          href="/methodology"
                          className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
                        >
                          <ExternalLink size={10} />
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
                          scholar.verdict === "halal"
                            ? "bg-emerald-50 text-emerald-700"
                            : scholar.verdict === "not-halal"
                              ? "bg-rose-50 text-rose-700"
                              : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {scholar.verdict === "halal"
                          ? "Halal"
                          : scholar.verdict === "not-halal"
                            ? "Not halal"
                            : "Doubtful"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-mono text-xs text-gray-500">{scholar.decidingMetric}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* WHY THE VERDICTS DIFFER */}
        <div className="mx-auto mt-14 max-w-3xl border-t border-gray-200 pt-10">
          <h3
            className="text-lg font-bold text-gray-900"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Why the verdicts differ
          </h3>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-gray-600">
            <p>
              AAOIFI&apos;s standard screens use <strong className="text-gray-900">market capitalization</strong> as the
              denominator for debt ratios. Amazon&apos;s debt-to-market-cap ratio of 6.5% falls
              comfortably below the 30% threshold, resulting in a halal verdict.
            </p>
            <p>
              Mufti Taqi Usmani&apos;s framework includes an additional
              <strong className="text-gray-900"> tangible-asset floor</strong>: the company must hold at least 20% of its
              assets in illiquid, tangible form (property, plant, equipment, inventory). Amazon,
              as a capital-light tech retailer, holds only 12% — below this threshold.
            </p>
          </div>
        </div>

        {/* PURIFICATION ESTIMATE */}
        <div className="mx-auto mt-10 max-w-3xl rounded border border-gray-200 bg-white px-6 py-4">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">Purification estimate:</span> If you
            held 100 shares of AMZN this year, your estimated purification obligation is{" "}
            <span className="font-mono font-semibold text-gray-900">$52.14</span>.{" "}
            <Link href="/purification" className="text-gray-600 underline hover:text-gray-900">
              Calculate yours →
            </Link>
          </p>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-4 border-t border-gray-200 pt-10">
          <Link
            href={`/vs?a=AMZN&b=`}
            className="inline-flex items-center gap-1.5 rounded border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-300 hover:text-gray-900"
          >
            Compare AMZN with another stock <ArrowRight size={14} />
          </Link>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-300 hover:text-gray-900"
          >
            <Bookmark size={14} />
            Save to watchlist
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-300 hover:text-gray-900"
          >
            <BarChart3 size={14} />
            Add to portfolio score
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-gray-500">{label}</span>{" "}
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );
}
