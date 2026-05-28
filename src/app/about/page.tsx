import Link from "next/link";

export const metadata = {
  title: "About · Mizan",
  description:
    "Why a non-Muslim builder in Hong Kong built a halal-investing platform — and the principles that keep it honest.",
};

export default function AboutPage() {
  return (
    <div className="pb-20">
      {/* PAGE HEADER */}
      <header className="pt-6">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          About Mizan
        </div>
        <h1
          className="mt-3 text-[36px] font-bold leading-[1.1] text-gray-900 sm:text-[44px]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Why this exists
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-gray-600">
          One friend got me curious about a real gap in halal investing tools. The
          principles below are what keep it honest as the product grows.
        </p>
      </header>

      {/* ORIGIN STORY */}
      <section className="mt-16">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          The honest origin
        </div>
        <h2
          className="mt-2 text-[24px] font-bold leading-tight text-gray-900 sm:text-[28px]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Built by an outsider, inspired by a Muslim friend.
        </h2>
        <div className="mt-5 max-w-2xl space-y-4 text-[15px] leading-relaxed text-gray-700">
          <p>
            I&apos;m not Muslim. I&apos;m a Hong&nbsp;Kong-based technologist named
            Gordon, and the reason Mizan exists is a single friend. He looked at the
            existing halal-investing apps and kept seeing verdicts that didn&apos;t match
            what he believed his own scholars taught. Different scholars reach different
            verdicts on the same stock — but the apps either pick one rulebook and hide
            the rest, or wrap a black-box score around the whole thing.
          </p>
          <p>
            The Hanafi diaspora following Mufti Taqi Usmani&apos;s additional
            illiquid-asset rule, Ja&apos;fari Shia investors with a different framework
            altogether, and the strict-view community — they&apos;re all served by a
            single AAOIFI default that treats their disagreements as if they didn&apos;t
            exist.
          </p>
          <p>
            I built Mizan because I&apos;m a builder. I will never claim religious
            authority I don&apos;t have. My job is to faithfully represent what scholars
            have already published — with the sources cited, the math shown, and no
            black-box scores. The fact that I&apos;m an outsider is exactly what lets
            Mizan stay neutral across every madhab: I have no stake in which scholar is
            right.
          </p>
        </div>
      </section>

      {/* OPERATING PRINCIPLES */}
      <section className="mt-20 border-t border-gray-200 pt-10">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          What keeps Mizan honest
        </div>
        <h2
          className="mt-2 text-[24px] font-bold leading-tight text-gray-900 sm:text-[28px]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Four operating principles
        </h2>

        <div className="mt-8 max-w-3xl divide-y divide-gray-200">
          <Principle
            n="01"
            title="Scholars hold religious authority. Mizan does not."
            body="Mizan summarises what scholars have publicly said and cites the source. Mizan never issues a ruling of its own. Disagreements between scholars are surfaced, not hidden."
          />
          <Principle
            n="02"
            title="Show the math."
            body="Every verdict is reconstructable from the published thresholds and the financial data. No black-box scores. Open the 'Show the math' section on any verdict to see exactly what was checked and against what limit."
          />
          <Principle
            n="03"
            title="Credibility through citation."
            body="Every threshold in the screening engine traces back to a public, primary document — AAOIFI Shariah Standard No. 21, Mufti Taqi Usmani's published works, the S&P DJIM methodology PDF, the Sistani office's Code of Practice. Until a Shariah Supervisory Board is formally seated, the citation chain is the credibility."
          />
          <Principle
            n="04"
            title="The strict view is a first-class profile."
            body="Most apps either ignore the zero-tolerance regime or hide it. Mizan ships it as one of six profiles, with the same care as AAOIFI or DJIM."
          />
        </div>
      </section>

      {/* TEAM */}
      <section className="mt-20 border-t border-gray-200 pt-10">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          The team
        </div>
        <h2
          className="mt-2 text-[24px] font-bold leading-tight text-gray-900 sm:text-[28px]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Who&apos;s behind this
        </h2>

        <div className="mt-8">
          {/* Founder & CEO */}
          <div className="rounded-xl border border-gray-200 bg-white p-7">
            <div className="flex flex-wrap items-start gap-5">
              <div
                className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full bg-navy-800 text-4xl font-bold text-gold-500"
                style={{ fontFamily: "Georgia, serif" }}
              >
                G
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  <h3
                    className="text-[22px] font-bold text-gray-900"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    Gordon Louie
                  </h3>
                  <span className="rounded-full bg-navy-50 px-2.5 py-0.5 text-[11px] font-semibold text-navy-700">
                    Founder
                  </span>
                </div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.14em] text-gray-500">
                  Hong Kong · technologist · builds &amp; ships
                </div>
                <p className="mt-4 text-[14px] leading-relaxed text-gray-700">
                  Solo founder. Leads product, engineering, methodology research, and
                  every other surface of Mizan today. Not a scholar — defers every
                  religious question to the cited primary sources and to qualified scholars
                  the project will engage as it grows. Reads and replies to every
                  substantive email personally; no support tickets.
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-gray-600">
                  Contact:{" "}
                  <a
                    href="mailto:hello@mizaninvesting.com"
                    className="text-navy-700 underline hover:text-navy-900"
                  >
                    hello@mizaninvesting.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Honest note about what's not yet here */}
          <div className="mt-6 border-l-2 border-gray-300 py-2 pl-5">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
              What&apos;s not yet here
            </div>
            <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-gray-700">
              Mizan does not yet have a formal Shariah Supervisory Board, a named
              co-founder, or paid scholar engagements. Until those happen, credibility
              comes from the primary-source citations on{" "}
              <Link
                href="/methodology"
                className="text-navy-700 underline hover:text-navy-900"
              >
                /methodology
              </Link>
              {" "}and from the honest scoreboard on{" "}
              <Link href="/trust" className="text-navy-700 underline hover:text-navy-900">
                /trust
              </Link>
              . Both pages are updated as facts change.
            </p>
          </div>
        </div>
      </section>

      {/* COMPANY FACTS */}
      <section className="mt-20 border-t border-gray-200 pt-10">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Company
        </div>
        <h2
          className="mt-2 text-[24px] font-bold leading-tight text-gray-900 sm:text-[28px]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Facts on file
        </h2>

        <dl className="mt-6 grid grid-cols-1 gap-y-5 border-t border-gray-200 pt-5 sm:grid-cols-2 sm:gap-x-10">
          <Fact label="Founded" value="2026" />
          <Fact label="Base" value="Hong Kong" />
          <Fact
            label="Operating entity"
            value="Mizan Operations (HK) Ltd · in formation"
          />
          <Fact
            label="Holding company"
            value="Mizan Holdings Ltd, Cayman Islands · planned Q3"
          />
          <Fact
            label="Funding status"
            value="Bootstrapped, applying to Cyberport CIP (deadline Aug 3)"
          />
          <Fact label="Team size" value="1 — Founder, building solo today" />
        </dl>
      </section>

      {/* CONTACT */}
      <section className="mt-20 border-t border-gray-200 pt-10">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Get in touch
        </div>
        <h2
          className="mt-2 text-[24px] font-bold leading-tight text-gray-900 sm:text-[28px]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Direct lines
        </h2>

        <dl className="mt-6 max-w-xl divide-y divide-gray-100">
          <ContactRow label="General" email="hello@mizaninvesting.com" />
          <ContactRow label="Methodology challenge" email="methodology@mizaninvesting.com" />
          <ContactRow label="Press" email="press@mizaninvesting.com" />
          <ContactRow label="Investors" email="investors@mizaninvesting.com" />
          <ContactRow label="Privacy / data" email="privacy@mizaninvesting.com" />
        </dl>
        <p className="mt-6 text-[12px] italic text-gray-500">
          Every substantive email is read by the founder personally. No support tickets,
          no auto-responses.
        </p>
      </section>

      {/* FOOTER NAV */}
      <p className="mt-16 text-center text-[11px] text-gray-500">
        <Link href="/trust" className="text-navy-700 underline hover:text-navy-900">
          Trust centre
        </Link>{" "}
        ·{" "}
        <Link
          href="/methodology"
          className="text-navy-700 underline hover:text-navy-900"
        >
          Methodology
        </Link>{" "}
        ·{" "}
        <Link href="/" className="text-navy-700 underline hover:text-navy-900">
          Home
        </Link>
      </p>
    </div>
  );
}

function Principle({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-1 py-6">
      <div className="font-mono text-[12px] font-semibold text-gold-600">{n}</div>
      <div>
        <h3
          className="text-[16px] font-bold leading-tight text-gray-900"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {title}
        </h3>
        <p className="mt-2 text-[14px] leading-relaxed text-gray-700">{body}</p>
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
        {label}
      </dt>
      <dd className="mt-1 text-[14px] text-gray-800">{value}</dd>
    </div>
  );
}

function ContactRow({ label, email }: { label: string; email: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <dt className="text-[12px] uppercase tracking-[0.14em] text-gray-500">{label}</dt>
      <dd>
        <a
          href={`mailto:${email}`}
          className="font-mono text-[13px] text-navy-700 hover:text-navy-900 hover:underline"
        >
          {email}
        </a>
      </dd>
    </div>
  );
}
