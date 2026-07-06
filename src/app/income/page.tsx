/**
 * /income — the halal fixed-income & protection explorer.
 *
 * The reference surface for the "safe money" side of a halal portfolio: the
 * products that stand in for bonds, CDs and insurance. Deliberately education,
 * not a fatwa — HalalGauge has no credentialed scholar on staff yet, so every
 * product ends on "check the specific structure and ask a qualified scholar."
 *
 * Structure:
 *   1. Header + framing (why bonds/CDs/insurance are off the table).
 *   2. Interactive ProductExplorer — sukuk, takaful, Islamic deposits.
 *   3. Side-by-side comparisons (sukuk vs bond, takaful vs insurance).
 *   4. The excluded conventional products, with the reason each fails.
 *   5. A universal "what to verify" note + honest disclaimer.
 */

import Link from "next/link";
import {
  ArrowRight,
  ScanSearch,
  XCircle,
  Coins,
  ShieldCheck,
  Landmark,
} from "lucide-react";
import ProductExplorer from "./ProductExplorer";
import { COMPARISONS, EXCLUDED } from "./incomeData";

export const metadata = {
  title: "Halal income & protection",
  description:
    "Sukuk, takaful and Islamic deposits explained in plain English — what they are, why they're permissible, and what to verify. Plus why bonds, CDs, insurance and annuities are excluded.",
};

const FLAG_LABEL: Record<string, string> = {
  riba: "riba · interest",
  gharar: "gharar · excessive uncertainty",
  maysir: "maysir · gambling",
};

export default function IncomePage() {
  return (
    <div className="pb-20">
      {/* HEADER */}
      <header className="pt-6">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Halal income &amp; protection · 3 families
        </div>
        <h1
          className="mt-3 text-[36px] font-bold leading-[1.05] text-gray-900 sm:text-[46px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          The safe money, done halal.
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-gray-600">
          Bonds, term deposits and insurance are the boring backbone of most
          portfolios — and most of them run on interest. Here are the products
          that do the same jobs without it: sukuk, takaful and Islamic deposits,
          explained in plain English. Tap any product for the full breakdown and
          a checklist of what to verify.
        </p>
      </header>

      {/* WHY THE DEFAULTS ARE OUT — quick framing */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <FrameCard
          icon={<Coins size={16} />}
          title="Bonds pay interest"
          body="A bond is a loan with a fixed coupon. Any guaranteed increase on money lent is riba (interest)."
        />
        <FrameCard
          icon={<Landmark size={16} />}
          title="CDs guarantee a rate"
          body="A certificate of deposit is money lent to a bank at a promised rate — riba, however it's dressed up."
        />
        <FrameCard
          icon={<ShieldCheck size={16} />}
          title="Insurance sells uncertainty"
          body="Conventional cover trades money for an uncertain payout (gharar) and invests reserves in interest."
        />
      </div>

      {/* DISCLAIMER — up top, like /assets */}
      <div className="mt-4 rounded-xl border border-gold-200 bg-gold-50/60 px-4 py-3">
        <p className="text-[12.5px] leading-relaxed text-gray-700">
          <span className="font-semibold text-gray-900">Education, not a fatwa.</span>{" "}
          HalalGauge has no credentialed scholar on staff yet. With these products
          the <em>structure</em> decides the ruling — two things called
          &ldquo;sukuk&rdquo; or &ldquo;takaful&rdquo; can be built very
          differently. Read the specific product&apos;s prospectus and consult a
          qualified scholar before you commit.
        </p>
      </div>

      {/* EXPLORER */}
      <section className="mt-12">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Explore the products
        </div>
        <h2
          className="mt-2 text-[24px] font-bold leading-tight text-gray-900 sm:text-[28px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          What actually replaces them
        </h2>
        <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-gray-600">
          Three families do the work of bonds, deposits and insurance without
          interest or excessive uncertainty. Pick a family, then a product.
        </p>

        <div className="mt-6">
          <ProductExplorer />
        </div>
      </section>

      {/* SIDE-BY-SIDE COMPARISONS */}
      <section className="mt-16 border-t border-gray-200 pt-10">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Side by side
        </div>
        <h2
          className="mt-2 text-[24px] font-bold leading-tight text-gray-900 sm:text-[28px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          The halal version vs the conventional one
        </h2>
        <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-gray-600">
          They can feel identical from the outside — same cash-flow shape, same
          purpose. The difference is entirely in the underlying structure. That
          difference is the whole ballgame.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {COMPARISONS.map((c) => (
            <div key={c.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="grid grid-cols-[1.1fr_1fr_1fr] border-b border-gray-200 bg-gray-50">
                <div className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                  Dimension
                </div>
                <div className="px-4 py-3 text-[12px] font-bold text-emerald-700">
                  {c.halalName}
                </div>
                <div className="px-4 py-3 text-[12px] font-bold text-rose-600">
                  {c.conventionalName}
                </div>
              </div>
              {c.rows.map((r, idx) => (
                <div
                  key={r.dimension}
                  className={
                    "grid grid-cols-[1.1fr_1fr_1fr] " +
                    (idx !== c.rows.length - 1 ? "border-b border-gray-100" : "")
                  }
                >
                  <div className="px-4 py-3 text-[12px] font-medium text-gray-500">
                    {r.dimension}
                  </div>
                  <div className="px-4 py-3 text-[12.5px] leading-snug text-gray-800">
                    {r.halal}
                  </div>
                  <div className="px-4 py-3 text-[12.5px] leading-snug text-gray-600">
                    {r.conventional}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* EXCLUDED CONVENTIONAL PRODUCTS */}
      <section className="mt-16 border-t border-gray-200 pt-10">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Off the table
        </div>
        <h2
          className="mt-2 text-[24px] font-bold leading-tight text-gray-900 sm:text-[28px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Why the conventional versions are excluded
        </h2>
        <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-gray-600">
          Not because they&apos;re unfamiliar — because of one specific defect in
          each. Here&apos;s the honest reason, and the halal product that does the
          same job.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {EXCLUDED.map((e) => (
            <div key={e.name} className="rounded-2xl border border-rose-200 bg-rose-50/40 p-5">
              <div className="flex items-start gap-3">
                <XCircle size={18} className="mt-0.5 shrink-0 text-rose-500" />
                <div>
                  <h3
                    className="text-[16px] font-bold leading-tight text-gray-900"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {e.name}
                  </h3>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-gray-600">
                    {e.what}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-gray-800">
                <span className="font-semibold text-rose-700">Why it fails: </span>
                {e.reason}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {e.flags.map((f) => (
                  <span
                    key={f}
                    className="rounded-full border border-rose-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-rose-600"
                  >
                    {FLAG_LABEL[f]}
                  </span>
                ))}
              </div>
              <div className="mt-3 border-t border-rose-100 pt-3 text-[12px] text-gray-700">
                <span className="font-semibold text-gray-900">Halal instead: </span>
                {e.halalAlt}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* UNIVERSAL CHECK + DISCLAIMER */}
      <section className="mt-16 rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:p-7">
        <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
          The one rule that runs through all of this
        </div>
        <h3
          className="mt-2 text-[20px] font-bold leading-tight text-gray-900"
          style={{ fontFamily: "var(--font-display)" }}
        >
          The label doesn&apos;t make it halal — the structure does.
        </h3>
        <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-gray-700">
          A product marketed as &ldquo;Islamic&rdquo; can still hide a guaranteed
          rate, a synthetic trade with no real asset, or a pool invested in
          interest. Before committing, read the prospectus, look for a named
          Shariah board, and ask a qualified scholar about the specific product.
          HalalGauge gives you the questions to ask — it is not a religious
          authority and this is information, not advice.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/sukuk"
            className="inline-flex items-center gap-1.5 rounded-md bg-navy-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-700"
          >
            <Coins size={15} /> Sukuk you can actually buy
          </Link>
          <Link
            href="/assets"
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:text-gray-900"
          >
            <ScanSearch size={14} /> See the full asset map <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function FrameCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center gap-2 text-gray-900">
        <span className="text-rose-500">{icon}</span>
        <span
          className="text-[14px] font-bold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </span>
      </div>
      <p className="mt-2 text-[12.5px] leading-relaxed text-gray-600">{body}</p>
    </div>
  );
}
