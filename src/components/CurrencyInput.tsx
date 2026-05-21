"use client";

import { useEffect, useState } from "react";

interface Props {
  value: number;
  onChange: (v: number) => void;
  prefix?: string;       // "$" by default
  suffix?: string;       // e.g., "g" for grams
  placeholder?: string;
  label?: string;
  hint?: string;
}

function formatNumber(n: number): string {
  if (!isFinite(n) || n === 0) return "";
  return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

function parseNumber(s: string): number {
  const cleaned = s.replace(/[^0-9.\-]/g, "");
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}

export default function CurrencyInput({ value, onChange, prefix = "$", suffix, placeholder, label, hint }: Props) {
  const [draft, setDraft] = useState<string>(formatNumber(value));
  const [focused, setFocused] = useState(false);

  // Sync display when external value changes (e.g., reset)
  useEffect(() => {
    if (!focused) setDraft(formatNumber(value));
  }, [value, focused]);

  return (
    <div>
      {label && (
        <label className="block text-[11px] font-semibold uppercase tracking-widest text-gray-500">
          {label}
        </label>
      )}
      <div className={"mt-1 flex items-center gap-2 rounded-md border bg-white px-3 py-2.5 transition " +
        (focused ? "border-navy-700 ring-2 ring-navy-700/10" : "border-gray-200 hover:border-gray-300")}>
        {prefix && <span className="text-base text-gray-400">{prefix}</span>}
        <input
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={draft}
          placeholder={placeholder ?? "0"}
          onChange={(e) => {
            setDraft(e.target.value);
            onChange(parseNumber(e.target.value));
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            setDraft(formatNumber(parseNumber(draft)));
          }}
          className="w-full bg-transparent text-base tabular-nums text-gray-900 outline-none placeholder:text-gray-400"
        />
        {suffix && <span className="text-sm text-gray-500">{suffix}</span>}
      </div>
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}
