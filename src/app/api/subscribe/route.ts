/**
 * POST /api/subscribe — capture an email + (optional) ticker for alerts.
 *
 * Two behaviours, both safe with no extra setup:
 *  1. Always forwards to Web3Forms so the signup lands in hello@'s inbox today
 *     (server-side key — not exposed to the browser, unlike the old client POST).
 *  2. If a KV store is configured, also persists the subscription so the daily
 *     cron (/api/cron/alerts) can email verdict-change / earnings updates.
 */
import { kvConfigured, kvGetJson, kvSetJson } from "@/lib/kv";

const WEB3FORMS_KEY = "4a6a5ea7-284c-4d45-b05c-1d661bd64a8b";

interface Sub {
  email: string;
  tickers: string[];
  purpose: string;
  createdAt: string;
}

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const email = String(body.email ?? "").trim().toLowerCase();
  const ticker = String(body.context ?? body.ticker ?? "").toUpperCase().trim();
  const purpose = String(body.purpose ?? "alerts");

  if (!email.includes("@")) {
    return Response.json({ ok: false, error: "invalid email" }, { status: 400 });
  }

  // 1. Persist to KV if available (read-modify-write; fine at this scale).
  if (kvConfigured()) {
    const subs = (await kvGetJson<Sub[]>("mizan:subs")) ?? [];
    const existing = subs.find((s) => s.email === email);
    if (existing) {
      if (ticker && !existing.tickers.includes(ticker)) existing.tickers.push(ticker);
    } else {
      subs.push({ email, tickers: ticker ? [ticker] : [], purpose, createdAt: new Date().toISOString() });
    }
    await kvSetJson("mizan:subs", subs);
  }

  // 2. Always forward to Web3Forms so you see it immediately.
  try {
    await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: `[HalalGauge signup] ${purpose}${ticker ? `: ${ticker}` : ""}`,
        email,
        ticker,
        purpose,
      }),
    });
  } catch {
    /* non-fatal */
  }

  return Response.json({ ok: true });
}
