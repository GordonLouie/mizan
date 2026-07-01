"use client";

/**
 * ProductExplorer — the interactive core of /income.
 *
 * A tabbed, tap-to-inspect explorer over the halal fixed-income & protection
 * products. Mirrors the tile + detail interaction of /assets, but tuned for a
 * smaller, deeper set: each product opens a plain-English panel covering what
 * it is, how the money moves, why it's permissible, and a "what to verify"
 * checklist (because the structure — not the name — decides the ruling).
 */

import { useMemo, useState } from "react";
import {
  ArrowLeftRight,
  CheckCircle2,
  Coins,
  ShieldCheck,
  Landmark,
  ClipboardCheck,
  type LucideIcon,
} from "lucide-react";
import { KIND_META, PRODUCTS, type Kind, type Product } from "./incomeData";

const KIND_ORDER: Kind[] = ["sukuk", "takaful", "deposit"];

const KIND_ICON: Record<Kind, LucideIcon> = {
  sukuk: Coins,
  takaful: ShieldCheck,
  deposit: Landmark,
};

export default function ProductExplorer() {
  const [kind, setKind] = useState<Kind>("sukuk");
  const [selectedId, setSelectedId] = useState<string>(PRODUCTS[0].id);

  const inKind = useMemo(() => PRODUCTS.filter((p) => p.kind === kind), [kind]);
  const selected: Product =
    PRODUCTS.find((p) => p.id === selectedId && p.kind === kind) ?? inKind[0];

  function pickKind(k: Kind) {
    setKind(k);
    const first = PRODUCTS.find((p) => p.kind === k);
    if (first) setSelectedId(first.id);
  }

  return (
    <div>
      {/* KIND TABS */}
      <div className="flex flex-wrap gap-2">
        {KIND_ORDER.map((k) => {
          const meta = KIND_META[k];
          const Icon = KIND_ICON[k];
          const active = k === kind;
          return (
            <button
              key={k}
              type="button"
              onClick={() => pickKind(k)}
              aria-pressed={active}
              className={
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-semibold transition " +
                (active
                  ? "border-navy-800 bg-navy-800 text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:text-gray-900")
              }
            >
              <Icon size={15} />
              {meta.label}
            </button>
          );
        })}
      </div>

      <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-gray-600">
        {KIND_META[kind].blurb}
      </p>

      {/* GRID + DETAIL */}
      <div className="mt-6 lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
        {/* PRODUCT LIST */}
        <div className="flex flex-col gap-2">
          {inKind.map((p) => {
            const active = p.id === selected.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedId(p.id)}
                aria-pressed={active}
                className={
                  "w-full rounded-xl border p-4 text-left transition " +
                  (active
                    ? "border-navy-800 bg-navy-50/60 ring-1 ring-navy-800"
                    : "border-gray-200 bg-white hover:border-gray-400")
                }
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span
                    className="text-[15px] font-bold text-gray-900"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {p.name}
                  </span>
                  {p.arabic && (
                    <span className="shrink-0 font-mono text-[12px] text-gray-400" dir="rtl">
                      {p.arabic}
                    </span>
                  )}
                </div>
                <span className="mt-1 block text-[12px] leading-snug text-gray-600">
                  {p.tagline}
                </span>
              </button>
            );
          })}
        </div>

        {/* DETAIL PANEL */}
        <article className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 lg:mt-0 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                {KIND_META[selected.kind].label}
                {selected.arabicGloss ? ` · ${selected.arabicGloss}` : ""}
              </div>
              <h3
                className="mt-1 text-[24px] font-bold leading-tight text-gray-900 sm:text-[28px]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {selected.name}
              </h3>
            </div>
            <span
              className={
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold " +
                KIND_META[selected.kind].chip
              }
            >
              <CheckCircle2 size={12} /> Permissible if structured right
            </span>
          </div>

          <p className="mt-4 text-[15px] font-medium leading-relaxed text-gray-800">
            {selected.what}
          </p>

          {/* WHAT / HOW / WHY */}
          <div className="mt-6 space-y-5">
            <Block label="How it works" body={selected.how} />
            <Block
              label="Why it's permissible"
              body={selected.why}
              accent={KIND_META[selected.kind].accent}
            />
          </div>

          {/* REPLACES */}
          <div className="mt-6 flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-3 text-[12.5px] text-gray-700">
            <ArrowLeftRight size={15} className="shrink-0 text-gray-500" />
            <span>
              Stands in for the conventional{" "}
              <span className="font-semibold text-gray-900">{selected.replaces}</span>.
            </span>
          </div>

          {/* CHECKLIST */}
          <div className="mt-6 rounded-xl border border-gold-200 bg-gold-50/50 p-5">
            <div className="flex items-center gap-2">
              <ClipboardCheck size={15} className="text-gold-700" />
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-700">
                What to verify before you buy
              </h4>
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-gray-600">
              Same name, different structures, different rulings. Check these before you trust the label.
            </p>
            <ul className="mt-4 space-y-3">
              {selected.checks.map((c) => (
                <li key={c.q} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                  <div>
                    <div className="text-[13px] font-semibold text-gray-900">{c.q}</div>
                    <div className="mt-0.5 text-[12.5px] leading-relaxed text-gray-600">
                      {c.detail}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>
    </div>
  );
}

function Block({
  label,
  body,
  accent,
}: {
  label: string;
  body: string;
  accent?: string;
}) {
  return (
    <div className={accent ? `border-l-2 pl-4 ${accent}` : ""}>
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
        {label}
      </div>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-gray-700">{body}</p>
    </div>
  );
}
