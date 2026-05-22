"use client";

const KEY = "mizan.watchlist.v1";

export function getWatchlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

export function addToWatchlist(ticker: string): void {
  if (typeof window === "undefined") return;
  const current = getWatchlist();
  if (current.includes(ticker)) return;
  const next = [...current, ticker];
  try { window.localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  // Fire event for other components to react
  window.dispatchEvent(new Event("mizan.watchlist.changed"));
}

export function removeFromWatchlist(ticker: string): void {
  if (typeof window === "undefined") return;
  const next = getWatchlist().filter((t) => t !== ticker);
  try { window.localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  window.dispatchEvent(new Event("mizan.watchlist.changed"));
}

export function isInWatchlist(ticker: string): boolean {
  return getWatchlist().includes(ticker);
}
