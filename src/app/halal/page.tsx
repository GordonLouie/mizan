/**
 * /halal — hub/index for the programmatic SEO cluster.
 *
 * Links out to the most-searched ticker pages, sectors, crypto, and guides so
 * crawlers (and people) can reach every /halal/[ticker] page, and so "halal
 * stock screener" style queries have a real landing page to rank.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { listStocks } from "@/lib/data";
import { isEtf } from "@/lib/etfInfo";
import { CRYPTO_ASSETS } from "@/lib/crypto";

const SITE = "https://mizaninvesting.com";

export const metadata: Metadata = {
  title: "Is your stock halal? Free multi-scholar screener — Mizan",
  description:
    "Check whether any stock is halal under all 6 scholarly methodologies — AAOIFI, Mufti Taqi Usmani, S&P DJIM, Ja'fari and the strict view — with every threshold cited to its source. Free, no signup. Browse popular tickers and crypto.",
  alternates: { canonical: `${SITE}/halal` },
};

export default function HalalHub() {
  const stocks = listStocks().filter((s) => !isEtf(s));
  const popular = [...stocks].sort((a, b) => b.marketCapUsd - a.marketCapUsd).slice(0, 40);
  const cryptos = CRYPTO_ASSETS.slice(0, 12);

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: popular.slice(0, 20).map((s, i) => ({
      "@type": "ListItem", position: i + 1,
      name: `Is ${s.ticker} halal?`, url: `${SITE}/halal/${encodeURIComponent(s.ticker)}`,
    })),
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />

      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">Halal stock screener</div>
      <h1 className="mt-2 text-[30px] font-bold leading-tight text-gray-900 sm:text-[38px]" style={{ fontFamily: "var(--font-display)" }}>
        Is your stock halal?
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-gray-700">
        See the verdict under all six scholarly methodologies — AAOIFI, Mufti Taqi Usmani, S&amp;P DJIM,
        Ja&apos;fari, the strict view, and your own custom thresholds — side by side, with every threshold
        cited to its primary source. Free, no signup, no data collected.
      </p>
      <div className="mt-5">
        <Link href="/screen" className="inline-flex items-center gap-1.5 rounded-md bg-navy-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-900">
          Screen any stock <ArrowRight size={14} />
        </Link>
      </div>

      {/* Popular tickers */}
      <section className="mt-10">
        <h2 className="text-[18px] font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>Popular stocks</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {popular.map((s) => (
            <Link key={s.ticker} href={`/halal/${encodeURIComponent(s.ticker)}`}
              className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[13px] text-gray-700 transition hover:border-gray-400">
              Is {s.ticker} halal?
            </Link>
          ))}
        </div>
      </section>

      {/* Crypto */}
      <section className="mt-10">
        <h2 className="text-[18px] font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>Crypto</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {cryptos.map((c) => (
            <Link key={c.symbol} href={`/crypto/${c.symbol.toLowerCase()}`}
              className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[13px] text-gray-700 transition hover:border-gray-400">
              Is {c.name} halal?
            </Link>
          ))}
        </div>
      </section>

      {/* Browse + learn */}
      <section className="mt-10 grid gap-3 sm:grid-cols-3">
        <Link href="/sectors" className="rounded-xl border border-gray-200 bg-white p-4 transition hover:border-gray-400">
          <div className="text-[14px] font-semibold text-gray-900">Browse by sector</div>
          <div className="mt-1 text-[12px] text-gray-500">Halal tech, healthcare, energy and more.</div>
        </Link>
        <Link href="/methodology" className="rounded-xl border border-gray-200 bg-white p-4 transition hover:border-gray-400">
          <div className="text-[14px] font-semibold text-gray-900">How screening works</div>
          <div className="mt-1 text-[12px] text-gray-500">The ratios, the scholars, the sources.</div>
        </Link>
        <Link href="/blog" className="rounded-xl border border-gray-200 bg-white p-4 transition hover:border-gray-400">
          <div className="text-[14px] font-semibold text-gray-900">Guides</div>
          <div className="mt-1 text-[12px] text-gray-500">ETFs, 401(k)s, the Mufti Taqi rule, and more.</div>
        </Link>
      </section>

      <p className="mt-10 text-[11px] leading-relaxed text-gray-400">
        Mizan surfaces published scholarly methodologies with full sourcing; it does not issue fatwa
        or certify any security as halal. Verify with a qualified scholar before investing.
      </p>
    </main>
  );
}
