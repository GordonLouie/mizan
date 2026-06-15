/**
 * POST /api/ai/ask (Phase 3c) — AI scholar Q&A fallback for the /ask page.
 *
 * Body: { question, scholarId }
 * Returns: { result } (result.answer is null when AI is disabled / call fails).
 *
 * This is a FREE, public acquisition surface (unlike the Pro AI reports), so it's
 * ungated — but KV-rate-limited per IP/day, and naturally inert without the key.
 */
import { NextResponse } from "next/server";
import { generateAskAnswer } from "@/lib/aiAsk";
import { kvIncrWithTtl } from "@/lib/kv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DAILY_CAP = 30;
const MAX_LEN = 500;

export async function POST(req: Request) {
  let body: { question?: string; scholarId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const question = (body.question || "").toString().trim().slice(0, MAX_LEN);
  if (!question) {
    return NextResponse.json({ error: "missing_question" }, { status: 400 });
  }
  const scholarId = body.scholarId === "custom" || !body.scholarId ? "aaoifi" : body.scholarId;

  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "anon";
  const day = new Date().toISOString().slice(0, 10);
  const count = await kvIncrWithTtl(`ai:ask:${ip}:${day}`, 86_400);
  if (count !== null && count > DAILY_CAP) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const result = await generateAskAnswer(question, scholarId);
  return NextResponse.json({ result });
}
