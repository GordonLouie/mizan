import Link from "next/link";
import { CheckCircle2, AlertCircle, Clock, ExternalLink } from "lucide-react";

export const metadata = {
  title: "Trust centre · HalalGauge",
  description:
    "Everything a Muslim investor needs to evaluate whether to trust HalalGauge — in one place. Status of scholar onboarding, methodology sources, data sources, privacy, and how to reach the founder directly.",
};

type Status = "done" | "in_progress" | "not_yet";

interface Item {
  label: string;
  status: Status;
  detail?: string;
}

export default function TrustPage() {
  return (
    <div className="pb-20">
      {/* PAGE HEADER */}
      <header className="pt-6">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          Trust centre
        </div>
        <h1
          className="mt-3 text-[36px] font-bold leading-[1.1] text-gray-900 sm:text-[44px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Everything you need to evaluate HalalGauge
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-gray-600">
          A single page with the honest current status of every credibility signal you might
          check. No marketing language. Updated as facts change.
        </p>
      </header>

      {/* WHY THIS PAGE */}
      <div className="mt-10 border-l-2 border-gold-500 py-2 pl-5">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
          Why this page exists
        </div>
        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-gray-700">
          Halal investing is a trust-first category. You shouldn&apos;t have to dig through a
          dozen marketing pages to figure out whether a product is worth your time. This page
          is the single honest answer — what&apos;s real, what&apos;s in progress, what
          hasn&apos;t happened yet. If anything below changes, this page changes first.
        </p>
      </div>

      {/* CREDIBILITY SCOREBOARD */}
      <section className="mt-16">
        <SectionHead title="Credibility scoreboard" />
        <ul className="mt-6 divide-y divide-gray-200 border-y border-gray-200">
          <StatusRow
            item={{
              label: "Live product deployed",
              status: "done",
              detail:
                "HalalGauge is live, public, free to use. Web app supports five scholarly standards (plus a custom builder), screens a 163-ticker representative sample, full source on GitHub.",
            }}
          />
          <StatusRow
            item={{
              label: "Methodology published with primary-source citations",
              status: "done",
              detail:
                "Every threshold in the screening engine traces back to AAOIFI Standard No. 21, Mufti Taqi Usmani's published rulings, S&P DJIM methodology PDF, or the Sistani office. Open the /methodology page to verify.",
            }}
          />
          <StatusRow
            item={{
              label: "Founder publicly named, contactable",
              status: "done",
              detail:
                "Gordon Louie, Hong Kong. Email replies to every substantive message personally. No support tickets.",
            }}
          />
          <StatusRow
            item={{
              label: "Shariah Supervisory Board",
              status: "not_yet",
              detail:
                "No board is currently engaged. Until one is, credibility comes from the primary-source citations on /methodology. We will not list any scholar as 'on the board' until written engagement is in place — claims of supervision without documentation are common in this industry and we refuse to participate.",
            }}
          />
          <StatusRow
            item={{
              label: "Co-founder / additional team",
              status: "not_yet",
              detail:
                "HalalGauge is built solo today by Gordon Louie. No co-founder or additional team member is currently engaged. Future hires will appear here when in place.",
            }}
          />
          <StatusRow
            item={{
              label: "Hong Kong operating entity (HalalGauge Operations Ltd)",
              status: "in_progress",
              detail:
                "Incorporation scheduled via Sleek HK in week 6 of the launch roadmap.",
            }}
          />
          <StatusRow
            item={{
              label: "Cayman holding company",
              status: "not_yet",
              detail:
                "Planned Q3 2026 via Walkers Cayman. Standard VC-ready structure for fundraising.",
            }}
          />
          <StatusRow
            item={{
              label: "Live financial data integration (Financial Modeling Prep)",
              status: "not_yet",
              detail:
                "Integration code is in place (FMP /stable API, ratio computation, sector mapping). Live data not yet serving — the daily enrichment script accumulates real fundamentals as FMP quota allows, then replaces the seed.",
            }}
          />
          <StatusRow
            item={{
              label: "Paid subscription tiers live",
              status: "not_yet",
              detail:
                "Free tier only. Paid tiers are gated on a real Shariah Supervisory Board being seated first.",
            }}
          />
        </ul>
      </section>

      {/* WHO WE ARE */}
      <section className="mt-20 border-t border-gray-200 pt-10">
        <SectionHead title="Who we are" />
        <div className="mt-5 max-w-2xl space-y-3 text-[14px] leading-relaxed text-gray-700">
          <p>
            HalalGauge is built today by{" "}
            <strong className="text-gray-900">Gordon Louie</strong> — a Hong&nbsp;Kong-based
            technologist, solo founder. A Muslim friend got me thinking about why existing
            halal-investing apps hide scholarly disagreement instead of surfacing it; that
            curiosity is the origin of the project.
          </p>
          <p>
            Gordon is <strong className="text-gray-900">not Muslim</strong>. The product
            makes no religious claims of its own — it surfaces what scholars publicly say
            and cites the source. Religious authority belongs to the published scholars and,
            in time, to a Shariah Supervisory Board that does not yet exist. Until that
            board is seated, the citation chain on{" "}
            <Link
              href="/methodology"
              className="text-navy-700 underline hover:text-navy-900"
            >
              /methodology
            </Link>{" "}
            is the credibility. Full origin story on{" "}
            <Link href="/about" className="text-navy-700 underline hover:text-navy-900">
              /about
            </Link>.
          </p>
        </div>
      </section>

      {/* METHODOLOGY SOURCES */}
      <section className="mt-20 border-t border-gray-200 pt-10">
        <SectionHead title="Where the screening rules come from" />
        <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-gray-700">
          Every threshold in the engine traces back to a public primary source. If you find
          a mismatch between a HalalGauge profile and the cited source, write to{" "}
          <a
            href="mailto:methodology@halalgauge.com"
            className="text-navy-700 underline hover:text-navy-900"
          >
            methodology@halalgauge.com
          </a>{" "}
          and we&apos;ll publish a correction.
        </p>

        <ul className="mt-6 divide-y divide-gray-100 border-y border-gray-200">
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
      </section>

      {/* DATA SOURCES */}
      <section className="mt-20 border-t border-gray-200 pt-10">
        <SectionHead title="Where the data comes from" />
        <ul className="mt-5 max-w-2xl space-y-3 text-[14px] leading-relaxed text-gray-700">
          <li>
            <strong className="text-gray-900">Current (May 2026):</strong> 163 representative
            tickers hand-seeded from Q1 2026 public filings. The FMP live-data integration
            is wired (balance sheets, income statements, ratios) but not yet serving —
            enrichment runs are gated by free-tier daily quotas, so real data accumulates
            in batches. Ratios are computed in-house from raw filings; nothing relies on
            any third-party &lsquo;halal score.&rsquo;
          </li>
          <li>
            <strong className="text-gray-900">Year 1 production:</strong> Financial Modeling
            Prep API for live fundamentals across any listed equity. Refresh cadence: nightly.
          </li>
          <li>
            <strong className="text-gray-900">Year 2 production:</strong> Graduate to
            Refinitiv / SIX Financial for broader international coverage at scale.
          </li>
          <li>
            <strong className="text-gray-900">Ratios computed in-house</strong> from
            balance-sheet primitives. HalalGauge does not rely on any third party&apos;s
            pre-computed &lsquo;halal score&rsquo;.
          </li>
        </ul>
      </section>

      {/* PRIVACY */}
      <section className="mt-20 border-t border-gray-200 pt-10">
        <SectionHead title="Privacy posture" />
        <ul className="mt-5 max-w-2xl space-y-3 text-[14px] leading-relaxed text-gray-700">
          <li>
            <strong className="text-gray-900">No account required</strong> to use the
            screener, watchlist, portfolio scorer, or any tool.
          </li>
          <li>
            <strong className="text-gray-900">No tracking analytics on the current site.</strong>{" "}
            When usage analytics are added (Q3, Plausible or similar), they will be
            cookie-less and IP-anonymised.
          </li>
          <li>
            <strong className="text-gray-900">Watchlist, portfolio, custom scholar profile</strong>{" "}
            stored locally in your browser only. Nothing leaves your device.
          </li>
          <li>
            <strong className="text-gray-900">No data sold, ever.</strong> See{" "}
            <Link href="/privacy" className="text-navy-700 underline hover:text-navy-900">
              /privacy
            </Link>{" "}
            for the formal policy.
          </li>
        </ul>
      </section>

      {/* INTENTIONAL GAPS */}
      <section className="mt-20 border-t border-gray-200 pt-10">
        <SectionHead title="What's intentionally missing right now" />
        <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-gray-700">
          Honest disclosure of what doesn&apos;t yet exist, so testers know which gaps are
          intentional and which are bugs:
        </p>
        <ul className="mt-5 max-w-2xl space-y-2 text-[14px] leading-relaxed text-gray-700">
          <li>
            <span className="text-gray-400">·</span>{" "}
            <strong className="text-gray-900">Mobile native app</strong> — web works on
            mobile; native iOS/Android is Q4.
          </li>
          <li>
            <span className="text-gray-400">·</span>{" "}
            <strong className="text-gray-900">Brokerage account sync (Plaid)</strong> —
            manual portfolio entry only for now.
          </li>
          <li>
            <span className="text-gray-400">·</span>{" "}
            <strong className="text-gray-900">Real-time prices</strong> — current prices are
            indicative; live tick data is post-FMP integration.
          </li>
          <li>
            <span className="text-gray-400">·</span>{" "}
            <strong className="text-gray-900">Push notifications</strong> — verdict-change
            alerts depend on mobile + backend, both Q4.
          </li>
          <li>
            <span className="text-gray-400">·</span>{" "}
            <strong className="text-gray-900">Live FMP data serving production</strong>{" "}
            — integration code is in place; real fundamentals replace the seed as the
            daily enrichment script runs against FMP&apos;s free tier (paid plan would
            ship it all at once).
          </li>
        </ul>
        <p className="mt-5 text-[12px] italic text-gray-500">
          Found something broken that&apos;s NOT on this list? Use the feedback button
          (bottom-right on every page) or email{" "}
          <a href="mailto:hello@halalgauge.com" className="text-navy-700 underline hover:text-navy-900">
            hello@halalgauge.com
          </a>.
        </p>
      </section>

      {/* REACH THE FOUNDER */}
      <section className="mt-20 border-t border-gray-200 pt-10">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-navy-700">
          Reach Gordon
        </div>
        <h2
          className="mt-2 text-[24px] font-bold leading-tight text-gray-900 sm:text-[28px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          The founder reads every substantive email
        </h2>
        <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-gray-700">
          No support tickets, no auto-responses, no chatbot deflecting you. Hit{" "}
          <a href="mailto:hello@halalgauge.com" className="text-navy-700 underline hover:text-navy-900">
            hello@halalgauge.com
          </a>{" "}
          and a person responds. Methodology challenges go to{" "}
          <a href="mailto:methodology@halalgauge.com" className="text-navy-700 underline hover:text-navy-900">
            methodology@halalgauge.com
          </a>{" "}
          and are reviewed against the cited primary source — and against the Supervisory
          Board, once one is seated.
        </p>
      </section>

      <p className="mt-16 text-center text-[11px] text-gray-500">
        Last updated 22 May 2026. Page version 1.{" "}
        <Link href="/" className="text-navy-700 underline hover:text-navy-900">
          Back to home
        </Link>.
      </p>
    </div>
  );
}

function SectionHead({ title }: { title: string }) {
  return (
    <h2
      className="text-[24px] font-bold leading-tight text-gray-900 sm:text-[28px]"
      style={{ fontFamily: "var(--font-display)" }}
    >
      {title}
    </h2>
  );
}

function StatusRow({ item }: { item: Item }) {
  const icon =
    item.status === "done" ? <CheckCircle2 size={16} className="text-emerald-600" />
      : item.status === "in_progress" ? <Clock size={16} className="text-amber-600" />
        : <AlertCircle size={16} className="text-gray-400" />;
  const tone =
    item.status === "done" ? "bg-emerald-50 text-emerald-700"
      : item.status === "in_progress" ? "bg-amber-50 text-amber-700"
        : "bg-gray-100 text-gray-600";
  const label =
    item.status === "done" ? "Done"
      : item.status === "in_progress" ? "In progress"
        : "Not yet";
  return (
    <li className="grid grid-cols-[24px_1fr_auto] items-start gap-x-4 gap-y-1 py-5">
      <div className="pt-0.5">{icon}</div>
      <div>
        <div className="text-[14px] font-semibold text-gray-900">{item.label}</div>
        {item.detail && (
          <div className="mt-1 text-[12px] leading-relaxed text-gray-600">{item.detail}</div>
        )}
      </div>
      <span
        className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${tone}`}
      >
        {label}
      </span>
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
    <li className="py-4">
      <div className="text-[14px] font-semibold text-gray-900">{scholar}</div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 inline-flex items-start gap-1.5 text-[13px] text-navy-700 hover:text-navy-900 hover:underline"
      >
        <span>{source}</span> <ExternalLink size={11} className="mt-1 flex-shrink-0" />
      </a>
      <div className="mt-1 text-[12px] leading-relaxed text-gray-600">{cites}</div>
    </li>
  );
}
