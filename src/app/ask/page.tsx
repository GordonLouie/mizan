"use client";

import { useEffect, useMemo, useState } from "react";
import { SCHOLAR_PROFILES, getScholar } from "@/lib/scholars";
import { QA_KNOWLEDGE_BASE, QAEntry } from "@/lib/qa_seed";
import ScholarPicker from "@/components/ScholarPicker";
import { BookOpen, AlertCircle, Search } from "lucide-react";

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
    <div className="pb-20">
      {/* PAGE HEADER */}
      <header className="pt-6">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          AI scholar Q&amp;A
        </div>
        <h1
          className="mt-3 text-[36px] font-bold leading-[1.1] text-gray-900 sm:text-[44px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Ask a scholar
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-gray-600">
          Type your question. Mizan returns the answer per your selected scholar from a
          knowledge base of 49 common questions, with citations. The production version
          will be powered by Anthropic Claude with system prompts reviewed by qualified
          scholars once that engagement is in place.
        </p>
      </header>

      {/* SCHOLAR PICKER */}
      <div className="mt-8 sm:max-w-md">
        <ScholarPicker value={scholarId} onChange={setScholarId} />
      </div>

      {/* QUERY INPUT */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-5">
        <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
          Your question
        </label>
        <div className="mt-2 flex items-center gap-2 border-b border-gray-200 px-1 py-2 focus-within:border-navy-700">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPicked(null); }}
            placeholder="e.g., Is staking ETH halal?  ·  Is my 401(k) halal?  ·  What about gold ETFs?"
            className="w-full bg-transparent text-[15px] text-gray-900 outline-none placeholder:text-gray-400"
          />
        </div>

        {query.trim() && matches.length > 0 && (
          <div className="mt-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
              {isWeakMatch ? "Closest matches (may be approximate)" : "Top matches"}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {matches.map((m, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPicked(m)}
                  className={
                    "rounded-md border px-2.5 py-1.5 text-[12px] transition " +
                    (picked === m || (!picked && i === 0)
                      ? "border-navy-700 bg-navy-50 text-navy-800"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:text-gray-900")
                  }
                >
                  {m.q}
                </button>
              ))}
            </div>
          </div>
        )}

        {!query.trim() && (
          <div className="mt-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
              Popular questions
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {popular.map((m, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => { setPicked(m); setQuery(""); }}
                  className="rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-[12px] text-gray-700 transition hover:border-gray-400 hover:text-gray-900"
                >
                  {m.q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* WEAK MATCH WARNING */}
      {isWeakMatch && (
        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50/60 px-4 py-3 text-[13px] leading-relaxed text-amber-900">
          <strong>We&apos;re not sure that&apos;s a direct match.</strong> The closest
          entries in our seeded knowledge base are shown above — but your question may be
          outside their scope. The production version (powered by Claude) handles
          arbitrary questions. For a specific ruling, write to{" "}
          <a href="mailto:methodology@mizaninvesting.com" className="underline hover:text-amber-700">
            methodology@mizaninvesting.com
          </a>.
        </div>
      )}

      {/* ANSWER */}
      {active && answer && (
        <article className="mt-8 border-t border-gray-200 pt-8">
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <span className="text-gray-500">Answer per</span>
            <span className="rounded-full bg-navy-50 px-2 py-0.5 font-semibold text-navy-700">
              {scholar.label}
            </span>
            {!active.a[scholarId] && (
              <span className="rounded-full bg-amber-50 px-2 py-0.5 font-semibold text-amber-700">
                Falling back — your scholar hasn&apos;t ruled directly
              </span>
            )}
          </div>
          <h2
            className="mt-4 text-[22px] font-bold leading-tight text-gray-900 sm:text-[26px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {active.q}
          </h2>
          <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-gray-700">
            {answer.t}
          </p>

          {answer.c.length > 0 && (
            <div className="mt-6 border-t border-gray-100 pt-5">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                <BookOpen size={11} /> Citations
              </div>
              <ul className="mt-3 space-y-1.5 pl-5 text-[12px] text-gray-600 [list-style:disc]">
                {answer.c.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          )}

          <div className="mt-6 flex items-start gap-2 border-l-2 border-amber-300 py-1 pl-4 text-[12px] leading-relaxed text-gray-700">
            <AlertCircle size={14} className="mt-0.5 flex-shrink-0 text-amber-600" />
            <div>
              This response is a scholarly opinion based on the cited sources. It is not
              individual investment advice. For matters with material financial
              consequences, consult both a qualified scholar and a licensed financial
              advisor.
            </div>
          </div>
        </article>
      )}

      {/* NO MATCH */}
      {query.trim() && matches.length === 0 && (
        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50/60 px-4 py-3 text-[13px] leading-relaxed text-amber-900">
          <strong>No match in the seeded knowledge base.</strong> The production version
          handles any question. This prototype ships with 49; try rephrasing
          (e.g., &quot;crypto staking&quot;, &quot;halal 401k&quot;, &quot;tesla halal&quot;), or pick from the
          popular list above.
        </div>
      )}

      {/* KNOWLEDGE BASE INFO */}
      <div className="mt-16 border-t border-gray-200 pt-6">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          About this knowledge base
        </div>
        <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-gray-600">
          49 entries across cryptocurrency, gold and silver, real estate and REITs,
          sukuk and bonds, retirement accounts, mortgages, options/futures/short selling,
          zakat and khums, purification, specific stock verdicts, halal ETFs, portfolio
          strategy, insurance and takaful, and Mizan-specific FAQs.
        </p>
      </div>
    </div>
  );
}
