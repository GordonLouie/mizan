# Engine 3 — Retention loop: what's live, what to wire

Retention is the metric that makes all the SEO traffic compound (and the signal
your validation gate needs). Here's what shipped, and the exact build for the
part that needs a backend.

## Live now (no backend, works today)

- **`EmailCapture` component** (`src/components/EmailCapture.tsx`) — a single
  optional email field, NOT a signup wall. Submits via Web3Forms (same key as
  the feedback bubble) so addresses land in **hello@mizaninvesting.com** with no
  database.
- **Wired into the "ticker not found" state** on `/screen`: "Email me when
  {TICKER} is added." This captures coverage demand — every request is both a
  lead and a vote for which ticker to add next.

That alone starts building a list and a retention hook. You can drop
`<EmailCapture purpose="alerts" .../>` anywhere else (e.g. a stock page) too.

## UPDATE: the alert-sending code is now BUILT

The routes and helpers below are all written and deployed (inert until you add
the env vars). You no longer have to write code — just provision two services
and set env vars:

- `src/lib/kv.ts` — KV access over REST (no npm dep)
- `src/lib/email.ts` — Resend over REST (no npm dep)
- `src/app/api/subscribe/route.ts` — saves signups (KV) + forwards to hello@
- `src/app/api/cron/alerts/route.ts` — daily diff + email; CRON_SECRET-protected
- `vercel.json` — cron schedule (`0 13 * * *` ≈ 9pm HK)
- `EmailCapture` already POSTs to `/api/subscribe`.

**To activate (≈20 min, no coding):**
1. **Vercel → Storage → Create → KV** (Upstash). Connect it to the mizan
   project — Vercel auto-injects `KV_REST_API_URL` + `KV_REST_API_TOKEN`. Now
   signups persist and `kvConfigured()` flips true.
2. **Resend** — sign up, add + verify `mizaninvesting.com` (DNS on Cloudflare,
   ~10 min), create an API key. In Vercel env vars set `RESEND_API_KEY` and
   optionally `ALERTS_FROM` (default `Mizan <alerts@mizaninvesting.com>`).
3. **Set `CRON_SECRET`** to any random string in Vercel env vars (protects the
   cron route).
4. **Redeploy.** The cron fires daily; until KV+Resend exist it safely no-ops.

Test the cron manually: `GET https://mizaninvesting.com/api/cron/alerts` with
header `Authorization: Bearer <CRON_SECRET>` → returns a JSON status.

---

## Reference: how it works (already implemented)

The list becomes *return visits* — "AAPL reports in 3 days" / "a stock on your
watchlist changed halal status" — via three pieces (now wired):

**1. A store** (subscriptions + last-known verdicts). Easiest on Vercel:
- **Vercel KV** (Redis) or **Vercel Postgres**. Shape:
  ```
  subscriptions: { email, tickers: string[], createdAt }
  verdictSnapshots: { ticker, scholarId, verdict }   // last sent state
  ```
- Point `EmailCapture` at an API route that writes to this store instead of
  Web3Forms (swap the `fetch` URL).

**2. An email sender** — **Resend** (cleanest with Next). Get an API key, verify
the mizaninvesting.com domain (you already control DNS on Cloudflare), then:
  ```ts
  import { Resend } from "resend";
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({ from: "alerts@mizaninvesting.com", to, subject, html });
  ```

**3. A daily cron** — Vercel Cron hits an API route once a day:
- `src/app/api/cron/alerts/route.ts`:
  ```ts
  export async function GET(req: Request) {
    // 0. auth: check req has the CRON_SECRET header
    // 1. recompute verdicts for all subscribed tickers (screenStock + scholars)
    // 2. diff against verdictSnapshots; collect changes
    // 3. find upcoming earnings (stock.nextEarningsDate within 3 days)
    // 4. for each affected subscriber, resend.emails.send(...)
    // 5. update verdictSnapshots
    return Response.json({ ok: true });
  }
  ```
- `vercel.json`:
  ```json
  { "crons": [{ "path": "/api/cron/alerts", "schedule": "0 13 * * *" }] }
  ```
  (13:00 UTC ≈ 9pm HK. Protect the route with a `CRON_SECRET` env var.)

**Env vars to add:** `RESEND_API_KEY`, `CRON_SECRET`, and your KV/Postgres
connection vars (Vercel injects these when you create the store).

## Web push (alternative / addition)

No email needed, higher open rates, but more moving parts: a service worker +
VAPID keys + storing push subscriptions. Use `web-push` on the server. Worth it
later; email is the faster first win.

## Suggested order

1. Ship `EmailCapture` as-is (done) — start collecting today.
2. When you have a handful of signups, wire the store + Resend + cron (a focused
   day for your engineer friend).
3. Add web push only if email open rates aren't enough.

## Why this matters (don't skip it)

Engine 1 (SEO) brings strangers; Engine 3 brings them *back*. Without a return
reason, traffic is a leaky bucket. The alert system is the cheapest reason to
return — and "did people come back" is exactly the retention signal your 30-day
gate turns on.
