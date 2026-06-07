"use client";

/**
 * Homepage — v4 layout.
 *
 * Order:
 *   1. Status line whisper
 *   2. Hero: "Is your stock halal?" → punchline → stats trio → search → CTA
 *   3. Or-try chips (logos only) + onboarding link
 *   4. Bigger CompanyLogoMarquee (proof of coverage)
 *   5. Soft gradient transition into the iPad
 *   6. ScrollDashboardHero — iPad showing real /screen content
 *   7. MethodologyBubble — primary-source rigor signal
 *   8. WhyChooseUs — 3-tab section
 *   9. The "Why Mizan" wedge — moved here as supporting proof
 *  10. EarningsCalendar — live block
 *  11. GetStartedSteps — 3-step conversion
 *  12. Curated lists
 *  13. What Mizan is / isn't
 */

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TickerSearch from "@/components/TickerSearch";
import { ArrowRight } from "lucide-react";
import { CURATED_LISTS } from "@/lib/lists";
import { listStocks } from "@/lib/data";
import CompanyLogo from "@/components/CompanyLogo";
import CompanyLogoMarquee from "@/components/CompanyLogoMarquee";
import ScrollDashboardHero from "@/components/ScrollDashboardHero";
import MethodologyBubble from "@/components/MethodologyBubble";
import WhyChooseUs from "@/components/WhyChooseUs";
import GetStartedSteps from "@/components/GetStartedSteps";
import EarningsCalendar from "@/components/EarningsCalendar";

export default function Home() {
  const router = useRouter();
  const [_t, setT] = useState("");

  const tickerCount = listStocks().length;

  return (
    <div className="pb-16">
      {/* 1. STATUS LINE */}
      <section className="pt-6 sm:pt-10">
        <div className="mb-10 flex justify-center">
          <Link
            href="/trust"
            className="group inline-flex items-center gap-1.5 text-[11px] font-medium text-gray-500 transition hover:text-gray-800"
          >
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
            <span className="uppercase tracking-[0.18em]">Private beta</span>
            <span className="text-gray-300">·</span>
            <span className="text-gray-500 group-hover:text-navy-700 group-hover:underline">
              status
            </span>
          </Link>
        </div>
      </section>

      {/* 2. HERO — leads the page */}
      <section className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <h1
          className="text-[52px] font-bold leading-[1.02] tracking-tight text-gray-900 sm:text-[88px]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Is your stock halal?
        </h1>

        <p
          className="mx-auto mt-6 max-w-xl text-[20px] font-medium leading-[1.3] text-gray-800 sm:text-[24px]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Six scholars, one screen.
        </p>
        <p className="mx-auto mt-3 max-w-xl text-[14px] leading-relaxed text-gray-500">
          Including Mufti Taqi Usmani&apos;s illiquid-asset rule — the one no
          other halal app implements.
        </p>

        {/* Stats trio */}
        <div className="mx-auto mt-10 grid max-w-md grid-cols-3 divide-x divide-gray-200 border-y border-gray-200 py-5 font-mono tabular-nums">
          <div className="px-2">
            <div
              className="text-[24px] font-bold leading-none text-navy-800 sm:text-[28px]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              6
            </div>
            <div className="mt-2 text-[10px] uppercase tracking-[0.14em] text-gray-500">
              Scholars
            </div>
          </div>
          <div className="px-2">
            <div
              className="text-[24px] font-bold leading-none text-navy-800 sm:text-[28px]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {tickerCount}
            </div>
            <div className="mt-2 text-[10px] uppercase tracking-[0.14em] text-gray-500">
              Tickers
            </div>
          </div>
          <div className="px-2">
            <div
              className="text-[24px] font-bold leading-none text-navy-800 sm:text-[28px]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              0
            </div>
            <div className="mt-2 text-[10px] uppercase tracking-[0.14em] text-gray-500">
              Black-box scores
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mx-auto mt-10 max-w-xl">
          <TickerSearch
            value=""
            onChange={(t) => {
              setT(t);
              if (t) router.push(`/screen?ticker=${encodeURIComponent(t)}`);
            }}
            placeholder="Type a ticker — AAPL, AMZN, TSLA, or 'apple'…"
            autoFocus={false}
          />
        </div>

        {/* Disagreement CTA */}
        <div className="mx-auto mt-5 max-w-xl">
          <Link
            href="/screen?ticker=AMZN"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-navy-700 transition hover:text-navy-900"
          >
            See where the scholars split on Amazon <ArrowRight size={13} />
          </Link>
        </div>

        {/* Or try — LOGOS ONLY, no names */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <span className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
            Or try
          </span>
          {["AAPL", "TSLA", "MSFT", "JPM", "META", "SPUS"].map((t) => (
            <Link
              key={t}
              href={`/screen?ticker=${t}`}
              aria-label={`Screen ${t}`}
              className="rounded-md border border-gray-200 bg-white p-1.5 transition hover:border-gray-400 hover:bg-gray-50"
            >
              <CompanyLogo ticker={t} size={22} />
            </Link>
          ))}
        </div>

        {/* Onboarding link */}
        <p className="mt-6 text-[12px] text-gray-500">
          Don&apos;t know which scholar you follow?{" "}
          <Link
            href="/learn"
            className="text-navy-700 underline hover:text-navy-900"
          >
            60-second primer
          </Link>{" "}
          — most American Muslims start with AAOIFI.
        </p>
      </section>

      {/* 3. BIGGER MARQUEE — proof of coverage */}
      <section className="mt-16">
        <div className="text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Covering {tickerCount}+ tickers
        </div>
        <div className="mt-5">
          <CompanyLogoMarquee />
        </div>
      </section>

      {/* 4. SOFT GRADIENT TRANSITION INTO IPAD.
          The iPad sits on a cream → soft-blue wash so it doesn't float on
          a blank canvas. The gradient is the section background; the iPad
          renders above it. */}
      <div
        className="relative -mt-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(250,247,240,0) 0%, rgba(228,236,248,0.45) 35%, rgba(228,236,248,0.7) 60%, rgba(228,236,248,0.2) 100%)",
        }}
      >
        <ScrollDashboardHero ticker="AMZN" />
      </div>

      {/* 5. METHODOLOGY BUBBLE */}
      <MethodologyBubble />

      {/* 6. WHY CHOOSE US */}
      <WhyChooseUs />

      {/* 7. WHY MIZAN WEDGE — supporting proof, now AFTER the iPad demo.
          The Amazon comparison lands as evidence backing up the multi-scholar
          claim, not as the opening line. */}
      <section className="mx-auto mt-32 max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-600">
            Why Mizan
          </div>
          <h2
            className="mt-3 text-[28px] font-bold leading-[1.15] text-gray-900 sm:text-[36px]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Most apps check one rulebook.
            <br />
            Muslims follow many.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-gray-600">
            Different scholars reach different verdicts on the same stock. Take
            Amazon:
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 overflow-hidden rounded-xl border border-gray-200 sm:grid-cols-2">
          {/* LEFT */}
          <div className="bg-white px-10 py-12">
            <div className="flex items-baseline justify-between gap-3">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Under AAOIFI
              </div>
              <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-gray-400">
                AS OF Q4 2025
              </div>
            </div>
            <div
              className="mt-8 text-[72px] font-bold leading-none text-emerald-700 sm:text-[88px]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Halal
            </div>
            <div className="mt-10 space-y-1.5 border-t border-gray-100 pt-4 font-mono text-[12px] tabular-nums text-gray-500">
              <div className="flex justify-between">
                <span>DEBT / MKT CAP</span>
                <span className="text-gray-900">6.5%</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Threshold</span>
                <span>≤ 30%</span>
              </div>
            </div>
            <p className="mt-5 text-[13px] leading-relaxed text-gray-500">
              What Zoya, Wahed, and Musaffa would tell you.
            </p>
          </div>

          {/* RIGHT */}
          <div className="border-t border-gray-200 bg-white px-10 py-12 sm:border-l sm:border-t-0">
            <div className="flex items-baseline justify-between gap-3">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-700">
                Under Mufti Taqi Usmani
              </div>
              <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-gray-400">
                AS OF Q4 2025
              </div>
            </div>
            <div
              className="mt-8 text-[72px] font-bold leading-none text-rose-700 sm:text-[88px]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Not halal
            </div>
            <div className="mt-10 space-y-1.5 border-t border-gray-100 pt-4 font-mono text-[12px] tabular-nums text-gray-500">
              <div className="flex justify-between">
                <span>TANGIBLE / TOTAL</span>
                <span className="text-gray-900">12.0%</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Threshold</span>
                <span>≥ 20%</span>
              </div>
            </div>
            <p className="mt-5 text-[13px] leading-relaxed text-gray-500">
              His illiquid-asset rule excludes AMZN. No other app surfaces this.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/screen?ticker=AMZN"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-700 transition hover:text-navy-900"
          >
            See AMZN under all six scholars <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* 8. EARNINGS CALENDAR */}
      <section className="mx-auto mt-32 max-w-5xl px-4 sm:px-6">
        <EarningsCalendar limit={20} />
      </section>

      {/* 9. GET STARTED */}
      <GetStartedSteps />

      {/* 10. CURATED LISTS */}
      <section className="mx-auto mt-32 max-w-4xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
              Discover
            </div>
            <h2
              className="mt-2 text-[26px] font-bold leading-tight text-gray-900 sm:text-[32px]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Not sure where to start?
            </h2>
            <p className="mt-2 max-w-xl text-sm text-gray-600">
              Hand-picked collections — re-screened against your scholar.
            </p>
          </div>
          <Link
            href="/lists"
            className="hidden text-sm font-medium text-navy-700 hover:text-navy-900 sm:inline-flex sm:items-center sm:gap-1"
          >
            All lists <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {CURATED_LISTS.slice(0, 3).map((list) => (
            <Link
              key={list.slug}
              href={`/lists/${list.slug}`}
              className="group block rounded-xl border border-gray-200 bg-white p-5 transition hover:border-gray-400"
            >
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                {list.kicker}
              </div>
              <div
                className="mt-2 text-[17px] font-bold text-gray-900 group-hover:text-navy-800"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {list.title}
              </div>
              <div className="mt-1 text-xs text-gray-500">
                {list.tickers.length} stocks
              </div>
              <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-gray-600">
                {list.audience}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 11. WHAT MIZAN IS / ISN'T */}
      <section className="mx-auto mt-32 max-w-3xl border-t border-gray-200 px-4 pt-14 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-700">
              What Mizan is
            </div>
            <ul className="mt-4 space-y-2.5 text-[14px] leading-relaxed text-gray-700">
              <li>Free, transparent halal stock screening.</li>
              <li>Six scholarly methodologies + a custom builder.</li>
              <li>Zakat and purification calculators.</li>
              <li>Information you can verify — we show the math.</li>
            </ul>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-rose-700">
              What Mizan isn&apos;t
            </div>
            <ul className="mt-4 space-y-2.5 text-[14px] leading-relaxed text-gray-700">
              <li>An investment advisor. We don&apos;t tell you what to buy.</li>
              <li>A bank or brokerage. We don&apos;t hold your money.</li>
              <li>A religious authority. We surface scholarly opinion.</li>
              <li>A replacement for a qualified scholar for your specifics.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
