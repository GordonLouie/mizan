"use client";

import { useEffect, useState } from "react";
import { Info, X } from "lucide-react";
import { listStocks } from "@/lib/data";

const KEY = "mizan.demoBannerDismissed";

export default function DemoBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(KEY) === "1";
      setShow(!dismissed);
    } catch {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  function dismiss() {
    try { localStorage.setItem(KEY, "1"); } catch {}
    setShow(false);
  }

  return (
    <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
      <Info size={14} className="mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <strong className="font-medium">Demo dataset.</strong> Mizan currently screens a {listStocks().length}-ticker representative sample with plausible approximations of recent fundamentals. The FMP live-data integration is wired in; real fundamentals will replace the seed as the daily enrichment script runs. Engine logic and scholar methodology are real and verifiable.
      </div>
      <button
        type="button"
        onClick={dismiss}
        className="rounded p-0.5 text-amber-700 hover:bg-amber-100"
        aria-label="Dismiss demo banner"
      >
        <X size={14} />
      </button>
    </div>
  );
}
