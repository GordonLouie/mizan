import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Onboarding from "@/components/Onboarding";
import ToastContainer from "@/components/ToastContainer";
import MobileTabBar from "@/components/MobileTabBar";

export const metadata: Metadata = {
  metadataBase: new URL("https://mizan.app"),
  title: {
    default: "Mizan — halal investing, calibrated to your conscience.",
    template: "%s · Mizan",
  },
  description:
    "The first stock screener that adapts to your scholar's methodology — AAOIFI, Mufti Taqi Usmani, DJIM, Ja'fari, strict, or your own custom thresholds. With AI scholar Q&A.",
  applicationName: "Mizan",
  keywords: ["halal investing", "shariah screening", "halal stocks", "mufti taqi usmani", "AAOIFI", "DJIM", "halal stock screener", "muslim investing"],
  authors: [{ name: "Mizan" }],
  creator: "Mizan",
  publisher: "Mizan",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: "/logo_mark.svg",
  },
  openGraph: {
    title: "Mizan — halal investing, calibrated to your conscience.",
    description:
      "The first stock screener that adapts to your scholar. Six scholar profiles plus a custom builder. Transparent ratio reasoning behind every verdict.",
    url: "https://mizan.app",
    siteName: "Mizan",
    images: [{ url: "/og_image.svg", width: 1200, height: 630, alt: "Mizan logo" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mizan — halal investing, calibrated to your conscience.",
    description: "The first stock screener that adapts to your scholar's methodology.",
    creator: "@mizanapp",
    images: ["/og_image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export const viewport: Viewport = {
  themeColor: "#1F3A5F",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="mx-auto max-w-6xl px-6 py-8 pb-24 md:pb-8">{children}</main>
        <footer className="border-t border-gray-100">
          <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-gray-500">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-navy-800" style={{ fontFamily: "Georgia, serif" }}>Mizan</span>
                <span className="text-xs text-gray-400">·</span>
                <span className="text-xs">halal investing, calibrated</span>
              </div>
              <nav className="flex flex-wrap gap-3 text-xs">
                <a href="/about" className="hover:text-navy-700">About</a>
                <a href="/methodology" className="hover:text-navy-700">Methodology</a>
                <a href="/roadmap" className="hover:text-navy-700">Roadmap</a>
                <a href="/help" className="hover:text-navy-700">Help</a>
                <a href="/terms" className="hover:text-navy-700">Terms</a>
                <a href="/privacy" className="hover:text-navy-700">Privacy</a>
                <a href="mailto:hello@mizan.app" className="hover:text-navy-700">Contact</a>
              </nav>
            </div>
            <p className="mt-4 text-xs leading-6 text-gray-500">
              Mizan provides information, not investment advice. Compliance verdicts
              are scholarly opinions, not buy/sell recommendations. Sample data shown
              for demonstration only. © {new Date().getFullYear()} Mizan Operations
              (HK) Limited.
            </p>
          </div>
        </footer>
        <Onboarding />
        <ToastContainer />
        <MobileTabBar />
      </body>
    </html>
  );
}
