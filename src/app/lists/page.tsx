import Link from "next/link";
import { CURATED_LISTS, statsForList, fmtMarketCap } from "@/lib/lists";
import { Card, PageHeader, Pill } from "@/components/ui";

export const metadata = {
  title: "Curated lists · Mizan",
  description:
    "Hand-picked halal investing collections — mega-caps, dividend payers, ETFs, " +
    "tech leaders, consumer staples, and stricter-Hanafi-only equities.",
};

export default function ListsIndex() {
  return (
    <div className="space-y-8">
      <PageHeader
        kicker="Discover"
        title="Curated lists"
        description="Editorially-picked collections to help you find a starting point. Every list is re-screened against your scholar every time it loads — names that drift out are visibly marked."
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {CURATED_LISTS.map((list) => {
          const stats = statsForList(list, list.defaultScholarId);
          const passPct = stats.total
            ? Math.round((stats.pass / stats.total) * 100)
            : 0;
          return (
            <Link
              key={list.slug}
              href={`/lists/${list.slug}`}
              className="group block"
            >
              <Card className="h-full transition-shadow hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-amber-700">
                    {list.kicker}
                  </div>
                  <Pill tone="navy">{stats.total} stocks</Pill>
                </div>
                <h2
                  className="mt-2 text-xl font-bold text-gray-900 group-hover:text-navy-800"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {list.title}
                </h2>
                <p className="mt-1 text-sm italic text-gray-600">{list.audience}</p>
                <p className="mt-3 line-clamp-3 text-sm text-gray-700">{list.blurb}</p>

                <div className="mt-5 grid grid-cols-3 gap-2 border-t border-gray-100 pt-4">
                  <Stat label="Pass" value={`${passPct}%`} tone="pass" />
                  <Stat
                    label="Avg yield"
                    value={`${stats.avgDividendYield.toFixed(1)}%`}
                    tone="neutral"
                  />
                  <Stat
                    label="Total cap"
                    value={fmtMarketCap(stats.totalMarketCapUsd)}
                    tone="neutral"
                  />
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  Default scholar:{" "}
                  <span className="font-semibold text-gray-700">
                    {scholarShort(list.defaultScholarId)}
                  </span>
                  <span className="float-right text-navy-700 group-hover:underline">
                    View list →
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card className="bg-gray-50">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
          About these lists
        </div>
        <p className="mt-2 text-sm text-gray-700">
          Curated lists are <strong>not investment recommendations</strong>. They are starting
          points for research — Mizan does not assess whether a stock fits your financial
          goals, risk tolerance, or tax situation. Always do your own due diligence, and
          consider speaking with a registered financial adviser before acting.
        </p>
      </Card>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "pass" | "neutral";
}) {
  const cls =
    tone === "pass"
      ? "text-emerald-700"
      : "text-gray-900";
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </div>
      <div
        className={`mt-0.5 text-lg font-bold ${cls}`}
        style={{ fontFamily: "Georgia, serif" }}
      >
        {value}
      </div>
    </div>
  );
}

function scholarShort(id: string): string {
  switch (id) {
    case "aaoifi":
      return "AAOIFI";
    case "taqi_usmani":
      return "Mufti Taqi";
    case "djim":
      return "DJIM";
    case "jafari":
      return "Ja'fari";
    case "strict":
      return "Strict";
    default:
      return id;
  }
}
