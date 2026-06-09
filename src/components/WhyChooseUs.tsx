/**
 * WhyChooseUs — two-column "tabs with live panel" section.
 *
 * Left column: a stack of tab buttons; the active one is highlighted on a
 * pale cream background. Right column: the content + mock UI for the
 * currently selected tab.
 *
 * Each tab maps to one of Mizan's actual differentiators — multi-scholar
 * transparency, primary-source citations, the breach-risk indicator — so
 * the panel content is real product surface, not stock illustration.
 */

"use client";

import { useState } from "react";
import { Scale, FileText, Activity, ArrowRight } from "lucide-react";
import Link from "next/link";

type TabKey = "multi-scholar" | "show-the-math" | "stability";

const TABS: Array<{
  key: TabKey;
  label: string;
  icon: React.ReactNode;
  headline: string;
  description: string;
}> = [
  {
    key: "multi-scholar",
    label: "Multi-scholar transparency",
    icon: <Scale size={18} />,
    headline: "Every scholar, one screen.",
    description:
      "Every other halal app hides scholar disagreement behind a single default. Mizan shows you the verdict under AAOIFI, Mufti Taqi Usmani, S&P DJIM, Ja'fari, and the strict view — side by side, on every stock.",
  },
  {
    key: "show-the-math",
    label: "Show the math",
    icon: <FileText size={18} />,
    headline: "Every threshold cited. Every number sourced.",
    description:
      "Click any check to see the line items, the calculation, and a citation to the primary source — AAOIFI Standard No. 21, Mufti Taqi's published rulings, the SEC 10-Q. No black-box scores, no algorithmic mystery.",
  },
  {
    key: "stability",
    label: "Breach-risk indicators",
    icon: <Activity size={18} />,
    headline: "Will it still be halal next quarter?",
    description:
      "A passing stock can flip when debt creeps up or illiquid assets fall. Mizan computes a stability score and per-ratio breach risk so you can see — at a glance — which holdings are comfortable, which are near the limit, and which are about to fail.",
  },
];

export default function WhyChooseUs() {
  const [active, setActive] = useState<TabKey>("multi-scholar");
  const current = TABS.find((t) => t.key === active) ?? TABS[0];

  return (
    <section className="mx-auto mt-32 max-w-6xl px-4 sm:px-6">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        {/* LEFT — section header + tab buttons */}
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-600">
            Why choose Mizan
          </div>
          <h2
            className="mt-4 text-[34px] font-bold leading-[1.05] text-gray-900 sm:text-[44px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Built for the way Muslims actually invest.
          </h2>
          <p className="mt-4 max-w-md text-[14px] leading-relaxed text-gray-600">
            Not one rulebook. Not one framework. Not one set of thresholds.
            Halal investing isn't black and white — your tools shouldn't pretend it is.
          </p>

          <div className="mt-8 space-y-2">
            {TABS.map((t) => {
              const isActive = t.key === active;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setActive(t.key)}
                  className={
                    "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition " +
                    (isActive
                      ? "border-navy-200 bg-navy-50/70 text-navy-900"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50")
                  }
                  aria-pressed={isActive}
                >
                  <span
                    className={
                      "grid h-9 w-9 shrink-0 place-items-center rounded-md " +
                      (isActive ? "bg-navy-800 text-white" : "bg-gray-100 text-gray-600")
                    }
                  >
                    {t.icon}
                  </span>
                  <span
                    className="text-[15px] font-semibold"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT — content panel */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
          <h3
            className="text-[24px] font-bold leading-tight text-gray-900 sm:text-[28px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {current.headline}
          </h3>
          <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-gray-600">
            {current.description}
          </p>

          <div className="mt-6">
            <TabPreview tab={active} />
          </div>

          <Link
            href={previewLink(active)}
            className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-navy-700 hover:text-navy-900"
          >
            {previewCTA(active)} <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function previewLink(tab: TabKey): string {
  if (tab === "multi-scholar") return "/screen?ticker=AMZN";
  if (tab === "show-the-math") return "/methodology";
  return "/screen?ticker=AAPL";
}
function previewCTA(tab: TabKey): string {
  if (tab === "multi-scholar") return "See Amazon under all six";
  if (tab === "show-the-math") return "Read the methodology";
  return "See Apple's stability score";
}

/**
 * TabPreview — a small mock specific to each tab. Editorial / hairline
 * borders, no shadows, monospace data per the Mizan signature.
 */
function TabPreview({ tab }: { tab: TabKey }) {
  if (tab === "multi-scholar") {
    return (
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-[#F5F6F3]">
        <div className="grid grid-cols-[1fr_auto] gap-3 border-b border-gray-100 bg-white/60 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-gray-500">
          <span>Scholar</span>
          <span>AMZN verdict</span>
        </div>
        <div className="divide-y divide-gray-100">
          {[
            { name: "AAOIFI", verdict: "Halal", tone: "emerald" },
            { name: "Mufti Taqi", verdict: "Not halal", tone: "rose" },
            { name: "S&P DJIM", verdict: "Halal", tone: "emerald" },
            { name: "Ja'fari", verdict: "Halal", tone: "emerald" },
            { name: "Strict", verdict: "Not halal", tone: "rose" },
          ].map((r) => (
            <div key={r.name} className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-2.5">
              <div
                className="text-[13px] font-semibold text-gray-900"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {r.name}
              </div>
              <span
                className={
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold " +
                  (r.tone === "emerald"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-700")
                }
              >
                {r.verdict}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tab === "show-the-math") {
    return (
      <div className="rounded-lg border border-gray-200 bg-[#F5F6F3] px-4 py-4 font-mono text-[11px] leading-relaxed text-gray-700">
        <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-500">
          Check 1 · Cash + securities ratio
        </div>
        <div className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 tabular-nums">
          <span className="text-gray-500">Cash</span><span>13,237</span>
          <span className="text-gray-500">Marketable sec.</span><span>67,335</span>
          <span className="text-gray-500">Long-term sec.</span><span>43,364</span>
          <span className="font-semibold text-gray-900">Total</span><span className="font-semibold text-gray-900">123,936</span>
        </div>
        <div className="mt-3 border-t border-gray-200 pt-3">
          <span className="text-gray-500">123,936 / 4,968,000 = </span>
          <span className="font-bold text-emerald-700">2.49%</span>
          <span className="text-gray-400"> · cap 30%</span>
        </div>
        <div className="mt-2 text-[9px] uppercase tracking-[0.16em] text-gray-400">
          Source · SEC 10-Q Note 4 / AAOIFI §3.5.1
        </div>
      </div>
    );
  }

  // stability
  return (
    <div className="rounded-lg border border-gray-200 bg-[#F5F6F3] p-4">
      <div className="flex items-baseline justify-between">
        <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-500">
          AAPL · 8-quarter verdict track
        </div>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700">
          100 · ROCK-SOLID
        </span>
      </div>
      <div className="mt-4 grid grid-cols-8 gap-1.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-6 rounded-sm bg-emerald-200"
            title={`Q${i + 1}: Halal`}
          />
        ))}
      </div>
      <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-gray-500">
        Buffer to debt cap · 23.5 pp · COMFORTABLE
      </div>
    </div>
  );
}
