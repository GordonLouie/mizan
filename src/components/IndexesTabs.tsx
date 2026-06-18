"use client";

/**
 * IndexesTabs — shared sub-navigation for the Indexes hub, so the (previously
 * crammed) single page becomes a clean Explore / Compare / Build structure.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/indexes", label: "Explore" },
  { href: "/indexes/compare", label: "Compare" },
  { href: "/indexes/build", label: "Build" },
];

export default function IndexesTabs() {
  const path = usePathname();
  return (
    <div className="mb-7 flex gap-1 border-b border-gray-200">
      {TABS.map((t) => {
        const active = path === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={
              "-mb-px border-b-2 px-4 py-2 text-[14px] font-semibold transition " +
              (active ? "border-navy-800 text-navy-800" : "border-transparent text-gray-500 hover:text-gray-800")
            }
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
