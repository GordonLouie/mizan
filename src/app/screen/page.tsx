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
  debtToMarketCap: 6.5,
  interestIncomeRatio: 1.2,
  halalRevenueRatio: 2.8,
  tangibleAssets: 12,
  illiquidAssets: 18,
};

const SCHOLAR_VERDICTS = [
  {
    id: "aaoifi",
    name: "AAOIFI",
    methodology: "Industry-standard shariah screening",
    verdict: "halal" as const,
    decidingMetric: "Debt / market cap: 6.5% (cap 30%)",
    ratios: [
      { name: "Debt ratio", value: "6.5%", threshold: "< 30%", pass: true },
      { name: "Interest income", value: "1.2%", threshold: "< 5%", pass: true },
      { name: "Haram revenue", value: "2.8%", threshold: "< 5%", pass: true },
    ],
  },
  {
    id: "mufti-taqi",
    name: "Mufti Taqi Usmani",
    methodology: "Tangible-asset floor + stricter thresholds",
    verdict: "not-halal" as const,
    decidingMetric: "Tangible assets: 12% (floor 20%)",
    ratios: [
      { name: "Debt ratio", value: "6.5%", threshold: "< 30%", pass: true },
      { name: "Tangible assets", value: "12%", threshold: "> 20%", pass: false },
      { name: "Haram revenue", value: "2.8%", threshold: "< 5%", pass: true },
    ],
  },
  {
    id: "djim",
    name: "DJIM",
    methodology: "Dow Jones Islamic Market Index criteria",
    verdict: "halal" as const,
    decidingMetric: "All ratios within threshold",
    ratios: [
      { name: "Debt ratio", value: "6.5%", threshold: "< 33%", pass: true },
      { name: "Cash + securities", value: "18%", threshold: "< 33%", pass: true },
      { name: "Receivables", value: "22%", threshold: "< 33%", pass: true },
    ],
  },
  {
    id: "jafari",
    name: "Ja'fari",
    methodology: "Shia jurisprudence interpretation",
    verdict: "halal" as const,
    decidingMetric: "Debt ratio: 6.5% (cap 30%)",
    ratios: [
      { name: "Debt ratio", value: "6.5%", threshold: "< 30%", pass: true },
      { name: "Interest income", value: "1.2%", threshold: "< 5%", pass: true },
      { name: "Haram revenue", value: "2.8%", threshold: "< 5%", pass: true },
    ],
  },
  {
    id: "strict",
    name: "Strict",
    methodology: "Conservative interpretation across schools",
    verdict: "doubtful" as const,
    decidingMetric: "Illiquid assets: 18% (floor 20%)",
    ratios: [
      { name: "Debt ratio", value: "6.5%", threshold: "< 25%", pass: true },
      { name: "Illiquid assets", value: "18%", threshold: "> 20%", pass: false },
      { name: "Haram revenue", value: "2.8%", threshold: "< 3%", pass: true },
    ],
  },
  {
    id: "custom",
    name: "Custom",
    methodology: "Your configured thresholds",
    verdict: "halal" as const,
    decidingMetric: "All custom thresholds pass",
    ratios: [
      { name: "Debt ratio", value: "6.5%", threshold: "< 30%", pass: true },
      { name: "Interest income", value: "1.2%", threshold: "< 5%", pass: true },
      { name: "Haram revenue", value: "2.8%", threshold: "< 5%", pass: true },
    ],
  },
];

export default function ScreenPage() {
  const [ticker, setTicker] = useState("AMZN");
  const [selectedScholar, setSelectedScholar] = useState("mufti-taqi");

  const currentScholar = SCHOLAR_VERDICTS.find((s) => s.id === selectedScholar) || SCHOLAR_VERDICTS[1];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. STICKY TOP BAR */}
      <div className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
          {/* Ticker search input */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              className="h-9 w-48 rounded border border-gray-300 bg-white pl-9 pr-3 font-mono text-sm text-gray-900 placeholder:text-gray-400 focus:border-navy-700 focus:outline-none focus:ring-1 focus:ring-navy-700"
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
                    ? "bg-navy-800 text-white"
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
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* 2. HERO ROW */}
        <div className="grid grid-cols-12 gap-8">
          {/* LEFT: Company info */}
          <div className="col-span-12 lg:col-span-8">
            <h1
              className="text-[32px] font-bold leading-tight text-gray-900"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {AMZN.name}
            </h1>
            <p className="mt-1.5 text-sm text-gray-500">
              {AMZN.ticker} · {AMZN.exchange} · {AMZN.sector}
            </p>

            {/* 4-stat row */}
            <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
              <Stat label="Market cap" value={AMZN.marketCap} />
              <Stat label="Price" value={AMZN.price} />
              <Stat label="P/E" value={AMZN.pe} />
              <Stat label="Sector" value={AMZN.subSector} />
            </div>
          </div>

          {/* RIGHT: Verdict card */}
          <div className="col-span-12 lg:col-span-4">
            <div className="rounded border border-gray-200 bg-white p-6">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                Under {currentScholar.name}
              </div>
              <div
                className={`mt-3 text-[48px] font-bold leading-none ${
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

              {/* 3 ratio rows */}
              <div className="mt-6 space-y-3">
                {currentScholar.ratios.map((r) => (
                  <div key={r.name} className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">{r.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-gray-900">{r.value}</span>
                      <span className="text-gray-400">/</span>
                      <span className="font-mono text-gray-500">{r.threshold}</span>
                      <span
                        className={`h-2 w-2 rounded-full ${r.pass ? "bg-emerald-500" : "bg-rose-500"}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3. EVIDENCE TABLE */}
        <div className="mt-12">
          <h2
            className="text-lg font-bold text-gray-900"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Six scholars, six verdicts
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            The same stock screened under different methodologies.
          </p>

          <div className="mt-6 rounded border border-gray-200 bg-white">
            {SCHOLAR_VERDICTS.map((scholar, idx) => (
              <div
                key={scholar.id}
                className={`flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between ${
                  idx !== SCHOLAR_VERDICTS.length - 1 ? "border-b border-gray-100" : ""
                } ${selectedScholar === scholar.id ? "bg-navy-50/30" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div className="min-w-[140px]">
                    <span className="text-sm font-semibold text-gray-900">{scholar.name}</span>
                  </div>
                  <Link
                    href="/methodology"
                    className="hidden items-center gap-1 text-xs text-gray-400 hover:text-navy-700 sm:flex"
                  >
                    methodology <ExternalLink size={10} />
                  </Link>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-gray-500">{scholar.decidingMetric}</span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
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
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. WHY THE VERDICTS DIFFER */}
        <div className="mx-auto mt-12 max-w-3xl border-t border-gray-200 pt-8">
          <h3
            className="text-base font-bold text-gray-900"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Why the verdicts differ
          </h3>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-gray-600">
            <p>
              AAOIFI&apos;s standard screens use <strong>market capitalization</strong> as the
              denominator for debt ratios. Amazon&apos;s debt-to-market-cap ratio of 6.5% falls
              comfortably below the 30% threshold, resulting in a &ldquo;Halal&rdquo; verdict.
              This is the methodology used by most consumer halal investing apps.
            </p>
            <p>
              Mufti Taqi Usmani&apos;s framework includes an additional
              <strong> tangible-asset floor</strong>: the company must hold at least 20% of its
              assets in illiquid, tangible form (property, plant, equipment, inventory). Amazon,
              as a capital-light tech retailer, holds only 12% — below this threshold. This
              disqualifies the stock under his methodology, even though all other ratios pass.
            </p>
          </div>
        </div>

        {/* 5. PURIFICATION ESTIMATE */}
        <div className="mx-auto mt-10 max-w-3xl rounded border border-gray-200 bg-white px-6 py-4">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">Purification estimate:</span> If you
            held 100 shares of AMZN this year, your estimated purification obligation is{" "}
            <span className="font-mono font-semibold text-navy-800">$52.14</span>.{" "}
            <Link href="/purification" className="text-navy-700 underline hover:text-navy-900">
              Calculate yours →
            </Link>
          </p>
        </div>

        {/* 6. FOOTER ACTIONS */}
        <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-4 border-t border-gray-200 pt-8">
          <Link
            href={`/vs?a=AMZN&b=`}
            className="inline-flex items-center gap-1.5 rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:text-gray-900"
          >
            Compare AMZN with another stock <ArrowRight size={14} />
          </Link>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:text-gray-900"
          >
            <Bookmark size={14} />
            Save to watchlist
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:text-gray-900"
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
