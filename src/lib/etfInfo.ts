/**
 * Curated ETF compliance info.
 *
 * ETFs CANNOT be screened with single-company ratios (debt/market cap, etc.) —
 * an ETF's halal status depends on its holdings and the fund's own structure.
 * So on /halal/[ticker] we detect ETFs and show this curated, sourced summary
 * instead of running the company screen (which would falsely score SPY/QQQ).
 */
import type { StockFundamentals } from "./types";

export interface EtfInfo {
  /** true = purpose-built Shariah-compliant fund; false = conventional, not screened */
  shariah: boolean;
  provider: string;
  /** one-line verdict summary */
  summary: string;
  /** longer explanation shown on the page */
  detail: string;
  sourceUrl?: string;
}

export const ETF_INFO: Record<string, EtfInfo> = {
  SPUS: {
    shariah: true,
    provider: "SP Funds",
    summary: "A purpose-built Shariah-compliant ETF — its holdings are AAOIFI-style screened and dividends are purified.",
    detail:
      "SPUS (SP Funds S&P 500 Sharia Industry Exclusions ETF) tracks an S&P 500 subset that excludes non-compliant sectors and screens financial ratios under AAOIFI-style rules, with a purification process for incidental impermissible income. It is one of the most widely held halal US-equity ETFs. As always, confirm the methodology matches the scholar you follow.",
    sourceUrl: "https://www.sp-funds.com/spus/",
  },
  HLAL: {
    shariah: true,
    provider: "Wahed",
    summary: "A purpose-built Shariah-compliant ETF screened against the FTSE USA Shariah index.",
    detail:
      "HLAL (Wahed FTSE USA Shariah ETF) holds US equities screened by the FTSE Shariah methodology, overseen by a Shariah board, with purification. A mainstream choice for halal US-equity exposure.",
    sourceUrl: "https://funds.wahed.com/hlal",
  },
  SPSK: {
    shariah: true,
    provider: "SP Funds",
    summary: "A sukuk (Islamic fixed-income) ETF — the halal alternative to a conventional bond fund.",
    detail:
      "SPSK (SP Funds Dow Jones Global Sukuk ETF) holds sukuk — asset-backed Islamic instruments structured to avoid riba — rather than interest-bearing bonds. Used as the income/stability sleeve of a halal portfolio.",
    sourceUrl: "https://www.sp-funds.com/spsk/",
  },
  SPRE: {
    shariah: true,
    provider: "SP Funds",
    summary: "A Shariah-screened global REIT ETF.",
    detail:
      "SPRE (SP Funds S&P Global REIT Sharia ETF) holds real-estate investment trusts screened for Shariah compliance (sector + financial ratios + purification). Property exposure without conventional-finance entanglement.",
    sourceUrl: "https://www.sp-funds.com/spre/",
  },
  UMMA: {
    shariah: true,
    provider: "Wahed",
    summary: "A Shariah-compliant global (ex-US heavy) equity ETF.",
    detail:
      "UMMA (Wahed Dow Jones Islamic World ETF) gives Shariah-screened exposure to global developed-market equities, complementing a US-focused fund like HLAL.",
    sourceUrl: "https://funds.wahed.com/umma",
  },
  SPY: {
    shariah: false,
    provider: "State Street",
    summary: "NOT Shariah-screened — it tracks the entire S&P 500, including banks, insurers, alcohol and more.",
    detail:
      "SPY holds all 500 companies in the S&P 500 with no Shariah filter, so it includes conventional banks, insurers, alcohol, gambling and other excluded sectors, plus the fund earns interest on cash. It is not a halal investment. For S&P 500-style exposure that is screened, see SPUS or HLAL.",
  },
  QQQ: {
    shariah: false,
    provider: "Invesco",
    summary: "NOT Shariah-screened — it tracks the Nasdaq-100 with no Islamic filter.",
    detail:
      "QQQ holds the 100 largest non-financial Nasdaq companies with no Shariah screening, so individual holdings may fail debt/interest screens and the fund earns interest on cash. It is not a halal investment as-is; screen the individual holdings you want, or use a purpose-built halal ETF.",
  },
};

export function isEtf(stock: Pick<StockFundamentals, "sector">): boolean {
  return stock.sector === "ETF";
}

export function etfInfo(ticker: string): EtfInfo | undefined {
  return ETF_INFO[ticker.toUpperCase()];
}
