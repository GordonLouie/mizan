"use client";

import Link from "next/link";
import { ArrowRight, Bitcoin, FileText, Columns2 } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────────
   HARDCODED DATA
   ───────────────────────────────────────────────────────────────────────────── */

const TRENDING_MEGACAPS = [
  { ticker: "AAPL", name: "Apple Inc.", marketCap: "$3.1T", price: "$186.20" },
  { ticker: "MSFT", name: "Microsoft", marketCap: "$3.2T", price: "$420.55" },
  { ticker: "GOOGL", name: "Alphabet", marketCap: "$2.1T", price: "$172.30" },
  { ticker: "NVDA", name: "NVIDIA", marketCap: "$3.0T", price: "$124.80" },
];

const SCHOLAR_DISAGREEMENTS = [
  { ticker: "AMZN", name: "Amazon", aaoifi: "pass", muftiTaqi: "fail", strict: "borderline" },
  { ticker: "TSLA", name: "Tesla", aaoifi: "pass", muftiTaqi: "pass", strict: "borderline" },
  { ticker: "JPM", name: "JPMorgan", aaoifi: "fail", muftiTaqi: "fail", strict: "fail" },
  { ticker: "META", name: "Meta", aaoifi: "pass", muftiTaqi: "pass", strict: "pass" },
  { ticker: "BRK.B", name: "Berkshire", aaoifi: "borderline", muftiTaqi: "fail", strict: "fail" },
  { ticker: "V", name: "Visa", aaoifi: "fail", muftiTaqi: "fail", strict: "fail" },
];

const TOP_DIVIDEND = [
  { ticker: "T", name: "AT&T", marketCap: "$122B", price: "$20.45", yield: "6.8%" },
  { ticker: "VZ", name: "Verizon", marketCap: "$176B", price: "$41.80", yield: "6.4%" },
  { ticker: "KO", name: "Coca-Cola", marketCap: "$263B", price: "$61.20", yield: "3.1%" },
  { ticker: "CSCO", name: "Cisco", marketCap: "$192B", price: "$47.30", yield: "3.2%" },
];

const SECTOR_PASS_RATES = [
  { sector: "Technology", rate: 78 },
  { sector: "Healthcare", rate: 64 },
  { sector: "Consumer Staples", rate: 52 },
  { sector: "Industrials", rate: 41 },
  { sector: "Energy", rate: 38 },
  { sector: "Financials", rate: 12 },
];

const CROSS_ASSET_TILES = [
  {
    icon: Bitcoin,
    kicker: "Crypto",
    title: "Multi-scholar views",
    body: "BTC, ETH, and the top 20 tokens — assessed under each methodology.",
    href: "/crypto",
    cta: "Explore crypto",
  },
  {
    icon: FileText,
    kicker: "Sukuk",
    title: "Islamic bonds",
    body: "Fixed-income without the riba — primer, ETFs, and how scholars treat them.",
    href: "/sukuk",
    cta: "Browse sukuk",
  },
  {
    icon: Columns2,
    kicker: "Compare",
    title: "Side-by-side",
    body: "Pit any two stocks against each other — ratios, verdicts, and deciding metric.",
    href: "/vs",
    cta: "Compare stocks",
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE COMPONENT
   ───────────────────────────────────────────────────────────────────────────── */

export default function DiscoverPage() {
  return (
    <div className="mx-auto max-w-6xl pb-20">
      {/* 1. PAGE HEADER */}
      <header className="pt-10">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Discover
        </div>
        <h1
          className="mt-3 text-[36px] font-bold leading-[1.1] text-gray-900"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Find your next halal investment
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-gray-600">
          Curated by scholar — re-screened against your selected methodology.
        </p>
      </header>

      {/* 2. TRENDING HALAL MEGA-CAPS */}
      <section className="mt-20">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Trending
        </div>
        <h2
          className="mt-2 text-[26px] font-bold leading-tight text-gray-900"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Halal mega-caps
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {TRENDING_MEGACAPS.map((stock) => (
            <Link
              key={stock.ticker}
              href={`/screen?ticker=${stock.ticker}`}
              className="relative block rounded-none border border-gray-200 bg-white p-5 transition hover:border-gray-400"
            >
              <span className="absolute right-4 top-4 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                Halal
              </span>
              <div className="font-mono text-[13px] font-semibold text-gray-900">
                {stock.ticker}
              </div>
              <div
                className="mt-1 text-[17px] font-bold text-gray-900"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {stock.name}
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="font-mono text-[11px] text-gray-500">
                  {stock.marketCap}
                </span>
                <span className="font-mono text-sm font-semibold text-gray-900">
                  {stock.price}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. WHERE SCHOLARS DISAGREE */}
      <section className="mt-24">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Multi-scholar view
        </div>
        <h2
          className="mt-2 text-[26px] font-bold leading-tight text-gray-900"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Where the scholars split
        </h2>
        <p className="mt-2 max-w-xl text-[14px] text-gray-600">
          Same stock, different rulebooks. The honest complexity most apps hide.
        </p>

        <div className="mt-6 overflow-hidden border border-gray-200 bg-white">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                  Ticker
                </th>
                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                  Company
                </th>
                <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                  AAOIFI
                </th>
                <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                  Mufti Taqi
                </th>
                <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                  Strict
                </th>
              </tr>
            </thead>
            <tbody>
              {SCHOLAR_DISAGREEMENTS.map((row, idx) => (
                <tr
                  key={row.ticker}
                  className={idx !== SCHOLAR_DISAGREEMENTS.length - 1 ? "border-b border-gray-100" : ""}
                >
                  <td className="px-5 py-4">
                    <Link
                      href={`/screen?ticker=${row.ticker}`}
                      className="font-mono text-[13px] font-semibold text-gray-900 hover:text-navy-700"
                    >
                      {row.ticker}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-[14px] text-gray-700">
                    {row.name}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <VerdictPill verdict={row.aaoifi} />
                  </td>
                  <td className="px-5 py-4 text-center">
                    <VerdictPill verdict={row.muftiTaqi} />
                  </td>
                  <td className="px-5 py-4 text-center">
                    <VerdictPill verdict={row.strict} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. TOP DIVIDEND YIELDERS */}
      <section className="mt-24">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Income
        </div>
        <h2
          className="mt-2 text-[26px] font-bold leading-tight text-gray-900"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Top dividend yielders
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {TOP_DIVIDEND.map((stock) => (
            <Link
              key={stock.ticker}
              href={`/screen?ticker=${stock.ticker}`}
              className="block rounded-none border border-gray-200 bg-white p-5 transition hover:border-gray-400"
            >
              <div className="font-mono text-[13px] font-semibold text-gray-900">
                {stock.ticker}
              </div>
              <div
                className="mt-1 text-[17px] font-bold text-gray-900"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {stock.name}
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="font-mono text-[11px] text-gray-500">
                  {stock.marketCap}
                </span>
                <span className="font-mono text-sm text-gray-700">
                  {stock.price}
                </span>
              </div>
              <div className="mt-3 border-t border-gray-100 pt-3">
                <span className="font-mono text-lg font-bold text-gold-600">
                  {stock.yield}
                </span>
                <span className="ml-1 text-[11px] text-gray-500">yield</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. SECTOR PASS-RATE RANKING */}
      <section className="mt-24">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          By sector
        </div>
        <h2
          className="mt-2 text-[26px] font-bold leading-tight text-gray-900"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Pass-rate ranking
        </h2>
        <p className="mt-2 max-w-xl text-[14px] text-gray-600">
          Percentage of stocks passing under your current scholar.
        </p>

        <div className="mt-6 space-y-3">
          {SECTOR_PASS_RATES.map((s) => (
            <div key={s.sector} className="flex items-center gap-4">
              <div className="w-36 shrink-0 text-[14px] font-medium text-gray-800">
                {s.sector}
              </div>
              <div className="relative h-2 flex-1 bg-gray-100">
                <div
                  className="absolute left-0 top-0 h-2 bg-navy-800"
                  style={{ width: `${s.rate}%` }}
                />
              </div>
              <div className="w-12 shrink-0 text-right font-mono text-[13px] font-semibold text-gray-700">
                {s.rate}%
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CROSS-ASSET TILES */}
      <section className="mt-24">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Beyond equities
        </div>
        <h2
          className="mt-2 text-[26px] font-bold leading-tight text-gray-900"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Explore more asset classes
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {CROSS_ASSET_TILES.map((tile) => {
            const Icon = tile.icon;
            return (
              <Link
                key={tile.href}
                href={tile.href}
                className="group block border border-gray-200 bg-white p-6 transition hover:border-gray-400"
              >
                <Icon size={20} className="text-gray-600" strokeWidth={1.5} />
                <div className="mt-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
                  {tile.kicker}
                </div>
                <h3
                  className="mt-2 text-[17px] font-bold text-gray-900"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {tile.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-gray-600">
                  {tile.body}
                </p>
                <div className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-navy-700 group-hover:text-navy-900">
                  {tile.cta} <ArrowRight size={14} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   HELPER COMPONENTS
   ───────────────────────────────────────────────────────────────────────────── */

function VerdictPill({ verdict }: { verdict: "pass" | "fail" | "borderline" }) {
  const label =
    verdict === "pass" ? "Halal" : verdict === "fail" ? "Not halal" : "Doubtful";
  const cls =
    verdict === "pass"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : verdict === "fail"
        ? "border-rose-200 bg-rose-50 text-rose-700"
        : "border-amber-200 bg-amber-50 text-amber-700";

  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${cls}`}
    >
      {label}
    </span>
  );
}
