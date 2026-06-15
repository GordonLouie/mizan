"use client";

/**
 * AIReport (Phase 3a) — institutional AI compliance report. Wrap the call site in
 * <LockedFeature feature="aiReport">. The component renders the DETERMINISTIC
 * facts (verdict + ratio table) itself; the AI-written prose sits alongside and
 * is clearly grounded. If the AI key isn't configured (or a call fails), it shows
 * the facts plus an honest "AI narrative unavailable" note — never fabrications.
 */
import { useState } from "react";
import { Sparkles, Download, AlertCircle, Loader2 } from "lucide-react";

interface RatioCheck {
  label: string;
  value: number;
  threshold: number | null;
  direction: "max" | "min";
  passes: boolean;
  explanation: string;
}
interface Facts {
  ticker: string;
  name: string;
  sector: string;
  marketCapUsd: number;
  dividendYieldPct: number;
  scholarLabel: string;
  scholarSourceLabel: string;
  verdict: "pass" | "borderline" | "fail";
  sectorPasses: boolean;
  sectorReason: string;
  ratioChecks: RatioCheck[];
  purificationNote: string;
}
interface Narrative {
  executiveSummary: string;
  sectorAssessment: string;
  financialAnalysis: string;
  scholarRationale: string;
  purificationGuidance: string;
  risks: string[];
  bottomLine: string;
}
interface Report {
  facts: Facts;
  narrative: Narrative | null;
  aiEnabled: boolean;
  generatedAt: string;
}

const VERDICT_TONE: Record<Facts["verdict"], string> = {
  pass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  borderline: "bg-amber-50 text-amber-700 border-amber-200",
  fail: "bg-red-50 text-red-700 border-red-200",
};
const VERDICT_LABEL: Record<Facts["verdict"], string> = { pass: "Pass", borderline: "Borderline", fail: "Fail" };

function pct(n: number) {
  return `${n.toFixed(1)}%`;
}

function toMarkdown(r: Report): string {
  const f = r.facts;
  const lines: string[] = [];
  lines.push(`# Shariah compliance report — ${f.name} (${f.ticker})`);
  lines.push("");
  lines.push(`**Verdict (${f.scholarLabel}): ${VERDICT_LABEL[f.verdict]}**`);
  lines.push("");
  lines.push(`Sector: ${f.sector}  ·  Standard source: ${f.scholarSourceLabel}`);
  lines.push("");
  lines.push(`**Business activity:** ${f.sectorPasses ? "Pass" : "Fail"} — ${f.sectorReason}`);
  lines.push("");
  lines.push(`| Financial ratio | Observed | Threshold | Result |`);
  lines.push(`|---|---|---|---|`);
  for (const c of f.ratioChecks) {
    const thr = c.threshold === null ? "n/a" : `${c.direction === "max" ? "≤" : "≥"} ${pct(c.threshold)}`;
    lines.push(`| ${c.label} | ${pct(c.value)} | ${thr} | ${c.passes ? "Pass" : "Fail"} |`);
  }
  lines.push("");
  lines.push(`**Purification:** ${f.purificationNote}`);
  lines.push("");
  if (r.narrative) {
    const n = r.narrative;
    lines.push("## Executive summary", "", n.executiveSummary, "");
    lines.push("## Sector assessment", "", n.sectorAssessment, "");
    lines.push("## Financial analysis", "", n.financialAnalysis, "");
    lines.push("## Scholarly rationale", "", n.scholarRationale, "");
    lines.push("## Purification guidance", "", n.purificationGuidance, "");
    lines.push("## Risks & caveats", "");
    for (const risk of n.risks) lines.push(`- ${risk}`);
    lines.push("", "## Bottom line", "", n.bottomLine, "");
  }
  lines.push("");
  lines.push(`_Generated ${new Date(r.generatedAt).toLocaleString()} by Mizan. Screening analysis, not investment advice. Verdict and figures are computed deterministically; narrative is AI-generated and grounded in those figures. Verify with a qualified scholar._`);
  return lines.join("\n");
}

function download(r: Report) {
  const blob = new Blob([toMarkdown(r)], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `mizan-report-${r.facts.ticker}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AIReport({ ticker, scholarId }: { ticker: string; scholarId: string }) {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/report", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ type: "stock", ticker, scholarId }),
      });
      if (res.status === 429) {
        setError("You've reached today's report limit. Please try again tomorrow.");
        return;
      }
      if (res.status === 402) {
        setError("AI reports are a Pro feature. Upgrade at /pricing to generate one.");
        return;
      }
      if (!res.ok) {
        setError("Could not generate the report. Please try again.");
        return;
      }
      const data = (await res.json()) as { report: Report };
      setReport(data.report);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const isCustom = scholarId === "custom";

  if (!report) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-navy-50 text-navy-700">
          <Sparkles size={18} />
        </div>
        <h3 className="mt-3 text-[16px] font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
          AI compliance report
        </h3>
        <p className="mx-auto mt-1 max-w-md text-[13px] leading-relaxed text-gray-600">
          A written, institutional-grade analysis of {ticker}&apos;s screening result — grounded in the
          deterministic verdict and ratios, never fabricated.
        </p>
        {isCustom && (
          <p className="mx-auto mt-3 max-w-md text-[12px] leading-relaxed text-amber-700">
            AI reports run on a named standard. Select a specific scholar (not &ldquo;Custom&rdquo;) above to generate one.
          </p>
        )}
        <button
          type="button"
          onClick={generate}
          disabled={loading || isCustom}
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-navy-800 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-navy-900 disabled:opacity-60"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
          {loading ? "Generating…" : "Generate report"}
        </button>
        {error && <p className="mt-3 text-[12px] text-red-600">{error}</p>}
      </div>
    );
  }

  const f = report.facts;
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
      {/* Header — deterministic */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-[18px] font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
            {f.name} <span className="text-gray-400">({f.ticker})</span>
          </h3>
          <p className="mt-0.5 text-[12px] text-gray-500">{f.sector} · per {f.scholarLabel}</p>
        </div>
        <span className={"rounded-full border px-3 py-1 text-[12px] font-semibold " + VERDICT_TONE[f.verdict]}>
          {VERDICT_LABEL[f.verdict]}
        </span>
      </div>

      {/* Sector + ratio table — deterministic */}
      <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50/60 p-3 text-[13px] text-gray-700">
        <b>Business activity:</b> {f.sectorPasses ? "Pass" : "Fail"} — {f.sectorReason}
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="py-1.5 pr-2 font-medium">Financial ratio</th>
              <th className="py-1.5 px-2 font-medium">Observed</th>
              <th className="py-1.5 px-2 font-medium">Threshold</th>
              <th className="py-1.5 pl-2 font-medium">Result</th>
            </tr>
          </thead>
          <tbody>
            {f.ratioChecks.map((c) => (
              <tr key={c.label} className="border-b border-gray-100">
                <td className="py-1.5 pr-2 text-gray-800">{c.label}</td>
                <td className="py-1.5 px-2 font-mono text-gray-700">{pct(c.value)}</td>
                <td className="py-1.5 px-2 font-mono text-gray-500">
                  {c.threshold === null ? "n/a" : `${c.direction === "max" ? "≤" : "≥"} ${pct(c.threshold)}`}
                </td>
                <td className={"py-1.5 pl-2 font-semibold " + (c.passes ? "text-emerald-600" : "text-red-600")}>
                  {c.passes ? "Pass" : "Fail"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AI narrative — grounded prose */}
      {report.narrative ? (
        <div className="mt-6 space-y-5">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-navy-700">
            <Sparkles size={11} /> AI analysis (grounded in the figures above)
          </div>
          <Section title="Executive summary" body={report.narrative.executiveSummary} />
          <Section title="Sector assessment" body={report.narrative.sectorAssessment} />
          <Section title="Financial analysis" body={report.narrative.financialAnalysis} />
          <Section title="Scholarly rationale" body={report.narrative.scholarRationale} />
          <Section title="Purification guidance" body={report.narrative.purificationGuidance} />
          {report.narrative.risks.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">Risks &amp; caveats</div>
              <ul className="mt-2 space-y-1 pl-5 text-[13px] leading-relaxed text-gray-700 [list-style:disc]">
                {report.narrative.risks.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}
          <Section title="Bottom line" body={report.narrative.bottomLine} />
        </div>
      ) : (
        <div className="mt-5 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50/60 px-4 py-3 text-[13px] leading-relaxed text-amber-900">
          <AlertCircle size={15} className="mt-0.5 flex-shrink-0 text-amber-600" />
          <div>
            The AI narrative isn&apos;t available right now{report.aiEnabled ? " (the model didn't return a valid result)" : " — AI reports activate once the Claude API key is configured"}.
            The deterministic verdict and ratios above are complete and unaffected.
          </div>
        </div>
      )}

      {/* Footer actions */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
        <p className="max-w-md text-[11px] leading-relaxed text-gray-400">
          Verdict &amp; figures are computed deterministically; narrative is AI-generated and grounded in them.
          Screening analysis, not investment advice — verify with a qualified scholar.
        </p>
        <button
          type="button"
          onClick={() => download(report)}
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-[12px] font-semibold text-gray-700 transition hover:border-gray-400"
        >
          <Download size={13} /> Download
        </button>
      </div>
    </div>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  if (!body?.trim()) return null;
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">{title}</div>
      <p className="mt-1.5 whitespace-pre-line text-[14px] leading-relaxed text-gray-800">{body}</p>
    </div>
  );
}
