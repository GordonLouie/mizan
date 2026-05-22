"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Bookmark, Trash2, ArrowRight } from "lucide-react";
import { getWatchlist, removeFromWatchlist } from "@/lib/watchlist";
import { findStock } from "@/lib/data";
import { getScholar, SCHOLAR_PROFILES } from "@/lib/scholars";
import { loadCustomProfile } from "@/lib/customProfile";
import { screenStock } from "@/lib/screen";
import StockLogo from "@/components/StockLogo";
import ScholarPicker from "@/components/ScholarPicker";
import { PageHeader, Card, Button, Pill } from "@/components/ui";
import { VERDICT_LABEL } from "@/lib/verdictLabels";

export default function WatchlistPage() {
  const [tickers, setTickers] = useState<string[]>([]);
  const [scholarId, setScholarId] = useState("aaoifi");
  const [bump, setBump] = useState(0);

  useEffect(() => {
    setTickers(getWatchlist());
    const onChange = () => setTickers(getWatchlist());
    window.addEventListener("mizan.watchlist.changed", onChange);

    try {
      const saved = localStorage.getItem("mizan.scholarId");
      if (saved && SCHOLAR_PROFILES.some((p) => p.id === saved)) setScholarId(saved);
    } catch {}

    return () => window.removeEventListener("mizan.watchlist.changed", onChange);
  }, []);

  useEffect(() => {
    const onFocus = () => setBump((b) => b + 1);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const scholar = useMemo(
    () => (scholarId === "custom" ? loadCustomProfile() : getScholar(scholarId)),
    [scholarId, bump],
  );

  const items = useMemo(() => {
    return tickers
      .map((t) => {
        const stock = findStock(t);
        if (!stock) return null;
        return { stock, result: screenStock(stock, scholar) };
      })
      .filter(Boolean) as { stock: any; result: any }[];
  }, [tickers, scholar]);

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Watchlist"
        title="Stocks you're tracking"
        description="Save stocks you want to revisit. Verdicts update automatically when you change scholars."
      />

      <ScholarPicker value={scholarId} onChange={setScholarId} />

      {items.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <Bookmark size={22} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
              No stocks saved yet
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
              Search any stock from the screener and click the &ldquo;Save&rdquo; button to add it here.
            </p>
            <Button href="/screen" className="mt-5">Open screener</Button>
          </div>
        </Card>
      ) : (
        <Card padded={false} className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-[10px] uppercase tracking-widest text-gray-500">
              <tr>
                <th className="px-6 py-3">Stock</th>
                <th className="px-6 py-3">Sector</th>
                <th className="px-6 py-3 text-right">Verdict</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map(({ stock, result }) => (
                <tr key={stock.ticker} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <StockLogo ticker={stock.ticker} name={stock.name} size={32} />
                      <div>
                        <div className="font-mono text-sm font-semibold text-gray-900">{stock.ticker}</div>
                        <div className="text-xs text-gray-500">{stock.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-xs text-gray-600">{stock.sector}</td>
                  <td className="px-6 py-3 text-right">
                    <Pill tone={result.verdict === "pass" ? "pass" : result.verdict === "borderline" ? "warn" : "fail"}>
                      {VERDICT_LABEL[result.verdict as keyof typeof VERDICT_LABEL]}
                    </Pill>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/screen?ticker=${stock.ticker}`} className="inline-flex items-center gap-1 text-xs text-navy-700 hover:text-navy-900">
                        Open <ArrowRight size={11} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeFromWatchlist(stock.ticker)}
                        className="rounded p-1 text-gray-400 hover:bg-rose-50 hover:text-rose-700"
                        aria-label={`Remove ${stock.ticker}`}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
