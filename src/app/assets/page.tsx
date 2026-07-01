"use client";

/**
 * /assets — the Halal Asset Map.
 *
 * An educational, explorable map of where contemporary scholars generally land
 * on every major asset class — HalalGauge's original take on the "periodic
 * table of Islamic finance". This is a REFERENCE surface, not the screening
 * engine: category-level guidance with honest notes, heavy disclaiming, and
 * links back into the live stock screen where a real per-instrument check
 * applies. Deliberately not a fatwa.
 */

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ScanSearch } from "lucide-react";

type State = "compliant" | "conditional" | "debated" | "noncompliant";

interface Asset {
  n: number;
  sym: string;
  name: string;
  state: State;
  what: string;
  why: string;
}
interface Family {
  roman: string;
  name: string;
  assets: Asset[];
}

const STATE_META: Record<State, { label: string; dot: string; tile: string; badge: string; note: string }> = {
  compliant: {
    label: "Compliant",
    dot: "bg-emerald-500",
    tile: "bg-emerald-600 hover:bg-emerald-700 text-white",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    note: "Permissible by the majority of contemporary scholars.",
  },
  conditional: {
    label: "Conditional",
    dot: "bg-amber-500",
    tile: "bg-amber-500 hover:bg-amber-600 text-white",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    note: "Permitted only if structured & screened correctly — otherwise not.",
  },
  debated: {
    label: "Debated",
    dot: "bg-violet-500",
    tile: "bg-violet-500 hover:bg-violet-600 text-white",
    badge: "bg-violet-50 text-violet-700 border-violet-200",
    note: "Genuine scholarly disagreement; the answer depends on who you follow.",
  },
  noncompliant: {
    label: "Non-compliant",
    dot: "bg-rose-500",
    tile: "bg-rose-600 hover:bg-rose-700 text-white",
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    note: "Generally prohibited — typically involves riba (interest), gharar (excessive uncertainty) or maysir (gambling).",
  },
};

const FAMILIES: Family[] = [
  {
    roman: "I",
    name: "Money & cash",
    assets: [
      { n: 1, sym: "Au", name: "Physical gold", state: "compliant", what: "Allocated physical gold.", why: "A tangible store of value; permissible if held and exchanged hand-to-hand (no deferred settlement)." },
      { n: 2, sym: "Ag", name: "Physical silver", state: "compliant", what: "Allocated physical silver.", why: "Same basis as gold — a real commodity, permissible with immediate possession." },
      { n: 3, sym: "Fi", name: "Fiat currency", state: "compliant", what: "Cash / bank balances.", why: "Holding money is fine; the issue is only earning interest on it." },
      { n: 4, sym: "Ic", name: "Islamic current account", state: "compliant", what: "Non-interest transaction account.", why: "Safekeeping with no interest paid or charged." },
      { n: 5, sym: "Is", name: "Islamic savings", state: "compliant", what: "Profit-share savings account.", why: "Returns come from real profit-sharing, not fixed interest." },
      { n: 6, sym: "Mm", name: "Murabaha money market", state: "compliant", what: "Short-term cost-plus placements.", why: "Returns arise from real trade transactions, not lending at interest." },
      { n: 7, sym: "Cs", name: "Conventional savings", state: "noncompliant", what: "Interest-bearing savings.", why: "Pays fixed interest (riba)." },
      { n: 8, sym: "Mf", name: "Money market fund", state: "noncompliant", what: "Fund of interest instruments.", why: "Holds treasury bills and deposits that pay interest (riba)." },
      { n: 9, sym: "Cd", name: "Certificate of deposit", state: "noncompliant", what: "Fixed-term interest deposit.", why: "Guaranteed interest on a loan to the bank (riba)." },
    ],
  },
  {
    roman: "II",
    name: "Fixed-income-like",
    assets: [
      { n: 10, sym: "Sk", name: "Sovereign sukuk", state: "compliant", what: "Government 'Islamic bond'.", why: "Represents ownership in real assets; returns are rent/profit, not interest." },
      { n: 11, sym: "Sc", name: "Corporate sukuk", state: "compliant", what: "Company 'Islamic bond'.", why: "Asset-backed; the holder shares real returns, not a fixed loan coupon." },
      { n: 12, sym: "Wk", name: "Wakala deposit", state: "compliant", what: "Agency-based placement.", why: "The bank invests your funds as your agent for a real return." },
      { n: 13, sym: "Md", name: "Murabaha term deposit", state: "compliant", what: "Fixed-term cost-plus deposit.", why: "Return comes from a genuine cost-plus sale, not interest." },
      { n: 14, sym: "Qh", name: "Qard hasan note", state: "compliant", what: "Benevolent interest-free loan.", why: "A loan repaid at face value with no increase — the model of permissible lending." },
      { n: 15, sym: "Tb", name: "Treasury bill", state: "noncompliant", what: "Short-term govt debt.", why: "A loan repaid with interest (riba)." },
      { n: 16, sym: "Gb", name: "Government bond", state: "noncompliant", what: "Govt debt paying coupons.", why: "Fixed interest on a loan (riba)." },
      { n: 17, sym: "Cb", name: "Corporate bond", state: "noncompliant", what: "Company debt paying coupons.", why: "Fixed interest on a loan (riba)." },
      { n: 18, sym: "Jb", name: "Junk bond", state: "noncompliant", what: "High-yield company debt.", why: "Interest-bearing debt (riba), with added excessive risk." },
      { n: 19, sym: "Pf", name: "Preferred stock", state: "noncompliant", what: "Fixed-dividend shares.", why: "Behaves like a loan with a guaranteed return — treated as interest-like by most scholars." },
    ],
  },
  {
    roman: "III",
    name: "Equities",
    assets: [
      { n: 20, sym: "Ie", name: "Shariah ETF", state: "compliant", what: "Fund of screened stocks.", why: "Holdings are pre-screened against a Shariah standard." },
      { n: 21, sym: "Sh", name: "Screened stock", state: "compliant", what: "A stock that passes screening.", why: "Halal business plus financial ratios within the threshold — this is HalalGauge's core check." },
      { n: 22, sym: "Ip", name: "Islamic PE fund", state: "compliant", what: "Private-equity, Shariah-run.", why: "Real ownership stakes in screened, permissible businesses." },
      { n: 23, sym: "Iv", name: "Islamic venture capital", state: "compliant", what: "Early-stage equity investing.", why: "Profit-and-loss sharing in real ventures — the ideal Islamic structure." },
      { n: 24, sym: "Us", name: "Unscreened stock", state: "conditional", what: "Any listed share.", why: "Permissible only if it passes a sector + financial-ratio screen — which is exactly what to check first." },
      { n: 25, sym: "Et", name: "Conventional ETF", state: "conditional", what: "Standard index fund.", why: "Not inherently forbidden — depends on the holdings. Broad-market ETFs usually fail; some sector ones pass." },
      { n: 26, sym: "Io", name: "IPO (unscreened)", state: "conditional", what: "A new listing.", why: "Judged like any stock — screen the business and the balance sheet before buying." },
      { n: 27, sym: "Bk", name: "Bank stock", state: "noncompliant", what: "Conventional bank shares.", why: "The core business is lending at interest (riba)." },
      { n: 28, sym: "Ci", name: "Conventional insurer", state: "noncompliant", what: "Standard insurance company.", why: "Built on interest and excessive uncertainty (riba + gharar)." },
    ],
  },
  {
    roman: "IV",
    name: "Real assets",
    assets: [
      { n: 29, sym: "Re", name: "Direct real estate", state: "compliant", what: "Owning property directly.", why: "A tangible asset; rental income is permissible (if the tenant's use is halal)." },
      { n: 30, sym: "Ir", name: "Islamic REIT", state: "compliant", what: "Shariah-screened property fund.", why: "Uses permissible financing and screens tenants' activities." },
      { n: 31, sym: "Fm", name: "Farmland", state: "compliant", what: "Agricultural land.", why: "Real productive asset; income from real harvests or rent." },
      { n: 32, sym: "Tm", name: "Timberland", state: "compliant", what: "Forestry land.", why: "Tangible productive asset with real output." },
      { n: 33, sym: "If", name: "Infrastructure equity", state: "compliant", what: "Stakes in real infrastructure.", why: "Ownership of productive physical assets (roads, utilities, etc.)." },
      { n: 34, sym: "Cr", name: "Conventional REIT", state: "conditional", what: "Standard property fund.", why: "Often uses interest-bearing debt and non-halal tenants — permissible only if it screens both." },
    ],
  },
  {
    roman: "V",
    name: "Commodities",
    assets: [
      { n: 35, sym: "Oi", name: "Physical oil/gas", state: "compliant", what: "Real energy commodities.", why: "Tangible goods traded with genuine ownership." },
      { n: 36, sym: "Cu", name: "Industrial metals", state: "compliant", what: "Copper, aluminium, etc.", why: "Real commodities; permissible with proper possession." },
      { n: 37, sym: "As", name: "Agricultural spot", state: "compliant", what: "Crops bought spot.", why: "Real goods, immediate settlement — no deferred speculation." },
      { n: 38, sym: "Ge", name: "Gold ETF (backed)", state: "conditional", what: "Fund tracking gold.", why: "Acceptable only if fully backed by allocated physical gold and redeemable — not just a paper claim." },
      { n: 39, sym: "Cf", name: "Commodity futures", state: "noncompliant", what: "Contracts on future prices.", why: "Deferred, leveraged and speculative (gharar + maysir); no real possession." },
    ],
  },
  {
    roman: "VI",
    name: "Alternatives",
    assets: [
      { n: 40, sym: "Mu", name: "Mudaraba fund", state: "compliant", what: "Profit-sharing fund.", why: "One party funds, one manages; profit shared, loss borne by capital — a core Islamic model." },
      { n: 41, sym: "Ms", name: "Musharaka fund", state: "compliant", what: "Joint-venture partnership.", why: "All partners share profit and loss in real proportion — the ideal structure." },
      { n: 42, sym: "Cw", name: "Islamic crowdfunding", state: "compliant", what: "Pooled investing in ventures.", why: "Real equity or profit-share stakes in permissible businesses." },
      { n: 43, sym: "Ar", name: "Art & collectibles", state: "conditional", what: "Physical collectibles.", why: "Fine if the item itself is permissible and it's a real purchase — not if it's pure speculation." },
      { n: 44, sym: "Hf", name: "Hedge fund", state: "noncompliant", what: "Leverage/short strategies.", why: "Typically uses interest, short-selling and derivatives (riba + gharar)." },
      { n: 45, sym: "Wi", name: "Wine/spirits fund", state: "noncompliant", what: "Alcohol-asset fund.", why: "The underlying business (alcohol) is itself prohibited." },
    ],
  },
  {
    roman: "VII",
    name: "Crypto & digital",
    assets: [
      { n: 46, sym: "Bt", name: "Bitcoin", state: "debated", what: "The largest cryptocurrency.", why: "Some scholars accept it as a real digital asset with genuine use; others reject it over volatility and lack of backing (gharar). Genuinely contested." },
      { n: 47, sym: "Et", name: "Ethereum", state: "debated", what: "Smart-contract platform.", why: "Similar debate to Bitcoin, plus questions about staking rewards resembling interest." },
      { n: 48, sym: "Pg", name: "Tokenised gold", state: "conditional", what: "Token backed by gold.", why: "Acceptable only if each token is fully backed by allocated, redeemable physical gold." },
      { n: 49, sym: "Us", name: "Fiat stablecoin", state: "conditional", what: "Token pegged to a currency.", why: "Can be acceptable if fully backed 1:1 and interest-free; interest-earning reserves are a concern." },
      { n: 50, sym: "So", name: "Solana", state: "debated", what: "Layer-1 blockchain token.", why: "Same core crypto debate; permissibility often hinges on the network's use and staking model." },
      { n: 51, sym: "Aa", name: "DeFi lending token", state: "noncompliant", what: "Lending-protocol token.", why: "The protocol pays and charges algorithmic interest (riba)." },
      { n: 52, sym: "Do", name: "Meme coin", state: "debated", what: "Community/hype tokens.", why: "No underlying use and largely speculative (maysir) — most scholars view these as impermissible or highly doubtful." },
      { n: 53, sym: "Nf", name: "NFT", state: "conditional", what: "Unique digital token.", why: "Depends entirely on the underlying content and whether it's a real use vs. pure speculation." },
    ],
  },
  {
    roman: "VIII",
    name: "Derivatives",
    assets: [
      { n: 54, sym: "Ab", name: "'Arbun", state: "compliant", what: "Islamic down-payment sale.", why: "A real purchase with a forfeitable deposit — a recognised permissible structure." },
      { n: 55, sym: "Hf", name: "Hedging forward", state: "conditional", what: "Locking a future price.", why: "Some Islamic hedging structures are allowed for genuine risk-management — not for speculation." },
      { n: 56, sym: "Op", name: "Stock options", state: "noncompliant", what: "Right to buy/sell later.", why: "Trading a right rather than a real asset; speculative and uncertain (gharar + maysir)." },
      { n: 57, sym: "Ft", name: "Futures (spec.)", state: "noncompliant", what: "Speculative futures.", why: "Deferred both sides, leveraged and speculative — no real possession (gharar + maysir)." },
      { n: 58, sym: "Sw", name: "Swaps", state: "noncompliant", what: "Exchanging cash flows.", why: "Usually interest-based and highly uncertain (riba + gharar)." },
      { n: 59, sym: "Cd", name: "Credit default swap", state: "noncompliant", what: "Insurance on default.", why: "Trading in debt and pure risk (gharar + maysir)." },
    ],
  },
  {
    roman: "IX",
    name: "Insurance",
    assets: [
      { n: 60, sym: "Tk", name: "Takaful", state: "compliant", what: "Islamic mutual insurance.", why: "Members jointly pool and donate to cover each other — cooperation, not risk-trading." },
      { n: 61, sym: "Ci", name: "Conventional insurance", state: "noncompliant", what: "Standard insurance.", why: "Built on interest and selling uncertainty (riba + gharar)." },
      { n: 62, sym: "An", name: "Annuity", state: "noncompliant", what: "Guaranteed income product.", why: "Returns are interest-based and structurally uncertain." },
      { n: 63, sym: "Lo", name: "Lottery / premium bonds", state: "noncompliant", what: "Prize-draw products.", why: "Winning by chance is gambling (maysir)." },
    ],
  },
];

const ALL = FAMILIES.flatMap((f) => f.assets.map((a) => ({ ...a, family: f.name })));
const COUNT = ALL.length;

export default function AssetsPage() {
  const [selectedN, setSelectedN] = useState<number>(1);
  const selected = ALL.find((a) => a.n === selectedN) ?? ALL[0];

  function renderDetail() {
    const meta = STATE_META[selected.state];
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
              {selected.family}
            </div>
            <h3
              className="mt-1 text-[20px] font-bold leading-tight text-gray-900"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {selected.name}
            </h3>
          </div>
          <span className={"shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold " + meta.badge}>
            {meta.label}
          </span>
        </div>
        <p className="mt-3 text-[13px] font-medium text-gray-800">{selected.what}</p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-gray-600">{selected.why}</p>
        <p className="mt-3 border-t border-gray-100 pt-3 text-[11px] leading-relaxed text-gray-500">
          {meta.note}
        </p>
        {(selected.family === "Equities") && (
          <Link
            href="/screen"
            className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-navy-700 hover:text-navy-900"
          >
            <ScanSearch size={13} /> Run a real screen on a stock <ArrowRight size={12} />
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* HEADER */}
      <header className="pt-6">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Halal asset map · {COUNT} assets · 9 families
        </div>
        <h1
          className="mt-3 text-[36px] font-bold leading-[1.05] text-gray-900 sm:text-[46px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Every asset, mapped.
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-gray-600">
          Where contemporary scholars generally land on each major asset class —
          from cash and sukuk to equities, commodities and crypto. Tap any tile
          for the plain-English reason.
        </p>
      </header>

      {/* LEGEND */}
      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
        {(Object.keys(STATE_META) as State[]).map((s) => (
          <span key={s} className="inline-flex items-center gap-1.5 text-[12px] text-gray-700">
            <span className={"inline-block h-2.5 w-2.5 rounded-full " + STATE_META[s].dot} />
            <span className="font-medium">{STATE_META[s].label}</span>
          </span>
        ))}
      </div>

      {/* DISCLAIMER */}
      <div className="mt-4 rounded-xl border border-gold-200 bg-gold-50/60 px-4 py-3">
        <p className="text-[12.5px] leading-relaxed text-gray-700">
          <span className="font-semibold text-gray-900">This is a map, not a fatwa.</span>{" "}
          It summarises where mainstream contemporary scholars tend to land — many
          cases are genuinely disputed, and the ruling can change with how a product
          is structured. HalalGauge is not a religious authority; always consult a
          qualified scholar for your situation.
        </p>
      </div>

      {/* MOBILE DETAIL (updates on tap) */}
      <div className="mt-6 lg:hidden">{renderDetail()}</div>

      {/* GRID + STICKY DETAIL */}
      <div className="mt-6 lg:grid lg:grid-cols-[1fr_320px] lg:gap-8">
        <div className="space-y-8">
          {FAMILIES.map((fam) => (
            <section key={fam.roman}>
              <div className="mb-3 flex items-baseline gap-2">
                <span
                  className="text-[13px] font-bold text-gold-600"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {fam.roman}
                </span>
                <h2 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                  {fam.name}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {fam.assets.map((a) => {
                  const meta = STATE_META[a.state];
                  const active = a.n === selectedN;
                  return (
                    <button
                      key={a.n}
                      type="button"
                      onClick={() => setSelectedN(a.n)}
                      aria-pressed={active}
                      title={a.name}
                      className={
                        "relative flex h-[84px] w-[84px] flex-col justify-between rounded-lg p-2 text-left transition " +
                        meta.tile +
                        (active ? " ring-2 ring-gray-900 ring-offset-2" : "")
                      }
                    >
                      <span className="absolute right-1.5 top-1 text-[9px] font-semibold opacity-70">
                        {a.n}
                      </span>
                      <span className="text-[19px] font-bold leading-none" style={{ fontFamily: "var(--font-display)" }}>
                        {a.sym}
                      </span>
                      <span className="text-[9.5px] font-medium leading-tight opacity-95 line-clamp-2">
                        {a.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* DESKTOP STICKY DETAIL */}
        <aside className="hidden lg:block">
          <div className="sticky top-6">{renderDetail()}</div>
        </aside>
      </div>

      {/* FOOTER NOTE */}
      <div className="mt-12 rounded-xl border border-gray-200 bg-gray-50 p-5">
        <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
          How to read this
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-gray-700">
          The map gives a category-level view. For <strong>stocks, ETFs and REITs</strong>,
          the real answer depends on the specific company&apos;s numbers under your
          chosen scholar — that&apos;s what HalalGauge&apos;s live screen is for.
          For structured products (sukuk, takaful, funds), permissibility hinges on
          how the specific product is built.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/screen"
            className="inline-flex items-center gap-1.5 rounded-md bg-navy-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-700"
          >
            <ScanSearch size={15} /> Screen a stock
          </Link>
          <Link
            href="/methodology"
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:text-gray-900"
          >
            How verdicts are computed <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
