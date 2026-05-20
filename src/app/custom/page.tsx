"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { listStocks, findStock } from "@/lib/data";
import { SCHOLAR_PROFILES } from "@/lib/scholars";
import { screenStock } from "@/lib/screen";
import type { ScholarProfile, ProhibitedSector } from "@/lib/types";
import ComplianceCard from "@/components/ComplianceCard";
import { Save, RotateCcw, Wand2 } from "lucide-react";

const ALL_SECTORS: { id: ProhibitedSector; label: string }[] = [
  { id: "alcohol", label: "Alcohol" },
  { id: "gambling", label: "Gambling" },
  { id: "tobacco", label: "Tobacco" },
  { id: "conventional_finance", label: "Conventional finance / insurance" },
  { id: "weapons", label: "Weapons / defense" },
  { id: "pork", label: "Pork" },
  { id: "adult_entertainment", label: "Adult entertainment" },
  { id: "non_halal_food", label: "Non-halal food" },
];

const PRESETS: { id: string; label: string }[] = [
  { id: "aaoifi", label: "AAOIFI preset" },
  { id: "taqi_usmani", label: "Mufti Taqi preset" },
  { id: "djim", label: "DJIM preset" },
  { id: "jafari", label: "Ja'fari preset" },
  { id: "strict", label: "Strict preset" },
];

interface SavedProfile {
  excludedSectors: ProhibitedSector[];
  maxImpermissibleIncomePct: number;
  maxDebtToMarketCapPct: number;
  maxCashSecuritiesToMarketCapPct: number;
  maxReceivablesToMarketCapPct: number | null;
  minIlliquidAssetsToTotalAssetsPct: number | null;
  purificationScope: "dividends" | "dividends_and_gains";
}

const DEFAULT: SavedProfile = {
  excludedSectors: ["alcohol", "gambling", "tobacco", "conventional_finance", "weapons", "pork", "adult_entertainment", "non_halal_food"],
  maxImpermissibleIncomePct: 5,
  maxDebtToMarketCapPct: 30,
  maxCashSecuritiesToMarketCapPct: 30,
  maxReceivablesToMarketCapPct: null,
  minIlliquidAssetsToTotalAssetsPct: null,
  purificationScope: "dividends",
};

const STORAGE_KEY = "mizan.customProfile";

export default function CustomProfilePage() {
  return (
    <Suspense fallback={<div className="text-sm text-gray-500">Loading…</div>}>
      <CustomInner />
    </Suspense>
  );
}

function CustomInner() {
  const params = useSearchParams();
  const [profile, setProfile] = useState<SavedProfile>(DEFAULT);
  const [previewTicker, setPreviewTicker] = useState("AMZN");
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProfile(JSON.parse(raw));
      const ticker = params.get("ticker");
      if (ticker) setPreviewTicker(ticker.toUpperCase());
    } catch {}
  }, [params]);

  const customScholar: ScholarProfile = useMemo(
    () => ({
      id: "custom",
      label: "Your custom profile",
      short: "Custom",
      blurb: "Your saved thresholds.",
      custom: true,
      ...profile,
    }),
    [profile],
  );

  const stock = findStock(previewTicker);
  const result = stock ? screenStock(stock, customScholar) : null;

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      const now = new Date().toLocaleTimeString();
      setSavedAt(now);
      setTimeout(() => setSavedAt(null), 4000);
    } catch {}
  }

  function reset() {
    setProfile(DEFAULT);
  }

  function loadPreset(id: string) {
    const src = SCHOLAR_PROFILES.find((p) => p.id === id);
    if (!src) return;
    setProfile({
      excludedSectors: [...src.excludedSectors],
      maxImpermissibleIncomePct: src.maxImpermissibleIncomePct,
      maxDebtToMarketCapPct: src.maxDebtToMarketCapPct,
      maxCashSecuritiesToMarketCapPct: src.maxCashSecuritiesToMarketCapPct,
      maxReceivablesToMarketCapPct: src.maxReceivablesToMarketCapPct,
      minIlliquidAssetsToTotalAssetsPct: src.minIlliquidAssetsToTotalAssetsPct,
      purificationScope: src.purificationScope,
    });
  }

  function toggleSector(s: ProhibitedSector) {
    setProfile((p) => ({
      ...p,
      excludedSectors: p.excludedSectors.includes(s)
        ? p.excludedSectors.filter((x) => x !== s)
        : [...p.excludedSectors, s],
    }));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Build your custom scholar profile</h1>
        <p className="mt-1 max-w-2xl text-sm text-gray-600">
          Set your own thresholds for every screening criterion. Saved to your
          browser. Once saved, select &quot;Custom&quot; on the Screener page to use
          this profile for any stock.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-wide text-gray-500">Start from a preset:</span>
        {PRESETS.map((p) => (
          <button key={p.id} type="button" onClick={() => loadPreset(p.id)} className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 hover:border-navy-300 hover:bg-gray-50">
            <Wand2 size={11} className="mr-1 inline" />{p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Editor */}
        <div className="space-y-5 rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-base font-semibold text-gray-900">Thresholds</h2>

          <Slider
            label="Max impermissible income / revenue"
            value={profile.maxImpermissibleIncomePct}
            min={0} max={10} step={0.5}
            unit="%"
            onChange={(v) => setProfile((p) => ({ ...p, maxImpermissibleIncomePct: v }))}
          />
          <Slider
            label="Max interest-bearing debt / market cap"
            value={profile.maxDebtToMarketCapPct}
            min={0} max={50} step={1}
            unit="%"
            onChange={(v) => setProfile((p) => ({ ...p, maxDebtToMarketCapPct: v }))}
          />
          <Slider
            label="Max cash + interest-bearing securities / market cap"
            value={profile.maxCashSecuritiesToMarketCapPct}
            min={0} max={50} step={1}
            unit="%"
            onChange={(v) => setProfile((p) => ({ ...p, maxCashSecuritiesToMarketCapPct: v }))}
          />
          <OptionalSlider
            label="Max receivables / market cap (set null if not screened)"
            value={profile.maxReceivablesToMarketCapPct}
            min={0} max={50} step={1}
            unit="%"
            onChange={(v) => setProfile((p) => ({ ...p, maxReceivablesToMarketCapPct: v }))}
          />
          <OptionalSlider
            label="Min illiquid assets / total assets (Mufti Taqi)"
            value={profile.minIlliquidAssetsToTotalAssetsPct}
            min={0} max={50} step={1}
            unit="%"
            onChange={(v) => setProfile((p) => ({ ...p, minIlliquidAssetsToTotalAssetsPct: v }))}
          />

          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Purification scope</div>
            <div className="mt-2 flex gap-2">
              {(["dividends", "dividends_and_gains"] as const).map((s) => (
                <button key={s} type="button" onClick={() => setProfile((p) => ({ ...p, purificationScope: s }))}
                  className={"rounded-md border px-3 py-1.5 text-xs " + (profile.purificationScope === s ? "border-navy-700 bg-navy-50 text-navy-800" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50")}>
                  {s === "dividends" ? "Dividends only" : "Dividends + capital gains"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Excluded sectors</div>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {ALL_SECTORS.map((s) => {
                const on = profile.excludedSectors.includes(s.id);
                return (
                  <button key={s.id} type="button" onClick={() => toggleSector(s.id)}
                    className={"rounded-md border px-2 py-1.5 text-left text-xs " + (on ? "border-navy-700 bg-navy-50 text-navy-800" : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50")}>
                    <span className="font-mono mr-1">{on ? "✓" : "·"}</span>{s.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 border-t border-gray-100 pt-4">
            <button type="button" onClick={save} className="inline-flex items-center gap-1.5 rounded-md bg-navy-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-navy-700">
              <Save size={14} /> Save profile
            </button>
            <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
              <RotateCcw size={14} /> Reset to defaults
            </button>
            {savedAt && <span className="text-xs text-emerald-700">Saved at {savedAt}</span>}
          </div>
        </div>

        {/* Live preview */}
        <div className="space-y-3">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <label className="block text-xs font-medium uppercase tracking-wide text-gray-500">Live preview against</label>
            <select value={previewTicker} onChange={(e) => setPreviewTicker(e.target.value)} className="mt-1 w-full rounded-md border border-gray-200 bg-gray-50 px-2 py-1.5 text-sm focus:border-navy-400 focus:bg-white">
              {listStocks().slice(0, 50).map((s) => (
                <option key={s.ticker} value={s.ticker}>{s.ticker} — {s.name}</option>
              ))}
            </select>
          </div>
          {stock && result && <ComplianceCard stock={stock} result={result} />}
        </div>
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, step, unit, onChange }: {
  label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="text-sm text-gray-700">{label}</label>
        <span className="font-mono text-sm font-semibold text-navy-700">{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="mt-1 w-full" />
    </div>
  );
}

function OptionalSlider({ label, value, min, max, step, unit, onChange }: {
  label: string; value: number | null; min: number; max: number; step: number; unit: string; onChange: (v: number | null) => void;
}) {
  const [enabled, setEnabled] = useState(value !== null);
  useEffect(() => setEnabled(value !== null), [value]);

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={enabled} onChange={(e) => {
            const on = e.target.checked;
            setEnabled(on);
            onChange(on ? (value ?? Math.round((min + max) / 4)) : null);
          }} />
          {label}
        </label>
        {enabled && <span className="font-mono text-sm font-semibold text-navy-700">{value}{unit}</span>}
      </div>
      {enabled && value !== null && (
        <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="mt-1 w-full" />
      )}
    </div>
  );
}
