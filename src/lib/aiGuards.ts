/**
 * aiGuards.ts — shared safety gates for every AI-generated surface. SERVER-ONLY.
 *
 * The product's credibility rests on the deterministic screen. Any AI prose that
 * (a) issues/quotes religious rulings, (b) gives investment advice, or (c) states a
 * figure not present in the deterministic payload is REJECTED before display, and
 * the UI falls back to the deterministic facts alone. These guards encode that.
 */

/** Terms that signal the model has strayed into fiqh/scripture/scholar attribution or investment advice. */
const BANNED_TERMS = [
  // scripture / fiqh / scholar attribution — the model must never generate these
  "quran", "qur'an", "koran", "hadith", "sunnah", "surah", "ayah", "ayat",
  "fatwa", "mufti", "shaykh", "sheikh", "ijtihad", "madhhab", "madhab",
  "scholars agree", "scholars hold", "scholars say", "according to scholars",
  "islamic jurisprudence", "religiously permissible", "religiously prohibited",
  // investment advice
  "good investment", "bad investment", "should buy", "should sell", "should hold",
  "recommend buying", "recommend selling", "we recommend you", "strong buy",
  "attractive investment", "buy this stock", "sell this stock",
];

/** True if the text contains banned fiqh/scripture/scholar-attribution or investment-advice content. */
export function hasBannedContent(text: string): boolean {
  const t = text.toLowerCase();
  return BANNED_TERMS.some((b) => t.includes(b));
}

const NUM_RE = /\d+(?:\.\d+)?/g;

/**
 * True if `text` contains a numeric figure that can't be traced to `allowed`
 * (the set of numbers in the deterministic payload). Small integer counts
 * (≤ 12, no decimal) are permitted ("3 checks", "5 standards").
 */
export function hasFabricatedNumber(text: string, allowed: Set<string>): boolean {
  const matches = text.match(NUM_RE) ?? [];
  for (const m of matches) {
    const n = Number(m);
    if (!isFinite(n)) continue;
    if (Number.isInteger(n) && n <= 12 && !m.includes(".")) continue;
    if (allowed.has(m) || allowed.has(n.toFixed(1)) || allowed.has(n.toFixed(2)) || allowed.has(String(Math.round(n)))) continue;
    return true;
  }
  return false;
}

/** Build the set of number-strings a narrative is allowed to echo. */
export function numberSet(values: Array<number | null | undefined>): Set<string> {
  const s = new Set<string>();
  for (const v of values) {
    if (v == null || !isFinite(v)) continue;
    s.add(String(Math.round(v)));
    s.add(Math.abs(v).toFixed(1));
    s.add(Math.abs(v).toFixed(2));
  }
  return s;
}
