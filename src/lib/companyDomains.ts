/**
 * Ticker → corporate domain lookup, used by <CompanyLogo>.
 *
 * Why hand-curated: Clearbit's logo API needs a domain, not a ticker.
 * We only need to cover the heavily-displayed tickers (featured chips,
 * curated lists, watchlist defaults, screen detail). Anything missing
 * falls back to a Mizan monogram pill in <CompanyLogo>.
 */

export const TICKER_DOMAIN: Record<string, string> = {
  // Mega-cap tech
  AAPL: "apple.com",
  MSFT: "microsoft.com",
  GOOGL: "abc.xyz",
  GOOG: "abc.xyz",
  AMZN: "amazon.com",
  META: "meta.com",
  NVDA: "nvidia.com",
  TSLA: "tesla.com",
  NFLX: "netflix.com",
  ADBE: "adobe.com",
  CRM: "salesforce.com",
  ORCL: "oracle.com",
  AMD: "amd.com",
  INTC: "intel.com",
  AVGO: "broadcom.com",
  ARM: "arm.com",
  ASML: "asml.com",
  PYPL: "paypal.com",
  SQ: "block.xyz",
  SHOP: "shopify.com",
  UBER: "uber.com",
  LYFT: "lyft.com",
  ABNB: "airbnb.com",
  COIN: "coinbase.com",
  PLTR: "palantir.com",
  CRWD: "crowdstrike.com",
  NOW: "servicenow.com",
  SNOW: "snowflake.com",
  DDOG: "datadoghq.com",
  ZS: "zscaler.com",
  PANW: "paloaltonetworks.com",
  WDAY: "workday.com",
  CSCO: "cisco.com",
  ACN: "accenture.com",
  IBM: "ibm.com",

  // Communications / media
  DIS: "thewaltdisneycompany.com",
  CMCSA: "comcast.com",
  T: "att.com",
  VZ: "verizon.com",
  TMUS: "t-mobile.com",
  CHTR: "spectrum.com",
  NTES: "neteasegames.com",
  BIDU: "baidu.com",
  BABA: "alibaba.com",
  SPOT: "spotify.com",
  PINS: "pinterest.com",
  SNAP: "snap.com",
  RBLX: "roblox.com",
  EA: "ea.com",
  TTWO: "take2games.com",

  // Consumer retail
  WMT: "walmart.com",
  COST: "costco.com",
  TGT: "target.com",
  HD: "homedepot.com",
  LOW: "lowes.com",
  NKE: "nike.com",
  LULU: "lululemon.com",
  SBUX: "starbucks.com",
  MCD: "mcdonalds.com",
  CMG: "chipotle.com",
  BKNG: "booking.com",
  MAR: "marriott.com",
  HLT: "hilton.com",

  // Consumer staples
  PG: "pg.com",
  KO: "coca-cola.com",
  PEP: "pepsico.com",
  CL: "colgate.com",
  CLX: "clorox.com",
  KMB: "kimberly-clark.com",

  // Healthcare / pharma
  JNJ: "jnj.com",
  PFE: "pfizer.com",
  MRK: "merck.com",
  ABBV: "abbvie.com",
  LLY: "lilly.com",
  TMO: "thermofisher.com",
  UNH: "unitedhealthgroup.com",
  CVS: "cvshealth.com",
  AMGN: "amgen.com",
  GILD: "gilead.com",
  REGN: "regeneron.com",
  VRTX: "vrtx.com",
  BMY: "bms.com",
  BIIB: "biogen.com",
  ABT: "abbott.com",

  // Financials
  JPM: "jpmorganchase.com",
  BAC: "bankofamerica.com",
  WFC: "wellsfargo.com",
  GS: "goldmansachs.com",
  MS: "morganstanley.com",
  C: "citigroup.com",
  AXP: "americanexpress.com",
  V: "visa.com",
  MA: "mastercard.com",
  BRK: "berkshirehathaway.com",
  "BRK.B": "berkshirehathaway.com",
  BLK: "blackrock.com",
  SCHW: "schwab.com",
  KKR: "kkr.com",

  // Energy
  XOM: "exxonmobil.com",
  CVX: "chevron.com",
  COP: "conocophillips.com",
  OXY: "oxy.com",
  SLB: "slb.com",
  BP: "bp.com",
  "BP.L": "bp.com",

  // Industrials
  CAT: "caterpillar.com",
  DE: "deere.com",
  BA: "boeing.com",
  GE: "ge.com",
  HON: "honeywell.com",
  LMT: "lockheedmartin.com",
  RTX: "rtx.com",
  UPS: "ups.com",
  FDX: "fedex.com",
  UNP: "up.com",
  CSX: "csx.com",

  // Halal-specific / ETFs / regional
  SPUS: "wahed.com",
  HLAL: "wahed.com",
  "0700.HK": "tencent.com",
  "9988.HK": "alibaba.com",
  "2222.SR": "aramco.com",
  "7203.T": "toyota.com",
  "6758.T": "sony.com",
};

/** Returns the corporate domain for a ticker, or null if unmapped. */
export function getDomainForTicker(ticker: string): string | null {
  return TICKER_DOMAIN[ticker.toUpperCase()] ?? null;
}
