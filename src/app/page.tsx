import Link from "next/link";
import { listStocks } from "@/lib/data";
import { ArrowRight, GraduationCap, ScanLine, Briefcase, HeartHandshake, Globe, Sparkles, Calculator, ChevronRight } from "lucide-react";

export default function Home() {
  const count = listStocks().length;

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="pt-8">
        <div className="inline-block rounded-full bg-navy-50 px-3 py-1 text-xs font-medium text-navy-800">
          For Muslim investors — beginners welcome
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl" style={{ fontFamily: "Georgia, serif" }}>
          Halal investing,{" "}
          <span className="text-navy-800">finally clear.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-7 text-gray-600">
          Wondering whether a stock is halal? Trying to figure out where to even
          start? Mizan tells you what your scholar would say about any stock — in
          plain English, with the math shown when you want it.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/learn" className="inline-flex items-center gap-2 rounded-md bg-navy-800 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700">
            <GraduationCap size={16} /> New to this? Start here
          </Link>
          <Link href="/screen?ticker=AAPL" className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50">
            Try the screener on Apple <ArrowRight size={16} />
          </Link>
        </div>

        {/* Trust strip */}
        <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-gray-500">
          <span>✓ Six scholar profiles</span>
          <span>✓ No black-box scores — we show the math</span>
          <span>✓ Free to use</span>
        </div>
      </section>

      {/* "What can Mizan do for me" */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>What can Mizan do for me?</h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard icon={<GraduationCap size={20} />} title="Teach me the basics"
            body="If you've never invested before, /learn is a 10-minute primer. We explain stocks, halal screening, and what scholars actually disagree about — in plain English."
            href="/learn" />
          <FeatureCard icon={<ScanLine size={20} />} title='"Is this stock halal?"'
            body='Search any ticker — like AAPL, TSLA, AMZN. Mizan gives a clear yes/no/borderline verdict, in plain English. With the math available if you want it.'
            href="/screen" />
          <FeatureCard icon={<Globe size={20} />} title="Show me halal stocks I could buy"
            body={`Browse all ${count} tickers Mizan ships with. Filter to "pass under my scholar" and see what's actually available.`}
            href="/universe" />
          <FeatureCard icon={<Calculator size={20} />} title="Calculate my zakat"
            body="Add up your assets, subtract debts, check if you reach nisab, see what 2.5% comes out to. One screen. Free."
            href="/zakat" />
          <FeatureCard icon={<Sparkles size={20} />} title="Answer my halal-finance questions"
            body="49 common questions pre-answered per scholar — crypto, gold, mortgages, 401(k), options, zakat. Type and search."
            href="/ask" />
          <FeatureCard icon={<Briefcase size={20} />} title="Score my whole portfolio"
            body="Paste your holdings, see which pass under your chosen scholar. Saved automatically so it's here next time."
            href="/portfolio" />
        </div>
      </section>

      {/* The demo, framed for beginners */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
            Why this matters: same stock, different verdict.
          </h2>
          <span className="text-xs text-gray-500">30-second demo</span>
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-700">
          Most halal-investing apps screen every stock against just one scholarly
          standard (called AAOIFI). But Muslims follow many different scholars,
          and they often disagree. Take Amazon as an example:
        </p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Under AAOIFI</div>
            <div className="mt-2 text-lg font-semibold text-emerald-800">Amazon is halal ✓</div>
            <p className="mt-1 text-xs text-emerald-700">This is what Zoya, Wahed, Musaffa all show.</p>
          </div>
          <div className="rounded-md border border-rose-200 bg-rose-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-rose-700">Under Mufti Taqi Usmani</div>
            <div className="mt-2 text-lg font-semibold text-rose-800">Amazon is NOT halal ✗</div>
            <p className="mt-1 text-xs text-rose-700">His rules require Amazon to own more real assets than it does. No other app shows this.</p>
          </div>
        </div>
        <div className="mt-4">
          <Link href="/screen?ticker=AMZN" className="inline-flex items-center gap-1 text-sm font-medium text-navy-700 hover:text-navy-900">
            See the full breakdown for AMZN <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* What we are / aren't */}
      <section className="rounded-xl border border-gray-200 bg-gray-50 p-6">
        <h2 className="text-base font-semibold text-gray-900">What Mizan is, and isn&apos;t</h2>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-emerald-700">Mizan is</div>
            <ul className="mt-2 ml-5 list-disc space-y-1 text-sm text-gray-700">
              <li>A free tool that tells you what scholars say about any stock.</li>
              <li>A calculator for zakat and for purifying dividends.</li>
              <li>A reference for halal-finance questions.</li>
              <li>Information, transparently sourced and explained.</li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-rose-700">Mizan isn&apos;t</div>
            <ul className="mt-2 ml-5 list-disc space-y-1 text-sm text-gray-700">
              <li>An investment advisor. We don&apos;t tell you what to buy.</li>
              <li>A bank or brokerage. We don&apos;t hold your money.</li>
              <li>A religious authority. We surface scholarly opinions — we don&apos;t issue rulings.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, body, href }: { icon: React.ReactNode; title: string; body: string; href: string }) {
  return (
    <Link href={href} className="block rounded-xl border border-gray-200 bg-white p-5 transition hover:border-navy-300 hover:shadow-sm">
      <div className="flex items-center gap-2 text-navy-800">{icon}<div className="font-semibold">{title}</div></div>
      <p className="mt-2 text-sm leading-6 text-gray-600">{body}</p>
      <div className="mt-3 inline-flex items-center text-xs font-medium text-navy-700">
        Open <ChevronRight size={12} className="ml-0.5" />
      </div>
    </Link>
  );
}
