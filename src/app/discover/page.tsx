"use client";

/**
 * /discover — data-driven discovery. Everything here is computed from the REAL
 * screen engine + real fundamentals/prices under the user's selected scholar —
 * no hardcoded prices, caps, verdicts, or sector rates. (The prior version shipped
 * fabricated numbers, which contradicted the product's whole promise.)
 */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, TrendingUp, Scale, PiggyBank, BarChart3, Layers } from "lucide-react";
import CompanyLogo from "@/components/CompanyLogo";
import ScholarPicker from "@/components/ScholarPicker";
import { listStocks } from "@/lib/data";
import { getScholar, SCHOLAR_PROFILES } from "@/lib/scholars";
import { loadCustomProfile } from "@/lib/customProfile";
import { screenStock } from "@/lib/screen";
import { fundamentalsReliable } from "@/lib/dataQuality";
import { currentPrice } from "@/lib/prices";
import { fmtMarketCap } from "@/lib/lists";
import { VERDICT_LABEL } from "@/lib/verdictLabels";
import type { Verdict } from "@/lib/types";

const CROSS_ASSET_TILES = [
  { title: "Halal baskets", subtitle: "Thesis-driven, screened", href: "/indexes" },
  { title: "Compare stocks", subtitle: "Side-by-side", href: "/vs" },
  { title: "Curated lists", subtitle: "Editorial collections", href: "/lists" },
];

export default function DiscoverPage() {
  const [scholarId, setScholarId] = useState("aaoifi");
  const [bump, setBump] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("mizan.scholarId");
      if (saved && SCHOLAR_PROFILES.some((p) => p.id === saved)) setScholarId(saved);
    } catch {}
  }, []);
  const scholar = useMemo(() => (scholarId === "custom" ? loadCustomProfile() : getScholar(scholarId)), [scholarId, bump]);
  void bump;

  // Reliable, screenable equities (no ETFs, no broken data).
  const universe = useMemo(
    () => listStocks().filter((s) => s.sector !== "ETF" && fundamentalsReliable(s)),
    [],
  );

  const megacaps = useMemo(() => {
    return universe
      .filter((s) => screenStock(s, scholar).verdict === "pass")
      .sort((a, b) => b.marketCapUsd - a.marketCapUsd)
      .slice(0, 4);
  }, [universe, scholar]);

  const dividendYielders = useMemo(() => {
    return universe
      .filter((s) => screenStock(s, scholar).verdict === "pass" && (s.dividendYieldPct ?? 0) > 0)
      .sort((a, b) => (b.dividendYieldPct ?? 0) - (a.dividendYieldPct ?? 0))
      .slice(0, 4);
  }, [universe, scholar]);

  const sectorRates = useMemo(() => {
    const tally = new Map<string, { pass: number; total: number }>();
    for (const s of universe) {
      const t = tally.get(s.sector) ?? { pass: 0, total: 0 };
      t.total += 1;
      if (screenStock(s, scholar).verdict === "pass") t.pass += 1;
      tally.set(s.sector, t);
    }
    return Array.from(tally.entries())
      .filter(([, t]) => t.total >= 4) // ignore thin sectors
      .map(([sector, t]) => ({ sector, passRate: Math.round((t.pass / t.total) * 100), total: t.total }))
      .sort((a, b) => b.passRate - a.passRate)
      .slice(0, 8);
  }, [universe, scholar]);

  // Real verdicts under three contrasting standards. Prioritise the *interesting*
  // disagreement (AAOIFI vs Mufti Taqi — the illiquid-floor split), then others.
  const splits = useMemo(() => {
    const a = getScholar("aaoifi"), t = getScholar("taqi_usmani"), st = getScholar("strict");
    const scored = [...universe]
      .sort((x, y) => y.marketCapUsd - x.marketCapUsd)
      .slice(0, 80)
      .map((s) => ({
        ticker: s.ticker,
        name: s.name,
        aaoifi: screenStock(s, a).verdict,
        muftiTaqi: screenStock(s, t).verdict,
        strict: screenStock(s, st).verdict,
      }));
    const mainstream = scored.filter((r) => r.aaoifi !== r.muftiTaqi); // AAOIFI vs Mufti Taqi differ
    const other = scored.filter((r) => r.aaoifi === r.muftiTaqi && r.muftiTaqi !== r.strict);
    return [...mainstream, ...other].slice(0, 6);
  }, [universe]);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6">
      <header className="mb-8">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-600">Discover</div>
        <h1 className="mt-3 text-[28px] font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>
          Find your next halal investment
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-gray-600">
          Live results from real fundamentals, re-screened against your selected standard. Pick a standard and everything below recalculates.
        </p>
        <div className="mt-5 sm:max-w-md">
          <ScholarPicker value={scholarId} onChange={setScholarId} />
        </div>
      </header>

      {/* Trending halal mega-caps */}
      <section className="mb-16">
        <SectionHeader icon={<TrendingUp size={16} />} kicker="Trending" title={`Largest halal stocks under ${scholar.short}`} />
        {megacaps.length === 0 ? (
          <Empty>No stocks pass the {scholar.short} screen in the covered universe.</Empty>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {megacaps.map((s) => (
              <StockCard key={s.ticker} ticker={s.ticker} name={s.name} marketCap={fmtMarketCap(s.marketCapUsd)} price={currentPrice(s)} verdict="pass" />
            ))}
          </div>
        )}
      </section>

      {/* Where the standards split */}
      <section className="mb-16">
        <SectionHeader icon={<Scale size={16} />} kicker="The differentiator" title="Where the standards split" />
        <div className="mb-2 mt-1 text-[12px] text-gray-500">Real verdicts under three contrasting standards — see the full reconciliation on any stock page.</div>
        <div className="mb-2 text-[11px] italic text-gray-500 sm:hidden">← Swipe to see more →</div>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="pb-3 pr-4 text-[11px] font-semibold uppercase tracking-wide text-gray-500">Stock</th>
                <th className="px-4 pb-3 text-center text-[11px] font-semibold uppercase tracking-wide text-gray-500">AAOIFI</th>
                <th className="px-4 pb-3 text-center text-[11px] font-semibold uppercase tracking-wide text-gray-500">Mufti Taqi</th>
                <th className="px-4 pb-3 text-center text-[11px] font-semibold uppercase tracking-wide text-gray-500">Strict</th>
              </tr>
            </thead>
            <tbody>
              {splits.map((row) => (
                <tr key={row.ticker} className="border-b border-gray-100">
                  <td className="py-4 pr-4">
                    <Link href={`/halal/${encodeURIComponent(row.ticker)}`} className="group flex items-center gap-3">
                      <CompanyLogo ticker={row.ticker} size={36} />
                      <div>
                        <div className="font-mono text-sm font-semibold text-gray-900 group-hover:text-navy-700">{row.ticker}</div>
                        <div className="text-xs text-gray-500">{row.name}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-center"><VerdictPill verdict={row.aaoifi} /></td>
                  <td className="px-4 py-4 text-center"><VerdictPill verdict={row.muftiTaqi} /></td>
                  <td className="px-4 py-4 text-center"><VerdictPill verdict={row.strict} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Top dividend yielders */}
      <section className="mb-16">
        <SectionHeader icon={<PiggyBank size={16} />} kicker="Income" title={`Top halal dividend yielders under ${scholar.short}`} />
        {dividendYielders.length === 0 ? (
          <Empty>No dividend-paying stocks pass the {scholar.short} screen yet.</Empty>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {dividendYielders.map((s) => (
              <StockCard key={s.ticker} ticker={s.ticker} name={s.name} marketCap={fmtMarketCap(s.marketCapUsd)} price={currentPrice(s)} verdict="pass" badge={`${(s.dividendYieldPct ?? 0).toFixed(1)}%`} />
            ))}
          </div>
        )}
      </section>

      {/* Sector pass-rate ranking */}
      <section className="mb-16">
        <SectionHeader icon={<BarChart3 size={16} />} kicker="By sector" title={`Sector pass-rate under ${scholar.short}`} />
        <div className="mt-6 space-y-3">
          {sectorRates.map((s) => (
            <div key={s.sector} className="flex items-center gap-4">
              <div className="w-24 truncate text-sm font-medium text-gray-900 sm:w-44">{s.sector}</div>
              <div className="flex-1">
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-navy-700" style={{ width: `${Math.max(2, s.passRate)}%` }} />
                </div>
              </div>
              <div className="w-20 text-right font-mono text-sm font-semibold tabular-nums text-gray-700">{s.passRate}%</div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-gray-400">Share of covered {scholar.short}-screenable companies in each sector that currently pass. From real fundamentals.</p>
      </section>

      {/* Cross-asset tiles */}
      <section>
        <SectionHeader icon={<Layers size={16} />} kicker="Explore more" title="More ways in" />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {CROSS_ASSET_TILES.map((tile) => (
            <Link key={tile.href} href={tile.href} className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-4 transition hover:border-navy-300">
              <div>
                <div className="text-base font-bold text-gray-900 group-hover:text-navy-700" style={{ fontFamily: "var(--font-display)" }}>{tile.title}</div>
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

function SectionHeader({ icon, kicker, title }: { icon: React.ReactNode; kicker: string; title: string }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
        <span className="text-gold-600">{icon}</span>
        {kicker}
      </div>
      <h2 className="mt-2 text-[24px] font-bold leading-tight text-gray-900" style={{ fontFamily: "var(--font-display)" }}>{title}</h2>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50/60 px-5 py-6 text-[13px] text-gray-500">{children}</div>;
}

function StockCard({ ticker, name, marketCap, price, verdict, badge }: {
  ticker: string; name: string; marketCap: string; price: number; verdict: Verdict; badge?: string;
}) {
  return (
    <Link href={`/halal/${encodeURIComponent(ticker)}`} className="group block rounded-lg border border-gray-200 bg-white p-5 transition hover:border-navy-300">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <CompanyLogo ticker={ticker} size={40} />
          <div>
            <div className="font-mono text-sm font-semibold text-gray-900 group-hover:text-navy-700">{ticker}</div>
            <div className="line-clamp-1 text-xs text-gray-500">{name}</div>
          </div>
        </div>
        <VerdictPill verdict={verdict} />
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
        <div><span className="text-gray-500">Mkt cap</span> <span className="font-semibold text-gray-800">{marketCap}</span></div>
        <div><span className="text-gray-500">Price</span> <span className="font-mono font-semibold tabular-nums text-gray-800">{price > 0 ? `$${price.toFixed(2)}` : "—"}</span></div>
      </div>
      {badge && (
        <div className="mt-3">
          <span className="inline-flex rounded-full bg-gold-500/10 px-2 py-0.5 text-[10px] font-semibold text-gold-600">{badge} yield</span>
        </div>
      )}
    </Link>
  );
}

function VerdictPill({ verdict }: { verdict: Verdict }) {
  const config: Record<Verdict, { cls: string }> = {
    pass: { cls: "bg-emerald-50 text-emerald-700" },
    fail: { cls: "bg-rose-50 text-rose-700" },
    borderline: { cls: "bg-amber-50 text-amber-700" },
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${config[verdict].cls}`}>
      {VERDICT_LABEL[verdict]}
    </span>
  );
}
