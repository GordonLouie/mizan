"use client";

/**
 * /account (Phase 4) — passwordless sign-in + plan management.
 * Signed out: request a magic link. Signed in: show email + tier, manage billing
 * (Stripe portal), sign out. Honest "not enabled yet" states pre-go-live.
 */
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, Mail, LogOut, CreditCard } from "lucide-react";
import { TIER_LABEL, type Tier } from "@/lib/entitlements";

function AccountInner() {
  const params = useSearchParams();
  const [email, setEmail] = useState<string | null>(null);
  const [tier, setTier] = useState<Tier>("free");
  const [authOn, setAuthOn] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (params.get("signedin")) setMsg("You're signed in.");
    if (params.get("error") === "link") setMsg("That sign-in link was invalid or expired. Request a new one.");
    // Strip the one-time query params so the message doesn't persist on reload.
    if (params.get("signedin") || params.get("error")) {
      window.history.replaceState({}, "", "/account");
    }
    fetch("/api/me").then((r) => r.json()).then((v: { email?: string | null; tier?: Tier; authConfigured?: boolean }) => {
      setEmail(v.email ?? null);
      setTier(v.tier ?? "free");
      setAuthOn(!!v.authConfigured);
    }).catch(() => {}).finally(() => setLoaded(true));
  }, [params]);

  async function sendLink() {
    if (!input.trim()) return;
    setSending(true); setMsg(null);
    try {
      const res = await fetch("/api/auth/request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: input.trim() }),
      });
      const data = (await res.json()) as { ok?: boolean; reason?: string; error?: string };
      if (res.status === 429) setMsg("Too many requests — please wait a bit and try again.");
      else if (data.error === "invalid_email") setMsg("Please enter a valid email address.");
      else if (data.ok) setMsg("Check your inbox for a sign-in link (it expires in 15 minutes).");
      else setMsg("Sign-in isn't switched on yet. It'll be available shortly.");
    } catch {
      setMsg("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  async function manageBilling() {
    setBusy(true); setMsg(null);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = (await res.json()) as { url?: string };
      if (data.url) { window.location.href = data.url; return; }
      setMsg("Billing management isn't available yet.");
    } catch {
      setMsg("Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    window.location.href = "/account";
  }

  return (
    <main className="mx-auto max-w-md px-4 py-12 sm:py-16">
      <h1 className="text-[28px] font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>Account</h1>

      {!loaded ? (
        <div className="mt-8 flex items-center gap-2 text-gray-400"><Loader2 size={16} className="animate-spin" /> Loading…</div>
      ) : email ? (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
          <div className="text-[12px] text-gray-500">Signed in as</div>
          <div className="text-[15px] font-semibold text-gray-900">{email}</div>
          <div className="mt-3 flex items-center gap-2">
            <span className="rounded-full bg-navy-50 px-3 py-1 text-[12px] font-semibold text-navy-700">{TIER_LABEL[tier]} plan</span>
            {tier === "free" && <Link href="/pricing" className="text-[13px] font-semibold text-navy-700">Upgrade →</Link>}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {tier !== "free" && (
              <button type="button" onClick={manageBilling} disabled={busy}
                className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-[13px] font-semibold text-gray-700 transition hover:border-gray-400 disabled:opacity-60">
                {busy ? <Loader2 size={14} className="animate-spin" /> : <CreditCard size={14} />} Manage billing
              </button>
            )}
            <button type="button" onClick={signOut}
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-[13px] font-semibold text-gray-700 transition hover:border-gray-400">
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-[14px] leading-relaxed text-gray-600">
            Sign in with your email — no password. We&apos;ll send you a one-time link.
          </p>
          <label htmlFor="account-email" className="sr-only">Email address</label>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <input
              id="account-email"
              type="email" value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") sendLink(); }}
              placeholder="you@example.com"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-[14px] outline-none focus:border-navy-700 focus:ring-1 focus:ring-navy-700/20"
            />
            <button type="button" onClick={sendLink} disabled={sending || !input.trim()}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-navy-800 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-navy-900 disabled:opacity-60">
              {sending ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />} Send link
            </button>
          </div>
          {!authOn && <p className="mt-3 text-[12px] text-gray-400">Sign-in is being switched on — links may not send until then.</p>}
        </div>
      )}

      {msg && <p className="mt-4 text-[13px] text-gray-700">{msg}</p>}
    </main>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-md px-4 py-16 text-gray-400">Loading…</main>}>
      <AccountInner />
    </Suspense>
  );
}
