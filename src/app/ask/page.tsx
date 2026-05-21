"use client";

import { useEffect, useMemo, useState } from "react";
import { SCHOLAR_PROFILES, getScholar } from "@/lib/scholars";
import { QA_KNOWLEDGE_BASE, QAEntry } from "@/lib/qa_seed";
import ScholarPicker from "@/components/ScholarPicker";
import { Sparkles, BookOpen, AlertCircle, Search } from "lucide-react";

function scoreEntry(entry: QAEntry, query: string): number {
  const q = query.toLowerCase().trim();
  if (!q) return 0;
  const words = q.split(/\s+/).filter((w) => w.length > 2);

  let score = 0;
  for (const k of entry.k) {
    if (q.includes(k.toLowerCase())) score += 5;
  }
  const qText = entry.q.toLowerCase();
  for (const w of words) {
    if (qText.includes(w)) score += 1;
  }
  return score;
}

const STRONG_MATCH_THRESHOLD = 5;

export default function AskPage() {
  const [scholarId, setScholarId] = useState("taqi_usmani");
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<QAEntry | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("mizan.scholarId");
      if (saved && SCHOLAR_PROFILES.some((p) => p.id === saved)) setScholarId(saved);
    } catch {}
  }, []);

  const scholar = getScholar(scholarId);

  const scored = useMemo(() => {
    if (!query.trim()) return [];
    return QA_KNOWLEDGE_BASE
      .map((e) => ({ e, s: scoreEntry(e, query) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 6);
  }, [query]);

  const matches = scored.map((x) => x.e);
  const topScore = scored[0]?.s ?? 0;
  const isWeakMatch = query.trim() && matches.length > 0 && topScore < STRONG_MATCH_THRESHOLD;

  const active = picked ?? matches[0] ?? null;
  const answer = useMemo(() => {
    if (!active) return null;
    return active.a[scholarId] ?? active.a["aaoifi"] ?? Object.values(active.a)[0] ?? null;
  }, [active, scholarId]);

  const popular = useMemo(() => QA_KNOWLEDGE_BASE.slice(0, 8), []);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm font-medium text-gold-600">
          <Sparkles size={16} />
          <span>AI scholar Q&A</span>
        </div>
        <h1 className="mt-1 text-3xl font-bold text-gray-900">Ask a scholar</h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-600">
          Type your question. Mizan returns the answer per your selected scholar from
          a knowledge base of 49 common questions, with citations. The production
          version is powered by Anthropic Claude with system prompts reviewed by the
          Shariah Supervisory Board.
        </p>
      </div>

      <ScholarPicker value={scholarId} onChange={setScholarId} />

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <label className="block text-xs font-medium uppercase tracking-wide text-gray-500">Your question</label>
        <div className="mt-2 flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 focus-within:border-navy-400 focus-within:bg-white">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPicked(null); }}
            placeholder="e.g., Is staking ETH halal?  ·  Is my 401(k) halal?  ·  What about gold ETFs?"
            className="w-full bg-transparent text-base outline-none"
          />
        </div>

        {query.trim() && matches.length > 0 && (
          <div className="mt-3">
            <div className="text-xs text-gray-500">
              {isWeakMatch ? "Closest matches (may be approximate):" : "Top matches:"}
            </div>
            <div className="mt-1 flex flex-wrap gap-2">
              {matches.map((m, i) => (
                <button key={i} type="button" onClick={() => setPicked(m)}
                  className={
                    "rounded-md border px-2 py-1 text-xs " +
                    (picked === m || (!picked && i === 0)
                      ? "border-navy-700 bg-navy-50 text-navy-800"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50")
                  }>
                  {m.q}
                </button>
              ))}
            </div>
          </div>
        )}

        {!query.trim() && (
          <div className="mt-3">
            <div className="text-xs text-gray-500">Popular questions:</div>
            <div className="mt-1 flex flex-wrap gap-2">
              {popular.map((m, i) => (
                <button key={i} type="button" onClick={() => { setPicked(m); setQuery(""); }}
                  className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50">
                  {m.q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {isWeakMatch && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <strong>We&apos;re not sure that&apos;s a direct match.</strong> The closest entries in
          our seeded knowledge base are shown below — but your question may be outside
          their scope. The production version (powered by Claude) handles arbitrary
          questions. For a specific ruling, write to{" "}
          <a href="mailto:methodology@mizan.app" className="underline">methodology@mizan.app</a>.
        </div>
      )}

      {active && answer && (
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-medium text-gray-500">
            <span>Answer per</span>
            <span className="rounded bg-navy-50 px-2 py-0.5 text-navy-700">{scholar.label}</span>
            {!active.a[scholarId] && (
              <span className="rounded bg-amber-50 px-2 py-0.5 text-amber-700">
                Falling back — your scholar hasn&apos;t ruled directly
              </span>
            )}
          </div>
          <div className="text-base font-semibold text-gray-900">{active.q}</div>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-700">{answer.t}</p>
          {answer.c.length > 0 && (
            <div className="mt-4 border-t border-gray-100 pt-3">
              <div className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                <BookOpen size={12} /> Citations
              </div>
              <ul className="mt-1 list-disc pl-5 text-xs text-gray-600">
                {answer.c.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          )}
          <div className="mt-4 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
            <div>
              This response is a scholarly opinion based on the cited sources. It is
              not individual investment advice. For matters with material financial
              consequences, consult both a qualified scholar and a licensed financial advisor.
            </div>
          </div>
        </div>
      )}

      {query.trim() && matches.length === 0 && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <strong>No match in the seeded knowledge base.</strong> The production
          version handles any question. This prototype ships with 49; try rephrasing
          (e.g., &quot;crypto staking&quot;, &quot;halal 401k&quot;, &quot;tesla halal&quot;), or pick from the
          popular list above.
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-600">
        <strong>What&apos;s in the knowledge base?</strong> 49 entries across:
        cryptocurrency, gold and silver, real estate and REITs, sukuk and bonds,
        retirement accounts, mortgages, options/futures/short selling, zakat and
        khums, purification, specific stock verdicts, halal ETFs, portfolio strategy,
        insurance and takaful, and Mizan-specific FAQs.
      </div>
    </div>
  );
}
