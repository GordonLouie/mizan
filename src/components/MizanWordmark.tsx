/**
 * MizanWordmark — McKinsey-inspired wordmark.
 *
 * A single elegant block: deep navy background, white "Mizan" set in a
 * confident serif. No icon, no decoration. The blue is intentionally muted
 * (deeper than fintech-saas blue) to read as institutional, not playful.
 *
 * Use in:
 *   - Site header
 *   - Footer
 *   - Open-graph images
 *   - Favicon (export the SVG separately)
 */

"use client";

import Link from "next/link";

interface Props {
  /** Pixel height. Width scales 2.6× automatically. Default 32. */
  height?: number;
  /** When true, wraps in a Link to "/". Default true. */
  asLink?: boolean;
  /** Extra classes. */
  className?: string;
}

export default function MizanWordmark({
  height = 32,
  asLink = true,
  className,
}: Props) {
  const width = Math.round(height * 4.7); // "HalalGauge" is wider than "Mizan"

  const svg = (
    <svg
      width={width}
      height={height}
      viewBox="0 0 470 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="HalalGauge"
      className={className}
    >
      {/* Deep institutional navy — reads as elegant, not punchy. */}
      <rect width="470" height="100" rx="6" fill="#1B2D4A" />
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="46"
        fontWeight="600"
        fill="#FFFFFF"
        letterSpacing="0.5"
      >
        HalalGauge
      </text>
    </svg>
  );

  if (!asLink) return svg;

  return (
    <Link href="/" aria-label="HalalGauge home" className="inline-flex">
      {svg}
    </Link>
  );
}
