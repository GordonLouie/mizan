/**
 * Header — floating pill.
 *
 * Sticky, centered, rounded-full chrome that hovers above the page content.
 * Replaces the old full-width bar. Uses the new MizanWordmark for the brand
 * mark (no icon — just the name on a navy block, McKinsey-style).
 *
 * Tools mega-menu and mobile drawer are preserved from the previous header.
 */

"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import MizanWordmark from "@/components/MizanWordmark";

const TOOL_GROUPS: Array<{
  heading: string;
  items: Array<{ href: string; label: string; sub?: string }>;
}> = [
  {
    heading: "Explore stocks",
    items: [
      { href: "/discover", label: "Discover", sub: "Trending & where scholars split" },
      { href: "/sectors", label: "Sectors", sub: "By industry" },
      { href: "/lists", label: "Curated lists", sub: "Editorial collections" },
      { href: "/universe", label: "Universe", sub: "Every ticker" },
    ],
  },
  {
    heading: "Your stocks",
    items: [
      { href: "/watchlist", label: "Watchlist", sub: "Your saved tickers" },
      { href: "/portfolio", label: "Portfolio score", sub: "Your compliance %" },
      { href: "/calendar", label: "Earnings calendar", sub: "When holdings report next" },
      { href: "/vs", label: "Compare stocks", sub: "Side-by-side" },
      { href: "/custom", label: "Custom profile", sub: "Set your thresholds" },
    ],
  },
  {
    heading: "Reference",
    items: [
      { href: "/ask", label: "Ask a scholar", sub: "49 common Q&A" },
      { href: "/zakat", label: "Zakat calculator", sub: "Annual obligation" },
      { href: "/purification", label: "Purification", sub: "Dividend cleansing" },
      { href: "/crypto", label: "Crypto", sub: "Early development" },
      { href: "/sukuk", label: "Sukuk", sub: "Early development" },
      { href: "/account", label: "Account", sub: "Sign in & plan" },
    ],
  },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  function openTools() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setToolsOpen(true);
  }
  function scheduleCloseTools() {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setToolsOpen(false), 180);
  }

  return (
    <>
      {/* Spacer so page content doesn't slide under the floating header */}
      <div aria-hidden className="h-20" />

      <header className="fixed inset-x-0 top-3 z-40 px-3 sm:top-4 sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 rounded-full border border-gray-200 bg-white/85 px-3 py-2 shadow-[0_8px_30px_-12px_rgba(31,58,95,0.18)] backdrop-blur-md sm:px-4">
          {/* Brand mark — McKinsey-style wordmark on navy block */}
          <Link href="/" aria-label="Mizan home" className="inline-flex shrink-0">
            <MizanWordmark height={28} asLink={false} />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 text-[14px] font-medium text-gray-700 md:flex">
            <Link href="/screen" className="hover:text-navy-800">Screen</Link>
            <Link href="/discover" className="hover:text-navy-800">Discover</Link>
            <Link href="/learn" className="hover:text-navy-800">Learn</Link>
            <Link href="/pricing" className="hover:text-navy-800">Pricing</Link>
            <div
              className="relative"
              onMouseEnter={openTools}
              onMouseLeave={scheduleCloseTools}
            >
              <button className="inline-flex items-center gap-1 hover:text-navy-800">
                Tools
                <ChevronDown
                  size={14}
                  className={toolsOpen ? "rotate-180 transition" : "transition"}
                />
              </button>
              {toolsOpen && (
                <div className="absolute right-0 top-full z-20 mt-2 grid w-[640px] grid-cols-3 gap-x-6 gap-y-1 rounded-xl border border-gray-200 bg-white p-5 shadow-lg">
                  {TOOL_GROUPS.map((group) => (
                    <div key={group.heading}>
                      <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                        {group.heading}
                      </div>
                      <div className="space-y-0.5">
                        {group.items.map((t) => (
                          <Link
                            key={t.href}
                            href={t.href}
                            className="block rounded-md px-2 py-1.5 transition hover:bg-gray-50"
                          >
                            <div className="text-sm font-medium text-gray-900">{t.label}</div>
                            {t.sub && (
                              <div className="text-[11px] text-gray-500">{t.sub}</div>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right: dark pill CTA on desktop, hamburger on mobile */}
          <Link
            href="/screen"
            className="hidden items-center gap-1.5 rounded-full bg-navy-900 px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition hover:bg-navy-800 md:inline-flex"
          >
            Try a stock
            <ArrowRight size={14} />
          </Link>

          <button
            className="rounded-full p-2 text-gray-700 hover:bg-gray-100 md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="mx-auto mt-2 max-w-5xl rounded-2xl border border-gray-200 bg-white p-4 shadow-lg md:hidden">
            <div className="flex flex-col gap-1 text-sm">
              <Link href="/screen" onClick={() => setMobileOpen(false)} className="rounded-md px-2 py-2 font-medium text-gray-900 hover:bg-gray-50">Screen</Link>
              <Link href="/discover" onClick={() => setMobileOpen(false)} className="rounded-md px-2 py-2 font-medium text-gray-900 hover:bg-gray-50">Discover</Link>
              <Link href="/learn" onClick={() => setMobileOpen(false)} className="rounded-md px-2 py-2 font-medium text-gray-900 hover:bg-gray-50">Learn</Link>
              <Link href="/pricing" onClick={() => setMobileOpen(false)} className="rounded-md px-2 py-2 font-medium text-gray-900 hover:bg-gray-50">Pricing</Link>

              {TOOL_GROUPS.map((group) => (
                <div key={group.heading} className="mt-3">
                  <div className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                    {group.heading}
                  </div>
                  {group.items.map((t) => (
                    <Link
                      key={t.href}
                      href={t.href}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-md px-2 py-1.5 text-gray-700 hover:bg-gray-50"
                    >
                      {t.label}
                    </Link>
                  ))}
                </div>
              ))}

              <Link
                href="/screen"
                onClick={() => setMobileOpen(false)}
                className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-full bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Try a stock <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
