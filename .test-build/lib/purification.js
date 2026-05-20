"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePurification = calculatePurification;
function calculatePurification(input) {
    const { stock, scholar, positionValueUsd, realizedGainUsd } = input;
    const annualDividendUsd = positionValueUsd * (stock.dividendYieldPct / 100);
    const impureFraction = stock.impermissibleIncomePct / 100;
    const impureDividendUsd = annualDividendUsd * impureFraction;
    const impureGainUsd = scholar.purificationScope === "dividends_and_gains"
        ? Math.max(0, realizedGainUsd) * impureFraction
        : 0;
    const totalPurificationUsd = impureDividendUsd + impureGainUsd;
    const note = scholar.purificationScope === "dividends_and_gains"
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
