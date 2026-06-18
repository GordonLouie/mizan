"use client";

/**
 * AIPortfolioAssistant (Phase 3b). Wrap the call site in
 * <LockedFeature feature="aiReport">. Renders the DETERMINISTIC compliance facts
 * (weighted halal %, per-holding issues, screened halal swaps) itself; Claude's
 * narrative sits alongside. Honest no-key / no-data states. No fabrication.
 */
import { useState } from "react";
import Link from "next/link";
import { Sparkles, Download, AlertCircle, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";

type Verdict = "pass" | "borderline" | "fail";
interface SwapCandidate { ticker: string; name: string }
interface HoldingFact {
  ticker: string; name: string; sector: string; shares: number; value: number;
  weightPct: number; verdict: Verdict; issues: string[]; swaps: SwapCandidate[];
}
interface PortfolioFacts {
  scholarLabel: string; totalHoldings: number; coveredHoldings: number; passingHoldings: number;
  passRatePct: number; weightedHalalPct: number; totalValue: number; holdings: HoldingFact[]; notCovered: string[];
}
interface Narrative {
  overallAssessment: string; whatToFix: string; swapGuidance: string; nextSteps: string[]; bottomLine: string;
}
interface Report { facts: PortfolioFacts; narrative: Narrative | null; aiEnabled: boolean; generatedAt: string }

const VERDICT_TONE: Record<Verdict, string> = {
  pass: "text-emerald-700", borderline: "text-amber-700", fail: "text-red-700",
};
const VERDICT_LABEL: Record<Verdict, string> = { pass: "Pass", borderline: "Borderline", fail: "Fail" };

function toMarkdown(r: Report): string {
  const f = r.facts;
  const L: string[] = [];
  L.push(`# Portfolio compliance — per ${f.scholarLabel}`, "");
  L.push(`**Weighted halal: ${f.weightedHalalPct.toFixed(1)}%**  ·  ${f.passingHoldings}/${f.coveredHoldings} holdings pass`, "");
  const nonPass = f.holdings.filter((h) => h.verdict !== "pass");
  if (nonPass.length) {
    L.push("## Non-compliant holdings", "");
    for (const h of nonPass) {
      L.push(`### ${h.ticker} — ${h.name} (${h.weightPct.toFixed(1)}% of portfolio, ${VERDICT_LABEL[h.verdict]})`);
      for (const i of h.issues) L.push(`- ${i}`);
      if (h.swaps.length) L.push(`- Halal swaps: ${h.swaps.map((s) => `${s.ticker} (${s.name})`).join(", ")}`);
      L.push("");
    }
  }
  if (f.notCovered.length) L.push(`_Not yet covered by HalalGauge: ${f.notCovered.join(", ")}._`, "");
  if (r.narrative) {
    const n = r.narrative;
    L.push("## Overall assessment", "", n.overallAssessment, "");
    L.push("## What to fix", "", n.whatToFix, "");
    L.push("## Swap guidance", "", n.swapGuidance, "");
    L.push("## Next steps", "");
    for (const s of n.nextSteps) L.push(`- ${s}`);
    L.push("", "## Bottom line", "", n.bottomLine, "");
  }
  L.push("", `_Generated ${new Date(r.generatedAt).toLocaleString()} by HalalGauge. Compliance % and verdicts are computed deterministically; narrative is AI-generated and grounded in them. Screening guidance, not investment advice._`);
  return L.join("\n");
}

function download(r: Report) {
  const blob = new Blob([toMarkdown(r)], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "mizan-portfolio-report.md"; a.click();
  URL.revokeObjectURL(url);
}

export default function AIPortfolioAssistant({
  holdings,
  scholarId,
}: {
  holdings: { ticker: string; shares: number }[];
  scholarId: string;
}) {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [qAnswer, setQAnswer] = useState<string | null>(null);
  const [qAsked, setQAsked] = useState("");
  const [qLoading, setQLoading] = useState(false);
  const [qError, setQError] = useState<string | null>(null);

  async function askFollowup() {
    const question = q.trim();
    if (!question) return;
    setQLoading(true); setQError(null); setQAnswer(null);
    try {
      const res = await fetch("/api/ai/portfolio", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ holdings, scholarId, question }),
      });
      if (res.status === 429) { setQError("You've reached today's limit. Please try again tomorrow."); return; }
      if (!res.ok) { setQError("Couldn't answer that right now. Please try again."); return; }
      const data = (await res.json()) as { answer: string | null };
      if (data.answer) { setQAnswer(data.answer); setQAsked(question); }
      else setQError("The AI couldn't produce a confident answer — try rephrasing.");
    } catch {
      setQError("Network error. Please try again.");
    } finally {
      setQLoading(false);
    }
  }

  async function generate() {
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/ai/portfolio", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ holdings, scholarId }),
      });
      if (res.status === 429) { setError("You've reached today's limit. Please try again tomorrow."); return; }
      if (res.status === 402) { setError("The AI portfolio assistant is a Pro feature. Upgrade at /pricing."); return; }
      if (!res.ok) { setError("Could not generate the assessment. Please try again."); return; }
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
          AI portfolio assistant
        </h3>
        <p className="mx-auto mt-1 max-w-md text-[13px] leading-relaxed text-gray-600">
          How halal is your portfolio, what&apos;s dragging it down, and which screened halal swaps to
          consider — grounded in your real holdings, never fabricated.
        </p>
        {isCustom && (
          <p className="mx-auto mt-3 max-w-md text-[12px] leading-relaxed text-amber-700">
            AI analysis runs on a named standard. Select a specific scholar (not &ldquo;Custom&rdquo;) above to generate one.
          </p>
        )}
        <button
          type="button" onClick={generate} disabled={loading || holdings.length === 0 || isCustom}
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-navy-800 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-navy-700 disabled:opacity-60"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
          {loading ? "Analysing…" : "Analyse my portfolio"}
        </button>
        {holdings.length === 0 && !isCustom && <p className="mt-3 text-[12px] text-gray-500">Add positions above first.</p>}
        {error && <p className="mt-3 text-[12px] text-red-600">{error}</p>}
      </div>
    );
  }

  const f = report.facts;
  const nonPass = f.holdings.filter((h) => h.verdict !== "pass");
  const pctColor = f.weightedHalalPct >= 85 ? "text-emerald-700" : f.weightedHalalPct >= 60 ? "text-amber-700" : "text-red-700";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
      {/* Headline — deterministic */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">Weighted halal</div>
          <div className={"text-[40px] font-bold leading-none " + pctColor} style={{ fontFamily: "var(--font-display)" }}>
            {f.weightedHalalPct.toFixed(0)}%
          </div>
        </div>
        <div className="text-right text-[12px] text-gray-500">
          {f.passingHoldings} of {f.coveredHoldings} holdings pass · per {f.scholarLabel}
          {f.notCovered.length > 0 && <div className="mt-0.5">Not covered: {f.notCovered.join(", ")}</div>}
        </div>
      </div>

      {/* Non-compliant holdings + swaps — deterministic */}
      <div className="mt-5">
        {nonPass.length === 0 ? (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/60 px-4 py-3 text-[13px] text-emerald-800">
            <CheckCircle2 size={16} /> Every covered holding passes under {f.scholarLabel}.
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
              Needs attention ({nonPass.length})
            </div>
            {nonPass.map((h) => (
              <div key={h.ticker} className="rounded-lg border border-gray-200 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-[13px]">
                    <span className="font-mono font-semibold text-gray-900">{h.ticker}</span>{" "}
                    <span className="text-gray-500">{h.name}</span>
                  </div>
                  <div className="text-right text-[12px] text-gray-500">
                    {h.weightPct.toFixed(1)}% · <span className={"font-semibold " + VERDICT_TONE[h.verdict]}>{VERDICT_LABEL[h.verdict]}</span>
                  </div>
                </div>
                {h.issues.length > 0 && (
                  <ul className="mt-1.5 space-y-0.5 pl-4 text-[12px] leading-relaxed text-gray-600 [list-style:disc]">
                    {h.issues.map((i, k) => <li key={k}>{i}</li>)}
                  </ul>
                )}
                {h.swaps.length > 0 && (
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-emerald-700">Halal swaps:</span>
                    {h.swaps.map((s) => (
                      <Link key={s.ticker} href={`/screen?ticker=${s.ticker}`}
                        className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50/50 px-2 py-0.5 text-[11px] font-medium text-emerald-800 transition hover:border-emerald-400">
                        {s.ticker} <ArrowRight size={10} />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI narrative */}
      {report.narrative ? (
        <div className="mt-6 space-y-5 border-t border-gray-100 pt-5">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-navy-700">
            <Sparkles size={11} /> AI assessment (grounded in the figures above)
          </div>
          <Section title="Overall assessment" body={report.narrative.overallAssessment} />
          <Section title="What to fix" body={report.narrative.whatToFix} />
          <Section title="Swap guidance" body={report.narrative.swapGuidance} />
          {report.narrative.nextSteps.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">Next steps</div>
              <ul className="mt-2 space-y-1 pl-5 text-[13px] leading-relaxed text-gray-700 [list-style:disc]">
                {report.narrative.nextSteps.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}
          <Section title="Bottom line" body={report.narrative.bottomLine} />
        </div>
      ) : (
        <div className="mt-5 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50/60 px-4 py-3 text-[13px] leading-relaxed text-amber-900">
          <AlertCircle size={15} className="mt-0.5 flex-shrink-0 text-amber-600" />
          <div>
            The AI assessment isn&apos;t available right now{report.aiEnabled ? " (the model didn't return a valid result)" : " — AI activates once the Claude API key is configured"}.
            The compliance figures and swaps above are complete and unaffected.
          </div>
        </div>
      )}

      {/* Follow-up Q&A about this portfolio */}
      {report.aiEnabled && (
        <div className="mt-6 border-t border-gray-100 pt-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">Ask about your portfolio</div>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") askFollowup(); }}
              placeholder="e.g., Which swap would raise my halal % the most?"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-[14px] text-gray-900 outline-none focus:border-navy-700"
            />
            <button
              type="button" onClick={askFollowup} disabled={qLoading || !q.trim()}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-navy-800 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-navy-700 disabled:opacity-60"
            >
              {qLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} Ask
            </button>
          </div>
          {qError && <p className="mt-2 text-[12px] text-amber-700">{qError}</p>}
          {qAnswer && (
            <div className="mt-3 rounded-lg border border-navy-200 bg-navy-50/30 p-4">
              {qAsked && <div className="text-[12px] font-semibold text-gray-700">{qAsked}</div>}
              <p className="mt-1.5 whitespace-pre-line text-[14px] leading-relaxed text-gray-800">{qAnswer}</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
        <p className="max-w-md text-[11px] leading-relaxed text-gray-400">
          Compliance % and verdicts are computed deterministically; narrative is AI-generated and grounded in them.
          Screening guidance, not investment advice.
        </p>
        <button type="button" onClick={() => download(report)}
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-[12px] font-semibold text-gray-700 transition hover:border-gray-400">
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
