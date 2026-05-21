"use client";

import { useMemo } from "react";

const FEATURED = [
  { ticker: "AMZN", name: "Amazon", note: "The headline demo. Watch the verdict flip when you change scholars." },
  { ticker: "AAPL", name: "Apple", note: "Passes all mainstream standards. Borderline under strict zero-tolerance." },
  { ticker: "TSLA", name: "Tesla", note: "Hardware-heavy. Passes Mufti Taqi's illiquid-asset rule." },
  { ticker: "MSFT", name: "Microsoft", note: "Clean across all major methodologies." },
  { ticker: "JPM", name: "JPMorgan Chase", note: "Conventional bank — fails sector exclusion in every standard." },
  { ticker: "META", name: "Meta", note: "Passes AAOIFI; fails Mufti Taqi on illiquid floor." },
  { ticker: "NVDA", name: "NVIDIA", note: "Same pattern — passes AAOIFI, fails Mufti Taqi." },
  { ticker: "SPUS", name: "SP Funds S&P 500 Sharia ETF", note: "Pre-screened halal ETF — passes everywhere." },
];

interface Props {
  onPick: (ticker: string) => void;
}

export default function FeaturedTickers({ onPick }: Props) {
  const items = useMemo(() => FEATURED, []);
  return (
    <div>
      <div className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">Try one of these</div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {items.map((f) => (
          <button
            key={f.ticker}
            type="button"
            onClick={() => onPick(f.ticker)}
            className="rounded-lg border border-gray-200 bg-white p-3 text-left transition hover:border-navy-300 hover:bg-navy-50"
          >
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-base font-semibold text-navy-800">{f.ticker}</span>
              <span className="text-xs text-gray-500">{f.name}</span>
            </div>
            <p className="mt-1 text-xs text-gray-600">{f.note}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
