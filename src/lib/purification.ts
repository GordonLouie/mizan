import type { ScholarProfile, StockFundamentals } from "./types";

export interface PurificationInput {
  stock: StockFundamentals;
  scholar: ScholarProfile;
  /** USD value of position held. */
  positionValueUsd: number;
  /** Capital gain realized this year, in USD (can be negative). */
  realizedGainUsd: number;
}

export interface PurificationResult {
  /** Estimated annual dividend received based on position size & yield. */
  annualDividendUsd: number;
  /** Portion of dividend that is impure (based on impermissible income ratio). */
  impureDividendUsd: number;
  /** Portion of capital gain that is impure — only applies if scholar requires gain purification. */
  impureGainUsd: number;
  /** Total amount to donate to charity. */
  totalPurificationUsd: number;
  /** Plain-language summary. */
  note: string;
}

export function calculatePurification(input: PurificationInput): PurificationResult {
  const { stock, scholar, positionValueUsd, realizedGainUsd } = input;

  const annualDividendUsd = positionValueUsd * (stock.dividendYieldPct / 100);
  const impureFraction = stock.impermissibleIncomePct / 100;
  const impureDividendUsd = annualDividendUsd * impureFraction;

  const impureGainUsd =
    scholar.purificationScope === "dividends_and_gains"
      ? Math.max(0, realizedGainUsd) * impureFraction
      : 0;

  const totalPurificationUsd = impureDividendUsd + impureGainUsd;

  const note =
    scholar.purificationScope === "dividends_and_gains"
      ? `Under ${scholar.label}, both dividend income and realized capital gains are purified at the impermissible-income rate (${stock.impermissibleIncomePct.toFixed(2)}%).`
      : `Under ${scholar.label}, only dividend income is purified at the impermissible-income rate (${stock.impermissibleIncomePct.toFixed(2)}%). Capital gains are NOT purified.`;

  return {
    annualDividendUsd,
    impureDividendUsd,
    impureGainUsd,
    totalPurificationUsd,
    note,
  };
}
