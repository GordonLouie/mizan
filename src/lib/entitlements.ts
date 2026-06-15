/**
 * Entitlements (Phase 0c/0d) — the single source of truth for what each tier
 * can access. Pure module (safe on server + client).
 *
 * Tiers: free → retail ("Pro") → institutional. A feature maps to the MINIMUM
 * tier that unlocks it. Until billing is wired, everyone is "free" and paid
 * features render locked (see LockedFeature). Nothing here needs keys.
 */
export type Tier = "free" | "retail" | "institutional";

export const TIERS: Tier[] = ["free", "retail", "institutional"];
const RANK: Record<Tier, number> = { free: 0, retail: 1, institutional: 2 };

export const TIER_LABEL: Record<Tier, string> = {
  free: "Free",
  retail: "Pro",
  institutional: "Institutional",
};

export function tierMeets(have: Tier, need: Tier): boolean {
  return RANK[have] >= RANK[need];
}

/** Feature → minimum tier required. Edit here to re-gate anything. */
export const FEATURE_TIER = {
  charts: "retail",
  technicals: "retail",
  roi: "retail",
  portfolioPerformance: "retail",
  indexes: "retail",
  alerts: "retail",
  customThresholdsSaved: "retail",
  // Per the feature matrix: retail gets AI reports (limited), institutional
  // unlimited. The limited/unlimited usage cap is enforced once accounts exist
  // (Phase 4); for now any paid tier unlocks the feature and the API applies a
  // best-effort per-IP daily cap.
  aiReport: "retail",
  apiExport: "institutional",
  whiteLabel: "institutional",
} as const satisfies Record<string, Tier>;

export type FeatureKey = keyof typeof FEATURE_TIER;

export function featureTier(f: FeatureKey): Tier {
  return FEATURE_TIER[f];
}
