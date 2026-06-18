// Curated lists — hand-picked collections of stocks for users to explore.
// Each list defines the membership statically (rather than dynamic filter)
// so editorial intent is explicit and reviewable.

import { findStock, listStocks } from "./data";
import { getScholar } from "./scholars";
import { screenStock } from "./screen";
import type { StockFundamentals, Verdict } from "./types";

export interface CuratedList {
  /** URL slug. */
  slug: string;
  /** Display title. */
  title: string;
  /** Editorial summary — what's in this list and why. */
  blurb: string;
  /** One-line "who is this for" hook. */
  audience: string;
  /** Kicker label above the title in editorial style. */
  kicker: string;
  /** Tickers in this list, in editorial order. */
  tickers: string[];
  /** Default scholar to evaluate against (most natural fit). */
  defaultScholarId: string;
  /** Optional notes shown beside the list (e.g. methodology nuance). */
  note?: string;
}

export const CURATED_LISTS: CuratedList[] = [
  {
    slug: "halal-mega-caps",
    title: "Halal mega-caps",
    kicker: "Editor's picks",
    audience: "The cleanest household names — start here if you're new.",
    blurb:
      "Ten of the largest publicly-listed companies that pass AAOIFI's standard screen. " +
      "These are the names most diaspora Muslim investors already own through index funds — " +
      "now you can hold them deliberately, with the verdict made explicit.",
    tickers: ["AAPL", "MSFT", "NVDA", "GOOGL", "META", "TSLA", "TSM", "AVGO", "LLY", "V"],
    defaultScholarId: "aaoifi",
  },
  {
    slug: "halal-dividend-payers",
    title: "Halal dividend payers",
    kicker: "Income",
    audience: "For investors who want quarterly cash flow without compromising compliance.",
    blurb:
      "Established companies that pass AAOIFI's screen and pay a dividend yield of 2.5% or more. " +
      "Remember: under most scholars these dividends must still be purified for the small " +
      "impermissible-income share. HalalGauge's purification calculator does the math for you.",
    tickers: [
      "CVX", "XOM", "SHEL.L", "COP", "EOG", "PSX",
      "UPS", "ABBV", "JNJ", "MRK", "ABT", "AZN.L",
      "KO", "PEP", "KMB", "PG", "CL", "MDLZ", "ULVR.L", "NESN.SW",
      "IBM", "TXN", "CSCO", "QCOM",
      "HD", "MCD", "SBUX",
      "PLD", "UNP", "HON", "APD", "NEM",
    ],
    defaultScholarId: "aaoifi",
    note: "Dividend yields shown reflect the most recent annual payout / current price. " +
      "All names re-screened on each HalalGauge data refresh.",
  },
  {
    slug: "halal-etfs",
    title: "Halal & Sharia-screened ETFs",
    kicker: "Funds",
    audience: "One-ticker diversification — HalalGauge still surfaces what's inside.",
    blurb:
      "The major Sharia-compliant ETFs available to retail investors. SPUS and HLAL cover " +
      "US equities; UMMA goes global; SPSK provides sukuk (Islamic bond) exposure; SPRE adds " +
      "REIT income. Read each fund's published Sharia methodology before allocating — they're " +
      "AAOIFI-aligned but differ in turnover and purification reporting.",
    tickers: ["SPUS", "HLAL", "UMMA", "SPSK", "SPRE"],
    defaultScholarId: "aaoifi",
    note: "ETFs are screened at the fund-policy level. Individual constituent compliance changes " +
      "as the fund rebalances; check the issuer's website for the latest holdings.",
  },
  {
    slug: "halal-tech-leaders",
    title: "Halal tech leaders",
    kicker: "Sector spotlight",
    audience: "Where the AAOIFI-screened tech universe is concentrated today.",
    blurb:
      "Technology is the deepest pool of halal-compliant equities globally — most software " +
      "and semiconductor leaders carry little interest-bearing debt and have negligible riba income. " +
      "These nine names are the highest-conviction members of that pool.",
    tickers: ["AAPL", "MSFT", "NVDA", "GOOGL", "TSM", "AVGO", "QCOM", "ORCL", "CSCO"],
    defaultScholarId: "aaoifi",
  },
  {
    slug: "halal-consumer-staples",
    title: "Halal consumer staples",
    kicker: "Defensive",
    audience: "Lower-volatility names for the income / preservation side of a portfolio.",
    blurb:
      "Household-goods and food companies that pass AAOIFI screening. These tend to fall less " +
      "in market drawdowns and pay reliable dividends, making them a common anchor for risk-averse " +
      "Muslim investors balancing growth-tilted tech exposure.",
    tickers: ["KO", "PEP", "PG", "CL", "KMB", "MDLZ", "ULVR.L", "NESN.SW", "WMT"],
    defaultScholarId: "aaoifi",
  },
  {
    slug: "strict-hanafi-passes",
    title: "Mufti Taqi-compliant equities",
    kicker: "Stricter Hanafi",
    audience: "For investors following the illiquid-asset rule (≥20% tangible assets).",
    blurb:
      "The narrower set of equities that also satisfy Mufti Taqi Usmani's illiquid-asset floor — " +
      "the rule that excludes most pure-software businesses. These names tend to be industrials, " +
      "energy, hardware, and consumer-goods companies with real physical assets on their balance sheets.",
    tickers: [
      "AAPL", "TSLA", "2222.SR", "XOM", "CVX", "COP", "SHEL.L",
      "JNJ", "MRK", "ABBV", "PFE",
      "KO", "PEP", "PG", "WMT", "MCD",
      "UPS", "UNP", "HON", "CAT", "DE",
      "PLD", "O", "SPG",
    ],
    defaultScholarId: "taqi_usmani",
    note: "Many of these still pass AAOIFI too — but here we're emphasising the additional " +
      "tangible-asset filter that pure-software giants like Microsoft, Nvidia, Meta typically fail.",
  },
  {
    slug: "saudi-listed",
    title: "Saudi-listed (Tadawul)",
    kicker: "MENA",
    audience: "Companies that operate under Sharia governance from inception.",
    blurb:
      "Major Saudi-listed names. Most Tadawul-listed companies operate under explicit Sharia " +
      "governance — there's no separate \"halal subset\" because the market itself is designed " +
      "around compliance. HalalGauge still surfaces the underlying ratios so you can see the math.",
    tickers: ["2222.SR", "1120.SR"],
    defaultScholarId: "aaoifi",
    note: "Sample coverage of Tadawul is intentionally small in the prototype. Production version " +
      "covers the full TASI index and adds Borsa Istanbul, Bursa Malaysia, and PSX (Pakistan).",
  },
];

export function getList(slug: string): CuratedList | undefined {
  return CURATED_LISTS.find((l) => l.slug === slug);
}

/** Resolve membership: returns the StockFundamentals for tickers actually in the dataset. */
export function resolveList(list: CuratedList): StockFundamentals[] {
  const out: StockFundamentals[] = [];
  for (const t of list.tickers) {
    const s = findStock(t);
    if (s) out.push(s);
  }
  return out;
}

/** Compute headline stats for a list under a given scholar. */
export interface ListStats {
  total: number;
  pass: number;
  borderline: number;
  fail: number;
  avgDividendYield: number;
  totalMarketCapUsd: number;
}

export function statsForList(list: CuratedList, scholarId: string): ListStats {
  const scholar = getScholar(scholarId);
  const stocks = resolveList(list);
  let pass = 0;
  let borderline = 0;
  let fail = 0;
  let divSum = 0;
  let mcapSum = 0;
  for (const s of stocks) {
    const r = screenStock(s, scholar);
    if (r.verdict === "pass") pass++;
    else if (r.verdict === "borderline") borderline++;
    else fail++;
    divSum += s.dividendYieldPct;
    mcapSum += s.marketCapUsd;
  }
  return {
    total: stocks.length,
    pass, borderline, fail,
    avgDividendYield: stocks.length ? divSum / stocks.length : 0,
    totalMarketCapUsd: mcapSum,
  };
}

/** Per-ticker resolved view for the list page table. */
export interface ListRow {
  stock: StockFundamentals;
  verdict: Verdict;
}

export function rowsForList(list: CuratedList, scholarId: string): ListRow[] {
  const scholar = getScholar(scholarId);
  return resolveList(list).map((stock) => ({
    stock,
    verdict: screenStock(stock, scholar).verdict,
  }));
}

/** Format helpers reused on the list page. */
export function fmtMarketCap(usd: number): string {
  if (usd >= 1e12) return `$${(usd / 1e12).toFixed(1)}T`;
  if (usd >= 1e9) return `$${(usd / 1e9).toFixed(0)}B`;
  if (usd >= 1e6) return `$${(usd / 1e6).toFixed(0)}M`;
  return `$${usd.toFixed(0)}`;
}

/** Sanity check used in unit tests: every list's tickers should resolve. */
export function unresolvedTickers(list: CuratedList): string[] {
  const all = new Set(listStocks().map((s) => s.ticker));
  return list.tickers.filter((t) => !all.has(t));
}
