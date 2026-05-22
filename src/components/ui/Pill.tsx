import React from "react";

type Tone = "neutral" | "pass" | "fail" | "warn" | "navy" | "gold";

interface Props {
  tone?: Tone;
  size?: "sm" | "md";
  children: React.ReactNode;
  className?: string;
}

const TONE: Record<Tone, string> = {
  neutral: "bg-gray-100 text-gray-700",
  pass:    "bg-emerald-50 text-emerald-700",
  fail:    "bg-rose-50 text-rose-700",
  warn:    "bg-amber-50 text-amber-700",
  navy:    "bg-navy-50 text-navy-800",
  gold:    "bg-amber-50 text-amber-700",
};

export function Pill({ tone = "neutral", size = "sm", children, className = "" }: Props) {
  const sz = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";
  return (
    <span className={
      "inline-flex items-center gap-1 rounded-full font-semibold uppercase tracking-wide " +
      TONE[tone] + " " + sz + " " + className
    }>
      {children}
    </span>
  );
}
