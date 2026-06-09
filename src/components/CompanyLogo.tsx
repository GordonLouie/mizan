/**
 * CompanyLogo — renders a stock's company logo with a cascading fallback chain:
 *
 *   0. Self-hosted (/logos/<TICKER>.png) — tried FIRST for every ticker.
 *      Populated by `node scripts/fetch_logos.mjs`, served from Vercel's CDN,
 *      so it loads instantly and never depends on a third-party staying up.
 *      This is the primary path; the network sources below are only used for
 *      tickers that haven't been downloaded yet.
 *   1. Clearbit (https://logo.clearbit.com/<domain>?size=512) — when the
 *      ticker has a curated domain mapping (companyDomains.ts). NOTE: Clearbit's
 *      free logo API has become unreliable, which is why self-hosting is now
 *      the primary path rather than this.
 *   2. FMP (https://financialmodelingprep.com/image-stock/<TICKER>.png) —
 *      per-ticker fallback. Covers most US tickers.
 *   3. Google favicons (https://www.google.com/s2/favicons?domain=&sz=128) —
 *      last-resort image. Capped at 128 because larger sizes silently return
 *      Google's question-mark placeholder.
 *
 * Monogram-first rendering:
 *   The monogram pill is ALWAYS rendered immediately, as the visible layer.
 *   The real logo `<img>` is layered on top with opacity 0, fading in only
 *   when it actually loads. If the image fails or hangs, the monogram is
 *   already on screen — no broken-image icons, no alt-text flash, no empty
 *   slots while networks struggle.
 *
 * The cascade is implemented with chained onError handlers so the browser
 * gracefully degrades without flashing through broken states.
 */

"use client";

import { useEffect, useState } from "react";
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

type Stage = "local" | "clearbit" | "fmp" | "favicon" | "monogram";

/**
 * Tickers we'll try against FMP's image-stock endpoint.
 * US-style alpha tickers (AAPL, AMZN), share-class tickers (BRK.B, BF.B).
 * Excludes anything with an exchange suffix like ".HK" or ".SR".
 */
function isFmpFriendlyTicker(ticker: string): boolean {
  return /^[A-Z]{1,5}(\.[A-Z])?$/.test(ticker);
}

export default function CompanyLogo({
  ticker,
  size = 24,
  className,
  fallbackTone = "navy",
}: CompanyLogoProps) {
  const domain = getDomainForTicker(ticker);
  // Always try the self-hosted logo first. If the file isn't there yet, the
  // <img> onError advances down the same network cascade as before.
  const [stage, setStage] = useState<Stage>("local");
  const [imgLoaded, setImgLoaded] = useState(false);

  // Reset the loaded flag when the stage advances so the new img has to
  // re-prove itself before being shown.
  useEffect(() => {
    setImgLoaded(false);
  }, [stage]);

  const fallbackBg =
    fallbackTone === "navy"
      ? "bg-navy-800 text-white"
      : "bg-gray-100 text-gray-700";

  // Two-letter monogram — strip suffixes like ".HK" / ".SR" / ".L".
  const monogram = ticker.replace(/\..*$/, "").slice(0, 2).toUpperCase();

  // The monogram pill — always rendered. When we're in `monogram` stage,
  // it's the only thing visible. In any image stage, it sits underneath the
  // <img> until that image loads.
  const monogramEl = (
    <span
      className={
        "inline-flex shrink-0 items-center justify-center rounded-md font-mono font-bold leading-none select-none " +
        fallbackBg
      }
      style={{
        width: size,
        height: size,
        fontSize: Math.max(8, Math.round(size * 0.42)),
      }}
      aria-hidden={stage !== "monogram"}
    >
      {monogram}
    </span>
  );

  // Pure monogram stage — no image attempt, just the pill.
  if (stage === "monogram") {
    return (
      <span
        className={"inline-block shrink-0 " + (className ?? "")}
        aria-label={`${ticker} logo`}
      >
        {monogramEl}
      </span>
    );
  }

  // Build the source URL for the current image stage.
  let src: string;
  if (stage === "local") {
    // Encode so tickers with dots/class suffixes resolve to the right file.
    src = `/logos/${encodeURIComponent(ticker)}.png`;
  } else if (stage === "clearbit") {
    src = `https://logo.clearbit.com/${domain}?size=512`;
  } else if (stage === "fmp") {
    src = `https://financialmodelingprep.com/image-stock/${ticker}.png`;
  } else {
    src = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  }

  function advanceStage() {
    if (stage === "local") {
      // Self-hosted file missing — fall into the network cascade.
      if (domain) {
        setStage("clearbit");
      } else if (isFmpFriendlyTicker(ticker)) {
        setStage("fmp");
      } else {
        setStage("monogram");
      }
    } else if (stage === "clearbit") {
      if (isFmpFriendlyTicker(ticker)) {
        setStage("fmp");
      } else if (domain) {
        setStage("favicon");
      } else {
        setStage("monogram");
      }
    } else if (stage === "fmp") {
      setStage(domain ? "favicon" : "monogram");
    } else {
      setStage("monogram");
    }
  }

  // Layered render: monogram on the bottom, image on top with opacity
  // tied to its load state. The wrapper is `relative` so the image can
  // be `absolute inset-0` to overlay perfectly.
  return (
    <span
      className={"relative inline-block shrink-0 " + (className ?? "")}
      style={{ width: size, height: size }}
      aria-label={`${ticker} logo`}
    >
      {monogramEl}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={stage}
        src={src}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        onLoad={() => setImgLoaded(true)}
        onError={advanceStage}
        className="absolute inset-0 rounded-md bg-white object-contain ring-1 ring-gray-100 transition-opacity duration-200"
        style={{
          width: size,
          height: size,
          opacity: imgLoaded ? 1 : 0,
        }}
      />
    </span>
  );
}
