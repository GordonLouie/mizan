/**
 * CompanyLogo — renders a stock's company logo from Clearbit when we have a
 * mapped domain, falls back to a monogram pill (ticker on a navy chip) when
 * we don't or when the image 404s.
 *
 * Why we did it this way:
 *   - Clearbit's logo CDN works without auth and is reliable for well-known
 *     public companies.
 *   - 342 tickers in the universe is too many to maintain a full
 *     domain map for — heavy-display tickers are mapped, the long tail
 *     gracefully degrades to an editorial monogram that still looks on-brand.
 *
 * Sizing: pass `size` in pixels (defaults to 24). Component takes care of
 * the chip framing in either mode.
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

export default function CompanyLogo({
  ticker,
  size = 24,
  className,
  fallbackTone = "navy",
}: CompanyLogoProps) {
  const domain = getDomainForTicker(ticker);
  const [failed, setFailed] = useState(false);

  const useFallback = !domain || failed;

  const fallbackBg =
    fallbackTone === "navy"
      ? "bg-navy-800 text-white"
      : "bg-gray-100 text-gray-700";

  // Two-letter monogram from ticker. Strip suffixes like ".HK" / ".SR" / ".L".
  const monogram = ticker
    .replace(/\..*$/, "")
    .slice(0, 2)
    .toUpperCase();

  // Sub-tag for the monogram so users still know what they're looking at
  // for tickers we don't have a domain for. Visually small but legible.

  if (useFallback) {
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

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={`https://logo.clearbit.com/${domain}`}
      alt={`${ticker} logo`}
      width={size}
      height={size}
      onError={() => setFailed(true)}
      className={
        "inline-block shrink-0 rounded-md bg-white object-contain ring-1 ring-gray-100 " +
        (className ?? "")
      }
      style={{ width: size, height: size }}
    />
  );
}
