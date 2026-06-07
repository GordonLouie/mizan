/**
 * BloombergRibbon — thin monospace status strip across the top of any page.
 *
 * Part of the Mizan v3 design direction: every page can carry this ribbon to
 * announce the "data is real and current" Bloomberg layer. Sits at the very
 * top, edge-to-edge, hairline border below.
 *
 * Use the `cells` prop to pass arbitrary status fields per page. The first
 * cell automatically gets a live-pulse dot on the left.
 */

"use client";

import type { ReactNode } from "react";

interface RibbonCell {
  /** Small uppercase label (gray-400) */
  label: string;
  /** Bold value next to the label (gray-900) */
  value: ReactNode;
}

interface BloombergRibbonProps {
  /** Cells render right-aligned, separated by gaps. */
  cells: RibbonCell[];
  /** Status text for the leading left side. Default: "Engine live". */
  status?: string;
  /** Optional version tag rendered after status (e.g. "v0.4.0"). */
  version?: string;
}

export default function BloombergRibbon({
  cells,
  status = "Engine live",
  version,
}: BloombergRibbonProps) {
  return (
    <div className="-mx-4 mb-2 border-b border-gray-200 px-4 py-2 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-1 font-mono text-[10px] uppercase tracking-[0.16em] text-gray-500">
        <div className="flex items-center gap-1.5">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="text-gray-700">{status}</span>
          {version && (
            <>
              <span className="text-gray-300">·</span>
              <span>{version}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-x-5 gap-y-1 tabular-nums">
          {cells.map((c, i) => (
            <span key={i}>
              <span className="text-gray-400">{c.label}</span>{" "}
              <span className="text-gray-900">{c.value}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
