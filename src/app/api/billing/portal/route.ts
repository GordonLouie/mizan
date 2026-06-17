/**
 * POST /api/billing/portal — open the Stripe customer billing portal for the
 * signed-in user (manage/cancel subscription, update card). Plain REST, no SDK.
 * Inert until STRIPE_SECRET_KEY is set. Looks the customer up by session email.
 */
import { sessionEmail } from "@/lib/auth";

const SK = process.env.STRIPE_SECRET_KEY;
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://mizaninvesting.com";

export const runtime = "nodejs";

export async function POST() {
  if (!SK) return Response.json({ ok: false, reason: "billing not configured" });

  const email = await sessionEmail();
  if (!email) return Response.json({ ok: false, error: "not_signed_in" }, { status: 401 });

  try {
    // Find the Stripe customer by email.
    const lookup = await fetch(`https://api.stripe.com/v1/customers?email=${encodeURIComponent(email)}&limit=1`, {
      headers: { Authorization: `Bearer ${SK}` },
    });
    const customers = (await lookup.json()) as { data?: Array<{ id: string }> };
    const customerId = customers.data?.[0]?.id;
    if (!customerId) return Response.json({ ok: false, error: "no_customer" }, { status: 404 });

    const body = new URLSearchParams();
    body.set("customer", customerId);
    body.set("return_url", `${SITE}/account`);
    const res = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
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
