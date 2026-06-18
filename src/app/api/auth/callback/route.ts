/**
 * GET /api/auth/callback?token=… — consume a magic link and start a session.
 * Sets an httpOnly, Secure, SameSite=Lax session cookie, then redirects to
 * /account. On an invalid/expired/used token, redirects to /account?error=link.
 */
import { NextResponse } from "next/server";
import { consumeMagicToken, createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://halalgauge.com";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") || "";

  const email = await consumeMagicToken(token);
  if (!email) {
    return NextResponse.redirect(`${SITE}/account?error=link`);
  }

  const res = NextResponse.redirect(`${SITE}/account?signedin=1`);
  res.cookies.set(SESSION_COOKIE, createSessionToken(email), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
