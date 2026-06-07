/**
 * CompanyLogo — renders a stock's company logo with a cascading fallback chain:
 *
 *   1. Clearbit (https://logo.clearbit.com/<domain>) — proper brand logos when
 *      they're available. Often returns the real corporate mark (the Microsoft
 *      4-square, Apple's apple, etc.) but reliability has been spotty since
 *      Clearbit was acquired by HubSpot.
 *   2. Google favicons (https://www.google.com/s2/favicons?domain=&sz=128) —
 *      always works for any domain. The visual is the company's website
 *      favicon, which for major companies IS their brand mark, just smaller.
 *   3. Monogram pill — final fallback if both image sources fail or if the
 *      ticker has no mapped domain (long-tail tickers).
 *
 * The cascade is implemented with two onError handlers so the browser
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

type Stage = "clearbit" | "favicon" | "monogram";

export default function CompanyLogo({
  ticker,
  size = 24,
  className,
  fallbackTone = "navy",
}: CompanyLogoProps) {
  const domain = getDomainForTicker(ticker);
  const [stage, setStage] = useState<Stage>(domain ? "clearbit" : "monogram");

  const fallbackBg =
    fallbackTone === "navy"
      ? "bg-navy-800 text-white"
      : "bg-gray-100 text-gray-700";

  // Two-letter monogram — strip suffixes like ".HK" / ".SR" / ".L".
  const monogram = ticker.replace(/\..*$/, "").slice(0, 2).toUpperCase();

  if (stage === "monogram" || !domain) {
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

  // Image sources by stage
  const src =
    stage === "clearbit"
      ? `https://logo.clearbit.com/${domain}`
      : `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      key={stage} /* re-mount on stage change so onError re-fires for the new src */
      src={src}
      alt={`${ticker} logo`}
      width={size}
      height={size}
      onError={() => setStage(stage === "clearbit" ? "favicon" : "monogram")}
      className={
        "inline-block shrink-0 rounded-md bg-white object-contain ring-1 ring-gray-100 " +
        (className ?? "")
      }
      style={{ width: size, height: size }}
    />
  );
}
