/**
 * POST /api/indexes/custom (v2) — build a custom halal index on the fly.
 * Body: { scholarId, theme, size }
 * Returns the constituents + backtest series + risk stats vs S&P. Real data only.
 */
import { NextResponse } from "next/server";
import { getScholar } from "@/lib/scholars";
import { type IndexDef } from "@/lib/indexes";
import { indexPerformance, benchmarkStats } from "@/lib/indexes.server";
import { getViewer } from "@/lib/auth";
import { tierMeets } from "@/lib/entitlements";
import { kvIncrWithTtl } from "@/lib/kv";
import type { StockFundamentals } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DAILY_CAP = 60; // backtests are compute-heavy; cap per IP/day

const THEMES: Record<string, (s: StockFundamentals) => boolean> = {
  any: () => true,
  technology: (s) => s.sector === "Technology",
  healthcare: (s) => s.sector === "Healthcare",
  energy: (s) => s.sector === "Energy",
  consumer: (s) => /consumer/i.test(s.sector || ""),
  dividend: (s) => (s.dividendYieldPct ?? 0) >= 1.5,
};
const THEME_LABEL: Record<string, string> = {
  any: "All sectors", technology: "Technology", healthcare: "Healthcare",
  energy: "Energy", consumer: "Consumer", dividend: "Dividend payers",
};

export async function POST(req: Request) {
  // The custom builder is a Pro feature — enforce server-side (once auth is on),
  // not just in the UI. And rate-limit because each call runs a full backtest.
  const viewer = await getViewer();
  if (viewer.authConfigured && !tierMeets(viewer.tier, "retail")) {
    return NextResponse.json({ error: "upgrade_required" }, { status: 402 });
  }
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "anon";
  const day = new Date().toISOString().slice(0, 10);
  const count = await kvIncrWithTtl(`idx:custom:${ip}:${day}`, 86_400);
  if (count !== null && count > DAILY_CAP) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: { scholarId?: string; theme?: string; size?: number };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad_request" }, { status: 400 }); }

  if (body.scholarId === "custom") {
    return NextResponse.json({ error: "custom_unsupported" }, { status: 400 });
  }
  const scholar = getScholar(body.scholarId || "aaoifi");
  const theme = body.theme && THEMES[body.theme] ? body.theme : "any";
  const size = Math.min(Math.max(Number(body.size) || 25, 5), 50);

  const def: IndexDef = {
    slug: "custom",
    name: `${THEME_LABEL[theme]} · ${scholar.short} · ${size}`,
    tagline: "",
    risk: "Core",
    scholarId: scholar.id,
    filter: THEMES[theme],
    size,
  };

  const perf = indexPerformance(def);
  const spy = benchmarkStats("SPY");

  return NextResponse.json({
    name: def.name,
    scholarLabel: scholar.label,
    themeLabel: THEME_LABEL[theme],
    size,
    totalReturn: perf.totalReturn,
    stats: perf.stats,
    indexPct: perf.indexPct,
    spyPct: perf.spyPct,
    spusPct: perf.spusPct,
    spy: { totalReturnPct: spy.totalReturnPct, stats: spy.stats },
    constituents: perf.constituents.map((s) => ({ ticker: s.ticker, name: s.name, sector: s.sector, marketCapUsd: s.marketCapUsd })),
    excluded: perf.excluded.length + perf.excludedAnomalous.length,
  });
}
