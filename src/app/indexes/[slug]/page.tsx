/**
 * /indexes/[slug] — a single halal BASKET (repositioned).
 *
 * No backtest. A thesis-driven, screened list described by what it IS TODAY:
 * current characteristics, the slice of dividends to purify, and a drift watch
 * for holdings nearing a ratio limit. Constituents + methodology are free
 * (SEO + transparency); the analytics + drift watch + export are Pro.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { INDEXES, getIndexDef, indexConstituents, indexAnalytics } from "@/lib/indexes";
import { getScholar } from "@/lib/scholars";
import { fmtMarketCap } from "@/lib/lists";
import LockedFeature from "@/components/LockedFeature";
import BasketExport from "@/components/BasketExport";
import CompanyLogo from "@/components/CompanyLogo";

const SITE = "https://www.halalgauge.com";

export function generateStaticParams() {
  return INDEXES.map((i) => ({ slug: i.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const def = getIndexDef(slug);
  if (!def) return { title: "Basket not found" };
  const title = `${def.name} — halal screened basket`;
  return {
    title,
    description: `${def.thesis} See the constituents, current characteristics, the dividend slice to purify, and the full screening methodology.`,
    alternates: { canonical: `${SITE}/indexes/${def.slug}` },
    openGraph: { title, description: def.thesis, url: `${SITE}/indexes/${def.slug}`, siteName: "HalalGauge", type: "article" },
  };
}

export default async function IndexPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const def = getIndexDef(slug);
  if (!def) notFound();

  const cons = indexConstituents(def);
  const a = indexAnalytics(def);
  const scholar = getScholar(def.scholarId);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">{def.risk} basket</div>
      <h1 className="mt-2 text-[28px] font-bold leading-tight text-gray-900 sm:text-[34px]" style={{ fontFamily: "var(--font-display)" }}>
        {def.name}
      </h1>
      <p className="mt-2 text-[15px] leading-relaxed text-gray-700">{def.tagline}</p>

      {/* Thesis — what idea this basket expresses */}
      <div className="mt-5 rounded-xl border-l-[3px] border-navy-700 bg-navy-50/50 p-4">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-navy-700">The thesis</div>
        <p className="mt-1.5 text-[14px] leading-relaxed text-gray-800">{def.thesis}</p>
      </div>

      {/* What this basket IS today — analytics (Pro). No returns, no backtest. */}
      <section className="mt-8">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">What this basket is today</div>
        <div className="mt-3">
          <LockedFeature feature="indexes" label="Basket analytics">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "Holdings", value: String(a.count) },
                  { label: "Weighted div. yield", value: `${a.weightedDivYieldPct.toFixed(1)}%` },
                  { label: "Median debt / cap", value: `${a.medianDebtPct.toFixed(0)}%` },
                  { label: "Dividends to purify", value: `~${a.purificationPctOfDividends.toFixed(1)}%` },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg border border-gray-100 bg-gray-50/60 p-2.5 text-center">
                    <div className="text-[16px] font-bold text-navy-800" style={{ fontFamily: "var(--font-display)" }}>{s.value}</div>
                    <div className="mt-0.5 text-[10px] uppercase tracking-wide text-gray-500">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Sector mix */}
              {a.sectorMix.length > 0 && (
                <div className="mt-5">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">Sector mix</div>
                  <div className="mt-2 space-y-1.5">
                    {a.sectorMix.slice(0, 6).map((s) => (
                      <div key={s.sector} className="flex items-center gap-2">
                        <div className="w-32 shrink-0 truncate text-[12px] text-gray-700">{s.sector}</div>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                          <div className="h-full rounded-full bg-navy-700" style={{ width: `${Math.max(2, s.pct)}%` }} />
                        </div>
                        <div className="w-10 shrink-0 text-right font-mono text-[11px] text-gray-500">{s.pct.toFixed(0)}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="mt-4 text-[10px] leading-relaxed text-gray-400">
                Computed from current fundamentals. &ldquo;Dividends to purify&rdquo; is the cap-weighted share of
                income that is impermissible — apply it to dividends received to estimate the amount to give to charity.
              </p>
            </div>
          </LockedFeature>
        </div>
      </section>

      {/* Drift watch — the differentiated, recurring-value feature */}
      <section className="mt-8">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">Compliance drift watch</div>
        <div className="mt-3">
          <LockedFeature feature="indexes" label="Drift watch">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              {a.atRisk.length === 0 ? (
                <p className="text-[13px] leading-relaxed text-gray-600">
                  No holdings are close to a ratio limit right now — the basket is comfortably within the {scholar.label} thresholds.
                </p>
              ) : (
                <>
                  <p className="text-[13px] leading-relaxed text-gray-700">
                    {a.atRisk.length} holding{a.atRisk.length === 1 ? "" : "s"} currently sit close to a ratio limit — these are the
                    most likely to drift out of compliance and worth watching:
                  </p>
                  <ul className="mt-3 divide-y divide-gray-100 overflow-hidden rounded-lg border border-gray-100">
                    {a.atRisk.map((f) => (
                      <li key={f.ticker} className="flex items-center justify-between gap-3 px-3 py-2.5">
                        <Link href={`/halal/${encodeURIComponent(f.ticker)}`} className="flex min-w-0 items-center gap-2">
                          <span className="font-semibold text-gray-900">{f.ticker}</span>
                          <span className="truncate text-[12px] text-gray-500">{f.name}</span>
                        </Link>
                        <span className="shrink-0 font-mono text-[11px] text-amber-700">{f.note}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </LockedFeature>
        </div>
      </section>

      {/* Methodology — free, reframed (no return claims) */}
      <section className="mt-10 rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-[15px] font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>Methodology</h2>
        <ul className="mt-2 space-y-1.5 text-[13px] leading-relaxed text-gray-700">
          <li><b>Universe:</b> HalalGauge&apos;s covered equities (ETFs excluded).</li>
          <li><b>Screen:</b> every holding must PASS the {scholar.label} — the basis for most mainstream halal indices.</li>
          <li><b>Selection:</b> {def.filter ? "themed subset, " : ""}the {def.size} largest qualifying companies by market cap ({cons.length} currently qualify).</li>
          <li><b>Weighting:</b> equal-weight (each holding the same share) for the exported plan.</li>
          <li><b>Maintenance:</b> the screen re-runs on every data refresh; the drift watch flags holdings nearing a limit.</li>
        </ul>
        <p className="mt-3 rounded-md bg-amber-50/70 px-3 py-2 text-[11px] leading-relaxed text-amber-800">
          <b>This is a screened list, not an investable fund and not investment advice.</b> It has no past-performance
          track record attached on purpose — a screened-universe backtest would be biased by survivorship and
          look-ahead. Use it as a research starting point; verify with a qualified scholar.
        </p>
        <Link href="/methodology" className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-navy-700">
          Full screening methodology <ArrowRight size={13} />
        </Link>
      </section>

      {/* Constituents — free, with export */}
      <section className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[15px] font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
            Holdings ({cons.length})
          </h2>
          <BasketExport name={def.name} holdings={cons.map((c) => ({ ticker: c.ticker, name: c.name, sector: c.sector }))} />
        </div>
        <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-white">
          <ul>
            {cons.map((s) => (
              <li key={s.ticker} className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-2.5 last:border-0">
                <Link href={`/halal/${encodeURIComponent(s.ticker)}`} className="flex min-w-0 items-center gap-2.5">
                  <CompanyLogo ticker={s.ticker} size={24} fallbackTone="neutral" />
                  <span className="truncate">
                    <span className="font-semibold text-gray-900">{s.ticker}</span>{" "}
                    <span className="text-[13px] text-gray-500">{s.name}</span>
                  </span>
                </Link>
                <span className="shrink-0 font-mono text-[12px] text-gray-500">{fmtMarketCap(s.marketCapUsd)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <p className="mt-8 text-[11px] leading-relaxed text-gray-400">
        Informational screened basket — not an investable fund, not investment advice. Compliance reflects the
        {" "}{scholar.label} methodology; verify with a qualified scholar.
      </p>
    </main>
  );
}
