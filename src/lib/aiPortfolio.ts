/**
 * aiPortfolio.ts (Phase 3b) — the AI portfolio assistant engine. SERVER-ONLY.
 *
 * Same integrity model as aiReport: the compliance %, every per-holding verdict,
 * and the list of halal swap candidates are computed DETERMINISTICALLY here
 * (screenStock + findHalalAlternatives + real prices). Claude only writes the
 * narrative, and is told it may ONLY reference the swaps we supply — never invent
 * a ticker, verdict, or number.
 */
import { findStock } from "./data";
import { screenStock } from "./screen";
import { getScholar } from "./scholars";
import { findHalalAlternatives } from "./alternatives";
import { currentPrice } from "./prices";
import { generateJson, aiEnabled } from "./ai";
import { hasBannedContent } from "./aiGuards";
import type { Verdict } from "./types";

export interface SwapCandidate {
  ticker: string;
  name: string;
}
export interface HoldingFact {
  ticker: string;
  name: string;
  sector: string;
  shares: number;
  value: number;
  weightPct: number;
  verdict: Verdict;
  /** Why it isn't fully halal (sector + failing ratios). Empty when it passes. */
  issues: string[];
  /** Same-sector halal swaps (only for non-passing holdings). */
  swaps: SwapCandidate[];
}
export interface PortfolioFacts {
  scholarLabel: string;
  totalHoldings: number;
  coveredHoldings: number;
  passingHoldings: number;
  /** passing / covered, by count. 0-100. */
  passRatePct: number;
  /** passing value / covered value. 0-100. The headline "you're X% halal". */
  weightedHalalPct: number;
  totalValue: number;
  holdings: HoldingFact[];
  /** Tickers the user holds that HalalGauge doesn't cover yet. */
  notCovered: string[];
}
export interface PortfolioNarrative {
  overallAssessment: string;
  whatToFix: string;
  swapGuidance: string;
  nextSteps: string[];
  bottomLine: string;
}
export interface PortfolioReport {
  facts: PortfolioFacts;
  narrative: PortfolioNarrative | null;
  aiEnabled: boolean;
  generatedAt: string;
}

export interface HoldingInput {
  ticker: string;
  shares: number;
}

export function buildPortfolioFacts(holdings: HoldingInput[], scholarId: string): PortfolioFacts {
  const scholar = getScholar(scholarId);
  const notCovered: string[] = [];

  // First pass: resolve, screen, value.
  const rows = holdings
    .map((h) => {
      const stock = findStock(h.ticker);
      if (!stock) {
        if (h.ticker?.trim()) notCovered.push(h.ticker.toUpperCase());
        return null;
      }
      const shares = Number(h.shares) || 0;
      const price = currentPrice(stock);
      const value = shares * price;
      const r = screenStock(stock, scholar);
      const issues: string[] = [];
      if (!r.sectorPasses) issues.push(r.sectorReason);
      for (const c of r.ratioChecks) if (!c.passes) issues.push(`${c.label}: ${c.explanation}`);
      const swaps =
        r.verdict === "pass"
          ? []
          : findHalalAlternatives(stock, scholar, 3).map((a) => ({ ticker: a.ticker, name: a.name }));
      return { stock, shares, value, verdict: r.verdict, issues, swaps };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const totalValue = rows.reduce((s, r) => s + r.value, 0);
  const passingValue = rows.filter((r) => r.verdict === "pass").reduce((s, r) => s + r.value, 0);
  const passingHoldings = rows.filter((r) => r.verdict === "pass").length;

  const holdingsOut: HoldingFact[] = rows
    .map((r) => ({
      ticker: r.stock.ticker,
      name: r.stock.name,
      sector: r.stock.sector,
      shares: r.shares,
      value: r.value,
      weightPct: totalValue > 0 ? (r.value / totalValue) * 100 : 0,
      verdict: r.verdict,
      issues: r.issues,
      swaps: r.swaps,
    }))
    .sort((a, b) => b.value - a.value);

  return {
    scholarLabel: scholar.label,
    totalHoldings: holdings.length,
    coveredHoldings: rows.length,
    passingHoldings,
    passRatePct: rows.length > 0 ? (passingHoldings / rows.length) * 100 : 0,
    weightedHalalPct: totalValue > 0 ? (passingValue / totalValue) * 100 : 0,
    totalValue,
    holdings: holdingsOut,
    notCovered,
  };
}

const SYSTEM_PROMPT = `You are a Shariah-compliance portfolio assistant for HalalGauge, a halal investing platform. You help a retail investor understand how halal their portfolio is and how to improve it.

You will receive DETERMINISTIC facts as JSON: an overall weighted halal percentage, each holding with its verdict, weight, the specific issues that make it non-compliant, and a short list of same-sector halal SWAP candidates that HalalGauge has already screened as passing.

STRICT RULES:
1. NEVER change a holding's verdict — they are computed deterministically and are final.
2. NEVER invent tickers, companies, numbers, or rulings. When you suggest a swap, use ONLY the swap candidates provided for that holding. If none are provided, say so.
3. Prioritise by weight — the largest non-compliant positions matter most.
4. NEVER quote the Qur'an or hadith, name or attribute views to scholars, or reason about fiqh. You are describing what HalalGauge's automated screen computed, not issuing a religious ruling.
5. NEVER give investment advice — do not say a holding is a good/bad investment or tell the user to buy/sell/hold. You may note that swapping has tax/market consequences and is the user's decision.
6. Every sentence must be specific to THIS portfolio's holdings — no generic filler that could apply to any portfolio (e.g. avoid "consult a financial advisor", "review your allocation regularly").

Return ONLY a JSON object (no markdown fences) with exactly these keys:
{
  "overallAssessment": "2-3 sentences: how halal the portfolio is overall (use the weighted %) and the headline takeaway.",
  "whatToFix": "1-2 paragraphs naming the SPECIFIC non-compliant holdings (largest weight first, by ticker) and the specific reason each fails.",
  "swapGuidance": "1 paragraph on the suggested halal swaps, referencing ONLY the provided candidates by ticker. If a holding has no candidates, say so.",
  "nextSteps": ["3 to 5 short bullets, each naming a SPECIFIC holding or action from this portfolio — never generic advice."],
  "bottomLine": "1-2 sentences. State plainly this is a screening summary, not a fatwa or investment advice."
}`;

function factsToJson(facts: PortfolioFacts): string {
  return JSON.stringify(
    {
      standard: facts.scholarLabel,
      weightedHalalPct: Math.round(facts.weightedHalalPct * 10) / 10,
      passRatePct: Math.round(facts.passRatePct * 10) / 10,
      coveredHoldings: facts.coveredHoldings,
      passingHoldings: facts.passingHoldings,
      notCovered: facts.notCovered,
      holdings: facts.holdings.map((h) => ({
        ticker: h.ticker,
        name: h.name,
        sector: h.sector,
        weightPct: Math.round(h.weightPct * 10) / 10,
        verdict: h.verdict,
        issues: h.issues,
        halalSwapCandidates: h.swaps.map((s) => `${s.ticker} (${s.name})`),
      })),
    },
    null,
    2,
  );
}

function buildUserPrompt(facts: PortfolioFacts): string {
  return [
    "Here are the deterministic portfolio facts. Write the assessment grounded strictly in this data.",
    "",
    factsToJson(facts),
  ].join("\n");
}

const QA_SYSTEM_PROMPT = `You are a Shariah-compliance portfolio assistant for HalalGauge answering a specific question about the user's OWN portfolio.

You are given the deterministic portfolio facts (overall halal %, each holding's verdict, weight, issues, and pre-screened halal swap candidates) and the user's question. Rules:
1. Answer ONLY from the provided facts. NEVER change a verdict or invent tickers, numbers, companies, or rulings.
2. When suggesting swaps, use ONLY the provided candidates.
3. If the facts don't contain what's needed, say so plainly.
4. NEVER quote scripture, name scholars, reason about fiqh, or give investment advice (buy/sell/hold). You explain what the automated screen shows — not a religious ruling.
5. Be concise and practical; specific to this portfolio.

Return ONLY a JSON object: { "answer": "your answer in plain prose" }`;

export interface PortfolioAnswer {
  answer: string;
}

export async function generatePortfolioAnswer(
  holdings: HoldingInput[],
  scholarId: string,
  question: string,
): Promise<{ answer: string | null; aiEnabled: boolean }> {
  const facts = buildPortfolioFacts(holdings, scholarId);
  if (!aiEnabled() || facts.coveredHoldings === 0) return { answer: null, aiEnabled: aiEnabled() };
  const out = await generateJson<PortfolioAnswer>({
    system: QA_SYSTEM_PROMPT,
    user: `Portfolio facts:\n${factsToJson(facts)}\n\nUser question: ${question}`,
    maxTokens: 900,
    temperature: 0.3,
  });
  const valid = out && typeof out.answer === "string" && out.answer.trim() && !hasBannedContent(out.answer);
  return { answer: valid ? out.answer : null, aiEnabled: true };
}

function isValidNarrative(x: unknown): x is PortfolioNarrative {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  for (const k of ["overallAssessment", "whatToFix", "swapGuidance", "bottomLine"]) {
    if (typeof o[k] !== "string") return false;
  }
  if (!Array.isArray(o.nextSteps) || !o.nextSteps.every((s) => typeof s === "string")) return false;
  if ((o.overallAssessment as string).trim().length === 0 || (o.bottomLine as string).trim().length === 0) return false;
  // Safety gate: no fiqh/scripture/scholar-attribution or investment advice anywhere.
  const allText = [o.overallAssessment, o.whatToFix, o.swapGuidance, o.bottomLine, ...(o.nextSteps as string[])].join("\n");
  return !hasBannedContent(allText);
}

export async function generatePortfolioReport(holdings: HoldingInput[], scholarId: string): Promise<PortfolioReport> {
  const facts = buildPortfolioFacts(holdings, scholarId);
  const base: PortfolioReport = { facts, narrative: null, aiEnabled: aiEnabled(), generatedAt: new Date().toISOString() };
  if (!aiEnabled() || facts.coveredHoldings === 0) return base;

  const narrative = await generateJson<PortfolioNarrative>({
    system: SYSTEM_PROMPT,
    user: buildUserPrompt(facts),
    maxTokens: 1600,
    temperature: 0.3,
  });
  return { ...base, narrative: isValidNarrative(narrative) ? narrative : null };
}
