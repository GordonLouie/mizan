/**
 * GetStartedSteps — three numbered cards walking new users through the
 * HalalGauge flow. Lives near the bottom of the homepage as a soft conversion.
 *
 * Each card: big 01/02/03 numeral in Georgia, icon, title, one-line copy,
 * and a small visual cue mapped to each step.
 */

"use client";

import Link from "next/link";
import { ArrowRight, ScanSearch, Layers, BookmarkPlus } from "lucide-react";

const STEPS = [
  {
    num: "01",
    icon: <Layers size={18} />,
    title: "Pick your scholar",
    body: "Six methodologies, or build your own thresholds. Pick once — HalalGauge remembers.",
    cta: "Browse scholars",
    href: "/scholars",
  },
  {
    num: "02",
    icon: <ScanSearch size={18} />,
    title: "Screen any stock",
    body: "Type a ticker. See the verdict, the math, the sources — under your scholar.",
    cta: "Try a stock",
    href: "/screen",
  },
  {
    num: "03",
    icon: <BookmarkPlus size={18} />,
    title: "Build your portfolio",
    body: "Track positions, save tickers, get alerts when a verdict is about to flip.",
    cta: "Open portfolio",
    href: "/portfolio",
  },
];

export default function GetStartedSteps() {
  return (
    <section className="mx-auto mt-32 max-w-6xl px-4 sm:px-6">
      <div className="text-center">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-600">
          Get started
        </div>
        <h2
          className="mt-4 text-[34px] font-bold leading-[1.05] text-gray-900 sm:text-[44px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Three steps to clarity.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[14px] leading-relaxed text-gray-600">
          A simple flow that takes you from question to verdict in under a minute.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
        {STEPS.map((s) => (
          <Link
            key={s.num}
            href={s.href}
            className="group relative flex flex-col rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-navy-300 hover:shadow-[0_8px_30px_-12px_rgba(31,58,95,0.12)]"
          >
            <div className="flex items-center justify-between">
              <span
                className="text-[40px] font-bold leading-none text-gold-600"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {s.num}
              </span>
              <span className="grid h-9 w-9 place-items-center rounded-md bg-navy-50 text-navy-800">
                {s.icon}
              </span>
            </div>
            <h3
              className="mt-6 text-[18px] font-bold text-gray-900"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {s.title}
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-gray-600">
              {s.body}
            </p>
            <span className="mt-6 inline-flex items-center gap-1.5 text-[12px] font-semibold text-navy-700 group-hover:text-navy-900">
              {s.cta} <ArrowRight size={12} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
