import type { Metadata } from "next";
import BasketsClient from "./BasketsClient";

export const metadata: Metadata = {
  title: "Fund screener — ETFs & REITs, looked through",
  description:
    "A fund is only as halal as what it holds. HalalGauge re-screens each holding under your scholar and rolls it up by weight — the look-through screen for ETFs and REITs.",
};

export default function Page() {
  return <BasketsClient />;
}
