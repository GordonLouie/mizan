"use client";

import { useEffect, useMemo, useState } from "react";
import { listStocks, findStock } from "@/lib/data";
import { getScholar, SCHOLAR_PROFILES } from "@/lib/scholars";
import { loadCustomProfile } from "@/lib/customProfile";
import { calculatePurification } from "@/lib/purification";
import ScholarPicker from "@/components/ScholarPicker";
import DemoBanner from "@/components/DemoBanner";
import { SelectField } from "@/components/ui";

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
    <div className="pb-20">
      {/* PAGE HEADER */}
      <header className="pt-6">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Purification calculator
        </div>
        <h1
          className="mt-3 text-[36px] font-bold leading-[1.1] text-gray-900 sm:text-[44px]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Cleanse your dividend income
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-gray-600">
          Calculate the impure portion of your dividend income (and, if your scholar
          requires it, capital gains). Donate the amount to charity to purify your holding.
        </p>
      </header>

      <div className="mt-8">
        <DemoBanner />
      </div>

      {/* SCHOLAR PICKER */}
      <div className="mt-8 sm:max-w-md">
        <ScholarPicker value={scholarId} onChange={setScholarId} />
      </div>

      {/* INPUTS */}
      <section className="mt-10">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Inputs
        </div>
        <h2
          className="mt-2 text-[22px] font-bold leading-tight text-gray-900 sm:text-[26px]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Your holding
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <SelectField
              label="Ticker"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              options={listStocks().map((s) => ({
                value: s.ticker,
                label: `${s.ticker} — ${s.name}`,
              }))}
            />
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <label className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
              Position value (USD)
            </label>
            <input
              type="number"
              value={positionValue}
              onChange={(e) => setPositionValue(parseFloat(e.target.value) || 0)}
              className="mt-2 w-full rounded-md border border-gray-200 bg-white px-3 py-2 font-mono text-sm tabular-nums focus:border-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-700/10"
            />
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <label className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
              Realized capital gain (USD)
            </label>
            <input
              type="number"
              value={realizedGain}
              onChange={(e) => setRealizedGain(parseFloat(e.target.value) || 0)}
              className="mt-2 w-full rounded-md border border-gray-200 bg-white px-3 py-2 font-mono text-sm tabular-nums focus:border-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-700/10"
            />
          </div>
        </div>
      </section>

      {/* RESULTS */}
      {stock && result && (
        <section className="mt-12 border-t border-gray-200 pt-10">
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
            Result
          </div>
          <h2
            className="mt-2 text-[24px] font-bold leading-tight text-gray-900 sm:text-[28px]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            What to donate
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Stat
              label="Estimated annual dividend"
              value={`$${result.annualDividendUsd.toFixed(2)}`}
              sub={`From ${stock.dividendYieldPct}% yield`}
            />
            <Stat
              label="Impure portion of dividends"
              value={`$${result.impureDividendUsd.toFixed(2)}`}
              sub={`${stock.impermissibleIncomePct}% of dividends`}
            />
            <Stat
              label="Impure portion of capital gain"
              value={`$${result.impureGainUsd.toFixed(2)}`}
              sub={
                scholar.purificationScope === "dividends_and_gains"
                  ? `${stock.impermissibleIncomePct}% of gain`
                  : "Not required by this scholar"
              }
              dim={scholar.purificationScope !== "dividends_and_gains"}
            />
            <Stat
              label="Total to donate"
              value={`$${result.totalPurificationUsd.toFixed(2)}`}
              highlight
            />
          </div>

          <div className="mt-6 border-l-2 border-amber-300 py-1 pl-4 text-[13px] leading-relaxed text-gray-700">
            {result.note}
          </div>

          <p className="mt-4 text-[11px] italic text-gray-500">
            v1 ships a one-tap donation flow to LaunchGood / Penny Appeal / Islamic Relief;
            this prototype computes the amount only.
          </p>
        </section>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  highlight,
  dim,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
  dim?: boolean;
}) {
  const wrapClass = highlight
    ? "rounded-xl border border-navy-700 bg-navy-50/60 p-5"
    : dim
      ? "rounded-xl border border-gray-200 bg-gray-50 p-5 opacity-60"
      : "rounded-xl border border-gray-200 bg-white p-5";
  const valueClass = highlight ? "text-navy-800" : "text-gray-900";
  return (
    <div className={wrapClass}>
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
        {label}
      </div>
      <div
        className={`mt-2 text-[26px] font-bold leading-none tabular-nums ${valueClass}`}
        style={{ fontFamily: "Georgia, serif" }}
      >
        {value}
      </div>
      {sub && <div className="mt-2 text-[11px] text-gray-500">{sub}</div>}
    </div>
  );
}
