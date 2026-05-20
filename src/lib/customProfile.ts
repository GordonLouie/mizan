import { SCHOLAR_PROFILES } from "./scholars";
import type { ScholarProfile } from "./types";

const STORAGE_KEY = "mizan.customProfile";

export function loadCustomProfile(): ScholarProfile {
  const base = SCHOLAR_PROFILES.find((p) => p.id === "custom")!;
  if (typeof window === "undefined") return base;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const saved = JSON.parse(raw);
    return { ...base, ...saved };
  } catch {
    return base;
  }
}
