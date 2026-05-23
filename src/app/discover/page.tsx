"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { TrendingUp, Sparkles, Rocket, ArrowRight, Building2 } from "lucide-react";
import { listStocks } from "@/lib/data";
import { SCHOLAR_PROFILES, getScholar } from "@/lib/scholars";
import { loadCustomProfile } from "@/lib/customProfile";
import { screenStock } from "@/lib/screen";
import { fmtMarketCap, CURATED_LISTS } from "@/lib/lists";
import { Card, PageHeader } from "@/components/ui";
import ScholarPicker from "@/components/ScholarPicker";
import StockLogo from "@/components/StockLogo";
import type { StockFundamentals, Verdict } from "@/lib/types";

export default function DiscoverPage() {
  const [scholarId, setScholarId] = useState("aaoifi");
  const [bump, setBump] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("mizan.scholarId");
      if (saved && SCHOLAR_PROFILES.some((p) => p.id === saved)) setScholarId(saved);
    } catch {}
    const onFocus = () => setBump((b) => b + 1);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const scholar = useMemo(
    () => (scholarId === "custom" ? loadCustomProfile() : getScholar(scholarId)),
    [scholarId, bump],
  );

  const all = listStocks();
  const enriched = useMemo(
    () => all.map((s) => ({ stock: s, verdict: screenStock(s, scholar).verdict })),
    [all, scholar],
  );

  // Trending = the biggest halal mega-caps under the user's scholar
  const trending = useMemo(
    () => enriched
      .filter((e) => e.verdict === "pass")
      .sort((a, b) => b.stock.marketCapUsd - a.stock.marketCapUsd)
      .slice(0, 8),
    [enriched],
  );

  // High-yield halal — passing names with the best dividend yield
  const highYield = useMemo(
    () => enriched
      .filter((e) => e.verdict === "pass" && e.stock.dividendYieldPct >= 2)
      .sort((a, b) => b.stock.dividendYieldPct - a.stock.dividendYieldPct)
      .slice(0, 6),
    [enriched],
  );

  // Scholars-disagree section — stocks where verdicts differ across mainstream scholars
  const disagreements = useMemo(() => {
    const profiles = SCHOLAR_PROFILES.filter((p) => p.id !== "custom");
    const out: Array<{ stock: StockFundamentals; verdicts: Record<string, Verdict> }> = [];
    for (const s of all) {
      const v: Record<string, Verdict> = {};
      for (const p of profiles) v[p.id] = screenStock(s, p).verdict;
      const uniq = new Set(Object.values(v));
      if (uniq.size > 1 && s.marketCapUsd >= 100e9) {
        out.push({ stock: s, verdicts: v });
      }
    }
    return out.sort((a, b) => b.stock.marketCapUsd - a.stock.marketCapUsd).slice(0, 6);
  }, [all]);

  // Per-sector pass rate
  const sectorStats = useMemo(() => {
    const map = new Map<string, { total: number; pass: number; marketCap: number }>();
    for (const { stock, verdict } of enriched) {
      const entry = map.get(stock.sector) ?? { total: 0, pass: 0, marketCap: 0 };
      entry.total++;
      if (verdict === "pass") entry.pass++;
      entry.marketCap += stock.marketCapUsd;
      map.set(stock.sector, entry);
    }
    return [...map.entries()]
      .map(([sector, s]) => ({
        sector,
        ...s,
        passPct: s.total ? s.pass / s.total : 0,
      }))
      .sort((a, b) => b.marketCap - a.marketCap);
  }, [enriched]);

  // Universe stats
  const stats = useMemo(() => {
    const pass = enriched.filter((e) => e.verdict === "pass").length;
    const totalMcap = all.reduce((s, x) => s + x.marketCapUsd, 0);
    const passMcap = enriched.filter((e) => e.verdict === "pass")
      .reduce((s, x) => s + x.stock.marketCapUsd, 0);
    return {
      total: all.length, pass,
      passPct: all.length ? pass / all.length : 0,
      mcapPassPct: totalMcap ? passMcap / totalMcap : 0,
    };
  }, [enriched, all]);

  return (
    <div className="space-y-8">
      <PageHeader
        kicker="Discover"
        title="The halal market today"
        description="Trending names, where scholars disagree, sector pass-rates, and curated lists — re-screened live against the scholar you follow."
      />

      <ScholarPicker value={scholarId} onChange={setScholarId} />

      {/* Universe summary strip */}
      <Card padded={false}>
        <div className="grid grid-cols-2 divide-x divide-y divide-gray-100 sm:grid-cols-4 sm:divide-y-0">
          <Stat label="Universe" value={`${stats.total} tickers`} />
          <Stat label="Halal" value={`${stats.pass}`} sub={`${Math.round(stats.passPct * 100)}% by count`} tone="pass" />
          <Stat label="Halal by market cap" value={`${Math.round(stats.mcapPassPct * 100)}%`} sub="weighted" tone="pass" />
          <Stat label="Scholars covered" value="6" sub="incl. your custom" />
        </div>
      </Card>

      {/* Trending halal mega-caps */}
      <Section
        icon={<TrendingUp size={16} />}
        kicker="Trending"
        title="Halal mega-caps right now"
        description="The largest companies passing under your scholar. The names most diaspora Muslim investors already own through index funds."
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {trending.map(({ stock }) => (
            <StockTile key={stock.ticker} stock={stock} />
          ))}
        </div>
      </Section>

      {/* Where scholars disagree */}
      {disagreements.length > 0 && (
        <Section
          icon={<Sparkles size={16} />}
          kicker="The honest part"
          title="Where the scholars disagree"
          description="Mega-cap names that pass under one mainstream view and fail under another. Mizan is the only app that surfaces these without choosing for you."
        >
          <div className="overflow-x-auto">
            <Card padded={false}>
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    <th className="px-5 py-3">Company</th>
                    {SCHOLAR_PROFILES.filter((p) => p.id !== "custom").map((p) => (
                      <th key={p.id} className="px-3 py-3 text-center">{p.short}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {disagreements.map(({ stock, verdicts }) => (
                    <tr key={stock.ticker} className="hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <Link href={`/screen?ticker=${stock.ticker}`} className="flex items-center gap-3 group">
                          <StockLogo ticker={stock.ticker} name={stock.name} size={28} />
                          <div>
                            <div className="font-mono text-xs font-semibold text-gray-900 group-hover:text-navy-800">
                              {stock.ticker}
                            </div>
                            <div className="text-xs text-gray-500">{stock.name}</div>
                          </div>
                        </Link>
                      </td>
                      {SCHOLAR_PROFILES.filter((p) => p.id !== "custom").map((p) => {
                        const v = verdicts[p.id];
                        return (
                          <td key={p.id} className="px-3 py-3 text-center">
                            <VerdictDot verdict={v} />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        </Section>
      )}

      {/* Halal income / dividend payers */}
      {highYield.length > 0 && (
        <Section
          icon={<Building2 size={16} />}
          kicker="Income"
          title="Halal income — top dividend yielders"
          description="Passing names with the highest dividend yields. Remember purification on the impermissible-income share."
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {highYield.map(({ stock }) => (
              <StockTile key={stock.ticker} stock={stock} badge={`${stock.dividendYieldPct.toFixed(1)}% yield`} />
            ))}
          </div>
        </Section>
      )}

      {/* Sector pass-rates */}
      <Section
        icon={<Rocket size={16} />}
        kicker="By industry"
        title="Where the halal universe is concentrated"
        description="Pass-rate by sector under your scholar. Click any sector for the full ranked list."
      >
        <Card padded={false}>
          <ul className="divide-y divide-gray-100">
            {sectorStats.map((s) => {
              const slug = sectorSlug(s.sector);
              return (
                <li key={s.sector}>
                  <Link
                    href={`/sectors/${slug}`}
                    className="flex items-center justify-between gap-4 px-5 py-3.5 transition hover:bg-gray-50"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-gray-900">{s.sector}</div>
                      <div className="mt-1 text-xs text-gray-500">
                        {s.pass} of {s.total} halal · {fmtMarketCap(s.marketCap)} aggregate
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="hidden h-1.5 w-32 overflow-hidden rounded-full bg-gray-100 sm:block">
                        <div
                          className="h-full rounded-full bg-emerald-600"
                          style={{ width: `${Math.round(s.passPct * 100)}%` }}
                        />
                      </div>
                      <span className="font-mono text-sm font-semibold tabular-nums text-gray-800">
                        {Math.round(s.passPct * 100)}%
                      </span>
                      <ArrowRight size={14} className="text-gray-400" />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>
      </Section>

      {/* Curated lists shortcut */}
      <Section
        kicker="Editor's picks"
        title="Curated collections"
        description="Hand-picked lists for income, ETFs, mega-caps, stricter-Hanafi, and more."
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {CURATED_LISTS.slice(0, 4).map((list) => (
            <Link
              key={list.slug}
              href={`/lists/${list.slug}`}
              className="group block rounded-lg border border-gray-200 bg-white p-4 transition hover:border-navy-300 hover:bg-navy-50/30"
            >
              <div className="text-[10px] font-semibold uppercase tracking-widest text-amber-700">
                {list.kicker}
              </div>
              <div className="mt-2 text-sm font-bold text-gray-900 group-hover:text-navy-800" style={{ fontFamily: "Georgia, serif" }}>
                {list.title}
              </div>
              <div className="mt-1 text-xs text-gray-500">{list.tickers.length} stocks</div>
            </Link>
          ))}
        </div>
        <div className="mt-3 text-center text-xs">
          <Link href="/lists" className="text-navy-700 hover:underline">All curated lists →</Link>
        </div>
      </Section>

      {/* Cross-asset shortcut */}
      <Card className="bg-gradient-to-r from-navy-50/40 to-amber-50/40">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <CrossAssetTile href="/crypto" title="Crypto" description="BTC, ETH, top 20 — scholar views compared" />
          <CrossAssetTile href="/sukuk" title="Sukuk" description="Islamic bonds — primer and ETFs" />
          <CrossAssetTile href="/sectors" title="Sectors" description="Browse every industry's halal pass-rate" />
        </div>
      </Card>

      <p className="text-center text-xs text-gray-500">
        All figures re-screened on every page load against the scholar you select above. Data: Q1 2026 sample (163 representative tickers).
      </p>
    </div>
  );
}

function Section({
  icon,
  kicker,
  title,
  description,
  children,
}: {
  icon?: React.ReactNode;
  kicker: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-4 flex items-start gap-3">
        {icon && (
          <div className="mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-amber-50 text-amber-700">
            {icon}
          </div>
        )}
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-widest text-amber-700">
            {kicker}
          </div>
          <h2 className="mt-1 text-xl font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
            {title}
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-600">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function StockTile({ stock, badge }: { stock: StockFundamentals; badge?: string }) {
  return (
    <Link
      href={`/screen?ticker=${stock.ticker}`}
      className="group block rounded-lg border border-gray-200 bg-white p-4 transition hover:border-emerald-300 hover:bg-emerald-50/30"
    >
      <div className="flex items-center gap-3">
        <StockLogo ticker={stock.ticker} name={stock.name} size={32} />
        <div className="min-w-0">
          <div className="font-mono text-sm font-semibold text-gray-900 group-hover:text-navy-800">
            {stock.ticker}
          </div>
          <div className="line-clamp-1 text-[11px] text-gray-500">{stock.name}</div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-[11px]">
        <span className="text-gray-500">{fmtMarketCap(stock.marketCapUsd)}</span>
        {badge && (
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700">
            {badge}
          </span>
        )}
      </div>
    </Link>
  );
}

function VerdictDot({ verdict }: { verdict: Verdict }) {
  const cls =
    verdict === "pass" ? "bg-emerald-50 text-emerald-700"
      : verdict === "borderline" ? "bg-amber-50 text-amber-700"
        : "bg-rose-50 text-rose-700";
  const short =
    verdict === "pass" ? "Halal"
      : verdict === "borderline" ? "Doubt"
        : "Not";
  return (
    <span className={"inline-flex min-w-[44px] justify-center rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide " + cls}>
      {short}
    </span>
  );
}

function CrossAssetTile({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link
      href={href}
      className="group block rounded-md border border-white/0 bg-white p-4 transition hover:border-navy-200 hover:shadow-sm"
    >
      <div className="text-base font-bold text-gray-900 group-hover:text-navy-800" style={{ fontFamily: "Georgia, serif" }}>
        {title}
      </div>
      <div className="mt-1 text-xs text-gray-600">{description}</div>
      <div className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-navy-700">
        Explore <ArrowRight size={11} />
      </div>
    </Link>
  );
}

function Stat({
  label,
  value,
  sub,
  tone = "neutral",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "pass" | "neutral";
}) {
  const cls = tone === "pass" ? "text-emerald-700" : "text-gray-900";
  return (
    <div className="px-5 py-4">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">{label}</div>
      <div className={`mt-1 text-xl font-bold ${cls}`} style={{ fontFamily: "Georgia, serif" }}>
        {value}
      </div>
      {sub && <div className="mt-0.5 text-[11px] text-gray-500">{sub}</div>}
    </div>
  );
}

// Slug must match the one used in /sectors/[slug]
function sectorSlug(sector: string): string {
  return sector.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

