import Link from "next/link";
import { CheckCircle2, AlertCircle, Clock, ExternalLink } from "lucide-react";
import { Card, PageHeader, Pill } from "@/components/ui";

export const metadata = {
  title: "Trust centre · Mizan",
  description:
    "Everything a Muslim investor needs to evaluate whether to trust Mizan — in one place. Status of scholar onboarding, methodology sources, data sources, privacy, and how to reach the founder directly.",
};

type Status = "done" | "in_progress" | "not_yet";

interface Item {
  label: string;
  status: Status;
  detail?: string;
}

export default function TrustPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        kicker="Trust centre"
        title="Everything you need to evaluate Mizan"
        description="A single page with the honest current status of every credibility signal you might check. No marketing language. Updated as facts change."
      />

      <Card className="bg-amber-50/40">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
          Why this page exists
        </div>
        <p className="mt-3 text-sm leading-7 text-gray-700">
          Halal investing is a trust-first category. You shouldn&apos;t have to dig through a dozen
          marketing pages to figure out whether a product is worth your time. This page is the
          single honest answer — what&apos;s real, what&apos;s in progress, what hasn&apos;t happened
          yet. If anything below changes, this page changes first.
        </p>
      </Card>

      {/* Top-line credibility scoreboard */}
      <Section title="Credibility scoreboard">
        <Card padded={false}>
          <ul className="divide-y divide-gray-100">
            <StatusRow
              item={{
                label: "Live product deployed",
                status: "done",
                detail: "Mizan is live, public, free to use. Web app supports six scholarly profiles, screens 163 representative tickers in the prototype, full source on GitHub.",
              }}
            />
            <StatusRow
              item={{
                label: "Methodology published with primary-source citations",
                status: "done",
                detail: "Every threshold in the screening engine traces back to AAOIFI Standard No. 21, Mufti Taqi Usmani's published rulings, S&P DJIM methodology PDF, or the Sistani office. Open the /methodology page to verify.",
              }}
            />
            <StatusRow
              item={{
                label: "Founder publicly named, contactable",
                status: "done",
                detail: "Gordon Louie, Hong Kong. Email replies to every substantive message personally. No support tickets.",
              }}
            />
            <StatusRow
              item={{
                label: "Shariah Supervisory Board: chair signed",
                status: "in_progress",
                detail: "Mufti Faraz Adam (Amanah Advisors, UK) — outreach in progress. We will not list any scholar as &lsquo;on the board&rsquo; until written engagement is in place.",
              }}
            />
            <StatusRow
              item={{
                label: "Shariah Supervisory Board: full panel (3 scholars)",
                status: "in_progress",
                detail: "Chair (Hanafi target) + Member (Hanbali/Maliki target, Joe Bradford) + Member (Ja'fari target). Identifying and reaching out.",
              }}
            />
            <StatusRow
              item={{
                label: "Hong Kong operating entity (Mizan Operations Ltd)",
                status: "in_progress",
                detail: "Incorporation scheduled via Sleek HK in week 6 of the launch roadmap.",
              }}
            />
            <StatusRow
              item={{
                label: "Cayman holding company",
                status: "not_yet",
                detail: "Planned Q3 2026 via Walkers Cayman. Standard VC-ready structure for fundraising.",
              }}
            />
            <StatusRow
              item={{
                label: "Live financial data integration (Financial Modeling Prep)",
                status: "not_yet",
                detail: "Current prototype runs on a 163-ticker representative sample seeded from public Q1 2026 filings. Production data pipeline scheduled Q3.",
              }}
            />
            <StatusRow
              item={{
                label: "Paid subscription tiers live",
                status: "not_yet",
                detail: "Free tier only until the Supervisory Board chair is publicly named.",
              }}
            />
          </ul>
        </Card>
      </Section>

      {/* Who we are */}
      <Section title="Who we are">
        <Card>
          <p className="text-sm leading-7 text-gray-700">
            Mizan is led by <strong>Gordon Louie</strong> (Founder &amp; CEO, Hong&nbsp;Kong-based
            technologist) and built with a Muslim co-founder who heads Community &amp; Shariah
            Relations. The co-founder follows the strict view and was Mizan&apos;s first user;
            he leads scholar outreach and community work and reviews every major product decision.
            His name and photo will appear here once formal LOI is signed.
          </p>
          <p className="mt-3 text-sm leading-7 text-gray-700">
            Gordon is <strong>not Muslim</strong>. The product makes no religious claims of its own —
            it surfaces what scholars publicly say and cites the source. The religious authority
            belongs to the Supervisory Board. The full team breakdown is on{" "}
            <Link href="/about" className="text-navy-700 underline">/about</Link>.
          </p>
        </Card>
      </Section>

      {/* Methodology sources */}
      <Section title="Where the screening rules come from">
        <Card padded={false}>
          <div className="border-b border-gray-100 px-6 py-4 sm:px-8">
            <p className="text-sm leading-6 text-gray-700">
              Every threshold in the engine traces back to a public primary source. If you find a
              mismatch between a Mizan profile and the cited source, write to{" "}
              <a href="mailto:methodology@mizan.app" className="text-navy-700 underline">
                methodology@mizan.app
              </a>{" "}
              and we&apos;ll publish a correction.
            </p>
          </div>
          <ul className="divide-y divide-gray-100">
            <SourceRow
              scholar="AAOIFI Standard"
              source="AAOIFI Shariah Standard No. 21 (Financial Papers)"
              url="https://aaoifi.com/shariaa-standards/?lang=en"
              cites="5% impermissible-income cap, 30% caps on debt and liquid assets."
            />
            <SourceRow
              scholar="Mufti Taqi Usmani"
              source="Introduction to Islamic Finance + Principles of Shariah Governing Islamic Investment Funds"
              url="https://www.muftitaqiusmani.com/en/?page_id=1175"
              cites="AAOIFI thresholds + the illiquid-asset floor (≥20% tangible) + capital-gain purification."
            />
            <SourceRow
              scholar="Dow Jones Islamic Market"
              source="DJIM Index Methodology PDF (S&P)"
              url="https://www.spglobal.com/spdji/en/documents/methodologies/methodology-dj-islamic-market-indices.pdf"
              cites="33% (one-third) caps on debt, liquid assets, receivables."
            />
            <SourceRow
              scholar="Ja'fari (Sistani-aligned)"
              source="Sistani office — Code of Practice + share-trading Q&A"
              url="https://www.sistani.org/english/qa/01155/"
              cites="Permissible-income rules and khums (20% of net annual surplus)."
            />
            <SourceRow
              scholar="Strict / zero-tolerance"
              source="Minority published views (Mufti Imran Hussein and others)"
              url="https://imranhosein.org/"
              cites="Zero-tolerance position on any riba exposure."
            />
          </ul>
        </Card>
      </Section>

      {/* Data sources */}
      <Section title="Where the data comes from">
        <Card>
          <ul className="space-y-3 text-sm leading-6 text-gray-700">
            <li>
              <strong>Current prototype (May 2026):</strong> 163 representative tickers
              hand-seeded from public Q1 2026 filings (10-Ks, 10-Qs, equivalent international
              filings). Used for engine validation and design.
            </li>
            <li>
              <strong>Year 1 production:</strong> Financial Modeling Prep API for live
              fundamentals across any listed equity. Refresh cadence: nightly.
            </li>
            <li>
              <strong>Year 2 production:</strong> Graduate to Refinitiv / SIX Financial for
              broader international coverage at scale.
            </li>
            <li>
              <strong>Ratios computed in-house</strong> from balance-sheet primitives. Mizan
              does not rely on any third party&apos;s pre-computed &lsquo;halal score&rsquo;.
            </li>
          </ul>
        </Card>
      </Section>

      {/* Privacy */}
      <Section title="Privacy posture">
        <Card>
          <ul className="space-y-3 text-sm leading-6 text-gray-700">
            <li><strong>No account required</strong> to use the screener, watchlist, portfolio scorer, or any tool.</li>
            <li><strong>No tracking analytics on the current site.</strong> When usage analytics are added (Q3, Plausible or similar), they will be cookie-less and IP-anonymised.</li>
            <li><strong>Watchlist, portfolio, custom scholar profile</strong> stored locally in your browser only. Nothing leaves your device.</li>
            <li><strong>No data sold, ever.</strong> See <Link href="/privacy" className="text-navy-700 underline">/privacy</Link> for the formal policy.</li>
          </ul>
        </Card>
      </Section>

      {/* Honest gaps */}
      <Section title="What's intentionally missing right now">
        <Card>
          <p className="mb-3 text-sm leading-6 text-gray-700">
            Honest disclosure of what doesn&apos;t yet exist, so testers know which gaps are
            intentional and which are bugs:
          </p>
          <ul className="space-y-2 text-sm leading-6 text-gray-700">
            <li>• <strong>Mobile native app</strong> — web works on mobile; native iOS/Android is Q4.</li>
            <li>• <strong>Brokerage account sync (Plaid)</strong> — manual portfolio entry only for now.</li>
            <li>• <strong>Real-time prices</strong> — current prices are indicative; live tick data is post-FMP integration.</li>
            <li>• <strong>Push notifications</strong> — verdict-change alerts depend on mobile + backend, both Q4.</li>
            <li>• <strong>Stock universe beyond 163 sample tickers</strong> — production scales to any listed equity once FMP is wired in (Q3).</li>
          </ul>
          <p className="mt-4 text-xs italic text-gray-500">
            Found something broken that&apos;s NOT on this list? Use the feedback button (bottom-right
            on every page) or email{" "}
            <a href="mailto:hello@mizan.app" className="text-navy-700 underline">hello@mizan.app</a>.
          </p>
        </Card>
      </Section>

      {/* Reach the founder */}
      <Card className="bg-navy-50/40">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-navy-700">
          Reach Gordon
        </div>
        <h2 className="mt-1 text-xl font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
          The founder reads every substantive email
        </h2>
        <p className="mt-3 text-sm leading-7 text-gray-700">
          No support tickets, no auto-responses, no chatbot deflecting you. Hit{" "}
          <a href="mailto:hello@mizan.app" className="text-navy-700 underline">hello@mizan.app</a>{" "}
          and a person responds. Methodology challenges go to{" "}
          <a href="mailto:methodology@mizan.app" className="text-navy-700 underline">
            methodology@mizan.app
          </a>{" "}
          and are read by the Supervisory Board.
        </p>
      </Card>

      <p className="text-center text-xs text-gray-500">
        Last updated 22 May 2026. Page version 1.{" "}
        <Link href="/" className="text-navy-700 underline">Back to home</Link>.
      </p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function StatusRow({ item }: { item: Item }) {
  const icon =
    item.status === "done" ? <CheckCircle2 size={18} className="text-emerald-600" />
      : item.status === "in_progress" ? <Clock size={18} className="text-amber-600" />
        : <AlertCircle size={18} className="text-gray-400" />;
  const tone =
    item.status === "done" ? "pass"
      : item.status === "in_progress" ? "warn"
        : "neutral";
  const label =
    item.status === "done" ? "Done"
      : item.status === "in_progress" ? "In progress"
        : "Not yet";
  return (
    <li className="grid grid-cols-1 gap-2 px-6 py-4 sm:grid-cols-[28px_1fr_120px] sm:items-start sm:px-8">
      <div className="pt-0.5">{icon}</div>
      <div>
        <div className="text-sm font-semibold text-gray-900">{item.label}</div>
        {item.detail && <div className="mt-1 text-xs leading-5 text-gray-600">{item.detail}</div>}
      </div>
      <div className="sm:text-right">
        <Pill tone={tone}>{label}</Pill>
      </div>
    </li>
  );
}

function SourceRow({
  scholar,
  source,
  url,
  cites,
}: {
  scholar: string;
  source: string;
  url: string;
  cites: string;
}) {
  return (
    <li className="px-6 py-4 sm:px-8">
      <div className="text-sm font-semibold text-gray-900">{scholar}</div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 inline-flex items-center gap-1 text-sm text-navy-700 hover:underline"
      >
        {source} <ExternalLink size={11} />
      </a>
      <div className="mt-1 text-xs text-gray-600">{cites}</div>
    </li>
  );
}
