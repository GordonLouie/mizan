/**
 * auth.ts (Phase 4) — passwordless magic-link auth. SERVER-ONLY.
 *
 * Design (fits HalalGauge's REST + inert-until-keyed stack — no npm deps, no vendor):
 *  - A magic-link token is an HMAC-signed, short-lived (15 min), single-use blob.
 *    The user requests it by email; clicking it sets a session.
 *  - A session is a separate HMAC-signed token stored in an httpOnly, Secure,
 *    SameSite=Lax cookie (30 days).
 *  - Entitlement (tier) is NOT in the token — it's looked up live from KV
 *    (mizan:tiers, written by the Stripe webhook), so upgrades/cancellations take
 *    effect immediately and a stale cookie can't grant access.
 *
 * INERT until AUTH_SECRET is set (authConfigured() === false). Sending links also
 * needs Resend (email.ts). SECURITY NOTE: this is hand-rolled; have it reviewed
 * before it guards anything truly sensitive. It only gates paid features here.
 */
import crypto from "crypto";
import { currentUser } from "@clerk/nextjs/server";
import { kvGetJson, kvSetJsonWithTtl, kvDel, kvConfigured } from "./kv";
import type { Tier } from "./entitlements";

/** Auth is now handled by Clerk. These helpers read the Clerk session and map
 *  the email to a KV tier. (The legacy magic-link code below is retained but
 *  unused — Clerk supplies Google / email / password sign-in.) */
export function clerkConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
}

/** The signed-in user's email (lowercased) from Clerk, or null. */
export async function sessionEmail(): Promise<string | null> {
  if (!clerkConfigured()) return null;
  try {
    const u = await currentUser();
    const e = u?.primaryEmailAddress?.emailAddress ?? u?.emailAddresses?.[0]?.emailAddress ?? null;
    return e ? e.toLowerCase() : null;
  } catch {
    return null;
  }
}

const SECRET = process.env.AUTH_SECRET;
export const SESSION_COOKIE = "mizan_session";
const SESSION_TTL_S = 60 * 60 * 24 * 30; // 30 days
const MAGIC_TTL_S = 60 * 15; // 15 minutes

export function authConfigured(): boolean {
  return !!SECRET && SECRET.length >= 16;
}

// ── base64url + HMAC helpers ────────────────────────────────────────────────
function b64url(buf: Buffer | string): string {
  return Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function fromB64url(s: string): Buffer {
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}
function hmac(data: string): string {
  return b64url(crypto.createHmac("sha256", SECRET!).update(data).digest());
}
function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a), bb = Buffer.from(b);
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}

interface TokenPayload {
  email: string;
  typ: "magic" | "session";
  exp: number; // unix seconds
  nonce?: string;
}

function signToken(payload: TokenPayload): string {
  const body = b64url(JSON.stringify(payload));
  return `${body}.${hmac(body)}`;
}
function verifyToken(token: string, typ: TokenPayload["typ"]): TokenPayload | null {
  if (!authConfigured() || !token || !token.includes(".")) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig || !safeEqual(sig, hmac(body))) return null;
  try {
    const payload = JSON.parse(fromB64url(body).toString()) as TokenPayload;
    if (payload.typ !== typ) return null;
    if (typeof payload.exp !== "number" || payload.exp < Math.floor(Date.now() / 1000)) return null;
    if (!payload.email) return null;
    return payload;
  } catch {
    return null;
  }
}

// ── email normalisation ─────────────────────────────────────────────────────
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email);
}

// ── magic link ──────────────────────────────────────────────────────────────
export async function createMagicToken(email: string): Promise<string> {
  const nonce = b64url(crypto.randomBytes(16));
  const token = signToken({ email, typ: "magic", exp: Math.floor(Date.now() / 1000) + MAGIC_TTL_S, nonce });
  // Single-use: remember the nonce as "unused". Consumed on callback. If KV is
  // unconfigured we fall back to expiry-only (still HMAC-signed + 15 min).
  if (kvConfigured()) await kvSetJsonWithTtl(`auth:magic:${nonce}`, { email }, MAGIC_TTL_S);
  return token;
}

/** Verify a magic token and consume its nonce. Returns the email or null. */
export async function consumeMagicToken(token: string): Promise<string | null> {
  const payload = verifyToken(token, "magic");
  if (!payload) return null;
  if (kvConfigured() && payload.nonce) {
    const rec = await kvGetJson<{ email: string }>(`auth:magic:${payload.nonce}`);
    if (!rec) return null; // already used or expired
    await kvDel(`auth:magic:${payload.nonce}`);
  }
  return payload.email;
}

// ── session ─────────────────────────────────────────────────────────────────
export function createSessionToken(email: string): string {
  return signToken({ email, typ: "session", exp: Math.floor(Date.now() / 1000) + SESSION_TTL_S });
}
export const SESSION_MAX_AGE = SESSION_TTL_S;

function readCookie(req: Request, name: string): string | null {
  const header = req.headers.get("cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return null;
}

export function getSessionEmail(req: Request): string | null {
  const token = readCookie(req, SESSION_COOKIE);
  if (!token) return null;
  const payload = verifyToken(token, "session");
  return payload?.email ?? null;
}

// ── tier (entitlement) ──────────────────────────────────────────────────────
export async function getTier(email: string | null): Promise<Tier> {
  if (!email) return "free";
  const map = (await kvGetJson<Record<string, string>>("mizan:tiers")) ?? {};
  const t = map[normalizeEmail(email)];
  return t === "retail" || t === "institutional" ? t : "free";
}

export interface Viewer {
  email: string | null;
  tier: Tier;
  authConfigured: boolean;
}

/** The authoritative, server-validated viewer (Clerk session → KV tier). */
export async function getViewer(): Promise<Viewer> {
  if (!clerkConfigured()) return { email: null, tier: "free", authConfigured: false };
  const email = await sessionEmail();
  const tier = await getTier(email);
  return { email, tier, authConfigured: true };
}
