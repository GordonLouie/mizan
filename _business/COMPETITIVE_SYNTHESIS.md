# Competitive synthesis — Mizan vs. the field
**Date:** 22 May 2026
**Author:** Gordon (engineering) — for review with co-founder
**Purpose:** Catalogue every feature the major halal-investing apps ship, decide what to copy, and lock in the synthesis that makes Mizan the best-in-class halal compliance platform.

---

## TL;DR

Six apps matter today: Zoya, Musaffa, Wahed Invest, Islamicly, Amana Funds, and IslamicFinanceGuru (IFG). Each is best at one thing and mediocre at the others. Mizan's wedge — multi-scholar architecture — is real and uncopyable in the short term (Zoya rebuilt their entire engine in 2024 around AAOIFI; they can't add a second standard without a 6-12 month rewrite). The opportunity is to take **the best feature from each app**, port it into Mizan, and present the union under Mizan's editorial design system.

The 5 things to ship in this build, each lifted directly from a competitor:

| Source | Feature | Mizan version |
|--------|---------|---------------|
| Zoya | Discover page | `/discover` — trending halal stocks, IPO watch, sector spotlights |
| Musaffa | Crypto compliance | `/crypto` — 20 cryptos × 5 scholars, no other app does this multi-view |
| Amana / Wahed | Sukuk education | `/sukuk` — the fixed-income leg every halal portfolio needs |
| Islamicly | Industry deep-dive | `/sectors` + `/sectors/[slug]` — browse by industry with halal pass-rate |
| IFG | Trust-first methodology | already shipped in this session as `/methodology` rewrite |

All five become surfaces where the multi-scholar moat is visible. That is the strategic point.

---

## 1. Competitor breakdown

### Zoya — the dominant mobile screener
- **Strength:** Best mobile design in the category. Fast onboarding, beautiful PASS/QUESTIONABLE/FAIL verdict cards, push notifications on verdict changes, "Stories" educational feed, Discover page with curated lists.
- **Weakness:** Single-standard (AAOIFI only). No way for a Hanafi following Mufti Taqi to use it without getting wrong verdicts. No transparency on the math behind any score. Verdict changes are notified but never explained.
- **Pricing:** Free tier + $9.99/mo Premium.
- **What to copy:** Discover page concept, verdict-change concept (with our twist — we explain the change), stories-style educational micro-content.
- **What to ignore:** Their methodology opacity. We do the opposite.

### Musaffa — the research-heavy screener
- **Strength:** Deepest financial data of any halal app. Stock comparison tool, halal crypto section (the only major app that ships one), halal real estate, halal ETF analysis with underlying holdings, IPO calendar, sukuk screening, forum/community.
- **Weakness:** Cluttered UX. Information density without information hierarchy. Single-standard (AAOIFI). Slow.
- **Pricing:** Free tier + $9.99/mo Premium.
- **What to copy:** Crypto coverage, sukuk coverage, ETF holdings-level analysis, IPO calendar concept.
- **What to ignore:** The clutter. We compete on clarity.

### Wahed Invest — the robo-advisor
- **Strength:** Bank-level trust (regulated). Managed portfolios with auto-rebalancing. Halal pension, halal gold, halal crypto vault. Best onboarding flow in the category.
- **Weakness:** Not a screener — you can't research individual stocks. Locked into Wahed's choices. 0.99% AUM fee is high. No DIY path.
- **Pricing:** 0.99% AUM (no monthly fee).
- **What to copy:** Onboarding flow polish, multi-currency support, themed portfolios concept.
- **What to ignore:** Don't try to compete as a robo. Different category, different licensing burden.

### Islamicly — the legacy screener
- **Strength:** Country-specific coverage (UAE, Saudi, Pakistan, India, Malaysia listings). Mufti review per stock. Cheapest paid tier in the category.
- **Weakness:** Outdated UI. Single-standard. Limited US/UK depth.
- **Pricing:** Free tier + $5.99/mo.
- **What to copy:** Country/exchange filter on the screener.
- **What to ignore:** Their UI is the cautionary example.

### Amana Funds (Saturna Capital) — the mutual funds
- **Strength:** 25-year track record. Multiple themed funds (Income, Growth, Developing World, Participation). ESG overlay. Real institutional credibility.
- **Weakness:** Mutual funds, not stock screening. Higher fees. Not a tool, a product.
- **What to copy:** Themed-portfolio framing for our curated lists. ESG mention in methodology.
- **What to ignore:** We're not launching funds.

### IslamicFinanceGuru (IFG) — the content + ecosystem player
- **Strength:** Massive content library. Halal mortgage, pension, insurance, alternatives content. Strong community. Founder-friendly partnership posture.
- **Weakness:** Not a real-time product. Content, not tools.
- **What to copy:** Topic breadth — content on halal mortgages / pensions / insurance gives us SEO oxygen. Partnership opportunity (week 4 of the co-founder roadmap).
- **What to ignore:** Don't try to out-content them; partner instead.

---

## 2. Feature-by-feature scorecard

Legend: ✅ Mizan has · 🟡 Mizan partial · ❌ Mizan missing · — not applicable

| Feature | Zoya | Musaffa | Wahed | Islamicly | Amana | IFG | Mizan today | Build this round? |
|---|---|---|---|---|---|---|---|---|
| **Multi-scholar screening** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | own it |
| Stock screener | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ | — |
| Halal/doubtful/not halal verdicts | ✅ | ✅ | — | ✅ | — | — | ✅ | — |
| Methodology citations | ❌ | 🟡 | ❌ | ❌ | ✅ | ✅ | ✅ | — (shipped) |
| Stock comparison | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | — (shipped /vs) |
| Curated lists | ✅ | 🟡 | ❌ | ❌ | ✅ | ✅ | ✅ | — (shipped /lists) |
| Portfolio compliance | ✅ | 🟡 | ❌ | ✅ | — | ❌ | ✅ | — |
| Watchlist | ✅ | ✅ | ❌ | ✅ | — | — | ✅ | — |
| Zakat calculator | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | — |
| Purification calculator | 🟡 | ✅ | 🟡 | ❌ | ❌ | ❌ | ✅ | — |
| AI scholar Q&A | ❌ | 🟡 | ❌ | ❌ | ❌ | ❌ | ✅ | own it |
| **Discover / trending** | ✅ | ✅ | 🟡 | ❌ | ❌ | ❌ | ❌ | **YES** |
| **Crypto compliance** | ❌ | ✅ | 🟡 | ❌ | ❌ | 🟡 | ❌ | **YES** |
| **Sukuk coverage** | ❌ | ✅ | ❌ | ❌ | ✅ | 🟡 | ❌ | **YES** |
| **Sector deep-dives** | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | **YES** |
| ETF holdings analysis | ✅ | ✅ | — | ❌ | — | ❌ | 🟡 | partial |
| Real estate / REITs | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | 🟡 | next round |
| News / verdict-change alerts | ✅ | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | next round (needs backend) |
| Country / exchange filter | 🟡 | ✅ | ❌ | ✅ | ❌ | — | ❌ | next round |
| IPO calendar | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | next round |
| Stories feed | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | next round |
| Push notifications | ✅ | ✅ | ✅ | ✅ | — | ❌ | ❌ | needs mobile app |
| Multi-currency | ✅ | ✅ | ✅ | ✅ | ❌ | — | ❌ | next round |
| Dark mode | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | low priority |
| Halal mortgage / pension content | ❌ | ❌ | 🟡 | ❌ | ❌ | ✅ | ❌ | content roadmap |
| Forum / community | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | 🟡 (Discord) | Discord is fine |
| Mobile app | ✅ | ✅ | ✅ | ✅ | — | ❌ | ❌ | PWA for now |

---

## 3. The Mizan strategic position

The category is split into three product types:
- **Screeners** (Zoya, Musaffa, Islamicly) — research tools, single-standard
- **Robo-advisors** (Wahed) — managed money, different licensing
- **Content / community** (IFG) — content-led, no real-time tooling

**Mizan is a screener.** Don't drift. Stay in lane.

Within screeners, the existing players compete on:
1. Coverage breadth (Musaffa wins)
2. UI polish (Zoya wins)
3. Price (Islamicly wins)

Mizan competes on:
1. **Scholarly diversity** — only multi-scholar app, only Mufti Taqi illiquid-asset rule, only Ja'fari profile, only customisable profile
2. **Transparency** — every verdict explained, every threshold cited to primary source
3. **Editorial design** — feels like a publication, not a SaaS dashboard
4. **Multi-asset coverage** — stocks + ETFs + sukuk + crypto + sectors, all under the multi-scholar lens

That last point is what this build round delivers. Currently we only screen stocks. After this build, we screen the entire halal-relevant investment universe — and every asset class gets the multi-scholar treatment that no competitor matches.

---

## 4. Build order — this session

1. `/discover` — homepage replacement for power users; trending halal stocks, IPO watch, sector spotlights, stat-of-the-day. Pulls from existing data.
2. `/crypto` — BTC, ETH, top 18 cryptos, with each scholar's view. The only multi-scholar crypto resource on the internet.
3. `/sukuk` — primer + the major sukuk ETFs + named sukuk issuances. Replaces the "what about fixed income?" question every Muslim investor has.
4. `/sectors` index + `/sectors/[slug]` deep-dive — sector pass-rate, top halal names in sector, what's borderline, what's failing.

After this round Mizan moves from "halal stock screener" to "halal investment universe under your scholar." That is the positioning we own.

---

## 5. What we are NOT building (this round)

These are real opportunities but not for this session:
- **Mobile native app** — PWA shell suffices through Cyberport application. Native app is a Q4 build.
- **Push notifications** — needs mobile or service workers + backend. Q4.
- **Verdict-change alert backend** — needs real-time data pipeline. Post-FMP integration.
- **Real estate / REITs detailed coverage** — depends on REIT data. Q3.
- **Halal mortgage / pension content** — content is your friend's lane post-week-3 user interviews.
- **Stories feed** — UX bet that needs A/B testing. Not worth the bet pre-launch.
- **Forum** — Discord already covers this for the first 500 users.

---

## 6. Post-build positioning

After this build, the homepage tagline can shift from *"Is your stock halal?"* to:

> **"Halal investing, calibrated to your conscience — across every asset class you care about."**

And the comparison table on `/compare` gains four new rows where Mizan is the only ✅:
- Multi-scholar crypto views
- Multi-scholar sukuk views
- Multi-scholar sector analysis
- Multi-scholar discovery feed

That is the moat made visible.
