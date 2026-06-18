import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build your own halal basket — HalalGauge",
  description:
    "Construct a custom halal stock basket: choose a scholarly standard, a theme, and a size, and get the screened holdings with current characteristics — weighted dividend yield, median debt, the dividend slice to purify, a compliance-drift watch, and a CSV export.",
  alternates: { canonical: "https://halalgauge.com/indexes/build" },
};

export default function BuildLayout({ children }: { children: React.ReactNode }) {
  return children;
}
