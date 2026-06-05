/**
 * HalalChecks
 *
 * Renders just the 4 halal-screening CalculationCards for a stock under
 * a given scholar. Used on /screen for a lean "verdict-first" view.
 *
 * The full annotated balance sheet (line items + sections + cards) lives
 * at /balance-sheet/[ticker] for power users who want to verify the
 * underlying data.
 */

"use client";

import type {
  ScreeningResult,
  ScholarProfile,
  StockFundamentals,
} from "@/lib/types";
import CalculationCard from "./CalculationCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Props {
  stock: StockFundamentals;
  result: ScreeningResult;
  scholar: ScholarProfile;
}

export default function HalalChecks({ stock, result, scholar }: Props) {
  const bs = stock.balanceSheet;
  const hasDetail = !!bs;

  return (
    <section className="mt-12">
      <header className="mb-6">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Halal screening checks
        </div>
        <h2
          className="mt-2 text-[22px] font-bold leading-tight text-gray-900 sm:text-[26px]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Every check, every threshold
        </h2>
        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-gray-600">
          {hasDetail
            ? "Click any card to expand the math — line items, calculation, and sources."
            : "Mizan shows the aggregate ratios for this ticker. Full line-item detail is being ingested progressively (AAPL has it today)."}
        </p>
      </header>

      {hasDetail ? (
        <DetailChecks stock={stock} bs={bs} scholar={scholar} />
      ) : (
        <SummaryChecks result={result} scholar={scholar} />
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href={`/balance-sheet/${stock.ticker}`}
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:text-gray-900"
        >
          View {stock.ticker}&apos;s full balance sheet <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}

function DetailChecks({
  stock,
  bs,
  scholar,
}: {
  stock: StockFundamentals;
  bs: NonNullable<StockFundamentals["balanceSheet"]>;
  scholar: ScholarProfile;
}) {
  const marketCap = stock.marketCapUsd / 1_000_000;
  const totalCashSec = bs.cash + bs.marketableSecurities + bs.longTermMarketableSecurities;
  const totalDebt = bs.shortTermDebt + bs.commercialPaper + bs.longTermDebt;
  const totalIlliquid =
    bs.propertyPlantEquipment +
    bs.operatingLeaseAssets +
    (bs.otherIllidquidTangible ?? 0);

  return (
    <div className="space-y-8">
      <CalculationCard
        checkNumber={1}
        title="Cash + Securities Ratio"
        scholarShort={scholar.short}
        lineItems={[
          { label: "Cash & cash equivalents", value: bs.cash, tooltip: "Money the company can spend immediately." },
          { label: "Marketable securities", value: bs.marketableSecurities, tooltip: "Short-term interest-bearing investments." },
          { label: "Long-term marketable securities", value: bs.longTermMarketableSecurities, tooltip: "Same as marketable securities but with maturity over 1 year." },
        ]}
        sum={totalCashSec}
        sumLabel="Total cash + securities"
        numeratorLabel="Cash + Securities"
        numerator={totalCashSec}
        denominatorLabel="Market cap (12-mo avg)"
        denominatorTooltip="Total value of all shares outstanding, averaged over 12 months."
        denominator={marketCap}
        ratio={(totalCashSec / marketCap) * 100}
        thresholdValue={scholar.maxCashSecuritiesToMarketCapPct}
        thresholdDirection="max"
        verdict={(totalCashSec / marketCap) * 100 <= scholar.maxCashSecuritiesToMarketCapPct ? "pass" : "fail"}
        dataSource="SEC 10-Q · Note 4 (Securities)"
        thresholdSource={`${scholar.sourceLabel}, §3.5.1`}
        whatThisMeans="Caps how much of a company's value sits in interest-bearing financial assets."
      />

      {scholar.minIlliquidAssetsToTotalAssetsPct !== null && (
        <CalculationCard
          checkNumber={2}
          title="Illiquid Assets / Total Assets"
          scholarShort={scholar.short}
          lineItems={[
            { label: "Property, plant & equipment", value: bs.propertyPlantEquipment, tooltip: "Tangible business assets." },
            { label: "Operating lease right-of-use assets", value: bs.operatingLeaseAssets, tooltip: "Long-term leases on physical space." },
            ...(bs.otherIllidquidTangible
              ? [{ label: "Other tangible (non-current)", value: bs.otherIllidquidTangible, tooltip: "Other long-term tangible assets." }]
              : []),
          ]}
          sum={totalIlliquid}
          sumLabel="Total illiquid (tangible)"
          numeratorLabel="Illiquid assets"
          numerator={totalIlliquid}
          denominatorLabel="Total assets"
          denominatorTooltip="Everything the company owns."
          denominator={bs.totalAssets}
          ratio={(totalIlliquid / bs.totalAssets) * 100}
          thresholdValue={scholar.minIlliquidAssetsToTotalAssetsPct}
          thresholdDirection="min"
          verdict={(totalIlliquid / bs.totalAssets) * 100 >= scholar.minIlliquidAssetsToTotalAssetsPct ? "pass" : "fail"}
          dataSource="SEC 10-Q · Note 5 (Property)"
          thresholdSource={`${scholar.sourceLabel}, §15.4`}
          whatThisMeans="Mufti Taqi's requirement: ≥20% of total assets must be tangible. Unique to Mizan."
        />
      )}

      <CalculationCard
        checkNumber={3}
        title="Interest-bearing Debt Ratio"
        scholarShort={scholar.short}
        lineItems={[
          { label: "Short-term debt", value: bs.shortTermDebt, tooltip: "Loans due within 12 months." },
          { label: "Commercial paper", value: bs.commercialPaper, tooltip: "Short-term unsecured debt." },
          { label: "Long-term debt", value: bs.longTermDebt, tooltip: "Bonds and loans due over 12 months." },
        ]}
        sum={totalDebt}
        sumLabel="Total interest-bearing debt"
        numeratorLabel="Debt"
        numerator={totalDebt}
        denominatorLabel="Market cap"
        denominatorTooltip="Total value of all shares outstanding."
        denominator={marketCap}
        ratio={(totalDebt / marketCap) * 100}
        thresholdValue={scholar.maxDebtToMarketCapPct}
        thresholdDirection="max"
        verdict={(totalDebt / marketCap) * 100 <= scholar.maxDebtToMarketCapPct ? "pass" : "fail"}
        dataSource="SEC 10-Q · Note 6 (Long-term Debt)"
        thresholdSource={`${scholar.sourceLabel}, §3.4.2`}
        whatThisMeans="Caps how much company value is funded by interest-bearing loans (riba)."
      />

      <CalculationCard
        checkNumber={4}
        title="Non-permissible Income Ratio"
        scholarShort={scholar.short}
        lineItems={[{ label: "Interest income", value: bs.interestIncomeTTM, tooltip: "Money earned from lending out cash. Non-permissible (riba) under most frameworks." }]}
        sum={bs.interestIncomeTTM}
        sumLabel="Total non-permissible income"
        numeratorLabel="Interest income"
        numerator={bs.interestIncomeTTM}
        denominatorLabel="Total revenue"
        denominatorTooltip="All money the company brought in over 12 months."
        denominator={bs.totalRevenueTTM}
        ratio={(bs.interestIncomeTTM / bs.totalRevenueTTM) * 100}
        thresholdValue={scholar.maxImpermissibleIncomePct}
        thresholdDirection="max"
        verdict={(bs.interestIncomeTTM / bs.totalRevenueTTM) * 100 <= scholar.maxImpermissibleIncomePct ? "pass" : "fail"}
        dataSource="SEC 10-Q · Note 2 (Income)"
        thresholdSource={`${scholar.sourceLabel}, §3.6`}
        whatThisMeans="Caps what fraction of revenue can come from non-permissible sources."
      />
    </div>
  );
}

function SummaryChecks({
  result,
  scholar,
}: {
  result: ScreeningResult;
  scholar: ScholarProfile;
}) {
  return (
    <div className="space-y-6">
      {result.ratioChecks.map((check, i) => (
        <CalculationCard
          key={i}
          checkNumber={i + 1}
          title={check.label}
          scholarShort={scholar.short}
          lineItems={[]}
          sum={0}
          sumLabel=""
          numeratorLabel={check.label}
          numerator={check.value}
          denominatorLabel="(aggregated dataset)"
          denominator={100}
          ratio={check.value}
          thresholdValue={check.threshold ?? 0}
          thresholdDirection={check.direction}
          verdict={check.passes ? "pass" : "fail"}
          dataSource="Aggregated fundamentals"
          thresholdSource={`${scholar.sourceLabel}`}
          ratioOnly
        />
      ))}
    </div>
  );
}
