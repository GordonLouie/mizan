import { screenStock } from "../screen";
import { calculatePurification } from "../purification";
import { getScholar } from "../scholars";
import stocks from "../../data/stocks.json";
import type { StockFundamentals } from "../types";

const data = stocks as StockFundamentals[];
const stock = (ticker: string) => {
  const s = data.find((x) => x.ticker === ticker);
  if (!s) throw new Error(`Missing test ticker: ${ticker}`);
  return s;
};

let failures = 0;
const check = (name: string, cond: boolean, detail = "") => {
  if (cond) {
    console.log(`  PASS  ${name}`);
  } else {
    failures++;
    console.log(`  FAIL  ${name}  ${detail}`);
  }
};

console.log("\n--- Sector exclusions (every scholar should reject sin stocks) ---");
for (const ticker of ["JPM", "MO", "WYNN", "BUD", "LMT"]) {
  for (const scholarId of ["aaoifi", "taqi_usmani", "djim", "jafari", "strict"]) {
    const r = screenStock(stock(ticker), getScholar(scholarId));
    check(
      `${ticker} fails under ${scholarId}`,
      r.verdict === "fail" && !r.sectorPasses,
      `got ${r.verdict}`,
    );
  }
}

console.log("\n--- The headline demo: AMZN passes AAOIFI but FAILS Mufti Taqi ---");
const amznAaoifi = screenStock(stock("AMZN"), getScholar("aaoifi"));
const amznTaqi = screenStock(stock("AMZN"), getScholar("taqi_usmani"));
check("AMZN passes AAOIFI", amznAaoifi.verdict === "pass", `got ${amznAaoifi.verdict}`);
check(
  "AMZN fails Mufti Taqi on the illiquid-asset floor",
  amznTaqi.verdict !== "pass" &&
    amznTaqi.ratioChecks.some(
      (c) => c.label.startsWith("Illiquid") && !c.passes,
    ),
  `verdict was ${amznTaqi.verdict}`,
);

console.log("\n--- META & NFLX (intangibles-heavy) should also fail Mufti Taqi ---");
for (const ticker of ["META", "NFLX", "NVDA"]) {
  const taqi = screenStock(stock(ticker), getScholar("taqi_usmani"));
  check(
    `${ticker} fails Mufti Taqi on illiquid floor`,
    taqi.ratioChecks.some((c) => c.label.startsWith("Illiquid") && !c.passes),
  );
}

console.log("\n--- Industrial / consumer staples should pass Mufti Taqi ---");
for (const ticker of ["WMT", "COST", "TSLA", "XOM", "TSM"]) {
  const taqi = screenStock(stock(ticker), getScholar("taqi_usmani"));
  check(`${ticker} passes Mufti Taqi`, taqi.verdict === "pass", `got ${taqi.verdict}`);
}

console.log("\n--- Strict / zero-tolerance should reject almost everything ---");
let strictPasses = 0;
for (const s of data) {
  const r = screenStock(s, getScholar("strict"));
  if (r.verdict === "pass") strictPasses++;
}
check(
  "Strict standard passes very few stocks",
  strictPasses <= 1,
  `actually passed ${strictPasses}`,
);

console.log("\n--- Purification scope check ---");
const aapl = stock("AAPL");
const aaoifi = getScholar("aaoifi");
const taqi = getScholar("taqi_usmani");

const aaoifiPur = calculatePurification({
  stock: aapl, scholar: aaoifi, positionValueUsd: 100000, realizedGainUsd: 20000,
});
const taqiPur = calculatePurification({
  stock: aapl, scholar: taqi, positionValueUsd: 100000, realizedGainUsd: 20000,
});

check(
  "AAOIFI purifies only dividends (no gain purification)",
  aaoifiPur.impureGainUsd === 0,
);
check(
  "Mufti Taqi purifies both dividends AND gains",
  taqiPur.impureGainUsd > 0,
);
check(
  "Mufti Taqi purification > AAOIFI purification on same position w/ gain",
  taqiPur.totalPurificationUsd > aaoifiPur.totalPurificationUsd,
);

console.log("\n--- Summary ---");
if (failures === 0) {
  console.log(`\n  All checks PASSED.\n`);
  process.exit(0);
} else {
  console.log(`\n  ${failures} check(s) FAILED.\n`);
  process.exit(1);
}
