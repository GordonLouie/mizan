import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio — is your portfolio halal?",
  description:
    "Track your holdings' Shariah compliance under your scholar's standard: portfolio-level halal %, compliance drift alerts before earnings, and purification owed — computed per holding. Positions stay in your browser.",
  alternates: { canonical: "https://www.halalgauge.com/portfolio" },
  robots: { index: false, follow: true },
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
