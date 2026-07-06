/**
 * /halal/[ticker] — programmatic SEO page, one per ticker.
 *
 * Server-rendered, statically-generated, fully indexable page that answers
 * "Is {Company} halal?" with the verdict under all 5 mainstream scholarly
 * standards, the deciding metrics, and cited sources. Unlike /screen (client-
 * rendered, not indexable) Google can crawl a real answer for every ticker.
 *
 * ETFs are handled separately — they can't be screened with single-company
 * ratios, so they get a curated, sourced compliance summary instead.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { listStocks, findStock } from "@/lib/data";
import { SCHOLAR_PROFILES, getScholar } from "@/lib/scholars";
import { screenStock } from "@/lib/screen";
import { isEtf, etfInfo } from "@/lib/etfInfo";
import { indexesContaining } from "@/lib/indexes";
import { reconcile } from "@/lib/reconcile";
import ScholarReconciliation from "@/components/ScholarReconciliation";
import type { StockFundamentals, ScreeningResult, Verdict } from "@/lib/types";
import CompanyLogo from "@/components/CompanyLogo";

const INDEX_RISK_TONE: Record<string, string> = {
  Core: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Growth: "bg-amber-50 text-amber-700 border-amber-200",
  Income: "bg-navy-50 text-navy-800 border-navy-200",
};

const SITE = "https://www.halalgauge.com";

// Only the 5 mainstream named standards (exclude the user-defined "custom").
const NAMED_SCHOLARS = SCHOLAR_PROFILES.filter((s) => s.id !== "custom");

// Pre-build only the most-searched tickers at build time; the long tail renders
// on first request and is CDN-cached (dynamicParams=true). This keeps build
// time flat even if the universe grows to thousands of tickers. Unknown tickers
// 404 via notFound() below.
export function generateStaticParams() {
  return [...listStocks()]
    .sort((a, b) => b.marketCapUsd - a.marketCapUsd)
    .slice(0, 100)
    .map((s) => ({ ticker: s.ticker }));
}
export const dynamicParams = true;
export const revalidate = 86400; // ISR: re-cache on-demand pages daily

function decode(raw: string): string {
  try {
    return decodeURIComponent(raw).toUpperCase().trim();
  } catch {
    return raw.toUpperCase().trim();
  }
}

/** Count how many of the 5 standards return a clean "pass". */
function tallies(stock: StockFundamentals) {
  const results = NAMED_SCHOLARS.map((sc) => screenStock(stock, getScholar(sc.id)));
  const pass = results.filter((r) => r.verdict === "pass").length;
  const fail = results.filter((r) => r.verdict === "fail").length;
  const borderline = results.filter((r) => r.verdict === "borderline").length;
  return { results, pass, fail, borderline };
}

export async function generateMetadata({ params }: { params: Promise<{ ticker: string }> }): Promise<Metadata> {
  const { ticker } = await params;
  const stock = findStock(decode(ticker));
  if (!stock) return { title: "Stock not found" };
  const url = `${SITE}/halal/${encodeURIComponent(stock.ticker)}`;

  // ── ETF metadata ──
  if (isEtf(stock)) {
    const info = etfInfo(stock.ticker);
    const verdictWord = info ? (info.shariah ? "a Shariah-compliant ETF" : "not Shariah-screened") : "an ETF";
    const title = `Is ${stock.ticker} (${stock.name}) halal?`;
    const description =
      `${stock.name} (${stock.ticker}) is ${verdictWord}. ${info?.summary ?? "An ETF's halal status depends on its holdings and structure, not single-company ratios."} Free, no signup.`;
    return {
      title, description, alternates: { canonical: url },
      openGraph: { title, description, url, siteName: "HalalGauge", type: "article" },
      twitter: { card: "summary_large_image", title, description },
    };
  }

  const { pass } = tallies(stock);
  const verdictWord =
    pass === NAMED_SCHOLARS.length ? "halal under all 5 standards"
      : pass === 0 ? "not halal under the mainstream standards"
        : `halal under ${pass} of 5 standards`;
  const title = `Is ${stock.ticker} (${stock.name}) halal?`;
  const description =
    `${stock.name} (${stock.ticker}) is ${verdictWord}. See the verdict under ` +
    `AAOIFI, Mufti Taqi Usmani, S&P DJIM, Ja'fari and the strict view side by side, ` +
    `with every threshold cited to its source. Free, no signup.`;
  return {
    title,
    description,
    alternates: { canonical: url },
    // OG/Twitter images come from the co-located opengraph-image.tsx (a dynamic
    // per-ticker verdict card) — don't set images here or it overrides that.
    openGraph: {
      title, description, url, siteName: "HalalGauge", type: "article",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

const VERDICT_LABEL: Record<Verdict, string> = {
  pass: "Halal", borderline: "Borderline", fail: "Not halal",
};

function verdictTone(v: Verdict): string {
  return v === "pass" ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : v === "borderline" ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-rose-50 text-rose-700 border-rose-200";
}

function VerdictIcon({ v }: { v: Verdict }) {
  if (v === "pass") return <CheckCircle2 size={18} className="text-emerald-600" />;
  if (v === "borderline") return <AlertCircle size={18} className="text-amber-600" />;
  return <XCircle size={18} className="text-rose-600" />;
}

/** Short plain-English reason a standard passed / failed (for the table + FAQ). */
function decidingLine(r: ScreeningResult): string {
  if (!r.sectorPasses) return r.sectorReason;
  const failed = r.ratioChecks.filter((c) => !c.passes);
  if (failed.length === 0) return "All ratio checks pass.";
  return failed
    .map((c) => `${c.label} ${c.value.toFixed(1)}% (limit ${c.threshold}%)`)
    .join("; ");
}

/** A few same-sector tickers for internal linking (SEO crawl depth). */
function relatedTickers(stock: StockFundamentals) {
  return listStocks()
    .filter((s) => s.sector === stock.sector && s.ticker !== stock.ticker)
    .slice(0, 6);
}

function PageShell({ stock, children, jsonld }: { stock: StockFundamentals; children: React.ReactNode; jsonld: object[] }) {
  const related = relatedTickers(stock);
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      {jsonld.map((obj, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }} />
      ))}

      <div className="flex items-center gap-3">
        <CompanyLogo ticker={stock.ticker} size={44} fallbackTone="neutral" />
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
            {stock.ticker} · {stock.sector}
          </div>
          <div className="text-[15px] font-semibold text-gray-800">{stock.name}</div>
        </div>
      </div>

      {children}

      {related.length > 0 && (
        <section className="mt-8">
          <h2 className="text-[14px] font-semibold text-gray-900">Other {stock.sector} tickers</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {related.map((s) => (
              <Link key={s.ticker} href={`/halal/${encodeURIComponent(s.ticker)}`}
                className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[13px] text-gray-700 transition hover:border-gray-400">
                Is {s.ticker} halal?
              </Link>
            ))}
          </div>
        </section>
      )}

      <p className="mt-8 text-[11px] leading-relaxed text-gray-400">
        HalalGauge surfaces published scholarly methodologies with full sourcing; it does not issue
        fatwa or certify any security as halal. Verify with a qualified scholar before investing.
      </p>
    </main>
  );
}

/** ETF view — curated compliance summary (ETFs can't be screened by company ratios). */
function EtfHalalView({ stock }: { stock: StockFundamentals }) {
  const info = etfInfo(stock.ticker);
  const headline = info
    ? info.shariah
      ? `${stock.name} is a purpose-built Shariah-compliant ETF.`
      : `${stock.name} is not Shariah-screened.`
    : `${stock.name} is an ETF — its halal status depends on its holdings.`;

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [{
      "@type": "Question",
      name: `Is ${stock.name} (${stock.ticker}) halal?`,
      acceptedAnswer: { "@type": "Answer", text: `${headline} ${info?.detail ?? ""}` },
    }],
  };
  const breadcrumb = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Halal stock screener", item: SITE },
      { "@type": "ListItem", position: 2, name: `Is ${stock.ticker} halal?`, item: `${SITE}/halal/${encodeURIComponent(stock.ticker)}` },
    ],
  };

  return (
    <PageShell stock={stock} jsonld={[faq, breadcrumb]}>
      <h1 className="mt-5 text-[28px] font-bold leading-tight text-gray-900 sm:text-[34px]" style={{ fontFamily: "var(--font-display)" }}>
        Is {stock.name} ({stock.ticker}) halal?
      </h1>

      <div className={"mt-5 rounded-xl border p-5 " + (info?.shariah ? "border-emerald-200 bg-emerald-50/60" : "border-rose-200 bg-rose-50/60")}>
        <div className="flex items-center gap-2">
          {info?.shariah ? <CheckCircle2 size={20} className="text-emerald-600" /> : <XCircle size={20} className="text-rose-600" />}
          <span className="text-[17px] font-bold text-gray-900">{headline}</span>
        </div>
        {info && <p className="mt-2 text-[14px] leading-relaxed text-gray-700">{info.detail}</p>}
        {info?.provider && <p className="mt-2 text-[12px] text-gray-500">Provider: {info.provider}</p>}
      </div>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-[15px] font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
          Why ETFs are screened differently
        </h2>
        <p className="mt-2 text-[14px] leading-relaxed text-gray-700">
          An ETF holds dozens or hundreds of underlying securities, so its halal status depends on
          (1) whether those holdings are individually Shariah-compliant, (2) whether the fund screens
          and purifies, and (3) the fund&apos;s own structure (e.g. interest earned on cash). You can&apos;t
          judge it with a single company&apos;s debt-to-market-cap ratio — which is why HalalGauge shows a
          curated summary for funds rather than a company screen.
        </p>
      </section>

      <section className="mt-6 flex flex-wrap gap-3">
        {info?.sourceUrl && (
          <a href={info.sourceUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-gray-400">
            Fund details <ArrowRight size={14} />
          </a>
        )}
        <Link href="/screen" className="inline-flex items-center gap-1.5 rounded-md bg-navy-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-700">
          Screen individual stocks <ArrowRight size={14} />
        </Link>
        <Link href="/methodology" className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-gray-400">
          How screening works <ArrowRight size={14} />
        </Link>
      </section>
    </PageShell>
  );
}

export default async function HalalTickerPage({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const stock = findStock(decode(ticker));
  if (!stock) notFound();

  // ETFs get a dedicated curated view (can't be company-screened).
  if (isEtf(stock)) return <EtfHalalView stock={stock} />;

  const { results, pass, fail, borderline } = tallies(stock);
  const inIndexes = indexesContaining(stock.ticker);
  const rec = reconcile(
    stock,
    SCHOLAR_PROFILES,
    results.map((r) => ({ id: r.scholarId, short: getScholar(r.scholarId).short, verdict: r.verdict })),
  );

  const headline =
    pass === NAMED_SCHOLARS.length
      ? `${stock.name} is considered halal under all 5 mainstream standards.`
      : pass === 0
        ? `${stock.name} is not considered halal under the mainstream standards.`
        : `${stock.name} is considered halal under ${pass} of 5 standards — the scholars disagree.`;

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Is ${stock.name} (${stock.ticker}) stock halal?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${headline} HalalGauge screens ${stock.ticker} under AAOIFI, Mufti Taqi Usmani, S&P DJIM, Ja'fari and the strict view, citing every threshold to its primary source.`,
        },
      },
      {
        "@type": "Question",
        name: `Is ${stock.ticker} halal under Mufti Taqi Usmani?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: (() => {
            const t = results.find((r) => r.scholarId === "taqi_usmani");
            return t ? `Under Mufti Taqi Usmani's methodology, ${stock.ticker} is ${VERDICT_LABEL[t.verdict].toLowerCase()}. ${decidingLine(t)}` : "";
          })(),
        },
      },
    ],
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Halal stock screener", item: SITE },
      { "@type": "ListItem", position: 2, name: `Is ${stock.ticker} halal?`, item: `${SITE}/halal/${encodeURIComponent(stock.ticker)}` },
    ],
  };

  return (
    <PageShell stock={stock} jsonld={[faq, breadcrumb]}>
      <h1
        className="mt-5 text-[28px] font-bold leading-tight text-gray-900 sm:text-[34px]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Is {stock.name} ({stock.ticker}) halal?
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-gray-700">{headline}{" "}
        Below is the verdict under each of the five mainstream scholarly standards, with the
        deciding numbers and the source behind every threshold.
      </p>
      {stock.balanceSheet?.quarter && (
        <p className="mt-2 text-[12px] text-gray-500">
          Ratios computed from {stock.name}&apos;s {stock.balanceSheet.quarter} filing
          {stock.balanceSheet.filingUrl ? <> (<a href={stock.balanceSheet.filingUrl} target="_blank" rel="noopener noreferrer" className="text-navy-700 underline hover:text-navy-900">source</a>)</> : null}.
          Verdicts are re-computed when new financials are filed.
        </p>
      )}

      {/* Verdict table */}
      <section className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
          {stock.ticker} verdict by standard · {pass} halal · {borderline} borderline · {fail} not halal
        </div>
        <ul>
          {results.map((r) => (
            <li key={r.scholarId} className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4 last:border-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <VerdictIcon v={r.verdict} />
                  <span className="font-semibold text-gray-900">{r.scholarLabel}</span>
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-gray-600">{decidingLine(r)}</p>
              </div>
              <span className={"shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold " + verdictTone(r.verdict)}>
                {VERDICT_LABEL[r.verdict]}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Multi-standard reconciliation — consensus + why they differ */}
      <ScholarReconciliation rec={rec} />

      {/* Key metrics */}
      <section className="mt-8">
        <h2 className="text-[18px] font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
          The numbers behind the verdict
        </h2>
        <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            ["Interest-bearing debt / market cap", stock.debtToMarketCapPct],
            ["Cash + securities / market cap", stock.cashSecuritiesToMarketCapPct],
            ["Receivables / market cap", stock.receivablesToMarketCapPct],
            ["Impermissible income / revenue", stock.impermissibleIncomePct],
            ["Illiquid (tangible) assets / total", stock.illiquidAssetsToTotalAssetsPct],
          ].map(([label, val]) => (
            <div key={label as string} className="rounded-lg border border-gray-200 bg-gray-50/60 p-3">
              <dt className="text-[11px] leading-snug text-gray-500">{label}</dt>
              <dd className="mt-1 font-mono text-[17px] font-semibold text-gray-900">
                {typeof val === "number" ? `${val.toFixed(1)}%` : "—"}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-[12px] leading-relaxed text-gray-500">
          Thresholds and methodology differ by scholar — e.g. AAOIFI caps interest-bearing debt at
          30% of market cap, DJIM at 33%, and Mufti Taqi additionally requires tangible assets to be
          at least 20% of total assets. That&apos;s why two screeners can disagree on the same stock.
        </p>
      </section>

      {/* CTAs */}
      <section className="mt-8 flex flex-wrap gap-3">
        <Link href={`/screen?ticker=${encodeURIComponent(stock.ticker)}`}
          className="inline-flex items-center gap-1.5 rounded-md bg-navy-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-700">
          Screen {stock.ticker} interactively <ArrowRight size={14} />
        </Link>
        <Link href={`/balance-sheet/${encodeURIComponent(stock.ticker)}`}
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-gray-400">
          See the full balance sheet <ArrowRight size={14} />
        </Link>
        <Link href="/methodology"
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-gray-400">
          How the methodologies work <ArrowRight size={14} />
        </Link>
      </section>

      {/* Cross-link: which HalalGauge indexes hold this stock */}
      {inIndexes.length > 0 && (
        <section className="mt-8 rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-[15px] font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
            {stock.ticker} appears in {inIndexes.length === 1 ? "this halal index" : "these halal indexes"}
          </h2>
          <p className="mt-1 text-[13px] leading-relaxed text-gray-600">
            It passes the AAOIFI screen and is large enough to be a current constituent.
          </p>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {inIndexes.map((ix) => (
              <Link key={ix.slug} href={`/indexes/${ix.slug}`}
                className="group inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50/60 px-3 py-2 transition hover:border-gray-400">
                <span className={"rounded-full border px-2 py-0.5 text-[10px] font-semibold " + (INDEX_RISK_TONE[ix.risk] ?? "")}>{ix.risk}</span>
                <span className="text-[13px] font-semibold text-gray-900">{ix.name}</span>
                <ArrowRight size={13} className="text-gray-400 transition group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Sources */}
      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-5">
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">Sources</div>
        <ul className="mt-2 space-y-1.5 text-[13px] text-gray-600">
          {NAMED_SCHOLARS.map((sc) => (
            <li key={sc.id}>
              <span className="font-medium text-gray-800">{sc.short}:</span>{" "}
              {sc.sourceUrl ? (
                <a href={sc.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-navy-700 underline hover:text-navy-900">
                  {sc.sourceLabel}
                </a>
              ) : (
                sc.sourceLabel
              )}
            </li>
          ))}
          {stock.balanceSheet?.filingUrl && (
            <li>
              <span className="font-medium text-gray-800">Financials:</span>{" "}
              <a href={stock.balanceSheet.filingUrl} target="_blank" rel="noopener noreferrer" className="text-navy-700 underline hover:text-navy-900">
                {stock.balanceSheet.quarter} filing
              </a>
            </li>
          )}
        </ul>
      </section>
    </PageShell>
  );
}
