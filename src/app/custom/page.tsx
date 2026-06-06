"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { listStocks, findStock } from "@/lib/data";
import { SCHOLAR_PROFILES } from "@/lib/scholars";
import { screenStock } from "@/lib/screen";
import type { ScholarProfile, ProhibitedSector } from "@/lib/types";
import ComplianceCard from "@/components/ComplianceCard";
import { SelectField } from "@/components/ui";
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
  { id: "aaoifi", label: "AAOIFI" },
  { id: "taqi_usmani", label: "Mufti Taqi" },
  { id: "djim", label: "DJIM" },
  { id: "jafari", label: "Ja'fari" },
  { id: "strict", label: "Strict" },
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
  excludedSectors: [
    "alcohol", "gambling", "tobacco", "conventional_finance",
    "weapons", "pork", "adult_entertainment", "non_halal_food",
  ],
  maxImpermissibleIncomePct: 5,
  maxDebtToMarketCapPct: 30,
  maxCashSecuritiesToMarketCapPct: 30,
  maxReceivablesToMarketCapPct: null,
  minIlliquidAssetsToTotalAssetsPct: null,
  purificationScope: "dividends",
};

const STORAGE_KEY = "mizan.customProfile";

// Scholar tick-mark builder — for each numeric threshold key, returns the
// established scholar positions so the slider can render them as notches.
// Per Miqdad: "make it feel like hotel booking — I want to see where the
// reference points are, not just the slider." Visual context on each track.
type NumericKey =
  | "maxImpermissibleIncomePct"
  | "maxDebtToMarketCapPct"
  | "maxCashSecuritiesToMarketCapPct"
  | "maxReceivablesToMarketCapPct"
  | "minIlliquidAssetsToTotalAssetsPct";

function scholarTicks(key: NumericKey): { label: string; value: number }[] {
  return SCHOLAR_PROFILES.filter((p) => p.id !== "custom")
    .map((p) => ({ label: p.short, value: (p as unknown as Record<string, number | null>)[key] }))
    .filter((t): t is { label: string; value: number } => typeof t.value === "number");
}

export default function CustomProfilePage() {
  return (
    <Suspense fallback={<div className="py-8 text-sm text-gray-500">Loading…</div>}>
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
      sourceLabel: "Custom thresholds — user-defined (you set these)",
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
    <div className="pb-20">
      {/* PAGE HEADER */}
      <header className="pt-6">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Advanced
        </div>
        <h1
          className="mt-3 text-[36px] font-bold leading-[1.1] text-gray-900 sm:text-[44px]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Build your custom scholar profile
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-gray-600">
          Set your own thresholds for every screening criterion. Saved to your browser.
          Once saved, select &lsquo;Custom&rsquo; on the Screener page to use this profile
          for any stock.
        </p>
      </header>

      {/* PRESETS */}
      <div className="mt-8 flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
          Start from a preset:
        </span>
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => loadPreset(p.id)}
            className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-medium text-gray-700 transition hover:border-navy-300 hover:text-navy-800"
          >
            <Wand2 size={11} />
            {p.label}
          </button>
        ))}
      </div>

      {/* EDITOR + PREVIEW */}
      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Editor */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
            Thresholds
          </div>
          <h2
            className="mt-2 text-[18px] font-bold text-gray-900"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Your screening rules
          </h2>

          <div className="mt-6 space-y-7">
            <Slider
              label="Max impermissible income / revenue"
              value={profile.maxImpermissibleIncomePct}
              min={0}
              max={10}
              step={0.5}
              unit="%"
              ticks={scholarTicks("maxImpermissibleIncomePct")}
              onChange={(v) => setProfile((p) => ({ ...p, maxImpermissibleIncomePct: v }))}
            />
            <Slider
              label="Max interest-bearing debt / market cap"
              value={profile.maxDebtToMarketCapPct}
              min={0}
              max={50}
              step={1}
              unit="%"
              ticks={scholarTicks("maxDebtToMarketCapPct")}
              onChange={(v) => setProfile((p) => ({ ...p, maxDebtToMarketCapPct: v }))}
            />
            <Slider
              label="Max cash + securities / market cap"
              value={profile.maxCashSecuritiesToMarketCapPct}
              min={0}
              max={50}
              step={1}
              unit="%"
              ticks={scholarTicks("maxCashSecuritiesToMarketCapPct")}
              onChange={(v) =>
                setProfile((p) => ({ ...p, maxCashSecuritiesToMarketCapPct: v }))
              }
            />
            <OptionalSlider
              label="Max receivables / market cap"
              value={profile.maxReceivablesToMarketCapPct}
              min={0}
              max={50}
              step={1}
              unit="%"
              ticks={scholarTicks("maxReceivablesToMarketCapPct")}
              onChange={(v) =>
                setProfile((p) => ({ ...p, maxReceivablesToMarketCapPct: v }))
              }
            />
            <OptionalSlider
              label="Min illiquid assets / total assets (Mufti Taqi)"
              value={profile.minIlliquidAssetsToTotalAssetsPct}
              min={0}
              max={50}
              step={1}
              unit="%"
              ticks={scholarTicks("minIlliquidAssetsToTotalAssetsPct")}
              onChange={(v) =>
                setProfile((p) => ({ ...p, minIlliquidAssetsToTotalAssetsPct: v }))
              }
            />
          </div>

          <div className="mt-6 border-t border-gray-100 pt-5">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
              Purification scope
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(["dividends", "dividends_and_gains"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setProfile((p) => ({ ...p, purificationScope: s }))}
                  className={
                    "rounded-md border px-3 py-1.5 text-[12px] font-medium transition " +
                    (profile.purificationScope === s
                      ? "border-navy-700 bg-navy-50 text-navy-800"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-400")
                  }
                >
                  {s === "dividends" ? "Dividends only" : "Dividends + capital gains"}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-5">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
              Excluded sectors
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {ALL_SECTORS.map((s) => {
                const on = profile.excludedSectors.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleSector(s.id)}
                    className={
                      "rounded-md border px-3 py-1.5 text-left text-[12px] transition " +
                      (on
                        ? "border-navy-700 bg-navy-50 text-navy-800"
                        : "border-gray-200 bg-white text-gray-500 hover:border-gray-400")
                    }
                  >
                    <span className="mr-2 font-mono">{on ? "✓" : "·"}</span>
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-5">
            <button
              type="button"
              onClick={save}
              className="inline-flex items-center gap-1.5 rounded-md bg-navy-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-700"
            >
              <Save size={14} /> Save profile
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:text-gray-900"
            >
              <RotateCcw size={14} /> Reset to defaults
            </button>
            {savedAt && (
              <span className="text-[11px] font-medium text-emerald-700">
                Saved at {savedAt}
              </span>
            )}
          </div>
        </div>

        {/* Live preview */}
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <SelectField
              label="Live preview against"
              value={previewTicker}
              onChange={(e) => setPreviewTicker(e.target.value)}
              options={listStocks()
                .slice(0, 50)
                .map((s) => ({ value: s.ticker, label: `${s.ticker} — ${s.name}` }))}
            />
          </div>
          {stock && result && <ComplianceCard stock={stock} result={result} />}
        </div>
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  ticks,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  ticks?: { label: string; value: number }[];
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="text-[13px] text-gray-700">{label}</label>
        <span className="font-mono text-[13px] font-semibold text-navy-700 tabular-nums">
          {value}
          {unit}
        </span>
      </div>
      <ScholarTicks ticks={ticks} min={min} max={max} active={value} />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="mt-1 w-full accent-navy-700"
      />
    </div>
  );
}

function OptionalSlider({
  label,
  value,
  min,
  max,
  step,
  unit,
  ticks,
  onChange,
}: {
  label: string;
  value: number | null;
  min: number;
  max: number;
  step: number;
  unit: string;
  ticks?: { label: string; value: number }[];
  onChange: (v: number | null) => void;
}) {
  const [enabled, setEnabled] = useState(value !== null);
  useEffect(() => setEnabled(value !== null), [value]);

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="flex items-center gap-2 text-[13px] text-gray-700">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => {
              const on = e.target.checked;
              setEnabled(on);
              onChange(on ? (value ?? Math.round((min + max) / 4)) : null);
            }}
            className="accent-navy-700"
          />
          {label}
        </label>
        {enabled && (
          <span className="font-mono text-[13px] font-semibold text-navy-700 tabular-nums">
            {value}
            {unit}
          </span>
        )}
      </div>
      {enabled && value !== null && (
        <>
          <ScholarTicks ticks={ticks} min={min} max={max} active={value} />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="mt-1 w-full accent-navy-700"
          />
        </>
      )}
    </div>
  );
}

/**
 * Tiny tick-mark row above slider track showing each established scholar's
 * threshold. Labels stack underneath when there's room; otherwise just notches.
 */
function ScholarTicks({
  ticks,
  min,
  max,
  active,
}: {
  ticks?: { label: string; value: number }[];
  min: number;
  max: number;
  active: number;
}) {
  if (!ticks || ticks.length === 0) return null;
  const range = max - min || 1;

  // Group ticks that share the same value so we can show "AAOIFI · Strict"
  const grouped: { value: number; labels: string[] }[] = [];
  for (const t of ticks) {
    const exist = grouped.find((g) => g.value === t.value);
    if (exist) exist.labels.push(t.label);
    else grouped.push({ value: t.value, labels: [t.label] });
  }

  return (
    <div className="relative mt-3 h-6">
      {grouped.map((g) => {
        const leftPct = ((g.value - min) / range) * 100;
        const matchesActive = Math.abs(g.value - active) < 0.001;
        return (
          <div
            key={g.value}
            className="absolute top-0 -translate-x-1/2 text-center"
            style={{ left: `${leftPct}%` }}
            title={`${g.labels.join(", ")} — ${g.value}%`}
          >
            <div
              className={
                "mx-auto h-2 w-px " +
                (matchesActive ? "bg-navy-700" : "bg-gray-300")
              }
            />
            <div
              className={
                "mt-0.5 whitespace-nowrap text-[9px] font-medium tracking-wide " +
                (matchesActive ? "text-navy-700" : "text-gray-400")
              }
            >
              {g.labels.join(" · ")}
            </div>
          </div>
        );
      })}
    </div>
  );
}
