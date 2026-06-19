"use client";

/**
 * PurificationStatement — the itemized, downloadable purification record. The
 * recurring, halal-specific Pro value: for each dividend-paying holding, the slice
 * of dividend income that is impermissible (and so should be given to charity),
 * summed into a year-end statement the user keeps as a record.
 *
 * Estimate = holding value × dividend yield × impermissible-income %. Computed from
 * current fundamentals; an estimate to guide giving, not a fatwa.
 */
import { Download, Droplets } from "lucide-react";

interface Holding {
  ticker: string;
  name: string;
  value: number;
  divYieldPct: number;
  impermissiblePct: number;
}

function money(n: number): string {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function PurificationStatement({ holdings, scholarLabel }: { holdings: Holding[]; scholarLabel: string }) {
  const rows = holdings
    .map((h) => {
      const annualDividend = h.value * ((h.divYieldPct || 0) / 100);
      const impure = annualDividend * ((h.impermissiblePct || 0) / 100);
      return { ...h, annualDividend, impure };
    })
    .filter((r) => r.impure > 0.005)
    .sort((a, b) => b.impure - a.impure);

  const total = rows.reduce((s, r) => s + r.impure, 0);

  function download() {
    const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const L: string[] = [];
    L.push(`# Purification statement — HalalGauge`);
    L.push("");
    L.push(`Generated ${date} · Standard: ${scholarLabel}`);
    L.push("");
    L.push(`| Holding | Est. annual dividend | Impermissible % | To purify |`);
    L.push(`|---|---|---|---|`);
    for (const r of rows) {
      L.push(`| ${r.ticker} — ${r.name.replace(/\|/g, "/")} | ${money(r.annualDividend)} | ${r.impermissiblePct.toFixed(1)}% | ${money(r.impure)} |`);
    }
    L.push("");
    L.push(`**Total estimated purification (annual): ${money(total)}**`);
    L.push("");
    L.push(`_Estimate from current fundamentals: holding value × dividend yield × impermissible-income share. It approximates the portion of your dividend income to give to charity. This is an estimate to guide giving, not a religious ruling (fatwa) or tax advice. Verify with a qualified scholar._`);
    const blob = new Blob([L.join("\n")], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `halalgauge-purification-statement.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5 text-[13px] leading-relaxed text-gray-600">
        Nothing to purify right now — none of your holdings pays a dividend with an impermissible-income
        component under the {scholarLabel} screen.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Droplets size={15} className="text-navy-700" />
          <span className="text-[14px] font-semibold text-gray-900">Purification owed (annual estimate)</span>
        </div>
        <button
          type="button"
          onClick={download}
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-[12px] font-semibold text-gray-700 transition hover:border-gray-400"
        >
          <Download size={13} /> Download statement
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-gray-100 text-left text-[11px] uppercase tracking-wide text-gray-500">
              <th className="px-5 py-2.5 font-semibold">Holding</th>
              <th className="px-4 py-2.5 text-right font-semibold">Est. annual dividend</th>
              <th className="px-4 py-2.5 text-right font-semibold">Impermissible</th>
              <th className="px-5 py-2.5 text-right font-semibold">To purify</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.ticker} className="border-b border-gray-100 last:border-0">
                <td className="px-5 py-2.5"><span className="font-semibold text-gray-900">{r.ticker}</span> <span className="text-gray-500">{r.name}</span></td>
                <td className="px-4 py-2.5 text-right font-mono text-gray-700">{money(r.annualDividend)}</td>
                <td className="px-4 py-2.5 text-right font-mono text-gray-500">{r.impermissiblePct.toFixed(1)}%</td>
                <td className="px-5 py-2.5 text-right font-mono font-semibold text-navy-800">{money(r.impure)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-200 bg-gray-50/60">
              <td className="px-5 py-3 text-[13px] font-semibold text-gray-900" colSpan={3}>Total to give to charity (annual)</td>
              <td className="px-5 py-3 text-right font-mono text-[14px] font-bold text-navy-800">{money(total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <p className="border-t border-gray-100 px-5 py-2.5 text-[11px] leading-relaxed text-gray-400">
        Estimate from current fundamentals (value × dividend yield × impermissible-income share). An estimate
        to guide giving — not a fatwa or tax advice.
      </p>
    </div>
  );
}
