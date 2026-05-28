export const metadata = { title: "Privacy Policy · Mizan" };

export default function PrivacyPage() {
  return (
    <article className="prose prose-slate mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
      <p className="text-sm text-gray-500">Effective: 18 May 2026</p>

      <h2 className="mt-6 text-xl font-semibold text-gray-900">1. What we collect</h2>
      <ul className="ml-5 mt-2 list-disc text-sm leading-6 text-gray-700">
        <li>Account data: email, name, country, your chosen scholar profile, subscription plan.</li>
        <li>Usage data: which tickers you screen, when, and from which device. Used to improve the product.</li>
        <li>If you link a brokerage via Plaid or similar: read-only holdings data (tickers and weights), retained only as long as you keep the connection active.</li>
        <li>Payment information: handled by Stripe / RevenueCat; we never see your full card number.</li>
      </ul>

      <h2 className="mt-6 text-xl font-semibold text-gray-900">2. What we do not collect</h2>
      <p className="mt-2 text-sm leading-6 text-gray-700">
        We do not collect your prayer schedule, attendance, sect-of-Islam selection
        beyond your scholar profile preference, ethnicity, or religious-affiliation
        beyond what is implicit in the choice to use a halal-investing product.
      </p>

      <h2 className="mt-6 text-xl font-semibold text-gray-900">3. How we use it</h2>
      <ul className="ml-5 mt-2 list-disc text-sm leading-6 text-gray-700">
        <li>To deliver the screening and portfolio features you request.</li>
        <li>To send transactional emails (billing, alerts you opted into).</li>
        <li>In aggregate, to understand which scholar profiles are most-used and improve methodology coverage.</li>
        <li>Never to sell or share with advertisers.</li>
      </ul>

      <h2 className="mt-6 text-xl font-semibold text-gray-900">4. AI scholar Q&A</h2>
      <p className="mt-2 text-sm leading-6 text-gray-700">
        Questions you submit to the AI scholar Q&A feature are processed by our
        backend and the underlying LLM provider (Anthropic). We do not include
        personally identifying information in those prompts. We retain anonymized
        Q&A pairs for up to 90 days for quality review by the Shariah Supervisory
        Board.
      </p>

      <h2 className="mt-6 text-xl font-semibold text-gray-900">5. Third parties</h2>
      <p className="mt-2 text-sm leading-6 text-gray-700">
        Service providers we use: Stripe (billing), Plaid / TrueLayer (brokerage
        linking), Anthropic (AI), Vercel (hosting), Postgres on Fly.io (database),
        PostHog (analytics), Plain (support).
      </p>

      <h2 className="mt-6 text-xl font-semibold text-gray-900">6. Your rights</h2>
      <p className="mt-2 text-sm leading-6 text-gray-700">
        You can export or delete your data at any time from your account page. We
        comply with applicable data-protection law in the jurisdictions we operate
        in, including GDPR (EU/UK), PDPO (Hong Kong), and CCPA (California).
      </p>

      <h2 className="mt-6 text-xl font-semibold text-gray-900">7. Contact</h2>
      <p className="mt-2 text-sm leading-6 text-gray-700">
        Data Protection Officer: <a href="mailto:privacy@mizaninvesting.com" className="text-navy-700 underline">privacy@mizaninvesting.com</a>.
      </p>
    </article>
  );
}
