"use client";

/**
 * ComplianceWatch — the drift-watch panel. Surfaces holdings that are non-compliant
 * or *passing but near a ratio limit*, so the user knows what to keep an eye on.
 * The differentiated, recurring-value feature (no generic portfolio tool does
 * Shariah compliance-drift monitoring).
 */
import Link from "next/link";
import { AlertTriangle, Eye, XCircle, CheckCircle2 } from "lucide-react";
import type { DriftItem, DriftSeverity } from "@/lib/drift";

const TONE: Record<DriftSeverity, { dot: string; label: string; chip: string }> = {
  fail: { dot: "bg-rose-500", label: "Not compliant", chip: "bg-rose-50 text-rose-700 border-rose-200" },
  borderline: { dot: "bg-amber-500", label: "Borderline", chip: "bg-amber-50 text-amber-700 border-amber-200" },
  near: { dot: "bg-yellow-400", label: "Near a limit", chip: "bg-yellow-50 text-yellow-700 border-yellow-200" },
};

export default function ComplianceWatch({
  items,
  scholarShort,
}: {
  items: DriftItem[];
  scholarShort: string;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
        <div className="flex items-center gap-2 text-[14px] font-semibold text-emerald-800">
          <CheckCircle2 size={16} /> Nothing drifting
        </div>
        <p className="mt-1 text-[13px] leading-relaxed text-emerald-700/90">
          Every covered holding comfortably passes the {scholarShort} screen — none is sitting close to a
          ratio limit right now.
        </p>
      </div>
    );
  }

  const fails = items.filter((i) => i.severity !== "near").length;
  const near = items.filter((i) => i.severity === "near").length;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <AlertTriangle size={15} className="text-amber-600" />
          <span className="text-[14px] font-semibold text-gray-900">Compliance watch</span>
        </div>
        <span className="text-[11px] text-gray-500">
          {fails > 0 && `${fails} to review`}{fails > 0 && near > 0 && " · "}{near > 0 && `${near} near a limit`}
        </span>
      </div>
      <ul className="divide-y divide-gray-100">
        {items.map((it) => {
          const t = TONE[it.severity];
          const Icon = it.severity === "fail" ? XCircle : it.severity === "borderline" ? AlertTriangle : Eye;
          return (
            <li key={it.ticker} className="px-5 py-3.5">
              <div className="flex items-center justify-between gap-3">
                <Link href={`/halal/${encodeURIComponent(it.ticker)}`} className="flex min-w-0 items-center gap-2">
                  <span className={"inline-block h-2 w-2 shrink-0 rounded-full " + t.dot} />
                  <span className="font-semibold text-gray-900">{it.ticker}</span>
                  <span className="truncate text-[12px] text-gray-500">{it.name}</span>
                </Link>
                <span className={"inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold " + t.chip}>
                  <Icon size={11} /> {t.label}
                </span>
              </div>
              <ul className="mt-1.5 space-y-0.5 pl-4">
                {it.notes.map((n, i) => (
                  <li key={i} className="text-[12px] leading-relaxed text-gray-600">{n}</li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
      <p className="border-t border-gray-100 px-5 py-2.5 text-[11px] leading-relaxed text-gray-400">
        &ldquo;Near a limit&rdquo; means a holding passes today but a ratio is within 15% of its cap — the most
        likely to drop out of compliance. Informational, not advice.
      </p>
    </div>
  );
}
