"use client";

/**
 * /account (v2) — Clerk-powered. Signed out: sign in / create account (Google,
 * email, or password) via Clerk modal. Signed in: email + plan + manage billing +
 * Clerk account menu. Tier comes from /api/me (Clerk session → KV).
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Loader2, CreditCard } from "lucide-react";
import { TIER_LABEL, type Tier } from "@/lib/entitlements";

export default function AccountPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [tier, setTier] = useState<Tier>("free");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isSignedIn) return;
    fetch("/api/me").then((r) => r.json()).then((v: { tier?: Tier }) => setTier(v.tier ?? "free")).catch(() => {});
  }, [isSignedIn, user?.id]);

  async function manageBilling() {
    setBusy(true); setMsg(null);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = (await res.json()) as { url?: string };
      if (data.url) { window.location.href = data.url; return; }
      setMsg("Billing management isn't available yet.");
    } catch { setMsg("Something went wrong."); }
    finally { setBusy(false); }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-12 sm:py-16">
      <h1 className="text-[28px] font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>Account</h1>

      {!isLoaded ? (
        <div className="mt-8 flex items-center gap-2 text-gray-400"><Loader2 size={16} className="animate-spin" /> Loading…</div>
      ) : isSignedIn ? (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[12px] text-gray-500">Signed in as</div>
              <div className="text-[15px] font-semibold text-gray-900">{user?.primaryEmailAddress?.emailAddress ?? "—"}</div>
              <div className="mt-3 flex items-center gap-2">
                <span className="rounded-full bg-navy-50 px-3 py-1 text-[12px] font-semibold text-navy-700">{TIER_LABEL[tier]} plan</span>
                {tier === "free" && <Link href="/pricing" className="text-[13px] font-semibold text-navy-700">Upgrade →</Link>}
              </div>
            </div>
            <UserButton />
          </div>
          {tier !== "free" && (
            <div className="mt-6">
              <button type="button" onClick={manageBilling} disabled={busy}
                className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-[13px] font-semibold text-gray-700 transition hover:border-gray-400 disabled:opacity-60">
                {busy ? <Loader2 size={14} className="animate-spin" /> : <CreditCard size={14} />} Manage billing
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-[14px] leading-relaxed text-gray-600">
            Sign in to unlock Pro features and manage your plan. Continue with Google, or use email.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <SignUpButton mode="modal">
              <button className="inline-flex flex-1 items-center justify-center rounded-md bg-navy-800 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-navy-900">
                Create account
              </button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="inline-flex flex-1 items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-[13px] font-semibold text-gray-800 transition hover:border-gray-400">
                Sign in
              </button>
            </SignInButton>
          </div>
        </div>
      )}

      {msg && <p className="mt-4 text-[13px] text-gray-700">{msg}</p>}
    </main>
  );
}
