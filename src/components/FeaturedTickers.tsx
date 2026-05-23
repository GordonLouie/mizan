"use client";

import { useEffect, useMemo, useState } from "react";
import { findStock } from "@/lib/data";
import { getScholar, SCHOLAR_PROFILES } from "@/lib/scholars";
import { loadCustomProfile } from "@/lib/customProfile";
import { screenStock } from "@/lib/screen";
import { VERDICT_LABEL } from "@/lib/verdictLabels";
import StockLogo from "./StockLogo";
import type { Verdict } from "@/lib/types";

const FEATURED = [
  { ticker: "AMZN", note: "The headline demo. Watch the verdict flip when you change scholars." },
  { ticker: "AAPL", note: "Passes all mainstream standards." },
  { ticker: "TSLA", note: "Hardware-heavy. Passes Mufti Taqi's illiquid-asset rule." },
  { ticker: "MSFT", note: "Clean across all major methodologies." },
  { ticker: "JPM",  note: "Conventional bank — fails sector exclusion in every standard." },
  { ticker: "META", note: "Passes AAOIFI; fails Mufti Taqi on illiquid floor." },
  { ticker: "NVDA", note: "Same pattern — passes AAOIFI, fails Mufti Taqi." },
  { ticker: "SPUS", note: "Pre-screened halal ETF — passes everywhere." },
];

interface Props {
  onPick: (ticker: string) => void;
}

export default function FeaturedTickers({ onPick }: Props) {
  // Show the verdict preview under the user's currently-selected scholar
  const [scholarId, setScholarId] = useState("aaoifi");
  const [bump, setBump] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("mizan.scholarId");
      if (saved && SCHOLAR_PROFILES.some((p) => p.id === saved)) setScholarId(saved);
    } catch {}
    const onFocus = () => setBump((b) => b + 1);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const scholar = useMemo(
    () => (scholarId === "custom" ? loadCustomProfile() : getScholar(scholarId)),
    [scholarId, bump],
  );

  const items = useMemo(() => {
    return FEATURED.map((f) => {
      const stock = findStock(f.ticker);
      const verdict: Verdict | null = stock ? screenStock(stock, scholar).verdict : null;
      return { ...f, name: stock?.name ?? f.ticker, verdict };
    });
  }, [scholar]);

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
          Try one of these
        </div>
        <div className="text-[11px] text-gray-500">
          Verdicts shown under your scholar
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {items.map((f) => (
          <button
            key={f.ticker}
            type="button"
            onClick={() => onPick(f.ticker)}
            className="group flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3 text-left transition hover:border-navy-300 hover:bg-navy-50/40"
          >
            <StockLogo ticker={f.ticker} name={f.name} size={32} />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-sm font-semibold text-navy-800">{f.ticker}</span>
                {f.verdict && <VerdictTag verdict={f.verdict} />}
              </div>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-600">
                {f.note}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function VerdictTag({ verdict }: { verdict: Verdict }) {
  const cls =
    verdict === "pass"        ? "bg-emerald-50 text-emerald-700"
    : verdict === "borderline" ? "bg-amber-50 text-amber-700"
    :                            "bg-rose-50 text-rose-700";
  return (
    <span className={"inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide " + cls}>
      {VERDICT_LABEL[verdict]}
    </span>
  );
}
