"use client";

import { useState } from "react";
import { Bell, Check } from "lucide-react";
import { toast } from "@/lib/toast";

/**
 * EmailCapture — a single optional email field (NOT an account/signup wall).
 *
 * Submits directly to the Web3Forms backend (same key as the feedback bubble),
 * so addresses land in hello@'s inbox with no database. Use it to (a) capture
 * "email me when {ticker} is added" demand, and (b) seed an alerts list. The
 * full alert-SENDING system (verdict-change/earnings emails) needs a store +
 * email provider — see RETENTION_SETUP.md.
 */
const WEB3FORMS_KEY = "4a6a5ea7-284c-4d45-b05c-1d661bd64a8b";

export default function EmailCapture({
  context,
  purpose = "alerts",
  label = "Get a heads-up by email",
  blurb,
}: {
  /** e.g. a ticker the user searched for, for the subject line */
  context?: string;
  purpose?: "ticker_request" | "alerts";
  label?: string;
  blurb?: string;
}) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setBusy(true);
    const subject =
      purpose === "ticker_request"
        ? `[Mizan signup] Ticker request${context ? `: ${context}` : ""}`
        : `[Mizan signup] Alerts${context ? `: ${context}` : ""}`;
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ access_key: WEB3FORMS_KEY, subject, email, purpose, context: context ?? "" }),
      });
      if (res.ok) {
        setDone(true);
        toast("Got it — you're on the list.", { tone: "success" });
        return;
      }
    } catch {
      /* fall through */
    }
    toast(`Couldn't save that — email hello@mizaninvesting.com instead.`, { tone: "error" });
    setBusy(false);
  }

  if (done) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50/60 px-3 py-2.5 text-[13px] text-emerald-800">
        <Check size={15} /> You&apos;re on the list — we&apos;ll email you{context ? ` about ${context}` : ""}.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-md border border-gray-200 bg-white p-3">
      <div className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-800">
        <Bell size={14} className="text-navy-700" /> {label}
      </div>
      {blurb && <p className="mt-1 text-[12px] leading-relaxed text-gray-500">{blurb}</p>}
      <div className="mt-2 flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="min-w-0 flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-200"
        />
        <button
          type="submit"
          disabled={busy || !email.includes("@")}
          className="shrink-0 rounded-md bg-navy-800 px-3 py-2 text-sm font-semibold text-white transition hover:bg-navy-900 disabled:opacity-50"
        >
          Notify me
        </button>
      </div>
      <p className="mt-1.5 text-[11px] text-gray-400">One email when there&apos;s something to say. No account, unsubscribe anytime.</p>
    </form>
  );
}
