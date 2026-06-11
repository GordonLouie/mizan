"use client";

import { useEffect, useState } from "react";
import { MessageCircle, X, Copy, Check } from "lucide-react";
import { toast } from "@/lib/toast";

/**
 * Floating feedback button on every page. Click → a small panel that simply
 * shows the founder's email with a copy button. No form, no mailto redirect,
 * no backend — nothing that can fail. People email feedback directly.
 */
const FEEDBACK_EMAIL = "hello@mizaninvesting.com";

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(FEEDBACK_EMAIL);
      setCopied(true);
      toast("Email address copied.", { tone: "success" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast(`Email us at ${FEEDBACK_EMAIL}`, { tone: "success" });
    }
  }

  return (
    <>
      {/* Floating action button — bottom-right, above the mobile tab bar */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Send feedback to Mizan"
        className="fixed bottom-20 right-4 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-[#1B2D4A] text-white shadow-lg transition hover:bg-[#243A5E] hover:shadow-xl md:bottom-6"
      >
        <MessageCircle size={18} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-black/30 p-4 backdrop-blur-sm sm:items-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="w-full max-w-sm overflow-hidden rounded-xl bg-white shadow-xl">
            <div className="flex items-start justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-widest text-amber-700">
                  Send feedback
                </div>
                <h3
                  className="mt-1 text-lg font-bold text-gray-900"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Tell the founder anything
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 px-5 py-5">
              <p className="text-sm leading-relaxed text-gray-600">
                Bugs, ideas, what&apos;s confusing, what&apos;s missing — email it
                straight to Gordon. A real person reads and replies to every message.
              </p>
              <div className="flex items-center justify-between gap-3 rounded-md border border-gray-200 bg-gray-50 px-3 py-2.5">
                <span className="font-mono text-sm text-gray-900">{FEEDBACK_EMAIL}</span>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="inline-flex items-center gap-1.5 rounded-md bg-[#1B2D4A] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#243A5E]"
                >
                  {copied ? (
                    <>
                      <Check size={13} /> Copied
                    </>
                  ) : (
                    <>
                      <Copy size={13} /> Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
