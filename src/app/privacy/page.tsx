export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <article className="prose prose-slate mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
      <p className="text-sm text-gray-500">Effective: 18 June 2026. This is a plain-language summary, not legal advice; it will be reviewed by counsel before general launch.</p>

      <h2 className="mt-6 text-xl font-semibold text-gray-900">1. What we collect</h2>
      <ul className="ml-5 mt-2 list-disc text-sm leading-6 text-gray-700">
        <li>Account data: your email and basic profile, handled by our authentication provider (Clerk) when you sign in.</li>
        <li>Subscription status: which plan you&apos;re on (free / Pro / institutional), stored against your email.</li>
        <li>Usage data: anonymous/aggregate analytics (e.g. which pages and features are used) to improve the product.</li>
        <li>Payment information: handled entirely by Stripe — we never see or store your card number.</li>
      </ul>

      <h2 className="mt-6 text-xl font-semibold text-gray-900">2. What stays on your device</h2>
      <p className="mt-2 text-sm leading-6 text-gray-700">
        Your portfolio, watchlist, and chosen scholar profile are stored locally in
        your browser — not on our servers. We don&apos;t collect your holdings.
      </p>

      <h2 className="mt-6 text-xl font-semibold text-gray-900">3. What we do not collect</h2>
      <p className="mt-2 text-sm leading-6 text-gray-700">
        We do not collect your prayer schedule, attendance, sect selection beyond a
        scholar-profile preference, ethnicity, or any religious-affiliation data beyond
        what is implicit in choosing to use a halal-investing product. We never sell
        your data or share it with advertisers.
      </p>

      <h2 className="mt-6 text-xl font-semibold text-gray-900">4. AI features</h2>
      <p className="mt-2 text-sm leading-6 text-gray-700">
        Questions and screening inputs sent to our AI features are processed by our
        backend and the underlying LLM provider (Anthropic) to generate a response.
        We do not include personally identifying information in those prompts. AI
        output is informational commentary, not a religious ruling.
      </p>

      <h2 className="mt-6 text-xl font-semibold text-gray-900">5. Service providers</h2>
      <p className="mt-2 text-sm leading-6 text-gray-700">
        We rely on: <strong>Clerk</strong> (authentication), <strong>Stripe</strong> (payments),
        <strong> Anthropic</strong> (AI), <strong>Vercel</strong> (hosting &amp; analytics),
        <strong> Upstash</strong> (key-value storage for subscription status), and
        <strong> Resend</strong> (transactional email). Each processes only what it needs to provide its service.
      </p>

      <h2 className="mt-6 text-xl font-semibold text-gray-900">6. Your rights</h2>
      <p className="mt-2 text-sm leading-6 text-gray-700">
        You can sign out and delete your account from the account page (via Clerk). To
        request export or deletion of any data we hold, email us. We intend to comply
        with applicable data-protection law in the jurisdictions we operate in, including
        GDPR (EU/UK), PDPO (Hong Kong), and CCPA (California).
      </p>

      <h2 className="mt-6 text-xl font-semibold text-gray-900">7. Contact</h2>
      <p className="mt-2 text-sm leading-6 text-gray-700">
        Questions: <a href="mailto:privacy@halalgauge.com" className="text-navy-700 underline">privacy@halalgauge.com</a>.
      </p>
    </article>
  );
}
