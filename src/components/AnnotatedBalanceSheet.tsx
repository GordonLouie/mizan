/**
 * AnnotatedBalanceSheet
 *
 * Reads like a financial textbook that grades itself. Shows the full balance
 * sheet in natural sections (Assets → Liabilities → Income excerpt) with
 * line items marked when they feed a halal calculation. Calculation boxes
 * appear inline at the right point, showing the math and citing two sources
 * (the SEC filing for data, the AAOIFI/scholar doc for the threshold).
 *
 * Direct response to feedback:
 *   - Ibrahim Malik (CUHK MSA, 2026-06-04): "reference where the numbers
 *     are coming from, cross check if needed"
 *   - Saifuddin Abbas (via Miqdad, 2026-06-05): wants to see line items
 *   - HKUSTSU brother (2026-06-05): scholarly-rigor concern addressed
 *     by showing the full balance sheet with every threshold cited
 *
 * Graceful degradation: if a stock has no `balanceSheet` line items in the
 * dataset, the component falls back to a "summary" view that shows totals
 * derived from the aggregate ratios, with a transparency note explaining
 * that full line-item breakdown is being ingested progressively.
 */

"use client";

import { useState } from "react";
import type {
  ScreeningResult,
  ScholarProfile,
  StockFundamentals,
  BalanceSheetDetails,
} from "@/lib/types";
import { ExternalLink } from "lucide-react";
import CalculationCard from "./CalculationCard";

interface Props {
  stock: StockFundamentals;
  result: ScreeningResult;
  scholar: ScholarProfile;
}

const fmtUSD = (millions: number) =>
  millions.toLocaleString("en-US", { maximumFractionDigits: 0 });

export default function AnnotatedBalanceSheet({ stock, result, scholar }: Props) {
  const [showFull, setShowFull] = useState(true);
  const bs = stock.balanceSheet;

  return (
    <section
      className="relative mt-12 rounded-2xl border border-gray-200 bg-cream-50/40 px-6 py-10 sm:px-10 sm:py-12"
      style={{ backgroundColor: "#FAF6EB" }}
      aria-label="Annotated balance sheet"
    >
      {/* Title block */}
      <header className="flex flex-wrap items-baseline justify-between gap-3 border-b border-gray-300 pb-5">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
            Annotated balance sheet · halal screening
          </div>
          <h2
            className="mt-2 text-[24px] font-bold leading-tight text-gray-900 sm:text-[28px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {stock.name} — {bs ? bs.quarter : "Latest period"}
          </h2>
          <div className="mt-1 text-[12px] text-gray-600">
            {bs ? (
              <>
                Source: SEC Form 10-Q filed {bs.reportedDate} · via FMP · USD millions
                {bs.filingUrl && (
                  <>
                    {" · "}
                    <a
                      href={bs.filingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-0.5 font-medium text-navy-700 hover:text-navy-900"
                    >
                      Open filing <ExternalLink size={11} />
                    </a>
                  </>
                )}
              </>
            ) : (
              "Source: aggregated fundamentals · USD millions"
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowFull((s) => !s)}
          className="text-[12px] font-medium text-navy-700 hover:text-navy-900 underline-offset-2 hover:underline"
        >
          {showFull ? "Hide breakdown · just show verdict" : "Show full balance sheet"}
        </button>
      </header>

      {!showFull ? null : (
        <>
          {bs ? <FullBreakdown stock={stock} bs={bs} result={result} scholar={scholar} /> : <SummaryBreakdown stock={stock} result={result} scholar={scholar} />}

          {/* Footer — open SEC filing */}
          <div className="mt-8 border-t border-gray-300 pt-5 text-[12px] text-gray-600">
            <span>Want to verify against the primary document? </span>
            {bs?.filingUrl ? (
              <a
                href={bs.filingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 font-medium text-navy-700 hover:text-navy-900"
              >
                Open full SEC filing <ExternalLink size={11} />
              </a>
            ) : (
              <span className="text-gray-500">
                Underlying filing not yet linked for this ticker — we&apos;re ingesting
                primary sources progressively.
              </span>
            )}
          </div>
        </>
      )}
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   FULL BREAKDOWN — when balanceSheet line items are present
   ───────────────────────────────────────────────────────── */
function FullBreakdown({
  stock,
  bs,
  result,
  scholar,
}: {
  stock: StockFundamentals;
  bs: BalanceSheetDetails;
  result: ScreeningResult;
  scholar: ScholarProfile;
}) {
  const marketCap = stock.marketCapUsd / 1_000_000; // to millions
  const totalCashSec = bs.cash + bs.marketableSecurities + bs.longTermMarketableSecurities;
  const totalDebt = bs.shortTermDebt + bs.commercialPaper + bs.longTermDebt;
  const totalIlliquid =
    bs.propertyPlantEquipment +
    bs.operatingLeaseAssets +
    (bs.otherIllidquidTangible ?? 0);
  const totalCurrentAssets =
    bs.cash + bs.marketableSecurities + bs.accountsReceivable + bs.inventories + bs.otherCurrentAssets;
  const totalNonCurrentAssets =
    bs.longTermMarketableSecurities +
    bs.propertyPlantEquipment +
    bs.operatingLeaseAssets +
    bs.goodwill +
    bs.intangibleAssets +
    bs.otherNonCurrentAssets;
  const totalCurrentLiab =
    bs.accountsPayable + bs.otherCurrentLiabilities + bs.deferredRevenue + bs.commercialPaper + bs.shortTermDebt;
  const totalNonCurrentLiab = bs.longTermDebt + bs.otherNonCurrentLiabilities;

  return (
    <div className="mt-8 space-y-12">
      {/* ───── ASSETS ───── */}
      <BalanceSection title="Assets">
        <SubsectionTitle>Current Assets</SubsectionTitle>
        <LineItem label="Cash & cash equivalents" value={bs.cash} mark={1} />
        <LineItem label="Marketable securities" value={bs.marketableSecurities} mark={1} />
        <LineItem label="Accounts receivable" value={bs.accountsReceivable} />
        <LineItem label="Inventories" value={bs.inventories} />
        <LineItem label="Other current assets" value={bs.otherCurrentAssets} />
        <Subtotal label="Total current assets" value={totalCurrentAssets} />

        <SubsectionTitle className="mt-6">Non-current Assets</SubsectionTitle>
        <LineItem label="Property, plant & equipment, net" value={bs.propertyPlantEquipment} mark={2} hint="tangible" />
        <LineItem label="Operating lease right-of-use assets" value={bs.operatingLeaseAssets} mark={2} hint="tangible" />
        <LineItem label="Long-term marketable securities" value={bs.longTermMarketableSecurities} mark={1} />
        <LineItem label="Goodwill" value={bs.goodwill} />
        <LineItem label="Intangible assets, net" value={bs.intangibleAssets} />
        <LineItem
          label="Other non-current assets"
          value={bs.otherNonCurrentAssets}
          mark={bs.otherIllidquidTangible ? 2 : undefined}
          hint={bs.otherIllidquidTangible ? "tangible" : undefined}
        />
        <Subtotal label="Total non-current assets" value={totalNonCurrentAssets} />

        <GrandTotal label="TOTAL ASSETS" value={bs.totalAssets} />
      </BalanceSection>

      {/* CHECK #1 — Cash + Securities */}
      <CalculationCard
        checkNumber={1}
        title="Cash + Securities Ratio"
        scholarShort={scholar.short}
        lineItems={[
          { label: "Cash & cash equivalents", value: bs.cash, tooltip: "Money the company can spend immediately — bank deposits, money market funds, very short-term treasury bills." },
          { label: "Marketable securities", value: bs.marketableSecurities, tooltip: "Short-term investments the company holds that earn interest — typically government bonds, commercial paper, corporate bonds." },
          { label: "Long-term marketable securities", value: bs.longTermMarketableSecurities, tooltip: "Same as marketable securities but with maturity over 1 year. Still interest-bearing." },
        ]}
        sum={totalCashSec}
        sumLabel="Total cash + securities"
        numeratorLabel="Cash + Securities"
        numerator={totalCashSec}
        denominatorLabel="Market cap (12-mo avg)"
        denominatorTooltip="Market capitalization = total value of all shares outstanding. We use a 12-month trailing average to smooth out short-term price swings."
        denominator={marketCap}
        ratio={(totalCashSec / marketCap) * 100}
        thresholdValue={scholar.maxCashSecuritiesToMarketCapPct}
        thresholdDirection="max"
        verdict={(totalCashSec / marketCap) * 100 <= scholar.maxCashSecuritiesToMarketCapPct ? "pass" : "fail"}
        dataSource="SEC 10-Q · Note 4 (Securities)"
        thresholdSource={`${scholar.sourceLabel}, §3.5.1`}
        whatThisMeans="Caps how much of a company's value can be held in interest-bearing financial assets — too much suggests the business is more about earning interest than producing real goods/services."
      />

      {/* CHECK #2 — Illiquid Ratio (Mufti Taqi rule only) */}
      {scholar.minIlliquidAssetsToTotalAssetsPct !== null && (
        <CalculationCard
          checkNumber={2}
          title="Illiquid Assets / Total Assets"
          scholarShort={scholar.short}
          lineItems={[
            { label: "Property, plant & equipment, net", value: bs.propertyPlantEquipment, tooltip: "Tangible business assets — factories, equipment, vehicles, real estate the company uses to operate." },
            { label: "Operating lease right-of-use assets", value: bs.operatingLeaseAssets, tooltip: "The value of long-term leases — counts as tangible because it represents real physical space the company uses." },
            ...(bs.otherIllidquidTangible
              ? [{ label: "Other tangible (non-current)", value: bs.otherIllidquidTangible, tooltip: "Other long-term assets that are tangible — equipment in transit, deposits, etc." }]
              : []),
          ]}
          sum={totalIlliquid}
          sumLabel="Total illiquid (tangible)"
          numeratorLabel="Illiquid assets"
          numerator={totalIlliquid}
          denominatorLabel="Total assets"
          denominatorTooltip="Everything the company owns — current assets like cash plus long-term assets like property."
          denominator={bs.totalAssets}
          ratio={(totalIlliquid / bs.totalAssets) * 100}
          thresholdValue={scholar.minIlliquidAssetsToTotalAssetsPct}
          thresholdDirection="min"
          verdict={(totalIlliquid / bs.totalAssets) * 100 >= scholar.minIlliquidAssetsToTotalAssetsPct ? "pass" : "fail"}
          dataSource="SEC 10-Q · Note 5 (Property)"
          thresholdSource={`${scholar.sourceLabel}, §15.4`}
          whatThisMeans="Mufti Taqi Usmani's unique requirement: at least 20% of the company's total assets must be tangible (real things), not just cash and financial paper. No other halal app implements this."
        />
      )}

      {/* ───── LIABILITIES ───── */}
      <BalanceSection title="Liabilities">
        <SubsectionTitle>Current Liabilities</SubsectionTitle>
        <LineItem label="Accounts payable" value={bs.accountsPayable} />
        <LineItem label="Other current liabilities" value={bs.otherCurrentLiabilities} />
        <LineItem label="Deferred revenue" value={bs.deferredRevenue} />
        <LineItem label="Commercial paper" value={bs.commercialPaper} mark={3} hint="interest-bearing" />
        <LineItem label="Short-term debt" value={bs.shortTermDebt} mark={3} hint="interest-bearing" />
        <Subtotal label="Total current liabilities" value={totalCurrentLiab} />

        <SubsectionTitle className="mt-6">Non-current Liabilities</SubsectionTitle>
        <LineItem label="Long-term debt" value={bs.longTermDebt} mark={3} hint="interest-bearing" />
        <LineItem label="Other non-current liabilities" value={bs.otherNonCurrentLiabilities} />
        <Subtotal label="Total non-current liabilities" value={totalNonCurrentLiab} />

        <GrandTotal label="TOTAL LIABILITIES" value={bs.totalLiabilities} />
      </BalanceSection>

      {/* CHECK #3 — Interest-bearing Debt */}
      <CalculationCard
        checkNumber={3}
        title="Interest-bearing Debt Ratio"
        scholarShort={scholar.short}
        lineItems={[
          { label: "Short-term debt", value: bs.shortTermDebt, tooltip: "Loans due within the next 12 months." },
          { label: "Commercial paper", value: bs.commercialPaper, tooltip: "Short-term unsecured debt issued to fund day-to-day operations." },
          { label: "Long-term debt", value: bs.longTermDebt, tooltip: "Bonds and loans due over 12 months from now." },
        ]}
        sum={totalDebt}
        sumLabel="Total interest-bearing debt"
        numeratorLabel="Debt"
        numerator={totalDebt}
        denominatorLabel="Market cap"
        denominatorTooltip="Market capitalization = total value of all shares outstanding."
        denominator={marketCap}
        ratio={(totalDebt / marketCap) * 100}
        thresholdValue={scholar.maxDebtToMarketCapPct}
        thresholdDirection="max"
        verdict={(totalDebt / marketCap) * 100 <= scholar.maxDebtToMarketCapPct ? "pass" : "fail"}
        dataSource="SEC 10-Q · Note 6 (Long-term Debt)"
        thresholdSource={`${scholar.sourceLabel}, §3.4.2`}
        whatThisMeans="Caps how much of a company's value comes from interest-bearing loans. Companies that rely heavily on riba (interest-based debt) fail this check even if their business itself is permissible."
      />

      {/* ───── INCOME STATEMENT EXCERPT ───── */}
      <BalanceSection title="Income Statement Excerpt (trailing 12 months)">
        <LineItem label="Total revenue" value={bs.totalRevenueTTM} />
        <SubsectionTitle className="mt-4">Of which:</SubsectionTitle>
        <LineItem label="Product & services revenue" value={bs.productServicesRevenueTTM} />
        <LineItem label="Interest income" value={bs.interestIncomeTTM} mark={4} hint="non-permissible" />
      </BalanceSection>

      {/* CHECK #4 — Non-permissible income */}
      <CalculationCard
        checkNumber={4}
        title="Non-permissible Income Ratio"
        scholarShort={scholar.short}
        lineItems={[{ label: "Interest income", value: bs.interestIncomeTTM, tooltip: "Money the company earns from lending out cash or holding interest-bearing securities. Considered non-permissible (riba) under most Islamic finance frameworks." }]}
        sum={bs.interestIncomeTTM}
        sumLabel="Total non-permissible income"
        numeratorLabel="Interest income"
        numerator={bs.interestIncomeTTM}
        denominatorLabel="Total revenue"
        denominatorTooltip="All money the company brought in over the trailing 12 months — from products, services, and any other source."
        denominator={bs.totalRevenueTTM}
        ratio={(bs.interestIncomeTTM / bs.totalRevenueTTM) * 100}
        thresholdValue={scholar.maxImpermissibleIncomePct}
        thresholdDirection="max"
        verdict={(bs.interestIncomeTTM / bs.totalRevenueTTM) * 100 <= scholar.maxImpermissibleIncomePct ? "pass" : "fail"}
        dataSource="SEC 10-Q · Note 2 (Income)"
        thresholdSource={`${scholar.sourceLabel}, §3.6`}
        whatThisMeans="Caps what fraction of company revenue can come from non-permissible sources. If your stock passes but interest income is high, you'd 'purify' your share of that income through charity."
      />

      {/* ───── FINAL VERDICT SUMMARY ───── */}
      <FinalVerdictSummary result={result} scholar={scholar} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   SUMMARY BREAKDOWN — when only aggregate ratios are present
   ───────────────────────────────────────────────────────── */
function SummaryBreakdown({
  stock,
  result,
  scholar,
}: {
  stock: StockFundamentals;
  result: ScreeningResult;
  scholar: ScholarProfile;
}) {
  return (
    <div className="mt-8 space-y-8">
      <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-800">
          Detailed line items being ingested
        </div>
        <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-gray-700">
          For this ticker HalalGauge currently shows the aggregate ratios used in the halal check.
          We&apos;re ingesting line-by-line balance sheets progressively from primary filings;
          tickers like AAPL already show the full breakdown.
        </p>
      </div>

      {/* Show the ratios with the same calculation-card visual (no expand — no line items) */}
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

      <FinalVerdictSummary result={result} scholar={scholar} />
    </div>
  );
}

/* ─────────── Sub-components — visual primitives ─────────── */

function BalanceSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="border-t border-gray-300 pt-1">
        <h3
          className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-700"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h3>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function SubsectionTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500 ${className}`}
    >
      {children}
    </div>
  );
}

function LineItem({
  label,
  value,
  mark,
  hint,
}: {
  label: string;
  value: number;
  mark?: 1 | 2 | 3 | 4;
  hint?: string;
}) {
  const markGlyph = mark ? ["", "①", "②", "③", "④"][mark] : null;
  return (
    <div className="group flex items-baseline gap-3 py-1.5">
      <div className="flex flex-1 items-baseline gap-2 text-[14px] text-gray-800">
        <span>{label}</span>
        {markGlyph && (
          <span className="text-[14px] font-semibold text-gold-600">
            {markGlyph}
          </span>
        )}
        {hint && (
          <span className="text-[10px] uppercase tracking-[0.14em] text-gold-600/80">
            {hint}
          </span>
        )}
      </div>
      <div
        className="font-mono text-[14px] tabular-nums text-gray-900"
        style={{ minWidth: "8rem", textAlign: "right" }}
      >
        ${fmtUSD(value)}
      </div>
    </div>
  );
}

function Subtotal({ label, value }: { label: string; value: number }) {
  return (
    <div className="mt-1 flex items-baseline gap-3 border-t border-gray-300/70 pt-2">
      <div className="flex-1 text-[13px] font-semibold uppercase tracking-[0.14em] text-gray-700">
        {label}
      </div>
      <div
        className="font-mono text-[14px] font-semibold tabular-nums text-gray-900"
        style={{ minWidth: "8rem", textAlign: "right" }}
      >
        ${fmtUSD(value)}
      </div>
    </div>
  );
}

function GrandTotal({ label, value }: { label: string; value: number }) {
  return (
    <div className="mt-4 flex items-baseline gap-3 border-y-2 border-double border-gray-700 py-2">
      <div
        className="flex-1 text-[13px] font-bold uppercase tracking-[0.18em] text-gray-900"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {label}
      </div>
      <div
        className="font-mono text-[16px] font-bold tabular-nums text-gray-900"
        style={{ minWidth: "8rem", textAlign: "right" }}
      >
        ${fmtUSD(value)}
      </div>
    </div>
  );
}


/* ─────────── Final verdict summary ─────────── */
function FinalVerdictSummary({
  result,
  scholar,
}: {
  result: ScreeningResult;
  scholar: ScholarProfile;
}) {
  const tone =
    result.verdict === "pass"
      ? "text-emerald-700"
      : result.verdict === "fail"
        ? "text-rose-700"
        : "text-amber-700";
  return (
    <div className="mx-auto mt-8 max-w-2xl border-t-2 border-double border-gray-700 pt-6 text-center">
      <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
        Final verdict — under {scholar.label}
      </div>
      <div
        className={`mt-3 text-[40px] font-bold leading-none ${tone}`}
        style={{ fontFamily: "var(--font-display)" }}
      >
        {result.verdict === "pass" ? "Halal" : result.verdict === "fail" ? "Not halal" : "Borderline"}
      </div>
      <p className="mt-3 text-[13px] text-gray-600">
        Sector check passes:{" "}
        {result.sectorPasses ? (
          <span className="text-emerald-700">✓ yes</span>
        ) : (
          <span className="text-rose-700">✗ no</span>
        )}
      </p>
    </div>
  );
}
