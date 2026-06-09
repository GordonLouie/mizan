"use client";

import Link from "next/link";
import { ArrowRight, TrendingUp, Scale, PiggyBank, BarChart3, Layers } from "lucide-react";
import CompanyLogo from "@/components/CompanyLogo";

/* ─────────────────────────────────────────────────────────────────────────────
   HARDCODED DATA — standalone preview
   ───────────────────────────────────────────────────────────────────────────── */

const TRENDING_MEGACAPS = [
  { ticker: "AAPL", name: "Apple Inc.", marketCap: "$3.4T", price: "$198.45" },
  { ticker: "MSFT", name: "Microsoft Corp.", marketCap: "$3.1T", price: "$425.22" },
  { ticker: "GOOGL", name: "Alphabet Inc.", marketCap: "$2.1T", price: "$178.90" },
  { ticker: "NVDA", name: "NVIDIA Corp.", marketCap: "$2.8T", price: "$892.15" },
];

type Verdict = "pass" | "fail" | "doubtful";

const SCHOLAR_DISAGREEMENTS: Array<{
  ticker: string;
  name: string;
  aaoifi: Verdict;
  muftiTaqi: Verdict;
  strict: Verdict;
}> = [
  { ticker: "AMZN", name: "Amazon.com Inc.", aaoifi: "pass", muftiTaqi: "fail", strict: "fail" },
  { ticker: "TSLA", name: "Tesla Inc.", aaoifi: "pass", muftiTaqi: "pass", strict: "doubtful" },
  { ticker: "JPM", name: "JPMorgan Chase", aaoifi: "fail", muftiTaqi: "fail", strict: "fail" },
  { ticker: "META", name: "Meta Platforms", aaoifi: "pass", muftiTaqi: "doubtful", strict: "fail" },
  { ticker: "BRK.B", name: "Berkshire Hathaway", aaoifi: "doubtful", muftiTaqi: "fail", strict: "fail" },
  { ticker: "V", name: "Visa Inc.", aaoifi: "pass", muftiTaqi: "fail", strict: "fail" },
];

const TOP_DIVIDEND_YIELDERS = [
  { ticker: "T", name: "AT&T Inc.", marketCap: "$142B", price: "$18.45", yield: "6.8%" },
  { ticker: "VZ", name: "Verizon Communications", marketCap: "$168B", price: "$40.12", yield: "6.5%" },
  { ticker: "KO", name: "Coca-Cola Co.", marketCap: "$265B", price: "$61.80", yield: "3.1%" },
  { ticker: "CSCO", name: "Cisco Systems", marketCap: "$205B", price: "$49.75", yield: "3.2%" },
];

const SECTOR_PASS_RATES = [
  { sector: "Technology", passRate: 72 },
  { sector: "Healthcare", passRate: 68 },
  { sector: "Consumer Staples", passRate: 61 },
  { sector: "Industrials", passRate: 54 },
  { sector: "Energy", passRate: 48 },
  { sector: "Financials", passRate: 12 },
];

const CROSS_ASSET_TILES = [
  { title: "Crypto", subtitle: "Multi-scholar views", href: "/crypto" },
  { title: "Sukuk", subtitle: "Islamic bonds", href: "/sukuk" },
  { title: "Compare stocks", subtitle: "Side-by-side", href: "/vs" },
];

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE COMPONENT
   ───────────────────────────────────────────────────────────────────────────── */

export default function DiscoverPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6">
      {/* 1. PAGE HEADER */}
      <header className="mb-16">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-600">
          Discover
        </div>
        <h1
          className="mt-3 text-[36px] font-bold leading-[1.1] tracking-tight text-gray-900"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Find your next halal investment
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-gray-600">
          Curated by scholar — re-screened against your selected methodology.
        </p>
      </header>

      {/* 2. TRENDING HALAL MEGA-CAPS */}
      <section className="mb-16">
        <SectionHeader
          icon={<TrendingUp size={16} />}
          kicker="Trending"
          title="Halal mega-caps under your scholar"
        />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TRENDING_MEGACAPS.map((stock) => (
            <StockCard key={stock.ticker} {...stock} verdict="pass" />
          ))}
        </div>
      </section>

      {/* 3. WHERE SCHOLARS DISAGREE */}
      <section className="mb-16">
        <SectionHeader
          icon={<Scale size={16} />}
          kicker="The differentiator"
          title="Where the scholars split"
        />
        <div className="mb-2 text-[11px] italic text-gray-500 sm:hidden">← Swipe to see more →</div>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="pb-3 pr-4 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  Stock
                </th>
                <th className="px-4 pb-3 text-center text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  AAOIFI
                </th>
                <th className="px-4 pb-3 text-center text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  Mufti Taqi
                </th>
                <th className="px-4 pb-3 text-center text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  Strict
                </th>
              </tr>
            </thead>
            <tbody>
              {SCHOLAR_DISAGREEMENTS.map((row) => (
                <tr key={row.ticker} className="border-b border-gray-100">
                  <td className="py-4 pr-4">
                    <Link
                      href={`/screen?ticker=${row.ticker}`}
                      className="group flex items-center gap-3"
                    >
                      <CompanyLogo ticker={row.ticker} size={36} />
                      <div>
                        <div className="font-mono text-sm font-semibold text-gray-900 group-hover:text-navy-700">
                          {row.ticker}
                        </div>
                        <div className="text-xs text-gray-500">{row.name}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <VerdictPill verdict={row.aaoifi} />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <VerdictPill verdict={row.muftiTaqi} />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <VerdictPill verdict={row.strict} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. TOP DIVIDEND YIELDERS */}
      <section className="mb-16">
        <SectionHeader
          icon={<PiggyBank size={16} />}
          kicker="Income"
          title="Top dividend yielders"
        />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TOP_DIVIDEND_YIELDERS.map((stock) => (
            <StockCard
              key={stock.ticker}
              ticker={stock.ticker}
              name={stock.name}
              marketCap={stock.marketCap}
              price={stock.price}
              verdict="pass"
              badge={stock.yield}
            />
          ))}
        </div>
      </section>

      {/* 5. SECTOR PASS-RATE RANKING */}
      <section className="mb-16">
        <SectionHeader
          icon={<BarChart3 size={16} />}
          kicker="By sector"
          title="Sector pass-rate ranking"
        />
        <div className="mt-6 space-y-3">
          {SECTOR_PASS_RATES.map((s) => (
            <div key={s.sector} className="flex items-center gap-4">
              <div className="w-36 text-sm font-medium text-gray-900 sm:w-44">
                {s.sector}
              </div>
              <div className="flex-1">
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-navy-700"
                    style={{ width: `${s.passRate}%` }}
                  />
                </div>
              </div>
              <div className="w-12 text-right font-mono text-sm font-semibold tabular-nums text-gray-700">
                {s.passRate}%
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CROSS-ASSET TILES */}
      <section>
        <SectionHeader
          icon={<Layers size={16} />}
          kicker="Explore more"
          title="Cross-asset coverage"
        />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {CROSS_ASSET_TILES.map((tile) => (
            <Link
              key={tile.href}
              href={tile.href}
              className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-4 transition hover:border-navy-300"
            >
              <div>
                <div
                  className="text-base font-bold text-gray-900 group-hover:text-navy-700"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {tile.title}
                </div>
                <div className="mt-0.5 text-xs text-gray-500">{tile.subtitle}</div>
              </div>
              <ArrowRight size={16} className="text-gray-400 transition group-hover:text-navy-600" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   HELPER COMPONENTS
   ───────────────────────────────────────────────────────────────────────────── */

function SectionHeader({
  icon,
  kicker,
  title,
}: {
  icon: React.ReactNode;
  kicker: string;
  title: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
        <span className="text-gold-600">{icon}</span>
        {kicker}
      </div>
      <h2
        className="mt-2 text-[24px] font-bold leading-tight text-gray-900"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>
    </div>
  );
}

function StockCard({
  ticker,
  name,
  marketCap,
  price,
  verdict,
  badge,
}: {
  ticker: string;
  name: string;
  marketCap: string;
  price: string;
  verdict: "pass" | "fail" | "doubtful";
  badge?: string;
}) {
  return (
    <Link
      href={`/screen?ticker=${ticker}`}
      className="group block rounded-lg border border-gray-200 bg-white p-5 transition hover:border-navy-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <CompanyLogo ticker={ticker} size={40} />
          <div>
            <div className="font-mono text-sm font-semibold text-gray-900 group-hover:text-navy-700">
              {ticker}
            </div>
            <div className="line-clamp-1 text-xs text-gray-500">{name}</div>
          </div>
        </div>
        <VerdictPill verdict={verdict} />
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
        <div>
          <span className="text-gray-500">Mkt cap</span>{" "}
          <span className="font-semibold text-gray-800">{marketCap}</span>
        </div>
        <div>
          <span className="text-gray-500">Price</span>{" "}
          <span className="font-mono font-semibold tabular-nums text-gray-800">{price}</span>
        </div>
      </div>
      {badge && (
        <div className="mt-3">
          <span className="inline-flex rounded-full bg-gold-500/10 px-2 py-0.5 text-[10px] font-semibold text-gold-600">
            {badge} yield
          </span>
        </div>
      )}
    </Link>
  );
}

function VerdictPill({ verdict }: { verdict: Verdict }) {
  const config: Record<Verdict, { label: string; cls: string }> = {
    pass: { label: "Pass", cls: "bg-emerald-50 text-emerald-700" },
    fail: { label: "Fail", cls: "bg-rose-50 text-rose-700" },
    doubtful: { label: "Doubtful", cls: "bg-amber-50 text-amber-700" },
  };
  const { label, cls } = config[verdict];
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${cls}`}
    >
      {label}
    </span>
  );
}
