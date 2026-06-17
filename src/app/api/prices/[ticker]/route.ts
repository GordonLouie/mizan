/**
 * GET /api/prices/[ticker] — server-side price feed for charts (Phase 1).
 *
 * Reads the real series server-side and returns it as JSON, plus the SPY
 * benchmark for ROI comparison. Keeps the multi-MB prices.json OUT of the client
 * bundle (the chart fetches this instead of importing the data).
 */
import { priceSeries, hasHistory } from "@/lib/prices.server";

export const runtime = "nodejs";

// Benchmarks the user can compare against (single tickers we ingest).
const ALLOWED_BENCH: Record<string, string> = {
  SPY: "S&P 500",
  QQQ: "Nasdaq 100",
  DIA: "Dow Jones",
  SPUS: "Halal S&P (SPUS)",
};

export async function GET(req: Request, { params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const t = decodeURIComponent(ticker).toUpperCase().trim();
  const benchSym = (new URL(req.url).searchParams.get("bench") || "SPY").toUpperCase().trim();
  const series = priceSeries(t);

  // Resolve the requested benchmark, falling back to SPY if unknown/empty.
  const wanted = ALLOWED_BENCH[benchSym] ? benchSym : "SPY";
  let benchSeries = priceSeries(wanted);
  let benchUsed = wanted;
  if (!benchSeries.length && wanted !== "SPY") {
    benchSeries = priceSeries("SPY");
    benchUsed = "SPY";
  }

  return Response.json(
    {
      ticker: t,
      real: hasHistory(t),
      series,
      benchmark: benchSeries.length ? { ticker: benchUsed, label: ALLOWED_BENCH[benchUsed], series: benchSeries } : null,
      benchmarks: Object.entries(ALLOWED_BENCH).map(([sym, label]) => ({ sym, label })),
    },
    { headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" } },
  );
}
