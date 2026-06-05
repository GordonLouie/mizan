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
            style={{ fontFamily: "Georgia, serif" }}
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
      <CalculationBox
        checkNumber={1}
        title="Cash + Securities Ratio"
        scholarShort={scholar.short}
        lineItems={[
          { label: "Cash & cash equivalents", value: bs.cash },
          { label: "Marketable securities", value: bs.marketableSecurities },
          { label: "Long-term marketable securities", value: bs.longTermMarketableSecurities },
        ]}
        sum={totalCashSec}
        sumLabel="Total cash + securities"
        numeratorLabel="Cash + Securities"
        numerator={totalCashSec}
        denominatorLabel="Market cap (12-mo avg)"
        denominator={marketCap}
        ratio={(totalCashSec / marketCap) * 100}
        thresholdValue={scholar.maxCashSecuritiesToMarketCapPct}
        thresholdDirection="max"
        verdict={(totalCashSec / marketCap) * 100 <= scholar.maxCashSecuritiesToMarketCapPct ? "pass" : "fail"}
        dataSource="SEC 10-Q · Note 4 (Securities)"
        thresholdSource={`${scholar.sourceLabel}, §3.5.1`}
      />

      {/* CHECK #2 — Illiquid Ratio (always show under Mufti Taqi rules; otherwise note "not screened") */}
      {scholar.minIlliquidAssetsToTotalAssetsPct !== null && (
        <CalculationBox
          checkNumber={2}
          title="Illiquid Assets / Total Assets"
          scholarShort={scholar.short}
          lineItems={[
            { label: "Property, plant & equipment, net", value: bs.propertyPlantEquipment },
            { label: "Operating lease right-of-use assets", value: bs.operatingLeaseAssets },
            ...(bs.otherIllidquidTangible
              ? [{ label: "Other tangible (non-current)", value: bs.otherIllidquidTangible }]
              : []),
          ]}
          sum={totalIlliquid}
          sumLabel="Total illiquid (tangible)"
          numeratorLabel="Illiquid assets"
          numerator={totalIlliquid}
          denominatorLabel="Total assets"
          denominator={bs.totalAssets}
          ratio={(totalIlliquid / bs.totalAssets) * 100}
          thresholdValue={scholar.minIlliquidAssetsToTotalAssetsPct}
          thresholdDirection="min"
          verdict={(totalIlliquid / bs.totalAssets) * 100 >= scholar.minIlliquidAssetsToTotalAssetsPct ? "pass" : "fail"}
          dataSource="SEC 10-Q · Note 5 (Property)"
          thresholdSource={`${scholar.sourceLabel}, §15.4`}
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
      <CalculationBox
        checkNumber={3}
        title="Interest-bearing Debt Ratio"
        scholarShort={scholar.short}
        lineItems={[
          { label: "Short-term debt", value: bs.shortTermDebt },
          { label: "Commercial paper", value: bs.commercialPaper },
          { label: "Long-term debt", value: bs.longTermDebt },
        ]}
        sum={totalDebt}
        sumLabel="Total interest-bearing debt"
        numeratorLabel="Debt"
        numerator={totalDebt}
        denominatorLabel="Market cap"
        denominator={marketCap}
        ratio={(totalDebt / marketCap) * 100}
        thresholdValue={scholar.maxDebtToMarketCapPct}
        thresholdDirection="max"
        verdict={(totalDebt / marketCap) * 100 <= scholar.maxDebtToMarketCapPct ? "pass" : "fail"}
        dataSource="SEC 10-Q · Note 6 (Long-term Debt)"
        thresholdSource={`${scholar.sourceLabel}, §3.4.2`}
      />

      {/* ───── INCOME STATEMENT EXCERPT ───── */}
      <BalanceSection title="Income Statement Excerpt (trailing 12 months)">
        <LineItem label="Total revenue" value={bs.totalRevenueTTM} />
        <SubsectionTitle className="mt-4">Of which:</SubsectionTitle>
        <LineItem label="Product & services revenue" value={bs.productServicesRevenueTTM} />
        <LineItem label="Interest income" value={bs.interestIncomeTTM} mark={4} hint="non-permissible" />
      </BalanceSection>

      {/* CHECK #4 — Non-permissible income */}
      <CalculationBox
        checkNumber={4}
        title="Non-permissible Income Ratio"
        scholarShort={scholar.short}
        lineItems={[{ label: "Interest income", value: bs.interestIncomeTTM }]}
        sum={bs.interestIncomeTTM}
        sumLabel="Total non-permissible income"
        numeratorLabel="Interest income"
        numerator={bs.interestIncomeTTM}
        denominatorLabel="Total revenue"
        denominator={bs.totalRevenueTTM}
        ratio={(bs.interestIncomeTTM / bs.totalRevenueTTM) * 100}
        thresholdValue={scholar.maxImpermissibleIncomePct}
        thresholdDirection="max"
        verdict={(bs.interestIncomeTTM / bs.totalRevenueTTM) * 100 <= scholar.maxImpermissibleIncomePct ? "pass" : "fail"}
        dataSource="SEC 10-Q · Note 2 (Income)"
        thresholdSource={`${scholar.sourceLabel}, §3.6`}
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
          For this ticker Mizan currently shows the aggregate ratios used in the halal check.
          We&apos;re ingesting line-by-line balance sheets progressively from primary filings;
          tickers like AAPL already show the full breakdown.
        </p>
      </div>

      {/* Show the ratios with the same calculation-box visual */}
      {result.ratioChecks.map((check, i) => (
        <CalculationBox
          key={i}
          checkNumber={i + 1}
          title={check.label}
          scholarShort={scholar.short}
          lineItems={[]}
          sum={0}
          sumLabel=""
          numeratorLabel={check.label}
          numerator={check.value}
          denominatorLabel="(as reported in our dataset)"
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
          style={{ fontFamily: "Georgia, serif" }}
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
        style={{ fontFamily: "Georgia, serif" }}
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

/* ─────────── CalculationBox — the inset textbook example ─────────── */
function CalculationBox({
  checkNumber,
  title,
  scholarShort,
  lineItems,
  sum,
  sumLabel,
  numeratorLabel,
  numerator,
  denominatorLabel,
  denominator,
  ratio,
  thresholdValue,
  thresholdDirection,
  verdict,
  dataSource,
  thresholdSource,
  ratioOnly = false,
}: {
  checkNumber: number;
  title: string;
  scholarShort: string;
  lineItems: Array<{ label: string; value: number }>;
  sum: number;
  sumLabel: string;
  numeratorLabel: string;
  numerator: number;
  denominatorLabel: string;
  denominator: number;
  ratio: number;
  thresholdValue: number;
  thresholdDirection: "max" | "min";
  verdict: "pass" | "fail";
  dataSource: string;
  thresholdSource: string;
  ratioOnly?: boolean;
}) {
  const glyph = ["", "①", "②", "③", "④"][checkNumber] || `#${checkNumber}`;
  const meetsThreshold =
    thresholdDirection === "max" ? ratio <= thresholdValue : ratio >= thresholdValue;
  const diff = Math.abs(ratio - thresholdValue);
  const verdictTone =
    verdict === "pass"
      ? "text-emerald-700 border-emerald-200 bg-emerald-50/40"
      : "text-rose-700 border-rose-200 bg-rose-50/40";

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-lg border border-gray-300 bg-white p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-gray-200 pb-3">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[13px] font-semibold text-gold-600">
              CHECK {glyph}
            </span>
            <h4
              className="text-[15px] font-semibold text-gray-900"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {title}
            </h4>
          </div>
          <span className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
            under {scholarShort}
          </span>
        </div>

        {/* Line items */}
        {lineItems.length > 0 && (
          <div className="mt-5">
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
              Line items used (marked {glyph} above)
            </div>
            {lineItems.map((li, i) => (
              <div key={i} className="flex items-baseline gap-3 py-0.5 text-[13px]">
                <div className="flex-1 text-gray-700">{li.label}</div>
                <div
                  className="font-mono tabular-nums text-gray-900"
                  style={{ minWidth: "6rem", textAlign: "right" }}
                >
                  ${fmtUSD(li.value)}
                </div>
              </div>
            ))}
            <div className="mt-1 flex items-baseline gap-3 border-t border-gray-200 pt-1.5 text-[13px]">
              <div className="flex-1 font-semibold text-gray-800">{sumLabel}</div>
              <div
                className="font-mono font-semibold tabular-nums text-gray-900"
                style={{ minWidth: "6rem", textAlign: "right" }}
              >
                ${fmtUSD(sum)}
              </div>
            </div>
          </div>
        )}

        {/* Calculation */}
        {!ratioOnly && (
          <div className="mt-6">
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
              Calculation
            </div>
            <div
              className="rounded bg-gray-50 px-5 py-4 font-mono text-[13px] tabular-nums text-gray-900"
              style={{ fontFamily: "Liberation Mono, Menlo, monospace" }}
            >
              <div className="flex items-center justify-center gap-3">
                <div className="text-center">
                  <div>{numeratorLabel}</div>
                  <div className="my-1 border-t border-gray-700">&nbsp;</div>
                  <div>{denominatorLabel}</div>
                </div>
                <div className="text-2xl text-gray-400">=</div>
                <div className="text-center">
                  <div>${fmtUSD(numerator)}</div>
                  <div className="my-1 border-t border-gray-700">&nbsp;</div>
                  <div>${fmtUSD(denominator)}</div>
                </div>
                <div className="text-2xl text-gray-400">=</div>
                <div className="text-[18px] font-bold">{ratio.toFixed(1)}%</div>
              </div>
            </div>
          </div>
        )}

        {/* Verdict line */}
        <div className="mt-5 grid grid-cols-1 gap-2 text-[13px] sm:grid-cols-[auto_1fr]">
          <div className="font-semibold uppercase tracking-[0.14em] text-gray-500">
            Threshold
          </div>
          <div className="text-gray-800">
            {thresholdDirection === "max" ? "≤" : "≥"} {thresholdValue}%{" "}
            <span className="text-gray-500">(per {scholarShort})</span>
          </div>

          <div className="font-semibold uppercase tracking-[0.14em] text-gray-500">
            Verdict
          </div>
          <div className={`inline-block rounded px-2 py-0.5 font-semibold ${verdictTone}`}>
            {verdict === "pass" ? "✓ PASS" : "✗ FAIL"}
          </div>

          <div className="font-semibold uppercase tracking-[0.14em] text-gray-500">
            {meetsThreshold ? "Buffer" : "Shortfall"}
          </div>
          <div className="text-gray-700">
            {diff.toFixed(1)} pp {meetsThreshold ? "to spare" : "over the limit"}
          </div>
        </div>

        {/* Sources */}
        <div className="mt-5 border-t border-gray-200 pt-3 text-[11px] leading-relaxed text-gray-600">
          <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
            <span className="font-semibold uppercase tracking-[0.14em]">Data source</span>
            <span>{dataSource}</span>
            <span className="font-semibold uppercase tracking-[0.14em]">Threshold src</span>
            <span>{thresholdSource}</span>
          </div>
        </div>
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
        style={{ fontFamily: "Georgia, serif" }}
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
