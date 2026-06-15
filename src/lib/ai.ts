/**
 * ai.ts (Phase 3) — tiny Anthropic Messages API client over plain fetch.
 *
 * NO npm dependency (keeps the build clean) and INERT until you set
 * ANTHROPIC_API_KEY. Until then aiEnabled() is false and every caller no-ops
 * gracefully — exactly like kv.ts / email.ts. SERVER-ONLY: never import from a
 * client component (it would leak the key into the bundle).
 *
 * Model is configurable via ANTHROPIC_MODEL (default: a current Sonnet). We pin
 * the API version header per Anthropic's docs.
 */
const API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";
const API_URL = "https://api.anthropic.com/v1/messages";
const API_VERSION = "2023-06-01";

export function aiEnabled(): boolean {
  return !!API_KEY;
}

export function aiModel(): string {
  return MODEL;
}

export interface GenerateOpts {
  system: string;
  user: string;
  maxTokens?: number;
  /** 0 = deterministic. We keep reports low-temp for consistency. */
  temperature?: number;
}

/**
 * Returns the model's text, or null if AI is disabled / the call fails. Never
 * throws — callers branch on null and show an honest "AI not available" state.
 */
export async function generateText(opts: GenerateOpts): Promise<string | null> {
  if (!API_KEY) return null;
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "x-api-key": API_KEY,
        "anthropic-version": API_VERSION,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: opts.maxTokens ?? 2000,
        temperature: opts.temperature ?? 0.3,
        system: opts.system,
        messages: [{ role: "user", content: opts.user }],
      }),
      cache: "no-store",
    });
    if (!res.ok) {
      // Surface nothing sensitive; log server-side for debugging.
      console.error(`[ai] Anthropic API ${res.status}: ${(await res.text()).slice(0, 300)}`);
      return null;
    }
    const json = (await res.json()) as { content?: Array<{ type: string; text?: string }> };
    const text = (json.content ?? [])
      .filter((b) => b.type === "text" && typeof b.text === "string")
      .map((b) => b.text as string)
      .join("\n")
      .trim();
    return text || null;
  } catch (err) {
    console.error("[ai] request failed:", err);
    return null;
  }
}

/**
 * Like generateText but extracts the first JSON object from the reply and parses
 * it. Returns null on any failure (disabled, network, non-JSON, parse error).
 * Models occasionally wrap JSON in prose or ```json fences — we strip both.
 */
export async function generateJson<T>(opts: GenerateOpts): Promise<T | null> {
  const text = await generateText(opts);
  if (!text) return null;
  const cleaned = text.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(cleaned.slice(start, end + 1)) as T;
  } catch {
    return null;
  }
}
