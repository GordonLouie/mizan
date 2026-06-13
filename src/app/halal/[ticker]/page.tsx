/**
 * /halal/[ticker] — programmatic SEO page, one per ticker.
 *
 * This is the growth engine: a server-rendered, statically-generated, fully
 * indexable page that answers "Is {Company} halal?" with the verdict under all
 * 5 mainstream scholarly standards, the deciding metrics, and cited sources.
 *
 * Unlike /screen (client-rendered, not indexable) this page exists so Google can
 * crawl a real answer for every ticker — the same play that makes Musaffa rank
 * for "is X halal". generateStaticParams pre-renders all tickers at build time;
 * generateMetadata + JSON-LD give rich search results.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { listStocks, findStock } from "@/lib/data";
import { SCHOLAR_PROFILES, getScholar } from "@/lib/scholars";
import { screenStock } from "@/lib/screen";
import type { StockFundamentals, ScreeningResult, Verdict } from "@/lib/types";
import CompanyLogo from "@/components/CompanyLogo";

const SITE = "https://mizaninvesting.com";

// Only the 5 mainstream named standards (exclude the user-defined "custom").
const NAMED_SCHOLARS = SCHOLAR_PROFILES.filter((s) => s.id !== "custom");

// Pre-render a static page for every ticker; unknown tickers 404.
export function generateStaticParams() {
  return listStocks().map((s) => ({ ticker: s.ticker }));
}
export const dynamicParams = false;

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
  if (!stock) return { title: "Stock not found — Mizan" };
  const { pass } = tallies(stock);
  const verdictWord =
    pass === NAMED_SCHOLARS.length ? "halal under all 5 standards"
      : pass === 0 ? "not halal under the mainstream standards"
        : `halal under ${pass} of 5 standards`;
  const title = `Is ${stock.ticker} (${stock.name}) halal? — Mizan`;
  const description =
    `${stock.name} (${stock.ticker}) is ${verdictWord}. See the verdict under ` +
    `AAOIFI, Mufti Taqi Usmani, S&P DJIM, Ja'fari and the strict view side by side, ` +
    `with every threshold cited to its source. Free, no signup.`;
  const url = `${SITE}/halal/${encodeURIComponent(stock.ticker)}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    // OG/Twitter images come from the co-located opengraph-image.tsx (a dynamic
    // per-ticker verdict card) — don't set images here or it overrides that.
    openGraph: {
      title, description, url, siteName: "Mizan", type: "article",
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

export default async function HalalTickerPage({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const stock = findStock(decode(ticker));
  if (!stock) notFound();

  const { results, pass, fail, borderline } = tallies(stock);

  const headline =
    pass === NAMED_SCHOLARS.length
      ? `${stock.name} is considered halal under all 5 mainstream standards.`
      : pass === 0
        ? `${stock.name} is not considered halal under the mainstream standards.`
        : `${stock.name} is considered halal under ${pass} of 5 standards — the scholars disagree.`;

  // A few same-sector tickers for internal linking (SEO crawl depth).
  const related = listStocks()
    .filter((s) => s.sector === stock.sector && s.ticker !== stock.ticker)
    .slice(0, 6);

  // JSON-LD: FAQ + breadcrumbs for rich results.
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Is ${stock.name} (${stock.ticker}) stock halal?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${headline} Mizan screens ${stock.ticker} under AAOIFI, Mufti Taqi Usmani, S&P DJIM, Ja'fari and the strict view, citing every threshold to its primary source.`,
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
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      {/* Header */}
      <div className="flex items-center gap-3">
        <CompanyLogo ticker={stock.ticker} size={44} fallbackTone="neutral" />
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
            {stock.ticker} · {stock.sector}
          </div>
          <div className="text-[15px] font-semibold text-gray-800">{stock.name}</div>
        </div>
      </div>

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
          className="inline-flex items-center gap-1.5 rounded-md bg-navy-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-900">
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

      {/* Internal links */}
      {related.length > 0 && (
        <section className="mt-8">
          <h2 className="text-[14px] font-semibold text-gray-900">Other {stock.sector} stocks</h2>
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
        Mizan surfaces published scholarly methodologies with full sourcing; it does not issue
        fatwa or certify any stock as halal. Verify with a qualified scholar before investing.
      </p>
    </main>
  );
}
