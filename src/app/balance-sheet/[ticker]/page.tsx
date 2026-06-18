/**
 * /balance-sheet/[ticker]
 *
 * Power-user view: the full annotated balance sheet for a single stock.
 * Shows the entire balance sheet in natural sections (Assets → Liabilities
 * → Income excerpt) with line items marked when they feed a halal check.
 *
 * Linked from /screen via the "View full balance sheet" CTA in HalalChecks.
 * Lives as its own page (rather than buried on /screen) so the /screen
 * page stays lean (verdict + timeline + checks) and this page serves
 * users who want to verify every underlying number.
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { findStock } from "@/lib/data";
import { getScholar, SCHOLAR_PROFILES } from "@/lib/scholars";
import { loadCustomProfile } from "@/lib/customProfile";
import { screenStock } from "@/lib/screen";
import AnnotatedBalanceSheet from "@/components/AnnotatedBalanceSheet";
import ScholarPicker from "@/components/ScholarPicker";

export default function BalanceSheetPage() {
  const params = useParams();
  const ticker = String(params?.ticker || "").toUpperCase();

  const [scholarId, setScholarId] = useState("aaoifi");
  const [bump, setBump] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("mizan.scholarId");
      if (saved && SCHOLAR_PROFILES.some((p) => p.id === saved)) {
        setScholarId(saved);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const onFocus = () => setBump((b) => b + 1);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const stock = findStock(ticker);
  const scholar = useMemo(
    () => (scholarId === "custom" ? loadCustomProfile() : getScholar(scholarId)),
    [scholarId, bump],
  );
  const result = useMemo(
    () => (stock ? screenStock(stock, scholar) : null),
    [stock, scholar],
  );

  if (!stock || !result) {
    return (
      <div className="pb-20">
        <div className="pt-6">
          <Link
            href="/screen"
            className="inline-flex items-center gap-1 text-[13px] text-navy-700 hover:text-navy-900"
          >
            <ArrowLeft size={14} /> Back to screener
          </Link>
        </div>
        <div className="mt-10 rounded-xl border border-amber-200 bg-amber-50/60 p-6">
          <h1 className="text-[22px] font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
            {ticker} not in dataset
          </h1>
          <p className="mt-2 text-[14px] text-gray-700">
            HalalGauge&apos;s prototype dataset doesn&apos;t include this ticker yet. Email us at
            hello@mizaninvesting.com and we&apos;ll add it in the next batch.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* BREADCRUMB / BACK NAV */}
      <div className="pt-6">
        <Link
          href={`/screen?ticker=${ticker}`}
          className="inline-flex items-center gap-1 text-[13px] text-navy-700 hover:text-navy-900"
        >
          <ArrowLeft size={14} /> Back to {ticker} verdict
        </Link>
      </div>

      {/* PAGE HEADER */}
      <header className="mt-4">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Annotated balance sheet · halal screening
        </div>
        <h1
          className="mt-3 text-[36px] font-bold leading-[1.1] text-gray-900 sm:text-[44px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {stock.name}
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-gray-600">
          The full balance sheet for {stock.ticker}, with the line items that
          feed each halal check marked and explained inline. Read it like a
          financial report that grades itself.
        </p>
      </header>

      {/* SCHOLAR PICKER (so the checks update if user changes scholar) */}
      <div className="mt-8 sm:max-w-sm">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500 mb-2">
          Showing under
        </div>
        <ScholarPicker value={scholarId} onChange={setScholarId} />
      </div>

      {/* THE ANNOTATED BALANCE SHEET */}
      <AnnotatedBalanceSheet stock={stock} result={result} scholar={scholar} />

      {/* FOOTER — back to screener */}
      <div className="mt-10 flex justify-center">
        <Link
          href={`/screen?ticker=${ticker}`}
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:text-gray-900"
        >
          <ArrowLeft size={14} /> Back to {ticker} verdict
        </Link>
      </div>
    </div>
  );
}
