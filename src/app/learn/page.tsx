import Link from "next/link";
import GlossaryTerm from "@/components/GlossaryTerm";
import { GLOSSARY } from "@/lib/glossaryEntries";
import {
  ShareSliceDiagram,
  HalalHaramSourcesDiagram,
  ScholarSpectrumDiagram,
  RatiosDiagram,
  PurificationDiagram,
  ZakatDiagram,
} from "@/components/LearnDiagrams";

export const metadata = {
  title: "Halal investing 101 · Mizan",
  description: "Never invested before? Start here. Plain-language explanation of stocks, halal investing, and how Mizan helps.",
};

function G({ term, children }: { term: string; children?: React.ReactNode }) {
  const def = GLOSSARY[term.toLowerCase()] ?? "";
  return <GlossaryTerm term={term} def={def}>{children ?? term}</GlossaryTerm>;
}

export default function LearnPage() {
  return (
    <article className="mx-auto max-w-3xl">
      <div className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
        Start here if you&apos;re new to investing
      </div>
      <h1 className="mt-4 text-3xl font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
        Halal investing, explained from scratch.
      </h1>
      <p className="mt-3 text-base text-gray-700">
        If you&apos;ve never bought a stock and you&apos;re not sure what halal investing
        even means, you&apos;re in the right place. This page assumes nothing. Read it
        once and you&apos;ll understand 80% of what Mizan does.
      </p>

      <div className="mt-6 rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
        <strong>How to use this page:</strong> short sections, plain English, visual
        diagrams. Any word with a{" "}
        <span className="border-b border-dotted border-navy-400 text-navy-700">dotted underline</span>{" "}
        has a quick definition — hover or tap it. Skim what you know, read what you don&apos;t.
      </div>

      <Section n={1} title="What is a stock, actually?">
        <p>
          When a company like Apple wants to grow, it sometimes sells small ownership
          slices of itself to the public. Each slice is called a <G term="stock" /> (or
          a <G term="share" />). When you buy one share, you own a tiny piece of Apple.
          If Apple makes money, your share is worth a bit more. If Apple does badly,
          your share is worth less.
        </p>

        <ShareSliceDiagram />

        <p className="mt-3">
          The place where stocks are bought and sold is called a stock exchange — like
          the New York Stock Exchange. You buy them through a <G term="brokerage" />{" "}
          like Robinhood, Fidelity, or Schwab. It&apos;s the same idea as buying gold
          or property — you own a real thing whose value goes up and down.
        </p>
      </Section>

      <Section n={2} title='What does "halal investing" mean?'>
        <p>
          Islam permits owning a piece of a business — that&apos;s as old as commerce
          itself. What it does <em>not</em> permit is earning money from sources that
          are <G term="haram" /> (forbidden) — most importantly <G term="riba" />{" "}
          (interest).
        </p>

        <HalalHaramSourcesDiagram />

        <p className="mt-3">
          Modern companies are complicated. Even a company in a permissible business
          (say, a software company) might earn small amounts of interest on its bank
          account. So <G term="halal" /> investing isn&apos;t a single yes/no — it&apos;s
          a screening process that checks: <em>is the company&apos;s main business
          permissible, and are its finances within acceptable limits?</em>
        </p>
        <p className="mt-3">
          That&apos;s what Mizan does. It looks at any company you ask about and tells
          you, in plain numbers, whether it passes the screen for your tradition.
        </p>
      </Section>

      <Section n={3} title="Why do scholars disagree about it?">
        <p>
          Because <G term="shariah" /> applies to a world the early scholars never
          imagined. The Quran doesn&apos;t mention stock markets, ETFs, or
          cryptocurrencies — so today&apos;s <G term="scholar">scholars</G> apply
          general principles to new situations. Different scholars apply them
          differently.
        </p>

        <ScholarSpectrumDiagram />

        <p className="mt-3">
          For example, the question of how much interest income a company can have
          before it&apos;s no longer permissible to own: <G term="aaoifi">AAOIFI</G>{" "}
          says less than 5%. <G term="mufti taqi usmani">Mufti Taqi Usmani</G> agrees
          with that 5% but adds another rule: the company&apos;s real, physical assets
          must be at least 20% of total assets. The strictest interpretations allow no
          interest exposure at all.
        </p>
        <p className="mt-3">
          So the same stock can be halal under one scholar and not under another. Mizan
          shows you the verdict under all six major methodologies side-by-side. You
          pick which one to follow based on which scholar you trust most — usually one
          in your own tradition (Hanafi, Hanbali, Maliki, Shafi&apos;i, or Ja&apos;fari).
        </p>
      </Section>

      <Section n={4} title="What are these &ldquo;ratios&rdquo; I keep seeing?">
        <p>
          Halal screening boils down to five numbers. You don&apos;t need a finance
          degree — just intuition. Mizan shows you each as a bar, with the company&apos;s
          actual value and the scholar&apos;s limit:
        </p>

        <RatiosDiagram />

        <ul className="ml-5 mt-3 list-disc space-y-2 text-gray-700">
          <li>
            <strong>{G({ term: "Impermissible income", children: "Impermissible income" })}{" "}</strong>
            — what percentage of the company&apos;s revenue is from impermissible sources
            (mostly interest on cash)? Most scholars cap at 5%.
          </li>
          <li>
            <strong>{G({ term: "Interest-bearing debt", children: "Interest-bearing debt" })}{" "}</strong>
            — how much money has the company borrowed at interest, relative to its size?
            Cap is usually 30-33%.
          </li>
          <li>
            <strong>Cash + securities</strong> — how much is the company sitting on in
            cash and interest-earning securities? Cap is also 30-33%.
          </li>
          <li>
            <strong>{G({ term: "Receivables", children: "Receivables" })}{" "}</strong>
            — money owed to the company by its customers. Some scholars cap this at 33%.
          </li>
          <li>
            <strong>{G({ term: "Illiquid assets", children: "Illiquid assets" })}{" "}</strong>
            — what percentage of the balance sheet is real, physical stuff? Mufti Taqi
            Usmani specifically requires at least 20%.
          </li>
        </ul>
        <p className="mt-3">
          A stock passes a methodology if it&apos;s in a permissible business AND its
          ratios are all within that scholar&apos;s limits.
        </p>
      </Section>

      <Section n={5} title="What&apos;s &ldquo;purification&rdquo;?">
        <p>
          Even halal-screened companies often earn small amounts of interest on their
          cash. So when they pay you a <G term="dividend" /> (a small share of their
          profits), a tiny slice of that dividend is technically impermissible.
        </p>

        <PurificationDiagram />

        <p className="mt-3">
          <G term="purification">Purification</G> is the practice of calculating that
          impure slice and donating it to charity, without expecting reward in return.
          It cleanses your earnings. Some scholars (like Mufti Taqi) also require
          purifying realized <G term="capital gain">capital gains</G>, not just dividends.
        </p>
        <p className="mt-3">
          Mizan calculates this for you — both the dividend portion and (where required)
          the gain portion.{" "}
          <Link href="/purification" className="text-navy-700 underline">Try it.</Link>
        </p>
      </Section>

      <Section n={6} title="What about zakat?">
        <p>
          <G term="zakat">Zakat</G> is a separate religious obligation — the annual
          2.5% charity all Muslims with sufficient wealth must pay. It includes the
          value of your stocks, your cash, your gold and silver, and any other
          zakatable assets.
        </p>

        <ZakatDiagram />

        <p className="mt-3">
          You pay it on your zakat anniversary date (one lunar year after you first had
          enough wealth to qualify, called <G term="nisab" />). Mizan has a calculator
          that handles this end-to-end at{" "}
          <Link href="/zakat" className="text-navy-700 underline">/zakat</Link>.
        </p>
      </Section>

      <Section n={7} title="Okay — what do I actually do?">
        <p>If you&apos;ve read this far, here&apos;s the simplest possible path:</p>
        <ol className="ml-5 mt-3 list-decimal space-y-2 text-gray-700">
          <li>
            <strong>Pick a scholar to follow.</strong> If you genuinely don&apos;t know
            which scholar matches your tradition, start with <G term="aaoifi">AAOIFI</G> —
            it&apos;s the most widely-used mainstream standard. You can always switch.
          </li>
          <li>
            <strong>Try the screener.</strong> Search for any stock you&apos;ve heard of —
            Apple, Tesla, Amazon — and see Mizan&apos;s verdict.{" "}
            <Link href="/screen?ticker=AAPL" className="text-navy-700 underline">Try Apple here.</Link>
          </li>
          <li>
            <strong>Open a brokerage account.</strong> Robinhood, Fidelity, or Schwab in
            the US. Free to open. Takes 10 minutes.
          </li>
          <li>
            <strong>Buy a halal-screened ETF as a starting point.</strong> ETFs like SPUS
            or HLAL hold dozens of halal-screened companies in one share. They&apos;re
            the easiest first investment for a Muslim investor.
          </li>
          <li>
            <strong>Set a small monthly amount.</strong> Even $50/month invested
            regularly compounds meaningfully over years. You don&apos;t need a lot to start.
          </li>
        </ol>
        <p className="mt-3 text-sm italic text-gray-600">
          None of this is investment advice — we&apos;re information, not advisors. Speak
          to a licensed financial planner before making decisions that matter.
        </p>
      </Section>

      <Section n={8} title="Common questions">
        <Q q="Do I have to know all this to use Mizan?">
          No. Pick your scholar in the onboarding wizard, search a ticker, see the
          verdict. That&apos;s the whole product. This page is for if you want to
          understand what you&apos;re looking at.
        </Q>
        <Q q="What if I&apos;m already invested in haram stocks?">
          A scholar will tell you the same thing: sell what you can, purify what you
          can&apos;t (donate any growth attributable to the impermissible portion), and
          move forward from where you are. Nobody starts perfect.
        </Q>
        <Q q="Is using a credit card haram?">
          Carrying a balance and paying interest is. Using one as a payment method and
          paying the full balance every month is generally accepted by most contemporary
          scholars. Your scholar&apos;s view applies.
        </Q>
        <Q q="What about my employer&apos;s 401(k)?">
          The account itself isn&apos;t haram — what matters is what&apos;s inside it.
          Most default funds hold things you can&apos;t hold halal-wise. Use your
          brokerage window (if your plan has one) or contribute to an IRA instead.{" "}
          <Link href="/blog/is-my-401k-halal-guide" className="text-navy-700 underline">Full guide here.</Link>
        </Q>
        <Q q="What if Mizan and my local imam disagree?">
          Follow your local imam, especially on questions specific to your situation.
          Mizan is a tool; your imam is a teacher. The tool helps the teacher; it
          doesn&apos;t replace them.
        </Q>
      </Section>

      <div className="mt-12 rounded-xl border border-navy-200 bg-navy-50 p-6">
        <h2 className="text-lg font-semibold text-navy-900">You&apos;re ready.</h2>
        <p className="mt-2 text-sm text-navy-800">
          Open the screener, pick a stock you&apos;ve heard of, and try Mizan. The
          product makes a lot more sense when you actually use it.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/screen?ticker=AAPL" className="inline-flex items-center gap-2 rounded-md bg-navy-800 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700">
            Try the screener on Apple →
          </Link>
          <Link href="/zakat" className="inline-flex items-center gap-2 rounded-md border border-navy-200 bg-white px-4 py-2 text-sm font-semibold text-navy-800 hover:bg-navy-100">
            Calculate your zakat
          </Link>
        </div>
      </div>
    </article>
  );
}

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10 border-t border-gray-100 pt-8">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-xs font-bold text-gold-600">{String(n).padStart(2, "0")}</span>
        <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>{title}</h2>
      </div>
      <div className="mt-3 space-y-2 text-base leading-7 text-gray-700">{children}</div>
    </section>
  );
}

function Q({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div className="mt-3 rounded-md border border-gray-200 bg-white p-3">
      <div className="text-sm font-semibold text-gray-900">{q}</div>
      <div className="mt-1 text-sm leading-6 text-gray-700">{children}</div>
    </div>
  );
}
