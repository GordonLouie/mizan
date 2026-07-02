"use client";

/**
 * /crypto/is-crypto-halal — the educational "Is crypto halal?" resource.
 *
 * NOT a verdict engine. This page teaches the user HOW to think about any
 * token: the real evaluation factors in plain English, a reusable yes/no
 * framework they can apply to ANY asset, and ~8 worked examples showing where
 * scholars genuinely disagree. It never issues a confident "halal" — the
 * strongest label it uses is "debated". Education, not a fatwa.
 *
 * Built as a NEW, self-contained file. It does not import from or modify the
 * existing /crypto reference surface. Static routes win over the sibling
 * [slug] dynamic segment, so there is no routing conflict.
 */

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ScanSearch,
  ShieldAlert,
  Wallet,
  Landmark,
  Coins,
  Percent,
  Network,
  HelpCircle,
  Check,
  X,
  Minus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ------------------------------------------------------------------ *
 * Labels — deliberately no confident "halal". The ceiling is "debated".
 * ------------------------------------------------------------------ */

type Verdict = "debated" | "conditional" | "unlikely";

const VERDICT_META: Record<
  Verdict,
  { label: string; badge: string; dot: string; note: string }
> = {
  debated: {
    label: "Genuinely debated",
    badge: "bg-violet-50 text-violet-700 border-violet-200",
    dot: "bg-violet-500",
    note: "Respected contemporary scholars land on different answers. The honest reply is that there is no consensus.",
  },
  conditional: {
    label: "Conditional",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    note: "It can be acceptable — but only if specific conditions hold. Break a condition and the answer flips.",
  },
  unlikely: {
    label: "Likely not permissible",
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
    note: "The dominant scholarly concern points away from permissibility. A minority may differ; most do not.",
  },
};

/* ------------------------------------------------------------------ *
 * The evaluation FACTORS — the "why" behind every question.
 * ------------------------------------------------------------------ */

interface Factor {
  icon: LucideIcon;
  title: string;
  body: string;
  term: string; // plain-English gloss of the Arabic concept
}

const FACTORS: Factor[] = [
  {
    icon: Wallet,
    title: "Real utility vs. pure speculation",
    body: "Does the token actually do something — settle payments, run software, secure a network — or is its only purpose to be flipped for a higher price? The more a token is bought purely on the bet that someone will pay more later, the closer it drifts to gambling.",
    term: "maysir = gambling · gharar = excessive uncertainty",
  },
  {
    icon: Landmark,
    title: "Is it backed and redeemable?",
    body: "Some tokens are claims on a real asset — a dollar in a bank, an ounce of gold in a vault. The key questions: is it fully backed 1:1, and can you actually redeem it for the underlying? A claim you can't redeem is just a promise.",
    term: "a real, redeemable claim vs. a paper IOU",
  },
  {
    icon: Percent,
    title: "Does it involve lending at interest?",
    body: "Many DeFi (\"decentralised finance\") protocols are lending markets: you deposit tokens, borrowers pay a rate, you earn a rate. That fixed, guaranteed return on a loan is the textbook definition of the thing Islam prohibits.",
    term: "riba = interest",
  },
  {
    icon: Coins,
    title: "Do the rewards resemble interest?",
    body: "\"Staking\" locks up tokens to help run a network and pays a reward. Scholars split: some see a genuine service being paid for (like a fee), others see a guaranteed percentage yield that walks and quacks like interest. The structure matters.",
    term: "service fee vs. riba (interest)",
  },
  {
    icon: Network,
    title: "Network & protocol legitimacy",
    body: "Is there a real, transparent network with genuine users — or a thin project built mainly to enrich insiders? Anonymous teams, hidden token allocations and hype-driven launches raise the uncertainty (gharar) that scholars weigh heavily.",
    term: "gharar = excessive uncertainty",
  },
];

/* ------------------------------------------------------------------ *
 * The reusable FRAMEWORK — yes/no questions mapped to a concern.
 * Each worked example answers each question so the framework can be
 * "applied" live when a user taps a token.
 * ------------------------------------------------------------------ */

type Answer = "yes" | "no" | "depends";

interface Question {
  key: string;
  ask: string; // phrased so "yes" is the reassuring answer
  concern: string; // what a "no" would raise
}

const QUESTIONS: Question[] = [
  {
    key: "utility",
    ask: "Does it have genuine utility beyond price speculation?",
    concern: "Pure speculation edges toward gambling (maysir).",
  },
  {
    key: "backed",
    ask: "If it claims backing, is it fully backed and redeemable?",
    concern: "An unbacked or non-redeemable claim adds uncertainty (gharar). (N/A if it makes no backing claim.)",
  },
  {
    key: "noInterest",
    ask: "Is it free of lending-at-interest in its core design?",
    concern: "Built-in interest is riba.",
  },
  {
    key: "rewards",
    ask: "Are any rewards free of an interest-like guaranteed yield?",
    concern: "A guaranteed percentage yield can resemble riba.",
  },
  {
    key: "legit",
    ask: "Is the network transparent and legitimately used?",
    concern: "Opaque or hype-only projects carry high gharar.",
  },
];

/* ------------------------------------------------------------------ *
 * Worked EXAMPLES — 8 assets. answers map 1:1 to QUESTIONS above.
 * ------------------------------------------------------------------ */

interface Example {
  sym: string;
  name: string;
  kind: string;
  verdict: Verdict;
  what: string;
  answers: Record<string, { a: Answer; note: string }>;
  disagreement: string; // where scholars split
}

const EXAMPLES: Example[] = [
  {
    sym: "BTC",
    name: "Bitcoin",
    kind: "Store of value",
    verdict: "debated",
    what: "The original cryptocurrency — a fixed-supply digital asset used to transfer and store value without a bank.",
    answers: {
      utility: { a: "yes", note: "Real use as a censorship-resistant way to move and hold value." },
      backed: { a: "depends", note: "Makes no backing claim — value rests on adoption, like a currency. Some scholars see that as fine, others as too uncertain." },
      noInterest: { a: "yes", note: "Holding or sending BTC involves no lending or interest." },
      rewards: { a: "yes", note: "Plain ownership pays no yield; mining is a service, not interest." },
      legit: { a: "yes", note: "Large, transparent, open network with genuine global use." },
    },
    disagreement: "Some contemporary scholars (e.g. Mufti Faraz Adam and others) accept Bitcoin as a real digital asset (mal). Others reject it, arguing it lacks intrinsic value or state backing and is too volatile (gharar). Genuinely split.",
  },
  {
    sym: "ETH",
    name: "Ethereum",
    kind: "Smart-contract platform",
    verdict: "debated",
    what: "A programmable blockchain. ETH is the token used to pay for computation and secure the network.",
    answers: {
      utility: { a: "yes", note: "ETH pays for real on-chain computation (\"gas\") — clear utility." },
      backed: { a: "depends", note: "No backing claim; value tracks demand for the network." },
      noInterest: { a: "yes", note: "The base token itself isn't a loan." },
      rewards: { a: "depends", note: "Staking ETH pays a reward. Scholars disagree whether that's a permissible service fee or an interest-like yield." },
      legit: { a: "yes", note: "Large, transparent, heavily-used network." },
    },
    disagreement: "The Bitcoin debate applies here too, plus a second one specific to staking: is the staking reward a fee for a genuine service, or a guaranteed yield resembling riba? Both questions are live.",
  },
  {
    sym: "SOL",
    name: "Solana",
    kind: "Smart-contract platform",
    verdict: "debated",
    what: "A high-speed blockchain competing with Ethereum. SOL pays fees and secures the network via staking.",
    answers: {
      utility: { a: "yes", note: "Pays for real transactions on an active network." },
      backed: { a: "depends", note: "No backing claim; value tracks network demand." },
      noInterest: { a: "yes", note: "The token itself is not a loan." },
      rewards: { a: "depends", note: "Staking rewards raise the same interest-resemblance question as Ethereum." },
      legit: { a: "depends", note: "Real usage, but a more concentrated token supply and past outages raise more uncertainty than BTC/ETH for some scholars." },
    },
    disagreement: "Same core crypto debate as Bitcoin and Ethereum. The staking model and heavier insider/early-holder concentration make some scholars more cautious than they are on ETH.",
  },
  {
    sym: "USDC",
    name: "USD Coin",
    kind: "Fiat stablecoin",
    verdict: "conditional",
    what: "A token designed to always equal one US dollar, backed by dollars and short-term reserves held by the issuer.",
    answers: {
      utility: { a: "yes", note: "A genuine digital dollar for payments and settlement." },
      backed: { a: "yes", note: "Claims full 1:1 backing and redeemability — the central condition." },
      noInterest: { a: "depends", note: "The coin itself isn't a loan, but the issuer's reserves often sit in interest-bearing instruments, which concerns some scholars." },
      rewards: { a: "yes", note: "Simply holding it pays you nothing — no yield unless you lend it out yourself." },
      legit: { a: "yes", note: "Regulated, audited issuer with public reserve reporting." },
    },
    disagreement: "Acceptable to many scholars only IF it is genuinely fully backed and redeemable. The sticking point is that reserves earn interest for the issuer — some treat that as the issuer's problem, others as a taint on the coin. Holding is one thing; earning yield on it is a separate, harder question.",
  },
  {
    sym: "PAXG",
    name: "PAX Gold",
    kind: "Tokenised gold",
    verdict: "conditional",
    what: "A token where each unit represents ownership of one fine troy ounce of physical gold held in a vault.",
    answers: {
      utility: { a: "yes", note: "A digital claim on real, allocated gold." },
      backed: { a: "yes", note: "Each token maps to allocated physical gold that can be redeemed — the key condition." },
      noInterest: { a: "yes", note: "No lending or interest in simply holding it." },
      rewards: { a: "yes", note: "Holding pays no yield; it's meant to track the gold price." },
      legit: { a: "depends", note: "Hinges on the vault, audits and that redemption is truly honoured — trust in the issuer is doing a lot of work." },
    },
    disagreement: "Closest to a traditional permissible asset — but gold carries its own rule: exchanges of gold must be settled hand-to-hand without delay (to avoid riba al-fadl). Scholars debate whether an instant token transfer satisfies that. Conditional on real, allocated, redeemable backing.",
  },
  {
    sym: "AAVE",
    name: "Aave",
    kind: "DeFi lending token",
    verdict: "unlikely",
    what: "The governance token of a protocol whose core business is lending: depositors earn a rate, borrowers pay a rate.",
    answers: {
      utility: { a: "depends", note: "The token governs a real protocol — but that protocol's core function is interest-based lending." },
      backed: { a: "no", note: "Not backed by or redeemable for any underlying asset." },
      noInterest: { a: "no", note: "The whole product is an interest (riba) market — deposit for a yield, borrow for a rate." },
      rewards: { a: "no", note: "Returns from the protocol are precisely the guaranteed lending yield scholars flag as riba." },
      legit: { a: "yes", note: "A transparent, widely-used protocol — legitimacy isn't the issue; its purpose is." },
    },
    disagreement: "Little disagreement on the mechanism: algorithmic lending at a set rate is interest (riba). The narrow debate is whether merely holding a governance token — without using the lending pools — is separable from the protocol's purpose. Most scholars are uncomfortable regardless.",
  },
  {
    sym: "NFT",
    name: "NFT (generic)",
    kind: "Non-fungible token",
    verdict: "conditional",
    what: "A token proving unique ownership of a specific digital item — art, a collectible, an in-game asset, a deed.",
    answers: {
      utility: { a: "depends", note: "Entirely dependent on what it represents — real art or utility vs. an empty status token." },
      backed: { a: "depends", note: "Some NFTs grant real rights (an image, access, an asset); many grant almost nothing." },
      noInterest: { a: "yes", note: "The token itself involves no interest." },
      rewards: { a: "yes", note: "A plain NFT pays no yield." },
      legit: { a: "depends", note: "Ranges from serious projects to pure hype-flipping (heavy maysir/gharar)." },
    },
    disagreement: "There is no single ruling on \"NFTs\" — it depends entirely on the underlying item and intent. A deed to a real, permissible asset is very different from a hype JPEG bought only to flip. The content must itself be permissible (no impermissible imagery, gambling, etc.).",
  },
  {
    sym: "DOGE",
    name: "Meme coin (e.g. Dogecoin)",
    kind: "Meme / hype token",
    verdict: "unlikely",
    what: "A token with no real function, whose price moves almost entirely on hype, jokes and social-media momentum.",
    answers: {
      utility: { a: "no", note: "Little to no genuine use — value is essentially a bet on other people's hype." },
      backed: { a: "no", note: "Nothing behind it." },
      noInterest: { a: "yes", note: "No lending involved — but that's not the problem here." },
      rewards: { a: "yes", note: "Usually no yield — again not the concern." },
      legit: { a: "no", note: "Frequently insider-heavy launches with high manipulation risk (extreme gharar)." },
    },
    disagreement: "Comparatively little scholarly sympathy. Buying purely on hype with no underlying value is close to gambling (maysir) and carries excessive uncertainty (gharar). A rare voice might call it a permissible risky asset, but most see it as doubtful at best.",
  },
];

const ANSWER_META: Record<Answer, { icon: LucideIcon; cls: string; label: string }> = {
  yes: { icon: Check, cls: "text-emerald-600", label: "Yes" },
  no: { icon: X, cls: "text-rose-600", label: "No" },
  depends: { icon: Minus, cls: "text-amber-600", label: "Depends" },
};

/* ================================================================== */

export default function IsCryptoHalalPage() {
  const [selectedSym, setSelectedSym] = useState<string>("BTC");
  const selected = EXAMPLES.find((e) => e.sym === selectedSym) ?? EXAMPLES[0];

  function renderApplied() {
    const meta = VERDICT_META[selected.verdict];
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
              {selected.kind}
            </div>
            <h3
              className="mt-1 text-[20px] font-bold leading-tight text-gray-900"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {selected.name}
            </h3>
          </div>
          <span className={"shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold " + meta.badge}>
            {meta.label}
          </span>
        </div>

        <p className="mt-3 text-[13px] leading-relaxed text-gray-600">{selected.what}</p>

        {/* The framework, applied */}
        <div className="mt-4 space-y-2.5 border-t border-gray-100 pt-4">
          {QUESTIONS.map((q) => {
            const ans = selected.answers[q.key];
            const am = ANSWER_META[ans.a];
            const Icon = am.icon;
            return (
              <div key={q.key} className="flex gap-2.5">
                <span
                  className={"mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-50 " + am.cls}
                  aria-label={am.label}
                >
                  <Icon size={13} strokeWidth={3} />
                </span>
                <div>
                  <div className="text-[12.5px] font-medium leading-snug text-gray-800">{q.ask}</div>
                  <div className="mt-0.5 text-[12px] leading-relaxed text-gray-500">{ans.note}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Where scholars disagree */}
        <div className="mt-4 rounded-lg bg-gray-50 p-3.5">
          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
            Where scholars disagree
          </div>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-gray-700">{selected.disagreement}</p>
        </div>

        <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-gray-500">
          <span className={"mt-1 inline-block h-2 w-2 shrink-0 rounded-full " + meta.dot} />
          {meta.note}
        </p>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* HEADER */}
      <header className="pt-6">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Learn · Crypto · Education, not a ruling
        </div>
        <h1
          className="mt-3 text-[36px] font-bold leading-[1.05] text-gray-900 sm:text-[46px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Is crypto halal?
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-gray-600">
          The honest answer: it depends on the token, and even then scholars
          genuinely disagree. So instead of handing you a verdict, this page
          teaches you the questions to ask — a framework you can apply to{" "}
          <em>any</em> coin — and shows it worked through eight real examples.
        </p>
      </header>

      {/* TOP DISCLAIMER — prominent */}
      <div className="mt-6 flex items-start gap-3 rounded-xl border border-gold-200 bg-gold-50/60 px-4 py-3.5">
        <ShieldAlert size={18} className="mt-0.5 shrink-0 text-gold-700" />
        <p className="text-[12.5px] leading-relaxed text-gray-700">
          <span className="font-semibold text-gray-900">This is education, not a fatwa.</span>{" "}
          HalalGauge has no credentialed scholar on staff and issues no rulings.
          Crypto is one of the most contested areas in contemporary Islamic
          finance, and the picture changes as products change. Nothing here is a
          verdict on your situation — take any real decision to a qualified
          scholar.
        </p>
      </div>

      {/* SECTION 1 — the factors */}
      <section className="mt-12">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          The five things that actually matter
        </div>
        <h2
          className="mt-2 text-[24px] font-bold leading-tight text-gray-900 sm:text-[28px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          What scholars are really weighing
        </h2>
        <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-gray-600">
          Strip away the jargon and almost every crypto question reduces to a
          handful of concerns. Here they are in plain English.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {FACTORS.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-50 text-navy-800">
                    <Icon size={18} />
                  </span>
                  <h3 className="text-[15px] font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
                    {f.title}
                  </h3>
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-gray-600">{f.body}</p>
                <p className="mt-3 border-t border-gray-100 pt-2.5 text-[11px] font-medium text-gray-500">
                  {f.term}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2 — the reusable framework */}
      <section className="mt-14">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          The checklist
        </div>
        <h2
          className="mt-2 text-[24px] font-bold leading-tight text-gray-900 sm:text-[28px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Five questions for any token
        </h2>
        <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-gray-600">
          A reusable framework. Run any coin through these — every{" "}
          <span className="font-semibold text-rose-600">no</span> points to a
          specific concern. This doesn&apos;t produce a ruling; it shows you
          where the problems are.
        </p>

        <div className="mt-6 overflow-hidden rounded-xl border border-gray-200">
          {QUESTIONS.map((q, i) => (
            <div
              key={q.key}
              className={
                "flex items-start gap-3 px-4 py-4 sm:px-5 " +
                (i % 2 === 1 ? "bg-gray-50/60 " : "bg-white ") +
                (i > 0 ? "border-t border-gray-100" : "")
              }
            >
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy-800 text-[11px] font-bold text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {i + 1}
              </span>
              <div>
                <div className="text-[13.5px] font-semibold leading-snug text-gray-900">{q.ask}</div>
                <div className="mt-1 text-[12px] leading-relaxed text-gray-500">
                  <span className="font-medium text-gray-600">A &ldquo;no&rdquo; raises:</span> {q.concern}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3 — worked examples (interactive) */}
      <section className="mt-14">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          The framework, applied
        </div>
        <h2
          className="mt-2 text-[24px] font-bold leading-tight text-gray-900 sm:text-[28px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Eight worked examples
        </h2>
        <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-gray-600">
          Tap any token to see the five questions applied to it — and, crucially,
          exactly where scholars split. Notice that the strongest label anywhere
          on this page is &ldquo;debated&rdquo;, never a confident yes.
        </p>

        {/* Legend */}
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
          {(Object.keys(VERDICT_META) as Verdict[]).map((v) => (
            <span key={v} className="inline-flex items-center gap-1.5 text-[12px] text-gray-700">
              <span className={"inline-block h-2.5 w-2.5 rounded-full " + VERDICT_META[v].dot} />
              <span className="font-medium">{VERDICT_META[v].label}</span>
            </span>
          ))}
        </div>

        {/* Mobile detail (updates on tap) */}
        <div className="mt-6 lg:hidden">{renderApplied()}</div>

        <div className="mt-6 lg:grid lg:grid-cols-[1fr_360px] lg:gap-8">
          {/* Token tiles */}
          <div className="grid grid-cols-2 gap-3 self-start sm:grid-cols-4">
            {EXAMPLES.map((e) => {
              const meta = VERDICT_META[e.verdict];
              const active = e.sym === selectedSym;
              return (
                <button
                  key={e.sym}
                  type="button"
                  onClick={() => setSelectedSym(e.sym)}
                  aria-pressed={active}
                  className={
                    "flex flex-col justify-between rounded-xl border bg-white p-3 text-left transition hover:border-gray-400 " +
                    (active ? "border-navy-800 ring-2 ring-navy-800 ring-offset-1" : "border-gray-200")
                  }
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[15px] font-bold text-gray-900"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {e.sym}
                    </span>
                    <span className={"inline-block h-2.5 w-2.5 rounded-full " + meta.dot} />
                  </div>
                  <span className="mt-2 text-[11px] font-medium leading-tight text-gray-500">
                    {e.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Desktop sticky detail */}
          <aside className="hidden lg:block">
            <div className="sticky top-6">{renderApplied()}</div>
          </aside>
        </div>
      </section>

      {/* WHY NO VERDICT */}
      <section className="mt-14 rounded-2xl border border-navy-200 bg-navy-50/50 p-6 sm:p-7">
        <div className="flex items-center gap-2.5">
          <HelpCircle size={18} className="text-navy-800" />
          <h2
            className="text-[20px] font-bold leading-tight text-gray-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Why we won&apos;t just tell you &ldquo;halal&rdquo; or &ldquo;haram&rdquo;
          </h2>
        </div>
        <p className="mt-3 max-w-3xl text-[13.5px] leading-relaxed text-gray-700">
          Because it wouldn&apos;t be honest. On Bitcoin, Ethereum and Solana,
          qualified contemporary scholars genuinely disagree — some accept them
          as real digital assets, others reject them over uncertainty. On
          stablecoins and tokenised gold, the answer hinges on conditions that
          can quietly break. On DeFi lending and meme coins, the concerns are
          heavier but still not the same conversation. A single confident badge
          would flatten all of that into a lie. The useful skill isn&apos;t
          memorising verdicts — it&apos;s knowing which questions to ask and then
          taking them to someone qualified.
        </p>
      </section>

      {/* BOTTOM DISCLAIMER + CTA */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-5">
        <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
          Before you act
        </div>
        <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-gray-700">
          This page is a learning tool, not a religious ruling, and HalalGauge is
          not a religious authority. Contemporary crypto rulings evolve quickly.
          For a decision that binds your own money and conscience, consult a{" "}
          <strong>qualified scholar</strong> — ideally one who can look at the
          specific token and how you intend to use it.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/crypto"
            className="inline-flex items-center gap-1.5 rounded-md bg-navy-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-700"
          >
            See what each scholar has said <ArrowRight size={14} />
          </Link>
          <Link
            href="/assets"
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:text-gray-900"
          >
            The full halal asset map <ArrowRight size={14} />
          </Link>
          <Link
            href="/screen"
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:text-gray-900"
          >
            <ScanSearch size={15} /> Screen a stock
          </Link>
        </div>
      </div>
    </div>
  );
}
