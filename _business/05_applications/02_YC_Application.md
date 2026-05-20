# Y Combinator application — answers draft

**Why YC.** Even if you don't get in: applying forces precision; the application questions are the best founder-thinking template ever written. If you get in, the brand uplift alone is worth more than the $500K.

**Apply for:** Next batch (Summer 2026 or Winter 2027 depending on timing).
**Apply at:** https://www.ycombinator.com/apply

These are answers, not the full application. The actual form has more fields; treat these as raw material for the longer prompts.

---

## What is your company going to make? (≤ 280 chars)

The first stock screener that adapts to the user's scholar. Every halal-investing app screens against one standard (AAOIFI). Mizan ships with six — AAOIFI, Mufti Taqi Usmani, DJIM, Ja'fari, strict, or custom — and shows the math behind each verdict.

---

## What is your company going to make? (long, ~1000 chars)

Mizan is a halal stock screener that lets a Muslim investor pick the scholar whose rulings they actually follow, and recalibrates every verdict accordingly.

The existing apps (Wahed, Zoya, Musaffa, Islamicly) all screen against a single AAOIFI default. But Muslims follow many different scholars, and those scholars have meaningfully different rules. Mufti Taqi Usmani, the most-cited contemporary Hanafi scholar, requires an illiquid-asset floor that's not implemented in any major app. Strict scholars hold zero-tolerance views. Ja'fari Shia have a different framework altogether.

Mizan ships with six pre-built scholar profiles and a Custom builder. We surface the underlying ratios transparently — no black-box compliance score — and tell the user exactly which threshold their selected scholar fails, and why.

Wedge: 5M Hanafi-leaning diaspora investors in the US, UK, and Canada. Expansion: Ja'fari, strict Hanbali, then Pakistan / India / Bangladesh / SE Asia direct.

---

## Why did you pick this idea? Do you know more about it than most people?

I'm a Hong Kong-based founder. My closest friend follows Mufti Taqi Usmani's rulings — a stricter Hanafi interpretation. He uses Zoya. Two months ago he bought a stock Zoya marked halal that turns out fails Mufti Taqi's illiquid-asset test. He didn't know the difference existed.

I went deep: read AAOIFI Standard No. 21, read Mufti Taqi's published rulings, mapped the differences between every major standard. The "6% threshold" some people talk about turned out to be folklore — the real numbers are 0%, 5%, 30%, and 33% across different ratios. But the underlying observation is true: Shariah compliance is a spectrum, and every app today flattens it.

I'm not a scholar, but I have unusually deep knowledge of the variation across standards. And I'm building from Hong Kong, which is the only major financial center with an active mandate to promote Islamic finance, plus direct flights to every MENA capital.

---

## Who are your competitors, and who might become competitors? Who do you fear most?

Direct competitors:
- **Wahed Invest** — halal robo-advisor. Single AAOIFI standard. Strong distribution; we don't compete (different layer of stack).
- **Zoya / Musaffa / Islamicly** — stock screeners, single AAOIFI standard. Direct competitors at the consumer layer.
- **HalalScreener / Hudood** — emerging multi-standard players. Small, less polished. Closest to our thesis but lacking named scholar relationships.

I fear Zoya most. They have the polish, the brand, and the audience. If they bolt on multi-scholar (which they technically could), they'd compete directly. Our moat: named scholar relationships (Mufti Faraz Adam, Sheikh Joe Bradford, Al-Mahdi Institute Ja'fari scholar) and the depth of methodology implementation (Zoya's threshold customization in a single sprint would still lack the scholar credibility).

---

## What's new about what you're making? What substitutes do people resort to?

The substitute is: pick one app, accept its default screen, and just trust it. Or: maintain a personal spreadsheet that recalculates the ratios against your scholar's thresholds. Or: ask your local imam, who doesn't have time and isn't a financial professional.

What's new: the multi-scholar architecture isn't a toggle on top of a single engine — it's the architecture. Every datum in the database is computed against the user's selected ruleset on the fly. And we publish the methodology of every scholar profile, with attribution.

---

## Why do you think people would want to use Mizan?

Direct quote from someone in our wedge audience after we showed them the AMZN-passes-AAOIFI-but-fails-Mufti-Taqi demo: "I've been investing on a lie."

That's the line. Once a Muslim investor sees that the app they trust returns a different verdict than their scholar would, they can't unsee it. The conversion isn't a marketing pitch; it's information they didn't have before.

---

## How do you plan to make money?

B2C SaaS subscription. Free tier (5 screens/day). Plus ($7.99/mo). Pro ($14.99/mo with portfolio sync and purification automation). Family ($19.99/mo). Masjid plans ($4.99/seat min 10).

Y2 unlock: B2B compliance API. Every neobank wants a "halal mode" toggle but can't justify building the scholar relationships. We sell it to them as an API.

Targets: $400K ARR Y1 exit, $2.9M Y2, $9.9M Y3.

---

## Why are you the right people to do this?

I'm a HK-based founder with deep knowledge of Islamic-finance jurisprudence and a software-engineering background. My co-founder (target hire Month 1) is the CTO — consumer fintech shipping experience.

But the real answer is the Shariah board. Mufti Faraz Adam (UK Hanafi) as Chair, Sheikh Joe Bradford (US Hanbali/Maliki) as Member, and a Ja'fari scholar from the Al-Mahdi Institute as the third Member. Those names are the credibility moat. They take Mizan from "another startup" to "the scholar-vetted platform."

---

## How will you get users? (≤500 chars)

Phase 1: founder content engine. 3 YouTube videos per week. Daily X presence. Podcast tour. Build to 5K YouTube subs + 1K-person waitlist BEFORE any paid spend.
Phase 2: Meta + TikTok ads against Muslim affinity audiences ($18 CAC target). Mid-tier creator deals. Masjid partnerships.
Phase 3: programmatic SEO on every ticker, localized launches.

---

## How much money have you raised? At what valuation? Burn rate?

Raising $750K pre-seed on a SAFE at $5M post-money cap. Currently at $0 raised — applying to YC at the same time as the raise.

Burn at full team (5 people + Shariah board): ~$75K/month. Pre-seed gives ~13 months runway. Seed close target: month 13.

---

## How long have you been working on this?

Started building [DATE]. Working prototype in [DATE]. Currently at [paying users count] / [waitlist signups].

---

## Anything else we should know?

I'm building Mizan from Hong Kong specifically — not from the US or the GCC. Hong Kong is the only major financial center actively promoting Islamic finance (HKMA mandate) with direct access to MENA, South Asia, and SE Asia. Cyberport (HK government tech park) has us in incubation. Antler HK has been part of the conversation.

I deeply believe this product needs to exist and is the right thing to build right now. The audience has been waiting twenty years.
