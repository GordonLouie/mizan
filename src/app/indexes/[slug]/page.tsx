/**
 * /indexes/[slug] — a single halal index (Phase 2). Constituents + methodology
 * are free (SEO + transparency); the backtested performance chart is gated (Pro).
 * Performance is computed server-side from real prices (indexes.server).
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { INDEXES, getIndexDef, indexConstituents } from "@/lib/indexes";
import { indexPerformance } from "@/lib/indexes.server";
import { getScholar } from "@/lib/scholars";
import { fmtMarketCap } from "@/lib/lists";
import LockedFeature from "@/components/LockedFeature";
import IndexPerfChart from "@/components/IndexPerfChart";
import CompanyLogo from "@/components/CompanyLogo";

const SITE = "https://mizaninvesting.com";

export function generateStaticParams() {
  return INDEXES.map((i) => ({ slug: i.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const def = getIndexDef(slug);
  if (!def) return { title: "Index not found — Mizan" };
  const title = `${def.name} — halal index & returns vs S&P 500 — Mizan`;
  return {
    title,
    description: `${def.tagline} See the constituents, methodology, and backtested performance vs the S&P 500 and SPUS.`,
    alternates: { canonical: `${SITE}/indexes/${def.slug}` },
    openGraph: { title, description: def.tagline, url: `${SITE}/indexes/${def.slug}`, siteName: "Mizan", type: "article" },
  };
}

export default async function IndexPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const def = getIndexDef(slug);
  if (!def) notFound();

  const cons = indexConstituents(def);
  const perf = indexPerformance(def);
  const scholar = getScholar(def.scholarId);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">{def.risk} index</div>
      <h1 className="mt-2 text-[28px] font-bold leading-tight text-gray-900 sm:text-[34px]" style={{ fontFamily: "var(--font-display)" }}>
        {def.name}
      </h1>
      <p className="mt-2 text-[15px] leading-relaxed text-gray-700">{def.tagline}</p>

      {/* Performance — gated */}
      <section className="mt-8">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">Backtested performance</div>
        <div className="mt-3">
          <LockedFeature feature="indexes" label="Index performance">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <IndexPerfChart name={def.name} indexPct={perf.indexPct} spyPct={perf.spyPct} spusPct={perf.spusPct} />
            </div>
          </LockedFeature>
        </div>
        {perf.excluded.length > 0 && (
          <p className="mt-2 text-[11px] text-gray-400">Excluded (no price history yet): {perf.excluded.join(", ")}.</p>
        )}
        {perf.excludedAnomalous.length > 0 && (
          <p className="mt-1 text-[11px] text-gray-400">Excluded (unadjusted price glitch): {perf.excludedAnomalous.join(", ")}.</p>
        )}
      </section>

      {/* Methodology — free */}
      <section className="mt-10 rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-[15px] font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>Methodology</h2>
        <ul className="mt-2 space-y-1.5 text-[13px] leading-relaxed text-gray-700">
          <li><b>Universe:</b> Mizan&apos;s covered equities (ETFs excluded).</li>
          <li><b>Screen:</b> must PASS the {scholar.label} standard — the basis for most mainstream halal indices.</li>
          <li><b>Selection:</b> {def.filter ? "themed subset, " : ""}the {def.size} largest qualifying companies by market cap ({cons.length} currently qualify).</li>
          <li><b>Weighting:</b> equal-weight, buy-and-hold, price return.</li>
          <li><b>Benchmarks:</b> S&amp;P 500 (SPY) and the halal S&amp;P (SPUS), normalised the same way.</li>
        </ul>
        <p className="mt-3 rounded-md bg-amber-50/70 px-3 py-2 text-[11px] leading-relaxed text-amber-800">
          <b>Important:</b> constituents are the companies that qualify <i>today</i>. The chart
          therefore shows the trailing performance of the <i>current</i> basket — not a
          point-in-time rebalanced track record — so it carries an upward look-ahead bias and
          overstates what a live index would have returned. Treat it as illustrative.
        </p>
        <Link href="/methodology" className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-navy-700">
          Full screening methodology <ArrowRight size={13} />
        </Link>
      </section>

      {/* Constituents — free */}
      <section className="mt-8">
        <h2 className="text-[15px] font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
          Constituents ({cons.length})
        </h2>
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
        Informational screened basket — not an investable fund, not investment advice. Compliance
        reflects the {scholar.label} methodology; verify with a qualified scholar.
      </p>
    </main>
  );
}
