/**
 * /crypto/[slug] — programmatic SEO page, one per cryptoasset.
 *
 * Server-rendered, statically-generated "Is {Coin} halal?" page showing each
 * scholar's published view side by side. Targets very high-volume queries like
 * "is bitcoin halal" / "is ethereum halal" that the single /crypto list page
 * can't rank for individually.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, XCircle, AlertCircle, HelpCircle } from "lucide-react";
import {
  CRYPTO_ASSETS,
  VERDICT_LABEL_CRYPTO,
  VERDICT_TONE_CRYPTO,
  type CryptoAsset,
  type CryptoVerdict,
} from "@/lib/crypto";

const SITE = "https://mizaninvesting.com";

const slugOf = (a: CryptoAsset) => a.symbol.toLowerCase();
function find(slug: string): CryptoAsset | undefined {
  const s = slug.toLowerCase();
  return CRYPTO_ASSETS.find((a) => slugOf(a) === s);
}

export function generateStaticParams() {
  return CRYPTO_ASSETS.map((a) => ({ slug: slugOf(a) }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = find(slug);
  if (!a) return { title: "Cryptoasset not found — Mizan" };
  const title = `Is ${a.name} (${a.symbol}) halal? — Mizan`;
  const description = `${a.blunt} See what Mufti Taqi Usmani, Mufti Faraz Adam, AAOIFI and others say about ${a.name}, side by side. Free, no signup.`;
  const url = `${SITE}/crypto/${slugOf(a)}`;
  return {
    title, description, alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "Mizan", type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

function ToneIcon({ v }: { v: CryptoVerdict }) {
  const t = VERDICT_TONE_CRYPTO[v];
  if (t === "pass") return <CheckCircle2 size={18} className="text-emerald-600" />;
  if (t === "warn") return <AlertCircle size={18} className="text-amber-600" />;
  if (t === "fail") return <XCircle size={18} className="text-rose-600" />;
  return <HelpCircle size={18} className="text-gray-400" />;
}
function toneChip(v: CryptoVerdict): string {
  const t = VERDICT_TONE_CRYPTO[v];
  return t === "pass" ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : t === "warn" ? "bg-amber-50 text-amber-700 border-amber-200"
      : t === "fail" ? "bg-rose-50 text-rose-700 border-rose-200"
        : "bg-gray-50 text-gray-600 border-gray-200";
}

export default async function CryptoSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = find(slug);
  if (!a) notFound();

  const others = CRYPTO_ASSETS.filter((x) => x.symbol !== a.symbol).slice(0, 8);

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Is ${a.name} (${a.symbol}) halal?`,
        acceptedAnswer: { "@type": "Answer", text: a.blunt },
      },
      ...a.takes.slice(0, 2).map((t) => ({
        "@type": "Question",
        name: `Is ${a.name} halal according to ${t.scholar}?`,
        acceptedAnswer: { "@type": "Answer", text: `${VERDICT_LABEL_CRYPTO[t.verdict]}. ${t.summary}` },
      })),
    ],
  };
  const breadcrumb = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Crypto compliance", item: `${SITE}/crypto` },
      { "@type": "ListItem", position: 2, name: `Is ${a.name} halal?`, item: `${SITE}/crypto/${slugOf(a)}` },
    ],
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
        {a.symbol} · Crypto
      </div>
      <h1 className="mt-2 text-[28px] font-bold leading-tight text-gray-900 sm:text-[34px]" style={{ fontFamily: "var(--font-display)" }}>
        Is {a.name} ({a.symbol}) halal?
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-gray-700">{a.blunt}</p>
      <p className="mt-2 text-[13px] leading-relaxed text-gray-500">{a.what}</p>

      {/* Per-scholar takes */}
      <section className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
          {a.name} — what each scholar says
        </div>
        <ul>
          {a.takes.map((t, i) => (
            <li key={i} className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4 last:border-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <ToneIcon v={t.verdict} />
                  <span className="font-semibold text-gray-900">{t.scholar}</span>
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-gray-600">{t.summary}</p>
                {t.source && (
                  <a href={t.source} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-[12px] text-navy-700 underline hover:text-navy-900">
                    Source
                  </a>
                )}
              </div>
              <span className={"shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold " + toneChip(t.verdict)}>
                {VERDICT_LABEL_CRYPTO[t.verdict]}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 flex flex-wrap gap-3">
        <Link href="/crypto" className="inline-flex items-center gap-1.5 rounded-md bg-navy-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-900">
          All crypto verdicts <ArrowRight size={14} />
        </Link>
        <Link href="/methodology" className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-gray-400">
          How the rulings are sourced <ArrowRight size={14} />
        </Link>
      </section>

      <section className="mt-8">
        <h2 className="text-[14px] font-semibold text-gray-900">Other cryptoassets</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {others.map((x) => (
            <Link key={x.symbol} href={`/crypto/${slugOf(x)}`}
              className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[13px] text-gray-700 transition hover:border-gray-400">
              Is {x.name} halal?
            </Link>
          ))}
        </div>
      </section>

      <p className="mt-8 text-[11px] leading-relaxed text-gray-400">
        Mizan surfaces published scholarly views with sourcing; it does not issue fatwa. Crypto
        rulings are evolving and contested — verify with a scholar you trust before acting.
      </p>
    </main>
  );
}
