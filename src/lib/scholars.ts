import type { ScholarProfile } from "./types";

/**
 * The five scholar / standard profiles Mizan ships with at v1.
 * Numbers reflect the published methodologies of each.
 *
 * Sources:
 *  - AAOIFI Shariah Standard No. 21 (Financial Papers)
 *  - Dow Jones Islamic Market Indices Methodology
 *  - Mufti Taqi Usmani's published rulings on equity screening
 *    (Specifically the illiquid-asset requirement and capital-gains
 *    purification — these are NOT in standard AAOIFI screens.)
 *  - Ayatollah Sistani's rulings on permissible income & khums
 *    (Ja'fari Shia methodology; capital-gains-style purification
 *    implemented as khums on net annual surplus.)
 *  - "Strict / zero-tolerance" reflects minority scholars who hold
 *    that any riba exposure is impermissible.
 */
export const SCHOLAR_PROFILES: ScholarProfile[] = [
  {
    id: "aaoifi",
    label: "AAOIFI Standard",
    short: "AAOIFI",
    blurb:
      "Default Gulf standard, used by most Islamic banks. Strict on impermissible income, moderate on debt.",
    sourceLabel: "AAOIFI Shariah Standard No. 21 (Financial Papers — Shares and Bonds)",
    sourceUrl: "https://aaoifi.com/shariaa-standards/?lang=en",
    excludedSectors: [
      "alcohol", "gambling", "tobacco", "conventional_finance",
      "weapons", "pork", "adult_entertainment", "non_halal_food",
    ],
    maxImpermissibleIncomePct: 5,
    maxDebtToMarketCapPct: 30,
    maxCashSecuritiesToMarketCapPct: 30,
    maxReceivablesToMarketCapPct: null,
    minIlliquidAssetsToTotalAssetsPct: null,
    purificationScope: "dividends",
  },
  {
    id: "taqi_usmani",
    label: "Mufti Taqi Usmani (stricter Hanafi)",
    short: "Mufti Taqi",
    blurb:
      "AAOIFI standards PLUS illiquid assets must be at least 20% of total, AND capital gains must be purified, not just dividends.",
    sourceLabel: "Mufti Taqi Usmani — published equity-screening rulings (illiquid-asset rule)",
    sourceUrl: "https://muftitaqiusmani.com/",
    excludedSectors: [
      "alcohol", "gambling", "tobacco", "conventional_finance",
      "weapons", "pork", "adult_entertainment", "non_halal_food",
    ],
    maxImpermissibleIncomePct: 5,
    maxDebtToMarketCapPct: 30,
    maxCashSecuritiesToMarketCapPct: 30,
    maxReceivablesToMarketCapPct: null,
    minIlliquidAssetsToTotalAssetsPct: 20,
    purificationScope: "dividends_and_gains",
  },
  {
    id: "djim",
    label: "Dow Jones Islamic Market",
    short: "DJIM",
    blurb:
      "Most permissive of the major indices. One-third (33%) caps on debt, cash, and receivables.",
    sourceLabel: "S&P Dow Jones Islamic Market Indices — Index Methodology (Shariah Screening)",
    sourceUrl: "https://www.spglobal.com/spdji/en/documents/methodologies/methodology-dj-islamic-market-indices.pdf",
    excludedSectors: [
      "alcohol", "gambling", "tobacco", "conventional_finance",
      "weapons", "pork", "adult_entertainment",
    ],
    maxImpermissibleIncomePct: 5,
    maxDebtToMarketCapPct: 33,
    maxCashSecuritiesToMarketCapPct: 33,
    maxReceivablesToMarketCapPct: 33,
    minIlliquidAssetsToTotalAssetsPct: null,
    purificationScope: "dividends",
  },
  {
    id: "jafari",
    label: "Ja'fari (Sistani-aligned)",
    short: "Ja'fari",
    blurb:
      "Shia methodology. Sector exclusions per Ayatollah Sistani's rulings; khums (20%) applies to net annual surplus, treated as capital-gains purification.",
    sourceLabel: "Ayatollah Sistani — Code of Practice (sistani.org)",
    sourceUrl: "https://www.sistani.org/english/",
    excludedSectors: [
      "alcohol", "gambling", "tobacco", "conventional_finance",
      "weapons", "pork", "adult_entertainment", "non_halal_food",
    ],
    maxImpermissibleIncomePct: 5,
    maxDebtToMarketCapPct: 33,
    maxCashSecuritiesToMarketCapPct: 33,
    maxReceivablesToMarketCapPct: null,
    minIlliquidAssetsToTotalAssetsPct: null,
    purificationScope: "dividends_and_gains",
  },
  {
    id: "strict",
    label: "Strict / zero-tolerance",
    short: "Strict",
    blurb:
      "Minority view: any riba exposure is impermissible. No threshold tolerance on debt, interest income, or cash holdings. Almost no public equities pass.",
    sourceLabel: "Minority scholars holding zero-tolerance on riba exposure",
    sourceUrl: null,
    excludedSectors: [
      "alcohol", "gambling", "tobacco", "conventional_finance",
      "weapons", "pork", "adult_entertainment", "non_halal_food",
    ],
    maxImpermissibleIncomePct: 0,
    maxDebtToMarketCapPct: 0,
    maxCashSecuritiesToMarketCapPct: 0,
    maxReceivablesToMarketCapPct: null,
    minIlliquidAssetsToTotalAssetsPct: null,
    purificationScope: "dividends_and_gains",
  },
  {
    id: "custom",
    label: "Custom (your thresholds)",
    short: "Custom",
    blurb:
      "Set your own thresholds. Defaults shown match AAOIFI; adjust to match your scholar's view.",
    sourceLabel: "Custom thresholds — user-defined (you set these)",
    excludedSectors: [
      "alcohol", "gambling", "tobacco", "conventional_finance",
      "weapons", "pork", "adult_entertainment", "non_halal_food",
    ],
    maxImpermissibleIncomePct: 5,
    maxDebtToMarketCapPct: 30,
    maxCashSecuritiesToMarketCapPct: 30,
    maxReceivablesToMarketCapPct: null,
    minIlliquidAssetsToTotalAssetsPct: null,
    purificationScope: "dividends",
    custom: true,
  },
];

export function getScholar(id: string): ScholarProfile {
  const s = SCHOLAR_PROFILES.find((p) => p.id === id);
  if (!s) throw new Error(`Unknown scholar id: ${id}`);
  return s;
}
