/**
 * /institutions — the institutional offering, made concrete. Funds, banks, and
 * pension/MPF providers. Sales-led (contact), not self-serve.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { Boxes, Database, FileBadge, ShieldCheck, ArrowRight } from "lucide-react";

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
    title: "Custom halal index construction & licensing",
    body: "We build and maintain a bespoke Shariah-screened index to your mandate — universe, standard, weighting, rebalance schedule — with a transparent, auditable methodology and ongoing constituent maintenance. License it as the basis for a fund or MPF option.",
  },
  {
    icon: Database,
    title: "Screening data API & feed",
    body: "Programmatic access to multi-scholar compliance verdicts, financial ratios, and purification data across our coverage — for your own apps, advisory tools, or compliance workflows. JSON or CSV, per-seat or usage-based.",
  },
  {
    icon: FileBadge,
    title: "White-label compliance reports",
    body: "Branded, client-ready Shariah compliance reports for your funds and holdings — the deterministic verdict and figures, with written analysis, under your name.",
  },
  {
    icon: ShieldCheck,
    title: "Audit-grade fund & portfolio screening",
    body: "Periodic screening of a fund or portfolio against your chosen standard, with a clear paper trail of what was checked, the thresholds applied, and the sources — built for scrutiny.",
  },
];

export default function InstitutionsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">For institutions</div>
      <h1 className="mt-2 text-[30px] font-bold leading-tight text-gray-900 sm:text-[38px]" style={{ fontFamily: "var(--font-display)" }}>
        Shariah infrastructure you can put your name on.
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-gray-700">
        The existing Shariah indices are narrow, opaque, single-standard fund products. HalalGauge is
        the transparent, multi-scholar, customizable layer underneath — for funds, banks, and
        pension/MPF providers who need halal screening and indexing they (and their regulators)
        can audit.
      </p>

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

      {/* API at a glance */}
      <section className="mt-10 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-[16px] font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>Screening API — at a glance</h2>
        <p className="mt-1.5 text-[13px] leading-relaxed text-gray-600">
          Programmatic, multi-scholar compliance data — Bearer-authenticated, JSON or CSV.
          Each row returns the verdict, the business-activity check, every financial ratio
          (observed / threshold / pass), and the purification rule.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-navy-900 p-4 text-[12px] leading-relaxed text-gray-100">
{`GET /api/v1/screen?tickers=AAPL,MSFT&scholar=aaoifi&format=json
Authorization: Bearer <your-api-key>

→ { "scholar": "aaoifi", "count": 2, "results": [
     { "ticker": "AAPL", "verdict": "pass", "sectorPasses": true,
       "ratios": [ { "metric": "...", "valuePct": 0.6, "thresholdPct": 5, "passes": true }, ... ] },
     ... ] }`}
        </pre>
        <p className="mt-3 text-[12px] text-gray-500">
          Keys are issued per engagement. Bulk export, scheduled feeds, and white-label fields available on request.
        </p>
      </section>

      <div className="mt-10 rounded-2xl border border-navy-200 bg-navy-50/40 p-6 text-center">
        <h2 className="text-[18px] font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
          Let&apos;s talk about your mandate
        </h2>
        <p className="mx-auto mt-1.5 max-w-lg text-[14px] leading-relaxed text-gray-600">
          Tell us what you&apos;re building — a Shariah fund, an MPF option, a compliance workflow —
          and we&apos;ll scope a pilot.
        </p>
        <a
          href="mailto:hello@halalgauge.com?subject=HalalGauge%20for%20institutions"
          className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-navy-800 px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-navy-700"
        >
          Contact us <ArrowRight size={15} />
        </a>
      </div>

      <p className="mt-8 text-center text-[12px] text-gray-500">
        Exploring on your own first? <Link href="/indexes" className="font-semibold text-navy-700">See the halal indexes →</Link>
      </p>
    </main>
  );
}
