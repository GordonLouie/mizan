// Sanity tests for curated lists — every referenced ticker must exist,
// and editorial claims (e.g. "halal mega-caps") must hold against the
// declared default scholar for at least 70% of the list.
//
// Lightweight harness — same style as screen.test.ts.

import {
  CURATED_LISTS,
  unresolvedTickers,
  statsForList,
  resolveList,
} from "../lists";

let failures = 0;
const check = (name: string, cond: boolean, detail = "") => {
  if (cond) {
    console.log(`  PASS  ${name}`);
  } else {
    failures++;
    console.log(`  FAIL  ${name}  ${detail}`);
  }
};

console.log("\n--- Curated list integrity ---");
for (const list of CURATED_LISTS) {
  const missing = unresolvedTickers(list);
  check(
    `[${list.slug}] every ticker resolves`,
    missing.length === 0,
    missing.length ? `missing: ${missing.join(", ")}` : "",
  );

  const resolved = resolveList(list);
  check(
    `[${list.slug}] at least one ticker resolves`,
    resolved.length > 0,
    `resolved=${resolved.length}`,
  );

  // Pass-rate sanity: "halal-*" lists should mostly pass under their default scholar.
  if (list.slug.startsWith("halal-") || list.slug.startsWith("strict-hanafi")) {
    const stats = statsForList(list, list.defaultScholarId);
    const passPct = stats.total ? stats.pass / stats.total : 0;
    check(
      `[${list.slug}] ≥70% pass under ${list.defaultScholarId}`,
      passPct >= 0.7,
      `passPct=${(passPct * 100).toFixed(0)}% (${stats.pass}/${stats.total})`,
    );
  }
}

console.log("\n--- Slug uniqueness ---");
const slugs = CURATED_LISTS.map((l) => l.slug);
check("slugs are unique", new Set(slugs).size === slugs.length);

console.log("\n--- Summary ---");
if (failures === 0) {
  console.log("ALL CURATED LIST TESTS PASS");
  process.exit(0);
} else {
  console.log(`FAILED: ${failures}`);
  process.exit(1);
}
