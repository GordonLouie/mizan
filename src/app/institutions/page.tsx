/**
 * /institutions — the institutional offering, made concrete. Funds, banks, and
 * pension/MPF providers. Sales-led (contact), not self-serve. Replaces the
 * generic three-pillar template with specifics a buyer can actually evaluate:
 * coverage numbers, the standards, a real API request/response, what's in the
 * report, and a concrete pilot process.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { Boxes, Database, FileBadge, ShieldCheck, ArrowRight, Layers, Bell } from "lucide-react";
import { listStocks } from "@/lib/data";

const SITE = "https://halalgauge.com";

export const metadata: Metadata = {
  title: "HalalGauge for institutions — halal index licensing, screening data & white-label reports",
  description:
    "Transparent, multi-scholar Shariah infrastructure for funds, banks and pension/MPF providers: custom halal index construction & licensing, a screening data API, white-label compliance reports, and audit-grade fund screening.",
  alternates: { canonical: `${SITE}/institutions` },
};

const OFFERINGS = [
  {
    icon: Boxes,
    title: "Custom index construction & licensing",
    body: "A bespoke Shariah-screened index to your mandate — universe, standard, weighting, rebalance schedule — with a transparent, auditable methodology and ongoing constituent maintenance. License it as the basis for a fund or MPF option.",
  },
  {
    icon: Database,
    title: "Screening data API & feed",
    body: "Programmatic multi-standard compliance verdicts, financial ratios, and purification data across our coverage — for your apps, advisory tools, or compliance workflows. JSON or CSV, per-seat or usage-based.",
  },
  {
    icon: FileBadge,
    title: "White-label compliance reports",
    body: "Branded, client-ready Shariah reports for your funds and holdings — the deterministic verdict, every figure, and a plain-language explanation, under your name.",
  },
  {
    icon: ShieldCheck,
    title: "Audit-grade fund & portfolio screening",
    body: "Periodic screening of a fund or portfolio against your chosen standard, with a clear paper trail of what was checked, the thresholds applied, and the sources — built for regulatory scrutiny.",
  },
];

export default function InstitutionsPage() {
  const coverage = listStocks().filter((s) => s.sector !== "ETF").length;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">For institutions</div>
      <h1 className="mt-2 text-[30px] font-bold leading-tight text-gray-900 sm:text-[38px]" style={{ fontFamily: "var(--font-display)" }}>
        Shariah infrastructure you can put your name on.
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-gray-700">
        The existing Shariah indices are narrow, opaque, single-standard fund products. HalalGauge is
        the transparent, multi-standard, customizable layer underneath — for funds, banks, and
        pension/MPF providers who need halal screening and indexing they (and their regulators)
        can audit.
      </p>

      {/* The two differentiators — concrete, not generic */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-navy-200 bg-navy-50/40 p-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-navy-700"><Layers size={18} /></div>
          <h2 className="mt-3 text-[15px] font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>Multi-standard, every threshold sourced</h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-gray-700">
            The same security under AAOIFI, Mufti Taqi Usmani, S&amp;P DJIM, Ja&apos;fari and a strict view — each
            verdict tied to the deciding ratio and its primary source. Defensible to a Shariah board and a regulator.
          </p>
        </div>
        <div className="rounded-2xl border border-navy-200 bg-navy-50/40 p-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-navy-700"><Bell size={18} /></div>
          <h2 className="mt-3 text-[15px] font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>Compliance-drift monitoring</h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-gray-700">
            Ongoing surveillance of a fund or index for holdings nearing — or crossing — a ratio limit, with the
            paper trail. The maintenance layer a live Shariah product actually needs, not a one-off screen.
          </p>
        </div>
      </div>

      {/* Coverage & standards — specifics */}
      <section className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 sm:grid-cols-4">
        {[
          { v: "5", l: "Scholarly standards" },
          { v: `${coverage}+`, l: "US equities screened" },
          { v: "Daily", l: "Refresh cadence" },
          { v: "100%", l: "Thresholds source-cited" },
        ].map((s) => (
          <div key={s.l} className="bg-white p-5 text-center">
            <div className="text-[22px] font-bold text-navy-800" style={{ fontFamily: "var(--font-display)" }}>{s.v}</div>
            <div className="mt-1 text-[11px] uppercase tracking-wide text-gray-500">{s.l}</div>
          </div>
        ))}
      </section>
      <p className="mt-2 text-[11px] text-gray-400">
        US coverage live today; Hong Kong / Asia-Pacific (HKEX) in progress. A data-quality guard withholds a
        verdict on any security whose fundamentals look implausible rather than report a number we don&apos;t trust.
      </p>

      {/* Offerings */}
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {OFFERINGS.map((o) => (
          <div key={o.title} className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
              <o.icon size={20} />
            </div>
            <h2 className="mt-3 text-[16px] font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>{o.title}</h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-gray-600">{o.body}</p>
          </div>
        ))}
      </div>

      {/* API at a glance — realistic request/response */}
      <section className="mt-10 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-[16px] font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>Screening API — at a glance</h2>
        <p className="mt-1.5 text-[13px] leading-relaxed text-gray-600">
          Bearer-authenticated, JSON or CSV. Each result returns the verdict, the business-activity check, every
          financial ratio (observed / threshold / pass), and the purification rule — for any of the five standards.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-navy-900 p-4 text-[12px] leading-relaxed text-gray-100">
{`GET /api/v1/screen?tickers=AAPL&scholar=aaoifi
Authorization: Bearer <your-api-key>

{
  "scholar": "aaoifi",
  "results": [{
    "ticker": "AAPL",
    "verdict": "pass",
    "sectorPasses": true,
    "ratios": [
      { "metric": "Interest-bearing debt / mkt cap", "valuePct": 4.1, "thresholdPct": 30, "passes": true },
      { "metric": "Cash + securities / mkt cap",      "valuePct": 9.7, "thresholdPct": 30, "passes": true },
      { "metric": "Impermissible income / revenue",   "valuePct": 0.6, "thresholdPct": 5,  "passes": true }
    ],
    "purification": { "pctOfDividend": 0.6 }
  }]
}`}
        </pre>
        <p className="mt-3 text-[12px] text-gray-500">
          Keys are issued per engagement. Bulk export, scheduled feeds, drift webhooks and white-label fields available on request.
        </p>
      </section>

      {/* What's in the white-label report */}
      <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-[16px] font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>What&apos;s in a white-label report</h2>
        <ul className="mt-3 grid gap-2 text-[13px] leading-relaxed text-gray-700 sm:grid-cols-2">
          <li>• Per-holding verdict under your chosen standard</li>
          <li>• Every deciding ratio: observed, threshold, pass/fail</li>
          <li>• Business-activity (sector) screen with the reason</li>
          <li>• Purification owed, computed per holding</li>
          <li>• Plain-language explanation (no fiqh claims, no advice)</li>
          <li>• Sources for every threshold, your branding throughout</li>
        </ul>
        <a
          href="mailto:hello@halalgauge.com?subject=HalalGauge%20%E2%80%94%20request%20a%20sample%20report"
          className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-gray-300 px-4 py-2 text-[13px] font-semibold text-gray-700 transition hover:border-gray-400"
        >
          Request a sample report <ArrowRight size={14} />
        </a>
      </section>

      {/* How a pilot works */}
      <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-[16px] font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>How a pilot works</h2>
        <ol className="mt-3 space-y-3">
          {[
            { n: "1", t: "Scope", d: "You tell us the universe, the standard(s), and the deliverable — index, API, reports, or fund/portfolio surveillance." },
            { n: "2", t: "Methodology sign-off", d: "We document the screen and thresholds for your Shariah board to review and approve before anything ships." },
            { n: "3", t: "Integrate & maintain", d: "We deliver the feed/report/index and run ongoing drift monitoring, with the audit trail your compliance team needs." },
          ].map((s) => (
            <li key={s.n} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy-800 text-[12px] font-bold text-white">{s.n}</span>
              <div className="text-[13px] leading-relaxed text-gray-700"><span className="font-semibold text-gray-900">{s.t}.</span> {s.d}</div>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-10 rounded-2xl border border-navy-200 bg-navy-50/40 p-6 text-center">
        <h2 className="text-[18px] font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
          Let&apos;s scope your mandate
        </h2>
        <p className="mx-auto mt-1.5 max-w-lg text-[14px] leading-relaxed text-gray-600">
          Tell us what you&apos;re building — a Shariah fund, an MPF option, a compliance workflow — and we&apos;ll
          scope a pilot. We&apos;re early-stage and transparent about it; you&apos;ll talk to the people building it.
        </p>
        <a
          href="mailto:hello@halalgauge.com?subject=HalalGauge%20for%20institutions"
          className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-navy-800 px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-navy-700"
        >
          Contact us <ArrowRight size={15} />
        </a>
      </div>

      <p className="mt-8 text-center text-[12px] text-gray-500">
        Exploring on your own first? <Link href="/indexes" className="font-semibold text-navy-700">See the halal baskets →</Link>
      </p>
    </main>
  );
}
