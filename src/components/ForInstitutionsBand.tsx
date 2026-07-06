/**
 * ForInstitutionsBand — the institutional presence on an otherwise retail-first
 * homepage. A single navy band (visually distinct from the retail flow) that
 * tells funds / banks / MPF providers there's a licensable infrastructure layer
 * here, and routes them to /institutions. Server-safe (no hooks).
 */
import Link from "next/link";
import { Boxes, Database, FileBadge, ArrowRight } from "lucide-react";

const PILLARS = [
  { icon: Boxes, title: "Custom index construction & licensing", body: "Bespoke Shariah-screened indices to your mandate — auditable methodology, ongoing maintenance." },
  { icon: Database, title: "Screening data API", body: "Multi-scholar verdicts, ratios and purification data, programmatically — JSON or CSV." },
  { icon: FileBadge, title: "Screening reports", body: "Deterministic screening reports — the figures, thresholds and cited sources behind every verdict. Methodology transparency, not religious certification." },
];

export default function ForInstitutionsBand() {
  return (
    <section className="mt-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-navy-900 px-6 py-12 text-white sm:px-12 sm:py-16">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Left — positioning */}
            <div className="lg:col-span-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300/90">
                For institutions
              </div>
              <h2
                className="mt-4 text-[28px] font-bold leading-[1.1] sm:text-[34px]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Screening infrastructure that shows its work.
              </h2>
              <p className="mt-4 max-w-md text-[14px] leading-relaxed text-gray-300">
                The same transparent, multi-scholar engine behind the retail product — licensable as
                index construction, a screening data API, and auditable screening reports for funds,
                banks and pension/MPF providers. HalalGauge is not a Shariah certification body;
                your own Shariah board keeps final authority.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/institutions"
                  className="inline-flex items-center gap-1.5 rounded-md bg-white px-5 py-2.5 text-[14px] font-semibold text-navy-900 transition hover:bg-gray-100"
                >
                  Explore institutional <ArrowRight size={15} />
                </Link>
                <a
                  href="mailto:hello@halalgauge.com?subject=HalalGauge%20for%20institutions"
                  className="inline-flex items-center gap-1.5 rounded-md border border-white/25 px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-white/10"
                >
                  Talk to us
                </a>
              </div>
            </div>

            {/* Right — pillars */}
            <div className="lg:col-span-7">
              <div className="grid gap-4 sm:grid-cols-3">
                {PILLARS.map((p) => (
                  <div key={p.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-emerald-300">
                      <p.icon size={18} />
                    </div>
                    <div className="mt-3 text-[14px] font-bold leading-snug" style={{ fontFamily: "var(--font-display)" }}>
                      {p.title}
                    </div>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-gray-400">{p.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
