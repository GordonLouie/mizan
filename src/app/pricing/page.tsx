"use client";

/**
 * /pricing (Phase 4a) — the finalised free / Pro / institutional matrix and the
 * paywall entry point. Pro → Stripe checkout; Institutional → contact. Reads
 * /api/me to badge the current plan. Honest "billing not enabled yet" fallback.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Minus, Loader2 } from "lucide-react";
import type { Tier } from "@/lib/entitlements";

type Cell = boolean | string;
interface Row { label: string; free: Cell; pro: Cell; inst: Cell }

const ROWS: Row[] = [
  { label: "6-scholar verdict + cited sources", free: true, pro: true, inst: true },
  { label: "Per-ticker pages, crypto, methodology", free: true, pro: true, inst: true },
  { label: "Watchlist (saved in your browser)", free: true, pro: true, inst: true },
  { label: "Halal indexes — constituents & methodology", free: true, pro: true, inst: true },
  { label: "Custom screening thresholds", free: false, pro: true, inst: true },
  { label: "Price charts & ROI vs S&P", free: false, pro: true, inst: true },
  { label: "Technical analysis (MA / RSI)", free: false, pro: true, inst: true },
  { label: "Portfolio performance vs benchmarks", free: false, pro: true, inst: true },
  { label: "Halal index performance (backtest)", free: false, pro: true, inst: true },
  { label: "AI compliance report (stock & portfolio)", free: false, pro: "Included", inst: "Unlimited" },
  { label: "AI portfolio assistant + halal swaps", free: false, pro: true, inst: true },
  { label: "Verdict-change & earnings alerts", free: false, pro: true, inst: true },
  { label: "API / bulk export", free: false, pro: false, inst: true },
  { label: "White-label reports, multi-seat", free: false, pro: false, inst: true },
];

function renderCell(c: Cell) {
  if (c === true) return <Check size={16} className="mx-auto text-emerald-600" />;
  if (c === false) return <Minus size={16} className="mx-auto text-gray-300" />;
  return <span className="text-[12px] font-semibold text-navy-700">{c}</span>;
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [tier, setTier] = useState<Tier>("free");
  const [authOn, setAuthOn] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/me").then((r) => r.json()).then((v: { tier?: Tier; authConfigured?: boolean }) => {
      setTier(v.tier ?? "free");
      setAuthOn(!!v.authConfigured);
    }).catch(() => {});
  }, []);

  async function upgrade() {
    setBusy(true); setNote(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan: annual ? "annual" : "monthly" }),
      });
      const data = (await res.json()) as { ok?: boolean; url?: string };
      if (data.url) { window.location.href = data.url; return; }
      setNote("Billing isn't switched on yet. Email hello@mizaninvesting.com for early access.");
    } catch {
      setNote("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const isPro = tier === "retail";
  const isInst = tier === "institutional";

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <div className="text-center">
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">Pricing</div>
        <h1 className="mt-2 text-[32px] font-bold leading-tight text-gray-900 sm:text-[40px]" style={{ fontFamily: "var(--font-display)" }}>
          Invest with confidence it&apos;s halal.
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-gray-600">
          The verdict and cited sources are always free. Pro unlocks the analytics, indexes, and AI
          reports. Institutions get data and white-label access.
        </p>

        {/* Monthly / annual toggle */}
        <div className="mt-6 inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white p-1 text-[13px]" role="group" aria-label="Billing period">
          <button type="button" onClick={() => setAnnual(false)} aria-pressed={!annual}
            className={"rounded-full px-4 py-1.5 font-semibold transition " + (!annual ? "bg-navy-800 text-white" : "text-gray-600 hover:text-gray-900")}>Monthly</button>
          <button type="button" onClick={() => setAnnual(true)} aria-pressed={annual}
            className={"rounded-full px-4 py-1.5 font-semibold transition " + (annual ? "bg-navy-800 text-white" : "text-gray-600 hover:text-gray-900")}>
            Annual <span className={annual ? "text-emerald-300" : "text-emerald-600"}>·save 26%</span>
          </button>
        </div>
      </div>

      {/* Plan cards */}
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {/* Free */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="text-[13px] font-semibold uppercase tracking-wide text-gray-500">Free</div>
          <div className="mt-2 text-[32px] font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>$0</div>
          <p className="mt-1 text-[13px] text-gray-500">The full halal verdict, forever.</p>
          <div className="mt-4 h-10 flex items-center">
            {tier === "free"
              ? <span className="text-[13px] font-semibold text-gray-400">Your current plan</span>
              : <Link href="/screen" className="text-[13px] font-semibold text-navy-700">Start screening →</Link>}
          </div>
        </div>

        {/* Pro */}
        <div className="relative rounded-2xl border-2 border-navy-800 bg-white p-6 shadow-sm">
          <div className="absolute -top-3 left-6 rounded-full bg-navy-800 px-3 py-0.5 text-[11px] font-semibold text-white">Most popular</div>
          <div className="text-[13px] font-semibold uppercase tracking-wide text-navy-700">Pro</div>
          <div className="mt-2 flex items-end gap-1">
            <span className="text-[32px] font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
              ${annual ? "89" : "9.99"}
            </span>
            <span className="mb-1 text-[13px] text-gray-500">/{annual ? "year" : "month"}</span>
          </div>
          <p className="mt-1 text-[13px] text-gray-500">{annual ? "≈ $7.42/mo, billed yearly" : "or $89/year (2 months free)"}</p>
          <div className="mt-4 h-10 flex items-center">
            {isPro ? (
              <span className="text-[13px] font-semibold text-emerald-700">✓ Your current plan</span>
            ) : (
              <button type="button" onClick={upgrade} disabled={busy}
                className="inline-flex items-center gap-2 rounded-md bg-navy-800 px-5 py-2 text-[13px] font-semibold text-white transition hover:bg-navy-900 disabled:opacity-60">
                {busy ? <Loader2 size={14} className="animate-spin" /> : null} Upgrade to Pro
              </button>
            )}
          </div>
        </div>

        {/* Institutional */}
        <div id="institutional" className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="text-[13px] font-semibold uppercase tracking-wide text-gray-500">Institutional</div>
          <div className="mt-2 text-[32px] font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>Custom</div>
          <p className="mt-1 text-[13px] text-gray-500">Data, white-label, multi-seat.</p>
          <div className="mt-4 h-10 flex items-center">
            {isInst
              ? <span className="text-[13px] font-semibold text-emerald-700">✓ Your current plan</span>
              : <Link href="/institutions" className="inline-flex items-center rounded-md border border-navy-800 px-5 py-2 text-[13px] font-semibold text-navy-800 transition hover:bg-navy-50">For institutions</Link>}
          </div>
        </div>
      </div>

      {note && <p className="mt-5 text-center text-[13px] text-amber-700">{note}</p>}
      {!authOn && (
        <p className="mt-3 text-center text-[12px] text-gray-400">
          Accounts &amp; billing are in setup. <Link href="/account" className="underline">Sign in</Link> to manage your plan once live.
        </p>
      )}

      {/* Feature matrix */}
      <div className="mt-12 overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <table className="w-full min-w-[640px] text-[13px]">
          <caption className="sr-only">Feature comparison across Free, Pro, and Institutional plans</caption>
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <th className="px-5 py-3 text-left font-medium">Features</th>
              <th className="px-3 py-3 text-center font-semibold text-gray-700">Free</th>
              <th className="px-3 py-3 text-center font-semibold text-navy-700">Pro</th>
              <th className="px-3 py-3 text-center font-semibold text-gray-700">Institutional</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.label} className="border-b border-gray-100 last:border-0">
                <td className="px-5 py-2.5 text-gray-800">{r.label}</td>
                <td className="px-3 py-2.5 text-center">{renderCell(r.free)}</td>
                <td className="px-3 py-2.5 text-center bg-navy-50/40">{renderCell(r.pro)}</td>
                <td className="px-3 py-2.5 text-center">{renderCell(r.inst)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-center text-[11px] leading-relaxed text-gray-400">
        HalalGauge is a screening tool, not investment advice. Cancel anytime. Prices in USD.
      </p>
    </main>
  );
}
