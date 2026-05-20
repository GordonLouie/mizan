import Link from "next/link";
import { SCHOLAR_PROFILES } from "@/lib/scholars";

export const metadata = { title: "Methodology · Mizan" };

export default function MethodologyPage() {
  return (
    <article className="prose prose-slate mx-auto max-w-3xl">
      <div className="not-prose mb-2 inline-block rounded-full bg-navy-50 px-3 py-1 text-xs font-medium text-navy-800">
        Trust center
      </div>
      <h1 className="text-3xl font-bold text-gray-900">How Mizan screens stocks</h1>
      <p className="mt-2 text-sm text-gray-600">
        We publish the methodology behind every scholar profile in Mizan. No black-box
        compliance scores; every verdict can be reconstructed from the financial data and
        the published thresholds.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-gray-900">The two screens</h2>
      <p className="mt-2 text-sm leading-7 text-gray-700">
        Every stock goes through two screens, in order. If the first fails, the verdict
        is FAIL and we don&apos;t apply the second.
      </p>
      <p className="mt-3 text-sm leading-7 text-gray-700">
        <strong>1. Sector exclusion.</strong> Companies whose primary business is in a
        prohibited sector are excluded outright. Sectors we screen: alcohol production
        or sales, gambling, tobacco, conventional banking / insurance / interest-based
        lending, weapons and defense (most profiles), pork products, adult
        entertainment, and non-halal food processing. Each scholar profile chooses which
        of these to apply.
      </p>
      <p className="mt-3 text-sm leading-7 text-gray-700">
        <strong>2. Financial ratio screen.</strong> If the sector passes, we apply
        between three and five financial ratio checks, depending on the scholar.
        Thresholds vary; the ratios we measure are:
      </p>
      <ul className="ml-5 mt-2 list-disc text-sm leading-7 text-gray-700">
        <li>Impermissible income as a percentage of revenue.</li>
        <li>Interest-bearing debt as a percentage of market capitalization.</li>
        <li>Cash and interest-bearing securities as a percentage of market capitalization.</li>
        <li>Accounts receivable as a percentage of market capitalization (some standards).</li>
        <li>Illiquid (tangible) assets as a percentage of total assets (Mufti Taqi Usmani specifically).</li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold text-gray-900">The six profiles we ship</h2>
      <div className="mt-3 space-y-4">
        {SCHOLAR_PROFILES.map((p) => (
          <div key={p.id} className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-baseline justify-between">
              <h3 className="text-base font-semibold text-gray-900">{p.label}</h3>
              <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                {p.short}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-700">{p.blurb}</p>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-700">
              <dt>Impermissible income</dt>
              <dd className="text-right">≤ {p.maxImpermissibleIncomePct}%</dd>
              <dt>Interest-bearing debt / market cap</dt>
              <dd className="text-right">≤ {p.maxDebtToMarketCapPct}%</dd>
              <dt>Cash + securities / market cap</dt>
              <dd className="text-right">≤ {p.maxCashSecuritiesToMarketCapPct}%</dd>
              {p.maxReceivablesToMarketCapPct !== null && (
                <>
                  <dt>Receivables / market cap</dt>
                  <dd className="text-right">≤ {p.maxReceivablesToMarketCapPct}%</dd>
                </>
              )}
              {p.minIlliquidAssetsToTotalAssetsPct !== null && (
                <>
                  <dt className="font-semibold text-navy-700">Illiquid assets / total assets</dt>
                  <dd className="text-right font-semibold text-navy-700">≥ {p.minIlliquidAssetsToTotalAssetsPct}%</dd>
                </>
              )}
              <dt>Purification scope</dt>
              <dd className="text-right italic">
                {p.purificationScope === "dividends_and_gains"
                  ? "dividends + capital gains"
                  : "dividends only"}
              </dd>
            </dl>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">Where the data comes from</h2>
      <p className="mt-3 text-sm leading-7 text-gray-700">
        Financial fundamentals are sourced from Financial Modeling Prep (year 1) and will
        graduate to Refinitiv / SIX Financial as we scale international coverage. We
        compute the Shariah ratios in-house from balance-sheet primitives — we do not
        rely on any third party&apos;s pre-computed &quot;halal score&quot; (such scores
        exist, but they reflect a single standard).
      </p>
      <p className="mt-3 text-sm leading-7 text-gray-700">
        Stock fundamentals refresh nightly. When a company files a 10-K, 10-Q, or
        equivalent, we re-screen every affected position within four hours and notify
        Pro-tier users whose portfolios&apos; verdicts change.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">The Shariah Supervisory Board</h2>
      <p className="mt-3 text-sm leading-7 text-gray-700">
        Mizan&apos;s Shariah Supervisory Board reviews every methodology before release,
        meets quarterly, audits a sample of the AI Q&A outputs each quarter, and
        co-signs an annual public Shariah report.
      </p>
      <p className="mt-3 text-sm leading-7 text-gray-700">
        Board composition is published as scholars confirm. We will not publish names
        before written engagement is in place.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">Changelog</h2>
      <p className="mt-3 text-sm leading-7 text-gray-700">
        Every methodology change is recorded with date, scholar approval, and impact
        assessment. The changelog is published at this page once the product reaches
        public launch.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">Disagreements and corrections</h2>
      <p className="mt-3 text-sm leading-7 text-gray-700">
        We welcome challenge. If you believe a scholar profile in Mizan misrepresents
        the underlying scholarship, write to{" "}
        <a href="mailto:methodology@mizan.app" className="text-navy-700 underline">
          methodology@mizan.app
        </a>{" "}
        with the citation. Our Shariah Board reviews every such note.
      </p>

      <p className="mt-12 text-xs text-gray-500">
        Last updated 18 May 2026. <Link href="/" className="text-navy-700 underline">Back to home.</Link>
      </p>
    </article>
  );
}
