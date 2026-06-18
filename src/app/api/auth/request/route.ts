/**
 * POST /api/auth/request — send a passwordless sign-in link.
 * Body: { email }
 *
 * Always returns { ok: true } when the input is a valid email (we don't reveal
 * whether sending actually happened, to avoid email enumeration). Inert unless
 * AUTH_SECRET + Resend are configured. KV-rate-limited per email + per IP.
 */
import { NextResponse } from "next/server";
import { authConfigured, createMagicToken, normalizeEmail, isValidEmail } from "@/lib/auth";
import { emailConfigured, sendEmail } from "@/lib/email";
import { kvIncrWithTtl } from "@/lib/kv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://mizaninvesting.com";

export async function POST(req: Request) {
  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const email = normalizeEmail(body.email || "");
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  if (!authConfigured() || !emailConfigured()) {
    // Don't pretend it worked — the UI shows an honest "not enabled yet" note.
    return NextResponse.json({ ok: false, reason: "auth_not_configured" });
  }

  // Rate limit: 5/email/hour and 20/IP/hour.
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "anon";
  const hour = new Date().toISOString().slice(0, 13);
  const perEmail = await kvIncrWithTtl(`auth:req:email:${email}:${hour}`, 3600);
  const perIp = await kvIncrWithTtl(`auth:req:ip:${ip}:${hour}`, 3600);
  if ((perEmail !== null && perEmail > 5) || (perIp !== null && perIp > 20)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const token = await createMagicToken(email);
  const link = `${SITE}/api/auth/callback?token=${encodeURIComponent(token)}`;
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#1f2937">
      <h2 style="color:#1B2D4A;margin:0 0 12px">Sign in to HalalGauge</h2>
      <p style="font-size:15px;line-height:1.6">Click the button below to sign in. This link expires in 15 minutes and can be used once.</p>
      <p style="margin:24px 0"><a href="${link}" style="background:#1B2D4A;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600;display:inline-block">Sign in to HalalGauge</a></p>
      <p style="font-size:12px;color:#6b7280">If you didn't request this, you can ignore this email.</p>
    </div>`;
  await sendEmail(email, "Your HalalGauge sign-in link", html);

  return NextResponse.json({ ok: true });
}
