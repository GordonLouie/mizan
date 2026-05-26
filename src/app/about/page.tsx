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
          The product began with one friend. The principles are what kept it from becoming
          dishonest as it grew.
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
            Gordon, and the reason Mizan exists is a single friend who follows the strict
            view — the position that any interest exposure, however small, renders an
            investment impermissible.
          </p>
          <p>
            Every halal-investing app on the market told him things were halal that he
            didn&apos;t believe were halal. He&apos;d open Zoya, see <em>Pass</em> on a
            stock, and reject the verdict because the underlying methodology was someone
            else&apos;s — not his. The strict community, the Hanafi diaspora following
            Mufti Taqi Usmani&apos;s additional illiquid-asset rule, and Ja&apos;fari Shia
            investors with a different framework altogether — they&apos;re all served by a
            single AAOIFI default that treats their disagreements as if they didn&apos;t exist.
          </p>
          <p>
            I built Mizan because I&apos;m a builder. I will never claim authority I
            don&apos;t have. The religious authority belongs to the scholars on the
            Supervisory Board. My job is to make sure the scholars they actually follow
            are represented faithfully in the product, with sources cited, math shown,
            and no black-box scores. The fact that I&apos;m an outsider is exactly what
            lets Mizan stay neutral across every madhab — I have no stake in which
            scholar is right.
          </p>
          <p>
            That friend is now Mizan&apos;s co-founder, leading community work, scholar
            relationships, and every conversation where being Muslim is the right voice.
            He reviews every major product decision before it ships. I&apos;m CEO;
            he&apos;s the conscience.
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
            title="Credibility before code."
            body="The Supervisory Board reviews every methodology release before it ships. We do not publish a scholar's name before written engagement is in place — claims of supervision without documentation are common in this industry, and we refuse to participate."
          />
          <Principle
            n="04"
            title="The strict view is a first-class profile."
            body="Most apps either ignore the strict regime or hide it. Mizan ships it as one of six profiles, with the same care as AAOIFI or DJIM. The friend who inspired this product follows it; so will many of our users."
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

        <div className="mt-8 space-y-6">
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
                    Founder &amp; CEO
                  </span>
                </div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.14em] text-gray-500">
                  Hong Kong · technologist · builds &amp; ships
                </div>
                <p className="mt-4 text-[14px] leading-relaxed text-gray-700">
                  Leads product, engineering, strategy, and operations. Not a scholar —
                  defers every religious question to the Supervisory Board. Reads and
                  replies to every substantive email personally; no support tickets.
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-gray-600">
                  Contact:{" "}
                  <a
                    href="mailto:hello@mizan.app"
                    className="text-navy-700 underline hover:text-navy-900"
                  >
                    hello@mizan.app
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Co-founder */}
          <div className="rounded-xl border border-gray-200 bg-white p-7">
            <div className="flex flex-wrap items-start gap-5">
              <div
                className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-3xl font-bold text-amber-800"
                style={{ fontFamily: "Georgia, serif" }}
              >
                ?
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  <h3
                    className="text-[20px] font-bold text-gray-900"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    [Co-founder name]
                  </h3>
                  <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800">
                    Co-founder
                  </span>
                </div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.14em] text-gray-500">
                  Hong Kong · Community &amp; Shariah Relations
                </div>
                <p className="mt-4 text-[14px] leading-relaxed text-gray-700">
                  Muslim, follows the strict view, and was Mizan&apos;s first user. Leads
                  scholar outreach, community-building (Discord, masjid partnerships), and
                  every conversation where being Muslim matters most. Reviews every major
                  product decision before it ships.
                </p>
                <p className="mt-2 text-[12px] italic leading-relaxed text-gray-500">
                  Name and photo published once formal LOI is signed. He is on the team
                  today and visible in every public conversation.
                </p>
              </div>
            </div>
          </div>

          {/* How we divide the work */}
          <div className="border-l-2 border-gray-300 py-2 pl-5">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
              How we divide the work
            </div>
            <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-gray-700">
              Gordon owns product, infrastructure, legal, and government applications
              (Cyberport, HKSTP). Co-founder owns scholar relationships, masjid outreach,
              community moderation, and any public statement where being Muslim is the
              right voice. Strategic decisions are made together; final call sits with the CEO.
            </p>
          </div>
        </div>
      </section>

      {/* SHARIAH BOARD */}
      <section className="mt-20 border-t border-gray-200 pt-10">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Religious oversight
        </div>
        <h2
          className="mt-2 text-[24px] font-bold leading-tight text-gray-900 sm:text-[28px]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Shariah Supervisory Board
        </h2>
        <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-gray-600">
          The board reviews every methodology before release, meets quarterly, and audits
          AI Q&amp;A outputs each quarter. Names below are targets currently in
          conversation — none are listed as &lsquo;on the board&rsquo; until written
          engagement is in place.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <BoardCard
            role="Chair (target)"
            name="Mufti Faraz Adam"
            note="UK · Hanafi · Amanah Advisors"
            status="Outreach in progress"
          />
          <BoardCard
            role="Member (target)"
            name="Sheikh Joe Bradford"
            note="US · Hanbali/Maliki · AAOIFI-certified"
            status="Outreach in progress"
          />
          <BoardCard
            role="Member (target)"
            name="Ja'fari scholar"
            note="Al-Mahdi Institute UK · candidate"
            status="Identifying"
          />
        </div>

        <p className="mt-5 text-[12px] italic text-gray-500">
          Status updated weekly as conversations progress. Honest scoreboard — see{" "}
          <Link href="/trust" className="text-navy-700 underline hover:text-navy-900">
            /trust
          </Link>{" "}
          for the current state.
        </p>
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
          <Fact
            label="Team size"
            value="2 — Founder/CEO + Co-founder (Community & Shariah Relations, name pending LOI)"
          />
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
          <ContactRow label="General" email="hello@mizan.app" />
          <ContactRow label="Methodology challenge" email="methodology@mizan.app" />
          <ContactRow label="Press" email="press@mizan.app" />
          <ContactRow label="Investors" email="investors@mizan.app" />
          <ContactRow label="Privacy / data" email="privacy@mizan.app" />
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
      <div
        className="font-mono text-[12px] font-semibold text-gold-600"
        style={{ fontFamily: "ui-monospace, monospace" }}
      >
        {n}
      </div>
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

function BoardCard({
  role,
  name,
  note,
  status,
}: {
  role: string;
  name: string;
  note: string;
  status: string;
}) {
  return (
    <div className="border border-gray-200 bg-white p-5">
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
        {role}
      </div>
      <div
        className="mt-2 text-[15px] font-bold text-gray-900"
        style={{ fontFamily: "Georgia, serif" }}
      >
        {name}
      </div>
      <div className="mt-1 text-[11px] text-gray-600">{note}</div>
      <div className="mt-4 inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-800">
        {status}
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
