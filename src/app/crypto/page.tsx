import Link from "next/link";
import { ExternalLink } from "lucide-react";
import {
  CRYPTO_ASSETS,
  VERDICT_LABEL_CRYPTO,
  VERDICT_TONE_CRYPTO,
  type CryptoVerdict,
} from "@/lib/crypto";
import { Card, PageHeader, Pill } from "@/components/ui";
import { fmtMarketCap } from "@/lib/lists";

export const metadata = {
  title: "Crypto compliance · Mizan",
  description:
    "Multi-scholar views on Bitcoin, Ethereum, stablecoins, DeFi tokens, and the rest of the major cryptoassets. No other app shows you what every scholar says, side by side.",
};

export default function CryptoPage() {
  // Compute summary stats — at how many assets does each scholar permit?
  const totalAssets = CRYPTO_ASSETS.length;
  const halalCount = CRYPTO_ASSETS.filter((a) =>
    a.takes.some((t) => t.scholar.includes("Faraz Adam") && t.verdict === "halal"),
  ).length;
  const strictHalalCount = CRYPTO_ASSETS.filter((a) =>
    a.takes.some((t) => t.scholar === "Strict / zero-tolerance" && t.verdict === "halal"),
  ).length;

  return (
    <div className="space-y-8">
      <PageHeader
        kicker="Cross-asset"
        title="Crypto compliance"
        description="The only place on the internet where the major cryptoassets are screened against every scholarly view side by side. Mizan summarises published rulings — it does not issue them."
      />

      {/* Summary strip */}
      <Card padded={false}>
        <div className="grid grid-cols-2 divide-x divide-y divide-gray-100 sm:grid-cols-4 sm:divide-y-0">
          <Stat label="Assets covered" value={String(totalAssets)} sub="major cryptos by market cap" />
          <Stat
            label="Permitted under permissive view"
            value={`${halalCount}`}
            sub="Mufti Faraz Adam"
            tone="pass"
          />
          <Stat
            label="Permitted under strict view"
            value={`${strictHalalCount}`}
            sub="zero-tolerance"
          />
          <Stat label="Updated" value="May 2026" sub="quarterly review cadence" />
        </div>
      </Card>

      {/* Editorial intro */}
      <Card>
        <div className="text-[11px] font-semibold uppercase tracking-widest text-amber-700">
          Read this first
        </div>
        <h2 className="mt-1 text-xl font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
          How to read this page
        </h2>
        <div className="mt-4 space-y-3 text-sm leading-7 text-gray-700">
          <p>
            <strong>Crypto compliance is the hardest question in halal finance today.</strong> No
            formal AAOIFI standard exists. Scholars are working from first principles
            (riba, gharar, maysir, qabd) without a settled framework. Reasonable scholars reach different conclusions on the same asset.
          </p>
          <p>
            Mizan&apos;s job is to surface what every credible scholar has actually written or
            said about each asset, with sources — not to issue a single Mizan verdict. Read
            the citations. Choose your scholar. Ask a qualified mufti for your specific situation
            before acting.
          </p>
          <p className="border-l-2 border-amber-300 bg-amber-50/40 px-4 py-2 text-xs italic">
            None of this is investment advice. Crypto markets are volatile; even halal-permissible
            holdings can lose substantial value. Allocate accordingly.
          </p>
        </div>
      </Card>

      {/* The asset cards */}
      <div className="space-y-5">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-widest text-amber-700">
            The assets
          </div>
          <h2 className="mt-1 text-2xl font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
            What every scholar says
          </h2>
        </div>

        {CRYPTO_ASSETS.map((asset) => (
          <Card key={asset.symbol} padded={false}>
            {/* Asset header */}
            <div className="border-b border-gray-100 px-6 py-5 sm:px-8">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-lg font-bold text-gray-900">{asset.symbol}</span>
                    <span className="text-sm text-gray-600">{asset.name}</span>
                  </div>
                  <p className="mt-1 max-w-2xl text-sm italic text-gray-600">{asset.what}</p>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                    Market cap
                  </div>
                  <div className="text-base font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
                    {fmtMarketCap(asset.marketCapUsd)}
                  </div>
                </div>
              </div>
            </div>

            {/* Blunt summary */}
            <div className="border-b border-gray-100 bg-amber-50/30 px-6 py-4 sm:px-8">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-amber-700">
                The honest summary
              </div>
              <p className="mt-1 text-sm leading-relaxed text-gray-800">{asset.blunt}</p>
            </div>

            {/* Scholar takes */}
            <div className="divide-y divide-gray-100">
              {asset.takes.map((take, i) => (
                <div key={i} className="grid grid-cols-1 gap-3 px-6 py-4 sm:grid-cols-[200px_120px_1fr] sm:px-8">
                  <div className="text-sm font-semibold text-gray-900">{take.scholar}</div>
                  <div>
                    <VerdictPill verdict={take.verdict} />
                  </div>
                  <div className="text-sm leading-relaxed text-gray-700">
                    <p>{take.summary}</p>
                    {take.source && (
                      <a
                        href={take.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-navy-700 hover:underline"
                      >
                        Source <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* What's NOT covered */}
      <Card className="bg-gray-50">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
          What we don't cover
        </div>
        <h2 className="mt-1 text-xl font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
          And why
        </h2>
        <ul className="mt-4 space-y-2 text-sm leading-7 text-gray-700">
          <li>
            <strong>NFTs.</strong> Too varied to generalise — some are permissible art, some are
            speculation, some include impermissible imagery. Per-NFT analysis is beyond Mizan&apos;s
            scope.
          </li>
          <li>
            <strong>ICOs / token launches.</strong> Mostly speculative; no scholar issues blanket
            permissions on unlaunched tokens.
          </li>
          <li>
            <strong>DeFi yield strategies.</strong> Lending protocols (Aave, Compound) and most
            yield-farming setups involve riba. We mark them &lsquo;not halal&rsquo; categorically.
          </li>
          <li>
            <strong>Wrapped / synthetic assets.</strong> Inherit the compliance of the underlying
            plus added gharar concerns.
          </li>
        </ul>
      </Card>

      <p className="text-center text-xs text-gray-500">
        Disagree with a take here? Email{" "}
        <a href="mailto:methodology@mizan.app" className="text-navy-700 underline">
          methodology@mizan.app
        </a>{" "}
        with the citation. Reviewed quarterly by Mizan&apos;s Shariah Supervisory Board. Back to{" "}
        <Link href="/discover" className="text-navy-700 underline">Discover</Link>.
      </p>
    </div>
  );
}

function VerdictPill({ verdict }: { verdict: CryptoVerdict }) {
  return <Pill tone={VERDICT_TONE_CRYPTO[verdict]}>{VERDICT_LABEL_CRYPTO[verdict]}</Pill>;
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
