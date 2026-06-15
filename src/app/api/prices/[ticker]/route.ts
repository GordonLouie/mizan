/**
 * GET /api/prices/[ticker] — server-side price feed for charts (Phase 1).
 *
 * Reads the real series server-side and returns it as JSON, plus the SPY
 * benchmark for ROI comparison. Keeps the multi-MB prices.json OUT of the client
 * bundle (the chart fetches this instead of importing the data).
 */
import { priceSeries, hasHistory } from "@/lib/prices.server";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const t = decodeURIComponent(ticker).toUpperCase().trim();
  const series = priceSeries(t);
  const benchmark = priceSeries("SPY");
  return Response.json(
    {
      ticker: t,
      real: hasHistory(t),
      series,
      benchmark: benchmark.length ? { ticker: "SPY", series: benchmark } : null,
    },
    { headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" } },
  );
}
