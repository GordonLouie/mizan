/**
 * SelectField — the single, canonical dropdown for the whole app.
 *
 * Why this exists: every page used to ship its own native <select> with
 * slightly different styles. Native arrows, rounded boxes, and gray fills
 * looked out of place next to the editorial borderless-underline aesthetic
 * used elsewhere (search bars, inputs). Toby + the testers flagged this.
 *
 * Use this anywhere you'd reach for a <select>. Pass options as either:
 *   - an array of { value, label } objects, or
 *   - children (raw <option> tags) for cases where the page already has
 *     them in markup (lets us migrate without rewriting big lists).
 *
 * Aesthetic locked in: borderless underline, custom chevron, navy-700
 * focus state, no native dropdown arrow.
 */

"use client";

import { ChevronDown } from "lucide-react";
import type { ReactNode, SelectHTMLAttributes } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  /** Optional label rendered above the field. Pass null/undefined to omit. */
  label?: string;
  /** Either pass an options array, or use children with raw <option> tags. */
  options?: SelectOption[];
  /** Compact (text-[14px]) is default; "sm" gives text-[13px] for dense rows. */
  size?: "sm" | "md";
  /** Extra classes for the outer wrapper. */
  wrapperClassName?: string;
  children?: ReactNode;
}

export default function SelectField({
  label,
  options,
  size = "md",
  wrapperClassName,
  className,
  children,
  ...selectProps
}: SelectFieldProps) {
  const textSize = size === "sm" ? "text-[13px]" : "text-[14px]";

  return (
    <div className={wrapperClassName}>
      {label && (
        <label className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
          {label}
        </label>
      )}
      <div
        className={
          (label ? "mt-2 " : "") +
          "flex items-center gap-2 border-b border-gray-200 px-1 py-2 focus-within:border-navy-700"
        }
      >
        <select
          {...selectProps}
          className={
            "w-full appearance-none bg-transparent pr-5 text-gray-900 outline-none " +
            textSize +
            (className ? " " + className : "")
          }
        >
          {options
            ? options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))
            : children}
        </select>
        <ChevronDown
          size={14}
          className="-ml-5 pointer-events-none text-gray-400"
        />
      </div>
    </div>
  );
}
