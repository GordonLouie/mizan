/**
 * POST /api/indexes/custom (v3) — build a custom halal BASKET on the fly.
 * Body: { scholarId, theme, size }
 * Returns the constituents + present-tense analytics (yield, debt, dividends to
 * purify, drift watch). NO backtest — a screened-universe backtest is biased by
 * survivorship/look-ahead, so we describe what the basket IS, not a fake history.
 */
import { NextResponse } from "next/server";
import { getScholar } from "@/lib/scholars";
import { type IndexDef, indexConstituents, indexAnalytics } from "@/lib/indexes";
import { getViewer } from "@/lib/auth";
import { tierMeets } from "@/lib/entitlements";
import { kvIncrWithTtl } from "@/lib/kv";
import type { StockFundamentals } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DAILY_CAP = 80;

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
    thesis: "",
    risk: "Core",
    scholarId: scholar.id,
    filter: THEMES[theme],
    size,
  };

  const cons = indexConstituents(def);
  const a = indexAnalytics(def);

  return NextResponse.json({
    name: def.name,
    scholarLabel: scholar.label,
    themeLabel: THEME_LABEL[theme],
    size,
    analytics: {
      count: a.count,
      weightedDivYieldPct: a.weightedDivYieldPct,
      medianDebtPct: a.medianDebtPct,
      purificationPctOfDividends: a.purificationPctOfDividends,
      sectorMix: a.sectorMix,
      atRisk: a.atRisk,
    },
    constituents: cons.map((s) => ({ ticker: s.ticker, name: s.name, sector: s.sector, marketCapUsd: s.marketCapUsd })),
  });
}
