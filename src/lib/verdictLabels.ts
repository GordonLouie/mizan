import type { Verdict } from "./types";

// Display labels — what users see. Engine constants stay as pass/borderline/fail.
export const VERDICT_LABEL: Record<Verdict, string> = {
  pass: "Halal",
  borderline: "Doubtful",
  fail: "Not halal",
};

// Single-word "decision" form for tighter UI
export const VERDICT_SHORT: Record<Verdict, string> = {
  pass: "Halal",
  borderline: "Doubtful",
  fail: "Not halal",
};
