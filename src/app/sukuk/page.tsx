import Link from "next/link";
import { ExternalLink } from "lucide-react";
import {
  SUKUK_STRUCTURES,
  SUKUK_VEHICLES,
  NOTABLE_ISSUANCES,
} from "@/lib/sukuk";

export const metadata = {
  title: "Sukuk · HalalGauge",
  description:
    "Islamic bonds explained — primer, accessible ETFs and funds, and notable issuances. The fixed-income leg every halal portfolio needs.",
};

export default function SukukPage() {
  return (
    <div className="pb-20">
      {/* PAGE HEADER */}
      <header className="pt-6">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Cross-asset · Sukuk
        </div>
        <h1
          className="mt-3 text-[36px] font-bold leading-[1.1] text-gray-900 sm:text-[44px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Sukuk — Islamic bonds
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-gray-600">
          The fixed-income leg of a halal portfolio. Most diaspora Muslim investors avoid
          bonds entirely because they don&apos;t know sukuk exist or how to access them.
          This page is the answer.
        </p>
      </header>

      {/* QUICK FRAMING */}
      <section className="mt-16">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Sukuk in one paragraph
        </div>
        <h2
          className="mt-2 text-[24px] font-bold leading-tight text-gray-900 sm:text-[28px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Bonds without the interest
        </h2>
        <div className="mt-5 max-w-2xl space-y-4 text-[14px] leading-relaxed text-gray-700">
          <p>
            Sukuk are Shariah-compliant alternatives to conventional bonds. Instead of
            lending money at interest, sukuk investors own a fractional share of a real
            asset (a lease, a partnership, a project) and earn the income that asset
            generates. The cash-flow profile feels bond-like — predictable periodic
            payments and a return of principal at maturity — but the underlying structure
            is genuine asset ownership, not a loan.
          </p>
          <p>
            Global sukuk issuance reached{" "}
            <strong className="text-gray-900">$200B+ in 2024</strong>. Sovereign issuers
            include Saudi Arabia, Indonesia, Malaysia, Türkiye, the UK, Hong Kong, and
            Luxembourg. As a retail investor you don&apos;t usually buy individual
            sukuk — you buy a fund or an ETF that holds many.
          </p>
        </div>
      </section>

      {/* STRUCTURES */}
      <section className="mt-20 border-t border-gray-200 pt-10">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          The five structures
        </div>
        <h2
          className="mt-2 text-[24px] font-bold leading-tight text-gray-900 sm:text-[28px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          How sukuk actually work
        </h2>
        <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-gray-600">
          Every sukuk uses one of these underlying structures. Your fund prospectus will
          name the structure for each holding; this is how to read it.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200 md:grid-cols-2">
          {SUKUK_STRUCTURES.map((s) => (
            <div key={s.id} className="bg-white p-6">
              <div className="flex items-baseline justify-between gap-3">
                <h3
                  className="text-[18px] font-bold text-gray-900"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {s.name}
                </h3>
                <span className="font-mono text-[11px] text-gray-500" dir="rtl">
                  {s.arabic}
                </span>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-gray-700">{s.what}</p>
              <div className="mt-4 border-l-2 border-emerald-300 py-1 pl-3 text-[12px] leading-relaxed text-gray-700">
                <span className="font-semibold uppercase tracking-[0.14em] text-emerald-700">
                  Why halal:{" "}
                </span>
                {s.why}
              </div>
              <div className="mt-3 text-[11px] italic text-gray-500">{s.example}</div>
            </div>
          ))}
        </div>
      </section>

      {/* VEHICLES */}
      <section className="mt-20 border-t border-gray-200 pt-10">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          How to buy
        </div>
        <h2
          className="mt-2 text-[24px] font-bold leading-tight text-gray-900 sm:text-[28px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Accessible sukuk vehicles
        </h2>
        <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-gray-600">
          What you can actually buy through a standard retail brokerage. Hand-picked;
          updated quarterly.
        </p>

        <div className="mt-8 space-y-8">
          {SUKUK_VEHICLES.map((v) => (
            <article key={v.ticker} className="rounded-xl border border-gray-200 bg-white p-6">
              {/* Header row */}
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[16px] font-bold text-gray-900">
                      {v.ticker}
                    </span>
                    <span className="text-[14px] text-gray-700">{v.name}</span>
                  </div>
                  <div className="mt-1 text-[11px] text-gray-500">
                    {v.issuer} · {v.exchange} · {v.wrapper}
                  </div>
                </div>
                <span className="rounded-full bg-navy-50 px-2.5 py-0.5 text-[11px] font-semibold text-navy-700">
                  {v.wrapper.includes("ETF") ? "ETF" : "Fund"}
                </span>
              </div>

              {/* Stats */}
              <div className="mt-5 grid grid-cols-2 gap-y-4 border-y border-gray-100 py-4 sm:grid-cols-4">
                <Stat label="Yield" value={`${v.distributionYieldPct.toFixed(1)}%`} sub="distribution" tone="emerald" />
                <Stat label="Expense" value={`${v.expensePct.toFixed(2)}%`} sub="annual" />
                <Stat label="Duration" value={v.duration ? `${v.duration.toFixed(1)}y` : "—"} sub="rate sensitivity" />
                <Stat label="AUM" value={v.aumUsd ? fmtMoney(v.aumUsd) : "—"} sub="under management" />
              </div>

              {/* Detail */}
              <div className="mt-5 space-y-3 text-[13px] leading-relaxed text-gray-700">
                <p>
                  <span className="font-semibold text-gray-900">Holdings: </span>
                  {v.composition}
                </p>
                <p>
                  <span className="font-semibold text-gray-900">Why this matters: </span>
                  {v.rationale}
                </p>
              </div>
              <a
                href={v.info}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1 text-[11px] font-medium text-navy-700 hover:text-navy-900 hover:underline"
              >
                Issuer page <ExternalLink size={11} />
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* NOTABLE ISSUANCES */}
      <section className="mt-20 border-t border-gray-200 pt-10">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          For context
        </div>
        <h2
          className="mt-2 text-[24px] font-bold leading-tight text-gray-900 sm:text-[28px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Notable issuances
        </h2>
        <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-gray-600">
          What the underlying sukuk market looks like — the deals your ETF is likely holding.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="pb-3 pr-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                  Issue
                </th>
                <th className="pb-3 pr-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                  Size
                </th>
                <th className="pb-3 pr-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                  Tenor
                </th>
                <th className="pb-3 pr-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                  Structure
                </th>
                <th className="pb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                  Rating
                </th>
              </tr>
            </thead>
            <tbody>
              {NOTABLE_ISSUANCES.map((i, idx) => (
                <tr
                  key={i.name}
                  className={idx !== NOTABLE_ISSUANCES.length - 1 ? "border-b border-gray-100" : ""}
                >
                  <td className="py-3 pr-4">
                    <div className="text-[14px] font-semibold text-gray-900">{i.name}</div>
                    <div className="mt-0.5 text-[11px] italic text-gray-500">{i.note}</div>
                  </td>
                  <td className="py-3 pr-4 font-mono text-[13px] tabular-nums text-gray-800">
                    {i.size}
                  </td>
                  <td className="py-3 pr-4 text-[13px] text-gray-700">{i.tenor}</td>
                  <td className="py-3 pr-4 text-[13px] text-gray-700">{i.structure}</td>
                  <td className="py-3 font-mono text-[12px] text-gray-700">{i.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CAVEATS */}
      <section className="mt-20 border-t border-gray-200 pt-10">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Caveats
        </div>
        <ul className="mt-5 max-w-2xl space-y-3 text-[14px] leading-relaxed text-gray-700">
          <li>
            <strong className="text-gray-900">&lsquo;Halal&rsquo; ≠ risk-free.</strong>{" "}
            Sukuk carry credit, duration, and currency risk. Investment-grade sovereign
            sukuk are roughly comparable to investment-grade conventional bonds in risk
            profile.
          </li>
          <li>
            <strong className="text-gray-900">Structure matters.</strong> Some
            &lsquo;sukuk&rsquo; deals have been criticised by scholars (notably Mufti Taqi
            Usmani in 2008) for replicating conventional debt economics under a Shariah
            wrapper. Look for clearly-structured ijara and musharaka issues.
          </li>
          <li>
            <strong className="text-gray-900">This isn&apos;t advice.</strong> Speak to a
            registered adviser before allocating. HalalGauge is information, not recommendation.
          </li>
        </ul>
      </section>

      {/* FOOTER */}
      <p className="mt-16 text-center text-[11px] text-gray-500">
        Updated May 2026. Back to{" "}
        <Link href="/discover" className="text-navy-700 underline hover:text-navy-900">
          Discover
        </Link>.
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  tone = "neutral",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "neutral" | "emerald";
}) {
  const cls = tone === "emerald" ? "text-emerald-700" : "text-gray-900";
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
        {label}
      </div>
      <div
        className={`mt-1 text-[18px] font-bold leading-none tabular-nums ${cls}`}
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
      </div>
      {sub && <div className="mt-1 text-[10px] text-gray-500">{sub}</div>}
    </div>
  );
}

function fmtMoney(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  return `$${n.toFixed(0)}`;
}
