"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const screen_1 = require("../screen");
const purification_1 = require("../purification");
const scholars_1 = require("../scholars");
const stocks_json_1 = __importDefault(require("../../data/stocks.json"));
const data = stocks_json_1.default;
const stock = (ticker) => {
    const s = data.find((x) => x.ticker === ticker);
    if (!s)
        throw new Error(`Missing test ticker: ${ticker}`);
    return s;
};
let failures = 0;
const check = (name, cond, detail = "") => {
    if (cond) {
        console.log(`  PASS  ${name}`);
    }
    else {
        failures++;
        console.log(`  FAIL  ${name}  ${detail}`);
    }
};
console.log("\n--- Sector exclusions (every scholar should reject sin stocks) ---");
for (const ticker of ["JPM", "MO", "WYNN", "BUD", "LMT"]) {
    for (const scholarId of ["aaoifi", "taqi_usmani", "djim", "jafari", "strict"]) {
        const r = (0, screen_1.screenStock)(stock(ticker), (0, scholars_1.getScholar)(scholarId));
        check(`${ticker} fails under ${scholarId}`, r.verdict === "fail" && !r.sectorPasses, `got ${r.verdict}`);
    }
}
console.log("\n--- The headline demo: AMZN passes AAOIFI but FAILS Mufti Taqi ---");
const amznAaoifi = (0, screen_1.screenStock)(stock("AMZN"), (0, scholars_1.getScholar)("aaoifi"));
const amznTaqi = (0, screen_1.screenStock)(stock("AMZN"), (0, scholars_1.getScholar)("taqi_usmani"));
check("AMZN passes AAOIFI", amznAaoifi.verdict === "pass", `got ${amznAaoifi.verdict}`);
check("AMZN fails Mufti Taqi on the illiquid-asset floor", amznTaqi.verdict !== "pass" &&
    amznTaqi.ratioChecks.some((c) => c.label.startsWith("Illiquid") && !c.passes), `verdict was ${amznTaqi.verdict}`);
console.log("\n--- META & NFLX (intangibles-heavy) should also fail Mufti Taqi ---");
for (const ticker of ["META", "NFLX", "NVDA"]) {
    const taqi = (0, screen_1.screenStock)(stock(ticker), (0, scholars_1.getScholar)("taqi_usmani"));
    check(`${ticker} fails Mufti Taqi on illiquid floor`, taqi.ratioChecks.some((c) => c.label.startsWith("Illiquid") && !c.passes));
}
console.log("\n--- Industrial / consumer staples should pass Mufti Taqi ---");
for (const ticker of ["WMT", "COST", "TSLA", "XOM", "TSM"]) {
    const taqi = (0, screen_1.screenStock)(stock(ticker), (0, scholars_1.getScholar)("taqi_usmani"));
    check(`${ticker} passes Mufti Taqi`, taqi.verdict === "pass", `got ${taqi.verdict}`);
}
console.log("\n--- Strict / zero-tolerance should reject almost everything ---");
let strictPasses = 0;
for (const s of data) {
    const r = (0, screen_1.screenStock)(s, (0, scholars_1.getScholar)("strict"));
    if (r.verdict === "pass")
        strictPasses++;
}
check("Strict standard passes very few stocks", strictPasses <= 1, `actually passed ${strictPasses}`);
console.log("\n--- Purification scope check ---");
const aapl = stock("AAPL");
const aaoifi = (0, scholars_1.getScholar)("aaoifi");
const taqi = (0, scholars_1.getScholar)("taqi_usmani");
const aaoifiPur = (0, purification_1.calculatePurification)({
    stock: aapl, scholar: aaoifi, positionValueUsd: 100000, realizedGainUsd: 20000,
});
const taqiPur = (0, purification_1.calculatePurification)({
    stock: aapl, scholar: taqi, positionValueUsd: 100000, realizedGainUsd: 20000,
});
check("AAOIFI purifies only dividends (no gain purification)", aaoifiPur.impureGainUsd === 0);
check("Mufti Taqi purifies both dividends AND gains", taqiPur.impureGainUsd > 0);
check("Mufti Taqi purification > AAOIFI purification on same position w/ gain", taqiPur.totalPurificationUsd > aaoifiPur.totalPurificationUsd);
console.log("\n--- Summary ---");
if (failures === 0) {
    console.log(`\n  All checks PASSED.\n`);
    process.exit(0);
}
else {
    console.log(`\n  ${failures} check(s) FAILED.\n`);
    process.exit(1);
}
