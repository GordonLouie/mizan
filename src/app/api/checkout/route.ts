/**
 * POST /api/checkout — start a Stripe Checkout session for the retail (Pro) tier.
 *
 * Plain REST (no Stripe SDK / npm dep). Inert until you set STRIPE_SECRET_KEY +
 * STRIPE_PRICE_RETAIL, so it never breaks the build. When configured, returns
 * { url } and the client redirects to Stripe's hosted checkout.
 */
const SK = process.env.STRIPE_SECRET_KEY;
const PRICE_RETAIL = process.env.STRIPE_PRICE_RETAIL;
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://mizaninvesting.com";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!SK || !PRICE_RETAIL) {
    return Response.json({ ok: false, reason: "billing not configured" });
  }
  const { email } = (await req.json().catch(() => ({}))) as { email?: string };

  const body = new URLSearchParams();
  body.set("mode", "subscription");
  body.set("line_items[0][price]", PRICE_RETAIL);
  body.set("line_items[0][quantity]", "1");
  body.set("success_url", `${SITE}/?upgraded=1`);
  body.set("cancel_url", `${SITE}/`);
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
