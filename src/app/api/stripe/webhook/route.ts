/**
 * POST /api/stripe/webhook — Stripe webhook (Phase 0c).
 *
 * On checkout.session.completed it records the customer's tier in KV
 * (mizan:tiers = { email: "retail" | "institutional" }). On subscription
 * cancellation it downgrades them. Verifies the Stripe signature with the raw
 * body (no SDK). Inert until STRIPE_WEBHOOK_SECRET is set.
 *
 * NOTE: connecting a logged-in browser to its KV tier needs the sign-in step
 * (deferred — see PHASE0_SETUP.md). This route is the billing→entitlement half.
 */
import crypto from "crypto";
import { kvConfigured, kvGetJson, kvSetJson } from "@/lib/kv";

const WH = process.env.STRIPE_WEBHOOK_SECRET;

export const runtime = "nodejs";

function verify(payload: string, header: string, secret: string): boolean {
  try {
    const parts: Record<string, string> = {};
    for (const kv of header.split(",")) {
      const [k, v] = kv.split("=");
      if (k && v) parts[k.trim()] = v.trim();
    }
    const t = parts["t"];
    const v1 = parts["v1"];
    if (!t || !v1) return false;
    const expected = crypto.createHmac("sha256", secret).update(`${t}.${payload}`).digest("hex");
    const a = Buffer.from(expected);
    const b = Buffer.from(v1);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  if (!WH) return Response.json({ ok: false, reason: "webhook not configured" });

  const raw = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";
  if (!verify(raw, sig, WH)) return Response.json({ ok: false, error: "bad signature" }, { status: 400 });

  let event: { type?: string; data?: { object?: Record<string, unknown> } };
  try {
    event = JSON.parse(raw);
  } catch {
    return Response.json({ ok: false, error: "bad payload" }, { status: 400 });
  }

  if (kvConfigured()) {
    const obj = (event.data?.object ?? {}) as Record<string, unknown>;
    const details = obj["customer_details"] as { email?: string } | undefined;
    const email = (details?.email ?? (obj["customer_email"] as string | undefined) ?? "").toLowerCase();
    if (email) {
      const map = (await kvGetJson<Record<string, string>>("mizan:tiers")) ?? {};
      if (event.type === "checkout.session.completed") {
        map[email] = "retail"; // TODO: derive retail vs institutional from the price id
        await kvSetJson("mizan:tiers", map);
      } else if (event.type === "customer.subscription.deleted") {
        delete map[email];
        await kvSetJson("mizan:tiers", map);
      }
    }
  }

  return Response.json({ received: true });
}
