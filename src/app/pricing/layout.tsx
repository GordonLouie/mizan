import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — HalalGauge Pro halal investing ($9.99/mo)",
  description:
    "HalalGauge pricing: free multi-scholar halal verdicts forever; Pro ($9.99/mo or $89/yr) unlocks charts, halal index performance, and AI compliance reports; institutional data & white-label.",
  alternates: { canonical: "https://halalgauge.com/pricing" },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
