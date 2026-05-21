"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, GraduationCap } from "lucide-react";

const PRIMARY = [
  { href: "/learn", label: "Learn", highlight: true },
  { href: "/screen", label: "Screen" },
  { href: "/universe", label: "Universe" },
  { href: "/ask", label: "Ask" },
  { href: "/zakat", label: "Zakat" },
  { href: "/portfolio", label: "Portfolio" },
];

const SECONDARY = [
  { href: "/custom", label: "Custom profile" },
  { href: "/purification", label: "Purification" },
  { href: "/blog", label: "Blog" },
  { href: "/compare", label: "Compare" },
  { href: "/methodology", label: "Methodology" },
  { href: "/glossary", label: "Glossary" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/about", label: "About" },
  { href: "/help", label: "Help" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-navy-800 shadow-sm">
            <MizanScale />
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-navy-800" style={{ fontFamily: "Georgia, serif" }}>
              Mizan
            </span>
            <span className="hidden text-xs text-gray-500 xl:inline">
              halal investing, made clear
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-medium text-gray-700 lg:flex">
          {PRIMARY.map((l) => (
            l.highlight ? (
              <Link key={l.href} href={l.href} className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-emerald-700 hover:bg-emerald-100">
                <GraduationCap size={14} /> {l.label}
              </Link>
            ) : (
              <Link key={l.href} href={l.href} className="hover:text-navy-700">{l.label}</Link>
            )
          ))}
          <div className="group relative">
            <button className="inline-flex items-center gap-1 hover:text-navy-700">More ▾</button>
            <div className="invisible absolute right-0 top-full z-20 mt-2 min-w-[200px] rounded-lg border border-gray-200 bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
              {SECONDARY.map((l) => (
                <Link key={l.href} href={l.href} className="block rounded px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">{l.label}</Link>
              ))}
            </div>
          </div>
        </nav>

        <button className="lg:hidden" onClick={() => setOpen((o) => !o)} aria-label={open ? "Close menu" : "Open menu"}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-gray-100 bg-white px-6 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            {[...PRIMARY, ...SECONDARY].map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm text-gray-700 hover:text-navy-700">
                {l.label}
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
    <svg viewBox="0 0 32 32" width="22" height="22" aria-hidden="true">
      <rect x="6" y="14" width="20" height="1.6" rx="0.8" fill="#E8C547" />
      <rect x="15.2" y="7" width="1.6" height="7" rx="0.8" fill="#E8C547" />
      <circle cx="16" cy="7" r="1.8" fill="#E8C547" />
      <path d="M 7 18 Q 10 23 13 18 Z" fill="#FFFFFF" />
      <path d="M 19 17 Q 22 21 25 17 Z" fill="#FFFFFF" opacity="0.7" />
      <rect x="13" y="24" width="6" height="1.6" rx="0.4" fill="#E8C547" />
    </svg>
  );
}
