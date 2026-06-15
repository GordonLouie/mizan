/**
 * GET /api/v1/screen (Phase 4c) — institutional bulk screening export.
 *
 * Auth: Authorization: Bearer <api-key> (issued via KV mizan:apikeys, must map to
 * the institutional tier). Inert until KV holds at least one institutional key.
 *
 * Query params:
 *   tickers  comma-separated (e.g. AAPL,MSFT). Omit for the largest `limit` names.
 *   scholar  scholar id (default aaoifi). "custom" is rejected (server can't see it).
 *   format   json (default) | csv
 *   limit    max rows when tickers omitted (default 100, max 1000)
 *
 * Returns deterministic screening results only — no AI, no fabrication.
 */
import { NextResponse } from "next/server";
import { listStocks } from "@/lib/data";
import { screenStock } from "@/lib/screen";
import { getScholar } from "@/lib/scholars";
import { bearer, getApiKeyOwner } from "@/lib/apiKeys";
import { tierMeets } from "@/lib/entitlements";
import { kvIncrWithTtl } from "@/lib/kv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DAILY_CAP = 5000;

export async function GET(req: Request) {
  const key = bearer(req);
  const owner = await getApiKeyOwner(key);
  if (!owner) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!tierMeets(owner.tier, "institutional")) {
    return NextResponse.json({ error: "institutional_required" }, { status: 403 });
  }

  // Per-key daily quota.
  const day = new Date().toISOString().slice(0, 10);
  const count = await kvIncrWithTtl(`api:screen:${key}:${day}`, 86_400);
  if (count !== null && count > DAILY_CAP) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const url = new URL(req.url);
  const scholarId = url.searchParams.get("scholar") || "aaoifi";
  if (scholarId === "custom") {
    return NextResponse.json({ error: "custom_unsupported" }, { status: 400 });
  }
  const scholar = getScholar(scholarId);
  const format = (url.searchParams.get("format") || "json").toLowerCase();
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 100, 1), 1000);
  const tickersParam = (url.searchParams.get("tickers") || "").trim();

  const universe = listStocks();
  let selected = universe;
  if (tickersParam) {
    const want = new Set(tickersParam.split(",").map((t) => t.trim().toUpperCase()).filter(Boolean));
    selected = universe.filter((s) => want.has(s.ticker.toUpperCase()));
  } else {
    selected = [...universe].sort((a, b) => b.marketCapUsd - a.marketCapUsd).slice(0, limit);
  }

  const rows = selected.map((s) => {
    const r = screenStock(s, scholar);
    return {
      ticker: s.ticker,
      name: s.name,
      sector: s.sector,
      marketCapUsd: s.marketCapUsd,
      scholar: scholar.id,
      verdict: r.verdict,
      sectorPasses: r.sectorPasses,
      ratios: r.ratioChecks.map((c) => ({ metric: c.label, valuePct: c.value, thresholdPct: c.threshold, passes: c.passes })),
      purification: r.purificationNote,
    };
  });

  if (format === "csv") {
    const header = ["ticker", "name", "sector", "marketCapUsd", "scholar", "verdict", "sectorPasses"];
    const lines = [header.join(",")];
    for (const row of rows) {
      lines.push([
        row.ticker,
        `"${row.name.replace(/"/g, '""')}"`,
        `"${row.sector}"`,
        row.marketCapUsd,
        row.scholar,
        row.verdict,
        row.sectorPasses,
      ].join(","));
    }
    return new NextResponse(lines.join("\n"), {
      headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": "attachment; filename=mizan-screen.csv" },
    });
  }

  return NextResponse.json({
    scholar: scholar.id,
    count: rows.length,
    generatedAt: new Date().toISOString(),
    results: rows,
  });
}
