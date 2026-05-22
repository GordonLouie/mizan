import React from "react";

interface Props {
  children: React.ReactNode;
  /** Top padding variant: spacious, normal, tight. */
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
  kicker?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({ kicker, title, description, action }: PageHeaderProps) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {kicker && (
          <div className="text-[11px] font-semibold uppercase tracking-widest text-gold-600">{kicker}</div>
        )}
        <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl" style={{ fontFamily: "Georgia, serif" }}>
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-base text-gray-600">{description}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </header>
  );
}
