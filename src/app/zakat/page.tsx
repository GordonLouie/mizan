"use client";

import { useMemo, useState } from "react";
import { HelpCircle, Heart } from "lucide-react";

// Approximate nisab values updated 2026 (production: pull from a live gold/silver price API)
const NISAB_GOLD_GRAMS = 87.48;       // 7.5 tola — gold standard
const NISAB_SILVER_GRAMS = 612.36;    // 52.5 tola — silver standard (lower threshold)
const ZAKAT_RATE = 0.025;             // 2.5%

// Current approximate spot prices (replace with live in production)
const GOLD_PRICE_USD_PER_GRAM = 75;
const SILVER_PRICE_USD_PER_GRAM = 0.95;

const NISAB_USD_GOLD = NISAB_GOLD_GRAMS * GOLD_PRICE_USD_PER_GRAM;
const NISAB_USD_SILVER = NISAB_SILVER_GRAMS * SILVER_PRICE_USD_PER_GRAM;

export default function ZakatPage() {
  const [cashAndChecking, setCashAndChecking] = useState<number>(0);
  const [savingsAccounts, setSavingsAccounts] = useState<number>(0);
  const [stocksValue, setStocksValue] = useState<number>(0);
  const [stocksIntent, setStocksIntent] = useState<"trading" | "longterm">("trading");
  const [longTermLiquidPortion, setLongTermLiquidPortion] = useState<number>(25);
  const [crypto, setCrypto] = useState<number>(0);
  const [goldGrams, setGoldGrams] = useState<number>(0);
  const [silverGrams, setSilverGrams] = useState<number>(0);
  const [otherZakatable, setOtherZakatable] = useState<number>(0);
  const [shortTermDebts, setShortTermDebts] = useState<number>(0);
  const [nisabStandard, setNisabStandard] = useState<"silver" | "gold">("silver");

  const stocksZakatable = useMemo(() => {
    if (stocksIntent === "trading") return stocksValue;
    return stocksValue * (longTermLiquidPortion / 100);
  }, [stocksValue, stocksIntent, longTermLiquidPortion]);

  const goldValue = goldGrams * GOLD_PRICE_USD_PER_GRAM;
  const silverValue = silverGrams * SILVER_PRICE_USD_PER_GRAM;

  const totalAssets = useMemo(
    () => cashAndChecking + savingsAccounts + stocksZakatable + crypto + goldValue + silverValue + otherZakatable,
    [cashAndChecking, savingsAccounts, stocksZakatable, crypto, goldValue, silverValue, otherZakatable],
  );

  const netWealth = useMemo(() => Math.max(0, totalAssets - shortTermDebts), [totalAssets, shortTermDebts]);

  const nisab = nisabStandard === "silver" ? NISAB_USD_SILVER : NISAB_USD_GOLD;
  const reachesNisab = netWealth >= nisab;
  const zakat = reachesNisab ? netWealth * ZAKAT_RATE : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Zakat calculator</h1>
        <p className="mt-1 max-w-2xl text-sm text-gray-600">
          Calculate your zakat on your zakat anniversary date. Enter assets minus
          short-term debts; if the result reaches nisab, you owe 2.5%. Mizan&apos;s
          calculator handles cash, stocks (with trading vs long-term intent), crypto,
          and physical gold/silver.
        </p>
      </div>

      <div className="rounded-md border border-navy-200 bg-navy-50 p-4 text-xs text-navy-800">
        <strong>How to use:</strong> Pick your zakat anniversary date (one lunar
        year after you first reached nisab). On that day, enter the market value of
        each asset you held throughout the year. Subtract immediate debts. The
        calculator handles the rest.
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-5 rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-base font-semibold text-gray-900">Your assets (USD)</h2>

          <Input label="Cash + checking accounts" value={cashAndChecking} onChange={setCashAndChecking} />
          <Input label="Savings accounts (if held)" value={savingsAccounts} onChange={setSavingsAccounts}
            hint="Note: interest-bearing savings are problematic in themselves; include the principal here, donate received interest separately." />

          <div className="rounded-md border border-gray-100 bg-gray-50 p-3">
            <Input label="Stocks & ETFs (market value)" value={stocksValue} onChange={setStocksValue} />
            <div className="mt-3">
              <label className="text-xs font-medium uppercase tracking-wide text-gray-500">Intent for these stocks</label>
              <div className="mt-1 flex gap-2">
                {[
                  { id: "trading", label: "Trading (full value zakatable)" },
                  { id: "longterm", label: "Long-term (liquid portion only)" },
                ].map((opt) => (
                  <button key={opt.id} type="button" onClick={() => setStocksIntent(opt.id as any)}
                    className={"rounded-md border px-2 py-1 text-xs " + (stocksIntent === opt.id ? "border-navy-700 bg-navy-50 text-navy-800" : "border-gray-200 bg-white text-gray-700")}>
                    {opt.label}
                  </button>
                ))}
              </div>
              {stocksIntent === "longterm" && (
                <div className="mt-3">
                  <label className="flex items-baseline justify-between text-xs">
                    <span className="text-gray-700">Liquid portion of long-term holdings</span>
                    <span className="font-mono font-semibold text-navy-700">{longTermLiquidPortion}%</span>
                  </label>
                  <input type="range" min={0} max={100} step={5} value={longTermLiquidPortion}
                    onChange={(e) => setLongTermLiquidPortion(parseFloat(e.target.value))}
                    className="mt-1 w-full" />
                  <p className="mt-1 text-xs text-gray-500">
                    Many scholars apply zakat only to the liquid (cash + receivables) portion of long-term holdings.
                    25% is a common default; consult your scholar.
                  </p>
                </div>
              )}
            </div>
          </div>

          <Input label="Crypto holdings (market value)" value={crypto} onChange={setCrypto} />
          <Input label="Physical gold (grams)" value={goldGrams} onChange={setGoldGrams} hint={`Spot price assumed: $${GOLD_PRICE_USD_PER_GRAM}/g`} />
          <Input label="Physical silver (grams)" value={silverGrams} onChange={setSilverGrams} hint={`Spot price assumed: $${SILVER_PRICE_USD_PER_GRAM}/g`} />
          <Input label="Other zakatable assets" value={otherZakatable} onChange={setOtherZakatable} hint="Trade inventory, receivables, etc." />

          <div className="border-t border-gray-100 pt-4">
            <Input label="Short-term debts you owe (deduct)" value={shortTermDebts} onChange={setShortTermDebts}
              hint="Debts due within 12 months, not your full mortgage balance. Consult your scholar on long-term debt treatment." />
          </div>

          <div className="border-t border-gray-100 pt-4">
            <label className="text-xs font-medium uppercase tracking-wide text-gray-500">Nisab standard</label>
            <div className="mt-1 flex gap-2">
              {[
                { id: "silver", label: `Silver (${NISAB_SILVER_GRAMS}g) ≈ $${NISAB_USD_SILVER.toFixed(0)} — most conservative` },
                { id: "gold",   label: `Gold (${NISAB_GOLD_GRAMS}g) ≈ $${NISAB_USD_GOLD.toFixed(0)} — historical alternative` },
              ].map((n) => (
                <button key={n.id} type="button" onClick={() => setNisabStandard(n.id as any)}
                  className={"rounded-md border px-2 py-1.5 text-xs " + (nisabStandard === n.id ? "border-navy-700 bg-navy-50 text-navy-800" : "border-gray-200 bg-white text-gray-700")}>
                  {n.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-base font-semibold text-gray-900">Your zakat this year</h2>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Cell label="Total assets" value={fmt(totalAssets)} />
              <Cell label="Less: short-term debts" value={fmt(-shortTermDebts)} />
              <Cell label="Net zakatable wealth" value={fmt(netWealth)} highlight />
              <Cell label="Nisab threshold" value={fmt(nisab)} muted />
            </div>

            <div className="mt-5 rounded-md p-4 text-center"
              style={{ backgroundColor: reachesNisab ? "#ECFDF5" : "#FEF3C7", border: "1px solid " + (reachesNisab ? "#A7F3D0" : "#FDE68A") }}>
              {reachesNisab ? (
                <>
                  <div className="text-xs font-medium uppercase tracking-wide text-emerald-700">Zakat due</div>
                  <div className="mt-2 text-4xl font-bold text-emerald-700" style={{ fontFamily: "Georgia, serif" }}>{fmt(zakat)}</div>
                  <div className="mt-1 text-xs text-emerald-700">2.5% of {fmt(netWealth)}</div>
                </>
              ) : (
                <>
                  <div className="text-xs font-medium uppercase tracking-wide text-amber-700">Below nisab</div>
                  <div className="mt-2 text-base text-amber-800">Your net wealth is below the nisab threshold ({fmt(nisab)}). No zakat is owed this year.</div>
                </>
              )}
            </div>

            {reachesNisab && (
              <a href="https://www.launchgood.com" target="_blank" rel="noopener noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-navy-800 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700">
                <Heart size={14} /> Donate via LaunchGood
              </a>
            )}
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
            <div className="mb-1 flex items-center gap-1 font-semibold">
              <HelpCircle size={14} /> Important
            </div>
            <p>
              This calculator is a starting point. The treatment of stocks (trading
              vs. long-term), debts (short vs. long-term), and certain assets
              (retirement accounts, business equity) varies between scholars.
              For decisions involving meaningful sums, please consult a qualified scholar.
            </p>
            <p className="mt-2">
              Spot prices for nisab are approximations updated periodically. The
              production version pulls live gold/silver prices from a market data feed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, hint }: { label: string; value: number; onChange: (v: number) => void; hint?: string }) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</label>
      <input type="number" min="0" step="any" value={value === 0 ? "" : value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        placeholder="0"
        className="mt-1 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm tabular-nums focus:border-navy-400 focus:bg-white focus:outline-none" />
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

function Cell({ label, value, highlight, muted }: { label: string; value: string; highlight?: boolean; muted?: boolean }) {
  return (
    <div className={"rounded-md border p-3 " + (highlight ? "border-navy-200 bg-navy-50" : muted ? "border-gray-200 bg-gray-50" : "border-gray-200 bg-white")}>
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className={"mt-1 text-lg font-semibold tabular-nums " + (highlight ? "text-navy-800" : "text-gray-900")}>{value}</div>
    </div>
  );
}

function fmt(n: number): string {
  if (n < 0) return "-$" + Math.abs(n).toLocaleString(undefined, { maximumFractionDigits: 2 });
  return "$" + n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}
