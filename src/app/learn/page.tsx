import Link from "next/link";
import { ArrowRight } from "lucide-react";
import GlossaryTerm from "@/components/GlossaryTerm";
import { GLOSSARY } from "@/lib/glossaryEntries";

export const metadata = {
  title: "Halal investing 101 · HalalGauge",
  description:
    "Halal stock screening, explained from scratch. How to read a HalalGauge verdict, the math behind each check, and how to track your stocks over time.",
};

function G({ term, children }: { term: string; children?: React.ReactNode }) {
  const def = GLOSSARY[term.toLowerCase()] ?? "";
  return <GlossaryTerm term={term} def={def}>{children ?? term}</GlossaryTerm>;
}

export default function LearnPage() {
  return (
    <article className="mx-auto max-w-3xl pb-20">
      {/* PAGE HEADER */}
      <header className="pt-6">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Halal investing 101
        </div>
        <h1
          className="mt-3 text-[36px] font-bold leading-[1.1] text-gray-900 sm:text-[44px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Halal stock screening, explained from scratch.
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-gray-600">
          If you&apos;ve never bought a stock and you&apos;re not sure what halal
          investing even means, you&apos;re in the right place. This page assumes
          nothing. Read it once and you&apos;ll understand how to use every part
          of HalalGauge.
        </p>
      </header>

      {/* HOW-TO STRIP */}
      <div className="mt-10 border-y border-gray-200 py-4 text-[13px] leading-relaxed text-gray-600">
        <strong className="text-gray-900">How to use this page:</strong> short
        sections, plain English. Any word with a{" "}
        <span className="border-b border-dotted border-gray-400 text-gray-800">
          dotted underline
        </span>{" "}
        has a quick definition — hover or tap it. Skim what you know, read what
        you don&apos;t.
      </div>

      {/* SECTION 1 — what is a stock */}
      <Section n={1} title="What is a stock, actually?">
        <p>
          When a company like Apple wants to grow, it sometimes sells small
          ownership slices of itself to the public. Each slice is called a{" "}
          <G term="stock" /> (or a <G term="share" />). When you buy one share,
          you own a tiny piece of that company.
        </p>
        <p>
          If the company makes money, your share is worth a bit more. If it does
          badly, your share is worth less. You can sell your share to someone
          else whenever you want — that&apos;s what the <G term="stock market" />{" "}
          is for.
        </p>
        <p>
          Some companies pay a small share of their profits to shareholders each
          year. That payment is called a <G term="dividend" />.
        </p>
      </Section>

      {/* SECTION 2 — why halal stocks aren't simple */}
      <Section n={2} title="Why &ldquo;halal&rdquo; stocks aren&apos;t simple">
        <p>
          For a Muslim investor, the question isn&apos;t just &ldquo;will this
          stock make money?&rdquo; — it&apos;s also &ldquo;is it permissible to
          own a piece of this company?&rdquo;
        </p>
        <p>
          A few things make this harder than it sounds:
        </p>
        <ul className="list-disc space-y-1.5 pl-6">
          <li>
            <strong className="text-gray-900">Sector.</strong> Some businesses
            (alcohol, gambling, conventional banking) aren&apos;t permissible to
            own at all. Most scholars agree on the core list.
          </li>
          <li>
            <strong className="text-gray-900">Debt.</strong> Many companies fund
            themselves with interest-bearing loans (<G term="riba" />). If a
            company is mostly funded by riba, owning shares becomes problematic.
          </li>
          <li>
            <strong className="text-gray-900">Income mix.</strong> Even a
            permissible business might earn some interest income on its cash. A
            small amount is tolerated by most scholars; a lot is not.
          </li>
          <li>
            <strong className="text-gray-900">Balance sheet composition.</strong>{" "}
            Some scholars require that the company hold enough <em>real</em>{" "}
            assets (factories, equipment) and not just paper holdings.
          </li>
        </ul>
        <p>
          Each scholar has different thresholds for how much is &ldquo;too
          much.&rdquo;
        </p>
      </Section>

      {/* SECTION 3 — why scholars disagree (NEW emphasis) */}
      <Section n={3} title="Why scholars actually disagree">
        <p>
          Most halal investing apps hide this fact and just pick one default
          framework for you. HalalGauge does the opposite.
        </p>
        <p>
          A Hanafi investor following Mufti Taqi Usmani applies stricter rules
          than an investor following the standard AAOIFI methodology. A Shia
          investor following Sistani has a different framework entirely. The
          strict zero-tolerance view rules out almost every public equity.
        </p>
        <p>
          One stock can be{" "}
          <span className="font-semibold text-emerald-700">halal</span> under
          AAOIFI and{" "}
          <span className="font-semibold text-rose-700">not halal</span> under
          Mufti Taqi at the same time. Both rulings are sincere; the difference
          is methodology.
        </p>
        <p>
          HalalGauge shows you all six side-by-side so you can see exactly where they
          agree and where they split.
        </p>
      </Section>

      {/* SECTION 4 — six scholar profiles */}
      <Section n={4} title="The six scholar profiles HalalGauge ships">
        <ScholarRow
          id="aaoifi"
          name="AAOIFI Standard"
          oneLine="Default Gulf framework, used by most Islamic banks."
          who="If you don&apos;t know which scholar you follow, this is the safe default — it&apos;s also what Zoya, Wahed, and Musaffa quietly use."
        />
        <ScholarRow
          id="taqi_usmani"
          name="Mufti Taqi Usmani"
          oneLine="AAOIFI rules plus a strict illiquid-asset floor and capital-gains purification."
          who="If you&apos;re Hanafi and follow Mufti Taqi&apos;s framework — HalalGauge is the only app that implements his illiquid-asset rule properly."
        />
        <ScholarRow
          id="djim"
          name="S&P DJIM"
          oneLine="The most permissive of the major indices — one-third caps instead of 30%."
          who="If you invest in halal index funds like SPUS, this is the framework they screen against."
        />
        <ScholarRow
          id="jafari"
          name="Ja'fari (Sistani-aligned)"
          oneLine="Shia methodology; khums (20%) applies to net annual surplus."
          who="If you&apos;re Shia and follow Ayatollah Sistani."
        />
        <ScholarRow
          id="strict"
          name="Strict / zero-tolerance"
          oneLine="Any riba exposure fails. Almost no public equities pass."
          who="If you hold the strict view that any interest exposure makes a stock impermissible."
        />
        <ScholarRow
          id="custom"
          name="Custom"
          oneLine="Set your own thresholds — pick numbers that match your scholar exactly."
          who="If your scholar isn&apos;t listed or you want to dial things in yourself."
        />
        <p className="mt-6 text-[13px] italic text-gray-600">
          You can change your scholar anytime from the screen page. Your
          preference is saved in your browser.
        </p>
      </Section>

      {/* SECTION 5 — How to read a HalalGauge verdict (NEW) */}
      <Section n={5} title="How to read a HalalGauge verdict (3 minutes)">
        <p>
          When you search a stock on HalalGauge, you&apos;ll see four parts. They&apos;re
          stacked top-to-bottom on the screen page:
        </p>

        <NumberedItem n="A" title="The verdict — at the top">
          <p>
            A big serif word —{" "}
            <span className="font-semibold text-emerald-700">Halal</span>,{" "}
            <span className="font-semibold text-amber-700">Borderline</span>, or{" "}
            <span className="font-semibold text-rose-700">Not halal</span>. This
            is the verdict under your currently-selected scholar.
          </p>
          <p>
            Just below it: one sentence explaining the &ldquo;why&rdquo; in plain
            English (e.g., &ldquo;Everything passes except cash & securities —
            30.4% versus the 30% limit&rdquo;).
          </p>
        </NumberedItem>

        <NumberedItem n="B" title="The track record — last 8 quarters">
          <p>
            A row of colored blocks showing how this stock&apos;s halal status
            has changed over time. Green blocks mean it passed that quarter,
            amber means borderline, red means it failed.
          </p>
          <p>
            If a stock has been consistently green for two years, that&apos;s
            stronger signal than a stock that flipped between pass and fail.
            Hover any block to see what drove that quarter&apos;s verdict.
          </p>
          <p>
            Why this matters: a company&apos;s balance sheet changes every
            quarter. A stock that&apos;s halal today might fail next quarter if
            it takes on more debt or sees its cash holdings spike.
          </p>
        </NumberedItem>

        <NumberedItem n="C" title="The annotated balance sheet — full math">
          <p>
            Below the track record is the actual balance sheet. Line items are
            marked with circled numbers (①②③④) showing which halal check uses
            them.
          </p>
          <p>
            After each section of the balance sheet, you&apos;ll see a{" "}
            <strong>Check card</strong>. Each card has:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-[14px]">
            <li>The actual ratio number (big, color-coded)</li>
            <li>The threshold and how close you are to it</li>
            <li>
              A &ldquo;Show the math&rdquo; toggle — expand to see the line
              items, the calculation, and where every number comes from
            </li>
            <li>
              Two source citations: the SEC filing (data) and the scholarly
              document (threshold)
            </li>
          </ul>
        </NumberedItem>

        <NumberedItem n="D" title="The multi-scholar comparison — bottom">
          <p>
            A clean table showing how this same stock looks under all six
            scholar profiles. If one stock is halal under AAOIFI but fails under
            Mufti Taqi, you&apos;ll see exactly which check caused the split.
          </p>
        </NumberedItem>
      </Section>

      {/* SECTION 6 — When stocks change halal status (NEW) */}
      <Section n={6} title="Why a stock can &ldquo;flip&rdquo; halal status">
        <p>
          This is where HalalGauge does something other apps don&apos;t: track
          changes over time.
        </p>
        <p>
          A company&apos;s balance sheet changes every quarter when they file a
          new earnings report. Specifically:
        </p>
        <ul className="list-disc space-y-1.5 pl-6">
          <li>
            <strong className="text-gray-900">Debt can creep up.</strong> If a
            company borrows more to fund expansion, debt-to-market-cap can cross
            the 30% threshold and the stock fails.
          </li>
          <li>
            <strong className="text-gray-900">Cash can pile up.</strong> If
            buybacks stop and cash builds up, the cash-to-market-cap ratio can
            exceed 30%.
          </li>
          <li>
            <strong className="text-gray-900">Stock price can drop.</strong>{" "}
            Market cap is the denominator in two key ratios. If price falls
            sharply, ratios that were comfortably under threshold can suddenly
            breach it.
          </li>
          <li>
            <strong className="text-gray-900">Business mix can shift.</strong>{" "}
            Companies pivot — sometimes into something that fails sector
            exclusions.
          </li>
        </ul>
        <p>
          That&apos;s why HalalGauge tracks quarter-by-quarter, surfaces upcoming
          earnings dates, and shows you the full track record. So you can spot
          changes before they catch you off-guard.
        </p>
      </Section>

      {/* SECTION 7 — Watchlist + portfolio + earnings calendar */}
      <Section n={7} title="Tracking your own holdings">
        <p>
          Three tools on HalalGauge help you keep tabs on stocks you care about:
        </p>
        <NumberedItem n="•" title="Watchlist">
          <p>
            Stocks you&apos;re considering or want to monitor. HalalGauge shows each
            one&apos;s current verdict and flags any with upcoming earnings.
          </p>
        </NumberedItem>
        <NumberedItem n="•" title="Portfolio">
          <p>
            Stocks you actually own, weighted by how much you hold. HalalGauge
            calculates what percentage of your portfolio value is halal under
            your scholar.
          </p>
        </NumberedItem>
        <NumberedItem n="•" title="Earnings calendar">
          <p>
            All upcoming earnings reports across your watchlist + portfolio, in
            one view. So you know when to check back to see if anything has
            shifted.
          </p>
        </NumberedItem>
        <p className="mt-4 text-[13px] italic text-gray-600">
          All saved in your browser — no account needed.
        </p>
      </Section>

      {/* SECTION 8 — Other tools (briefly) */}
      <Section n={8} title="Other tools — briefly">
        <p>
          HalalGauge ships a few additional features for users who need them. They&apos;re
          intentionally secondary — the core experience is stock screening.
        </p>
        <ul className="list-disc space-y-1.5 pl-6">
          <li>
            <strong className="text-gray-900">
              <Link href="/purification" className="text-navy-700 underline hover:text-navy-900">
                Purification calculator
              </Link>
              .
            </strong>{" "}
            If you own dividend-paying stocks with some non-permissible income,
            this calculates the share you&apos;d donate to charity.
          </li>
          <li>
            <strong className="text-gray-900">
              <Link href="/zakat" className="text-navy-700 underline hover:text-navy-900">
                Zakat calculator
              </Link>
              .
            </strong>{" "}
            Annual zakat obligation (2.5% of qualifying wealth). Most younger
            investors find this easy to calculate manually, but the tool is
            there if you want it.
          </li>
          <li>
            <strong className="text-gray-900">
              <Link href="/crypto" className="text-navy-700 underline hover:text-navy-900">
                Crypto
              </Link>{" "}
              and{" "}
              <Link href="/sukuk" className="text-navy-700 underline hover:text-navy-900">
                Sukuk
              </Link>
              .
            </strong>{" "}
            Multi-scholar views on major cryptoassets and Islamic bonds. Both
            are in earlier development than stock screening — treat as a
            starting point, not the final word.
          </li>
        </ul>
      </Section>

      {/* SECTION 9 — FAQ */}
      <Section n={9} title="Common questions">
        <Q q="Is HalalGauge free?">
          Yes — the methodology, screener, watchlist, portfolio, and earnings
          calendar are all free, no signup. A small paid tier for alerts and
          advanced features will land later.
        </Q>
        <Q q="Where does the financial data come from?">
          Financial Modeling Prep (FMP) — institutional-grade equity data. We
          update quarterly. Every page that shows a number links back to the
          underlying SEC filing.
        </Q>
        <Q q="Who decides which threshold belongs to which scholar?">
          Not us. Every threshold traces to a published primary source — AAOIFI
          Shariah Standard No. 21, Mufti Taqi Usmani&apos;s published works, the
          S&P DJIM methodology document, the Sistani office&apos;s Code of
          Practice. HalalGauge&apos;s job is faithful implementation with full
          citations, not new rulings.
        </Q>
        <Q q="Why isn't my stock in the dataset?">
          We&apos;re ingesting tickers progressively. Major US equities are
          covered first; we&apos;re expanding outward. Email{" "}
          <a
            href="mailto:hello@mizaninvesting.com"
            className="text-navy-700 underline hover:text-navy-900"
          >
            hello@mizaninvesting.com
          </a>{" "}
          and we&apos;ll add it.
        </Q>
        <Q q="What if I disagree with how HalalGauge classifies a line item?">
          Tell us. Email methodology@mizaninvesting.com with the ticker and
          your reasoning. We log every methodology challenge and address it
          openly on the{" "}
          <Link href="/trust" className="text-navy-700 underline hover:text-navy-900">
            trust page
          </Link>
          .
        </Q>
        <Q q="Are you a scholar?">
          No. The founder is a CUHK med student. Miqdad — the project&apos;s
          Founding Advisor — is Muslim. Every religious call defers to the cited
          scholars and to qualified scholars HalalGauge will engage as it grows.
        </Q>
      </Section>

      {/* CTA */}
      <div className="mt-16 rounded-2xl border border-gray-200 bg-gray-50 p-8 sm:p-10">
        <h2
          className="text-[22px] font-bold leading-tight text-gray-900 sm:text-[24px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Ready to screen your first stock?
        </h2>
        <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-gray-600">
          Try it on Apple — we have full balance sheet detail and the 8-quarter
          track record loaded for AAPL as the reference example.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/screen?ticker=AAPL"
            className="inline-flex items-center gap-1.5 rounded-md bg-navy-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-700"
          >
            Try the screener on Apple <ArrowRight size={14} />
          </Link>
          <Link
            href="/methodology"
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:text-gray-900"
          >
            Read the methodology <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}

/* ───── Section ───── */
function Section({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-14 border-t border-gray-200 pt-10">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[12px] font-semibold text-gold-600">
          {String(n).padStart(2, "0")}
        </span>
        <h2
          className="text-[22px] font-bold leading-tight text-gray-900 sm:text-[26px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h2>
      </div>
      <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-gray-700">
        {children}
      </div>
    </section>
  );
}

/* ───── Q&A item ───── */
function Q({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div className="mt-5 border-l-2 border-gray-200 py-1 pl-4">
      <div className="text-[14px] font-semibold text-gray-900">{q}</div>
      <div className="mt-1 text-[14px] leading-relaxed text-gray-600">
        {children}
      </div>
    </div>
  );
}

/* ───── Scholar row (used in section 4) ─────
   `id` prop wires the row to the homepage scholar cards' hash links:
   /learn#aaoifi, /learn#taqi_usmani, /learn#djim, /learn#jafari,
   /learn#strict, /learn#custom. The scroll-mt-24 offsets the sticky
   header so the row isn't hidden after the jump. */
function ScholarRow({
  id,
  name,
  oneLine,
  who,
}: {
  id?: string;
  name: string;
  oneLine: string;
  who: string;
}) {
  return (
    <div
      id={id}
      className="mt-4 scroll-mt-24 border-l-2 border-gold-300 py-1 pl-4 target:bg-amber-50/40"
    >
      <div
        className="text-[15px] font-bold text-gray-900"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {name}
      </div>
      <div className="mt-1 text-[14px] text-gray-800">{oneLine}</div>
      <div className="mt-1.5 text-[13px] italic text-gray-600">{who}</div>
    </div>
  );
}

/* ───── Numbered item ───── */
function NumberedItem({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5 grid grid-cols-[2rem_1fr] gap-3">
      <div className="font-mono text-[14px] font-bold text-gold-600">{n}</div>
      <div>
        <div
          className="text-[15px] font-bold text-gray-900"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </div>
        <div className="mt-1.5 space-y-2 text-[14px] leading-relaxed text-gray-700">
          {children}
        </div>
      </div>
    </div>
  );
}
