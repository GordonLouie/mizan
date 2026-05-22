"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, GraduationCap, ListChecks, Bookmark, Calculator } from "lucide-react";

interface Tab {
  href: string;
  label: string;
  icon: React.ReactNode;
  /** Match a path prefix to highlight the tab. */
  matches: (path: string) => boolean;
}

const TABS: Tab[] = [
  {
    href: "/screen",
    label: "Screen",
    icon: <Search size={18} />,
    matches: (p) => p === "/screen" || p.startsWith("/screen/") || p === "/" || p.startsWith("/vs"),
  },
  {
    href: "/lists",
    label: "Lists",
    icon: <ListChecks size={18} />,
    matches: (p) => p === "/lists" || p.startsWith("/lists/") || p === "/universe",
  },
  {
    href: "/watchlist",
    label: "Saved",
    icon: <Bookmark size={18} />,
    matches: (p) => p === "/watchlist" || p === "/portfolio",
  },
  {
    href: "/zakat",
    label: "Zakat",
    icon: <Calculator size={18} />,
    matches: (p) => p === "/zakat" || p === "/purification",
  },
  {
    href: "/learn",
    label: "Learn",
    icon: <GraduationCap size={18} />,
    matches: (p) => p === "/learn" || p === "/methodology" || p === "/ask" || p === "/glossary",
  },
];

/**
 * Fixed bottom tab bar shown only on small screens. Mirrors fintech-app
 * conventions (5 tabs, icons + labels). Adds a safe-area bottom inset for
 * notched iOS devices.
 */
export default function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary navigation"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <ul className="grid grid-cols-5">
        {TABS.map((t) => {
          const active = t.matches(pathname);
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                className={
                  "flex h-14 flex-col items-center justify-center gap-0.5 text-[10px] font-medium tracking-wide transition-colors " +
                  (active ? "text-navy-800" : "text-gray-500 hover:text-gray-800")
                }
                aria-current={active ? "page" : undefined}
              >
                <span className={active ? "text-navy-800" : "text-gray-500"}>
                  {t.icon}
                </span>
                <span>{t.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
