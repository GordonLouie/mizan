import Link from "next/link";
import { ExternalLink } from "lucide-react";
import {
  CRYPTO_ASSETS,
  VERDICT_LABEL_CRYPTO,
  type CryptoVerdict,
} from "@/lib/crypto";
import { fmtMarketCap } from "@/lib/lists";

export const metadata = {
  title: "Crypto compliance · Mizan",
  description:
    "Multi-scholar views on Bitcoin, Ethereum, stablecoins, DeFi tokens, and the rest of the major cryptoassets. No other app shows you what every scholar says, side by side.",
};

const VERDICT_TONE_CRYPTO_NEW: Record<CryptoVerdict, string> = {
  halal: "bg-emerald-50 text-emerald-700",
  doubtful: "bg-amber-50 text-amber-700",
  not_halal: "bg-rose-50 text-rose-700",
  no_consensus: "bg-gray-100 text-gray-700",
};

export default function CryptoPage() {
  const totalAssets = CRYPTO_ASSETS.length;
  const halalCount = CRYPTO_ASSETS.filter((a) =>
    a.takes.some((t) => t.scholar.includes("Faraz Adam") && t.verdict === "halal"),
  ).length;
  const strictHalalCount = CRYPTO_ASSETS.filter((a) =>
    a.takes.some((t) => t.scholar === "Strict / zero-tolerance" && t.verdict === "halal"),
  ).length;

  return (
    <div className="pb-20">
      {/* PAGE HEADER */}
      <header className="pt-6">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Reference · Crypto · Early development
        </div>
        <h1
          className="mt-3 text-[36px] font-bold leading-[1.1] text-gray-900 sm:text-[44px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Crypto compliance
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-gray-600">
          The only place on the internet where the major cryptoassets are screened against
          every scholarly view side by side. Mizan summarises published rulings — it does
          not issue them.
        </p>

        {/* Early-development notice — Ibrahim Malik & Saifuddin Abbas feedback (Day 7):
            crypto verdicts feel less mature than equity screening. Be honest about it. */}
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50/60 p-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-800">
            Early development — methodology evolving
          </div>
          <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-gray-700">
            Mizan&apos;s crypto coverage is less mature than its equity screening. Scholars
            actively disagree on classification of cryptoassets — and the rulings move faster
            than they do for public equities. Treat the verdicts here as a starting point for
            your own scholar conversation, not a substitute. We update quarterly and flag
            disagreement explicitly.
          </p>
        </div>
      </header>

      {/* SUMMARY STATS */}
      <div className="mt-10 grid grid-cols-2 gap-y-5 border-y border-gray-200 py-5 sm:grid-cols-4">
        <Stat label="Assets covered" value={String(totalAssets)} sub="major cryptos by mkt cap" />
        <Stat
          label="Permitted (permissive)"
          value={`${halalCount}`}
          sub="Mufti Faraz Adam"
          tone="emerald"
        />
        <Stat
          label="Permitted (strict)"
          value={`${strictHalalCount}`}
          sub="zero-tolerance view"
        />
        <Stat label="Updated" value="May 2026" sub="quarterly review" />
      </div>

      {/* HOW TO READ */}
      <section className="mt-16">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Read this first
        </div>
        <h2
          className="mt-2 text-[24px] font-bold leading-tight text-gray-900 sm:text-[28px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          How to read this page
        </h2>
        <div className="mt-5 max-w-2xl space-y-4 text-[14px] leading-relaxed text-gray-700">
          <p>
            <strong className="text-gray-900">
              Crypto compliance is the hardest question in halal finance today.
            </strong>{" "}
            No formal AAOIFI standard exists. Scholars are working from first principles
            (riba, gharar, maysir, qabd) without a settled framework. Reasonable scholars
            reach different conclusions on the same asset.
          </p>
          <p>
            Mizan&apos;s job is to surface what every credible scholar has actually written
            or said about each asset, with sources — not to issue a single Mizan verdict.
            Read the citations. Choose your scholar. Ask a qualified mufti for your
            specific situation before acting.
          </p>
        </div>
        <p className="mt-5 max-w-2xl border-l-2 border-amber-300 py-1 pl-4 text-[12px] italic leading-relaxed text-gray-600">
          None of this is investment advice. Crypto markets are volatile; even
          halal-permissible holdings can lose substantial value. Allocate accordingly.
        </p>
      </section>

      {/* ASSETS */}
      <section className="mt-16">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          The assets
        </div>
        <h2
          className="mt-2 text-[24px] font-bold leading-tight text-gray-900 sm:text-[28px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          What every scholar says
        </h2>

        <div className="mt-8 space-y-10">
          {CRYPTO_ASSETS.map((asset) => (
            <article key={asset.symbol} className="border-t border-gray-200 pt-8">
              {/* Asset header */}
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[18px] font-bold text-gray-900">
                      {asset.symbol}
                    </span>
                    <span className="text-[14px] text-gray-600">{asset.name}</span>
                  </div>
                  <p className="mt-2 max-w-2xl text-[13px] italic leading-relaxed text-gray-600">
                    {asset.what}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                    Market cap
                  </div>
                  <div
                    className="mt-1 font-mono text-[16px] font-bold text-gray-900 tabular-nums"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {fmtMarketCap(asset.marketCapUsd)}
                  </div>
                </div>
              </div>

              {/* Blunt summary */}
              <div className="mt-5 border-l-2 border-gold-500 py-1 pl-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                  The honest summary
                </div>
                <p className="mt-1 text-[14px] leading-relaxed text-gray-800">{asset.blunt}</p>
              </div>

              {/* Scholar takes */}
              <div className="mt-6 divide-y divide-gray-100">
                {asset.takes.map((take, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-1 gap-3 py-4 sm:grid-cols-[180px_100px_1fr] sm:items-start"
                  >
                    <div className="text-[13px] font-semibold text-gray-900">
                      {take.scholar}
                    </div>
                    <div>
                      <VerdictPill verdict={take.verdict} />
                    </div>
                    <div className="text-[13px] leading-relaxed text-gray-700">
                      <p>{take.summary}</p>
                      {take.source && (
                        <a
                          href={take.source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-navy-700 hover:text-navy-900 hover:underline"
                        >
                          Source <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* WHAT'S NOT COVERED */}
      <section className="mt-20 border-t border-gray-200 pt-10">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          What we don&apos;t cover
        </div>
        <h2
          className="mt-2 text-[24px] font-bold leading-tight text-gray-900 sm:text-[28px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          And why
        </h2>
        <ul className="mt-5 max-w-2xl space-y-3 text-[14px] leading-relaxed text-gray-700">
          <li>
            <strong className="text-gray-900">NFTs.</strong> Too varied to generalise — some
            are permissible art, some are speculation, some include impermissible imagery.
            Per-NFT analysis is beyond Mizan&apos;s scope.
          </li>
          <li>
            <strong className="text-gray-900">ICOs / token launches.</strong> Mostly
            speculative; no scholar issues blanket permissions on unlaunched tokens.
          </li>
          <li>
            <strong className="text-gray-900">DeFi yield strategies.</strong> Lending
            protocols (Aave, Compound) and most yield-farming setups involve riba. We mark
            them &lsquo;not halal&rsquo; categorically.
          </li>
          <li>
            <strong className="text-gray-900">Wrapped / synthetic assets.</strong> Inherit
            the compliance of the underlying plus added gharar concerns.
          </li>
        </ul>
      </section>

      {/* FOOTER */}
      <p className="mt-16 text-center text-[11px] text-gray-500">
        Disagree with a take here? Email{" "}
        <a
          href="mailto:methodology@mizaninvesting.com"
          className="text-navy-700 underline hover:text-navy-900"
        >
          methodology@mizaninvesting.com
        </a>{" "}
        with the citation. Updated quarterly from public scholarly publications. Back to{" "}
        <Link href="/discover" className="text-navy-700 underline hover:text-navy-900">
          Discover
        </Link>.
      </p>
    </div>
  );
}

function VerdictPill({ verdict }: { verdict: CryptoVerdict }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${VERDICT_TONE_CRYPTO_NEW[verdict]}`}
    >
      {VERDICT_LABEL_CRYPTO[verdict]}
    </span>
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
  tone?: "neutral" | "emerald";
}) {
  const cls = tone === "emerald" ? "text-emerald-700" : "text-gray-900";
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
        {label}
      </div>
      <div
        className={`mt-1 text-[22px] font-bold leading-none tabular-nums ${cls}`}
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
      </div>
      {sub && <div className="mt-1 text-[11px] text-gray-500">{sub}</div>}
    </div>
  );
}
