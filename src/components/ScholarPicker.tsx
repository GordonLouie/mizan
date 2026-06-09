"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SCHOLAR_PROFILES } from "@/lib/scholars";
import type { ScholarProfile } from "@/lib/types";
import { ChevronDown, Settings, Check } from "lucide-react";

interface Props {
  value: string;
  onChange: (id: string) => void;
  /** When true, default to expanded card-grid (used in onboarding flows). */
  expanded?: boolean;
}

/**
 * ScholarPicker — compact trigger pill + overlay dropdown panel.
 *
 * The compact mode is designed to sit inline beside other controls (e.g.
 * the search bar on /screen). The expanded panel renders ABSOLUTELY so it
 * can be wider than the trigger button's parent column — solves the
 * previous bug where putting the picker in a narrow column squeezed every
 * card into a vertical sliver.
 *
 * UX:
 *   - Trigger pill matches input-bar height; reads "Scholar · AAOIFI ▾"
 *   - Click opens an absolute panel with the 5 scholar cards in a clean grid
 *   - Click outside or Escape closes it
 *   - On mobile, the panel pins to the left edge with viewport-width
 */
export default function ScholarPicker({ value, onChange, expanded }: Props) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const current = SCHOLAR_PROFILES.find((p) => p.id === value) ?? SCHOLAR_PROFILES[0];

  // Persist scholar choice across sessions.
  useEffect(() => {
    try { localStorage.setItem("mizan.scholarId", value); } catch {}
  }, [value]);

  // Close on outside click + Escape.
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // ─── Compact mode (default) ──────────────────────────────────────────────
  if (!expanded) {
    return (
      <div ref={wrapperRef} className="relative">
        {/* Trigger pill — matches input-bar height (~44px). */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-haspopup="listbox"
          className={
            "flex h-[44px] w-full items-center justify-between gap-3 rounded-md border bg-white px-3.5 text-left transition " +
            (open
              ? "border-navy-700 ring-2 ring-navy-100"
              : "border-gray-200 hover:border-gray-300")
          }
        >
          <span className="flex min-w-0 items-baseline gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
              Scholar
            </span>
            <span className="truncate text-[14px] font-semibold text-gray-900">
              {current.short}
            </span>
          </span>
          <ChevronDown
            size={14}
            className={
              "shrink-0 text-gray-400 transition-transform " +
              (open ? "rotate-180" : "")
            }
          />
        </button>

        {/* Overlay panel — absolutely positioned, escapes parent width. */}
        {open && (
          <div
            role="listbox"
            className="absolute left-0 right-auto top-full z-40 mt-2 w-[min(680px,calc(100vw-2rem))] origin-top-left rounded-xl border border-gray-200 bg-white p-4 shadow-[0_12px_40px_rgba(28,69,55,0.10)]"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                Choose your scholar
              </div>
              <Link
                href="/learn"
                onClick={() => setOpen(false)}
                className="text-[11px] font-medium text-navy-700 hover:text-navy-900"
              >
                Not sure? 60-second primer →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {SCHOLAR_PROFILES.map((p: ScholarProfile) => {
                const selected = p.id === value;

                // Custom card navigates to /custom (Miqdad bug fix retained).
                if (p.id === "custom") {
                  return (
                    <Link
                      key={p.id}
                      href="/custom"
                      onClick={() => { onChange(p.id); setOpen(false); }}
                      className={
                        "group flex h-full flex-col rounded-lg border p-3 text-left transition " +
                        (selected
                          ? "border-navy-700 bg-navy-50/40"
                          : "border-gray-200 bg-white hover:border-navy-300 hover:bg-gray-50")
                      }
                    >
                      <div className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-900">
                        <Settings size={11} className="text-gold-600" />
                        {p.short}
                      </div>
                      <div className="mt-0.5 text-[10.5px] uppercase tracking-[0.12em] text-gray-500">
                        Build your own
                      </div>
                      <div className="mt-2 line-clamp-3 text-[12px] leading-relaxed text-gray-600">
                        {p.blurb}
                      </div>
                    </Link>
                  );
                }

                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => { onChange(p.id); setOpen(false); }}
                    role="option"
                    aria-selected={selected}
                    className={
                      "group flex h-full flex-col rounded-lg border p-3 text-left transition " +
                      (selected
                        ? "border-navy-700 bg-navy-50/40"
                        : "border-gray-200 bg-white hover:border-navy-300 hover:bg-gray-50")
                    }
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-[13px] font-semibold text-gray-900">
                        {p.short}
                      </div>
                      {selected && (
                        <Check size={12} className="shrink-0 text-navy-700" />
                      )}
                    </div>
                    <div className="mt-0.5 text-[10.5px] uppercase tracking-[0.12em] text-gray-500">
                      {p.label}
                    </div>
                    <div className="mt-2 line-clamp-3 text-[12px] leading-relaxed text-gray-600">
                      {p.blurb}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── Expanded card-grid mode (onboarding / custom builder) ──────────────
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
