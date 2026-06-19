import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import ToastContainer from "@/components/ToastContainer";
import MobileTabBar from "@/components/MobileTabBar";
import FeedbackWidget from "@/components/FeedbackWidget";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import PostHogProvider from "@/components/PostHogProvider";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  metadataBase: new URL("https://halalgauge.com"),
  verification: { google: "DZV7UJw-g5iwpUnB7L9y-C4KV-jeIO6eMLCjSymFfQo" },
  title: {
    default: "HalalGauge — halal investing, calibrated to your conscience.",
    template: "%s · HalalGauge",
  },
  description:
    "The first stock screener that adapts to your scholar's methodology — AAOIFI, Mufti Taqi Usmani, DJIM, Ja'fari, strict, or your own custom thresholds. With an AI-assisted halal investing Q&A.",
  applicationName: "HalalGauge",
  keywords: ["halal investing", "shariah screening", "halal stocks", "mufti taqi usmani", "AAOIFI", "DJIM", "halal stock screener", "muslim investing"],
  authors: [{ name: "HalalGauge" }],
  creator: "HalalGauge",
  publisher: "HalalGauge",
  manifest: "/manifest.webmanifest",
  icons: {
    // Cache buster on every icon URL — browsers cache favicons aggressively
    // and won't refetch on simple SVG changes. Bump ?v=N when the mark changes.
    icon: [{ url: "/favicon.svg?v=6", type: "image/svg+xml" }],
    shortcut: "/favicon.svg?v=6",
    apple: "/favicon.svg?v=6",
  },
  openGraph: {
    title: "HalalGauge — halal investing, calibrated to your conscience.",
    description:
      "The first stock screener that adapts to your scholar. Five scholarly standards plus a custom builder. Transparent ratio reasoning behind every verdict.",
    url: "https://halalgauge.com",
    siteName: "HalalGauge",
    images: [{ url: "/og-image.png?v=4", width: 1200, height: 630, alt: "HalalGauge — multi-scholar halal investing screener" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HalalGauge — halal investing, calibrated to your conscience.",
    description: "The first stock screener that adapts to your scholar's methodology.",
    creator: "@mizanapp",
    images: ["/og-image.png?v=4"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export const viewport: Viewport = {
  themeColor: "#1C4537",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Wrap with ClerkProvider only when configured, so a missing key never breaks
  // the build/render (keeps the inert-without-keys posture).
  const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const tree = (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  name: "HalalGauge",
                  url: "https://halalgauge.com",
                  email: "hello@halalgauge.com",
                  description: "Multi-scholar halal stock screening, halal indexes, and grounded AI compliance reports.",
                },
                { "@type": "WebSite", name: "HalalGauge", url: "https://halalgauge.com" },
              ],
            }),
          }}
        />
        <Header />
        <main className="mx-auto max-w-6xl px-6 py-8 pb-24 md:pb-8">{children}</main>
        <footer className="border-t border-gray-100">
          <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-gray-500">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-navy-800" style={{ fontFamily: "var(--font-display)" }}>HalalGauge</span>
                <span className="text-xs text-gray-400">·</span>
                <span className="text-xs">halal investing, calibrated</span>
              </div>
              <nav className="flex flex-wrap gap-3 text-xs">
                <a href="/indexes" className="hover:text-navy-700">Halal indexes</a>
                <a href="/pricing" className="hover:text-navy-700">Pricing</a>
                <a href="/institutions" className="hover:text-navy-700">Institutions</a>
                <a href="/about" className="hover:text-navy-700">About</a>
                <a href="/trust" className="hover:text-navy-700">Trust centre</a>
                <a href="/methodology" className="hover:text-navy-700">Methodology</a>
                <a href="/help" className="hover:text-navy-700">Help</a>
                <a href="/terms" className="hover:text-navy-700">Terms</a>
                <a href="/privacy" className="hover:text-navy-700">Privacy</a>
                <a href="mailto:hello@halalgauge.com" className="hover:text-navy-700">Contact</a>
              </nav>
            </div>
            <p className="mt-4 text-xs leading-6 text-gray-500">
              HalalGauge provides information, not investment advice. Compliance verdicts
              are scholarly opinions, not buy/sell recommendations. © {new Date().getFullYear()} HalalGauge.
            </p>
          </div>
        </footer>
        <ToastContainer />
        <FeedbackWidget />
        <MobileTabBar />
        <Analytics />
        <Suspense fallback={null}>
          <PostHogProvider />
        </Suspense>
      </body>
    </html>
  );
  return clerkEnabled ? <ClerkProvider>{tree}</ClerkProvider> : tree;
}
