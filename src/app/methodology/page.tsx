import Link from "next/link";
import { SCHOLAR_PROFILES } from "@/lib/scholars";
import { Card, PageHeader, Pill } from "@/components/ui";
import { ExternalLink, BookOpen } from "lucide-react";

export const metadata = {
  title: "Methodology · Mizan",
  description:
    "How Mizan screens stocks across six scholarly methodologies — with primary-source citations for every threshold.",
};

// ────────────────────────────────────────────────────────────────────────────
// Primary sources per scholar profile.
// Citations link directly to the published methodology document.
// Every threshold in src/lib/scholars.ts must trace back to one of these.
// ────────────────────────────────────────────────────────────────────────────

interface Source {
  /** Display title — used as link text. */
  title: string;
  /** URL to the primary source. */
  url: string;
  /** Type: original standard, scholar publication, official ruling, market index methodology. */
  kind: "standard" | "publication" | "ruling" | "index" | "fatwa";
  /** Year published / last updated, if known. */
  year?: number;
  /** Why we cite it — what specific rules it supplies. */
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
      cites: "Sector exclusion enumeration (alcohol, tobacco, pork, gambling, conventional finance, weapons, adult entertainment).",
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

const KIND_TONE: Record<Source["kind"], "navy" | "gold" | "neutral"> = {
  standard: "navy",
  publication: "neutral",
  ruling: "gold",
  index: "navy",
  fatwa: "gold",
};

export default function MethodologyPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        kicker="Trust center"
        title="How Mizan screens stocks"
        description="Every threshold in Mizan traces back to a public, primary source — the original standard, the scholar's own publication, or the index methodology. No black-box scores."
      />

      {/* The two screens */}
      <Card>
        <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
          The two screens
        </div>
        <h2 className="mt-2 text-2xl font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
          Sector first, then financial ratios
        </h2>
        <p className="mt-4 text-sm leading-7 text-gray-700">
          Every stock goes through two screens, in order. If the sector screen fails,
          the verdict is <strong>Not halal</strong> and the financial ratios are not
          applied — a company that earns its money from a prohibited activity cannot be
          rescued by a clean balance sheet.
        </p>
        <ol className="mt-4 ml-5 list-decimal space-y-3 text-sm leading-7 text-gray-700">
          <li>
            <strong>Sector exclusion.</strong> Alcohol production / sale, gambling,
            tobacco, conventional banking / insurance / interest-based lending, weapons
            and defense (most profiles), pork products, adult entertainment, non-halal
            food processing. Each profile chooses which of these to apply.
          </li>
          <li>
            <strong>Financial ratio screen.</strong> Between three and five ratio checks
            depending on the scholar:
            <ul className="ml-5 mt-2 list-disc space-y-1">
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
      </Card>

      {/* Profiles + primary sources */}
      <section className="space-y-5">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-widest text-amber-700">
            Per-scholar references
          </div>
          <h2 className="mt-1 text-2xl font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
            The six profiles and the sources behind them
          </h2>
        </div>

        {SCHOLAR_PROFILES.map((p) => {
          const sources = SOURCES[p.id] ?? [];
          return (
            <Card key={p.id} padded={false}>
              <div className="border-b border-gray-100 px-6 py-5 sm:px-8">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3
                    className="text-lg font-bold text-gray-900"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {p.label}
                  </h3>
                  <Pill tone="navy">{p.short}</Pill>
                </div>
                <p className="mt-2 text-sm text-gray-700">{p.blurb}</p>
              </div>

              <div className="grid grid-cols-1 gap-px bg-gray-100 md:grid-cols-2">
                {/* Thresholds */}
                <div className="bg-white p-6">
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                    Thresholds
                  </div>
                  <dl className="mt-3 space-y-2 text-sm">
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
                    <div className="flex items-center justify-between border-t border-gray-100 pt-2 text-xs">
                      <dt className="text-gray-600">Purification scope</dt>
                      <dd className="italic text-gray-700">
                        {p.purificationScope === "dividends_and_gains"
                          ? "dividends + capital gains"
                          : "dividends only"}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Sources */}
                <div className="bg-white p-6">
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                    Primary sources
                  </div>
                  <ul className="mt-3 space-y-3">
                    {sources.map((s, i) => (
                      <li key={i} className="border-l-2 border-gray-200 pl-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <Pill tone={KIND_TONE[s.kind]} size="sm">
                            {KIND_LABEL[s.kind]}
                          </Pill>
                          {s.year && (
                            <span className="text-[11px] text-gray-500">{s.year}</span>
                          )}
                        </div>
                        {s.url.startsWith("http") ? (
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-flex items-start gap-1 text-sm font-medium text-navy-700 hover:underline"
                          >
                            <span>{s.title}</span>
                            <ExternalLink size={12} className="mt-1 flex-shrink-0" />
                          </a>
                        ) : (
                          <Link href={s.url} className="mt-1 inline-block text-sm font-medium text-navy-700 hover:underline">
                            {s.title}
                          </Link>
                        )}
                        <p className="mt-1 text-xs leading-5 text-gray-600">{s.cites}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          );
        })}
      </section>

      {/* Worked example */}
      <Card className="bg-amber-50/40">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-amber-100 text-amber-700">
            <BookOpen size={16} />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-amber-700">
              Worked example
            </div>
            <h2 className="mt-1 text-xl font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
              Why scholars disagree on AMZN
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-700">
              Amazon&apos;s interest-bearing debt (≈6.5% of market cap) sits well below
              AAOIFI&apos;s 30% cap and DJIM&apos;s 33% cap, and its impermissible income
              (≈2.8% of revenue) is under every scholar&apos;s threshold. Under AAOIFI and
              DJIM, AMZN is Halal.
            </p>
            <p className="mt-2 text-sm leading-6 text-gray-700">
              Mufti Taqi Usmani adds the illiquid-asset floor: tangible assets must exceed
              20% of total assets. Amazon&apos;s ratio is ≈12% — overwhelmingly intangible
              (brand, code, AWS goodwill). Under his published standard, AMZN does not
              represent ownership of enough real assets to be tradable, and the verdict
              flips to <strong>Not halal</strong>.
            </p>
            <p className="mt-2 text-sm leading-6 text-gray-700">
              No standard is &quot;more correct.&quot; The disagreement is real, published, and
              held by hundreds of millions of Muslims. Mizan&apos;s job is to surface it.
            </p>
            <div className="mt-3">
              <Link href="/screen?ticker=AMZN" className="text-sm font-medium text-navy-700 hover:underline">
                See AMZN under all five scholars →
              </Link>
            </div>
          </div>
        </div>
      </Card>

      {/* Data sources */}
      <Card>
        <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
          Where the data comes from
        </div>
        <h2 className="mt-1 text-xl font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
          Financial fundamentals
        </h2>
        <p className="mt-3 text-sm leading-7 text-gray-700">
          Financial fundamentals are sourced from Financial Modeling Prep in Year 1 and
          graduate to Refinitiv / SIX Financial as international coverage expands. Mizan
          computes the Shariah ratios in-house from balance-sheet primitives — we do not
          rely on any third party&apos;s pre-computed &quot;halal score&quot;.
        </p>
        <p className="mt-2 text-sm leading-7 text-gray-700">
          Stock fundamentals refresh nightly. When a company files a 10-K, 10-Q, or
          equivalent, we re-screen every affected position within four hours and notify
          Pro-tier users whose portfolio verdicts change.
        </p>
        <p className="mt-2 text-xs italic text-gray-500">
          The current prototype runs against a 163-ticker representative sample seeded
          from public filings. Production version covers any listed equity.
        </p>
      </Card>

      {/* SSB */}
      <Card>
        <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
          Oversight
        </div>
        <h2 className="mt-1 text-xl font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
          Shariah Supervisory Board
        </h2>
        <p className="mt-3 text-sm leading-7 text-gray-700">
          Mizan&apos;s Shariah Supervisory Board reviews every methodology release before
          it ships, meets quarterly, audits a sample of AI Q&amp;A outputs each quarter,
          and co-signs an annual public Shariah report.
        </p>
        <p className="mt-3 text-sm leading-7 text-gray-700">
          Board composition is published as scholars confirm in writing. We do not
          publish names before written engagement is in place — claims of supervision
          without the corresponding documentation are common in this industry and we
          refuse to participate.
        </p>
      </Card>

      {/* Corrections */}
      <Card className="bg-gray-50">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
          Disagreements & corrections
        </div>
        <h2 className="mt-1 text-xl font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
          We welcome challenge
        </h2>
        <p className="mt-3 text-sm leading-7 text-gray-700">
          If you believe a scholar profile in Mizan misrepresents the underlying
          scholarship, write to{" "}
          <a href="mailto:methodology@mizan.app" className="text-navy-700 underline">
            methodology@mizan.app
          </a>{" "}
          with the citation. Every note is reviewed by the Shariah Board and a public
          changelog entry is added if a profile changes.
        </p>
      </Card>

      <p className="text-center text-xs text-gray-500">
        Last updated 22 May 2026. <Link href="/" className="text-navy-700 underline">Back to home.</Link>
      </p>
    </div>
  );
}

function Threshold({ name, op, v, emphasised }: { name: string; op: "≤" | "≥"; v: number; emphasised?: boolean }) {
  return (
    <div className={"flex items-center justify-between " + (emphasised ? "font-semibold text-navy-700" : "text-gray-700")}>
      <dt>{name}</dt>
      <dd className="tabular-nums">{op} {v}%</dd>
    </div>
  );
}
