#!/usr/bin/env node
/**
 * fetch_logos.mjs — download a high-resolution logo for every ticker in
 * stocks.json into public/logos/<TICKER>.png, so the app serves logos from
 * its own CDN instead of hitting flaky third-party APIs at runtime.
 *
 * WHY: every logo was being fetched live from Clearbit, whose free API has
 * become unreliable — hence the "still loading" monogram placeholders. Once
 * these files exist, <CompanyLogo> loads them instantly (local-first stage)
 * and the network sources become fallback-only.
 *
 * RUN (needs Node 18+ and open network — run it on your machine, not the
 * sandbox):
 *     node scripts/fetch_logos.mjs            # fills in only missing logos
 *     node scripts/fetch_logos.mjs --force    # re-download everything (refresh)
 *
 * Then commit the new files in public/logos/ and push. Re-run any time to
 * refresh or pick up new tickers.
 *
 * Source priority per ticker (best quality first):
 *   1. Clearbit  https://logo.clearbit.com/<domain>?size=512   (needs domain)
 *   2. FMP       https://financialmodelingprep.com/image-stock/<TICKER>.png
 *   3. Google    https://www.google.com/s2/favicons?domain=<domain>&sz=256
 * A candidate is accepted only if the response is a real image (image/* type
 * and a sane byte size), so we never save an HTML error page as a ".png".
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "public", "logos");
const FORCE = process.argv.includes("--force");
const CONCURRENCY = 6;
const MIN_BYTES = 256; // smaller than this is almost certainly an error blob

function loadTickers() {
  const data = JSON.parse(readFileSync(join(ROOT, "src/data/stocks.json"), "utf-8"));
  return data.map((s) => s.ticker);
}

function loadDomains() {
  const txt = readFileSync(join(ROOT, "src/lib/companyDomains.ts"), "utf-8");
  const map = {};
  // matches  AAPL: "apple.com"   and   "BRK.B": "berkshirehathaway.com"
  const re = /(?:"([\w.\-]+)"|([A-Za-z0-9_.\-]+))\s*:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(txt)) !== null) {
    const key = m[1] || m[2];
    const val = m[3];
    if (key && val && val.includes(".")) map[key] = val;
  }
  return map;
}

const isFmpFriendly = (t) => /^[A-Z]{1,5}(\.[A-Z])?$/.test(t);

function candidatesFor(ticker, domains) {
  const d = domains[ticker];
  const out = [];
  if (d) out.push(`https://logo.clearbit.com/${d}?size=512`);
  if (isFmpFriendly(ticker)) out.push(`https://financialmodelingprep.com/image-stock/${ticker}.png`);
  if (d) out.push(`https://www.google.com/s2/favicons?domain=${d}&sz=256`);
  return out;
}

async function tryDownload(ticker, domains) {
  const outPath = join(OUT_DIR, `${ticker}.png`);
  if (!FORCE && existsSync(outPath)) return "skip";
  for (const url of candidatesFor(ticker, domains)) {
    try {
      const res = await fetch(url, { redirect: "follow" });
      if (!res.ok) continue;
      const ctype = res.headers.get("content-type") || "";
      if (!ctype.startsWith("image/")) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < MIN_BYTES) continue;
      writeFileSync(outPath, buf);
      return "ok";
    } catch {
      /* try next candidate */
    }
  }
  return "fail";
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const tickers = loadTickers();
  const domains = loadDomains();
  console.log(`${tickers.length} tickers, ${Object.keys(domains).length} domain mappings. force=${FORCE}`);

  let ok = 0, skip = 0, fail = 0;
  const failed = [];
  for (let i = 0; i < tickers.length; i += CONCURRENCY) {
    const batch = tickers.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map((t) => tryDownload(t, domains)));
    results.forEach((r, j) => {
      if (r === "ok") ok++;
      else if (r === "skip") skip++;
      else { fail++; failed.push(batch[j]); }
    });
    process.stdout.write(`\r  ${i + batch.length}/${tickers.length}  ok=${ok} skip=${skip} fail=${fail}`);
  }
  console.log(`\nDone. Saved ${ok}, skipped ${skip}, failed ${fail}.`);
  if (failed.length) console.log("No logo found for:", failed.join(", "));
  console.log("\nNext: git add public/logos && git commit -m 'Self-host company logos' && git push");
}

main();
