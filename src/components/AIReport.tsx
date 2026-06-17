"use client";

/**
 * AIReport (Phase 3a) — institutional AI compliance report. Wrap the call site in
 * <LockedFeature feature="aiReport">. The component renders the DETERMINISTIC
 * facts (verdict + ratio table) itself; the AI-written prose sits alongside and
 * is clearly grounded. If the AI key isn't configured (or a call fails), it shows
 * the facts plus an honest "AI narrative unavailable" note — never fabrications.
 */
import { useState } from "react";
import { Sparkles, Download, AlertCircle, Loader2, Check, X, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Building2, BarChart3, BookOpen, Droplets } from "lucide-react";
import type { LucideIcon } from "lucide-react";

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
const VERDICT_BANNER: Record<Facts["verdict"], string> = {
  pass: "bg-emerald-50 border-b border-emerald-200",
  borderline: "bg-amber-50 border-b border-amber-200",
  fail: "bg-red-50 border-b border-red-200",
};

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
      if (res.status === 422) {
        setError("This company's data is under review (some figures look implausible), so we're withholding an AI report rather than risk a misleading one.");
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
  const n = report.narrative;
  const VerdictIcon = f.verdict === "pass" ? CheckCircle2 : f.verdict === "fail" ? XCircle : AlertTriangle;
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Verdict banner — deterministic */}
      <div className={"flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6 " + VERDICT_BANNER[f.verdict]}>
        <div>
          <h3 className="text-[19px] font-bold leading-tight text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
            {f.name} <span className="font-normal text-gray-400">{f.ticker}</span>
          </h3>
          <p className="mt-0.5 text-[12px] text-gray-500">{f.sector} · screened per {f.scholarLabel}</p>
        </div>
        <span className={"inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] font-bold " + VERDICT_TONE[f.verdict]}>
          <VerdictIcon size={15} /> {VERDICT_LABEL[f.verdict]}
        </span>
      </div>

      <div className="space-y-7 p-5 sm:p-6">
        {/* Executive summary callout */}
        {n?.executiveSummary?.trim() && (
          <div className="rounded-lg border-l-[3px] border-navy-700 bg-navy-50/50 p-4">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-navy-700">
              <Sparkles size={11} /> Executive summary
            </div>
            <p className="mt-2 text-[14px] leading-relaxed text-gray-800">{n.executiveSummary}</p>
          </div>
        )}

        {/* Screening breakdown — deterministic */}
        <div>
          <SectionHead icon={ShieldCheck} title="Screening breakdown" />
          <div className="mt-3 flex items-start gap-2.5 rounded-lg border border-gray-100 bg-gray-50/60 p-3">
            <StatusDot ok={f.sectorPasses} />
            <div className="text-[13px] leading-relaxed text-gray-700">
              <span className="font-semibold text-gray-900">Business activity</span> — {f.sectorReason}
            </div>
          </div>
          <div className="mt-3 divide-y divide-gray-100 overflow-hidden rounded-lg border border-gray-100">
            {f.ratioChecks.map((c) => (
              <div key={c.label} className="flex items-center justify-between gap-3 px-3 py-2.5">
                <div className="flex min-w-0 items-center gap-2.5">
                  <StatusDot ok={c.passes} />
                  <span className="truncate text-[13px] text-gray-800">{c.label}</span>
                </div>
                <div className="flex shrink-0 items-center gap-3 text-[12px]">
                  <span className="font-mono text-gray-900">{pct(c.value)}</span>
                  <span className="hidden font-mono text-gray-400 sm:inline">
                    {c.threshold === null ? "n/a" : `${c.direction === "max" ? "≤" : "≥"} ${pct(c.threshold)}`}
                  </span>
                  <span className={"w-9 text-right font-semibold " + (c.passes ? "text-emerald-600" : "text-red-600")}>
                    {c.passes ? "Pass" : "Fail"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI narrative — grounded prose */}
        {n ? (
          <div className="space-y-6">
            <NarrativeSection icon={Building2} title="Sector assessment" body={n.sectorAssessment} />
            <NarrativeSection icon={BarChart3} title="Financial analysis" body={n.financialAnalysis} />
            <NarrativeSection icon={BookOpen} title="Scholarly rationale" body={n.scholarRationale} />
            <NarrativeSection icon={Droplets} title="Purification guidance" body={n.purificationGuidance} />
            {n.risks.length > 0 && (
              <div className="rounded-lg border border-amber-200/70 bg-amber-50/40 p-4">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-700">
                  <AlertTriangle size={11} /> Risks &amp; caveats
                </div>
                <ul className="mt-2 space-y-1.5 text-[13px] leading-relaxed text-gray-700">
                  {n.risks.map((r, i) => (
                    <li key={i} className="flex gap-2"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-amber-500" /><span>{r}</span></li>
                  ))}
                </ul>
              </div>
            )}
            {n.bottomLine?.trim() && (
              <div className="rounded-lg bg-navy-800 p-4 text-white">
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70">Bottom line</div>
                <p className="mt-1.5 text-[14px] leading-relaxed">{n.bottomLine}</p>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
              <Sparkles size={10} /> AI-written analysis, grounded strictly in the figures above.
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50/60 px-4 py-3 text-[13px] leading-relaxed text-amber-900">
            <AlertCircle size={15} className="mt-0.5 flex-shrink-0 text-amber-600" />
            <div>
              The AI narrative isn&apos;t available right now{report.aiEnabled ? " (the model didn't return a valid result)" : " — AI reports activate once the Claude API key is configured"}.
              The verdict and ratios above are complete and unaffected.
            </div>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-5 py-4 sm:px-6">
        <p className="max-w-md text-[11px] leading-relaxed text-gray-400">
          Verdict &amp; figures are computed deterministically; the narrative is AI-generated and grounded in them.
          Screening analysis — not investment advice, and not a religious ruling (fatwa). Verify with a qualified scholar.
        </p>
        <button
          type="button"
          onClick={() => download(report)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-[12px] font-semibold text-gray-700 transition hover:border-gray-400"
        >
          <Download size={13} /> Download
        </button>
      </div>
    </div>
  );
}

function StatusDot({ ok }: { ok: boolean }) {
  return (
    <span className={"mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full " + (ok ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600")}>
      {ok ? <Check size={11} /> : <X size={11} />}
    </span>
  );
}

function SectionHead({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-600">
      <Icon size={13} /> {title}
    </div>
  );
}

function NarrativeSection({ icon: Icon, title, body }: { icon: LucideIcon; title: string; body: string }) {
  if (!body?.trim()) return null;
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
        <Icon size={12} /> {title}
      </div>
      <p className="mt-1.5 whitespace-pre-line text-[14px] leading-relaxed text-gray-800">{body}</p>
    </div>
  );
}
