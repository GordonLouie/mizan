import Link from "next/link";
import { ExternalLink } from "lucide-react";
import {
  SUKUK_STRUCTURES,
  SUKUK_VEHICLES,
  NOTABLE_ISSUANCES,
} from "@/lib/sukuk";
import { Card, PageHeader, Pill } from "@/components/ui";

export const metadata = {
  title: "Sukuk · Mizan",
  description:
    "Islamic bonds explained — primer, accessible ETFs and funds, and notable issuances. The fixed-income leg every halal portfolio needs.",
};

export default function SukukPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        kicker="Cross-asset"
        title="Sukuk — Islamic bonds"
        description="The fixed-income leg of a halal portfolio. Most diaspora Muslim investors avoid bonds entirely because they don't know sukuk exist or how to access them. This page is the answer."
      />

      {/* Quick framing */}
      <Card>
        <div className="text-[11px] font-semibold uppercase tracking-widest text-amber-700">
          Sukuk in one paragraph
        </div>
        <h2 className="mt-1 text-xl font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
          Bonds without the interest
        </h2>
        <p className="mt-3 text-sm leading-7 text-gray-700">
          Sukuk are Shariah-compliant alternatives to conventional bonds. Instead of lending
          money at interest, sukuk investors own a fractional share of a real asset (a lease,
          a partnership, a project) and earn the income that asset generates. The cash-flow
          profile feels bond-like — predictable periodic payments and a return of principal at
          maturity — but the underlying structure is genuine asset ownership, not a loan.
        </p>
        <p className="mt-3 text-sm leading-7 text-gray-700">
          Global sukuk issuance reached <strong>$200B+ in 2024</strong>. Sovereign issuers
          include Saudi Arabia, Indonesia, Malaysia, Türkiye, the UK, Hong Kong, and Luxembourg.
          As a retail investor you don&apos;t usually buy individual sukuk — you buy a fund or an
          ETF that holds many.
        </p>
      </Card>

      {/* Structures */}
      <section>
        <div className="mb-4">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-amber-700">
            The five structures
          </div>
          <h2 className="mt-1 text-2xl font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
            How sukuk actually work
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-600">
            Every sukuk uses one of these underlying structures. Your fund prospectus will name
            the structure for each holding; this is how to read it.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {SUKUK_STRUCTURES.map((s) => (
            <Card key={s.id}>
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
                  {s.name}
                </h3>
                <span className="font-mono text-xs text-gray-500" dir="rtl">{s.arabic}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-700">{s.what}</p>
              <div className="mt-4 rounded-md bg-emerald-50/40 px-3 py-2 text-xs leading-5 text-gray-700">
                <span className="font-semibold uppercase tracking-wider text-emerald-700">Why halal: </span>
                {s.why}
              </div>
              <div className="mt-2 text-xs italic text-gray-500">{s.example}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* Accessible vehicles */}
      <section>
        <div className="mb-4">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-amber-700">
            How to buy
          </div>
          <h2 className="mt-1 text-2xl font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
            Accessible sukuk vehicles
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-600">
            What you can actually buy through a standard retail brokerage. Hand-picked; updated quarterly.
          </p>
        </div>

        <div className="space-y-4">
          {SUKUK_VEHICLES.map((v) => (
            <Card key={v.ticker} padded={false}>
              <div className="border-b border-gray-100 px-6 py-5 sm:px-8">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div>
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-base font-bold text-gray-900">{v.ticker}</span>
                      <span className="text-sm text-gray-700">{v.name}</span>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {v.issuer} · {v.exchange} · {v.wrapper}
                    </div>
                  </div>
                  <Pill tone="navy">{v.wrapper.includes("ETF") ? "ETF" : "Fund"}</Pill>
                </div>
              </div>

              <div className="grid grid-cols-2 divide-x divide-y divide-gray-100 sm:grid-cols-4 sm:divide-y-0">
                <Stat label="Yield" value={`${v.distributionYieldPct.toFixed(1)}%`} sub="distribution" tone="pass" />
                <Stat label="Expense" value={`${v.expensePct.toFixed(2)}%`} sub="annual" />
                <Stat label="Duration" value={v.duration ? `${v.duration.toFixed(1)}y` : "—"} sub="rate sensitivity" />
                <Stat label="AUM" value={v.aumUsd ? fmtMoney(v.aumUsd) : "—"} sub="under management" />
              </div>

              <div className="space-y-3 border-t border-gray-100 px-6 py-5 sm:px-8">
                <p className="text-sm leading-6 text-gray-700">
                  <span className="font-semibold text-gray-900">Holdings: </span>
                  {v.composition}
                </p>
                <p className="text-sm leading-6 text-gray-700">
                  <span className="font-semibold text-gray-900">Why this matters: </span>
                  {v.rationale}
                </p>
                <a
                  href={v.info}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-navy-700 hover:underline"
                >
                  Issuer page <ExternalLink size={11} />
                </a>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Notable issuances */}
      <section>
        <div className="mb-4">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-amber-700">
            For context
          </div>
          <h2 className="mt-1 text-2xl font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
            Notable issuances
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-600">
            What the underlying sukuk market looks like — the deals your ETF is likely holding.
          </p>
        </div>

        <Card padded={false} className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-5 py-3">Issue</th>
                <th className="px-5 py-3">Size</th>
                <th className="px-5 py-3">Tenor</th>
                <th className="px-5 py-3">Structure</th>
                <th className="px-5 py-3">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {NOTABLE_ISSUANCES.map((i) => (
                <tr key={i.name}>
                  <td className="px-5 py-3">
                    <div className="font-semibold text-gray-900">{i.name}</div>
                    <div className="mt-0.5 text-xs italic text-gray-500">{i.note}</div>
                  </td>
                  <td className="px-5 py-3 tabular-nums text-gray-800">{i.size}</td>
                  <td className="px-5 py-3 text-gray-700">{i.tenor}</td>
                  <td className="px-5 py-3 text-gray-700">{i.structure}</td>
                  <td className="px-5 py-3 font-mono text-xs text-gray-700">{i.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>

      {/* Caveats */}
      <Card className="bg-gray-50">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
          Caveats
        </div>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-700">
          <li>
            <strong>&lsquo;Halal&rsquo; ≠ risk-free.</strong> Sukuk carry credit, duration, and currency
            risk. Investment-grade sovereign sukuk are roughly comparable to investment-grade
            conventional bonds in risk profile.
          </li>
          <li>
            <strong>Structure matters.</strong> Some &lsquo;sukuk&rsquo; deals have been criticised by scholars
            (notably Mufti Taqi Usmani in 2008) for replicating conventional debt economics under
            a Shariah wrapper. Look for clearly-structured ijara and musharaka issues.
          </li>
          <li>
            <strong>This isn&apos;t advice.</strong> Speak to a registered adviser before allocating.
            Mizan is information, not recommendation.
          </li>
        </ul>
      </Card>

      <p className="text-center text-xs text-gray-500">
        Updated May 2026. Back to{" "}
        <Link href="/discover" className="text-navy-700 underline">Discover</Link>.
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
  tone?: "pass" | "neutral";
}) {
  const cls = tone === "pass" ? "text-emerald-700" : "text-gray-900";
  return (
    <div className="px-5 py-4">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">{label}</div>
      <div className={`mt-1 text-lg font-bold ${cls}`} style={{ fontFamily: "Georgia, serif" }}>
        {value}
      </div>
      {sub && <div className="mt-0.5 text-[10px] text-gray-500">{sub}</div>}
    </div>
  );
}

function fmtMoney(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  return `$${n.toFixed(0)}`;
}
