# HalalGauge — Master Handoff Prompt

*Paste everything below the line into a fresh chat with the newest Claude model. It briefs the model fully, then asks for three things: (1) a stress-test + improvement plan, (2) a vision for what HalalGauge can become — including what to do differently if the current shape is wrong, and (3) a full scaling plan using only remote/digital means (no in-person). If you're running this inside a coding tool with repo access, point it at the repo and the live site so it can inspect directly.*

---

You are my strategic + product co-founder for HalalGauge. Be rigorous, specific, and brutally honest — I want hard truths and concrete moves, not encouragement. Where a claim depends on current facts, tell me to verify rather than asserting. Use plain English and briefly gloss any Islamic-finance term (e.g. riba = interest, gharar = excessive uncertainty, maysir = gambling) — I am the founder but not a scholar.

## 1. What HalalGauge is
HalalGauge (live at halalgauge.com; Next.js 15 / Tailwind / Vercel) is a halal investing platform for Muslim retail investors. Core product: a **multi-scholar halal stock screener**. Unlike competitors that give one opaque "halal/not" score, HalalGauge lets the user pick which scholarly standard to screen under — AAOIFI, Mufti Taqi Usmani, Dow Jones Islamic, Ja'fari/Shia, a strict view, or a custom builder — and shows the exact financial ratios (interest-bearing debt, impermissible-income share, cash/securities, etc.) plus the cited primary source behind every verdict. No black box.

Around the screener it now has: portfolio compliance tracking; a "drift watch" that flags holdings sliding toward non-compliance before earnings; a purification calculator (the impermissible income slice to give to charity); a zakat calculator; a **Halal Asset Map** (educational page covering 63 asset classes across 9 families, colour-coded compliant/conditional/debated/non-compliant); a **fund screener** that "looks through" ETFs/REITs to screen their holdings and roll up % of weight compliant; a **crypto framework** page (how to evaluate any token, 8 worked examples, honest "debated" labels — no fake verdicts); an **income explorer** (sukuk, takaful, Islamic deposits); and a **"Your Scholar"** setup page. The scholar picker has plain-English labels and a "help me choose" flow.

## 2. Current state (honest)
- **Solo founder** (me — a Hong Kong-based medical student, not a developer or a scholar by training). Live in **beta, ~650 stocks, free, pre-revenue, zero users**.
- Data is moving from FMP to **Twelve Data** (verify redistribution/commercial-display licence terms). **Hong Kong company incorporation in progress** (via Osome). Auth (Clerk) and payments (Stripe) are scaffolded but **not live**.
- **The existential gap: no credentialed Shariah scholar and no certification.** Every verdict is currently sound arithmetic with cited sources but *no religious authority behind it*. This caps trust, monetization, and any institutional path.
- Warm relationships forming: **Prof. James Frankel** (CUHK, academic scholar of Islam — likely an advisor/intro source, not a finance mufti) and **Pawee Jenweeranon** (CUHK Law PhD — potential regulatory input). Neither is a signed advisor yet.

## 3. Strategy decided so far (challenge it if you disagree)
- **Retail-first**; become the *cited, trusted authority* on halal investing. Institutions (Standard Chartered / SC Ventures, HKMA, Cyberport/HKSTP/InvestHK) are 2–3 year relationship targets, not near-term customers — and HKMA is a regulator, never a buyer.
- **The moat = scholar credibility + transparency**, not the tech. The engine is replicable; trust is not.
- **Pro tier = "compliance autopilot"** (drift alerts, purification records, portfolio depth), not feature-gating the basics. Index-licensing is parked.
- **Acquisition thesis:** we answer what Muslims already search ("is X halal", "is bitcoin halal", "halal ETFs"), so distribution = high-intent SEO + community + creators. Biggest untapped lever: turn each of the 650+ stock verdicts into an indexable "Is [Company] halal?" landing page.
- **Ethos (non-negotiable):** never overclaim authority we don't have; lead with transparency ("free, shows its work, cites every source"); a single overstated religious claim permanently destroys trust in this community.

## 4. Competitors to benchmark against (verify current state)
Zoya, Musaffa, Islamicly, Wahed (invests, not just screens), and index/data incumbents (IdealRatings, MSCI Islamic, S&P Dow Jones). Assess honestly where HalalGauge's multi-scholar transparency genuinely wins vs. where incumbents are ahead (coverage, certification, brand, capital).

---

## YOUR TASK — deliver three things

### A. Stress-test & improvement plan
Audit HalalGauge across product, UX, positioning, trust, and technical/SEO foundations (inspect halalgauge.com directly if you can; key pages: /screen, /assets, /baskets, /crypto/is-crypto-halal, /income, /scholars, /pricing, /portfolio). Tell me: the sharpest weaknesses; where the experience or messaging leaks trust or users; what to fix first vs. later; and the highest-leverage improvements a solo founder can ship. Include a brutal "what's actually mediocre here" section.

### B. What can this become — and what would you do instead?
Think bigger than the current shape. What is the largest, most defensible version of HalalGauge — the 5-year vision? Is "multi-scholar stock screener that expanded to every asset" the right core, or is there a sharper wedge or business model (e.g. the compliance data/API layer, a halal-investing "operating system", a media/authority brand, a brokerage/robo integration, a B2B2C embed)? If you were starting fresh with these assets today, what would you build *instead*, and why? Be willing to tell me the current direction is wrong.

### C. Full scaling plan — remote/digital only (no in-person)
I want a complete customer-acquisition and growth plan that uses **only** online/remote channels — explicitly excluding any in-person, campus, mosque, or event tactics. Cover, at minimum: programmatic + content SEO (including the "Is [stock] halal?" page engine and how to structure it), community-led growth (Reddit, Discord, Telegram/WhatsApp, X/Muslim FinTwit — with non-spammy playbooks), creator/influencer partnerships (how to find, pitch, and structure deals with halal-finance YouTubers/TikTokers), build-in-public founder brand, email/newsletter, product-led virality (shareable verdict cards, the asset map, "your portfolio is X% halal"), referral loops, app-store/PWA and ASO, Ramadan seasonality, and B2B2C/API distribution partnerships. For each channel: the specific tactic, the effort/cost, the expected payoff and time-to-impact, and how to measure it. Then sequence it into a 0→1,000→10,000-user plan with a single north-star metric (I currently have zero users). End with what NOT to do and the biggest risk (e.g. acquiring into a leaky bucket, or growth outrunning the missing scholar credibility).

## Output format
Lead with a 5-line executive summary of your boldest conclusions. Then A, B, C as full sections. Prioritise ruthlessly, flag what to verify, and don't hedge — I'd rather hear one strong opinion than five balanced options.
