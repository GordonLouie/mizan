/**
 * Dynamic Open Graph share card for /halal/[ticker].
 *
 * Renders a 1200×630 PNG at build time (one per ticker) showing the headline
 * verdict tally across the 5 mainstream standards. This is what appears when a
 * /halal/{ticker} link is shared on WhatsApp / X / iMessage — so a shared link
 * looks like a designed verdict card, not a bare URL. Shareability is a feature.
 */
import { ImageResponse } from "next/og";
import { listStocks, findStock } from "@/lib/data";
import { SCHOLAR_PROFILES, getScholar } from "@/lib/scholars";
import { screenStock } from "@/lib/screen";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Mizan halal verdict";

const NAMED = SCHOLAR_PROFILES.filter((s) => s.id !== "custom");

// Pre-generate one card per ticker (matches the page's static params).
export function generateStaticParams() {
  return listStocks().map((s) => ({ ticker: s.ticker }));
}

export default async function OgImage({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const stock = findStock(decodeURIComponent(ticker).toUpperCase().trim());

  const NAVY = "#1B2D4A";
  const AMBER = "#C89030";

  if (!stock) {
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: NAVY, color: "#fff", fontSize: 64, fontWeight: 700 }}>
          Mizan
        </div>
      ),
      size,
    );
  }

  const results = NAMED.map((sc) => screenStock(stock, getScholar(sc.id)));
  const pass = results.filter((r) => r.verdict === "pass").length;
  const fail = results.filter((r) => r.verdict === "fail").length;
  const borderline = results.length - pass - fail;

  const headline =
    pass === NAMED.length ? "Halal under all 5 standards"
      : pass === 0 ? "Not halal under the mainstream standards"
        : `Halal under ${pass} of 5 standards`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        {/* top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: 12, background: NAVY, color: "#fff", fontSize: 34, fontWeight: 800 }}>M</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: NAVY }}>Mizan</div>
          </div>
          <div style={{ fontSize: 24, color: "#6b7280" }}>{stock.sector}</div>
        </div>

        {/* main */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 30, color: "#6b7280", fontWeight: 600 }}>{stock.ticker} · {stock.name}</div>
          <div style={{ fontSize: 68, fontWeight: 800, color: "#111827", lineHeight: 1.05 }}>
            Is {stock.ticker} halal?
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, color: NAVY }}>{headline}</div>
        </div>

        {/* verdict pills + footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 14 }}>
            <span style={{ display: "flex", fontSize: 24, fontWeight: 700, color: "#047857", background: "#ecfdf5", border: "2px solid #a7f3d0", borderRadius: 999, padding: "8px 20px" }}>{pass} halal</span>
            <span style={{ display: "flex", fontSize: 24, fontWeight: 700, color: "#b45309", background: "#fffbeb", border: "2px solid #fde68a", borderRadius: 999, padding: "8px 20px" }}>{borderline} doubtful</span>
            <span style={{ display: "flex", fontSize: 24, fontWeight: 700, color: "#be123c", background: "#fff1f2", border: "2px solid #fecdd3", borderRadius: 999, padding: "8px 20px" }}>{fail} not halal</span>
          </div>
          <div style={{ display: "flex", fontSize: 22, color: AMBER, fontWeight: 700 }}>every threshold cited</div>
        </div>
      </div>
    ),
    size,
  );
}
