/**
 * POST /api/checkout — start a Stripe Checkout session for Mizan Pro.
 * Body: { plan?: "monthly" | "annual" }
 *
 * Plain REST (no Stripe SDK / npm dep). Inert until STRIPE_SECRET_KEY +
 * STRIPE_PRICE_RETAIL (monthly) are set; STRIPE_PRICE_RETAIL_ANNUAL is optional.
 * Attaches the signed-in user's email so the webhook can map the subscription to
 * the right account.
 */
import { getSessionEmail } from "@/lib/auth";

const SK = process.env.STRIPE_SECRET_KEY;
const PRICE_MONTHLY = process.env.STRIPE_PRICE_RETAIL;
const PRICE_ANNUAL = process.env.STRIPE_PRICE_RETAIL_ANNUAL;
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://mizaninvesting.com";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { plan = "monthly", email: bodyEmail } =
    ((await req.json().catch(() => ({}))) as { plan?: string; email?: string });

  const price = plan === "annual" ? PRICE_ANNUAL || PRICE_MONTHLY : PRICE_MONTHLY;
  if (!SK || !price) {
    return Response.json({ ok: false, reason: "billing not configured" });
  }

  // Prefer the authenticated session email so billing ties to the account.
  const email = getSessionEmail(req) || bodyEmail;

  const body = new URLSearchParams();
  body.set("mode", "subscription");
  body.set("line_items[0][price]", price);
  body.set("line_items[0][quantity]", "1");
  body.set("success_url", `${SITE}/account?upgraded=1`);
  body.set("cancel_url", `${SITE}/pricing`);
  body.set("allow_promotion_codes", "true");
  if (email) body.set("customer_email", email);

  try {
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { Authorization: `Bearer ${SK}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    const data = (await res.json()) as { url?: string; error?: { message?: string } };
    if (!res.ok) return Response.json({ ok: false, error: data?.error?.message ?? "stripe error" }, { status: 500 });
    return Response.json({ ok: true, url: data.url });
  } catch {
    return Response.json({ ok: false, error: "network error" }, { status: 500 });
  }
}
