"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, GraduationCap, ArrowRight } from "lucide-react";

const KEY = "mizan.onboardingComplete";

export default function Onboarding() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const done = localStorage.getItem(KEY) === "1";
      if (!done) {
        const t = setTimeout(() => setOpen(true), 600);
        return () => clearTimeout(t);
      }
    } catch {}
  }, []);

  function close() {
    try { localStorage.setItem(KEY, "1"); } catch {}
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true">
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl sm:p-8">
        <button type="button" onClick={close} aria-label="Close"
          className="absolute right-3 top-3 rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
          <X size={18} />
        </button>

        <div className="text-xs font-medium uppercase tracking-wide text-gold-600">Welcome</div>
        <h2 className="mt-1 text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
          Halal investing, made clear.
        </h2>
        <p className="mt-3 text-sm leading-6 text-gray-700">
          HalalGauge tells you what your scholar would say about any stock. If you&apos;ve
          never invested before, start with our 10-minute primer — it explains
          everything in plain English.
        </p>

        <div className="mt-5 flex flex-col gap-2">
          <Link href="/learn" onClick={close}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-navy-800 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700">
            <GraduationCap size={14} /> Start with Halal Investing 101
          </Link>
          <button type="button" onClick={close}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            I know what I&apos;m doing — let me explore <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
