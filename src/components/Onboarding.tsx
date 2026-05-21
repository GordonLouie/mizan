"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, X, Scale, Search, Sparkles } from "lucide-react";
import { SCHOLAR_PROFILES } from "@/lib/scholars";

const KEY = "mizan.onboardingComplete";

export default function Onboarding() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [scholarId, setScholarId] = useState("aaoifi");

  useEffect(() => {
    try {
      const done = localStorage.getItem(KEY) === "1";
      const saved = localStorage.getItem("mizan.scholarId");
      if (saved) setScholarId(saved);
      if (!done) {
        // Defer slightly so the page paints first
        const t = setTimeout(() => { setOpen(true); setStep(1); }, 600);
        return () => clearTimeout(t);
      }
    } catch {}
  }, []);

  function close() {
    try { localStorage.setItem(KEY, "1"); } catch {}
    setOpen(false);
  }

  function chooseScholar(id: string) {
    setScholarId(id);
    try { localStorage.setItem("mizan.scholarId", id); } catch {}
    setStep(2);
  }

  if (!open || step === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true">
      <div className="relative w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl sm:p-8">
        <button type="button" onClick={close} aria-label="Close onboarding"
          className="absolute right-3 top-3 rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
          <X size={18} />
        </button>

        <div className="mb-4 flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-gray-500">
          <span>Step {step} of 3</span>
          <div className="flex gap-1">
            {[1, 2, 3].map((n) => (
              <span key={n} className={"h-1.5 w-8 rounded-full " + (n <= step ? "bg-navy-800" : "bg-gray-200")} />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div>
            <div className="flex items-center gap-2 text-navy-800">
              <Scale size={20} /><span className="font-semibold">Pick your scholar</span>
            </div>
            <h2 className="mt-2 text-2xl font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
              First, whose ruling do you follow?
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Different scholars apply different thresholds to the same stock. Mizan tailors every verdict to your selection. Choose now; change anytime.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {SCHOLAR_PROFILES.map((p) => (
                <button key={p.id} type="button" onClick={() => chooseScholar(p.id)}
                  className={
                    "rounded-lg border p-3 text-left transition " +
                    (p.id === scholarId
                      ? "border-navy-700 bg-navy-50 ring-2 ring-navy-700"
                      : "border-gray-200 bg-white hover:border-navy-300")
                  }>
                  <div className="font-semibold text-gray-900">{p.short}</div>
                  <div className="mt-0.5 text-xs text-gray-500">{p.label}</div>
                  <div className="mt-2 text-xs text-gray-700">{p.blurb}</div>
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Not sure? Start with AAOIFI — it&apos;s the most widely-used mainstream standard. You can switch any time from the Scholar Picker on each page.
            </p>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="flex items-center gap-2 text-navy-800">
              <Sparkles size={20} /><span className="font-semibold">See the demo</span>
            </div>
            <h2 className="mt-2 text-2xl font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
              Same stock. Different scholars. Different verdicts.
            </h2>
            <p className="mt-3 text-sm text-gray-700">
              Try this: search <strong className="font-mono text-navy-700">AMZN</strong> in the screener. With the AAOIFI profile it&apos;s a PASS. With Mufti Taqi Usmani&apos;s profile it&apos;s a FAIL — because his published methodology requires illiquid assets to be at least 20% of total assets, a rule no other major halal app implements.
            </p>
            <p className="mt-3 text-sm text-gray-600">
              That asymmetry is the whole product. Once you see it, you can&apos;t unsee it.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href="/screen?ticker=AMZN" onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 rounded-md bg-navy-800 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700">
                Take me to the demo <ChevronRight size={14} />
              </Link>
              <button type="button" onClick={() => setStep(3)}
                className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                I&apos;ll explore on my own
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="flex items-center gap-2 text-navy-800">
              <Search size={20} /><span className="font-semibold">You&apos;re ready</span>
            </div>
            <h2 className="mt-2 text-2xl font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
              Three things to try next.
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-navy-50 text-xs font-semibold text-navy-800">1</span>
                <span><Link href="/universe" className="font-medium text-navy-700 underline">Browse the universe</Link> — every ticker, filterable by sector and verdict under your scholar.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-navy-50 text-xs font-semibold text-navy-800">2</span>
                <span><Link href="/zakat" className="font-medium text-navy-700 underline">Calculate your zakat</Link> — assets minus debts, nisab check, 2.5% computation.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-navy-50 text-xs font-semibold text-navy-800">3</span>
                <span><Link href="/ask" className="font-medium text-navy-700 underline">Ask a scholar</Link> — common halal-finance questions answered per your selected scholar.</span>
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              <button type="button" onClick={close}
                className="inline-flex items-center gap-2 rounded-md bg-navy-800 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700">
                Let&apos;s go
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
