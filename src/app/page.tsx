"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, GraduationCap, Calculator, MessageCircleQuestion } from "lucide-react";

export default function Home() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="pb-16">
      {/* 1. STATUS LINE — small whisper, not a banner */}
      <section className="pt-8 sm:pt-12">
        <div className="mb-12 flex justify-center">
          <Link
            href="/trust"
            className="group inline-flex items-center gap-1.5 text-[11px] text-gray-500 transition hover:text-gray-700"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-gray-400" />
            <span className="font-medium uppercase tracking-[0.18em]">Private beta</span>
            <span className="text-gray-300">·</span>
            <span className="group-hover:underline">status</span>
          </Link>
        </div>

        {/* 2. HERO — centered, max-w-2xl */}
        <div className="mx-auto max-w-2xl text-center">
          <h1
            className="text-[42px] font-bold leading-[1.02] tracking-tight text-gray-900 sm:text-[64px]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Is your stock halal?
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-gray-600">
            Type any ticker. See the verdict under six scholarly methodologies — including the rules no other app implements.
          </p>

          {/* Search input — styled, not functional */}
          <div className="mx-auto mt-10 max-w-xl">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Try AAPL, AMZN, TSLA, or 'apple'…"
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3.5 text-[15px] text-gray-900 placeholder-gray-400 outline-none transition focus:border-gray-400 focus:ring-0"
            />
          </div>

          {/* Ticker chips */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5">
            {["AAPL", "AMZN", "TSLA", "MSFT", "JPM", "SPUS"].map((ticker) => (
              <Link
                key={ticker}
                href={`/screen?ticker=${ticker}`}
                className="rounded-md border border-gray-200 bg-white px-2 py-1 font-mono text-[11px] text-gray-700 transition hover:border-gray-400 hover:text-gray-900"
              >
                {ticker}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HAIRLINE + TRUST STRIP */}
      <div className="mx-auto mt-28 max-w-xl">
        <div className="border-t border-gray-200" />
        <div className="grid grid-cols-3 gap-6 pt-6 text-center">
          <TrustStat n="6" label="scholar profiles" />
          <TrustStat n="163" label="stocks screened" />
          <TrustStat n="0" label="black-box scores" />
        </div>
      </div>

      {/* 4. THE WEDGE — page anchor moment */}
      <section className="mx-auto mt-28 max-w-3xl">
        <div className="text-center">
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-600">
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
            Every major halal app screens against one standard (AAOIFI). Different scholars reach different verdicts on the same stock. Take Amazon:
          </p>
        </div>

        {/* Comparison panel — FT print spread feel */}
        <div className="mt-10 grid grid-cols-1 overflow-hidden rounded-xl border border-gray-200 sm:grid-cols-2">
          {/* LEFT: AAOIFI */}
          <div className="bg-white px-10 py-12">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
              Under AAOIFI
            </div>
            <div
              className="mt-8 text-[72px] font-bold leading-none text-emerald-700 sm:text-[80px]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Halal
            </div>
            <div className="mt-10 font-mono text-[12px] text-gray-500">
              Debt / market cap: <span className="text-gray-900">6.5%</span> · cap 30%
            </div>
            <p className="mt-5 text-[13px] leading-relaxed text-gray-500">
              What Zoya, Wahed, and Musaffa would tell you.
            </p>
          </div>

          {/* RIGHT: Mufti Taqi Usmani */}
          <div className="border-t border-gray-200 bg-white px-10 py-12 sm:border-l sm:border-t-0">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
              Under Mufti Taqi Usmani
            </div>
            <div
              className="mt-8 text-[72px] font-bold leading-none text-rose-700 sm:text-[80px]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Not halal
            </div>
            <div className="mt-10 font-mono text-[12px] text-gray-500">
              Tangible assets: <span className="text-gray-900">12%</span> · floor 20%
            </div>
            <p className="mt-5 text-[13px] leading-relaxed text-gray-500">
              His illiquid-asset rule excludes AMZN. No other app surfaces this.
            </p>
          </div>
        </div>

        {/* Link below panel */}
        <div className="mt-8 text-center">
          <Link
            href="/screen?ticker=AMZN"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 transition hover:text-gray-900"
          >
            See AMZN under all six scholars
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* 5. THREE FEATURE CARDS — gap-px divider trick */}
      <section className="mx-auto mt-28 max-w-4xl">
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200 sm:grid-cols-3">
          <FeatureCard
            icon={<GraduationCap size={18} />}
            title="New to investing?"
            body="A primer on stocks, halal screening, and what scholars actually disagree about."
            href="/learn"
            cta="Halal Investing 101"
          />
          <FeatureCard
            icon={<Calculator size={18} />}
            title="Calculate your zakat"
            body="Cash, stocks, gold, crypto. Nisab check. 2.5% computed."
            href="/zakat"
            cta="Open the calculator"
          />
          <FeatureCard
            icon={<MessageCircleQuestion size={18} />}
            title="Ask a question"
            body="49 common questions answered per scholar — crypto, gold, mortgage, 401(k), options."
            href="/ask"
            cta="Try the Q&A"
          />
        </div>
      </section>

      {/* 6. CURATED LISTS SECTION */}
      <section className="mx-auto mt-28 max-w-4xl">
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
          </div>
          <Link
            href="/lists"
            className="hidden items-center gap-1 text-sm font-medium text-gray-700 transition hover:text-gray-900 sm:inline-flex"
          >
            All lists
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* 3 placeholder list cards */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <ListCard
            kicker="Tech"
            title="Halal Tech Giants"
            count={12}
            description="The largest technology companies that pass AAOIFI screening criteria."
          />
          <ListCard
            kicker="Healthcare"
            title="Halal Healthcare"
            count={8}
            description="Healthcare and pharmaceutical companies compliant with Islamic finance principles."
          />
          <ListCard
            kicker="ETFs"
            title="Shariah ETFs"
            count={15}
            description="Exchange-traded funds designed for Muslim investors seeking diversification."
          />
        </div>
      </section>

      {/* 7. WHAT MIZAN IS / ISN'T */}
      <section className="mx-auto mt-28 max-w-3xl border-t border-gray-200 pt-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
          {/* LEFT: What Mizan is */}
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-700">
              What Mizan is
            </div>
            <ul className="mt-4 space-y-2.5 text-[14px] leading-relaxed text-gray-700">
              <li>Free, transparent halal stock screening.</li>
              <li>Six scholarly methodologies + a custom builder.</li>
              <li>Zakat and purification calculators.</li>
              <li>Information you can verify — we show the math.</li>
            </ul>
          </div>

          {/* RIGHT: What Mizan isn't */}
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-700">
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

/* ─────────────────────────────────────────────────────────────────────────────
   HELPER COMPONENTS
   ───────────────────────────────────────────────────────────────────────────── */

function TrustStat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div
        className="text-[28px] font-bold leading-none text-gray-900"
        style={{ fontFamily: "Georgia, serif" }}
      >
        {n}
      </div>
      <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
        {label}
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  body,
  href,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="block bg-white p-7 transition hover:bg-gray-50"
    >
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-gray-700">
        {icon}
      </div>
      <h3
        className="mt-5 text-base font-bold text-gray-900"
        style={{ fontFamily: "Georgia, serif" }}
      >
        {title}
      </h3>
      <p className="mt-2 text-[13px] leading-relaxed text-gray-600">{body}</p>
      <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-gray-700">
        {cta}
        <ArrowRight size={12} />
      </div>
    </Link>
  );
}

function ListCard({
  kicker,
  title,
  count,
  description,
}: {
  kicker: string;
  title: string;
  count: number;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
        {kicker}
      </div>
      <div
        className="mt-2 text-[17px] font-bold text-gray-900"
        style={{ fontFamily: "Georgia, serif" }}
      >
        {title}
      </div>
      <div className="mt-1 text-xs text-gray-500">{count} stocks</div>
      <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-gray-600">
        {description}
      </p>
    </div>
  );
}
