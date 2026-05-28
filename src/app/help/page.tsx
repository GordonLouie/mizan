"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface FAQ { q: string; a: React.ReactNode }

const SECTIONS: { title: string; faqs: FAQ[] }[] = [
  {
    title: "Getting started",
    faqs: [
      {
        q: "I just signed up. What should I do first?",
        a: <>Pick your scholar in the Scholar Picker. The verdict you see for any stock depends on which scholar&apos;s methodology Mizan applies. If you don&apos;t know which to pick, start with AAOIFI (the most-followed mainstream standard) and explore the others from there.</>,
      },
      {
        q: "How does the screener work?",
        a: <>Enter a stock ticker. Mizan runs the ticker through two screens: a sector check (is the primary business permissible?) and a financial-ratio check (do the numbers fall within your scholar&apos;s thresholds?). Both must pass for the stock to receive a PASS verdict. We show the ratio breakdown so you can see exactly why the verdict came out the way it did.</>,
      },
      {
        q: "Which scholars do you ship with?",
        a: <>Six profiles: AAOIFI (Gulf default), Mufti Taqi Usmani (stricter Hanafi), Dow Jones Islamic Market, Ja&apos;fari (Sistani-aligned), strict zero-tolerance, and a Custom builder where you set your own thresholds.</>,
      },
      {
        q: "What if my scholar isn't in your list?",
        a: <>Use the Custom profile to match your scholar&apos;s thresholds, or write to us at <a href="mailto:methodology@mizaninvesting.com" className="text-navy-700 underline">methodology@mizaninvesting.com</a> with their published ruling and we&apos;ll evaluate adding their profile.</>,
      },
    ],
  },
  {
    title: "About the verdicts",
    faqs: [
      {
        q: "Why does the same stock get different verdicts under different scholars?",
        a: <>Because different scholars apply different thresholds. Mufti Taqi Usmani, for example, requires illiquid assets to be at least 20% of total assets — a rule AAOIFI doesn&apos;t include. Tesla passes both; Amazon passes AAOIFI but fails Mufti Taqi. Same stock, different verdict. This is normal in Islamic jurisprudence.</>,
      },
      {
        q: "Is the verdict a fatwa?",
        a: <>No. The verdict is a scholarly opinion based on the published methodology of the selected scholar. It is not a personalized fatwa, not a certification, and not investment advice. For high-stakes decisions, consult a qualified scholar directly about your specific situation.</>,
      },
      {
        q: "How fresh is the data?",
        a: <>Stock fundamentals refresh nightly. When a company files a 10-K or 10-Q, we re-screen affected positions within 4 hours. Pro-tier users with portfolio sync get push notifications when a verdict in their portfolio changes.</>,
      },
      {
        q: "What does &quot;borderline&quot; mean?",
        a: <>A stock passes the sector screen and most ratio checks, but fails exactly one ratio. It&apos;s a useful middle category for stocks worth watching even if you don&apos;t buy them today — for example, a company whose impure income just nudges over 5% may come back into compliance after a single quarter.</>,
      },
    ],
  },
  {
    title: "Portfolio and purification",
    faqs: [
      {
        q: "How does brokerage sync work?",
        a: <>We use Plaid (US) and TrueLayer (UK/EU) — the same secure read-only connectivity used by every major fintech. We can see your holdings and weights; we cannot see your full account number or initiate trades.</>,
      },
      {
        q: "What is purification?",
        a: <>Purification is the practice of donating the impermissible portion of dividend income (and, under stricter scholars, realized capital gains) to charity without expecting reward. Mizan calculates this automatically per holding, then offers a one-tap donation flow to vetted charities.</>,
      },
      {
        q: "Do I need to purify capital gains?",
        a: <>It depends on your scholar. Under AAOIFI and DJIM: no, dividends only. Under Mufti Taqi Usmani and Ja&apos;fari: yes, both dividends and gains. Mizan automatically applies the right scope for your selected scholar.</>,
      },
    ],
  },
  {
    title: "Pricing and billing",
    faqs: [
      {
        q: "How much does it cost?",
        a: <>Free tier: 5 screens/day, AAOIFI default. Plus: $7.99/mo, unlimited screens, all scholars, AI Q&A. Pro: $14.99/mo, adds portfolio sync and purification automation. Family and Masjid plans available.</>,
      },
      {
        q: "Can I cancel anytime?",
        a: <>Yes, from your account page. Cancellation takes effect at the end of the current billing period; we don&apos;t prorate refunds.</>,
      },
      {
        q: "Do you offer student / hardship discounts?",
        a: <>Yes. Email <a href="mailto:hello@mizaninvesting.com" className="text-navy-700 underline">hello@mizaninvesting.com</a> with proof of student status, recent zakat eligibility, or similar — we&apos;ll set you up for Pro at no charge.</>,
      },
    ],
  },
  {
    title: "Privacy and security",
    faqs: [
      {
        q: "Do you sell my data?",
        a: <>No. We&apos;re a paid product, not an ad-supported product. We don&apos;t sell user data to advertisers, data brokers, or any third party. See our <a href="/privacy" className="text-navy-700 underline">privacy policy</a> for the full picture.</>,
      },
      {
        q: "Where is my data stored?",
        a: <>Postgres database hosted on Fly.io, primary region SIN (Singapore) for users in Asia/MENA, IAD (US East) for Americas. AI Q&A queries are processed by Anthropic Claude with no personally-identifying information in the prompt body.</>,
      },
      {
        q: "Can I delete my account?",
        a: <>Yes, from your account settings. We delete your account record within 7 days and any logs within 30 days. Some aggregated, fully-anonymized usage metrics may persist indefinitely.</>,
      },
    ],
  },
  {
    title: "Scholarly questions",
    faqs: [
      {
        q: "I think Mizan implements [scholar's] methodology wrong.",
        a: <>Tell us, please. We update with citation. Write to <a href="mailto:methodology@mizaninvesting.com" className="text-navy-700 underline">methodology@mizaninvesting.com</a> with the specific scholar, the specific ruling, and the published source. Every note is reviewed against the cited primary source and a public changelog entry is added if a profile changes.</>,
      },
      {
        q: "Does Mizan have a Shariah board?",
        a: <>Not yet. Until one is engaged, credibility comes from the primary-source citations on <a href="/methodology" className="text-navy-700 underline">/methodology</a>. The honest scoreboard of what is and isn&apos;t in place lives on <a href="/trust" className="text-navy-700 underline">/trust</a>.</>,
      },
      {
        q: "What about crypto? Is BTC halal?",
        a: <>The scholarly debate is genuinely unresolved: some scholars accept Bitcoin and asset-backed tokens, most flag yield-bearing DeFi as riba. Our <a href="/crypto" className="text-navy-700 underline">/crypto</a> page summarises what every scholar has publicly said, with sources you can verify.</>,
      },
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="inline-block rounded-full bg-navy-50 px-3 py-1 text-xs font-medium text-navy-800">
          Help center
        </div>
        <h1 className="mt-3 text-3xl font-bold text-gray-900">How can we help?</h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-600">
          Common questions, real answers. If yours isn&apos;t here, email{" "}
          <a href="mailto:hello@mizaninvesting.com" className="text-navy-700 underline">hello@mizaninvesting.com</a>{" "}
          — we read every one and respond within 48 hours.
        </p>
      </div>

      <div className="space-y-8">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
            <div className="mt-3 divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
              {section.faqs.map((faq, i) => (
                <Item key={i} faq={faq} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function Item({ faq }: { faq: FAQ }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      className="w-full px-4 py-3 text-left"
    >
      <div className="flex items-start gap-3">
        {open ? <ChevronDown size={16} className="mt-0.5 flex-shrink-0 text-gray-400" /> : <ChevronRight size={16} className="mt-0.5 flex-shrink-0 text-gray-400" />}
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-900">{faq.q}</div>
          {open && <div className="mt-2 text-sm leading-7 text-gray-700">{faq.a}</div>}
        </div>
      </div>
    </button>
  );
}
