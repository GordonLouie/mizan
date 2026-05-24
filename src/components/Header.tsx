"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

// Tools dropdown is organised into 3 columns so 13 destinations don't read
// as a wall of links. Each column has a clear theme.
const TOOL_GROUPS: Array<{ heading: string; items: Array<{ href: string; label: string; sub?: string }> }> = [
  {
    heading: "Explore",
    items: [
      { href: "/discover",  label: "Discover",         sub: "Trending & disagreement" },
      { href: "/sectors",   label: "Sectors",          sub: "By industry" },
      { href: "/lists",     label: "Curated lists",    sub: "Editorial collections" },
      { href: "/universe",  label: "Universe",         sub: "Every ticker" },
    ],
  },
  {
    heading: "Cross-asset",
    items: [
      { href: "/crypto",    label: "Crypto",           sub: "Multi-scholar views" },
      { href: "/sukuk",     label: "Sukuk",            sub: "Islamic bonds" },
      { href: "/vs",        label: "Compare stocks",   sub: "Side-by-side" },
    ],
  },
  {
    heading: "Tools",
    items: [
      { href: "/watchlist",     label: "Watchlist",      sub: "Your saved tickers" },
      { href: "/portfolio",     label: "Portfolio score",sub: "Your compliance %" },
      { href: "/zakat",         label: "Zakat calculator", sub: "Annual obligation" },
      { href: "/purification",  label: "Purification",   sub: "Dividend cleansing" },
      { href: "/ask",           label: "Ask a scholar",  sub: "49 common Q&A" },
      { href: "/custom",        label: "Custom profile", sub: "Set your thresholds" },
    ],
  },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-navy-800">
            <MizanScale />
          </span>
          <span className="text-xl font-bold tracking-tight text-navy-800" style={{ fontFamily: "Georgia, serif" }}>
            Mizan
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-gray-700 md:flex">
          <Link href="/screen" className="hover:text-navy-800">Screen</Link>
          <Link href="/discover" className="hover:text-navy-800">Discover</Link>
          <Link href="/learn" className="hover:text-navy-800">Learn</Link>
          <div className="relative" onMouseEnter={() => setToolsOpen(true)} onMouseLeave={() => setToolsOpen(false)}>
            <button className="inline-flex items-center gap-1 hover:text-navy-800">
              Tools <ChevronDown size={14} className={toolsOpen ? "rotate-180 transition" : "transition"} />
            </button>
            {toolsOpen && (
              <div className="absolute right-0 top-full z-20 mt-1 grid w-[640px] grid-cols-3 gap-x-6 gap-y-1 rounded-xl border border-gray-200 bg-white p-5 shadow-lg">
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

        <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label={open ? "Close menu" : "Open menu"}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-gray-100 bg-white px-6 py-4 md:hidden">
          <div className="flex flex-col gap-1 text-sm">
            <Link href="/screen"   onClick={() => setOpen(false)} className="rounded-md px-2 py-2 font-medium text-gray-900 hover:bg-gray-50">Screen</Link>
            <Link href="/discover" onClick={() => setOpen(false)} className="rounded-md px-2 py-2 font-medium text-gray-900 hover:bg-gray-50">Discover</Link>
            <Link href="/learn"    onClick={() => setOpen(false)} className="rounded-md px-2 py-2 font-medium text-gray-900 hover:bg-gray-50">Learn</Link>

            {TOOL_GROUPS.map((group) => (
              <div key={group.heading} className="mt-3">
                <div className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                  {group.heading}
                </div>
                {group.items.map((t) => (
                  <Link
                    key={t.href}
                    href={t.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-2 py-1.5 text-gray-700 hover:bg-gray-50"
                  >
                    {t.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function MizanScale() {
  return (
    <svg viewBox="0 0 32 32" width="20" height="20" aria-hidden="true">
      <rect x="6" y="14" width="20" height="1.6" rx="0.8" fill="#E8C547" />
      <rect x="15.2" y="7" width="1.6" height="7" rx="0.8" fill="#E8C547" />
      <circle cx="16" cy="7" r="1.8" fill="#E8C547" />
      <path d="M 7 18 Q 10 23 13 18 Z" fill="#FFFFFF" />
      <path d="M 19 17 Q 22 21 25 17 Z" fill="#FFFFFF" opacity="0.7" />
      <rect x="13" y="24" width="6" height="1.6" rx="0.4" fill="#E8C547" />
    </svg>
  );
}
