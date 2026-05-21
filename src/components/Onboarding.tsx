"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, X, GraduationCap, Scale, Sparkles, ArrowRight } from "lucide-react";
import { SCHOLAR_PROFILES } from "@/lib/scholars";

const KEY = "mizan.onboardingComplete";

type Experience = "new" | "some" | "experienced";

export default function Onboarding() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [experience, setExperience] = useState<Experience | null>(null);
  const [scholarId, setScholarId] = useState("aaoifi");

  useEffect(() => {
    try {
      const done = localStorage.getItem(KEY) === "1";
      const saved = localStorage.getItem("mizan.scholarId");
      if (saved) setScholarId(saved);
      if (!done) {
        const t = setTimeout(() => { setOpen(true); setStep(1); }, 600);
        return () => clearTimeout(t);
      }
    } catch {}
  }, []);

  function close() {
    try { localStorage.setItem(KEY, "1"); } catch {}
    setOpen(false);
  }

  function pickExperience(e: Experience) {
    setExperience(e);
    if (e === "new") setStep(3); // skip scholar picker — push to /learn
    else setStep(2);
  }

  function chooseScholar(id: string) {
    setScholarId(id);
    try { localStorage.setItem("mizan.scholarId", id); } catch {}
    setStep(3);
  }

  if (!open || step === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true">
      <div className="relative w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl sm:p-8">
        <button type="button" onClick={close} aria-label="Close"
          className="absolute right-3 top-3 rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
          <X size={18} />
        </button>

        <div className="mb-4 flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-gray-500">
          <span>Welcome to Mizan</span>
          <div className="flex gap-1">
            {[1, 2, 3].map((n) => (
              <span key={n} className={"h-1.5 w-8 rounded-full " + (n <= step ? "bg-navy-800" : "bg-gray-200")} />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
              How familiar are you with investing?
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              No wrong answer — we&apos;ll tailor the next step to you.
            </p>
            <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {[
                { id: "new", title: "I&apos;m new", body: "Never bought a stock. Not sure what halal investing even means." },
                { id: "some", title: "I&apos;ve dabbled", body: "Bought a few stocks or used Robinhood, but I&apos;m not sure if they&apos;re halal." },
                { id: "experienced", title: "I&apos;m experienced", body: "Already invest; want a better halal screening tool." },
              ].map((opt) => (
                <button key={opt.id} type="button" onClick={() => pickExperience(opt.id as Experience)}
                  className="rounded-lg border border-gray-200 bg-white p-3 text-left transition hover:border-navy-300 hover:bg-navy-50">
                  <div className="font-semibold text-gray-900" dangerouslySetInnerHTML={{ __html: opt.title }} />
                  <p className="mt-1 text-xs text-gray-600" dangerouslySetInnerHTML={{ __html: opt.body }} />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="flex items-center gap-2 text-navy-800">
              <Scale size={20} /><span className="font-semibold">Pick your scholar</span>
            </div>
            <h2 className="mt-2 text-2xl font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
              Whose ruling do you follow?
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Different scholars apply different rules. Mizan tailors every verdict to
              your selection. Not sure? Pick AAOIFI — it&apos;s the most widely-used
              mainstream standard. You can switch anytime.
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
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="flex items-center gap-2 text-navy-800">
              <Sparkles size={20} /><span className="font-semibold">You&apos;re set up</span>
            </div>
            <h2 className="mt-2 text-2xl font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
              Here&apos;s where to go next.
            </h2>

            {experience === "new" ? (
              <>
                <p className="mt-3 text-sm text-gray-700">
                  Since you&apos;re new to investing, we recommend starting at the Learn
                  page. It&apos;s a 10-minute read that explains everything in plain
                  English — stocks, halal screening, how scholars differ, what to do
                  with your first $50.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link href="/learn" onClick={close}
                    className="inline-flex items-center gap-2 rounded-md bg-navy-800 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700">
                    <GraduationCap size={14} /> Open Halal Investing 101
                  </Link>
                  <button type="button" onClick={close}
                    className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                    I&apos;ll explore on my own
                  </button>
                </div>
              </>
            ) : (
              <>
                <ul className="mt-4 space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-navy-50 text-xs font-semibold text-navy-800">1</span>
                    <span><Link href="/screen?ticker=AMZN" className="font-medium text-navy-700 underline">Try the AMZN demo</Link> — toggle the scholar and watch the verdict flip.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-navy-50 text-xs font-semibold text-navy-800">2</span>
                    <span><Link href="/universe" className="font-medium text-navy-700 underline">Browse the universe</Link> — see every stock that passes under your scholar.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-navy-50 text-xs font-semibold text-navy-800">3</span>
                    <span><Link href="/zakat" className="font-medium text-navy-700 underline">Calculate your zakat</Link> — assets, debts, nisab, 2.5%.</span>
                  </li>
                </ul>
                <div className="mt-6 flex flex-wrap gap-2">
                  <button type="button" onClick={close}
                    className="inline-flex items-center gap-2 rounded-md bg-navy-800 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700">
                    Let&apos;s go <ArrowRight size={14} />
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
