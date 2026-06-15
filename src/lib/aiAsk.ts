/**
 * aiAsk.ts (Phase 3c) — AI scholar Q&A. SERVER-ONLY.
 *
 * The /ask page ships a vetted, seeded knowledge base (qa_seed). When a question
 * has no strong match there, this answers it with Claude — but GROUNDED: we pass
 * the closest vetted entries for the selected scholar as reference context and
 * instruct the model to stay consistent with them, flag uncertainty, never invent
 * fatwas/citations, and recommend a qualified scholar for specific rulings.
 */
import { QA_KNOWLEDGE_BASE, type QAEntry } from "./qa_seed";
import { getScholar } from "./scholars";
import { generateJson, aiEnabled } from "./ai";

export interface AskAnswer {
  answer: string;
  citations: string[];
}
export interface AskResult {
  answer: AskAnswer | null;
  aiEnabled: boolean;
  /** The vetted KB questions used as grounding context (for transparency). */
  referenceQuestions: string[];
}

function score(entry: QAEntry, query: string): number {
  const q = query.toLowerCase().trim();
  if (!q) return 0;
  const words = q.split(/\s+/).filter((w) => w.length > 2);
  let s = 0;
  for (const k of entry.k) if (q.includes(k.toLowerCase())) s += 5;
  const qText = entry.q.toLowerCase();
  for (const w of words) if (qText.includes(w)) s += 1;
  return s;
}

function topContext(question: string, scholarId: string, n = 4) {
  return QA_KNOWLEDGE_BASE.map((e) => ({ e, s: score(e, question) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, n)
    .map(({ e }) => {
      const a = e.a[scholarId] ?? e.a["aaoifi"] ?? Object.values(e.a)[0];
      return { question: e.q, answer: a?.t ?? "", citations: a?.c ?? [] };
    });
}

const SYSTEM_PROMPT = `You are a careful halal-investing Q&A assistant for Mizan. You answer according to the named scholar/standard the user has selected.

You will be given the user's question, the selected standard, and REFERENCE Q&A entries from Mizan's vetted knowledge base. Rules:
1. Prefer and stay consistent with the reference entries. They reflect Mizan's reviewed positions for this standard.
2. If the question is outside the references' scope or would require a specific fatwa, say so plainly and recommend consulting a qualified scholar — do NOT guess a ruling.
3. NEVER invent fatwas, scholar quotes, citations, dates, or numbers. Only cite sources you are given, or describe well-established general principles generally (without fake references).
4. Be concise: a few short paragraphs at most. Neutral, clear, practical.
5. This is general educational information, not investment advice.

Return ONLY a JSON object (no markdown fences) with exactly:
{
  "answer": "the answer, in plain prose",
  "citations": ["only sources you were given or are certain of; [] if none"]
}`;

function buildUser(question: string, scholarLabel: string, scholarBlurb: string, ctx: ReturnType<typeof topContext>): string {
  return [
    `Selected standard: ${scholarLabel}`,
    scholarBlurb ? `Standard summary: ${scholarBlurb}` : "",
    "",
    "Reference Q&A from Mizan's vetted knowledge base (may be partial or empty):",
    JSON.stringify(ctx, null, 2),
    "",
    `User question: ${question}`,
  ].filter(Boolean).join("\n");
}

function isValid(x: unknown): x is AskAnswer {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  if (typeof o.answer !== "string" || !o.answer.trim()) return false;
  if (!Array.isArray(o.citations) || !o.citations.every((c) => typeof c === "string")) return false;
  return true;
}

export async function generateAskAnswer(question: string, scholarId: string): Promise<AskResult> {
  const scholar = getScholar(scholarId);
  const ctx = topContext(question, scholar.id, 4);
  const base: AskResult = { answer: null, aiEnabled: aiEnabled(), referenceQuestions: ctx.map((c) => c.question) };
  if (!aiEnabled()) return base;

  const answer = await generateJson<AskAnswer>({
    system: SYSTEM_PROMPT,
    user: buildUser(question, scholar.label, scholar.blurb ?? "", ctx),
    maxTokens: 900,
    temperature: 0.3,
  });
  return { ...base, answer: isValid(answer) ? answer : null };
}
