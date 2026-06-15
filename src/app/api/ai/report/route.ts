/**
 * POST /api/ai/report (Phase 3a) — generate a grounded AI compliance report.
 *
 * Body: { type: "stock", ticker: string, scholarId: string }
 * Returns: { report } where report.narrative is null if AI is disabled (no key)
 * or the model call failed — the client renders the deterministic facts either
 * way and shows an honest "AI not available" note.
 *
 * Cost protection: best-effort per-IP daily cap via KV (skipped when KV is
 * unconfigured). The endpoint is also naturally inert until ANTHROPIC_API_KEY
 * is set, since generation no-ops without it.
 */
import { NextResponse } from "next/server";
import { generateStockReport, findStock } from "@/lib/aiReport";
import { getScholar } from "@/lib/scholars";
import { kvIncrWithTtl } from "@/lib/kv";
import { getViewer } from "@/lib/auth";
import { tierMeets } from "@/lib/entitlements";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DAILY_CAP = 40;

export async function POST(req: Request) {
  // Server-side entitlement (defense-in-depth beyond the client paywall). Only
  // enforced once auth is configured, so pre-go-live behaviour is unchanged.
  const viewer = await getViewer(req);
  if (viewer.authConfigured && !tierMeets(viewer.tier, "retail")) {
    return NextResponse.json({ error: "upgrade_required" }, { status: 402 });
  }

  let body: { type?: string; ticker?: string; scholarId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const { type = "stock", ticker, scholarId } = body;
  if (type !== "stock") {
    return NextResponse.json({ error: "unsupported_type" }, { status: 400 });
  }
  if (!ticker || typeof ticker !== "string") {
    return NextResponse.json({ error: "missing_ticker" }, { status: 400 });
  }

  // "custom" thresholds live in the user's browser; the server can't replicate
  // them, so reject rather than emit a misleading (all-null) screen.
  if (scholarId === "custom") {
    return NextResponse.json({ error: "custom_unsupported" }, { status: 400 });
  }
  const scholar = getScholar(scholarId || "aaoifi");

  const stock = findStock(ticker);
  if (!stock) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  // Best-effort rate limit (per IP, per day). No-ops without KV.
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "anon";
  const day = new Date().toISOString().slice(0, 10);
  const count = await kvIncrWithTtl(`ai:report:${ip}:${day}`, 86_400);
  if (count !== null && count > DAILY_CAP) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const report = await generateStockReport(stock, scholar.id);
  return NextResponse.json({ report });
}
