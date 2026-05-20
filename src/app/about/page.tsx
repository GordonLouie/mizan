import Link from "next/link";

export const metadata = { title: "About · Mizan" };

export default function AboutPage() {
  return (
    <article className="prose prose-slate mx-auto max-w-3xl">
      <div className="not-prose mb-3 inline-block rounded-full bg-navy-50 px-3 py-1 text-xs font-medium text-navy-800">
        About Mizan
      </div>
      <h1 className="text-3xl font-bold text-gray-900">
        We respect users enough to show our work.
      </h1>
      <p className="mt-4 text-sm leading-7 text-gray-700">
        Two billion Muslims globally, fifty million in Western diaspora — and every
        halal-investing app on the market screens them all against the same scholarly
        standard. That is not how Islamic jurisprudence works. Mufti Taqi Usmani has
        stricter rules than AAOIFI. Strict scholars hold zero-tolerance views. Ja&apos;fari
        Shia operate under a different framework altogether. Mizan exists to close
        that gap, transparently.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">What we believe</h2>
      <p className="mt-3 text-sm leading-7 text-gray-700">
        Shariah compliance is a spectrum, not a binary. The right verdict on any given
        stock depends on the methodology the user follows — not on which app they
        downloaded. Black-box scores betray the audience we&apos;re building for; we
        show the underlying ratios, the exact thresholds, and the source for every
        ruling we represent.
      </p>
      <p className="mt-3 text-sm leading-7 text-gray-700">
        Credibility precedes code. Our Shariah Supervisory Board reviews every
        methodology before release, audits AI scholar Q&A outputs each quarter, and
        co-signs an annual public Shariah report.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">Founder</h2>
      <div className="not-prose mt-3 rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-navy-800 text-2xl font-bold text-gold-500" style={{ fontFamily: "Georgia, serif" }}>
            jk
          </div>
          <div>
            <div className="text-base font-semibold text-gray-900">jk</div>
            <div className="text-xs uppercase tracking-wide text-gray-500">Founder &amp; CEO  ·  Hong Kong</div>
            <p className="mt-2 text-sm leading-7 text-gray-700">
              jk is the founder of Mizan. The product began with the observation that
              every Muslim friend and family member around him used the same halal
              investing apps but followed different scholars — and received the same
              flat verdict. Hong Kong base, Cayman holdco. Builds with shipping bias.
            </p>
          </div>
        </div>
      </div>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">Shariah Supervisory Board</h2>
      <p className="mt-3 text-sm leading-7 text-gray-700">
        Mizan&apos;s board reviews every methodology in the product, meets quarterly,
        and provides ongoing supervision of the screening engine and AI Q&A scope.
        We will publish each board member&apos;s name only after written engagement
        is in place.
      </p>

      <div className="not-prose mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { role: "Chair", target: "Mufti Faraz Adam (target)", note: "UK · Hanafi · Amanah Advisors" },
          { role: "Member", target: "Sheikh Joe Bradford (target)", note: "US · Hanbali/Maliki · AAOIFI-certified" },
          { role: "Member", target: "Ja'fari scholar (target)", note: "Al-Mahdi Institute UK" },
        ].map((m) => (
          <div key={m.role} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-gold-600">{m.role}</div>
            <div className="mt-1 text-sm font-semibold text-gray-900">{m.target}</div>
            <div className="mt-1 text-xs text-gray-600">{m.note}</div>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">Company</h2>
      <ul className="ml-5 mt-3 list-disc text-sm leading-7 text-gray-700">
        <li>Founded 2026 in Hong Kong.</li>
        <li>Operating entity: Mizan Operations (HK) Limited.</li>
        <li>Holding company: Mizan Holdings Ltd, Cayman Islands.</li>
        <li>Currently in the Cyberport Incubation Programme.</li>
        <li>Backed by [pre-seed investors named on close].</li>
      </ul>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">Get in touch</h2>
      <ul className="ml-5 mt-3 list-disc text-sm leading-7 text-gray-700">
        <li>General: <a href="mailto:hello@mizan.app" className="text-navy-700 underline">hello@mizan.app</a></li>
        <li>Press: <a href="mailto:press@mizan.app" className="text-navy-700 underline">press@mizan.app</a></li>
        <li>Investors: <a href="mailto:investors@mizan.app" className="text-navy-700 underline">investors@mizan.app</a></li>
        <li>Privacy / data: <a href="mailto:privacy@mizan.app" className="text-navy-700 underline">privacy@mizan.app</a></li>
        <li>Methodology challenge or correction: <a href="mailto:methodology@mizan.app" className="text-navy-700 underline">methodology@mizan.app</a></li>
      </ul>

      <p className="mt-12 text-xs text-gray-500">
        <Link href="/" className="text-navy-700 underline">Back to home.</Link>
      </p>
    </article>
  );
}
