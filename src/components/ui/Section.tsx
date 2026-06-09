import React from "react";

interface Props {
  children: React.ReactNode;
  /** Vertical padding: spacious / normal / tight. Defaults to normal. */
  spacing?: "spacious" | "normal" | "tight";
  className?: string;
}

const SPACING: Record<NonNullable<Props["spacing"]>, string> = {
  spacious: "py-12 sm:py-16",
  normal:   "py-8 sm:py-10",
  tight:    "py-4 sm:py-6",
};

export function Section({ children, spacing = "normal", className = "" }: Props) {
  return (
    <section className={SPACING[spacing] + " " + className}>{children}</section>
  );
}

interface PageHeaderProps {
  /** Eyebrow label — appears at most ONCE per page. Keep terse (<3 words). */
  kicker?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({ kicker, title, description, action }: PageHeaderProps) {
  return (
    <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div>
        {kicker && (
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-600">
            {kicker}
          </div>
        )}
        <h1
          className="mt-2 text-[34px] font-bold leading-[1.05] text-gray-900 sm:text-[42px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-gray-600">{description}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </header>
  );
}

/**
 * SubHead — for in-page section headings BELOW the PageHeader.
 * Uses plain bold sans-serif (no amber kicker) so the page has ONE
 * editorial accent (the PageHeader) and everything else is calm.
 */
export function SubHead({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-5">
      <h2
        className="text-lg font-bold text-gray-900"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-gray-600">{description}</p>
      )}
    </div>
  );
}

/**
 * Hairline rule — FT-style section separator. Use between independent
 * sections within a page; do NOT wrap content in extra cards when a
 * hairline can do the same job with less visual weight.
 */
export function Hairline({ className = "" }: { className?: string }) {
  return <hr className={"my-10 border-0 border-t border-gray-200 " + className} />;
}
