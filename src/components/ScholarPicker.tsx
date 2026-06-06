"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SCHOLAR_PROFILES } from "@/lib/scholars";
import type { ScholarProfile } from "@/lib/types";
import { ChevronDown, Settings } from "lucide-react";

interface Props {
  value: string;
  onChange: (id: string) => void;
  /** When true, default to expanded card-grid (used in onboarding flows). */
  expanded?: boolean;
}

export default function ScholarPicker({ value, onChange, expanded }: Props) {
  const [open, setOpen] = useState(false);
  const current = SCHOLAR_PROFILES.find((p) => p.id === value) ?? SCHOLAR_PROFILES[0];

  useEffect(() => {
    try { localStorage.setItem("mizan.scholarId", value); } catch {}
  }, [value]);

  // Compact version (default on screening pages)
  if (!expanded) {
    return (
      <div className="rounded-md border border-gray-200 bg-white">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between px-3 py-2 text-left"
          aria-expanded={open}
        >
          <span className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">Scholar</span>
            <span className="text-sm font-medium text-gray-900">{current.label}</span>
          </span>
          <ChevronDown size={14} className={"text-gray-500 " + (open ? "rotate-180 transition" : "transition")} />
        </button>

        {open && (
          <div className="border-t border-gray-100 px-3 py-3">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {SCHOLAR_PROFILES.map((p: ScholarProfile) => {
                const selected = p.id === value;
                // Custom card should navigate to /custom (Miqdad bug 2026-06-06:
                // clicking Custom card did nothing — only the small "Build your
                // own" link worked).
                if (p.id === "custom") {
                  return (
                    <Link
                      key={p.id}
                      href="/custom"
                      onClick={() => { onChange(p.id); setOpen(false); }}
                      className={
                        "block rounded-md border p-3 text-left transition " +
                        (selected
                          ? "border-navy-700 bg-navy-50"
                          : "border-gray-200 bg-white hover:border-gray-300")
                      }
                    >
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                        <Settings size={12} className="text-gold-600" />
                        {p.short}
                      </div>
                      <div className="mt-0.5 text-xs text-gray-500">{p.label}</div>
                      <div className="mt-1.5 text-xs text-gray-600">{p.blurb}</div>
                    </Link>
                  );
                }
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => { onChange(p.id); setOpen(false); }}
                    className={
                      "rounded-md border p-3 text-left transition " +
                      (selected
                        ? "border-navy-700 bg-navy-50"
                        : "border-gray-200 bg-white hover:border-gray-300")
                    }
                  >
                    <div className="text-sm font-semibold text-gray-900">{p.short}</div>
                    <div className="mt-0.5 text-xs text-gray-500">{p.label}</div>
                    <div className="mt-1.5 text-xs text-gray-600">{p.blurb}</div>
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
              <span className="text-gray-500">Don&apos;t see your scholar?</span>
              <Link href="/custom" className="inline-flex items-center gap-1 font-medium text-navy-700 hover:text-navy-900">
                <Settings size={12} /> Build your own
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Expanded card-grid version (used in onboarding / custom builder)
  return (
    <div>
      <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-500">
        Your scholar / standard
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {SCHOLAR_PROFILES.map((p: ScholarProfile) => {
          const selected = p.id === value;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onChange(p.id)}
              className={
                "rounded-lg border p-3 text-left transition " +
                (selected
                  ? "border-navy-700 bg-navy-50 ring-2 ring-navy-700"
                  : "border-gray-200 bg-white hover:border-gray-300")
              }
            >
              <div className="font-semibold text-gray-900">{p.short}</div>
              <div className="mt-0.5 text-xs text-gray-500">{p.label}</div>
              <div className="mt-2 text-xs text-gray-700">{p.blurb}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
