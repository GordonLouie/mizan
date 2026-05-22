import { listStocks } from "./data";
import type { StockFundamentals } from "./types";

// Mock current prices — in production, from FMP /quote endpoint.
// We derive a plausible price as marketCap / sharesOutstanding (approx 16B for AAPL etc).
// For simplicity, use marketCap/1e9 as the share price (gives reasonable order-of-magnitude).
const PRICE_OVERRIDES: Record<string, number> = {
  AAPL: 192, MSFT: 415, GOOGL: 168, AMZN: 178, META: 540, NVDA: 950,
  NFLX: 660, TSLA: 175, ORCL: 175, UBER: 80, WMT: 86, COST: 950,
  PG: 165, JNJ: 152, PFE: 28, KO: 65, XOM: 115, TSM: 175, ASML: 920,
  JPM: 212, BAC: 42, GS: 510, MO: 56, BUD: 60, LMT: 460, WYNN: 84,
  AMD: 165, INTC: 33, V: 280, MA: 460, DIS: 100, NKE: 78, CRM: 285,
  ADBE: 550, BABA: 86, "BRK.B": 410, CSCO: 50, BA: 175, PEP: 175,
  AVGO: 1700, NOW: 760, ACN: 305, TXN: 198, QCOM: 175, IBM: 230,
  AMAT: 195, LRCX: 850, KLAC: 750, MU: 110, UNH: 525, LLY: 750,
  ABBV: 195, MRK: 110, TMO: 540, ABT: 110, DHR: 245, AMGN: 295,
  BMY: 50, CVS: 73, WFC: 65, MS: 105, C: 60, SCHW: 73, BLK: 850,
  AXP: 248, PYPL: 60, HD: 360, MCD: 280, LOW: 250, BKNG: 4000,
  SBUX: 95, TJX: 110, MAR: 230, CL: 95, MDLZ: 72, PM: 100, EL: 90,
  KMB: 135, CVX: 156, COP: 100, SLB: 45, EOG: 120, PSX: 130,
  HON: 200, UPS: 145, CAT: 350, GE: 165, RTX: 110, DE: 380, UNP: 215,
  NOC: 480, NEE: 75, DUK: 105, SO: 80, PLD: 120, AMT: 195, EQIX: 750,
  SPG: 155, O: 55, SPUS: 32, HLAL: 50, SPSK: 21, SPRE: 30, UMMA: 27,
  SPY: 540, QQQ: 470, "HSBA.L": 11, "AZN.L": 145, "SHEL.L": 32,
  "BP.L": 5.5, "ULVR.L": 50, "DGE.L": 32, "MC.PA": 740, "NESN.SW": 95,
  "NOVO-B.CO": 920, "SAP.DE": 200, "MBG.DE": 65, "7203.T": 16,
  "6758.T": 18, "9984.T": 12, "8306.T": 12, TCEHY: 60, "0700.HK": 460,
  "9988.HK": 92, "2222.SR": 27, "1180.SR": 39, "1120.SR": 92,
  CMCSA: 45, T: 22, VZ: 41, CHTR: 350, WBD: 10,
  LIN: 460, APD: 290, NEM: 50, SHW: 320, PANW: 380, ZS: 175,
  CRWD: 350, SNOW: 165, MDB: 290, DDOG: 130, ABNB: 130, LYFT: 20,
  SQ: 80, SHOP: 95, ROKU: 80, SPOT: 320, REGN: 800, GILD: 78,
  VRTX: 460, MRNA: 75, F: 12, GM: 50, STLA: 18, RIVN: 12, LCID: 4,
  LVS: 45, MGM: 38, DKNG: 40, STZ: 250, DEO: 130, GIS: 75,
};

export function currentPrice(stock: StockFundamentals): number {
  return PRICE_OVERRIDES[stock.ticker] ?? Math.max(10, stock.marketCapUsd / 1e10);
}

export function priceForTicker(ticker: string): number {
  const stocks = listStocks();
  const s = stocks.find((x) => x.ticker === ticker);
  return s ? currentPrice(s) : 0;
}
