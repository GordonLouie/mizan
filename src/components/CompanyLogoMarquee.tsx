/**
 * CompanyLogoMarquee — infinite scrolling row of company logos with soft
 * blur fades at the edges. Tells visitors "Mizan covers these companies"
 * at a glance, without listing them.
 *
 * Composes InfiniteSlider + ProgressiveBlur + CompanyLogo. All tickers run
 * through our central logo fallback chain, so the marquee looks consistent
 * even when individual logos are missing.
 */

"use client";

import CompanyLogo from "@/components/CompanyLogo";
import { InfiniteSlider } from "@/components/ui/InfiniteSlider";
import { ProgressiveBlur } from "@/components/ui/ProgressiveBlur";

interface CompanyLogoMarqueeProps {
  /** Tickers to display. Defaults to a hand-picked set of well-known names. */
  tickers?: string[];
  /** Pixel height of each logo tile. Default 36. */
  logoSize?: number;
  /** Marquee scroll duration in seconds. Lower = faster. Default 38. */
  duration?: number;
  /** Extra outer className. */
  className?: string;
}

const DEFAULT_TICKERS = [
  "AAPL", "MSFT", "AMZN", "GOOGL", "TSLA", "NVDA", "META",
  "JPM", "V", "MA", "NFLX", "DIS", "WMT", "COST", "PG",
  "JNJ", "PFE", "ORCL", "ADBE", "CRM", "BABA", "TSM",
];

export default function CompanyLogoMarquee({
  tickers = DEFAULT_TICKERS,
  logoSize = 32,
  duration = 38,
  className,
}: CompanyLogoMarqueeProps) {
  return (
    <div className={"relative w-full overflow-hidden " + (className ?? "")}>
      <InfiniteSlider duration={duration} gap={56} className="py-2">
        {tickers.map((t) => (
          <div
            key={t}
            className="flex items-center gap-2.5 opacity-80 transition hover:opacity-100"
          >
            <CompanyLogo ticker={t} size={logoSize} fallbackTone="neutral" />
            <span className="font-mono text-[12px] font-semibold tracking-wide text-gray-500">
              {t}
            </span>
          </div>
        ))}
      </InfiniteSlider>

      {/* Edge fades so the strip dissolves instead of clipping. Background
          color matches the page (cream) so the blur reads as a vignette. */}
      <ProgressiveBlur
        direction="left"
        blurIntensity={0.9}
        className="pointer-events-none absolute left-0 top-0 h-full w-32"
      />
      <ProgressiveBlur
        direction="right"
        blurIntensity={0.9}
        className="pointer-events-none absolute right-0 top-0 h-full w-32"
      />
    </div>
  );
}
