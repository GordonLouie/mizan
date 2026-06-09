import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <div className="mx-auto h-20 w-20">
        <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className="text-navy-800">
          <rect width="64" height="64" rx="14" fill="currentColor"/>
          <rect x="12" y="28" width="40" height="3" rx="1.5" fill="#C89030"/>
          <rect x="30" y="14" width="3" height="14" rx="1.5" fill="#C89030"/>
          <circle cx="32" cy="14" r="3.5" fill="#C89030"/>
          <path d="M 14 36 Q 20 46 26 36 Z" fill="#FFFFFF"/>
          <path d="M 38 35 Q 44 43 50 35 Z" fill="#FFFFFF" opacity="0.7"/>
          <rect x="26" y="48" width="12" height="3" rx="1" fill="#C89030"/>
        </svg>
      </div>
      <h1 className="mt-6 text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
        That page is out of balance.
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
