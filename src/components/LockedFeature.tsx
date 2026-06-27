"use client";

/**
 * LockedFeature (Phase 0d) — the free/paid gating UI.
 *
 * Wrap any paid feature. If the user's tier meets the requirement, the children
 * render normally. Otherwise they render blurred + non-interactive with an
 * overlay: a lock, the tier needed, and an Unlock button.
 *
 * Entitlement source: until billing is wired, tier is read from localStorage
 * ("mizan_tier", default "free") so the UX is fully testable. When Stripe/auth
 * land, swap useEntitlement to read the secure session — the rest is unchanged.
 */
import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import {
  type Tier,
  type FeatureKey,
  TIER_LABEL,
  tierMeets,
  featureTier,
} from "@/lib/entitlements";

const KEY = "mizan_tier";

// Dedupe /api/me across all LockedFeature instances on a page (one request, not N).
let mePromise: Promise<{ tier?: Tier; authConfigured?: boolean }> | null = null;
function fetchMe() {
  if (!mePromise) mePromise = fetch("/api/me").then((r) => r.json()).catch(() => ({}));
  return mePromise;
}

export function useEntitlement() {
  const [tier, setTierState] = useState<Tier>("free");
  useEffect(() => {
    let active = true;
    const readLocal = () => {
      try {
        const t = localStorage.getItem(KEY) as Tier | null;
        if (t === "retail" || t === "institutional" || t === "free") setTierState(t);
      } catch {
        /* ignore */
      }
    };
    // The authoritative tier comes from the server session (/api/me). Before auth
    // is configured (pre-go-live), we fall back to the localStorage override so
    // Pro UI stays previewable in dev/demo. Once auth is live, the server wins.
    fetch("/api/me")
      .then((r) => r.json())
      .then((v: { tier?: Tier; authConfigured?: boolean }) => {
        if (!active) return;
        if (v.authConfigured) setTierState(v.tier ?? "free");
        else readLocal();
      })
      .catch(() => { if (active) readLocal(); });

    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY && e.newValue) setTierState(e.newValue as Tier);
    };
    window.addEventListener("storage", onStorage);
    return () => {
      active = false;
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  // Exposed for testing / future billing callback.
  const setTier = (t: Tier) => {
    try {
      localStorage.setItem(KEY, t);
    } catch {
      /* ignore */
    }
    setTierState(t);
  };
  return { tier, setTier };
}

export default function LockedFeature({
  feature,
  children,
  label,
  benefit,
}: {
  feature: FeatureKey;
  children: React.ReactNode;
  /** optional human label, e.g. "Price chart" */
  label?: string;
  /** optional one-line value prop shown under the headline in the locked state */
  benefit?: string;
}) {
  const { tier } = useEntitlement();
  const need = featureTier(feature);

  if (tierMeets(tier, need)) return <>{children}</>;

  const needLabel = TIER_LABEL[need];

  function onUnlock() {
    window.location.href = need === "institutional" ? "/institutions" : "/pricing";
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200">
      {/* A bounded peek at the real feature, blurred + inert. Capped height +
          fade so a tall (or empty) child never renders as a big void — it
          always reads as a deliberate preview frame. */}
      <div className="relative max-h-[200px] overflow-hidden">
        <div className="pointer-events-none select-none blur-[3px]" aria-hidden="true">
          {children}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white" />
      </div>
      {/* overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-white/40 p-5 text-center">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-800 text-white shadow-sm">
          <Lock size={15} />
        </div>
        <div className="text-[14px] font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
          {label ?? "This feature"}
        </div>
        {benefit ? (
          <p className="max-w-xs text-[12px] leading-relaxed text-gray-600">{benefit}</p>
        ) : null}
        <button
          type="button"
          onClick={onUnlock}
          className="mt-1.5 inline-flex items-center gap-1.5 rounded-md bg-navy-800 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-navy-700"
        >
          {need === "institutional" ? "Talk to us" : `Unlock with ${needLabel}`}
        </button>
      </div>
    </div>
  );
}
