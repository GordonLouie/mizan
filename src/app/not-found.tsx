import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <div className="mx-auto h-20 w-20">
        {/* HalalGauge mark — needle off the dial */}
        <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="14" fill="#19402F"/>
          <g fill="none" strokeLinecap="round">
            <path d="M16.4 47 A18 18 0 0 1 47.6 47" stroke="#FFFFFF" strokeOpacity="0.28" strokeWidth="4.5"/>
          </g>
          <g stroke="#E0AC45" strokeLinecap="round">
            {/* needle swung down, off the scale */}
            <line x1="32" y1="38" x2="24" y2="50" strokeWidth="3.2"/>
            <line x1="32" y1="38" x2="35" y2="33.5" strokeWidth="3.2"/>
          </g>
          <circle cx="32" cy="38" r="3.4" fill="#E0AC45"/>
          <circle cx="32" cy="38" r="1.3" fill="#19402F"/>
        </svg>
      </div>
      <h1 className="mt-6 text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
        This reading&apos;s off the dial.
      </h1>
      <p className="mt-3 text-sm text-gray-600">
        The URL you visited doesn&apos;t exist or has moved. The verdicts you came
        for, though, are right where they were.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/" className="inline-flex items-center gap-2 rounded-md bg-navy-800 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700">
          Back to home
        </Link>
        <Link href="/screen" className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50">
          Open the screener
        </Link>
      </div>
    </div>
  );
}
