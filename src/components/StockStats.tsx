"use client";

import Link from "next/link";
import { ArrowLeftRight, BookOpen, ListChecks } from "lucide-react";
import type { StockFundamentals } from "@/lib/types";
import { priceForTicker } from "@/lib/prices";
import { fmtMarketCap } from "@/lib/lists";
import { Card, Pill } from "@/components/ui";

interface Props {
  stock: StockFundamentals;
}

/**
 * Compact at-a-glance company stats. Sits below the verdict hero on /screen
 * to give users the financial context that explains the verdict without making
 * them open "Show the math". Stats only — no opinion.
 */
export default function StockStats({ stock }: Props) {
  const price = priceForTicker(stock.ticker);
  const hasDividend = stock.dividendYieldPct > 0;
  // Approximate yearly $ dividend per share for a "feel" number.
  const dividendDollars = price && hasDividend ? (price * stock.dividendYieldPct) / 100 : null;

  return (
    <Card padded={false}>
      <div className="border-b border-gray-100 px-6 py-4 sm:px-8">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
          Company stats
        </div>
        <h3 className="mt-1 text-lg font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
          {stock.name} at a glance
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Pill tone="navy">{stock.sector}</Pill>
          <span className="text-xs text-gray-500">
            Listed under <span className="font-mono">{stock.ticker}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 divide-x divide-y divide-gray-100 sm:grid-cols-4 sm:divide-y-0">
        <Stat
          label="Last price"
          value={price != null ? `$${price.toFixed(2)}` : "—"}
          hint={price != null ? "indicative" : "no price seeded"}
        />
        <Stat
          label="Market cap"
          value={fmtMarketCap(stock.marketCapUsd)}
          hint={mcapHint(stock.marketCapUsd)}
        />
        <Stat
          label="Dividend yield"
          value={hasDividend ? `${stock.dividendYieldPct.toFixed(1)}%` : "—"}
          hint={
            dividendDollars
              ? `≈ $${dividendDollars.toFixed(2)}/share/yr`
              : hasDividend ? "" : "no dividend"
          }
        />
        <Stat
          label="Tangible assets"
          value={`${stock.illiquidAssetsToTotalAssetsPct.toFixed(0)}%`}
          hint={
            stock.illiquidAssetsToTotalAssetsPct >= 20
              ? "meets Mufti Taqi floor"
              : "below 20% floor"
          }
          tone={stock.illiquidAssetsToTotalAssetsPct >= 20 ? "pass" : "neutral"}
        />
      </div>

      <div className="grid grid-cols-2 divide-x divide-y divide-gray-100 border-t border-gray-100 sm:grid-cols-4 sm:divide-y-0">
        <Stat label="Impure income" value={`${stock.impermissibleIncomePct.toFixed(1)}%`} hint="of revenue" />
        <Stat label="Debt" value={`${stock.debtToMarketCapPct.toFixed(1)}%`} hint="of market cap" />
        <Stat label="Cash + securities" value={`${stock.cashSecuritiesToMarketCapPct.toFixed(1)}%`} hint="of market cap" />
        <Stat label="Receivables" value={`${stock.receivablesToMarketCapPct.toFixed(1)}%`} hint="of market cap" />
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 bg-gray-50 px-6 py-3 text-xs sm:px-8">
        <Link
          href={`/vs?a=${stock.ticker}&b=MSFT`}
          className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-3 py-1.5 font-medium text-gray-700 transition hover:border-navy-300 hover:text-navy-800"
        >
          <ArrowLeftRight size={12} /> Compare side-by-side
        </Link>
        <Link
          href="/lists"
          className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-3 py-1.5 font-medium text-gray-700 transition hover:border-navy-300 hover:text-navy-800"
        >
          <ListChecks size={12} /> Curated lists
        </Link>
        <Link
          href="/methodology"
          className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-3 py-1.5 font-medium text-gray-700 transition hover:border-navy-300 hover:text-navy-800"
        >
          <BookOpen size={12} /> Methodology
        </Link>
        <span className="ml-auto text-[10px] uppercase tracking-wider text-gray-400">
          Data Q1 2026 · indicative pricing
        </span>
      </div>
    </Card>
  );
}

function mcapHint(usd: number): string {
  if (usd >= 1e12) return "mega-cap (>$1T)";
  if (usd >= 200e9) return "mega-cap";
  if (usd >= 10e9) return "large-cap";
  if (usd >= 2e9) return "mid-cap";
  if (usd >= 300e6) return "small-cap";
  return "micro-cap";
}

function Stat({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "pass" | "neutral";
}) {
  const valueCls =
    tone === "pass" ? "text-emerald-700" : "text-gray-900";
  return (
    <div className="px-5 py-4">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </div>
      <div
        className={`mt-1 text-xl font-bold ${valueCls}`}
        style={{ fontFamily: "Georgia, serif" }}
      >
        {value}
      </div>
      {hint && (
        <div className="mt-0.5 text-[11px] text-gray-500">{hint}</div>
      )}
    </div>
  );
}
