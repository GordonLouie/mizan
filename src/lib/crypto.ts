// Crypto compliance — scholar-by-scholar views on major cryptoassets.
//
// Mizan does NOT issue rulings. Mizan summarises what each scholar / school
// has publicly said about a category, and cites the source so users can read
// it themselves. All entries reviewed quarterly by the Shariah Board.

export type CryptoVerdict = "halal" | "doubtful" | "not_halal" | "no_consensus";

export interface ScholarTake {
  scholar: string;
  verdict: CryptoVerdict;
  /** One-line summary of the published view. */
  summary: string;
  /** Optional URL of the published ruling / paper / fatwa. */
  source?: string;
}

export interface CryptoAsset {
  symbol: string;
  name: string;
  /** What this asset actually is, in one sentence. */
  what: string;
  /** Category — drives default reasoning. */
  category:
    | "store_of_value"      // BTC
    | "smart_contract"      // ETH, SOL, AVAX
    | "stablecoin_fiat"     // USDC, USDT
    | "stablecoin_algo"     // DAI, FRAX
    | "exchange_token"      // BNB
    | "meme"                // DOGE, SHIB
    | "privacy"             // XMR, ZEC
    | "defi_yield"          // AAVE, COMP
    | "gambling_adjacent";  // various
  marketCapUsd: number;
  /** Per-scholar published views — order matters; most important first. */
  takes: ScholarTake[];
  /** A blunt summary line for the verdict card. */
  blunt: string;
}

const M = 1e6;
const B = 1e9;

export const CRYPTO_ASSETS: CryptoAsset[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    what: "Decentralised digital store-of-value, fixed supply 21M, no underlying cash flows.",
    category: "store_of_value",
    marketCapUsd: 1300 * B,
    blunt:
      "Most contemporary scholars permit Bitcoin as a tradable asset; a minority view treats it as gharar (excessive uncertainty). The conservative position is permissible-with-caution.",
    takes: [
      {
        scholar: "Mufti Faraz Adam (Amanah Advisors)",
        verdict: "halal",
        summary: "BTC qualifies as māl (wealth) and a tradable asset; permissible to own and trade for genuine investment purposes.",
        source: "https://amanahadvisors.com/cryptocurrency-shariah-research-paper/",
      },
      {
        scholar: "Mufti Taqi Usmani",
        verdict: "doubtful",
        summary: "Initially cautious due to absence of underlying tangible value; has not issued an outright impermissibility ruling. Treats as area of legitimate disagreement.",
      },
      {
        scholar: "AAOIFI",
        verdict: "no_consensus",
        summary: "No formal AAOIFI standard yet. Major Islamic banks (Al Rajhi, Kuwait Finance House) have offered crypto custody for retail.",
      },
      {
        scholar: "Sistani office (Ja'fari)",
        verdict: "doubtful",
        summary: "Permissibility depends on whether the underlying activity violates Islamic principles; no blanket ruling for or against.",
        source: "https://www.sistani.org/english/qa/01413/",
      },
      {
        scholar: "Strict / zero-tolerance",
        verdict: "not_halal",
        summary: "Lack of underlying tangible value + speculative volatility constitutes maysir (gambling-adjacent). Not permissible.",
      },
    ],
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    what: "Programmable blockchain with native asset ETH; powers smart contracts including some impermissible applications.",
    category: "smart_contract",
    marketCapUsd: 360 * B,
    blunt:
      "Owning ETH itself is broadly viewed as permissible. Earning yield via staking or DeFi requires additional scrutiny because the underlying activity may involve riba.",
    takes: [
      {
        scholar: "Mufti Faraz Adam (Amanah Advisors)",
        verdict: "halal",
        summary: "ETH as a utility token is permissible to own. Proof-of-stake rewards: permissible if structured as a service fee, problematic if structured as guaranteed yield (riba-like).",
        source: "https://amanahadvisors.com/cryptocurrency-shariah-research-paper/",
      },
      {
        scholar: "Mufti Taqi Usmani",
        verdict: "doubtful",
        summary: "Same caution as Bitcoin plus added concern over smart-contract platforms hosting impermissible activity.",
      },
      {
        scholar: "Sheikh Joe Bradford",
        verdict: "halal",
        summary: "Ownership permissible; specific use-cases require case-by-case analysis. Avoid staking pools that guarantee fixed returns.",
      },
      {
        scholar: "Sistani office (Ja'fari)",
        verdict: "doubtful",
        summary: "Same framing as Bitcoin — depends on use; khums applies on annual surplus.",
      },
      {
        scholar: "Strict / zero-tolerance",
        verdict: "not_halal",
        summary: "Same as BTC; further compounded by smart-contract DeFi risk.",
      },
    ],
  },
  {
    symbol: "SOL",
    name: "Solana",
    what: "High-throughput smart-contract chain; native asset SOL is staked for network security.",
    category: "smart_contract",
    marketCapUsd: 80 * B,
    blunt:
      "Same logic as ETH but with younger track record. Permissibility hinges on the activity yield is derived from.",
    takes: [
      {
        scholar: "Mufti Faraz Adam (Amanah Advisors)",
        verdict: "halal",
        summary: "SOL ownership permissible. Staking rewards permissible if framed as a service fee, not a guaranteed return.",
      },
      {
        scholar: "Mufti Taqi Usmani",
        verdict: "doubtful",
        summary: "No specific ruling on SOL; general crypto caution applies.",
      },
      {
        scholar: "Sistani office (Ja'fari)",
        verdict: "doubtful",
        summary: "Use-case dependent.",
      },
      {
        scholar: "Strict / zero-tolerance",
        verdict: "not_halal",
        summary: "Same as ETH.",
      },
    ],
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    what: "Fiat-backed stablecoin issued by Circle, redeemable 1:1 for US dollars.",
    category: "stablecoin_fiat",
    marketCapUsd: 60 * B,
    blunt:
      "Holding USDC is broadly viewed as permissible because it is essentially a digital dollar — but the issuer earns riba on the reserves, and yield programs are riba.",
    takes: [
      {
        scholar: "Mufti Faraz Adam (Amanah Advisors)",
        verdict: "halal",
        summary: "Holding for utility (settlements, payments) is permissible. Yield-bearing USDC products are NOT permissible (interest-bearing).",
        source: "https://amanahadvisors.com/cryptocurrency-shariah-research-paper/",
      },
      {
        scholar: "Mufti Taqi Usmani",
        verdict: "doubtful",
        summary: "Holding for transactional purposes is fine; treating USDC as a yield-generating asset is impermissible.",
      },
      {
        scholar: "AAOIFI",
        verdict: "doubtful",
        summary: "No formal standard. The issuer's interest income on reserves is haram; the user's mere holding for transactional purposes is permissible.",
      },
      {
        scholar: "Strict / zero-tolerance",
        verdict: "not_halal",
        summary: "Indirect participation in the interest-based reserve model.",
      },
    ],
  },
  {
    symbol: "USDT",
    name: "Tether",
    what: "Fiat-backed stablecoin issued by Tether, redeemable 1:1 for USD with disputed reserve composition.",
    category: "stablecoin_fiat",
    marketCapUsd: 110 * B,
    blunt:
      "Same Shariah logic as USDC. Additional concern: reserve transparency. Most scholars say avoid where possible.",
    takes: [
      {
        scholar: "Mufti Faraz Adam (Amanah Advisors)",
        verdict: "doubtful",
        summary: "Reserve opacity adds gharar concern beyond the standard stablecoin analysis. Prefer USDC if possible.",
      },
      {
        scholar: "Sheikh Joe Bradford",
        verdict: "doubtful",
        summary: "Avoid where alternatives exist due to transparency issues.",
      },
      {
        scholar: "Strict / zero-tolerance",
        verdict: "not_halal",
        summary: "Same as USDC plus gharar.",
      },
    ],
  },
  {
    symbol: "BNB",
    name: "BNB (Binance)",
    what: "Exchange token of Binance; used for trading-fee discounts and gas on BNB Chain.",
    category: "exchange_token",
    marketCapUsd: 95 * B,
    blunt:
      "Tied to an exchange that lists many haram tokens and offers leveraged products. Most scholars treat with caution; strict view rejects.",
    takes: [
      {
        scholar: "Mufti Faraz Adam (Amanah Advisors)",
        verdict: "doubtful",
        summary: "BNB itself is a utility token but the issuer's business involves impermissible products (futures, margin). Caution advised.",
      },
      {
        scholar: "Strict / zero-tolerance",
        verdict: "not_halal",
        summary: "Direct participation in an exchange running riba-based products.",
      },
    ],
  },
  {
    symbol: "XRP",
    name: "Ripple",
    what: "Native asset of the XRP Ledger; used for fast cross-border bank settlements.",
    category: "smart_contract",
    marketCapUsd: 65 * B,
    blunt:
      "Used by traditional banks for settlement — utility argument favours permissibility. Centralisation concerns lead some scholars to caution.",
    takes: [
      {
        scholar: "Mufti Faraz Adam (Amanah Advisors)",
        verdict: "halal",
        summary: "Genuine utility for bank settlement; permissible to own.",
      },
      {
        scholar: "Strict / zero-tolerance",
        verdict: "not_halal",
        summary: "Same general crypto caution; serves conventional (interest-based) banking infrastructure.",
      },
    ],
  },
  {
    symbol: "ADA",
    name: "Cardano",
    what: "Proof-of-stake smart-contract platform; native asset ADA.",
    category: "smart_contract",
    marketCapUsd: 18 * B,
    blunt: "Same framework as ETH; ownership broadly permissible, staking yield requires structuring scrutiny.",
    takes: [
      { scholar: "Mufti Faraz Adam (Amanah Advisors)", verdict: "halal", summary: "Permissible to own; staking treated as ETH." },
      { scholar: "Strict / zero-tolerance", verdict: "not_halal", summary: "General crypto rejection." },
    ],
  },
  {
    symbol: "DOGE",
    name: "Dogecoin",
    what: "Meme coin with no underlying utility or development roadmap.",
    category: "meme",
    marketCapUsd: 30 * B,
    blunt:
      "Almost universally treated as maysir (gambling) — pure speculation with no underlying value or utility.",
    takes: [
      { scholar: "Mufti Faraz Adam (Amanah Advisors)", verdict: "not_halal", summary: "No utility, pure speculation; meets the definition of maysir." },
      { scholar: "Mufti Taqi Usmani", verdict: "not_halal", summary: "Gambling-adjacent." },
      { scholar: "Sheikh Joe Bradford", verdict: "not_halal", summary: "Speculation without underlying value." },
      { scholar: "Strict / zero-tolerance", verdict: "not_halal", summary: "Categorically." },
    ],
  },
  {
    symbol: "SHIB",
    name: "Shiba Inu",
    what: "Meme coin spawned to ride Dogecoin's wake.",
    category: "meme",
    marketCapUsd: 12 * B,
    blunt: "Same as DOGE — universally rejected as speculative meme asset.",
    takes: [
      { scholar: "Mufti Faraz Adam (Amanah Advisors)", verdict: "not_halal", summary: "Meme asset, pure speculation." },
      { scholar: "Strict / zero-tolerance", verdict: "not_halal", summary: "Categorically." },
    ],
  },
  {
    symbol: "XMR",
    name: "Monero",
    what: "Privacy-focused cryptocurrency that hides transaction amounts and parties.",
    category: "privacy",
    marketCapUsd: 3 * B,
    blunt:
      "Privacy is permissible in principle, but the de-facto use of fully untraceable coins facilitates impermissible activity. Most scholars advise avoidance.",
    takes: [
      { scholar: "Mufti Faraz Adam (Amanah Advisors)", verdict: "doubtful", summary: "Permissibility depends on usage; de-facto association with illicit use raises concerns." },
      { scholar: "Strict / zero-tolerance", verdict: "not_halal", summary: "Avoid." },
    ],
  },
  {
    symbol: "AAVE",
    name: "Aave",
    what: "Decentralised lending protocol; deposit assets to earn interest, borrow against collateral.",
    category: "defi_yield",
    marketCapUsd: 4 * B,
    blunt:
      "Holding AAVE token may be permissible as ownership in a protocol; *using* Aave to earn yield or borrow is riba and not permissible.",
    takes: [
      {
        scholar: "Mufti Faraz Adam (Amanah Advisors)",
        verdict: "not_halal",
        summary: "Core protocol mechanic is interest-based lending. Token represents governance over an impermissible activity.",
      },
      { scholar: "Strict / zero-tolerance", verdict: "not_halal", summary: "Direct riba protocol." },
    ],
  },
];

export const SCHOLAR_FILTER_OPTIONS = [
  "Mufti Faraz Adam (Amanah Advisors)",
  "Mufti Taqi Usmani",
  "Sheikh Joe Bradford",
  "AAOIFI",
  "Sistani office (Ja'fari)",
  "Strict / zero-tolerance",
];

export const VERDICT_LABEL_CRYPTO: Record<CryptoVerdict, string> = {
  halal: "Halal",
  doubtful: "Doubtful",
  not_halal: "Not halal",
  no_consensus: "No consensus",
};

export const VERDICT_TONE_CRYPTO: Record<CryptoVerdict, "pass" | "warn" | "fail" | "neutral"> = {
  halal: "pass",
  doubtful: "warn",
  not_halal: "fail",
  no_consensus: "neutral",
};
