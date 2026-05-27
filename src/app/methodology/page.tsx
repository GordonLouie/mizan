import Link from "next/link";
import { SCHOLAR_PROFILES } from "@/lib/scholars";
import { listStocks } from "@/lib/data";
import { ExternalLink, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Methodology · Mizan",
  description:
    "How Mizan screens stocks across six scholarly methodologies — with primary-source citations for every threshold.",
};

interface Source {
  title: string;
  url: string;
  kind: "standard" | "publication" | "ruling" | "index" | "fatwa";
  year?: number;
  cites: string;
}

const SOURCES: Record<string, Source[]> = {
  aaoifi: [
    {
      title: "AAOIFI Shariah Standard No. 21 — Financial Papers (Shares and Bonds)",
      url: "https://aaoifi.com/shariaa-standards/?lang=en",
      kind: "standard",
      year: 2017,
      cites:
        "5% cap on impermissible income; 30% caps on interest-bearing debt and on liquid (cash + securities) assets, measured against market capitalisation.",
    },
    {
      title: "AAOIFI Governance Standards — Shariah Supervisory Board",
      url: "https://aaoifi.com/governance-and-ethics-board/?lang=en",
      kind: "standard",
      cites:
        "Sector exclusion enumeration (alcohol, tobacco, pork, gambling, conventional finance, weapons, adult entertainment).",
    },
  ],
  taqi_usmani: [
    {
      title: "Mufti Muhammad Taqi Usmani — Introduction to Islamic Finance",
      url: "https://www.muftitaqiusmani.com/en/?page_id=1175",
      kind: "publication",
      year: 1998,
      cites:
        "Adoption of AAOIFI-style thresholds plus the additional requirement that illiquid (tangible) assets exceed a meaningful share of total assets so shares represent ownership of real assets, not pure cash & debt.",
    },
    {
      title: "Mufti Taqi Usmani — Principles of Shariah Governing Islamic Investment Funds",
      url: "https://www.muftitaqiusmani.com/en/?page_id=1187",
      kind: "publication",
      cites:
        "Capital-gain purification requirement: gain on disposal of shares must be cleansed in proportion to impermissible income, in addition to dividend purification.",
    },
  ],
  djim: [
    {
      title: "S&P Dow Jones Indices — Dow Jones Islamic Market Indices Methodology",
      url: "https://www.spglobal.com/spdji/en/documents/methodologies/methodology-dj-islamic-market-indices.pdf",
      kind: "index",
      year: 2024,
      cites:
        "33% cap (computed as one-third) on interest-bearing debt, on liquid assets, and on accounts receivable, each measured against trailing 24-month average market capitalisation.",
    },
    {
      title: "DJIM — Shariah Supervisory Board",
      url: "https://www.spglobal.com/spdji/en/landing/topic/sharia-supervisory-board/",
      kind: "standard",
      cites:
        "Composition of the supervisory board and the published statement of the sector exclusions DJIM applies.",
    },
  ],
  jafari: [
    {
      title: "Office of Ayatollah Sayyid Ali al-Sistani — Code of Practice (English)",
      url: "https://www.sistani.org/english/book/46/",
      kind: "ruling",
      cites:
        "Rulings on permissible income, dealings in interest-bearing instruments, and the khums obligation (one-fifth of net annual surplus) treated by Mizan as the equivalent of capital-gain purification.",
    },
    {
      title: "Sistani — Q&A on share trading and stock-market participation",
      url: "https://www.sistani.org/english/qa/01155/",
      kind: "fatwa",
      cites:
        "Specific guidance that trading in shares of companies with impermissible income is conditional on cleansing the proportionate share of that income.",
    },
  ],
  strict: [
    {
      title: "Mufti Imran Nazar Hussein — Treatise on Riba",
      url: "https://imranhosein.org/articles/articles-by-iih/finance-and-economics/",
      kind: "publication",
      cites:
        "Representative articulation of the zero-tolerance view: any interest exposure, however small, renders the underlying investment impermissible.",
    },
    {
      title: "Hizb ut-Tahrir / Maulana Tahir-ul-Qadri (selected fatawa) — public statements on equity investing",
      url: "https://www.minhaj.org/english/tid/8688/",
      kind: "fatwa",
      cites:
        "Minority opinions holding the major-school thresholds (5% / 30%) as concessions; Mizan represents this view by setting every cap to 0%.",
    },
  ],
  custom: [
    {
      title: "Your scholar of taqlid",
      url: "/custom",
      kind: "standard",
      cites:
        "The custom profile is yours to configure. Mizan defaults to AAOIFI thresholds; edit them at /custom to match the scholar you follow.",
    },
  ],
};

const KIND_LABEL: Record<Source["kind"], string> = {
  standard: "Standard",
  publication: "Publication",
  ruling: "Ruling",
  index: "Index methodology",
  fatwa: "Fatwa",
};

export default function MethodologyPage() {
  return (
    <div className="pb-20">
      {/* PAGE HEADER */}
      <header className="pt-6">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Trust centre · Methodology
        </div>
        <h1
          className="mt-3 text-[36px] font-bold leading-[1.1] text-gray-900 sm:text-[44px]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          How Mizan screens stocks
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-gray-600">
          Every threshold in Mizan traces back to a public, primary source — the original
          standard, the scholar&apos;s own publication, or the index methodology. No
          black-box scores.
        </p>
      </header>

      {/* THE TWO SCREENS */}
      <section className="mt-16">
        <SectionHead
          kicker="How the engine works"
          title="Sector first, then financial ratios"
        />
        <div className="mt-6 max-w-2xl space-y-4 text-[15px] leading-relaxed text-gray-700">
          <p>
            Every stock goes through two screens, in order. If the sector screen fails,
            the verdict is <strong className="text-gray-900">Not halal</strong> and the
            financial ratios are not applied — a company that earns its money from a
            prohibited activity cannot be rescued by a clean balance sheet.
          </p>
        </div>
        <ol className="mt-6 max-w-2xl space-y-5 pl-5 text-[14px] leading-relaxed text-gray-700 [list-style:decimal]">
          <li>
            <strong className="text-gray-900">Sector exclusion.</strong> Alcohol production
            / sale, gambling, tobacco, conventional banking / insurance / interest-based
            lending, weapons and defence (most profiles), pork products, adult
            entertainment, non-halal food processing. Each profile chooses which of these
            to apply.
          </li>
          <li>
            <strong className="text-gray-900">Financial ratio screen.</strong> Between
            three and five ratio checks depending on the scholar:
            <ul className="mt-3 space-y-1.5 pl-5 [list-style:disc]">
              <li>Impermissible income / revenue.</li>
              <li>Interest-bearing debt / market cap.</li>
              <li>Cash + interest-bearing securities / market cap.</li>
              <li>Accounts receivable / market cap (DJIM only).</li>
              <li>
                <span className="font-semibold text-navy-700">
                  Illiquid (tangible) assets / total assets
                </span>{" "}
                — Mufti Taqi specifically.
              </li>
            </ul>
          </li>
        </ol>
      </section>

      {/* PER-SCHOLAR PROFILES */}
      <section className="mt-20">
        <SectionHead
          kicker="Per-scholar references"
          title="The six profiles and the sources behind them"
        />

        <div className="mt-8 space-y-12">
          {SCHOLAR_PROFILES.map((p) => {
            const sources = SOURCES[p.id] ?? [];
            return (
              <article
                key={p.id}
                className="border-t border-gray-200 pt-8"
              >
                {/* Scholar heading */}
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3
                    className="text-[22px] font-bold leading-tight text-gray-900"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {p.label}
                  </h3>
                  <span className="rounded-full bg-navy-50 px-2.5 py-0.5 text-[11px] font-semibold text-navy-700">
                    {p.short}
                  </span>
                </div>
                <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-gray-600">
                  {p.blurb}
                </p>

                {/* Two-column: thresholds + sources */}
                <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
                  {/* THRESHOLDS */}
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                      Thresholds
                    </div>
                    <dl className="mt-3 divide-y divide-gray-100">
                      <Threshold name="Impermissible income / revenue" op="≤" v={p.maxImpermissibleIncomePct} />
                      <Threshold name="Interest-bearing debt / market cap" op="≤" v={p.maxDebtToMarketCapPct} />
                      <Threshold name="Cash + securities / market cap" op="≤" v={p.maxCashSecuritiesToMarketCapPct} />
                      {p.maxReceivablesToMarketCapPct !== null && (
                        <Threshold name="Receivables / market cap" op="≤" v={p.maxReceivablesToMarketCapPct} />
                      )}
                      {p.minIlliquidAssetsToTotalAssetsPct !== null && (
                        <Threshold
                          name="Illiquid assets / total assets"
                          op="≥"
                          v={p.minIlliquidAssetsToTotalAssetsPct}
                          emphasised
                        />
                      )}
                      <div className="flex items-center justify-between py-2.5 text-[12px]">
                        <dt className="text-gray-600">Purification scope</dt>
                        <dd className="italic text-gray-700">
                          {p.purificationScope === "dividends_and_gains"
                            ? "dividends + capital gains"
                            : "dividends only"}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {/* SOURCES */}
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                      Primary sources
                    </div>
                    <ul className="mt-3 space-y-4">
                      {sources.map((s, i) => (
                        <li key={i} className="border-l-2 border-gray-200 pl-4">
                          <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em]">
                            <span className="text-gray-700">{KIND_LABEL[s.kind]}</span>
                            {s.year && (
                              <span className="text-gray-400">· {s.year}</span>
                            )}
                          </div>
                          {s.url.startsWith("http") ? (
                            <a
                              href={s.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-flex items-start gap-1.5 text-[14px] font-medium leading-snug text-navy-700 hover:text-navy-900 hover:underline"
                            >
                              <span>{s.title}</span>
                              <ExternalLink size={12} className="mt-1 flex-shrink-0" />
                            </a>
                          ) : (
                            <Link
                              href={s.url}
                              className="mt-2 inline-block text-[14px] font-medium leading-snug text-navy-700 hover:text-navy-900 hover:underline"
                            >
                              {s.title}
                            </Link>
                          )}
                          <p className="mt-1.5 text-[12px] leading-relaxed text-gray-600">
                            {s.cites}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* WORKED EXAMPLE */}
      <section className="mt-20 border-t border-gray-200 pt-10">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-600">
          Worked example
        </div>
        <h2
          className="mt-2 text-[24px] font-bold leading-tight text-gray-900 sm:text-[28px]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Why scholars disagree on AMZN
        </h2>
        <div className="mt-5 max-w-2xl space-y-4 text-[14px] leading-relaxed text-gray-700">
          <p>
            Amazon&apos;s interest-bearing debt (≈6.5% of market cap) sits well below
            AAOIFI&apos;s 30% cap and DJIM&apos;s 33% cap, and its impermissible income
            (≈2.8% of revenue) is under every scholar&apos;s threshold. Under AAOIFI and
            DJIM, AMZN is Halal.
          </p>
          <p>
            Mufti Taqi Usmani adds the illiquid-asset floor: tangible assets must exceed
            20% of total assets. Amazon&apos;s ratio is ≈12% — overwhelmingly intangible
            (brand, code, AWS goodwill). Under his published standard, AMZN does not
            represent ownership of enough real assets to be tradable, and the verdict
            flips to <strong className="text-gray-900">Not halal</strong>.
          </p>
          <p>
            No standard is &quot;more correct.&quot; The disagreement is real, published,
            and held by hundreds of millions of Muslims. Mizan&apos;s job is to surface it.
          </p>
        </div>
        <div className="mt-5">
          <Link
            href="/screen?ticker=AMZN"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-700 hover:text-navy-900"
          >
            See AMZN under all six scholars <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* DATA SOURCES */}
      <section className="mt-20 border-t border-gray-200 pt-10">
        <SectionHead
          kicker="Where the data comes from"
          title="Financial fundamentals"
        />
        <div className="mt-5 max-w-2xl space-y-3 text-[14px] leading-relaxed text-gray-700">
          <p>
            Financial fundamentals are sourced from Financial Modeling Prep in Year 1 and
            graduate to Refinitiv / SIX Financial as international coverage expands. Mizan
            computes the Shariah ratios in-house from balance-sheet primitives — we do not
            rely on any third party&apos;s pre-computed &quot;halal score&quot;.
          </p>
          <p>
            Stock fundamentals refresh nightly. When a company files a 10-K, 10-Q, or
            equivalent, we re-screen every affected position within four hours and notify
            Pro-tier users whose portfolio verdicts change.
          </p>
          <p className="text-[12px] italic text-gray-500">
            Current prototype screens a {listStocks().length}-ticker representative sample.
            FMP live-data integration is wired in; production coverage scales to any listed
            equity as the daily enrichment script runs.
          </p>
        </div>
      </section>

      {/* OVERSIGHT */}
      <section className="mt-20 border-t border-gray-200 pt-10">
        <SectionHead
          kicker="Oversight"
          title="Shariah Supervisory Board — not yet"
        />
        <div className="mt-5 max-w-2xl space-y-3 text-[14px] leading-relaxed text-gray-700">
          <p>
            Mizan does not yet have a Shariah Supervisory Board. Until one is seated,
            credibility comes entirely from the primary-source citations on this page —
            every threshold in the engine traces back to a public document you can verify.
            That citation chain is intentionally the credibility floor.
          </p>
          <p>
            When a board is engaged, the plan is: quarterly methodology review, audited
            sample of AI Q&amp;A outputs, and an annual public Shariah report co-signed by
            named scholars. We will not publish any name before written engagement is in
            place — claims of supervision without documentation are common in this
            industry and we refuse to participate.
          </p>
        </div>
      </section>

      {/* CORRECTIONS */}
      <section className="mt-20 border-t border-gray-200 pt-10">
        <SectionHead
          kicker="Disagreements & corrections"
          title="We welcome challenge"
        />
        <p className="mt-5 max-w-2xl text-[14px] leading-relaxed text-gray-700">
          If you believe a scholar profile in Mizan misrepresents the underlying
          scholarship, write to{" "}
          <a
            href="mailto:methodology@mizan.app"
            className="text-navy-700 underline hover:text-navy-900"
          >
            methodology@mizan.app
          </a>{" "}
          with the citation. Every note is reviewed against the cited primary source and a
          public changelog entry is added if a profile changes.
        </p>
      </section>

      <p className="mt-16 text-center text-[11px] text-gray-500">
        Last updated 22 May 2026.{" "}
        <Link href="/" className="text-navy-700 underline hover:text-navy-900">
          Back to home
        </Link>.
      </p>
    </div>
  );
}

function SectionHead({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
        {kicker}
      </div>
      <h2
        className="mt-2 text-[24px] font-bold leading-tight text-gray-900 sm:text-[28px]"
        style={{ fontFamily: "Georgia, serif" }}
      >
        {title}
      </h2>
    </div>
  );
}

function Threshold({
  name,
  op,
  v,
  emphasised,
}: {
  name: string;
  op: "≤" | "≥";
  v: number;
  emphasised?: boolean;
}) {
  return (
    <div
      className={
        "flex items-center justify-between py-2.5 text-[13px] " +
        (emphasised ? "font-semibold text-navy-700" : "text-gray-700")
      }
    >
      <dt>{name}</dt>
      <dd className="font-mono tabular-nums">
        {op} {v}%
      </dd>
    </div>
  );
}
