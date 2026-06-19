"use client";

/**
 * Homepage — v5 layout (slimmed).
 *
 * Order:
 *   1. Status line whisper
 *   2. Hero: "Is your stock halal?" → punchline → stats trio → search → CTA
 *   3. Or-try chips (logos only) + onboarding link
 *   4. Bigger CompanyLogoMarquee (proof of coverage)
 *   5. Soft gradient transition into the iPad
 *   6. ScrollDashboardHero — iPad showing real /screen content
 *   7. MethodologyBubble — primary-source rigor signal
 *   8. GetStartedSteps — 3-step conversion
 *   9. Curated lists
 *  10. What HalalGauge is / isn't
 *
 * Removed in v5:
 *   - WhyChooseUs ("Built for the way Muslims actually invest.")
 *   - "Why HalalGauge" Amazon wedge ("Most apps check one rulebook…")
 *   - EarningsCalendar block (lives on /calendar now)
 */

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TickerSearch from "@/components/TickerSearch";
import { ArrowRight } from "lucide-react";
import { CURATED_LISTS } from "@/lib/lists";
import { listStocks, findStock } from "@/lib/data";
import { SCHOLAR_PROFILES } from "@/lib/scholars";
import { screenStock } from "@/lib/screen";
import type { ScreeningResult } from "@/lib/types";
import CompanyLogo from "@/components/CompanyLogo";
import CompanyLogoMarquee from "@/components/CompanyLogoMarquee";
import MethodologyBubble from "@/components/MethodologyBubble";
import GetStartedSteps from "@/components/GetStartedSteps";
import ForInstitutionsBand from "@/components/ForInstitutionsBand";

export default function Home() {
  const router = useRouter();
  const [_t, setT] = useState("");

  const tickerCount = listStocks().length;

  return (
    <div className="pb-16">
      {/* HERO — asymmetric grid: content LEFT (60%), real product preview
          RIGHT (40%). Replaces the prior centered text-only hero, which
          read as the LLM default. The right-column "verdict card" shows
          what HalalGauge actually does in one glance — Amazon under 5 scholars,
          three say halal, two say not. */}
      <section className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-10">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* LEFT — content column */}
          <div className="lg:col-span-7">
            {/* Status pill — eyebrow-equivalent, kept because it carries
                real status + links to the live trust page. */}
            <Link
              href="/trust"
              className="group inline-flex items-center gap-1.5 text-[11px] font-medium text-gray-500 transition hover:text-gray-800"
            >
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
              <span className="uppercase tracking-[0.18em]">Private beta</span>
              <span className="text-gray-300">·</span>
              <span className="text-gray-500 group-hover:text-navy-700 group-hover:underline">
                status
              </span>
            </Link>

            <h1
              className="mt-6 text-[40px] font-bold leading-[1.05] tracking-tight text-gray-900 sm:text-[64px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Is your stock halal?
            </h1>

            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-gray-600 sm:text-[16px]">
              See it under all five scholarly standards side by side, including
              Mufti Taqi Usmani&apos;s illiquid-asset rule — the one no other
              halal app implements.
            </p>

            <div className="mt-8 max-w-lg">
              <TickerSearch
                value=""
                onChange={(t) => {
                  setT(t);
                  if (t) router.push(`/screen?ticker=${encodeURIComponent(t)}`);
                }}
                placeholder="Type a ticker. AAPL, AMZN, TSLA, or 'apple'…"
                autoFocus={false}
              />
            </div>

            <div className="mt-4">
              <Link
                href="/screen?ticker=AMZN"
                className="inline-flex items-center gap-1.5 text-[13px] font-medium text-navy-700 transition hover:text-navy-900"
              >
                See where the scholars split on Amazon <ArrowRight size={13} />
              </Link>
            </div>

            {/* Privacy trust line — direct answer to "I don't trust AI-built
                sites with my data". Says the literal truth: zero collection,
                local-only watchlist. */}
            <p className="mt-7 inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-gray-400">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>No signup.</span>
              <span className="text-gray-300">·</span>
              <span>No data collected.</span>
              <span className="text-gray-300">·</span>
              <span>Your watchlist stays on your device.</span>
            </p>
          </div>

          {/* RIGHT — real product preview (the verdict card). On mobile
              this collapses below the content. Pre-shrunk on smaller
              tablet sizes; full size at lg+. */}
          <div className="lg:col-span-5">
            <HeroVerdictCard tickerCount={tickerCount} />
          </div>
        </div>
      </section>

      {/* Below-the-hero: discovery row with the try-a-ticker chips +
          onboarding link. Removed from the hero per design discipline
          (chips violate the hero's "max 4 text elements" rule).
          Lives here as a dedicated zone for users still browsing. */}
      <section className="mx-auto mt-14 max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <span className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
            Or jump in with
          </span>
          {["AAPL", "TSLA", "MSFT", "JPM", "META", "SPUS"].map((t) => (
            <Link
              key={t}
              href={`/screen?ticker=${t}`}
              aria-label={`Screen ${t}`}
              className="rounded-md border border-gray-200 bg-white p-1.5 transition hover:border-gray-400 hover:bg-gray-50"
            >
              <CompanyLogo ticker={t} size={22} />
            </Link>
          ))}
          <span className="ml-2 text-[12px] text-gray-500">
            Don&apos;t know which scholar you follow?{" "}
            <Link
              href="/learn"
              className="text-navy-700 underline hover:text-navy-900"
            >
              60-second primer
            </Link>
            . Most American Muslims start with AAOIFI.
          </span>
        </div>
      </section>

      {/* 3. MARQUEE — proof of coverage (eyebrow removed per design audit;
          the marquee's content speaks for itself, no template label needed). */}
      <section className="mt-16">
        <CompanyLogoMarquee />
      </section>

      {/* 4. METHODOLOGY BUBBLE */}
      <MethodologyBubble />

      {/* 5. GET STARTED */}
      <GetStartedSteps />

      {/* CURATED LISTS — eyebrow removed; the headline alone carries it. */}
      <section className="mx-auto mt-32 max-w-4xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2
              className="text-[26px] font-bold leading-tight text-gray-900 sm:text-[32px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Not sure where to start?
            </h2>
            <p className="mt-2 max-w-xl text-sm text-gray-600">
              Hand-picked collections. Re-screened against your scholar.
            </p>
          </div>
          <Link
            href="/lists"
            className="hidden text-sm font-medium text-navy-700 hover:text-navy-900 sm:inline-flex sm:items-center sm:gap-1"
          >
            All lists <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {CURATED_LISTS.slice(0, 3).map((list) => (
            <Link
              key={list.slug}
              href={`/lists/${list.slug}`}
              className="group block rounded-xl border border-gray-200 bg-white p-5 transition hover:border-gray-400"
            >
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                {list.kicker}
              </div>
              <div
                className="mt-2 text-[17px] font-bold text-gray-900 group-hover:text-navy-800"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {list.title}
              </div>
              <div className="mt-1 text-xs text-gray-500">
                {list.tickers.length} stocks
              </div>
              <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-gray-600">
                {list.audience}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* FOR INSTITUTIONS — the one institutional band on the retail homepage */}
      <ForInstitutionsBand />

      {/* 11. WHAT HALALGAUGE IS / ISN'T */}
      <section className="mx-auto mt-32 max-w-3xl border-t border-gray-200 px-4 pt-14 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-700">
              What HalalGauge is
            </div>
            <ul className="mt-4 space-y-2.5 text-[14px] leading-relaxed text-gray-700">
              <li>Free, transparent halal stock screening.</li>
              <li>Five scholarly methodologies + a custom builder.</li>
              <li>Zakat and purification calculators.</li>
              <li>Information you can verify. We show the math.</li>
            </ul>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-rose-700">
              What HalalGauge isn&apos;t
            </div>
            <ul className="mt-4 space-y-2.5 text-[14px] leading-relaxed text-gray-700">
              <li>An investment advisor. We don&apos;t tell you what to buy.</li>
              <li>A bank or brokerage. We don&apos;t hold your money.</li>
              <li>A religious authority. We surface scholarly opinion.</li>
              <li>A replacement for a qualified scholar for your specifics.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * HeroVerdictCard — the right-column visual for the asymmetric hero.
 *
 * Shows the *actual product moment*: Amazon under all 5 mainstream scholarly
 * methodologies, three say halal, two say not halal. This is a real product
 * preview (the pattern the Taste skill explicitly allows in place of div-
 * based fake screenshots).
 *
 * Why this works as a hero visual:
 *   - Demonstrates HalalGauge's core differentiator (multi-scholar disagreement)
 *     in a single glance — no copy needed
 *   - Uses real scholar names + real Amazon logo + real verdict logic
 *   - Quietly reinforces trust: this is what you actually get, not a mockup
 */
// Compact deciding line for the card — same source of truth as the screen engine.
function cardLine(r: ScreeningResult): string {
  if (!r.sectorPasses) return r.sectorReason || "Sector exclusion";
  const c = r.ratioChecks.find((x) => !x.passes);
  if (c && c.threshold != null) {
    const metric = c.label.split("/")[0].trim();
    return `${metric} ${c.value.toFixed(1)}% ${c.direction === "max" ? ">" : "<"} ${c.threshold}%`;
  }
  return "All ratio checks pass";
}

const VERDICT_PILL: Record<ScreeningResult["verdict"], { label: string; cls: string }> = {
  pass: { label: "Halal", cls: "bg-emerald-50 text-emerald-700" },
  fail: { label: "Not halal", cls: "bg-rose-50 text-rose-700" },
  borderline: { label: "Borderline", cls: "bg-amber-50 text-amber-700" },
};

function HeroVerdictCard({ tickerCount }: { tickerCount: number }) {
  // REAL verdicts from the engine — never hardcoded (the card must match /halal/AMZN).
  const stock = findStock("AMZN");
  const named = SCHOLAR_PROFILES.filter((p) => p.id !== "custom");
  const rows = stock
    ? named.map((sc) => {
        const r = screenStock(stock, sc);
        return { short: sc.short, verdict: r.verdict, deciding: cardLine(r) };
      })
    : [];
  const passCount = rows.filter((r) => r.verdict === "pass").length;

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_8px_32px_rgba(28,69,55,0.06)]">
        {/* Card header — ticker + sector */}
        <div className="border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <CompanyLogo ticker="AMZN" size={36} />
            <div className="min-w-0">
              <div className="font-mono text-[12px] uppercase tracking-[0.16em] text-gray-500">
                AMZN · {stock?.sector ?? "Consumer Cyclical"}
              </div>
              <div
                className="mt-0.5 truncate text-[17px] font-bold text-gray-900"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {stock?.name ?? "Amazon.com, Inc."}
              </div>
            </div>
          </div>
        </div>

        {/* Scholar verdict rows — computed */}
        <div className="divide-y divide-gray-100">
          {rows.map((row) => {
            const pill = VERDICT_PILL[row.verdict];
            return (
              <div
                key={row.short}
                className="grid grid-cols-[1fr_auto] items-center gap-3 px-5 py-3"
              >
                <div className="min-w-0">
                  <div
                    className="text-[14px] font-semibold text-gray-900"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {row.short}
                  </div>
                  <div className="mt-0.5 truncate font-mono text-[10.5px] uppercase tracking-[0.12em] text-gray-500">
                    {row.deciding}
                  </div>
                </div>
                <span className={"rounded-full px-2.5 py-1 text-[11px] font-semibold " + pill.cls}>
                  {pill.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Consensus tease — the reconciliation moat in one line */}
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5 border-t border-gray-100 bg-emerald-50/40 px-5 py-2.5">
          <span className="text-[12.5px] font-semibold text-gray-800">{passCount} of {rows.length} standards say halal</span>
          <span className="text-[11px] text-gray-500">— and we show <span className="text-navy-700">why they differ</span></span>
        </div>

        {/* Footer — quiet methodology pointer */}
        <div className="border-t border-gray-100 bg-gray-50 px-5 py-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-gray-500">
              Every threshold cited
            </span>
            <Link
              href="/halal/AMZN"
              className="text-[12px] font-medium text-navy-700 hover:text-navy-900"
            >
              See full breakdown →
            </Link>
          </div>
        </div>
      </div>

      {/* Coverage micro-strip below the card — replaces the banned in-hero
          stats trio with a single quiet line. */}
      <div className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-gray-400">
        {tickerCount}+ tickers · 5 scholars · 0 black-box scores
      </div>
    </div>
  );
}
