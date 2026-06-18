"use client";

/**
 * /indexes/build (v3) — construct your own halal BASKET: pick a standard, a theme,
 * and a size; get the screened holdings + present-tense analytics (yield, debt,
 * dividends to purify, drift watch) and an export. NO backtest — a screened-universe
 * backtest is biased, so we describe what the basket IS, not a fabricated history.
 * Gated (Pro). The institutional version of this is licensable.
 */
import { useState } from "react";
import Link from "next/link";
import { Loader2, Sparkles } from "lucide-react";
import { SCHOLAR_PROFILES } from "@/lib/scholars";
import LockedFeature from "@/components/LockedFeature";
import IndexesTabs from "@/components/IndexesTabs";
import BasketExport from "@/components/BasketExport";

interface Constituent { ticker: string; name: string; sector: string; marketCapUsd: number }
interface Analytics {
  count: number;
  weightedDivYieldPct: number;
  medianDebtPct: number;
  purificationPctOfDividends: number;
  sectorMix: { sector: string; pct: number }[];
  atRisk: { ticker: string; name: string; note: string }[];
}
interface Result {
  name: string; scholarLabel: string; themeLabel: string; size: number;
  analytics: Analytics;
  constituents: Constituent[];
}

const THEMES = [
  { v: "any", l: "All sectors" }, { v: "technology", l: "Technology" }, { v: "healthcare", l: "Healthcare" },
  { v: "energy", l: "Energy" }, { v: "consumer", l: "Consumer" }, { v: "dividend", l: "Dividend payers" },
];
const SIZES = [10, 25, 50];

function fmtCap(n: number) {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(1)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  return `$${n.toFixed(0)}`;
}

function Builder() {
  const scholars = SCHOLAR_PROFILES.filter((p) => p.id !== "custom");
  const [scholarId, setScholarId] = useState("aaoifi");
  const [theme, setTheme] = useState("any");
  const [size, setSize] = useState(25);
  const [res, setRes] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function build() {
    setLoading(true); setError(null);
    try {
      const r = await fetch("/api/indexes/custom", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ scholarId, theme, size }),
      });
      if (r.status === 402) { setError("The basket builder is a Pro feature. Upgrade at /pricing."); return; }
      if (r.status === 429) { setError("You've hit today's build limit — please try again tomorrow."); return; }
      if (!r.ok) { setError("Couldn't build that basket. Try different settings."); return; }
      const d = (await r.json()) as Result;
      if (!d.constituents?.length) { setError("No companies match those settings — try a broader theme or standard."); return; }
      setRes(d);
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  }

  const sel = "rounded-md border border-gray-200 bg-white px-3 py-2 text-[14px] text-gray-800 focus:border-navy-700 focus:outline-none";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
      {/* form */}
      <div className="grid gap-3 sm:grid-cols-4">
        <label className="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
          Standard
          <select value={scholarId} onChange={(e) => setScholarId(e.target.value)} className={sel}>
            {scholars.map((p) => <option key={p.id} value={p.id}>{p.short}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
          Theme
          <select value={theme} onChange={(e) => setTheme(e.target.value)} className={sel}>
            {THEMES.map((t) => <option key={t.v} value={t.v}>{t.l}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
          Size
          <select value={size} onChange={(e) => setSize(Number(e.target.value))} className={sel}>
            {SIZES.map((n) => <option key={n} value={n}>{n} holdings</option>)}
          </select>
        </label>
        <button type="button" onClick={build} disabled={loading}
          className="mt-auto inline-flex items-center justify-center gap-2 rounded-md bg-navy-800 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-navy-700 disabled:opacity-60">
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} Build basket
        </button>
      </div>
      {error && <p className="mt-3 text-[13px] text-amber-700">{error}</p>}

      {/* results */}
      {res && (
        <div className="mt-6 border-t border-gray-100 pt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-[13px] text-gray-600">
              <span className="font-semibold text-gray-900">{res.themeLabel}</span> · {res.scholarLabel} · {res.constituents.length} holdings
            </div>
            <BasketExport name={`custom-${res.themeLabel}`} holdings={res.constituents.map((c) => ({ ticker: c.ticker, name: c.name, sector: c.sector }))} />
          </div>

          {/* present-tense analytics */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { l: "Holdings", v: String(res.analytics.count) },
              { l: "Wtd. div. yield", v: `${res.analytics.weightedDivYieldPct.toFixed(1)}%` },
              { l: "Median debt/cap", v: `${res.analytics.medianDebtPct.toFixed(0)}%` },
              { l: "Div. to purify", v: `~${res.analytics.purificationPctOfDividends.toFixed(1)}%` },
            ].map((s) => (
              <div key={s.l} className="rounded-lg border border-gray-100 bg-gray-50/60 p-2.5 text-center">
                <div className="text-[15px] font-bold text-navy-800" style={{ fontFamily: "var(--font-display)" }}>{s.v}</div>
                <div className="mt-0.5 text-[10px] uppercase tracking-wide text-gray-500">{s.l}</div>
              </div>
            ))}
          </div>

          {/* drift watch */}
          {res.analytics.atRisk.length > 0 && (
            <div className="mt-4 rounded-lg border border-amber-200/70 bg-amber-50/40 p-3">
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-700">Drift watch</div>
              <ul className="mt-1.5 space-y-1 text-[12px] text-gray-700">
                {res.analytics.atRisk.map((f) => (
                  <li key={f.ticker}><span className="font-semibold">{f.ticker}</span> — {f.note}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-5">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Holdings (equal-weight)</div>
            <div className="mt-2 overflow-hidden rounded-lg border border-gray-100">
              <ul>
                {res.constituents.map((c) => (
                  <li key={c.ticker} className="flex items-center justify-between gap-3 border-b border-gray-100 px-3 py-2 text-[13px] last:border-0">
                    <Link href={`/halal/${encodeURIComponent(c.ticker)}`} className="min-w-0 truncate">
                      <span className="font-semibold text-gray-900">{c.ticker}</span> <span className="text-gray-500">{c.name}</span>
                    </Link>
                    <span className="shrink-0 font-mono text-[12px] text-gray-500">{fmtCap(c.marketCapUsd)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-4 text-[11px] leading-relaxed text-gray-400">
            A screened list, not an investable fund or advice — described by current characteristics, with no
            backtest (a screened-universe backtest is biased). Institutions can license a production, maintained,
            drift-monitored version — <Link href="/institutions" className="font-semibold text-navy-700">see institutional</Link>.
          </p>
        </div>
      )}
    </div>
  );
}

export default function BuildIndexPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">Build your own</div>
      <h1 className="mt-2 text-[30px] font-bold leading-tight text-gray-900 sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>
        Construct a halal basket
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-gray-700">
        Pick a scholarly standard, a theme, and a size — get a screened basket with its current
        characteristics, the dividend slice to purify, a drift watch, and an export you can take to your broker.
      </p>
      <div className="mt-8"><IndexesTabs /></div>
      <div>
        <LockedFeature feature="indexes" label="Custom basket builder">
          <Builder />
        </LockedFeature>
      </div>
    </main>
  );
}
