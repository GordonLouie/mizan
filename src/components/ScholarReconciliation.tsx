/**
 * ScholarReconciliation — the consensus + "why the standards differ" view.
 * Server-safe (pure render). Sits under the per-scholar verdict table on a stock
 * page and turns "the apps disagree" into "here's exactly why" — the category's
 * most-requested, least-served need.
 */
import { Scale, GitCompareArrows } from "lucide-react";
import type { Reconciliation } from "@/lib/reconcile";

const AGREE_TONE: Record<Reconciliation["agreement"], string> = {
  unanimous: "border-emerald-200 bg-emerald-50/60 text-emerald-800",
  majority: "border-amber-200 bg-amber-50/60 text-amber-800",
  split: "border-gray-200 bg-gray-50 text-gray-800",
};

export default function ScholarReconciliation({ rec }: { rec: Reconciliation }) {
  return (
    <section className="mt-10">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
        <Scale size={13} /> Where the standards agree &amp; differ
      </div>

      {/* Consensus */}
      <div className={"mt-3 rounded-xl border px-5 py-4 " + AGREE_TONE[rec.agreement]}>
        <div className="flex items-baseline justify-between gap-3">
          <div className="text-[16px] font-bold" style={{ fontFamily: "var(--font-display)" }}>{rec.label}</div>
          <div className="shrink-0 font-mono text-[13px] font-semibold">{rec.passCount}/{rec.total} halal</div>
        </div>
        <p className="mt-1 text-[12px] leading-relaxed opacity-80">
          {rec.agreement === "unanimous"
            ? "The standards agree — a high-confidence verdict."
            : "The standards disagree — knowing why lets you decide which view you follow."}
        </p>
      </div>

      {/* Why they differ */}
      {rec.divergences.length > 0 && (
        <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center gap-1.5 border-b border-gray-100 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-600">
            <GitCompareArrows size={13} /> Why they differ
          </div>
          <ul className="divide-y divide-gray-100">
            {rec.divergences.map((d) => (
              <li key={d.axis} className="px-5 py-3.5">
                <div className="text-[13px] font-semibold text-gray-900">{d.axis}</div>
                <p className="mt-0.5 text-[13px] leading-relaxed text-gray-600">{d.explanation}</p>
              </li>
            ))}
          </ul>
          <p className="border-t border-gray-100 px-5 py-2.5 text-[11px] leading-relaxed text-gray-400">
            Each difference is computed from the exact threshold each standard publishes — not an opinion. Pick the
            standard your scholar follows; HalalGauge shows the receipts either way.
          </p>
        </div>
      )}
    </section>
  );
}
