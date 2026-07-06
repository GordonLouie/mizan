/**
 * /screen — server wrapper around the client screener.
 *
 * Why this exists: the screener itself is fully client-rendered, which left
 * /screen (the target of every homepage CTA) as an empty HTML shell with the
 * generic homepage metadata — zero indexable content on the core product page.
 * This wrapper adds (1) unique metadata + canonical, and (2) a server-rendered
 * section below the app: what the screener does, and a crawlable table of the
 * largest covered stocks linking into the programmatic /halal/[ticker] pages.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { listStocks } from "@/lib/data";
import { SCHOLAR_PROFILES, getScholar } from "@/lib/scholars";
import { screenStock } from "@/lib/screen";
import ScreenClient from "./ScreenClient";

const SITE = "https://www.halalgauge.com";

export const metadata: Metadata = {
  title: "Free halal stock screener — five scholarly standards",
  description:
    "Screen any covered stock under AAOIFI, Mufti Taqi Usmani, S&P DJIM, Ja'fari (Shia) or a strict view — side by side, with every financial ratio shown and every threshold cited to its source. Free, no signup.",
  alternates: { canonical: `${SITE}/screen` },
  openGraph: {
    title: "Free halal stock screener — five scholarly standards",
    description:
      "Multi-scholar halal screening with the math shown and every threshold cited. Free, no signup.",
    url: `${SITE}/screen`,
    siteName: "HalalGauge",
    type: "website",
  },
};

const NAMED_SCHOLARS = SCHOLAR_PROFILES.filter((s) => s.id !== "custom");

export default function ScreenPage() {
  // Server-computed: largest covered stocks + how many standards each passes.
  const top = [...listStocks()]
    .filter((s) => s.sector !== "ETF")
    .sort((a, b) => b.marketCapUsd - a.marketCapUsd)
    .slice(0, 15)
    .map((s) => {
      const pass = NAMED_SCHOLARS.filter(
        (sc) => screenStock(s, getScholar(sc.id)).verdict === "pass",
      ).length;
      return { ticker: s.ticker, name: s.name, sector: s.sector, pass };
    });

  return (
    <>
      <ScreenClient />

      {/* Server-rendered, crawlable content below the app. */}
      <section className="mt-16 border-t border-gray-100 pt-10 pb-4">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          How this screener works
        </div>
        <h2
          className="mt-2 text-[22px] font-bold leading-tight text-gray-900"
          style={{ fontFamily: "var(--font-display)" }}
        >
          One stock, five scholarly standards, zero black boxes.
        </h2>
        <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-gray-600">
          HalalGauge screens each company&apos;s latest filed financials under five
          mainstream scholarly standards — AAOIFI, Mufti Taqi Usmani (including his
          illiquid-asset rule), S&amp;P Dow Jones Islamic, a Ja&apos;fari (Shia) profile,
          and a strict minority view — plus your own custom thresholds. Every verdict
          shows the exact ratios (interest-bearing debt, impermissible income,
          cash &amp; securities) and cites the primary source behind each threshold.
          HalalGauge is not a religious authority and issues no rulings; verdicts are
          arithmetic applied to published scholarly standards.
        </p>

        <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <caption className="sr-only">
              Largest covered companies and how many of the five scholarly standards they pass
            </caption>
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Sector</th>
                <th className="px-4 py-3 text-right">Standards passed</th>
                <th className="px-4 py-3 text-right">Full verdict</th>
              </tr>
            </thead>
            <tbody>
              {top.map((s) => (
                <tr key={s.ticker} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3">
                    <span className="font-semibold text-gray-900">{s.ticker}</span>
                    <span className="ml-2 text-gray-500">{s.name}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{s.sector}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-gray-700">
                    {s.pass} of {NAMED_SCHOLARS.length}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/halal/${encodeURIComponent(s.ticker)}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-navy-700 hover:text-navy-900"
                    >
                      Is {s.ticker} halal? <ArrowRight size={11} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[12px] text-gray-500">
          Verdicts are recomputed from each company&apos;s most recent filings. See the{" "}
          <Link href="/methodology" className="text-navy-700 underline hover:text-navy-900">
            full methodology
          </Link>{" "}
          or browse{" "}
          <Link href="/universe" className="text-navy-700 underline hover:text-navy-900">
            every covered stock
          </Link>
          .
        </p>
      </section>
    </>
  );
}
