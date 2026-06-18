import type { Metadata } from "next";

// Private page — keep it out of search results.
export const metadata: Metadata = {
  title: "Account — Mizan",
  robots: { index: false, follow: false },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children;
}
