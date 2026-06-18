"use client";

/**
 * BasketExport — turns a basket from a "list you can't act on" into a plan you
 * can. Exports the holdings (equal-weight) as CSV to import into a broker or
 * spreadsheet. No fake "buy" integration — an honest, universal export.
 */
import { Download } from "lucide-react";

interface Holding { ticker: string; name: string; sector: string }

export default function BasketExport({ name, holdings }: { name: string; holdings: Holding[] }) {
  function exportCsv() {
    const weight = holdings.length ? (100 / holdings.length).toFixed(2) : "0";
    const header = "Ticker,Name,Sector,Equal weight %";
    const rows = holdings.map((h) => `${h.ticker},"${h.name.replace(/"/g, "'")}",${h.sector},${weight}`);
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-holdings.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={exportCsv}
      className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-[12px] font-semibold text-gray-700 transition hover:border-gray-400"
    >
      <Download size={13} /> Export holdings (CSV)
    </button>
  );
}
