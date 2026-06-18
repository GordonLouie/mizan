import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build your own halal index — HalalGauge",
  description:
    "Construct a custom halal stock index: choose a scholarly standard, a theme, and a size, and get a real point-in-time backtest with risk/reward (Sharpe, volatility, drawdown, beta) vs the S&P 500.",
  alternates: { canonical: "https://mizaninvesting.com/indexes/build" },
};

export default function BuildLayout({ children }: { children: React.ReactNode }) {
  return children;
}
