/**
 * apiKeys.ts (Phase 4c) — institutional API key validation. SERVER-ONLY.
 *
 * Keys live in KV under `mizan:apikeys` = { "<key>": { email, tier } }. You issue
 * a key by adding an entry (e.g. for an institutional customer). Inert until KV is
 * configured — getApiKeyOwner returns null, so the export API stays closed.
 */
import { kvGetJson } from "./kv";
import type { Tier } from "./entitlements";

export interface ApiKeyOwner {
  email: string;
  tier: Tier;
}

/** Extract a Bearer token from the Authorization header. */
export function bearer(req: Request): string | null {
  const h = req.headers.get("authorization") || "";
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1].trim() : null;
}

export async function getApiKeyOwner(key: string | null): Promise<ApiKeyOwner | null> {
  if (!key) return null;
  const map = await kvGetJson<Record<string, { email: string; tier: string }>>("mizan:apikeys");
  const rec = map?.[key];
  if (!rec) return null;
  const tier: Tier = rec.tier === "institutional" || rec.tier === "retail" ? rec.tier : "free";
  return { email: rec.email, tier };
}
