import type { Metadata } from "next";

// Private page — keep it out of search results.
export const metadata: Metadata = {
  title: "Account — HalalGauge",
  robots: { index: false, follow: false },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children;
}
