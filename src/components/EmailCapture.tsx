"use client";

import { useState } from "react";
import { Bell, Check } from "lucide-react";
import { toast } from "@/lib/toast";

/**
 * EmailCapture — a single optional email field (NOT an account/signup wall).
 *
 * Submits to /api/subscribe, which forwards to hello@'s inbox (so you see it
 * today) AND persists to KV when a store is configured, so the daily cron can
 * send verdict-change / earnings alerts. See RETENTION_SETUP.md.
 */
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
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose, context: context ?? "", subject }),
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
