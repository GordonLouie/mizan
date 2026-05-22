import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
  /** No padding when true — useful when content has its own layout. */
  padded?: boolean;
}

export function Card({ children, className = "", padded = true }: Props) {
  return (
    <div className={
      "rounded-xl border border-gray-200 bg-white " +
      (padded ? "p-6 sm:p-8 " : "") +
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
          <div className="text-[11px] font-semibold uppercase tracking-widest text-gold-600">{kicker}</div>
        )}
        <h2 className="mt-1 text-xl font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
          {title}
        </h2>
        {description && <p className="mt-1.5 text-sm text-gray-600">{description}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
