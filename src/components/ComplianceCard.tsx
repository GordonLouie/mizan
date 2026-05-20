import type { ScreeningResult, StockFundamentals } from "@/lib/types";
import RatioBar from "./RatioBar";

interface Props {
  stock: StockFundamentals;
  result: ScreeningResult;
}

const VERDICT_STYLES: Record<string, string> = {
  pass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  borderline: "bg-amber-50 text-amber-700 border-amber-200",
  fail: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function ComplianceCard({ stock, result }: Props) {
  const styles = VERDICT_STYLES[result.verdict];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {stock.sector}
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stock.ticker}
            <span className="ml-2 text-sm font-normal text-gray-500">{stock.name}</span>
          </div>
          <div className="mt-0.5 text-sm text-gray-600">
            Verdict under{" "}
            <span className="font-medium text-gray-800">{result.scholarLabel}</span>:
          </div>
        </div>
        <div
          className={
            "rounded-md border px-3 py-1.5 text-sm font-semibold uppercase " + styles
          }
        >
          {result.verdict}
        </div>
      </div>

      <div className="mt-4 rounded-md border border-gray-200 bg-gray-50 p-3 text-sm">
        <div className="font-medium text-gray-800">Business activity check</div>
        <div className="mt-0.5 text-gray-700">
          {result.sectorPasses ? (
            <span className="text-emerald-700">✓ {result.sectorReason}</span>
          ) : (
            <span className="text-rose-700">✗ {result.sectorReason}</span>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {result.ratioChecks.map((c, i) => (
          <RatioBar key={i} check={c} />
        ))}
      </div>

      <div className="mt-4 rounded-md border border-gold-500/30 bg-amber-50 p-3 text-sm text-amber-900">
        <span className="font-medium">Purification:</span> {result.purificationNote}
      </div>
    </div>
  );
}
