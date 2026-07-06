import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your scholar — compare the five halal screening standards",
  description:
    "AAOIFI vs Mufti Taqi Usmani vs S&P DJIM vs Ja'fari (Shia) vs a strict view: the exact thresholds each standard applies — impermissible income, interest-bearing debt, cash & securities — side by side, with sources. Pick the standard you follow; every verdict adapts.",
  alternates: { canonical: "https://www.halalgauge.com/scholars" },
};

export default function ScholarsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
