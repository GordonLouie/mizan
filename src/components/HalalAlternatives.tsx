"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import StockLogo from "./StockLogo";
import { Card } from "./ui";
import type { StockFundamentals, ScholarProfile } from "@/lib/types";
import { findHalalAlternatives } from "@/lib/alternatives";

interface Props {
  failedStock: StockFundamentals;
  scholar: ScholarProfile;
}

export default function HalalAlternatives({ failedStock, scholar }: Props) {
  const alternatives = findHalalAlternatives(failedStock, scholar, 3);

  if (alternatives.length === 0) return null;

  return (
    <Card padded={false} className="overflow-hidden">
      <div className="border-b border-gray-100 px-6 py-5 sm:px-8">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-emerald-700">Halal alternatives</div>
        <h2 className="mt-1 text-lg font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
          Stocks in {failedStock.sector.toLowerCase()} that pass under {scholar.short}
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          {failedStock.ticker} isn&apos;t halal under your scholar&apos;s rules. Here are three similar
          companies in the same sector that do pass.
        </p>
      </div>
      <div className="divide-y divide-gray-100 sm:grid sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {alternatives.map((alt) => (
          <Link
            key={alt.ticker}
            href={`/screen?ticker=${alt.ticker}`}
            className="group flex items-center justify-between p-5 transition-colors hover:bg-emerald-50/40"
          >
            <div className="flex items-center gap-3">
              <StockLogo ticker={alt.ticker} name={alt.name} size={36} />
              <div>
                <div className="font-mono text-sm font-semibold text-gray-900">{alt.ticker}</div>
                <div className="text-xs text-gray-500 line-clamp-1">{alt.name}</div>
              </div>
            </div>
            <ArrowRight size={14} className="text-gray-300 transition-colors group-hover:text-emerald-700" />
          </Link>
        ))}
      </div>
    </Card>
  );
}
