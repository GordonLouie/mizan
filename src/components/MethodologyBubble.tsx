/**
 * MethodologyBubble — section that sits immediately below the scroll-tilting
 * iPad, framed by a centered pill badge + big headline + brief description
 * + a small grid of source badges.
 *
 * The "small pill badge above a hero headline" is a common SaaS section
 * pattern; we've populated it with Mizan-original copy about our
 * primary-source rigor (AAOIFI, Mufti Taqi's published rulings, Sistani's
 * Code of Practice, the S&P DJIM methodology, SEC filings).
 */

"use client";

import Link from "next/link";
import {
  BookOpen, ScrollText, ScaleIcon, Building2, Library, ArrowRight,
} from "lucide-react";

// Using ScaleIcon alias to avoid colliding with the financial sense of Scale
// in other parts of the app.
const ScaleNotMoney = ScaleIcon;

const SOURCES = [
  { label: "AAOIFI", sub: "Standard No. 21", icon: <BookOpen size={16} /> },
  { label: "Mufti Taqi", sub: "Published rulings", icon: <ScrollText size={16} /> },
  { label: "S&P DJIM", sub: "Index methodology", icon: <ScaleNotMoney size={16} /> },
  { label: "Sistani.org", sub: "Code of Practice", icon: <Library size={16} /> },
  { label: "SEC", sub: "10-Q / 10-K filings", icon: <Building2 size={16} /> },
];

export default function MethodologyBubble() {
  return (
    <section className="relative mx-auto mt-20 max-w-6xl px-4 sm:px-6">
      {/* faint dotted-grid backdrop so this section reads as elevated */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-3xl opacity-[0.5]"
        style={{
          background:
            "radial-gradient(circle at center, rgba(31,58,95,0.05) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-700">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold-500" />
          Primary sources
        </span>
        <h2
          className="mt-6 text-[36px] font-bold leading-[1.05] text-gray-900 sm:text-[52px]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Sourced from the documents that actually rule.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-gray-600">
          Every threshold on Mizan traces back to a published primary source —
          not a third-party score, not an opinion. Open any check to see the
          citation.
        </p>
        <Link
          href="/methodology"
          className="mt-7 inline-flex items-center gap-1.5 rounded-full bg-navy-900 px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-navy-800"
        >
          Read the methodology <ArrowRight size={14} />
        </Link>
      </div>

      {/* Source badges — circular wells with icon + label below.
          Pattern echoes the SaaS "integration logos" row but here each well
          represents a methodology document, not a vendor. */}
      <div className="mt-14 grid grid-cols-2 gap-y-8 sm:grid-cols-3 md:grid-cols-5">
        {SOURCES.map((s) => (
          <div key={s.label} className="flex flex-col items-center">
            <span
              className="grid h-16 w-16 place-items-center rounded-full bg-white text-navy-800 ring-1 ring-gray-200"
              style={{
                boxShadow:
                  "0 6px 20px -8px rgba(31,58,95,0.15), inset 0 1px 0 rgba(255,255,255,0.9)",
              }}
            >
              {s.icon}
            </span>
            <div
              className="mt-3 text-[13px] font-bold text-gray-900"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {s.label}
            </div>
            <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-gray-500">
              {s.sub}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
