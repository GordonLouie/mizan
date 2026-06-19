/**
 * drift.ts — compliance-drift detection. Client-safe (pure functions over a
 * ScreeningResult). This is HalalGauge's differentiated, recurring-value feature:
 * surface holdings that are non-compliant OR *passing but close to a ratio limit*
 * — the ones most likely to drop out of compliance — so a user can watch them.
 */
import type { ScreeningResult } from "./types";

/** How close to a "max" limit counts as "near" (drift risk). 0.85 = within 15% of the cap. */
export const NEAR_LIMIT_FRACTION = 0.85;

export type DriftSeverity = "fail" | "borderline" | "near";

export interface DriftItem {
  ticker: string;
  name: string;
  severity: DriftSeverity;
  /** Plain-language reasons (the deciding sector reason and/or the tight ratios). */
  notes: string[];
}

const SEVERITY_RANK: Record<DriftSeverity, number> = { fail: 0, borderline: 1, near: 2 };

/**
 * Returns a DriftItem if the holding is non-compliant or drifting toward a limit,
 * else null. `result` is the deterministic screen for the user's chosen standard.
 */
export function driftFlag(ticker: string, name: string, result: ScreeningResult): DriftItem | null {
  if (!result.dataReliable) return null; // don't flag drift on data we don't trust

  const notes: string[] = [];

  // Non-compliant: surface the actual failing checks.
  if (result.verdict !== "pass") {
    if (!result.sectorPasses) notes.push(`Business activity — ${result.sectorReason}`);
    for (const c of result.ratioChecks) {
      if (!c.passes && c.threshold != null) {
        const rel = c.direction === "max" ? "over" : "under";
        notes.push(`${c.label} ${c.value.toFixed(1)}% (${rel} the ${c.threshold}% limit)`);
      }
    }
    if (notes.length === 0) notes.push("Fails the screen on the chosen standard.");
    return { ticker, name, severity: result.verdict === "fail" ? "fail" : "borderline", notes };
  }

  // Passing but drifting: any "max" ratio sitting at/above 85% of its cap.
  for (const c of result.ratioChecks) {
    if (c.direction === "max" && c.passes && c.threshold != null && c.threshold > 0) {
      if (c.value >= NEAR_LIMIT_FRACTION * c.threshold) {
        notes.push(`${c.label} at ${c.value.toFixed(1)}% — close to the ${c.threshold}% cap`);
      }
    }
  }
  if (notes.length === 0) return null;
  return { ticker, name, severity: "near", notes };
}

/** Map a set of screened holdings to drift items, most-severe first. */
export function scanDrift(
  holdings: Array<{ ticker: string; name: string; result: ScreeningResult }>,
): DriftItem[] {
  return holdings
    .map((h) => driftFlag(h.ticker, h.name, h.result))
    .filter((x): x is DriftItem => x !== null)
    .sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]);
}
