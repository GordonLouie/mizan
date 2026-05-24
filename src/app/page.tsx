"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TickerSearch from "@/components/TickerSearch";
import { ArrowRight, GraduationCap, Calculator, Sparkles } from "lucide-react";
import { CURATED_LISTS } from "@/lib/lists";

export default function Home() {
  const router = useRouter();
  const [_t, setT] = useState("");

  return (
    <div className="pb-16">
      {/* HERO — restrained, single focal point */}
      <section className="pt-8 sm:pt-12">
        {/* Beta status — small, subtle, far less ink */}
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

          <div className="mx-auto mt-10 max-w-xl">
            <TickerSearch
              value=""
              onChange={(t) => { setT(t); if (t) router.push(`/screen?ticker=${encodeURIComponent(t)}`); }}
              placeholder="Try AAPL, AMZN, TSLA, or 'apple'…"
              autoFocus={false}
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5 text-xs">
            <span className="mr-1 text-gray-400">Try</span>
            {["AAPL", "AMZN", "TSLA", "MSFT", "JPM", "SPUS"].map((t) => (
              <Link
                key={t}
                href={`/screen?ticker=${t}`}
                className="rounded-md border border-gray-200 bg-white px-2 py-1 font-mono text-[11px] text-gray-700 transition hover:border-gray-400 hover:text-gray-900"
              >
                {t}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Whisper-thin separator + small trust strip */}
      <div className="mx-auto mt-20 max-w-xl">
        <div className="grid grid-cols-3 gap-6 border-t border-gray-200 pt-6 text-center">
          <TrustStat n="6" label="scholar profiles" />
          <TrustStat n="163" label="stocks screened" />
          <TrustStat n="0" label="black-box scores" />
        </div>
      </div>

      {/* THE WEDGE — the only visually-loud thing on the page */}
      <section className="mx-auto mt-28 max-w-3xl">
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

        <div className="mt-10 grid grid-cols-1 overflow-hidden rounded-xl border border-gray-200 sm:grid-cols-2">
          {/* AAOIFI side */}
          <div className="bg-white p-8">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Under AAOIFI
            </div>
            <div className="mt-6 text-[56px] font-bold leading-none text-emerald-700 sm:text-[64px]" style={{ fontFamily: "Georgia, serif" }}>
              Halal
            </div>
            <div className="mt-6 flex items-baseline gap-2 text-[12px] text-gray-600">
              <span>Debt/cap</span>
              <span className="font-mono font-semibold text-gray-900">6.5%</span>
              <span className="text-gray-300">·</span>
              <span>cap</span>
              <span className="font-mono text-gray-700">30%</span>
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-gray-600">
              What Zoya, Wahed, and Musaffa would tell you.
            </p>
          </div>

          {/* Border line */}
          <div className="border-t border-gray-200 bg-white p-8 sm:border-l sm:border-t-0">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-700">
              Under Mufti Taqi Usmani
            </div>
            <div className="mt-6 text-[56px] font-bold leading-none text-rose-700 sm:text-[64px]" style={{ fontFamily: "Georgia, serif" }}>
              Not halal
            </div>
            <div className="mt-6 flex items-baseline gap-2 text-[12px] text-gray-600">
              <span>Tangible</span>
              <span className="font-mono font-semibold text-gray-900">12%</span>
              <span className="text-gray-300">·</span>
              <span>floor</span>
              <span className="font-mono text-gray-700">20%</span>
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-gray-600">
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

      {/* QUICK TOOLS — 3 cards, minimal chrome */}
      <section className="mx-auto mt-28 max-w-4xl">
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200 sm:grid-cols-3">
          <FeatureCard icon={<GraduationCap size={18} />} title="New to investing?"
            body="A 10-minute primer on stocks, halal screening, and what scholars actually disagree about."
            href="/learn" cta="Halal Investing 101" />
          <FeatureCard icon={<Calculator size={18} />} title="Calculate your zakat"
            body="Cash, stocks, gold, crypto. Nisab check. 2.5% computed."
            href="/zakat" cta="Open the calculator" />
          <FeatureCard icon={<Sparkles size={18} />} title="Ask a question"
            body="49 common questions pre-answered per scholar — crypto, gold, mortgage, 401(k), options."
            href="/ask" cta="Try the Q&A" />
        </div>
      </section>

      {/* CURATED LISTS — clean grid, no amber */}
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

      {/* TRUST — what we are / aren't */}
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

function TrustStat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="text-[28px] font-bold leading-none text-navy-800 tabular-nums" style={{ fontFamily: "Georgia, serif" }}>
        {n}
      </div>
      <div className="mt-2 text-[10px] uppercase tracking-[0.16em] text-gray-500">{label}</div>
    </div>
  );
}

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
