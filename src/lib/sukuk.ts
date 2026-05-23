// Sukuk — Islamic bonds.
// Editorial reference data on the most accessible sukuk vehicles for retail
// halal investors. Hand-curated; updated quarterly.

export interface SukukStructure {
  id: string;
  name: string;
  arabic: string;
  /** One-line plain-English description. */
  what: string;
  /** Why it's permissible — the Shariah reasoning in a sentence. */
  why: string;
  /** Real-world usage. */
  example: string;
}

export const SUKUK_STRUCTURES: SukukStructure[] = [
  {
    id: "ijara",
    name: "Ijara sukuk",
    arabic: "صكوك الإجارة",
    what: "Lease-backed sukuk. The investor effectively buys a share of a real asset, leases it to the issuer, and earns the lease income.",
    why: "Returns come from real lease payments on a tangible asset, not from interest on a loan. The investor bears ownership risk.",
    example: "The Saudi government's most common sukuk format. Most sovereign sukuk in MENA use ijara.",
  },
  {
    id: "mudaraba",
    name: "Mudaraba sukuk",
    arabic: "صكوك المضاربة",
    what: "Profit-sharing sukuk. Investors provide capital; the issuer manages it; profits are shared per a pre-agreed ratio.",
    why: "Genuine risk-sharing — investors share losses too. No guarantee of principal or yield.",
    example: "Used historically by Islamic banks for medium-term funding.",
  },
  {
    id: "musharaka",
    name: "Musharaka sukuk",
    arabic: "صكوك المشاركة",
    what: "Joint-venture sukuk. Both investor and issuer contribute capital and share profits proportionally to their stake.",
    why: "Both parties have skin in the game; returns reflect actual venture performance.",
    example: "Used for project finance — infrastructure, real-estate developments.",
  },
  {
    id: "wakala",
    name: "Wakala sukuk",
    arabic: "صكوك الوكالة",
    what: "Agency-based sukuk. Investors appoint the issuer as agent (wakil) to invest funds in a pool of Shariah-compliant assets.",
    why: "The agent earns a fee for management; investors take the returns of the underlying assets.",
    example: "Frequently used by global Islamic banks for liquidity management.",
  },
  {
    id: "murabaha",
    name: "Murabaha sukuk",
    arabic: "صكوك المرابحة",
    what: "Cost-plus-sale sukuk. The SPV buys an asset, sells it to the issuer at a marked-up price payable in instalments. Investors fund the purchase.",
    why: "Profit comes from a genuine sale, not lending. The mark-up is fixed upfront so cash flows are predictable like a bond — without being a bond.",
    example: "Common in short-term sukuk and trade finance.",
  },
];

export interface SukukVehicle {
  ticker: string;
  name: string;
  issuer: string;
  exchange: string;
  /** SEC-registered, UCITS, etc. */
  wrapper: string;
  /** AUM in USD if available. */
  aumUsd?: number;
  /** Expense ratio percentage. */
  expensePct: number;
  /** Most recent reported 30-day SEC / distribution yield, percent. */
  distributionYieldPct: number;
  /** Effective duration, years. */
  duration?: number;
  /** Underlying composition summary. */
  composition: string;
  /** Why this vehicle matters. */
  rationale: string;
  /** External info link (issuer site). */
  info: string;
}

const B = 1e9;
const M = 1e6;

export const SUKUK_VEHICLES: SukukVehicle[] = [
  {
    ticker: "SPSK",
    name: "SP Funds Dow Jones Global Sukuk ETF",
    issuer: "SP Funds",
    exchange: "NASDAQ",
    wrapper: "US-listed ETF",
    aumUsd: 280 * M,
    expensePct: 0.49,
    distributionYieldPct: 4.2,
    duration: 4.6,
    composition: "Investment-grade sovereign and corporate sukuk from MENA, Malaysia, Indonesia, and Türkiye. Tracks the Dow Jones Sukuk Total Return Index.",
    rationale: "The most accessible sukuk ETF for US-based halal investors. Daily-traded, no minimums, IRA-eligible.",
    info: "https://sp-funds.com/spsk/",
  },
  {
    ticker: "SHRA.L",
    name: "Invesco Shariah Listed Real Assets UCITS ETF",
    issuer: "Invesco",
    exchange: "LSE",
    wrapper: "UCITS ETF",
    expensePct: 0.40,
    distributionYieldPct: 3.6,
    composition: "Diversified Shariah-compliant real assets, including some sukuk exposure. Not pure sukuk but useful for UK/EU investors.",
    rationale: "UCITS-wrapper option for European retail. Use SPSK as the primary sukuk vehicle and this as a complement.",
    info: "https://etf.invesco.com/uk/private/en/product/invesco-shariah-listed-real-assets-ucits-etf-acc/trading-information",
  },
  {
    ticker: "FALCON",
    name: "Franklin Templeton Global Sukuk Fund",
    issuer: "Franklin Templeton",
    exchange: "Luxembourg",
    wrapper: "UCITS fund (not ETF)",
    aumUsd: 400 * M,
    expensePct: 1.20,
    distributionYieldPct: 4.0,
    duration: 5.1,
    composition: "Actively-managed; mix of sovereign and corporate sukuk across geographies.",
    rationale: "Active management argument is weak for sukuk; index ETF is generally a better choice. Listed for completeness.",
    info: "https://www.franklintempleton.com/investments/options/mutual-funds",
  },
];

export interface SukukIssuance {
  name: string;
  issuer: string;
  size: string;
  tenor: string;
  structure: string;
  rating: string;
  note: string;
}

export const NOTABLE_ISSUANCES: SukukIssuance[] = [
  {
    name: "Saudi Arabia sovereign sukuk (2024)",
    issuer: "Kingdom of Saudi Arabia",
    size: "$12B",
    tenor: "3y / 6y / 9y / 30y tranches",
    structure: "Ijara + Murabaha hybrid",
    rating: "A1 / A+ / A+",
    note: "Largest sovereign sukuk programme globally. Sets the regional pricing benchmark.",
  },
  {
    name: "Indonesia Green Sukuk (2023)",
    issuer: "Republic of Indonesia",
    size: "$1.5B",
    tenor: "5y",
    structure: "Wakala (proceeds earmarked for renewable energy projects)",
    rating: "Baa2 / BBB",
    note: "First sovereign green sukuk; demonstrates ESG + Shariah alignment.",
  },
  {
    name: "Aldar Properties Sukuk (2024)",
    issuer: "Aldar Properties (UAE)",
    size: "$500M",
    tenor: "10y",
    structure: "Ijara",
    rating: "Baa1 / BBB+",
    note: "Real-estate-backed corporate sukuk; well-subscribed at 4.8% yield.",
  },
];
