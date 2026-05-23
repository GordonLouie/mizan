"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TickerSearch from "@/components/TickerSearch";
import { ArrowRight, GraduationCap, Calculator, Sparkles, ListChecks } from "lucide-react";
import { CURATED_LISTS } from "@/lib/lists";

export default function Home() {
  const router = useRouter();
  const [_t, setT] = useState("");

  return (
    <div className="space-y-20 pb-16">
      {/* HERO — single primary action */}
      <section className="pt-12 sm:pt-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl" style={{ fontFamily: "Georgia, serif" }}>
            Is your stock halal?
          </h1>
          <p className="mt-5 text-lg text-gray-600">
            Type any ticker. Get the verdict from six scholarly methodologies — including the rules no other app implements.
          </p>

          <div className="mx-auto mt-8 max-w-xl">
            <TickerSearch
              value=""
              onChange={(t) => { setT(t); if (t) router.push(`/screen?ticker=${encodeURIComponent(t)}`); }}
              placeholder="Try AAPL, AMZN, TSLA, or 'apple'…"
              autoFocus={false}
            />
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
            <span className="text-gray-500">Or jump to:</span>
            {["AAPL", "AMZN", "TSLA", "MSFT", "JPM", "SPUS"].map((t) => (
              <Link key={t} href={`/screen?ticker=${t}`} className="rounded border border-gray-200 bg-white px-2 py-0.5 text-gray-700 hover:border-navy-300 hover:text-navy-800">
                {t}
              </Link>
            ))}
          </div>
        </div>

        {/* Trust strip */}
        <div className="mx-auto mt-16 max-w-3xl border-y border-gray-200 py-5">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-navy-800" style={{ fontFamily: "Georgia, serif" }}>6</div>
              <div className="mt-1 text-xs uppercase tracking-wide text-gray-500">Scholarly methodologies</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-navy-800" style={{ fontFamily: "Georgia, serif" }}>163</div>
              <div className="mt-1 text-xs uppercase tracking-wide text-gray-500">Pre-screened stocks</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-navy-800" style={{ fontFamily: "Georgia, serif" }}>0</div>
              <div className="mt-1 text-xs uppercase tracking-wide text-gray-500">Black-box scores</div>
            </div>
          </div>
        </div>
      </section>

      {/* THE WEDGE — multi-scholar side-by-side */}
      <section className="mx-auto max-w-3xl">
        <div className="text-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-gold-600">Why Mizan exists</div>
          <h2 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl" style={{ fontFamily: "Georgia, serif" }}>
            Most apps check one rulebook.<br />Muslims follow many.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-600">
            Zoya, Wahed, Musaffa — every major halal app checks every stock against one standard (AAOIFI). But Muslims follow different scholars with different rules. Take Amazon:
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-gray-200 bg-gray-200 sm:grid-cols-2">
          <div className="bg-white p-7">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-emerald-700">Under AAOIFI</div>
            <div className="mt-5 text-5xl font-bold text-emerald-700 sm:text-6xl" style={{ fontFamily: "Georgia, serif" }}>Halal</div>
            <div className="mt-5 border-t border-gray-100 pt-4 text-xs text-gray-500">
              Debt/cap <span className="font-mono text-gray-800">6.5%</span> · cap <span className="font-mono">30%</span>
              <span className="ml-2 inline-block rounded-sm bg-emerald-50 px-1.5 py-0.5 font-semibold uppercase tracking-wider text-emerald-700">within</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">What Zoya, Wahed, and Musaffa would tell you.</p>
          </div>
          <div className="bg-white p-7">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-rose-700">Under Mufti Taqi Usmani</div>
            <div className="mt-5 text-5xl font-bold text-rose-700 sm:text-6xl" style={{ fontFamily: "Georgia, serif" }}>Not halal</div>
            <div className="mt-5 border-t border-gray-100 pt-4 text-xs text-gray-500">
              Tangible assets <span className="font-mono text-gray-800">12%</span> · floor <span className="font-mono">20%</span>
              <span className="ml-2 inline-block rounded-sm bg-rose-50 px-1.5 py-0.5 font-semibold uppercase tracking-wider text-rose-700">under</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">His illiquid-asset rule excludes AMZN. No other app surfaces this.</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/screen?ticker=AMZN" className="inline-flex items-center gap-1 text-sm font-medium text-navy-700 hover:text-navy-900">
            See AMZN under all six scholars <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* QUICK TOOLS — 3 cards, one row */}
      <section className="mx-auto max-w-4xl">
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-gray-200 bg-gray-200 sm:grid-cols-3">
          <FeatureCard icon={<GraduationCap size={18} />} title="Never invested before?"
            body="A 10-minute primer that explains stocks, halal screening, and what scholars actually disagree about."
            href="/learn" cta="Start with Halal Investing 101" />
          <FeatureCard icon={<Calculator size={18} />} title="Calculate your zakat"
            body="Cash, stocks, gold, crypto. Nisab check. 2.5% computed. Donate in one tap."
            href="/zakat" cta="Open the calculator" />
          <FeatureCard icon={<Sparkles size={18} />} title="Ask a halal-finance question"
            body="49 common questions pre-answered per scholar — crypto, gold, mortgage, 401(k), options, zakat."
            href="/ask" cta="Try the Q&A" />
        </div>
      </section>

      {/* CURATED LISTS — editorial entry point */}
      <section className="mx-auto max-w-4xl">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-gold-600">
              Curated lists
            </div>
            <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl" style={{ fontFamily: "Georgia, serif" }}>
              Not sure where to start?
            </h2>
            <p className="mt-2 max-w-xl text-sm text-gray-600">
              Hand-picked collections — mega-caps, dividend payers, ETFs, stricter-Hanafi-only equities. Every name re-screened against your scholar.
            </p>
          </div>
          <Link href="/lists" className="hidden text-sm font-medium text-navy-700 hover:text-navy-900 sm:inline-flex sm:items-center sm:gap-1">
            All lists <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {CURATED_LISTS.slice(0, 3).map((list) => (
            <Link
              key={list.slug}
              href={`/lists/${list.slug}`}
              className="group block rounded-lg border border-gray-200 bg-white p-5 transition hover:border-navy-300 hover:bg-navy-50/40"
            >
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-amber-50 text-amber-700">
                <ListChecks size={16} />
              </div>
              <div className="mt-3 text-base font-semibold text-gray-900 group-hover:text-navy-800" style={{ fontFamily: "Georgia, serif" }}>
                {list.title}
              </div>
              <div className="mt-1 text-xs text-gray-500">{list.tickers.length} stocks</div>
              <p className="mt-2 line-clamp-2 text-xs text-gray-600">{list.audience}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* TRUST — what we are / aren't */}
      <section className="mx-auto max-w-3xl border-t border-gray-200 pt-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-emerald-700">What Mizan is</div>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-700">
              <li>Free, transparent halal stock screening.</li>
              <li>Six scholarly methodologies + a custom builder.</li>
              <li>Zakat and purification calculators.</li>
              <li>Information you can verify — we show the math.</li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-rose-700">What Mizan isn&apos;t</div>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-700">
              <li>An investment advisor. We don&apos;t tell you what to buy.</li>
              <li>A bank or brokerage. We don&apos;t hold your money.</li>
              <li>A religious authority. We surface scholarly opinion — we don&apos;t issue rulings.</li>
              <li>A replacement for a qualified scholar on questions specific to you.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, body, href, cta }: { icon: React.ReactNode; title: string; body: string; href: string; cta: string }) {
  return (
    <Link href={href} className="block bg-white p-6 transition hover:bg-navy-50/50">
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-navy-50 text-navy-800">{icon}</div>
      <h3 className="mt-4 text-base font-semibold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{body}</p>
      <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-navy-700">
        {cta} <ArrowRight size={12} />
      </div>
    </Link>
  );
}
