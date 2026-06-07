"use client";

import { useMemo, useRef, useState } from "react";
import CurrencyInput from "@/components/CurrencyInput";
import { ProgressRing, DonutChart, DonutLegend } from "@/components/Charts";
import { Heart, Info, ArrowDown } from "lucide-react";
import { BloombergRibbon } from "@/components/ui";

const NISAB_GOLD_GRAMS = 87.48;
const NISAB_SILVER_GRAMS = 612.36;
const ZAKAT_RATE = 0.025;
const GOLD_PRICE_USD_PER_GRAM = 75;
const SILVER_PRICE_USD_PER_GRAM = 0.95;

const NISAB_USD_GOLD = NISAB_GOLD_GRAMS * GOLD_PRICE_USD_PER_GRAM;
const NISAB_USD_SILVER = NISAB_SILVER_GRAMS * SILVER_PRICE_USD_PER_GRAM;

const COLORS = {
  cash: "#1F3A5F",
  savings: "#5E89AF",
  stocks: "#B8860B",
  crypto: "#7C5BBA",
  gold: "#E8C547",
  silver: "#94A3B8",
  other: "#C97A4A",
};

function fmt(n: number): string {
  return "$" + n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export default function ZakatPage() {
  const [cash, setCash] = useState(0);
  const [savings, setSavings] = useState(0);
  const [stocks, setStocks] = useState(0);
  const [stocksIntent, setStocksIntent] = useState<"trading" | "longterm">("trading");
  const [longTermPct, setLongTermPct] = useState(25);
  const [crypto, setCrypto] = useState(0);
  const [goldG, setGoldG] = useState(0);
  const [silverG, setSilverG] = useState(0);
  const [other, setOther] = useState(0);
  const [debts, setDebts] = useState(0);
  const [nisab, setNisab] = useState<"silver" | "gold">("silver");

  const stocksZakatable = stocksIntent === "trading" ? stocks : stocks * (longTermPct / 100);
  const goldValue = goldG * GOLD_PRICE_USD_PER_GRAM;
  const silverValue = silverG * SILVER_PRICE_USD_PER_GRAM;

  const totalAssets = cash + savings + stocksZakatable + crypto + goldValue + silverValue + other;
  const netWealth = Math.max(0, totalAssets - debts);

  const threshold = nisab === "silver" ? NISAB_USD_SILVER : NISAB_USD_GOLD;
  const reachesNisab = netWealth >= threshold;
  const zakat = reachesNisab ? netWealth * ZAKAT_RATE : 0;

  const composition = useMemo(() => {
    const segments = [
      { label: "Cash & checking", value: cash, color: COLORS.cash },
      { label: "Savings accounts", value: savings, color: COLORS.savings },
      { label: "Stocks (zakatable)", value: stocksZakatable, color: COLORS.stocks },
      { label: "Crypto", value: crypto, color: COLORS.crypto },
      { label: "Gold", value: goldValue, color: COLORS.gold },
      { label: "Silver", value: silverValue, color: COLORS.silver },
      { label: "Other zakatable", value: other, color: COLORS.other },
    ].filter((s) => s.value > 0);
    return segments;
  }, [cash, savings, stocksZakatable, crypto, goldValue, silverValue, other]);

  const nisabProgress = Math.min(200, (netWealth / threshold) * 100);

  // Calculator UX (Tyler's feedback 2026-06-07 + Hong-Kong friend 2026-06-07):
  //   "the big chart loads before the inputs so it looks broken on first glance"
  //   "have a calculate button and then auto-scroll to show the zakat"
  // Inputs come first. Calculate button smooth-scrolls to the result hero.
  const resultRef = useRef<HTMLDivElement | null>(null);
  const [calculated, setCalculated] = useState(false);
  function calculate() {
    setCalculated(true);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  return (
    <div className="pb-20">
      <BloombergRibbon
        version="v0.4.0"
        cells={[
          { label: "Net wealth", value: fmt(netWealth) },
          { label: "Nisab", value: nisab === "silver" ? "Silver" : "Gold" },
          { label: "Zakat owed", value: reachesNisab ? fmt(zakat) : "—" },
        ]}
      />

      {/* PAGE HEADER */}
      <header className="pt-6">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Zakat calculator
        </div>
        <h1
          className="mt-3 text-[36px] font-bold leading-[1.1] text-gray-900 sm:text-[44px]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          What do you owe in zakat this year?
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-gray-600">
          Enter your assets and short-term debts below, then press Calculate. If your net
          wealth reaches the nisab threshold, zakat is owed at 2.5%.
        </p>
      </header>

      {/* INPUTS — two columns */}
      <section className="mt-16">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Your inputs
        </div>
        <h2
          className="mt-2 text-[24px] font-bold leading-tight text-gray-900 sm:text-[28px]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Enter what you hold
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Liquid wealth column */}
          <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-6">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                Liquid wealth
              </div>
            </div>

            <CurrencyInput label="Cash & checking accounts" value={cash} onChange={setCash} />
            <CurrencyInput
              label="Savings accounts"
              value={savings}
              onChange={setSavings}
              hint="Include the principal balance. Donate any received interest separately."
            />

            <div className="border-t border-gray-100 pt-5">
              <CurrencyInput label="Stocks & ETFs (market value)" value={stocks} onChange={setStocks} />
              <div className="mt-4">
                <label className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                  Intent
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {[
                    { id: "trading" as const, label: "Trading (full value)" },
                    { id: "longterm" as const, label: "Long-term (liquid only)" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setStocksIntent(opt.id)}
                      className={
                        "rounded-md border px-3 py-1.5 text-xs transition " +
                        (stocksIntent === opt.id
                          ? "border-navy-700 bg-navy-50 text-navy-800"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-400")
                      }
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {stocksIntent === "longterm" && (
                  <div className="mt-4">
                    <label className="flex items-baseline justify-between text-[11px]">
                      <span className="text-gray-700">Liquid portion of long-term holdings</span>
                      <span className="font-mono font-semibold text-navy-700">{longTermPct}%</span>
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={longTermPct}
                      onChange={(e) => setLongTermPct(parseFloat(e.target.value))}
                      className="mt-2 w-full accent-navy-700"
                    />
                    <p className="mt-1 text-[11px] text-gray-500">
                      Many scholars apply zakat only to the liquid portion. 25% is a common default; consult your scholar.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-5">
              <CurrencyInput label="Crypto (market value)" value={crypto} onChange={setCrypto} />
            </div>
          </div>

          {/* Physical + debts column */}
          <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-6">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                Physical assets & debts
              </div>
            </div>

            <CurrencyInput
              label="Physical gold"
              value={goldG}
              onChange={setGoldG}
              prefix=""
              suffix="grams"
              hint={`Spot price assumed: ${fmt(GOLD_PRICE_USD_PER_GRAM)}/g`}
            />
            <CurrencyInput
              label="Physical silver"
              value={silverG}
              onChange={setSilverG}
              prefix=""
              suffix="grams"
              hint={`Spot price assumed: ${fmt(SILVER_PRICE_USD_PER_GRAM)}/g`}
            />
            <CurrencyInput
              label="Other zakatable assets"
              value={other}
              onChange={setOther}
              hint="Trade inventory, receivables, etc."
            />

            <div className="border-t border-gray-100 pt-5">
              <CurrencyInput
                label="Short-term debts you owe"
                value={debts}
                onChange={setDebts}
                hint="Debts due within 12 months. Not your full mortgage balance. Consult your scholar on long-term debt treatment."
              />
            </div>

            <div className="border-t border-gray-100 pt-5">
              <label className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                Nisab standard
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {[
                  { id: "silver" as const, label: `Silver`, amount: fmt(NISAB_USD_SILVER), sub: "Most conservative" },
                  { id: "gold" as const, label: `Gold`, amount: fmt(NISAB_USD_GOLD), sub: "Higher threshold" },
                ].map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => setNisab(n.id)}
                    className={
                      "rounded-md border px-3 py-2.5 text-left transition " +
                      (nisab === n.id
                        ? "border-navy-700 bg-navy-50"
                        : "border-gray-200 bg-white hover:border-gray-400")
                    }
                  >
                    <div className="text-[12px] font-semibold text-gray-900">{n.label}</div>
                    <div className="mt-0.5 font-mono text-[11px] text-gray-700">{n.amount}</div>
                    <div className="mt-0.5 text-[10px] text-gray-500">{n.sub}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALCULATE button — Hong-Kong friend feedback: "have a calculate
          button and then auto-scroll to show the zakat". The numbers below
          are already reactive; this button gives older users the explicit
          "now show me the answer" affordance and smooth-scrolls to it. */}
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={calculate}
          className="inline-flex items-center gap-2 rounded-lg bg-navy-800 px-6 py-3 text-[14px] font-semibold text-white shadow-sm transition hover:bg-navy-700"
        >
          Calculate my zakat <ArrowDown size={14} />
        </button>
      </div>

      {/* HERO RESULT — three-column grid with 1px dividers.
          Placeholder hint visible until inputs are filled; lives BELOW
          inputs now per Tyler's "load order looks broken" feedback. */}
      <section ref={resultRef} className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200 sm:grid-cols-3">
        {/* Net wealth */}
        <div className="bg-white p-7">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
            Net zakatable wealth
          </div>
          <div
            className="mt-4 text-[34px] font-bold leading-none tabular-nums text-gray-900"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {fmt(netWealth)}
          </div>
          <p className="mt-2 font-mono text-[11px] text-gray-500">
            {fmt(totalAssets)} assets − {fmt(debts)} debts
          </p>

          {/* Nisab progress */}
          <div className="mt-7">
            <div className="flex items-baseline justify-between text-[11px]">
              <span className="font-semibold uppercase tracking-[0.16em] text-gray-500">
                Nisab progress
              </span>
              <span className="font-mono tabular-nums text-gray-700">
                {reachesNisab ? "Reached" : `${((netWealth / threshold) * 100).toFixed(0)}%`}
              </span>
            </div>
            <div className="relative mt-2 h-1.5 w-full bg-gray-100">
              <div
                className="absolute left-0 top-0 h-full transition-all"
                style={{
                  width: `${Math.min(100, nisabProgress)}%`,
                  backgroundColor: reachesNisab ? "#047857" : "#B45309",
                }}
              />
            </div>
            <p className="mt-2 text-[11px] text-gray-500">
              {nisab === "silver" ? `Silver nisab: ${fmt(NISAB_USD_SILVER)}` : `Gold nisab: ${fmt(NISAB_USD_GOLD)}`}
            </p>
          </div>
        </div>

        {/* Center: progress ring */}
        <div className="flex flex-col items-center justify-center bg-white p-7">
          <ProgressRing
            percent={reachesNisab ? 100 : (netWealth / threshold) * 100}
            size={200}
            color={reachesNisab ? "#047857" : "#B45309"}
            label={reachesNisab ? fmt(zakat) : "Below nisab"}
            sublabel={reachesNisab ? "Zakat owed" : "Not yet obligated"}
          />
        </div>

        {/* Right: composition donut */}
        <div className="flex flex-col items-center justify-center bg-white p-7">
          {composition.length > 0 ? (
            <DonutChart
              segments={composition}
              size={200}
              thickness={22}
              centerLabel={fmt(totalAssets)}
              centerSublabel="Total assets"
            />
          ) : (
            <div className="text-center text-sm text-gray-500">
              <p>Enter your assets below</p>
              <p className="mt-1 text-xs text-gray-400">to see composition</p>
            </div>
          )}
          <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
            Asset mix
          </p>
        </div>
      </section>

      {/* DONATE CTA — only when zakat is owed */}
      {reachesNisab && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50/60 px-6 py-5">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Zakat owed
            </div>
            <div
              className="mt-1 text-[28px] font-bold leading-none tabular-nums text-emerald-700"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {fmt(zakat)}
            </div>
            <p className="mt-1 text-[11px] text-emerald-700/80">2.5% of {fmt(netWealth)}</p>
          </div>
          <a
            href="https://www.launchgood.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            <Heart size={14} /> Give via LaunchGood
          </a>
        </div>
      )}


      {/* COMPOSITION LEGEND + REFERENCE */}
      <section className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {composition.length > 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
              Asset breakdown
            </div>
            <h3
              className="mt-2 text-[18px] font-bold leading-tight text-gray-900"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Where your wealth sits
            </h3>
            <div className="mt-5">
              <DonutLegend segments={composition} totalLabel={`Total: ${fmt(totalAssets)}`} />
            </div>
          </div>
        )}

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
            <Info size={12} /> Important caveats
          </div>
          <ul className="mt-4 space-y-3 text-[13px] leading-relaxed text-gray-700">
            <li>
              Treatment of stocks (trading vs long-term), long-term debt, retirement
              accounts, and business equity varies between scholars. Consult yours for
              material decisions.
            </li>
            <li>
              Spot prices for nisab are approximations. The production version pulls live
              gold/silver prices from a market data feed.
            </li>
            <li>
              Zakat is paid on your zakat anniversary date — one lunar year after you
              first reached nisab.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
