import Link from "next/link";
import { listStocks } from "@/lib/data";
import { ArrowRight, ScanLine, Briefcase, HeartHandshake, Globe, Sparkles, ChevronRight } from "lucide-react";

export default function Home() {
  const count = listStocks().length;

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="pt-8">
        <div className="inline-block rounded-full bg-navy-50 px-3 py-1 text-xs font-medium text-navy-800">
          v0.2 prototype · {count}-ticker dataset · live demo
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Halal investing,{" "}
          <span className="text-navy-800">calibrated to your conscience.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-600">
          The first screener that adapts to <em>your</em> scholar&apos;s methodology.
          AAOIFI, Mufti Taqi Usmani, DJIM, Ja&apos;fari, strict zero-tolerance, or
          set your own thresholds. Same stock, six different verdicts. Transparent
          ratios. No black box.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/screen?ticker=AMZN" className="inline-flex items-center gap-2 rounded-md bg-navy-800 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700">
            Try the 60-second demo <ArrowRight size={16} />
          </Link>
          <Link href="/universe" className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50">
            Browse all {count} tickers <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      {/* Feature grid */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <FeatureCard icon={<ScanLine size={20} />} title="Screen any ticker"
          body="Pick your scholar and search any stock. Get a transparent ratio-by-ratio breakdown, not a single binary verdict." href="/screen" />
        <FeatureCard icon={<Globe size={20} />} title="Browse the universe"
          body={`Filter the entire ${count}-ticker dataset by sector and verdict. Sort by any column. Find every halal stock under your scholar.`} href="/universe" />
        <FeatureCard icon={<Briefcase size={20} />} title="Score your portfolio"
          body="Paste your holdings. See what passes under your scholar — and what doesn't. Weighted by position size." href="/portfolio" />
        <FeatureCard icon={<HeartHandshake size={20} />} title="Auto-purification"
          body="Calculate the impure portion of dividends — and for stricter scholars, your capital gains. Donate in one tap (coming soon)." href="/purification" />
        <FeatureCard icon={<Sparkles size={20} />} title="Ask a scholar"
          body="49 common questions pre-answered per scholar: crypto, gold, mortgage, 401(k), options, zakat. Production version powered by Claude." href="/ask" />
        <FeatureCard icon={<ScanLine size={20} />} title="Build your own"
          body="Your scholar's rulings don't match any preset? Build a custom profile with your own thresholds. Saved to your browser." href="/custom" />
      </section>

      {/* The demo */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-xl font-bold text-gray-900">The headline demo: AMZN under two scholars</h2>
        <p className="mt-1 max-w-2xl text-sm text-gray-600">
          Amazon passes the AAOIFI standard (the one Zoya, Musaffa, and Islamicly
          use). But under Mufti Taqi Usmani — the most-followed contemporary Hanafi
          scholar — Amazon <strong>fails</strong>, because its illiquid (tangible)
          assets are below the 20% floor he requires. Other apps don&apos;t surface
          this. Mizan does.
        </p>
        <div className="mt-4">
          <Link href="/screen?ticker=AMZN" className="inline-flex items-center gap-1 text-sm font-medium text-navy-700 hover:text-navy-900">
            See the side-by-side <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, body, href }: { icon: React.ReactNode; title: string; body: string; href: string }) {
  return (
    <Link href={href} className="block rounded-xl border border-gray-200 bg-white p-5 transition hover:border-navy-300 hover:shadow-sm">
      <div className="flex items-center gap-2 text-navy-800">{icon}<div className="font-semibold">{title}</div></div>
      <p className="mt-2 text-sm text-gray-600">{body}</p>
    </Link>
  );
}
