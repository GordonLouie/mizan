# Cyberport Incubation Programme — application draft

**Why this is the #1 non-dilutive priority.**

HKD 500,000 (~USD 64K) in cash funding + free office space at Cyberport + ecosystem access. Non-dilutive (no equity given up). For an HK-based fintech founder, this is the easiest large grant in the world to apply for.

**Eligibility (you qualify):**
- HK-incorporated company (Mizan Operations HK Ltd, day 1).
- Less than 7 years in operation.
- Technology-related business (fintech / SaaS / AI).

**Application portal:** https://www.cyberport.hk/en/about_cyberport/cyberport_entrepreneurs/cyberport_incubation_programme

**Stages:**
1. Online application (this document — 2 hours to complete).
2. Initial screening (Cyberport reviews).
3. Pitch presentation (you present in person at Cyberport, 15 minutes + 15 Q&A).
4. Decision (typically 6–8 weeks total).

---

## SECTION A — Company information

**Company name (legal):** Mizan Operations (HK) Limited
**Brand name:** Mizan
**Date of incorporation:** [TBD — populate after HK registration]
**Business Registration No.:** [TBD]
**Website:** mizan.app
**Office address:** [TBD — list Cyberport address once accepted; before that, registered office only]

**Industry:** FinTech / Software-as-a-Service / Religious-finance-tech

---

## SECTION B — Founder

**Founder:** jk
**Role:** Founder and CEO
**Background:** [populate — your background, education, prior work]
**Email:** jk@mizan.app
**Phone:** [populate]

**Why this founder, this company:** A first-generation founder approaching halal fintech as a software-engineering problem. The thesis — that scholarly diversity is a feature, not a bug — comes from direct observation of friends and family who follow different scholars and currently use the same one-standard apps.

---

## SECTION C — Business overview

**What does the company do?**

Mizan is a stock screening and halal investing platform that adapts to the user's scholar. Every existing halal-investing app screens against one scholarly standard (typically AAOIFI). Mizan ships with six profiles: AAOIFI, Mufti Taqi Usmani (stricter Hanafi), Dow Jones Islamic Market, Ja'fari (Sistani-aligned), strict zero-tolerance, and a user-customizable profile. The user picks their scholar; Mizan recalibrates every verdict transparently.

**Target customer:**

Phase 1 wedge: 5 million South Asian Hanafi diaspora Muslim investors in the US, UK, and Canada who follow (or respect) Mufti Taqi Usmani's published rulings. His illiquid-asset rule is implemented by no major app — surfacing it is Mizan's differentiator.

**Revenue model:**

B2C SaaS subscription. Free tier (5 screens/day), Plus ($7.99/mo), Pro ($14.99/mo with portfolio sync and purification automation), Family ($19.99/mo for 4 seats), and Masjid ($4.99/seat min 10).

**Stage:**

Working prototype shipping with multi-scholar engine, sample dataset, and 39/39 passing unit tests. Production data pipeline and Shariah board formation underway.

---

## SECTION D — Market opportunity

**Market size:**
- $5.2 trillion Islamic finance assets globally, 2025 (S&P Global Ratings).
- Growing 11–15% annually — fastest of any conventional finance vertical.
- 2 billion Muslims globally; 3 billion projected by 2060.
- Islamic fintech specifically: $341B projected by 2029 (Economy Middle East, DinarStandard).
- South Asian Hanafi diaspora wedge: ~5 million people in US/UK/Canada with above-median income.

**Competitive landscape:**
- **Wahed Invest:** halal robo-advisor (managed money). Single AAOIFI standard. Complementary to Mizan, not competing.
- **Zoya, Musaffa, Islamicly:** stock screeners, single AAOIFI standard. Direct competitors at the consumer layer.
- **HalalScreener, Hudood:** emerging multi-standard players. Smaller, less polished.
- Mizan's edge: deeper multi-scholar architecture, transparent ratio reasoning, the only product to ship Mufti Taqi Usmani's illiquid-asset floor.

---

## SECTION E — Technology and innovation

**Technology stack:**
- Next.js 15 web app + React Native mobile (planned), TypeScript end-to-end.
- Node.js backend with Postgres on Fly.io.
- Financial data via Financial Modeling Prep API (Year 1), Refinitiv / SIX at scale.
- Plaid for brokerage portfolio linking (US), TrueLayer (UK/EU), Salt Edge (MENA).
- Anthropic Claude API for the AI scholar Q&A.
- Stripe + RevenueCat for billing.

**Innovation claim:**
1. First halal investing product with native multi-scholar architecture (not toggleable presets — every datum is computed against the user's selected ruleset).
2. First product to implement Mufti Taqi Usmani's illiquid-asset floor in a consumer-facing screener.
3. First AI scholar Q&A system with explicit scholarly review of system-prompt scope.

**IP strategy:** Open methodology (we publish the screening rules). Defensible moat is the named-scholar relationships, the data pipeline quality, and the AI scholar reasoning layer.

---

## SECTION F — Why Hong Kong

1. **Financial Services credibility:** "HK-based fintech" buys global trust no other Asian jurisdiction can match.
2. **MENA + SE Asia access:** Direct flights to Dubai, Riyadh, Jakarta, Kuala Lumpur, Karachi. Mizan's expansion markets.
3. **HKMA Islamic finance promotion:** HKMA has an active mandate to promote Islamic finance — Mizan is exactly aligned.
4. **Talent + diaspora community:** ~300K Muslims in HK, including a wealthy Pakistani-origin business community.
5. **Tax efficiency:** Territorial tax means SaaS revenue from outside HK can qualify for the offshore profits exemption.

---

## SECTION G — Use of Cyberport funding

- 40% — Senior backend engineer compensation (hire #2) for 12 months.
- 25% — Live financial data pipeline (Financial Modeling Prep enterprise tier + initial Refinitiv POC).
- 15% — Legal / structuring (Cayman SAFE templates, HK employment templates, Shariah board engagement documentation).
- 10% — Shariah Supervisory Board cash retainer top-up (covers half of one board member for Y1).
- 10% — Office setup at Cyberport (workstations, networking).

Beyond cash: the Cyberport ecosystem, mentor network, and demo-day exposure to MENA + APAC family offices is the more important value.

---

## SECTION H — Milestones (next 12 months)

- **Month 1–3:** HK incorporation complete, Shariah board signed, alpha to 100 testers.
- **Month 4–6:** Public beta to waitlist, paid launch, 1K paying users.
- **Month 7–9:** Geographic expansion to UK + Canada, 5K paying users.
- **Month 10–12:** $400K ARR, seed-round materials complete.

---

## SECTION I — Team

**Founder + CEO:** jk (Hong Kong base).
**CTO co-founder (target Month 1 hire):** Profile: shipped consumer fintech at scale, Muslim or fluent in Islamic-finance context, in HK or open to relocate.
**Shariah Supervisory Board (target Month 3):** Mufti Faraz Adam (UK Hanafi, Chair), Sheikh Joe Bradford (US Hanbali/Maliki, Member), Ja'fari scholar TBD (Member).

---

## DRAFTING NOTES (delete before submitting)

- Replace all [TBD] with actual incorporation details once Mizan Operations (HK) Limited is registered.
- Your background and prior work need to go in Section B — be specific.
- Cyberport prefers HK-resident founders. Lean on the HK angle in the pitch.
- Prepare a 15-minute presentation deck for the second-round pitch (you can reuse the investor pitch deck, trimmed).
- Cyberport requires monthly progress reports during the incubation period. Treat it as a low-burden ongoing requirement.
