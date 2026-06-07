/**
 * StockLogo — thin compatibility wrapper around <CompanyLogo>.
 *
 * Historical: an older StockLogo existed before CompanyLogo unified the
 * fallback chain (Clearbit → Google favicons → monogram) and consolidated
 * the ticker→domain map. We keep this file so older call sites
 * (FeaturedTickers, ComplianceCard, HalalAlternatives) continue to work
 * without prop changes. New code should import CompanyLogo directly.
 */

"use client";

import CompanyLogo from "./CompanyLogo";

interface Props {
  ticker: string;
  name: string;
  size?: number;
}

export default function StockLogo({ ticker, size = 32 }: Props) {
  return <CompanyLogo ticker={ticker} size={size} />;
}
