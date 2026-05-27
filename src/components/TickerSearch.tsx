"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { listStocks } from "@/lib/data";

interface Props {
  value: string;
  onChange: (ticker: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export default function TickerSearch({ value, onChange, placeholder, autoFocus }: Props) {
  const [query, setQuery] = useState(value || "");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const stocks = listStocks();

  // Keep input in sync with external value changes (e.g., URL params)
  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    // Score: exact ticker match > ticker prefix > ticker substring > name substring
    const scored = stocks
      .map((s) => {
        const tk = s.ticker.toLowerCase();
        const nm = s.name.toLowerCase();
        let score = 0;
        if (tk === q) score = 100;
        else if (tk.startsWith(q)) score = 80;
        else if (tk.includes(q)) score = 50;
        else if (nm.startsWith(q)) score = 60;
        else if (nm.includes(q)) score = 30;
        return { s, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((x) => x.s);
    return scored;
  }, [query, stocks]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function pick(ticker: string) {
    setQuery(ticker);
    onChange(ticker);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, matches.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (matches[highlighted]) pick(matches[highlighted].ticker);
      else if (query.trim()) {
        onChange(query.trim().toUpperCase());
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={wrapRef} className="relative">
      <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 focus-within:border-navy-400 focus-within:bg-white">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setHighlighted(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder ?? "Search by ticker or company name (e.g. apple, AAPL, jpmorgan)"}
          className="w-full bg-transparent text-base outline-none"
          aria-autocomplete="list"
          aria-expanded={open}
        />
      </div>

      {open && matches.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-80 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
          {matches.map((m, i) => (
            <li key={m.ticker}>
              <button
                type="button"
                onMouseEnter={() => setHighlighted(i)}
                onClick={() => pick(m.ticker)}
                className={
                  "flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-navy-50 " +
                  (i === highlighted ? "bg-navy-50" : "")
                }
              >
                <span>
                  <span className="font-semibold text-gray-900">{m.ticker}</span>
                  <span className="ml-2 text-gray-600">{m.name}</span>
                </span>
                <span className="text-xs text-gray-400">{m.sector}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && query.trim() && matches.length === 0 && (
        <div className="absolute z-20 mt-1 w-full rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 shadow-lg">
          No tickers matching <strong>{query}</strong>. Mizan currently covers {stocks.length} representative tickers; live FMP coverage expanding.
        </div>
      )}
    </div>
  );
}
