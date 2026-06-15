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
import { toast } from "@/lib/toast";
import {
  type Tier,
  type FeatureKey,
  TIER_LABEL,
  tierMeets,
  featureTier,
} from "@/lib/entitlements";

const KEY = "mizan_tier";

export function useEntitlement() {
  const [tier, setTierState] = useState<Tier>("free");
  useEffect(() => {
    try {
      const t = localStorage.getItem(KEY) as Tier | null;
      if (t === "retail" || t === "institutional" || t === "free") setTierState(t);
    } catch {
      /* ignore */
    }
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY && e.newValue) setTierState(e.newValue as Tier);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
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
}: {
  feature: FeatureKey;
  children: React.ReactNode;
  /** optional human label, e.g. "Price chart" */
  label?: string;
}) {
  const { tier } = useEntitlement();
  const need = featureTier(feature);

  if (tierMeets(tier, need)) return <>{children}</>;

  const needLabel = TIER_LABEL[need];

  function onUnlock() {
    // Billing not wired yet — honest placeholder. When Stripe is live this
    // calls /api/checkout (retail) or opens the institutional contact flow.
    if (need === "institutional") {
      window.location.href = "mailto:hello@mizaninvesting.com?subject=Mizan%20Institutional%20access";
    } else {
      toast("Pro is coming soon — email hello@mizaninvesting.com for early access.", { tone: "info" });
    }
  }

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* the real feature, blurred + inert */}
      <div className="pointer-events-none select-none blur-sm" aria-hidden="true">
        {children}
      </div>
      {/* overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/55 backdrop-blur-[2px] p-4 text-center">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-800 text-white">
          <Lock size={16} />
        </div>
        <div className="text-[13px] font-semibold text-gray-900">
          {label ?? "This feature"} is a {needLabel} feature
        </div>
        <button
          type="button"
          onClick={onUnlock}
          className="mt-1 rounded-md bg-navy-800 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-navy-900"
        >
          {need === "institutional" ? "Talk to us" : "Unlock with Pro"}
        </button>
      </div>
    </div>
  );
}
