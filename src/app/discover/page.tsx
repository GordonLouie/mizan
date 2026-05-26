"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Bitcoin, FileText, GitCompare } from "lucide-react";
import { listStocks } from "@/lib/data";
import { SCHOLAR_PROFILES, getScholar } from "@/lib/scholars";
import { loadCustomProfile } from "@/lib/customProfile";
import { screenStock } from "@/lib/screen";
import { fmtMarketCap, CURATED_LISTS } from "@/lib/lists";
import ScholarPicker from "@/components/ScholarPicker";
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

  // Trending = biggest halal mega-caps under user's scholar
  const trending = useMemo(
    () => enriched
      .filter((e) => e.verdict === "pass")
      .sort((a, b) => b.stock.marketCapUsd - a.stock.marketCapUsd)
      .slice(0, 4),
    [enriched],
  );

  // High-yield halal — passing names with best dividend yield
  const highYield = useMemo(
    () => enriched
      .filter((e) => e.verdict === "pass" && e.stock.dividendYieldPct >= 2)
      .sort((a, b) => b.stock.dividendYieldPct - a.stock.dividendYieldPct)
      .slice(0, 4),
    [enriched],
  );

  // Scholars-disagree — stocks where mainstream verdicts differ
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
      .map(([sector, s]) => ({ sector, ...s, passPct: s.total ? s.pass / s.total : 0 }))
      .sort((a, b) => b.marketCap - a.marketCap);
  }, [enriched]);

  // Universe-level totals
  const stats = useMemo(() => {
    const pass = enriched.filter((e) => e.verdict === "pass").length;
    const totalMcap = all.reduce((s, x) => s + x.marketCapUsd, 0);
    const passMcap = enriched.filter((e) => e.verdict === "pass")
      .reduce((s, x) => s + x.stock.marketCapUsd, 0);
    return {
      total: all.length,
      pass,
      passPct: all.length ? pass / all.length : 0,
      mcapPassPct: totalMcap ? passMcap / totalMcap : 0,
    };
  }, [enriched, all]);

  const mainstreamScholars = SCHOLAR_PROFILES.filter((p) => p.id !== "custom");

  return (
    <div className="pb-20">
      {/* 1. PAGE HEADER */}
      <header className="pt-6">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Discover
        </div>
        <h1
          className="mt-3 text-[36px] font-bold leading-[1.1] text-gray-900 sm:text-[44px]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Find your next halal investment
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-gray-600">
          Trending names, where scholars disagree, sector pass-rates — re-screened live against your selected methodology.
        </p>
      </header>

      {/* SCHOLAR PICKER */}
      <div className="mt-8 sm:max-w-md">
        <ScholarPicker value={scholarId} onChange={setScholarId} />
      </div>

      {/* UNIVERSE SUMMARY — hairline-separated, no card chrome */}
      <div className="mt-10 grid grid-cols-2 gap-y-5 border-t border-b border-gray-200 py-5 sm:grid-cols-4">
        <StatPlain label="Universe" value={`${stats.total}`} sub="tickers" />
        <StatPlain label="Halal" value={`${stats.pass}`} sub={`${Math.round(stats.passPct * 100)}% by count`} tone="emerald" />
        <StatPlain label="Halal by mkt cap" value={`${Math.round(stats.mcapPassPct * 100)}%`} sub="weighted" tone="emerald" />
        <StatPlain label="Scholars covered" value="6" sub="incl. your custom" />
      </div>

      {/* 2. TRENDING HALAL MEGA-CAPS */}
      <section className="mt-20">
        <SectionHead kicker="Trending" title="Halal mega-caps right now" sub="The largest companies passing under your scholar." />
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {trending.map(({ stock }) => (
            <StockCard key={stock.ticker} stock={stock} />
          ))}
        </div>
      </section>

      {/* 3. WHERE SCHOLARS DISAGREE — the differentiator */}
      {disagreements.length > 0 && (
        <section className="mt-24">
          <SectionHead
            kicker="The honest part"
            title="Where the scholars disagree"
            sub="Same stock, different rulebooks. No other app surfaces this without picking for you."
          />
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="pb-3 pr-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                    Company
                  </th>
                  {mainstreamScholars.map((p) => (
                    <th key={p.id} className="pb-3 pr-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                      {p.short}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {disagreements.map(({ stock, verdicts }, idx) => (
                  <tr
                    key={stock.ticker}
                    className={idx !== disagreements.length - 1 ? "border-b border-gray-100" : ""}
                  >
                    <td className="py-3 pr-4">
                      <Link
                        href={`/screen?ticker=${stock.ticker}`}
                        className="group block"
                      >
                        <div className="font-mono text-sm font-semibold text-gray-900 group-hover:text-navy-800">
                          {stock.ticker}
                        </div>
                        <div className="mt-0.5 text-[11px] text-gray-500">{stock.name}</div>
                      </Link>
                    </td>
                    {mainstreamScholars.map((p) => (
                      <td key={p.id} className="py-3 pr-3 text-center">
                        <VerdictPill verdict={verdicts[p.id]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 4. TOP DIVIDEND YIELDERS */}
      {highYield.length > 0 && (
        <section className="mt-24">
          <SectionHead
            kicker="Income"
            title="Top halal dividend yielders"
            sub="Passing names with the best yields. Remember purification on the impermissible-income share."
          />
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {highYield.map(({ stock }) => (
              <StockCard
                key={stock.ticker}
                stock={stock}
                yieldPct={stock.dividendYieldPct}
              />
            ))}
          </div>
        </section>
      )}

      {/* 5. SECTOR PASS-RATE RANKING */}
      <section className="mt-24">
        <SectionHead
          kicker="By industry"
          title="Sector pass-rate ranking"
          sub="Percentage of stocks passing under the current scholar's methodology."
        />
        <div className="mt-6 space-y-3">
          {sectorStats.map((s) => {
            const slug = sectorSlug(s.sector);
            const pct = Math.round(s.passPct * 100);
            return (
              <Link
                key={s.sector}
                href={`/sectors/${slug}`}
                className="group flex items-center gap-4 rounded-md py-2 transition hover:bg-gray-50"
              >
                <div className="w-32 flex-shrink-0 truncate pl-2 text-sm font-medium text-gray-900 sm:w-44">
                  {s.sector}
                </div>
                <div className="flex-1">
                  <div className="h-2 w-full bg-gray-100">
                    <div
                      className="h-2 bg-navy-800 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <div className="flex w-20 items-center justify-end gap-1.5 pr-2 font-mono text-sm font-semibold text-gray-900">
                  {pct}%
                  <ArrowRight size={12} className="text-gray-400 transition group-hover:text-gray-700" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 6. CURATED LISTS SHORTCUT */}
      <section className="mt-24">
        <SectionHead
          kicker="Editor's picks"
          title="Curated collections"
          sub="Hand-picked lists for income, ETFs, mega-caps, stricter-Hanafi, and more."
        />
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CURATED_LISTS.slice(0, 4).map((list) => (
            <Link
              key={list.slug}
              href={`/lists/${list.slug}`}
              className="group block border border-gray-200 bg-white p-5 transition hover:border-gray-400"
            >
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                {list.kicker}
              </div>
              <div className="mt-2 text-[15px] font-bold leading-snug text-gray-900 group-hover:text-navy-800" style={{ fontFamily: "Georgia, serif" }}>
                {list.title}
              </div>
              <div className="mt-1 text-[11px] text-gray-500">{list.tickers.length} stocks</div>
            </Link>
          ))}
        </div>
        <div className="mt-5 text-center text-xs">
          <Link href="/lists" className="text-navy-700 hover:underline">
            All curated lists →
          </Link>
        </div>
      </section>

      {/* 7. CROSS-ASSET TILES */}
      <section className="mt-24">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <CrossAssetTile
            icon={Bitcoin}
            kicker="Crypto"
            title="Multi-scholar views"
            body="BTC, ETH, and top altcoins — assessed under six methodologies."
            href="/crypto"
            cta="Explore crypto"
          />
          <CrossAssetTile
            icon={FileText}
            kicker="Sukuk"
            title="Islamic bonds"
            body="Fixed-income alternatives structured for Sharia compliance."
            href="/sukuk"
            cta="Explore sukuk"
          />
          <CrossAssetTile
            icon={GitCompare}
            kicker="Compare"
            title="Side-by-side"
            body="Pick any two tickers and compare their compliance profiles."
            href="/vs"
            cta="Compare stocks"
          />
        </div>
      </section>

      <p className="mt-16 text-center text-[11px] text-gray-500">
        All figures re-screened on every page load against the scholar you select above. Data: Q1 2026 sample ({stats.total} representative tickers).
      </p>
    </div>
  );
}

/* ─── HELPERS ─────────────────────────────────────────────────────────────── */

function SectionHead({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
        {kicker}
      </div>
      <h2 className="mt-2 text-[24px] font-bold leading-tight text-gray-900 sm:text-[28px]" style={{ fontFamily: "Georgia, serif" }}>
        {title}
      </h2>
      {sub && <p className="mt-2 max-w-xl text-sm text-gray-600">{sub}</p>}
    </div>
  );
}

function StatPlain({ label, value, sub, tone = "neutral" }: { label: string; value: string; sub?: string; tone?: "neutral" | "emerald" }) {
  const cls = tone === "emerald" ? "text-emerald-700" : "text-gray-900";
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
        {label}
      </div>
      <div className={`mt-1 text-[22px] font-bold leading-none tabular-nums ${cls}`} style={{ fontFamily: "Georgia, serif" }}>
        {value}
      </div>
      {sub && <div className="mt-1 text-[11px] text-gray-500">{sub}</div>}
    </div>
  );
}

function StockCard({ stock, yieldPct }: { stock: StockFundamentals; yieldPct?: number }) {
  return (
    <Link
      href={`/screen?ticker=${stock.ticker}`}
      className="relative block border border-gray-200 bg-white p-4 transition hover:border-gray-400"
    >
      <span className="absolute right-3 top-3 rounded-full border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-emerald-700">
        Halal
      </span>
      <div className="font-mono text-[12px] font-semibold text-gray-900">{stock.ticker}</div>
      <div className="mt-1 line-clamp-1 text-[15px] font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
        {stock.name}
      </div>
      <div className="mt-3 flex items-baseline justify-between font-mono text-[11px] text-gray-500">
        <span>{fmtMarketCap(stock.marketCapUsd)}</span>
        {yieldPct !== undefined && (
          <span className="text-sm font-semibold text-gold-600">{yieldPct.toFixed(1)}%</span>
        )}
      </div>
    </Link>
  );
}

function VerdictPill({ verdict }: { verdict: Verdict }) {
  const tone =
    verdict === "pass" ? "bg-emerald-50 text-emerald-700"
      : verdict === "fail" ? "bg-rose-50 text-rose-700"
        : "bg-amber-50 text-amber-700";
  const label =
    verdict === "pass" ? "Halal"
      : verdict === "fail" ? "Not halal"
        : "Doubtful";
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${tone}`}>
      {label}
    </span>
  );
}

function CrossAssetTile({
  icon: Icon,
  kicker,
  title,
  body,
  href,
  cta,
}: {
  icon: typeof Bitcoin;
  kicker: string;
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="group block border border-gray-200 bg-white p-6 transition hover:border-gray-400"
    >
      <Icon size={20} className="text-gray-500" strokeWidth={1.5} />
      <div className="mt-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
        {kicker}
      </div>
      <div className="mt-2 text-lg font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
        {title}
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-gray-600">{body}</p>
      <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-navy-700 group-hover:text-navy-900">
        {cta} <ArrowRight size={14} />
      </div>
    </Link>
  );
}

// Slug must match the one used in /sectors/[slug]
function sectorSlug(sector: string): string {
  return sector.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
