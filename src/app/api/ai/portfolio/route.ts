/**
 * POST /api/ai/portfolio (Phase 3b) — grounded AI portfolio assistant.
 *
 * Body: { holdings: [{ ticker, shares }], scholarId }
 * Returns: { report } — report.narrative is null when AI is disabled or the call
 * fails; the deterministic compliance facts + swaps are always present.
 *
 * Same inert-without-key + best-effort KV rate-limit posture as /api/ai/report.
 */
import { NextResponse } from "next/server";
import { generatePortfolioReport, generatePortfolioAnswer, type HoldingInput } from "@/lib/aiPortfolio";
import { getScholar } from "@/lib/scholars";
import { kvIncrWithTtl } from "@/lib/kv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DAILY_CAP = 40;
const MAX_HOLDINGS = 100;

export async function POST(req: Request) {
  let body: { holdings?: unknown; scholarId?: string; question?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  if (!Array.isArray(body.holdings) || body.holdings.length === 0) {
    return NextResponse.json({ error: "missing_holdings" }, { status: 400 });
  }

  const holdings: HoldingInput[] = body.holdings
    .filter((h): h is { ticker: string; shares: number } => !!h && typeof (h as { ticker?: unknown }).ticker === "string")
    .slice(0, MAX_HOLDINGS)
    .map((h) => ({ ticker: h.ticker, shares: Number(h.shares) || 0 }));

  if (holdings.length === 0) {
    return NextResponse.json({ error: "missing_holdings" }, { status: 400 });
  }

  if (body.scholarId === "custom") {
    return NextResponse.json({ error: "custom_unsupported" }, { status: 400 });
  }
  const scholar = getScholar(body.scholarId || "aaoifi");

  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "anon";
  const day = new Date().toISOString().slice(0, 10);
  const count = await kvIncrWithTtl(`ai:portfolio:${ip}:${day}`, 86_400);
  if (count !== null && count > DAILY_CAP) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const question = typeof body.question === "string" ? body.question.trim().slice(0, 500) : "";
  if (question) {
    const result = await generatePortfolioAnswer(holdings, scholar.id, question);
    return NextResponse.json({ answer: result.answer, aiEnabled: result.aiEnabled });
  }

  const report = await generatePortfolioReport(holdings, scholar.id);
  return NextResponse.json({ report });
}
