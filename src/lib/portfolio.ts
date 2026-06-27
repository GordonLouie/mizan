"use client";

const KEY = "mizan.portfolio.v3";

export interface Position {
  id: string;            // uuid-ish
  ticker: string;
  shares: number;
  avgCost: number;       // average purchase price in USD
  purchaseDate: string;  // ISO date
  note?: string;
}

export interface PortfolioState {
  positions: Position[];
  lastUpdated?: string;
}

const DEFAULT: PortfolioState = {
  positions: [
    { id: "p1", ticker: "AAPL", shares: 50,  avgCost: 145.20, purchaseDate: "2023-08-12" },
    { id: "p2", ticker: "MSFT", shares: 20,  avgCost: 310.50, purchaseDate: "2023-06-01" },
    { id: "p3", ticker: "TSLA", shares: 15,  avgCost: 218.40, purchaseDate: "2024-01-10" },
    { id: "p4", ticker: "WMT",  shares: 60,  avgCost: 62.10,  purchaseDate: "2024-03-22" },
    { id: "p5", ticker: "SPUS", shares: 100, avgCost: 28.50,  purchaseDate: "2024-04-01" },
  ],
};

export function loadPortfolio(): PortfolioState {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw);
    return parsed.positions ? parsed : DEFAULT;
  } catch { return DEFAULT; }
}

/**
 * True when the user has never saved their own positions, so the dashboard is
 * showing the built-in DEFAULT sample. Lets the UI label the demo honestly
 * instead of implying these are the user's real holdings.
 */
export function isSamplePortfolio(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return !window.localStorage.getItem(KEY);
  } catch {
    return true;
  }
}

export function savePortfolio(state: PortfolioState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify({
      ...state,
      lastUpdated: new Date().toISOString(),
    }));
  } catch {}
}

export function newPosition(): Position {
  return {
    id: "p_" + Math.random().toString(36).slice(2, 9),
    ticker: "",
    shares: 0,
    avgCost: 0,
    purchaseDate: new Date().toISOString().slice(0, 10),
  };
}
