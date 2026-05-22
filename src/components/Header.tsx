"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const TOOLS = [
  { href: "/watchlist", label: "Watchlist" },
  { href: "/zakat", label: "Zakat calculator" },
  { href: "/portfolio", label: "Portfolio score" },
  { href: "/ask", label: "Ask a scholar" },
  { href: "/purification", label: "Purification calc" },
  { href: "/universe", label: "Browse universe" },
  { href: "/custom", label: "Custom scholar profile" },
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
          <Link href="/learn" className="hover:text-navy-800">Learn</Link>
          <div className="relative" onMouseEnter={() => setToolsOpen(true)} onMouseLeave={() => setToolsOpen(false)}>
            <button className="inline-flex items-center gap-1 hover:text-navy-800">
              Tools <ChevronDown size={14} className={toolsOpen ? "rotate-180 transition" : "transition"} />
            </button>
            {toolsOpen && (
              <div className="absolute right-0 top-full z-20 min-w-[220px] rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
                {TOOLS.map((t) => (
                  <Link key={t.href} href={t.href}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-navy-800">
                    {t.label}
                  </Link>
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
          <div className="flex flex-col gap-3 text-sm font-medium">
            <Link href="/screen" onClick={() => setOpen(false)} className="text-gray-800 hover:text-navy-800">Screen</Link>
            <Link href="/learn" onClick={() => setOpen(false)} className="text-gray-800 hover:text-navy-800">Learn</Link>
            <div className="mt-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Tools</div>
            {TOOLS.map((t) => (
              <Link key={t.href} href={t.href} onClick={() => setOpen(false)} className="text-gray-700 hover:text-navy-800">
                {t.label}
              </Link>
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
