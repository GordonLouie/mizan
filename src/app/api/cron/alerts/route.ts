/**
 * GET /api/cron/alerts — daily alert run (Vercel Cron target).
 *
 * For every subscribed ticker: recompute the verdict under each scholar, diff
 * against the last stored snapshot, and check for earnings within 3 days. Email
 * affected subscribers, then save the new snapshot.
 *
 * Safe to deploy before it's wired: if KV/Resend aren't configured it no-ops
 * and returns a status, so the cron firing daily does nothing harmful. Protect
 * it by setting CRON_SECRET (Vercel sends it as the Authorization header).
 */
import { kvConfigured, kvGetJson, kvSetJson } from "@/lib/kv";
import { emailConfigured, sendEmail } from "@/lib/email";
import { findStock } from "@/lib/data";
import { SCHOLAR_PROFILES, getScholar } from "@/lib/scholars";
import { screenStock } from "@/lib/screen";
import { isEtf } from "@/lib/etfInfo";

export const runtime = "nodejs";

interface Sub {
  email: string;
  tickers: string[];
  purpose: string;
  createdAt: string;
}

const NAMED = SCHOLAR_PROFILES.filter((s) => s.id !== "custom");

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }
  }
  if (!kvConfigured()) return Response.json({ ok: false, reason: "KV not configured" });

  const subs = (await kvGetJson<Sub[]>("mizan:subs")) ?? [];
  if (subs.length === 0) return Response.json({ ok: true, sent: 0, note: "no subscribers" });

  const snapshots = (await kvGetJson<Record<string, string>>("mizan:verdicts")) ?? {};
  const newSnapshots: Record<string, string> = { ...snapshots };

  const allTickers = Array.from(new Set(subs.flatMap((s) => s.tickers)));
  const changes: Record<string, string[]> = {};
  const earningsSoon = new Set<string>();
  const now = Date.now();

  for (const t of allTickers) {
    const stock = findStock(t);
    if (!stock) continue;

    if (stock.nextEarningsDate) {
      const days = (new Date(stock.nextEarningsDate).getTime() - now) / 86_400_000;
      if (days >= 0 && days <= 3) earningsSoon.add(t);
    }
    if (isEtf(stock)) continue;

    for (const sc of NAMED) {
      const v = screenStock(stock, getScholar(sc.id)).verdict;
      const key = `${t}:${sc.id}`;
      const prev = snapshots[key];
      if (prev && prev !== v) (changes[t] ??= []).push(`${sc.short}: ${prev} → ${v}`);
      newSnapshots[key] = v;
    }
  }

  let sent = 0;
  if (emailConfigured()) {
    for (const sub of subs) {
      const lines: string[] = [];
      for (const t of sub.tickers) {
        if (changes[t]) lines.push(`<b>${t}</b> verdict changed — ${changes[t].join("; ")}`);
        if (earningsSoon.has(t)) lines.push(`<b>${t}</b> reports earnings within 3 days.`);
      }
      if (lines.length === 0) continue;
      const html =
        `<p>Updates on the stocks you're watching on HalalGauge:</p>` +
        `<ul>${lines.map((l) => `<li>${l}</li>`).join("")}</ul>` +
        `<p><a href="https://mizaninvesting.com/screen">Open HalalGauge</a></p>` +
        `<p style="color:#888;font-size:12px">You're getting this because you asked for alerts at mizaninvesting.com.</p>`;
      if (await sendEmail(sub.email, "HalalGauge — watchlist update", html)) sent++;
    }
  }

  await kvSetJson("mizan:verdicts", newSnapshots);

  return Response.json({
    ok: true,
    subscribers: subs.length,
    changedTickers: Object.keys(changes).length,
    earningsSoon: earningsSoon.size,
    emailsSent: sent,
    emailConfigured: emailConfigured(),
  });
}
