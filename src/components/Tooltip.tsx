"use client";

import { useId, useState } from "react";
import { Info } from "lucide-react";

interface Props {
  text: string;
  label?: string;
  side?: "top" | "right" | "bottom" | "left";
  size?: number;
}

export default function Tooltip({ text, label, side = "top", size = 12 }: Props) {
  const [open, setOpen] = useState(false);
  const id = useId();

  const positions: Record<string, string> = {
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
    left: "right-full mr-2 top-1/2 -translate-y-1/2",
    right: "left-full ml-2 top-1/2 -translate-y-1/2",
  };

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        aria-describedby={open ? id : undefined}
        aria-label={label ?? "More info"}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="inline-flex items-center justify-center rounded-full text-gray-400 hover:text-navy-700 focus:text-navy-700 focus:outline-none"
      >
        <Info size={size} />
      </button>
      {open && (
        <span
          role="tooltip"
          id={id}
          className={
            "pointer-events-none absolute z-30 w-64 rounded-md bg-gray-900 px-3 py-2 text-xs leading-5 text-white shadow-lg " +
            positions[side]
          }
        >
          {text}
        </span>
      )}
    </span>
  );
}
