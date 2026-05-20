export const metadata = { title: "Roadmap · Mizan" };

const NOW = [
  "Live financial data pipeline (Financial Modeling Prep)",
  "Brokerage portfolio sync (Plaid US)",
  "AI scholar Q&A with bounded scope and board-reviewed prompts",
  "Onboarding flow + scholar-selection nudge",
  "Mobile-responsive polish on all screens",
];

const NEXT = [
  "International equities — UK + Canada + Saudi Arabia",
  "ETF and mutual fund screening with look-through to holdings",
  "Filing-event re-screen alerts (push notifications when verdicts change)",
  "TrueLayer brokerage sync (UK / EU)",
  "Urdu / Hindi / Bengali UI",
  "Crypto layer — top 100 tokens with scholar-by-scholar verdicts",
  "B2B compliance API (private beta with 3-5 partners)",
];

const LATER = [
  "ICNA / ISNA partnership (free Pro for members)",
  "Group plans for masjids and Islamic schools",
  "Earnings-call summaries with halal lens",
  "Salt Edge / MENA brokerage links",
  "Native iOS and Android apps via React Native",
  "Public Shariah methodology archive with full citation provenance",
  "B2B compliance API — public launch + SDKs (TypeScript, Python, Ruby, Go)",
];

const SOMEDAY = [
  "Retail sukuk distribution (requires Type 1 SFC license)",
  "Halal 401(k) employer partnerships",
  "Tokenized real estate / commodity access for strict-tolerance investors",
  "Scholar marketplace — third-party scholars publish supplements / overrides",
];

export default function RoadmapPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="inline-block rounded-full bg-navy-50 px-3 py-1 text-xs font-medium text-navy-800">
          Public roadmap
        </div>
        <h1 className="mt-3 text-3xl font-bold text-gray-900">What we&apos;re building, in order.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600">
          We update this page quarterly. Items move from Later → Next → Now as they get
          built. Nothing here is a promise — priorities shift with what users tell us.
          What we won&apos;t change: the multi-scholar architecture, the supervisory
          board, the non-advisory positioning, transparent ratio reasoning on every
          verdict.
        </p>
      </div>

      <Section title="Now" badge="Building this quarter" items={NOW} accent="bg-emerald-600" />
      <Section title="Next" badge="Next 2 quarters" items={NEXT} accent="bg-navy-700" />
      <Section title="Later" badge="Within 18 months" items={LATER} accent="bg-amber-600" />
      <Section title="Someday / maybe" badge="2-3 years out" items={SOMEDAY} accent="bg-gray-500" />

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
        <h2 className="text-base font-semibold text-gray-900">Something missing?</h2>
        <p className="mt-2 text-sm text-gray-700">
          If there&apos;s a feature, scholar profile, or jurisdiction you wish was
          higher on this list, tell us:{" "}
          <a href="mailto:roadmap@mizan.app" className="text-navy-700 underline">
            roadmap@mizan.app
          </a>
          . We don&apos;t respond to every email but we read every one, and the most
          repeated requests move up.
        </p>
      </div>
    </div>
  );
}

function Section({ title, badge, items, accent }: {
  title: string; badge: string; items: string[]; accent: string;
}) {
  return (
    <section>
      <div className="mb-3 flex items-baseline gap-3">
        <span className={"inline-block h-2 w-2 rounded-full " + accent} aria-hidden="true" />
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <span className="text-xs uppercase tracking-wide text-gray-500">{badge}</span>
      </div>
      <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-3 px-4 py-3">
            <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-300" />
            <span className="text-sm text-gray-700">{it}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
