"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import StockLogo from "./StockLogo";
import { Card } from "./ui";
import type { StockFundamentals, ScholarProfile } from "@/lib/types";
import { findHalalAlternativesWithReason } from "@/lib/alternatives";

interface Props {
  stock: StockFundamentals;
  scholar: ScholarProfile;
  /** Whether the input stock itself passes — changes the framing. */
  stockPasses: boolean;
}

export default function HalalAlternatives({ stock, scholar, stockPasses }: Props) {
  const alternatives = findHalalAlternativesWithReason(stock, scholar, 3);
  if (alternatives.length === 0) return null;

  return (
    <Card padded={false} className="overflow-hidden">
      <div className="border-b border-gray-100 px-6 py-5 sm:px-8">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-emerald-700">
          {stockPasses ? "More halal options" : "Halal alternatives"}
        </div>
        <h2 className="mt-1 text-lg font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
          {stockPasses
            ? `Other ${stock.sector.toLowerCase()} names that pass under ${scholar.short}`
            : `${stock.sector} stocks that pass under ${scholar.short}`}
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          {stockPasses ? (
            <>{stock.ticker} passes. If you want to diversify, these also pass — with a note on why each stands out.</>
          ) : (
            <>{stock.ticker} isn&apos;t halal under your scholar&apos;s rules. Here are similar companies that do pass, and why.</>
          )}
        </p>
      </div>
      <div className="divide-y divide-gray-100">
        {alternatives.map(({ stock: alt, reason }) => (
          <Link
            key={alt.ticker}
            href={`/screen?ticker=${alt.ticker}`}
            className="group flex items-center justify-between gap-3 p-5 transition-colors hover:bg-emerald-50/40"
          >
            <div className="flex min-w-0 items-center gap-3">
              <StockLogo ticker={alt.ticker} name={alt.name} size={36} />
              <div className="min-w-0">
                <div className="font-mono text-sm font-semibold text-gray-900">{alt.ticker}</div>
                <div className="truncate text-xs text-gray-500">{alt.name}</div>
                <div className="mt-1 text-[12px] leading-snug text-emerald-800">{reason}</div>
              </div>
            </div>
            <ArrowRight size={14} className="mt-1 shrink-0 self-start text-gray-300 transition-colors group-hover:text-emerald-700" />
          </Link>
        ))}
      </div>
    </Card>
  );
}
