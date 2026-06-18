/**
 * aiReport.ts (Phase 3a, re-scoped) — the AI Shariah-compliance EXPLAINER. SERVER-ONLY.
 *
 * INTEGRITY MODEL (the whole point): the verdict and every number come from the
 * DETERMINISTIC screener (screenStock). The model is a *translator/explainer* of
 * those outputs — never an analyst, never a mufti. It is constrained to:
 *   - never restate fiqh, quote Qur'an/hadith, or name scholars (beyond the standard
 *     label already in the data),
 *   - never opine on investment merit ("good buy", "attractive"),
 *   - never introduce a number that isn't in the deterministic payload.
 * Generated text is then VALIDATED: if it contains any figure not traceable to the
 * payload, the narrative is rejected and the UI falls back to the deterministic
 * facts alone. Successful narratives are CACHED per (ticker, scholar, verdict) so the
 * same stock always reads the same way (kills LLM inconsistency + saves cost).
 */
import { screenStock } from "./screen";
import { getScholar } from "./scholars";
import { listStocks } from "./data";
import { generateJson, aiEnabled } from "./ai";
import { hasBannedContent, hasFabricatedNumber, numberSet } from "./aiGuards";
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

/**
 * The narrative the model returns — a tight, fixed template. PLAIN-LANGUAGE
 * EXPLANATION of the deterministic screen only. No fiqh reasoning, no scholar
 * attribution beyond the standard label, no investment opinion.
 */
export interface StockReportNarrative {
  /** The verdict in plain language + the single deciding factor. 2-3 sentences. */
  plainVerdict: string;
  /** Which check decided it (the sector screen or a specific ratio), in plain words. 1 short para. */
  whatDecidedIt: string;
  /** 2-4 short bullets: ratios closest to their limit / what could change the verdict. */
  whatToMonitor: string[];
  /** Practical translation of the purification rule for a holder. 1 short para. */
  purificationGuidance: string;
}

export interface StockReport {
  facts: StockReportFacts;
  narrative: StockReportNarrative | null; // null when AI disabled / failed / rejected
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

const SYSTEM_PROMPT = `You are a careful writer for HalalGauge, a halal stock-screening platform. Your ONLY job is to translate a deterministic, rules-based screening result into clear plain language for a non-expert reader. You are NOT an analyst, an adviser, or a religious scholar.

You will be given the screening result as JSON: the final verdict, the business-activity (sector) check, each financial ratio (observed value, the standard's threshold, pass/fail), and the purification rule. These are ground truth.

ABSOLUTE RULES — follow exactly, no exceptions:
1. NEVER change, soften, or contradict the "verdict". Your words must be consistent with it.
2. NEVER state a numeric figure (percentage, ratio, price, market cap, year) unless that exact number is present in the provided data. Prefer qualitative language ("comfortably below the limit", "only just over the cap", "well within range"). When in doubt, use words, not numbers.
3. NEVER quote or paraphrase the Qur'an or hadith. NEVER name or attribute views to any scholar or council beyond repeating the provided standard label (e.g. "the AAOIFI standard"). NEVER explain or reason about fiqh, Islamic jurisprudence, or why a ruling is religiously correct. You are describing what the AUTOMATED SCREEN computed, not issuing a ruling.
4. NEVER give investment opinions or advice. Do not say a stock is a good/bad/safe/attractive investment, or suggest buying, selling, or holding.
5. Plain, neutral, concrete. No hype, no salesmanship, no filler. Every sentence must be specific to THIS company's screen result — never generic boilerplate that could apply to any company.

Return ONLY a JSON object (no markdown, no prose around it) with exactly these keys:
{
  "plainVerdict": "2-3 sentences: state the verdict in plain language and name the single factor that drove it. Describe figures qualitatively, not numerically.",
  "whatDecidedIt": "1 short paragraph: explain in plain words which check decided the outcome — the business-activity screen, or which financial ratio was the deciding one — and what that means for a non-expert. No numbers unless they are in the data.",
  "whatToMonitor": ["2 to 4 short bullets: which ratio(s) sit closest to their limit, or what (data, the chosen standard, a balance-sheet change) could change this verdict over time. Frame as things to watch, not advice."],
  "purificationGuidance": "1 short paragraph translating the provided purification rule into practical, plain-language terms for someone who holds the stock. Do not invent amounts."
}`;

function buildUserPrompt(facts: StockReportFacts): string {
  return [
    "Here is the deterministic screening result. Write the explanation grounded strictly in this data.",
    "",
    JSON.stringify(
      {
        company: { ticker: facts.ticker, name: facts.name, sector: facts.sector },
        standard: { label: facts.scholarLabel },
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

function isValidNarrative(x: unknown, facts: StockReportFacts): x is StockReportNarrative {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  const strFields = ["plainVerdict", "whatDecidedIt", "purificationGuidance"];
  for (const k of strFields) if (typeof o[k] !== "string" || (o[k] as string).trim().length === 0) return false;
  if (!Array.isArray(o.whatToMonitor) || o.whatToMonitor.length === 0 || !o.whatToMonitor.every((r) => typeof r === "string")) return false;

  // Safety gates: no fabricated numbers, no fiqh/scripture/advice anywhere.
  const allowed = numberSet([...facts.ratioChecks.flatMap((c) => [c.value, c.threshold]), facts.dividendYieldPct]);
  const allText = [o.plainVerdict, o.whatDecidedIt, o.purificationGuidance, ...(o.whatToMonitor as string[])].join("\n");
  if (hasFabricatedNumber(allText, allowed)) return false;
  if (hasBannedContent(allText)) return false;
  return true;
}

// In-memory cache: same (ticker, scholar, verdict) → same narrative for the life of the
// server instance. Fundamentals are static at runtime (build-time JSON), so this is safe.
const narrativeCache = new Map<string, StockReportNarrative>();

export async function generateStockReport(stock: StockFundamentals, scholarId: string): Promise<StockReport> {
  const facts = buildStockReportFacts(stock, scholarId);
  const base: StockReport = { facts, narrative: null, aiEnabled: aiEnabled(), generatedAt: new Date().toISOString() };
  if (!aiEnabled()) return base;

  const cacheKey = `${facts.ticker}|${scholarId}|${facts.verdict}`;
  const cached = narrativeCache.get(cacheKey);
  if (cached) return { ...base, narrative: cached };

  const narrative = await generateJson<StockReportNarrative>({
    system: SYSTEM_PROMPT,
    user: buildUserPrompt(facts),
    maxTokens: 1100,
    temperature: 0.2,
  });

  if (isValidNarrative(narrative, facts)) {
    narrativeCache.set(cacheKey, narrative);
    return { ...base, narrative };
  }
  // Rejected (fabricated number, banned content, or malformed) → deterministic-only.
  return base;
}
