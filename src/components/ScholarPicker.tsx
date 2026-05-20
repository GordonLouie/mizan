"use client";

import { SCHOLAR_PROFILES } from "@/lib/scholars";
import type { ScholarProfile } from "@/lib/types";
import { useEffect, useState } from "react";
import { Info } from "lucide-react";

interface Props {
  value: string;
  onChange: (id: string) => void;
}

export default function ScholarPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState<string | null>(null);
  const current = SCHOLAR_PROFILES.find((p) => p.id === value) ?? SCHOLAR_PROFILES[0];

  useEffect(() => {
    try {
      localStorage.setItem("mizan.scholarId", value);
    } catch {}
  }, [value]);

  return (
    <div>
      <div className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
        Your scholar / standard
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {SCHOLAR_PROFILES.map((p: ScholarProfile) => {
          const selected = p.id === value;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onChange(p.id)}
              className={
                "rounded-lg border p-3 text-left transition " +
                (selected
                  ? "border-navy-700 bg-navy-50 ring-2 ring-navy-700"
                  : "border-gray-200 bg-white hover:border-gray-300")
              }
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-gray-900">{p.short}</div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(open === p.id ? null : p.id);
                  }}
                  className="rounded p-1 text-gray-400 hover:text-gray-700"
                  aria-label="More info"
                >
                  <Info size={14} />
                </button>
              </div>
              <div className="mt-0.5 text-xs text-gray-500">{p.label}</div>
              {open === p.id && (
                <div className="mt-2 rounded bg-white p-2 text-xs text-gray-700 ring-1 ring-gray-200">
                  {p.blurb}
                  <div className="mt-2 grid grid-cols-2 gap-1 text-[11px]">
                    <div>Impure income ≤ {p.maxImpermissibleIncomePct}%</div>
                    <div>Debt ≤ {p.maxDebtToMarketCapPct}%</div>
                    <div>Cash+sec ≤ {p.maxCashSecuritiesToMarketCapPct}%</div>
                    {p.maxReceivablesToMarketCapPct !== null && (
                      <div>Receivables ≤ {p.maxReceivablesToMarketCapPct}%</div>
                    )}
                    {p.minIlliquidAssetsToTotalAssetsPct !== null && (
                      <div className="col-span-2 font-semibold text-navy-700">
                        Illiquid assets ≥ {p.minIlliquidAssetsToTotalAssetsPct}%
                      </div>
                    )}
                    <div className="col-span-2 italic text-gray-500">
                      Purify:{" "}
                      {p.purificationScope === "dividends_and_gains"
                        ? "dividends + capital gains"
                        : "dividends only"}
                    </div>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Selected: <span className="font-medium text-gray-700">{current.label}</span>
      </p>
    </div>
  );
}
