"use client";

/**
 * /indexes/build (v2) — construct your own halal index: pick a standard, a theme,
 * and a size; get a live backtest + risk/reward vs the S&P. Chong's "constructing
 * halal indexes." Gated (Pro). The institutional version of this is licensable.
 */
import { useState } from "react";
import Link from "next/link";
import { Loader2, Sparkles } from "lucide-react";
import { SCHOLAR_PROFILES } from "@/lib/scholars";
import LockedFeature from "@/components/LockedFeature";
import IndexPerfChart from "@/components/IndexPerfChart";
import IndexesTabs from "@/components/IndexesTabs";

interface Stats { annReturnPct: number; annVolPct: number; sharpe: number | null; maxDrawdownPct: number; beta: number | null }
interface Result {
  name: string; scholarLabel: string; themeLabel: string; size: number;
  totalReturn: number | null; stats: Stats | null;
  indexPct: number[]; spyPct: number[] | null; spusPct: number[] | null;
  spy: { totalReturnPct: number | null; stats: Stats | null };
  constituents: { ticker: string; name: string; sector: string; marketCapUsd: number }[];
  excluded: number;
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
const pct = (n: number | null, s = false) => (n == null ? "—" : `${s && n >= 0 ? "+" : ""}${n.toFixed(1)}%`);

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
      if (r.status === 402) { setError("The custom index builder is a Pro feature. Upgrade at /pricing."); return; }
      if (r.status === 429) { setError("You've hit today's build limit — please try again tomorrow."); return; }
      if (!r.ok) { setError("Couldn't build that index. Try different settings."); return; }
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
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} Build index
        </button>
      </div>
      {error && <p className="mt-3 text-[13px] text-amber-700">{error}</p>}

      {/* results */}
      {res && (
        <div className="mt-6 border-t border-gray-100 pt-5">
          <div className="text-[13px] text-gray-600">
            <span className="font-semibold text-gray-900">{res.themeLabel}</span> · {res.scholarLabel} · {res.constituents.length} holdings
            {res.excluded > 0 && <span className="text-gray-400"> ({res.excluded} excluded for data)</span>}
          </div>

          {res.stats && (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {[
                { l: "Return p.a.", v: pct(res.stats.annReturnPct, true) },
                { l: "Volatility", v: pct(res.stats.annVolPct) },
                { l: "Sharpe", v: res.stats.sharpe?.toFixed(2) ?? "—" },
                { l: "Max DD", v: pct(res.stats.maxDrawdownPct) },
                { l: "Beta", v: res.stats.beta?.toFixed(2) ?? "—" },
              ].map((s) => (
                <div key={s.l} className="rounded-lg border border-gray-100 bg-gray-50/60 p-2.5 text-center">
                  <div className="text-[15px] font-bold text-navy-800" style={{ fontFamily: "var(--font-display)" }}>{s.v}</div>
                  <div className="mt-0.5 text-[10px] uppercase tracking-wide text-gray-500">{s.l}</div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-5 rounded-lg border border-gray-100 p-4">
            <IndexPerfChart name="Your index" indexPct={res.indexPct} spyPct={res.spyPct} spusPct={res.spusPct} />
          </div>
          <p className="mt-2 text-[12px] text-gray-500">
            Your index {pct(res.totalReturn, true)} vs S&amp;P {pct(res.spy.totalReturnPct, true)} (total). Equal-weight,
            point-in-time selection; Sharpe assumes 0% risk-free rate.
          </p>

          <div className="mt-5">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Constituents</div>
            <div className="mt-2 overflow-hidden rounded-lg border border-gray-100">
              <ul>
                {res.constituents.map((c) => (
                  <li key={c.ticker} className="flex items-center justify-between gap-3 border-b border-gray-100 px-3 py-2 text-[13px] last:border-0">
                    <Link href={`/screen?ticker=${c.ticker}`} className="min-w-0 truncate">
                      <span className="font-semibold text-gray-900">{c.ticker}</span> <span className="text-gray-500">{c.name}</span>
                    </Link>
                    <span className="shrink-0 font-mono text-[12px] text-gray-500">{fmtCap(c.marketCapUsd)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-4 text-[11px] leading-relaxed text-gray-400">
            Illustrative screened basket — not an investable fund or advice. Institutions can license a
            production, maintained version — <Link href="/institutions" className="font-semibold text-navy-700">see institutional</Link>.
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
        Construct a halal index
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-gray-700">
        Pick a scholarly standard, a theme, and a size — get a real, point-in-time backtest with
        risk/reward versus the S&amp;P 500. Choose your own growth-vs-risk profile.
      </p>
      <div className="mt-8"><IndexesTabs /></div>
      <div>
        <LockedFeature feature="indexes" label="Custom index builder">
          <Builder />
        </LockedFeature>
      </div>
    </main>
  );
}
