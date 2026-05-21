"use client";

import { useId, useState } from "react";

interface Props {
  term: string;
  def: string;
  children?: React.ReactNode;
}

export default function GlossaryTerm({ term, def, children }: Props) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <span className="relative inline">
      <button
        type="button"
        aria-describedby={open ? id : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={(e) => { e.preventDefault(); setOpen((o) => !o); }}
        className="cursor-help border-b border-dotted border-navy-400 text-navy-700 hover:text-navy-900 focus:text-navy-900 focus:outline-none"
      >
        {children ?? term}
      </button>
      {open && (
        <span
          role="tooltip"
          id={id}
          className="pointer-events-none absolute z-30 mt-2 w-72 -translate-x-1/2 left-1/2 bottom-full mb-2 rounded-md bg-gray-900 px-3 py-2 text-xs font-normal leading-5 text-white shadow-lg"
        >
          <strong className="block text-white">{term}</strong>
          <span className="block mt-1 text-gray-200">{def}</span>
        </span>
      )}
    </span>
  );
}
