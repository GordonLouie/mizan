export const metadata = { title: "Terms of Use · HalalGauge" };

export default function TermsPage() {
  return (
    <article className="prose prose-slate mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900">Terms of Use</h1>
      <p className="text-sm text-gray-500">Effective: 18 May 2026</p>

      <h2 className="mt-6 text-xl font-semibold text-gray-900">1. Nature of the service</h2>
      <p className="mt-2 text-sm leading-6 text-gray-700">
        HalalGauge is an informational research tool. It provides scholarly opinions on
        the Shariah-compliance status of publicly-listed securities, computed against
        screening methodologies attributed to named scholars and standards bodies.
        HalalGauge does <strong>not</strong> provide investment advice, financial planning,
        portfolio management, or recommendations to buy, sell, or hold any security.
        Compliance verdicts displayed by HalalGauge are scholarly opinions, not certifications
        or guarantees.
      </p>

      <h2 className="mt-6 text-xl font-semibold text-gray-900">2. No advisory relationship</h2>
      <p className="mt-2 text-sm leading-6 text-gray-700">
        Using HalalGauge does not create an advisory, fiduciary, or solicitor relationship
        between you and HalalGauge or any of its affiliates. You should consult a licensed
        financial advisor and a qualified Islamic scholar before making investment
        decisions.
      </p>

      <h2 className="mt-6 text-xl font-semibold text-gray-900">3. Acceptable use</h2>
      <p className="mt-2 text-sm leading-6 text-gray-700">
        You agree not to use HalalGauge to: (i) violate any applicable law or regulation;
        (ii) infringe the intellectual property rights of any party; (iii) attempt
        to reverse engineer, scrape, or extract bulk data from the service; or
        (iv) misrepresent your identity or affiliation.
      </p>

      <h2 className="mt-6 text-xl font-semibold text-gray-900">4. Subscriptions and billing</h2>
      <p className="mt-2 text-sm leading-6 text-gray-700">
        Paid plans renew automatically until cancelled. You may cancel at any time
        from your account page; cancellations take effect at the end of the current
        billing period. We do not provide refunds for partial periods except as
        required by applicable consumer protection law.
      </p>

      <h2 className="mt-6 text-xl font-semibold text-gray-900">5. Disclaimers</h2>
      <p className="mt-2 text-sm leading-6 text-gray-700">
        HalalGauge is provided on an &quot;as is&quot; and &quot;as available&quot; basis.
        Financial data is sourced from third-party providers and may contain inaccuracies
        or delays. Scholarly profiles reflect a good-faith implementation of published
        rulings; users should verify against the original scholarly sources for
        material decisions.
      </p>

      <h2 className="mt-6 text-xl font-semibold text-gray-900">6. Limitation of liability</h2>
      <p className="mt-2 text-sm leading-6 text-gray-700">
        To the maximum extent permitted by law, HalalGauge, its officers, directors,
        employees, and affiliates shall not be liable for any indirect, incidental,
        special, consequential, or punitive damages arising out of your use of the
        service.
      </p>

      <h2 className="mt-6 text-xl font-semibold text-gray-900">7. Governing law</h2>
      <p className="mt-2 text-sm leading-6 text-gray-700">
        These Terms shall be governed by the laws of the Hong Kong Special Administrative
        Region. Any dispute shall be resolved by binding arbitration administered by the
        Hong Kong International Arbitration Centre.
      </p>

      <h2 className="mt-6 text-xl font-semibold text-gray-900">8. Contact</h2>
      <p className="mt-2 text-sm leading-6 text-gray-700">
        Questions: <a href="mailto:legal@mizaninvesting.com" className="text-navy-700 underline">legal@mizaninvesting.com</a>.
      </p>
    </article>
  );
}
