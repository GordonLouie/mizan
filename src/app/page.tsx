"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TickerSearch from "@/components/TickerSearch";
import { ArrowRight, GraduationCap, Calculator, Sparkles } from "lucide-react";
import { CURATED_LISTS } from "@/lib/lists";
import { listStocks, findStock } from "@/lib/data";
import { SCHOLAR_PROFILES } from "@/lib/scholars";
import { screenStock } from "@/lib/screen";
import CompanyLogo from "@/components/CompanyLogo";
import EarningsCalendar from "@/components/EarningsCalendar";

export default function Home() {
  const router = useRouter();
  const [_t, setT] = useState("");

  const tickerCount = listStocks().length;

  return (
    <div className="pb-16">
      {/* 1. STATUS LINE — small whisper, not a banner */}
      <section className="pt-8 sm:pt-12">
        <div className="mb-12 flex justify-center">
          <Link
            href="/trust"
            className="group inline-flex items-center gap-1.5 text-[11px] font-medium text-gray-500 transition hover:text-gray-800"
          >
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
            <span className="uppercase tracking-[0.18em]">Private beta</span>
            <span className="text-gray-300">·</span>
            <span className="text-gray-500 group-hover:text-navy-700 group-hover:underline">status</span>
          </Link>
        </div>
      </section>

      {/* 4. THE WEDGE — page anchor moment, only loud element.
          Lifted ABOVE the search per Tyler's feedback 2026-06-07: "'why mizan?'
          section is genuinely the best bit of the whole site, if that was the
          first thing people saw instead of the search bar I think it would
          land so much better." */}
      <section className="mx-auto mt-8 max-w-3xl">
        <div className="text-center">
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-600">
            Why Mizan
          </div>
          <h2
            className="mt-3 text-[28px] font-bold leading-[1.15] text-gray-900 sm:text-[36px]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Most apps check one rulebook.<br />Muslims follow many.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-gray-600">
            Every major halal app screens against one standard (AAOIFI). Different scholars reach different verdicts on the same stock. Take Amazon:
          </p>
        </div>

        {/* FT-print-spread comparison panel.
            Direction: editorial-Georgia for the verdict, Bloomberg-mono for the
            data, tiny "AS OF" caption — a Financial Times spread that runs on
            a Bloomberg Terminal. See DESIGN_DIRECTION.md. */}
        <div className="mt-10 grid grid-cols-1 overflow-hidden rounded-xl border border-gray-200 sm:grid-cols-2">
          {/* LEFT: AAOIFI */}
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

          {/* RIGHT: Mufti Taqi Usmani */}
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

      <section className="mx-auto mt-20 max-w-2xl">
        {/* 2. HERO — centered, max-w-2xl.
            Direction: H1 → punchline subhead → stats trio → search.
            Adapted from collegepilot.app's hero pattern (see DESIGN_DIRECTION.md). */}
        <div className="mx-auto max-w-2xl text-center">
          <h1
            className="text-[52px] font-bold leading-[1.02] tracking-tight text-gray-900 sm:text-[88px]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Is your stock halal?
          </h1>

          {/* Punchline subhead — second line as a structural beat, not flat copy.
              Adapted from collegepilot's split-headline pattern. */}
          <p
            className="mx-auto mt-6 max-w-xl text-[20px] font-medium leading-[1.3] text-gray-800 sm:text-[24px]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Six scholars, one screen.
          </p>
          <p className="mx-auto mt-3 max-w-xl text-[14px] leading-relaxed text-gray-500">
            Including Mufti Taqi Usmani&apos;s illiquid-asset rule — the one no other halal app implements.
          </p>

          {/* Stats trio — lifted directly under the headline like collegepilot does.
              Bloomberg-style monospace tabular formatting keeps it on-brand. */}
          <div className="mx-auto mt-10 grid max-w-md grid-cols-3 divide-x divide-gray-200 border-y border-gray-200 py-5 font-mono tabular-nums">
            <div className="px-2">
              <div className="text-[24px] font-bold leading-none text-navy-800 sm:text-[28px]"
                style={{ fontFamily: "Georgia, serif" }}>6</div>
              <div className="mt-2 text-[10px] uppercase tracking-[0.14em] text-gray-500">Scholars</div>
            </div>
            <div className="px-2">
              <div className="text-[24px] font-bold leading-none text-navy-800 sm:text-[28px]"
                style={{ fontFamily: "Georgia, serif" }}>{tickerCount}</div>
              <div className="mt-2 text-[10px] uppercase tracking-[0.14em] text-gray-500">Tickers</div>
            </div>
            <div className="px-2">
              <div className="text-[24px] font-bold leading-none text-navy-800 sm:text-[28px]"
                style={{ fontFamily: "Georgia, serif" }}>0</div>
              <div className="mt-2 text-[10px] uppercase tracking-[0.14em] text-gray-500">Black-box scores</div>
            </div>
          </div>

          {/* Real TickerSearch — wired to router */}
          <div className="mx-auto mt-10 max-w-xl">
            <TickerSearch
              value=""
              onChange={(t) => { setT(t); if (t) router.push(`/screen?ticker=${encodeURIComponent(t)}`); }}
              placeholder="Type a ticker — AAPL, AMZN, TSLA, or 'apple'…"
              autoFocus={false}
            />
          </div>

          {/* DEPTH-OF-USE prompt — lead with the disagreement moment, not a generic chip */}
          <div className="mx-auto mt-5 max-w-xl">
            <Link
              href="/screen?ticker=AMZN"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-navy-700 transition hover:text-navy-900"
            >
              See where the scholars split on Amazon <ArrowRight size={13} />
            </Link>
          </div>

          {/* Company chips with real logos — Clearbit-sourced, monogram fallback. */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-xs">
            <span className="mr-1 text-gray-400">Or try</span>
            {[
              { ticker: "AAPL", name: "Apple" },
              { ticker: "TSLA", name: "Tesla" },
              { ticker: "MSFT", name: "Microsoft" },
              { ticker: "JPM", name: "JPMorgan" },
              { ticker: "META", name: "Meta" },
              { ticker: "SPUS", name: "Halal S&P ETF" },
            ].map((s) => (
              <Link
                key={s.ticker}
                href={`/screen?ticker=${s.ticker}`}
                className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white py-1 pl-1 pr-2 text-[11px] text-gray-700 transition hover:border-gray-400 hover:text-gray-900"
              >
                <CompanyLogo ticker={s.ticker} size={18} />
                {s.name}
              </Link>
            ))}
          </div>

          {/* "Don't know your scholar?" onboarding path */}
          <p className="mt-6 text-[12px] text-gray-500">
            Don&apos;t know which scholar you follow?{" "}
            <Link href="/learn" className="text-navy-700 underline hover:text-navy-900">
              60-second primer
            </Link>{" "}
            — most American Muslims start with AAOIFI.
          </p>
        </div>
      </section>

      {/* 3. METHODOLOGY SOURCES STRIP — collegepilot's "logos of every elite
          university" pattern, on-brand for Mizan as editorial badges of the
          actual primary sources. Builds rigor signal without glossy logos. */}
      <section className="mx-auto mt-20 max-w-4xl">
        <div className="text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Sourced from
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-3 text-[11px] text-gray-600">
          {[
            { abbr: "AAOIFI", full: "Standard No. 21" },
            { abbr: "S&P DJIM", full: "Index Methodology" },
            { abbr: "Mufti Taqi Usmani", full: "Published rulings" },
            { abbr: "Sistani.org", full: "Code of Practice" },
            { abbr: "SEC", full: "10-Q / 10-K filings" },
          ].map((s) => (
            <div
              key={s.abbr}
              className="inline-flex items-baseline gap-2 rounded-md border border-gray-200 bg-white px-3 py-1.5"
            >
              <span
                className="font-semibold text-navy-800"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {s.abbr}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-gray-400">
                {s.full}
              </span>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-4 max-w-md text-center text-[11px] italic text-gray-500">
          Every threshold on Mizan traces back to a published primary source.
        </p>
      </section>

      {/* 4b. MEET THE SCHOLARS — Tyler's feedback 2026-06-07: "the '6 scholars'
          on the homepage, everyone's going to try click it. would be sick if
          each one was a little card that told you what it means and linked to
          the learn page." Six small cards, each one-line + link to /learn. */}
      <section className="mx-auto mt-24 max-w-4xl">
        <div className="text-center">
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-600">
            Six scholars, one screen
          </div>
          <h2
            className="mt-3 text-[24px] font-bold leading-tight text-gray-900 sm:text-[30px]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Meet the scholars Mizan covers
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[14px] leading-relaxed text-gray-600">
            Tap any to read the methodology. Not sure which one to follow? Most
            American Muslims start with AAOIFI.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200 sm:grid-cols-2 lg:grid-cols-3">
          {SCHOLAR_PROFILES.filter((p) => p.id !== "custom").map((p) => {
            // Live Bloomberg-style verdict for AAPL under each scholar.
            // Editorial frame, live data inside — the Mizan signature move.
            const aapl = findStock("AAPL");
            const verdict = aapl ? screenStock(aapl, p).verdict : null;
            const verdictText =
              verdict === "pass" ? "HALAL"
              : verdict === "fail" ? "NOT HALAL"
              : verdict === "borderline" ? "DOUBTFUL"
              : "—";
            const verdictTone =
              verdict === "pass" ? "text-emerald-700"
              : verdict === "fail" ? "text-rose-700"
              : verdict === "borderline" ? "text-amber-700"
              : "text-gray-400";
            return (
              <Link
                key={p.id}
                href={`/learn#${p.id}`}
                className="group flex flex-col bg-white p-5 transition hover:bg-navy-50/30"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h3
                    className="text-[15px] font-bold text-gray-900 group-hover:text-navy-800"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {p.short}
                  </h3>
                  <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-gray-400">
                    {p.id === "taqi_usmani" ? "Hanafi" : p.id === "jafari" ? "Shia" : p.id === "strict" ? "Minority" : "Sunni"}
                  </span>
                </div>
                <p className="mt-2 line-clamp-3 text-[12px] leading-relaxed text-gray-600">
                  {p.blurb}
                </p>

                {/* Bloomberg ticker tape — live AAPL verdict under this scholar */}
                <div className="mt-4 flex items-baseline justify-between border-t border-gray-100 pt-3 font-mono text-[10px] uppercase tracking-[0.12em] tabular-nums">
                  <span className="text-gray-400">AAPL · ruling</span>
                  <span className={"font-bold " + verdictTone}>{verdictText}</span>
                </div>

                <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-navy-700 group-hover:text-navy-900">
                  Read the methodology <ArrowRight size={11} />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/learn"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-navy-700 transition hover:text-navy-900"
          >
            Full halal-investing primer <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      {/* 4c. EARNINGS CALENDAR — horizontal-scroll cards. Adapted from the
          21st.dev economic-calendar pattern (Mizan's editorial+Bloomberg style,
          not the original SaaS chrome). Surfaces the soon-to-report tickers
          with their current verdict + stability flag so users see what's
          about to flip. */}
      <section className="mx-auto mt-28 max-w-5xl">
        <EarningsCalendar limit={20} />
      </section>

      {/* 5. THREE FEATURE CARDS — gap-px divider trick */}
      <section className="mx-auto mt-28 max-w-4xl">
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200 sm:grid-cols-3">
          <FeatureCard
            icon={<GraduationCap size={18} />}
            title="New to investing?"
            body="A 10-minute primer on stocks, halal screening, and what scholars actually disagree about."
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
            icon={<Sparkles size={18} />}
            title="Ask a question"
            body="49 common questions pre-answered per scholar — crypto, gold, mortgage, 401(k), options."
            href="/ask"
            cta="Try the Q&A"
          />
        </div>
      </section>

      {/* 6. CURATED LISTS — real data from /lib/lists */}
      <section className="mx-auto mt-28 max-w-4xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
              Discover
            </div>
            <h2 className="mt-2 text-[26px] font-bold leading-tight text-gray-900 sm:text-[32px]" style={{ fontFamily: "Georgia, serif" }}>
              Not sure where to start?
            </h2>
            <p className="mt-2 max-w-xl text-sm text-gray-600">
              Hand-picked collections — re-screened against your scholar.
            </p>
          </div>
          <Link href="/lists" className="hidden text-sm font-medium text-navy-700 hover:text-navy-900 sm:inline-flex sm:items-center sm:gap-1">
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
              <div className="mt-2 text-[17px] font-bold text-gray-900 group-hover:text-navy-800" style={{ fontFamily: "Georgia, serif" }}>
                {list.title}
              </div>
              <div className="mt-1 text-xs text-gray-500">{list.tickers.length} stocks</div>
              <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-gray-600">{list.audience}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. WHAT MIZAN IS / ISN'T */}
      <section className="mx-auto mt-28 max-w-3xl border-t border-gray-200 pt-14">
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

/* ─────────────────────────────────────────────────────────────────────────────
   HELPER COMPONENTS
   ───────────────────────────────────────────────────────────────────────────── */

function FeatureCard({ icon, title, body, href, cta }: { icon: React.ReactNode; title: string; body: string; href: string; cta: string }) {
  return (
    <Link href={href} className="block bg-white p-7 transition hover:bg-navy-50/40">
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-navy-50 text-navy-800">{icon}</div>
      <h3 className="mt-5 text-base font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>{title}</h3>
      <p className="mt-2 text-[13px] leading-relaxed text-gray-600">{body}</p>
      <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-navy-700">
        {cta} <ArrowRight size={12} />
      </div>
    </Link>
  );
}
