/**
 * Tiny key-value helper over the Vercel KV / Upstash Redis REST API.
 *
 * Uses plain fetch (NO npm dependency) so it never affects the build. It is
 * inert until you create a KV store in the Vercel dashboard, which injects
 * KV_REST_API_URL + KV_REST_API_TOKEN. Until then kvConfigured() is false and
 * callers no-op gracefully.
 */
const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

export function kvConfigured(): boolean {
  return !!(KV_URL && KV_TOKEN);
}

async function cmd(args: string[]): Promise<unknown> {
  if (!kvConfigured()) return null;
  try {
    const res = await fetch(KV_URL!, {
      method: "POST",
      headers: { Authorization: `Bearer ${KV_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(args),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { result?: unknown };
    return json.result ?? null;
  } catch {
    return null;
  }
}

export async function kvGetJson<T>(key: string): Promise<T | null> {
  const raw = await cmd(["GET", key]);
  if (typeof raw !== "string") return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function kvSetJson(key: string, value: unknown): Promise<void> {
  await cmd(["SET", key, JSON.stringify(value)]);
}
