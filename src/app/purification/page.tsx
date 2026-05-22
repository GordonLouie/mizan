"use client";

import { useEffect, useMemo, useState } from "react";
import { listStocks, findStock } from "@/lib/data";
import { getScholar, SCHOLAR_PROFILES } from "@/lib/scholars";
import { loadCustomProfile } from "@/lib/customProfile";
import { calculatePurification } from "@/lib/purification";
import ScholarPicker from "@/components/ScholarPicker";
import DemoBanner from "@/components/DemoBanner";
import { Card, PageHeader } from "@/components/ui";

export default function PurificationPage() {
  const [scholarId, setScholarId] = useState("taqi_usmani");
  const [ticker, setTicker] = useState("AAPL");
  const [positionValue, setPositionValue] = useState(100000);
  const [realizedGain, setRealizedGain] = useState(15000);
  const [bump, setBump] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("mizan.scholarId");
      if (saved && SCHOLAR_PROFILES.some((p) => p.id === saved)) setScholarId(saved);
    } catch {}
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
  const stock = findStock(ticker);
  const result = useMemo(() => {
    if (!stock) return null;
    return calculatePurification({
      stock, scholar,
      positionValueUsd: positionValue,
      realizedGainUsd: realizedGain,
    });
  }, [stock, scholar, positionValue, realizedGain]);

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Purification"
        title="Purification calculator"
        description="Calculate the impure portion of your dividend income (and, if your scholar requires it, capital gains). Donate the amount to charity to purify your holding."
      />

      <DemoBanner />

      <ScholarPicker value={scholarId} onChange={setScholarId} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <label className="text-xs uppercase tracking-wide text-gray-500">Ticker</label>
          <select value={ticker} onChange={(e) => setTicker(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm">
            {listStocks().map((s) => (
              <option key={s.ticker} value={s.ticker}>{s.ticker} — {s.name}</option>
            ))}
          </select>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <label className="text-xs uppercase tracking-wide text-gray-500">Position value (USD)</label>
          <input type="number" value={positionValue}
            onChange={(e) => setPositionValue(parseFloat(e.target.value) || 0)}
            className="mt-1 w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm" />
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <label className="text-xs uppercase tracking-wide text-gray-500">Realized capital gain this year (USD)</label>
          <input type="number" value={realizedGain}
            onChange={(e) => setRealizedGain(parseFloat(e.target.value) || 0)}
            className="mt-1 w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm" />
        </div>
      </div>

      {stock && result && (
        <Card>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Stat label="Estimated annual dividend" value={`$${result.annualDividendUsd.toFixed(2)}`} sub={`From ${stock.dividendYieldPct}% yield`} />
            <Stat label="Impure portion of dividends" value={`$${result.impureDividendUsd.toFixed(2)}`} sub={`${stock.impermissibleIncomePct}% of dividends`} />
            <Stat label="Impure portion of capital gain" value={`$${result.impureGainUsd.toFixed(2)}`}
              sub={scholar.purificationScope === "dividends_and_gains" ? `${stock.impermissibleIncomePct}% of gain` : "Not required by this scholar"}
              dim={scholar.purificationScope !== "dividends_and_gains"} />
            <Stat label="Total to donate" value={`$${result.totalPurificationUsd.toFixed(2)}`} highlight />
          </div>
          <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            {result.note}
          </div>
          <div className="mt-3 text-xs text-gray-500">
            v1 ships a one-tap donation flow to LaunchGood / Penny Appeal / Islamic Relief; this prototype computes the amount only.
          </div>
        </Card>
      )}
    </div>
  );
}

function Stat({ label, value, sub, highlight, dim }: { label: string; value: string; sub?: string; highlight?: boolean; dim?: boolean }) {
  return (
    <div className={"rounded-lg border p-3 " + (highlight ? "border-navy-700 bg-navy-50" : dim ? "border-gray-200 bg-gray-50 opacity-60" : "border-gray-200 bg-gray-50")}>
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className={"mt-1 text-xl font-bold " + (highlight ? "text-navy-800" : "text-gray-900")}>{value}</div>
      {sub && <div className="mt-0.5 text-xs text-gray-500">{sub}</div>}
    </div>
  );
}
