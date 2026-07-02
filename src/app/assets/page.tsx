import type { Metadata } from "next";
import AssetsClient from "./AssetsClient";

export const metadata: Metadata = {
  title: "Halal asset map — every asset class",
  description:
    "Where contemporary scholars generally land on 63 asset classes — cash, sukuk, equities, real assets, commodities and crypto. Tap any tile for the plain-English reason. Education, not a fatwa.",
};

export default function Page() {
  return <AssetsClient />;
}
