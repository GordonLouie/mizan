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
  const width = Math.round(height * 2.6);

  const svg = (
    <svg
      width={width}
      height={height}
      viewBox="0 0 260 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Mizan"
      className={className}
    >
      {/* Deep institutional navy — slightly desaturated from the brand
          navy-800 tone so the word reads as elegant, not punchy. */}
      <rect width="260" height="100" rx="6" fill="#1B2D4A" />
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="56"
        fontWeight="600"
        fill="#FFFFFF"
        letterSpacing="2"
      >
        Mizan
      </text>
    </svg>
  );

  if (!asLink) return svg;

  return (
    <Link href="/" aria-label="Mizan home" className="inline-flex">
      {svg}
    </Link>
  );
}
