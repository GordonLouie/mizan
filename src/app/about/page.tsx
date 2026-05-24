import Link from "next/link";
import { Card, PageHeader, Pill } from "@/components/ui";

export const metadata = {
  title: "About · Mizan",
  description:
    "Why a non-Muslim builder in Hong Kong built a halal-investing platform — and the principles that keep it honest.",
};

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        kicker="About Mizan"
        title="Why this exists"
        description="The product began with one friend. The principles are what kept it from becoming dishonest as it grew."
      />

      {/* Origin story — leads with honesty */}
      <Card>
        <div className="text-[11px] font-semibold uppercase tracking-widest text-amber-700">
          The honest origin
        </div>
        <h2 className="mt-1 text-xl font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
          Built by an outsider, inspired by a Muslim friend.
        </h2>
        <div className="mt-4 space-y-3 text-sm leading-7 text-gray-700">
          <p>
            I&apos;m not Muslim. I&apos;m a Hong&nbsp;Kong-based technologist named Gordon, and the
            reason Mizan exists is a single friend who follows the strict view — the position
            that any interest exposure, however small, renders an investment impermissible.
          </p>
          <p>
            Every halal-investing app on the market told him things were halal that he didn&apos;t
            believe were halal. He&apos;d open Zoya, see <em>Pass</em> on a stock, and reject the verdict
            because the underlying methodology was someone else&apos;s — not his. The strict community,
            and the Hanafi diaspora following Mufti Taqi Usmani&apos;s additional illiquid-asset rule,
            and Ja&apos;fari Shia investors with a different framework altogether — they&apos;re all
            served by a single AAOIFI default that treats their disagreements as if they didn&apos;t exist.
          </p>
          <p>
            I built Mizan because I&apos;m a builder. I will never claim authority I don&apos;t have.
            The religious authority belongs to the scholars on the Supervisory Board. My job is
            to make sure the scholars they actually follow are represented faithfully in the
            product, with sources cited, math shown, and no black-box scores. The fact that I&apos;m
            an outsider is exactly what lets Mizan stay neutral across every madhab — I have no
            stake in which scholar is right.
          </p>
          <p>
            That friend is now Mizan&apos;s co-founder, leading community work, scholar relationships,
            and every conversation where being Muslim is the right voice. He reviews every major
            product decision before it ships. I&apos;m CEO; he&apos;s the conscience.
          </p>
        </div>
      </Card>

      {/* Principles */}
      <section>
        <div className="mb-4">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-amber-700">
            What keeps Mizan honest
          </div>
          <h2 className="mt-1 text-2xl font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
            Four operating principles
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Principle
            n="1"
            title="Scholars hold religious authority. Mizan does not."
            body="Mizan summarises what scholars have publicly said and cites the source. Mizan never issues a ruling of its own. Disagreements between scholars are surfaced, not hidden."
          />
          <Principle
            n="2"
            title="Show the math."
            body="Every verdict is reconstructable from the published thresholds and the financial data. No black-box scores. Open the &lsquo;Show the math&rsquo; section on any verdict to see exactly what was checked and against what limit."
          />
          <Principle
            n="3"
            title="Credibility before code."
            body="The Supervisory Board reviews every methodology release before it ships. We do not publish a scholar's name before written engagement is in place — claims of supervision without documentation are common in this industry, and we refuse to participate."
          />
          <Principle
            n="4"
            title="The strict view is a first-class profile."
            body="Most apps either ignore the strict regime or hide it. Mizan ships it as one of six profiles, with the same care as AAOIFI or DJIM. The friend who inspired this product follows it; so will many of our users."
          />
        </div>
      </section>

      {/* The team — solo, with inspiration acknowledged */}
      <section>
        <div className="mb-4">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-amber-700">
            The team
          </div>
          <h2 className="mt-1 text-2xl font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
            Who's behind this
          </h2>
        </div>

        <div className="space-y-4">
          {/* Founder & CEO — primary position */}
          <Card>
            <div className="flex flex-wrap items-start gap-5">
              <div
                className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full bg-navy-800 text-4xl font-bold text-gold-500"
                style={{ fontFamily: "Georgia, serif" }}
              >
                G
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
                    Gordon Louie
                  </h3>
                  <Pill tone="navy">Founder &amp; CEO</Pill>
                </div>
                <div className="mt-1 text-xs uppercase tracking-wide text-gray-500">
                  Hong Kong  ·  technologist  ·  builds &amp; ships
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-700">
                  Leads product, engineering, strategy, and operations. Not a scholar —
                  defers every religious question to the Supervisory Board. Reads and replies
                  to every substantive email personally; no support tickets.
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-700">
                  Contact:{" "}
                  <a href="mailto:hello@mizan.app" className="text-navy-700 underline">
                    hello@mizan.app
                  </a>
                </p>
              </div>
            </div>
          </Card>

          {/* Co-founder — visible, semi-big, with clear functional area */}
          <Card>
            <div className="flex flex-wrap items-start gap-5">
              <div
                className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-3xl font-bold text-amber-800"
                style={{ fontFamily: "Georgia, serif" }}
              >
                ?
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
                    [Co-founder name]
                  </h3>
                  <Pill tone="gold">Co-founder</Pill>
                </div>
                <div className="mt-1 text-xs uppercase tracking-wide text-gray-500">
                  Hong Kong  ·  Community &amp; Shariah Relations
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-700">
                  Muslim, follows the strict view, and was Mizan&apos;s first user. Leads
                  scholar outreach, community-building (Discord, masjid partnerships), and
                  every conversation where being Muslim matters most. Reviews every major
                  product decision before it ships.
                </p>
                <p className="mt-2 text-xs italic text-gray-500">
                  Name and photo published once formal LOI is signed. He is on the team
                  today and visible in every public conversation.
                </p>
              </div>
            </div>
          </Card>

          {/* Why this split */}
          <Card className="bg-gray-50">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
              How we divide the work
            </div>
            <p className="mt-2 text-sm leading-6 text-gray-700">
              Gordon owns product, infrastructure, legal, and government applications (Cyberport,
              HKSTP). Co-founder owns scholar relationships, masjid outreach, community moderation,
              and any public statement where being Muslim is the right voice. Strategic decisions
              are made together; final call sits with the CEO.
            </p>
          </Card>
        </div>
      </section>

      {/* Shariah board status */}
      <section>
        <div className="mb-4">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-amber-700">
            Religious oversight
          </div>
          <h2 className="mt-1 text-2xl font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
            Shariah Supervisory Board
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-600">
            The board reviews every methodology before release, meets quarterly, and audits AI
            Q&amp;A outputs each quarter. Names below are targets currently in conversation —
            none are listed as &lsquo;on the board&rsquo; until written engagement is in place.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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

        <p className="mt-4 text-xs italic text-gray-500">
          Status updated weekly as conversations progress. Honest scoreboard — see{" "}
          <Link href="/trust" className="text-navy-700 underline">/trust</Link> for the current
          state.
        </p>
      </section>

      {/* Company facts */}
      <Card padded={false}>
        <div className="border-b border-gray-100 px-6 py-4 sm:px-8">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
            Company
          </div>
          <h2 className="mt-1 text-xl font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
            Facts on file
          </h2>
        </div>
        <dl className="grid grid-cols-1 divide-y divide-gray-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          <Fact label="Founded" value="2026" />
          <Fact label="Base" value="Hong Kong" />
          <Fact label="Operating entity" value="Mizan Operations (HK) Ltd  ·  in formation" />
          <Fact label="Holding company" value="Mizan Holdings Ltd, Cayman Islands  ·  planned Q3" />
          <Fact label="Funding status" value="Bootstrapped, applying to Cyberport CIP (deadline Aug 3)" />
          <Fact label="Team size" value="2 — Founder/CEO + Co-founder (Community & Shariah Relations, name pending LOI)" />
        </dl>
      </Card>

      {/* Contact */}
      <Card className="bg-gray-50">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
          Get in touch
        </div>
        <h2 className="mt-1 text-lg font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
          Direct lines
        </h2>
        <ul className="mt-3 space-y-1.5 text-sm text-gray-700">
          <li>General: <a href="mailto:hello@mizan.app" className="text-navy-700 underline">hello@mizan.app</a></li>
          <li>Methodology challenge or correction: <a href="mailto:methodology@mizan.app" className="text-navy-700 underline">methodology@mizan.app</a></li>
          <li>Press: <a href="mailto:press@mizan.app" className="text-navy-700 underline">press@mizan.app</a></li>
          <li>Investors: <a href="mailto:investors@mizan.app" className="text-navy-700 underline">investors@mizan.app</a></li>
          <li>Privacy / data: <a href="mailto:privacy@mizan.app" className="text-navy-700 underline">privacy@mizan.app</a></li>
        </ul>
        <p className="mt-4 text-xs italic text-gray-500">
          Every substantive email is read by the founder personally. No support tickets, no
          auto-responses.
        </p>
      </Card>

      <p className="text-center text-xs text-gray-500">
        <Link href="/trust" className="text-navy-700 underline">Trust centre</Link>  ·  {" "}
        <Link href="/methodology" className="text-navy-700 underline">Methodology</Link>  ·  {" "}
        <Link href="/" className="text-navy-700 underline">Home</Link>
      </p>
    </div>
  );
}

function Principle({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <Card>
      <div className="flex items-start gap-3">
        <div
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-amber-50 text-base font-bold text-amber-700"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {n}
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
            {title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-gray-700">{body}</p>
        </div>
      </div>
    </Card>
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
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-amber-700">
        {role}
      </div>
      <div className="mt-1 text-sm font-bold text-gray-900">{name}</div>
      <div className="mt-1 text-xs text-gray-600">{note}</div>
      <div className="mt-3 inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700">
        {status}
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-6 py-4 sm:px-8">
      <dt className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-gray-800">{value}</dd>
    </div>
  );
}
