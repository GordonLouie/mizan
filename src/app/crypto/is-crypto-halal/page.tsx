import type { Metadata } from "next";
import CryptoHalalClient from "./CryptoHalalClient";

export const metadata: Metadata = {
  title: "Is crypto halal?",
  description:
    "A plain-English framework for evaluating any token — utility, backing, interest, staking, legitimacy — with eight worked examples. Education, not a ruling.",
};

export default function Page() {
  return <CryptoHalalClient />;
}
