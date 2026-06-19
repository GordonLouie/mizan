/**
 * reconcile.ts — multi-standard RECONCILIATION. Client-safe, deterministic.
 *
 * The category's open wound (per market research) is that halal apps DISAGREE on
 * the same stock, with no explanation. HalalGauge already shows the five verdicts
 * side by side; this engine adds the missing piece: a consensus read + a plain-
 * English explanation of WHY the standards differ, derived from the exact
 * threshold each scholar applies. Same asset wins retail trust AND the
 * institutional "auditable lineage" pitch.
 */
import type { StockFundamentals, ScholarProfile, Verdict } from "./types";

export interface ScholarVerdict {
  id: string;
  short: string;
  verdict: Verdict;
}

export interface Divergence {
  /** Short axis label, e.g. "Illiquid-asset floor". */
  axis: string;
  /** Plain-language explanation of who splits and why. */
  explanation: string;
}

export interface Reconciliation {
  passCount: number;
  total: number;
  label: string;
  agreement: "unanimous" | "majority" | "split";
  divergences: Divergence[];
}

const fmtList = (xs: string[]): string =>
  xs.length <= 1 ? (xs[0] ?? "") : xs.length === 2 ? `${xs[0]} and ${xs[1]}` : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`;

function sectorPasses(stock: StockFundamentals, sc: ScholarProfile): boolean {
  return !stock.sectorFlags.some((f) => sc.excludedSectors.includes(f));
}

/** Partition scholars by whether they pass a single max-direction ratio axis. */
function splitOnMax(
  scholars: ScholarProfile[],
  value: number,
  cap: (sc: ScholarProfile) => number | null,
): { pass: ScholarProfile[]; fail: ScholarProfile[] } {
  const pass: ScholarProfile[] = [];
  const fail: ScholarProfile[] = [];
  for (const sc of scholars) {
    const c = cap(sc);
    if (c == null) pass.push(sc); // no screen on this axis = not a failure cause
    else if (value <= c + 1e-9) pass.push(sc);
    else fail.push(sc);
  }
  return { pass, fail };
}

export function reconcile(
  stock: StockFundamentals,
  scholars: ScholarProfile[],
  verdicts: ScholarVerdict[],
): Reconciliation {
  const total = verdicts.length;
  const passCount = verdicts.filter((v) => v.verdict === "pass").length;

  let agreement: Reconciliation["agreement"];
  let label: string;
  if (passCount === total) { agreement = "unanimous"; label = `All ${total} standards rate ${stock.ticker} halal`; }
  else if (passCount === 0) { agreement = "unanimous"; label = `No standard rates ${stock.ticker} halal`; }
  else if (passCount >= Math.ceil(total / 2)) { agreement = "majority"; label = `Halal under ${passCount} of ${total} standards`; }
  else { agreement = "split"; label = `Halal under only ${passCount} of ${total} standards`; }

  const divergences: Divergence[] = [];
  const named = scholars.filter((s) => s.id !== "custom");

  // "Why they differ" only makes sense when the FINAL verdicts actually split
  // (some pass, some don't). On a unanimous verdict, per-axis splits would
  // misleadingly imply some standards pass when none do.
  if (!(passCount > 0 && passCount < total)) {
    return { passCount, total, label, agreement, divergences };
  }

  // 1. Illiquid-asset floor — the signature differentiator (Mufti Taqi only).
  {
    const floorScholars = named.filter((s) => s.minIlliquidAssetsToTotalAssetsPct != null);
    const v = stock.illiquidAssetsToTotalAssetsPct;
    const failing = floorScholars.filter((s) => v < (s.minIlliquidAssetsToTotalAssetsPct as number));
    if (failing.length > 0 && failing.length < total) {
      const floor = failing[0].minIlliquidAssetsToTotalAssetsPct;
      divergences.push({
        axis: "Illiquid-asset floor",
        explanation: `Tangible (illiquid) assets are ${v.toFixed(1)}% of total. ${fmtList(failing.map((s) => s.short))} require at least ${floor}% — the only standard${failing.length > 1 ? "s" : ""} that imposes this floor — so ${stock.ticker} fails there while the others, which have no such rule, pass.`,
      });
    }
  }

  // 2. Sector exclusion — when standards disagree on the business itself.
  {
    const failing = named.filter((s) => !sectorPasses(stock, s));
    const passing = named.filter((s) => sectorPasses(stock, s));
    if (failing.length > 0 && passing.length > 0) {
      divergences.push({
        axis: "Business activity",
        explanation: `${fmtList(failing.map((s) => s.short))} exclude ${stock.ticker}'s business activity, while ${fmtList(passing.map((s) => s.short))} permit it — the standards draw the sector line differently.`,
      });
    }
  }

  // 3. Interest-bearing debt cap (30% vs 33% vs 0% strict).
  {
    const { pass, fail } = splitOnMax(named, stock.debtToMarketCapPct, (s) => s.maxDebtToMarketCapPct);
    if (fail.length > 0 && pass.length > 0) {
      const failCaps = Array.from(new Set(fail.map((s) => s.maxDebtToMarketCapPct))).sort((a, b) => (a ?? 0) - (b ?? 0));
      const passCaps = Array.from(new Set(pass.map((s) => s.maxDebtToMarketCapPct).filter((c) => c != null))).sort((a, b) => (a as number) - (b as number));
      divergences.push({
        axis: "Debt cap",
        explanation: `Interest-bearing debt is ${stock.debtToMarketCapPct.toFixed(1)}% of market cap — over the ${failCaps.map((c) => `${c}%`).join("/")} cap used by ${fmtList(fail.map((s) => s.short))}, but within ${passCaps.length ? `the ${passCaps.map((c) => `${c}%`).join("/")} cap of ` : ""}${fmtList(pass.map((s) => s.short))}.`,
      });
    }
  }

  // 4. Cash + securities cap.
  {
    const { pass, fail } = splitOnMax(named, stock.cashSecuritiesToMarketCapPct, (s) => s.maxCashSecuritiesToMarketCapPct);
    if (fail.length > 0 && pass.length > 0) {
      divergences.push({
        axis: "Cash & securities cap",
        explanation: `Cash + interest-bearing securities are ${stock.cashSecuritiesToMarketCapPct.toFixed(1)}% of market cap — above the limit ${fmtList(fail.map((s) => s.short))} apply, but within ${fmtList(pass.map((s) => s.short))}'s.`,
      });
    }
  }

  // 5. Receivables cap (only DJIM screens this).
  {
    const { pass, fail } = splitOnMax(named, stock.receivablesToMarketCapPct, (s) => s.maxReceivablesToMarketCapPct);
    if (fail.length > 0 && pass.length > 0) {
      divergences.push({
        axis: "Receivables cap",
        explanation: `Receivables are ${stock.receivablesToMarketCapPct.toFixed(1)}% of market cap. ${fmtList(fail.map((s) => s.short))} cap them (the only standard${fail.length > 1 ? "s" : ""} that screens receivables); the others don't screen this at all.`,
      });
    }
  }

  // 6. Impermissible income (strict = 0%).
  {
    const { pass, fail } = splitOnMax(named, stock.impermissibleIncomePct, (s) => s.maxImpermissibleIncomePct);
    if (fail.length > 0 && pass.length > 0) {
      divergences.push({
        axis: "Impermissible income",
        explanation: `Impermissible (mostly interest) income is ${stock.impermissibleIncomePct.toFixed(1)}% of revenue — ${fmtList(fail.map((s) => s.short))} allow ${Math.max(...fail.map((s) => s.maxImpermissibleIncomePct))}% here, the others up to ${Math.max(...pass.map((s) => s.maxImpermissibleIncomePct))}%.`,
      });
    }
  }

  return { passCount, total, label, agreement, divergences };
}
