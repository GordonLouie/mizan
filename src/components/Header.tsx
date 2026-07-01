/**
 * Header — floating pill, rebuilt around outcome-based groups.
 *
 * Top level (≤5): Screen · Research ▾ · Portfolio ▾ · Calculators ▾ · Learn ▾.
 * Pricing shows only when logged-out (paying users manage billing under Account).
 * "Early development" surfaces (crypto/sukuk) are kept out of the primary nav.
 */

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import MizanWordmark from "@/components/MizanWordmark";

interface NavItem { href: string; label: string; sub: string }
interface NavMenu { label: string; items: NavItem[] }

const MENUS: NavMenu[] = [
  {
    label: "Research",
    items: [
      { href: "/assets", label: "Halal asset map", sub: "Every asset class, mapped" },
      { href: "/baskets", label: "Fund screener", sub: "ETFs & REITs, looked through" },
      { href: "/discover", label: "Discover", sub: "Trending & where scholars split" },
      { href: "/indexes", label: "Halal baskets", sub: "Screened, thesis-driven lists" },
      { href: "/sectors", label: "Sectors", sub: "By industry" },
      { href: "/lists", label: "Curated lists", sub: "Editorial collections" },
      { href: "/vs", label: "Compare stocks", sub: "Side-by-side" },
      { href: "/universe", label: "Universe", sub: "Every ticker we cover" },
    ],
  },
  {
    label: "Portfolio",
    items: [
      { href: "/portfolio", label: "Portfolio score", sub: "Your compliance %" },
      { href: "/watchlist", label: "Watchlist", sub: "Your saved tickers" },
      { href: "/calendar", label: "Earnings calendar", sub: "When holdings report" },
      { href: "/custom", label: "Custom profile", sub: "Set your thresholds" },
    ],
  },
  {
    label: "Calculators",
    items: [
      { href: "/zakat", label: "Zakat calculator", sub: "Annual obligation" },
      { href: "/purification", label: "Purification", sub: "Dividend cleansing" },
    ],
  },
  {
    label: "Learn",
    items: [
      { href: "/learn", label: "Halal investing 101", sub: "How screening works" },
      { href: "/income", label: "Halal income", sub: "Sukuk, takaful, deposits" },
      { href: "/crypto/is-crypto-halal", label: "Is crypto halal?", sub: "How to evaluate tokens" },
      { href: "/ask", label: "Halal investing Q&A", sub: "Common questions, answered" },
      { href: "/methodology", label: "Methodology", sub: "Our standards, sourced" },
    ],
  },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [signedIn, setSignedIn] = useState(false);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch("/api/me").then((r) => r.json()).then((v: { email?: string | null }) => setSignedIn(!!v.email)).catch(() => {});
  }, []);

  function openMenuNow(label: string) {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpenMenu(label);
  }
  function scheduleClose() {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setOpenMenu(null), 160);
  }

  return (
    <>
      {/* Spacer so page content doesn't slide under the floating header */}
      <div aria-hidden className="h-20" />

      <header className="fixed inset-x-0 top-3 z-40 px-3 sm:top-4 sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 rounded-full border border-gray-200 bg-white/85 px-3 py-2 shadow-[0_8px_30px_-12px_rgba(31,58,95,0.18)] backdrop-blur-md sm:px-4">
          {/* Brand mark */}
          <Link href="/" aria-label="HalalGauge home" className="inline-flex shrink-0">
            <MizanWordmark height={28} asLink={false} />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-5 text-[14px] font-medium text-gray-700 md:flex">
            <Link href="/screen" className="hover:text-navy-800">Screen</Link>

            {MENUS.map((menu) => (
              <div
                key={menu.label}
                className="relative"
                onMouseEnter={() => openMenuNow(menu.label)}
                onMouseLeave={scheduleClose}
              >
                <button className="inline-flex items-center gap-1 hover:text-navy-800">
                  {menu.label}
                  <ChevronDown size={14} className={openMenu === menu.label ? "rotate-180 transition" : "transition"} />
                </button>
                {openMenu === menu.label && (
                  <div className="absolute left-1/2 top-full z-20 mt-2 w-[300px] -translate-x-1/2 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                    {menu.items.map((t) => (
                      <Link key={t.href} href={t.href} className="block rounded-lg px-3 py-2 transition hover:bg-gray-50">
                        <div className="text-[14px] font-medium text-gray-900">{t.label}</div>
                        <div className="text-[11px] text-gray-500">{t.sub}</div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {!signedIn && <Link href="/pricing" className="hover:text-navy-800">Pricing</Link>}
          </nav>

          {/* Right: account / auth */}
          <div className="hidden items-center gap-3 md:flex">
            {signedIn ? (
              <Link
                href="/account"
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-4 py-2 text-[13px] font-semibold text-gray-800 transition hover:border-gray-400"
              >
                Account
              </Link>
            ) : (
              <>
                <Link href="/account" className="text-[13px] font-medium text-gray-700 hover:text-navy-800">Sign in</Link>
                <Link
                  href="/account"
                  className="inline-flex items-center gap-1.5 rounded-full bg-navy-900 px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition hover:bg-navy-800"
                >
                  Sign up free
                  <ArrowRight size={14} />
                </Link>
              </>
            )}
          </div>

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
          <div className="mx-auto mt-2 max-h-[80vh] max-w-5xl overflow-y-auto rounded-2xl border border-gray-200 bg-white p-4 shadow-lg md:hidden">
            <div className="flex flex-col gap-1 text-sm">
              {signedIn ? (
                <Link href="/account" onClick={() => setMobileOpen(false)} className="mb-2 rounded-md border border-gray-200 px-3 py-2 text-center font-semibold text-gray-800">Account</Link>
              ) : (
                <div className="mb-2 flex gap-2">
                  <Link href="/account" onClick={() => setMobileOpen(false)} className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-center font-semibold text-gray-800">Sign in</Link>
                  <Link href="/account" onClick={() => setMobileOpen(false)} className="flex-1 rounded-md bg-navy-900 px-3 py-2 text-center font-semibold text-white">Sign up free</Link>
                </div>
              )}

              <Link href="/screen" onClick={() => setMobileOpen(false)} className="rounded-md px-2 py-2 font-medium text-gray-900 hover:bg-gray-50">Screen</Link>

              {MENUS.map((menu) => (
                <div key={menu.label} className="mt-3">
                  <div className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">{menu.label}</div>
                  {menu.items.map((t) => (
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

              {!signedIn && (
                <Link href="/pricing" onClick={() => setMobileOpen(false)} className="mt-3 rounded-md px-2 py-2 font-medium text-gray-900 hover:bg-gray-50">Pricing</Link>
              )}

              <Link
                href="/screen"
                onClick={() => setMobileOpen(false)}
                className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-full border border-navy-900 px-4 py-2.5 text-sm font-semibold text-navy-900"
              >
                Screen a stock <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
