import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
  /** No padding when true — useful when content has its own layout. */
  padded?: boolean;
  /**
   * Visual weight:
   *   - "default" (border + white bg) — for standard content blocks
   *   - "bare"    (no border, transparent) — when sitting on a page already cardified
   *   - "subtle"  (tinted bg, no border) — for tertiary callouts
   *   - "accent"  (warm tint + thin border) — for ONE primary callout per page; use sparingly
   */
  tone?: "default" | "bare" | "subtle" | "accent";
}

const TONE_CLASS: Record<NonNullable<Props["tone"]>, string> = {
  default: "border border-gray-200 bg-white",
  bare:    "",
  subtle:  "bg-gray-50/70",
  accent:  "border border-amber-200/70 bg-amber-50/40",
};

export function Card({ children, className = "", padded = true, tone = "default" }: Props) {
  return (
    <div className={
      "rounded-xl " +
      TONE_CLASS[tone] + " " +
      (padded ? "p-6 sm:p-7 " : "") +
      className
    }>
      {children}
    </div>
  );
}

interface SectionHeaderProps {
  kicker?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function SectionHeader({ kicker, title, description, action }: SectionHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        {kicker && (
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
            {kicker}
          </div>
        )}
        <h2 className="mt-1.5 text-xl font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
          {title}
        </h2>
        {description && <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-gray-600">{description}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
