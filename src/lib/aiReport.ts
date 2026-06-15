/**
 * aiReport.ts (Phase 3a) — the AI Shariah-compliance report engine. SERVER-ONLY.
 *
 * INTEGRITY MODEL (the whole point): the verdict and every number come from the
 * DETERMINISTIC screener (screenStock). Claude only writes the interpretive
 * prose, and is instructed to never change the verdict or invent figures/rulings.
 * The UI renders the deterministic facts itself; the model's words sit alongside
 * them. This keeps the institutional deliverable trustworthy.
 */
import { screenStock } from "./screen";
import { getScholar } from "./scholars";
import { listStocks } from "./data";
import { generateJson, aiEnabled } from "./ai";
import type { StockFundamentals, ScreeningResult } from "./types";

/** Deterministic, source-of-truth facts. Rendered directly + fed to the model. */
export interface StockReportFacts {
  ticker: string;
  name: string;
  sector: string;
  marketCapUsd: number;
  dividendYieldPct: number;
  scholarLabel: string;
  scholarSourceLabel: string;
  verdict: ScreeningResult["verdict"];
  sectorPasses: boolean;
  sectorReason: string;
  ratioChecks: ScreeningResult["ratioChecks"];
  purificationNote: string;
}

/** The narrative the model returns — prose only, grounded in the facts above. */
export interface StockReportNarrative {
  executiveSummary: string;
  sectorAssessment: string;
  financialAnalysis: string;
  scholarRationale: string;
  purificationGuidance: string;
  risks: string[];
  bottomLine: string;
}

export interface StockReport {
  facts: StockReportFacts;
  narrative: StockReportNarrative | null; // null when AI disabled / failed
  aiEnabled: boolean;
  generatedAt: string;
}

export function findStock(ticker: string): StockFundamentals | undefined {
  const t = ticker.toUpperCase();
  return listStocks().find((s) => s.ticker.toUpperCase() === t);
}

export function buildStockReportFacts(stock: StockFundamentals, scholarId: string): StockReportFacts {
  const scholar = getScholar(scholarId);
  const r = screenStock(stock, scholar);
  return {
    ticker: stock.ticker,
    name: stock.name,
    sector: stock.sector,
    marketCapUsd: stock.marketCapUsd,
    dividendYieldPct: stock.dividendYieldPct,
    scholarLabel: r.scholarLabel,
    scholarSourceLabel: r.scholarSourceLabel,
    verdict: r.verdict,
    sectorPasses: r.sectorPasses,
    sectorReason: r.sectorReason,
    ratioChecks: r.ratioChecks,
    purificationNote: r.purificationNote,
  };
}

const SYSTEM_PROMPT = `You are a senior Shariah-compliance equity analyst writing a concise, professional report for institutional investors at Mizan, a halal stock-screening platform.

You will be given a DETERMINISTIC screening result as JSON: the final verdict, the sector check, each financial ratio (its observed value, the scholar's threshold, and whether it passes), and the purification rule. These facts are ground truth produced by Mizan's screening engine.

STRICT RULES — follow them exactly:
1. NEVER change, soften, or contradict the provided "verdict". It is final and computed deterministically. Your prose must be consistent with it.
2. NEVER invent numbers, thresholds, rulings, fatwas, dates, or business facts that are not in the provided data. Refer to figures qualitatively ("comfortably below the cap", "only marginally above") rather than fabricating precise values you were not given.
3. If something looks unusual in the data, flag it as a caveat — do NOT override the verdict.
4. Be precise, neutral, and institutional in tone. No hype, no salesmanship.
5. This is screening analysis, not investment advice. Reflect that in the risks/bottom line.
6. Attribute compliance reasoning to the named scholar/standard; another standard may differ.

Return ONLY a JSON object (no markdown fences, no prose around it) with exactly these string keys:
{
  "executiveSummary": "2-3 sentences: the verdict in plain language and the single most important reason for it.",
  "sectorAssessment": "1 short paragraph on the business-activity (sector) screen result.",
  "financialAnalysis": "1-2 paragraphs interpreting the financial ratio results qualitatively: which are comfortably within limits and which are tight or breached, and what that implies.",
  "scholarRationale": "1 paragraph on why THIS scholar/standard produces this verdict, noting any distinctive threshold (e.g. an illiquid-asset floor) that drives the result.",
  "purificationGuidance": "1 short paragraph translating the purification rule into practical guidance for a holder.",
  "risks": ["3 to 5 short bullet strings: data/methodology caveats, borderline ratios to monitor, and dependence on the chosen standard."],
  "bottomLine": "1-2 sentences summarising, with an appropriate not-advice caveat."
}`;

function buildUserPrompt(facts: StockReportFacts): string {
  return [
    "Here is the deterministic screening result. Write the report grounded strictly in this data.",
    "",
    JSON.stringify(
      {
        company: { ticker: facts.ticker, name: facts.name, sector: facts.sector },
        marketCapUsd: facts.marketCapUsd,
        dividendYieldPct: facts.dividendYieldPct,
        standard: { scholar: facts.scholarLabel, source: facts.scholarSourceLabel },
        verdict: facts.verdict,
        sectorScreen: { passes: facts.sectorPasses, reason: facts.sectorReason },
        financialRatios: facts.ratioChecks.map((c) => ({
          metric: c.label,
          observedPct: c.value,
          thresholdPct: c.threshold,
          rule: c.direction === "max" ? "value must be <= threshold" : "value must be >= threshold",
          passes: c.passes,
          note: c.explanation,
        })),
        purificationRule: facts.purificationNote,
      },
      null,
      2,
    ),
  ].join("\n");
}

function isValidNarrative(x: unknown): x is StockReportNarrative {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  const strs = ["executiveSummary", "sectorAssessment", "financialAnalysis", "scholarRationale", "purificationGuidance", "bottomLine"];
  for (const k of strs) if (typeof o[k] !== "string") return false;
  if (!Array.isArray(o.risks) || !o.risks.every((r) => typeof r === "string")) return false;
  // Require the two anchor sections to be non-trivial.
  return (o.executiveSummary as string).trim().length > 0 && (o.bottomLine as string).trim().length > 0;
}

export async function generateStockReport(stock: StockFundamentals, scholarId: string): Promise<StockReport> {
  const facts = buildStockReportFacts(stock, scholarId);
  const base: StockReport = { facts, narrative: null, aiEnabled: aiEnabled(), generatedAt: new Date().toISOString() };
  if (!aiEnabled()) return base;

  const narrative = await generateJson<StockReportNarrative>({
    system: SYSTEM_PROMPT,
    user: buildUserPrompt(facts),
    maxTokens: 1600,
    temperature: 0.3,
  });
  return { ...base, narrative: isValidNarrative(narrative) ? narrative : null };
}
