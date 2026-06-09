"use client";

import { useEffect, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { toast } from "@/lib/toast";

/**
 * Floating feedback button on every page. Click → form opens.
 * On submit, builds a mailto: URL with the structured message and opens
 * the user's email client. This is the right MVP for a feedback channel
 * because it requires no backend, no auth, no spam handling, and the user
 * keeps a copy of what they sent in their Sent folder.
 *
 * When we add a backend endpoint later, swap the mailto for a POST and
 * keep the rest of the component identical.
 */
export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [kind, setKind] = useState<"bug" | "idea" | "praise" | "other">("idea");
  const [submitting, setSubmitting] = useState(false);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);

    const path = typeof window !== "undefined" ? window.location.pathname + window.location.search : "";
    const subject = `[Mizan feedback · ${kind}] ${truncate(message, 60)}`;
    const body =
      `Type: ${kind}\n` +
      `Page: ${path}\n` +
      `Contact: ${contact || "(none provided)"}\n\n` +
      `Message:\n${message}\n`;

    const mailto = `mailto:hello@mizaninvesting.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;

    toast("Opened your email app — hit send when ready.", { tone: "success" });
    setOpen(false);
    setMessage("");
    setContact("");
    setKind("idea");
    setSubmitting(false);
  }

  return (
    <>
      {/* Floating action button — bottom-right, above the mobile tab bar */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Send feedback to Mizan"
        className="fixed bottom-20 right-4 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-navy-800 text-white shadow-lg transition hover:bg-navy-900 hover:shadow-xl md:bottom-6"
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
          <form
            onSubmit={submit}
            className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl"
          >
            <div className="border-b border-gray-100 px-5 py-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-amber-700">
                    Send feedback
                  </div>
                  <h3 className="mt-1 text-lg font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
                    Tell the founder what's broken
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Goes straight to Gordon. No support ticket — a person replies.
                  </p>
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
            </div>

            <div className="space-y-4 px-5 py-4">
              {/* Kind selector */}
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Type
                </div>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {(["bug", "idea", "praise", "other"] as const).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setKind(k)}
                      className={
                        "rounded-md border px-2 py-1.5 text-xs font-medium capitalize transition " +
                        (kind === k
                          ? "border-navy-700 bg-navy-50 text-navy-800"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50")
                      }
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500" htmlFor="fb-msg">
                  Your message
                </label>
                <textarea
                  id="fb-msg"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  required
                  placeholder={
                    kind === "bug"
                      ? "What happened? What did you expect to see?"
                      : kind === "idea"
                        ? "What would make Mizan more useful for you?"
                        : kind === "praise"
                          ? "What's working well for you?"
                          : "What's on your mind?"
                  }
                  className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm leading-6 outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-200"
                />
              </div>

              {/* Contact (optional) */}
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500" htmlFor="fb-contact">
                  Your email (optional, so we can reply)
                </label>
                <input
                  id="fb-contact"
                  type="email"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-200"
                />
              </div>

              {/* Page context */}
              <div className="rounded-md bg-gray-50 px-3 py-2 text-[11px] text-gray-600">
                We&apos;ll include the page you&apos;re on right now so we can reproduce the issue.
                Your email opens with the message pre-filled — hit send when ready.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-gray-100 bg-gray-50 px-5 py-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!message.trim() || submitting}
                className="inline-flex items-center gap-1.5 rounded-md bg-navy-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-navy-900 disabled:opacity-50"
              >
                <Send size={13} /> Open email
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}
