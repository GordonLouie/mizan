/**
 * CompanyLogo — renders a stock's company logo with a cascading fallback chain:
 *
 *   1. FMP (https://financialmodelingprep.com/image-stock/<TICKER>.png) —
 *      per-ticker, sharp ~256px PNGs served directly. Fast, public, no auth.
 *      Covers the overwhelming majority of US stocks + ETFs.
 *   2. Clearbit (https://logo.clearbit.com/<domain>?size=512) — kept as a
 *      fallback for tickers FMP doesn't cover (international, exotic ETFs).
 *      Reliability has been spotty since the HubSpot acquisition, so it's
 *      no longer primary.
 *   3. Google favicons (https://www.google.com/s2/favicons?domain=&sz=128) —
 *      last-resort image. Capped at 128 because larger sizes silently return
 *      Google's question-mark placeholder for many domains, which we have no
 *      way to detect as "broken" (the HTTP request technically succeeds).
 *   4. Monogram pill — final fallback if every image source fails or the
 *      ticker has no mapped domain (long-tail tickers).
 *
 * The cascade is implemented with chained onError handlers so the browser
 * gracefully degrades without flashing through broken states.
 */

"use client";

import { useState } from "react";
import { getDomainForTicker } from "@/lib/companyDomains";

interface CompanyLogoProps {
  ticker: string;
  /** Pixel size (square). Default 24. */
  size?: number;
  /** Override className for the outer chip. */
  className?: string;
  /** Background tone for the monogram fallback. Default "navy". */
  fallbackTone?: "navy" | "neutral";
}

type Stage = "fmp" | "clearbit" | "favicon" | "monogram";

/**
 * FMP's image-stock endpoint expects bare US-style tickers (AAPL, AMZN).
 * For international tickers (formats like "1234.HK", "TASI.SR") we skip
 * straight to Clearbit since FMP often 404s on them.
 */
function isFmpFriendlyTicker(ticker: string): boolean {
  return /^[A-Z]{1,5}$/.test(ticker);
}

export default function CompanyLogo({
  ticker,
  size = 24,
  className,
  fallbackTone = "navy",
}: CompanyLogoProps) {
  const domain = getDomainForTicker(ticker);
  const [stage, setStage] = useState<Stage>(() => {
    if (isFmpFriendlyTicker(ticker)) return "fmp";
    if (domain) return "clearbit";
    return "monogram";
  });

  const fallbackBg =
    fallbackTone === "navy"
      ? "bg-navy-800 text-white"
      : "bg-gray-100 text-gray-700";

  // Two-letter monogram — strip suffixes like ".HK" / ".SR" / ".L".
  const monogram = ticker.replace(/\..*$/, "").slice(0, 2).toUpperCase();

  // If we landed on monogram (either initially because no FMP-compatible
  // ticker AND no mapped domain, or after exhausting the image cascade),
  // render the text pill.
  if (stage === "monogram") {
    return (
      <span
        className={
          "inline-flex shrink-0 items-center justify-center rounded-md font-mono font-bold leading-none " +
          fallbackBg +
          (className ? " " + className : "")
        }
        style={{
          width: size,
          height: size,
          fontSize: Math.max(8, Math.round(size * 0.42)),
        }}
        aria-label={`${ticker} logo`}
      >
        {monogram}
      </span>
    );
  }

  // Build the source URL for the current stage.
  // FMP serves per-ticker PNGs around 256px square — sharp at every layout
  // size we use today. Clearbit's `size` param is capped at 512 for clarity
  // without bloating bytes. Google's `sz` param is held at 128 since larger
  // sizes silently return Google's placeholder for many domains.
  let src: string;
  if (stage === "fmp") {
    src = `https://financialmodelingprep.com/image-stock/${ticker}.png`;
  } else if (stage === "clearbit") {
    src = `https://logo.clearbit.com/${domain}?size=512`;
  } else {
    src = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  }

  function advanceStage() {
    if (stage === "fmp") {
      // FMP failed — try Clearbit if we have a domain, else go to favicon
      // attempt (which needs a domain too), else monogram.
      setStage(domain ? "clearbit" : "monogram");
    } else if (stage === "clearbit") {
      setStage("favicon");
    } else {
      setStage("monogram");
    }
  }

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      key={stage} /* re-mount on stage change so onError re-fires for the new src */
      src={src}
      alt={`${ticker} logo`}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      onError={advanceStage}
      className={
        "inline-block shrink-0 rounded-md bg-white object-contain ring-1 ring-gray-100 " +
        (className ?? "")
      }
      style={{ width: size, height: size }}
    />
  );
}
