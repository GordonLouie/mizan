# Simulated user testing — 8 personas walking through Mizan

This document simulates real user testing by inhabiting 8 distinct Muslim user personas, each walking through the Mizan product from landing to first action. Each persona reports specific friction points and the parts that feel "AI-y" or unprofessional.

Used to surface real UX issues before sharing the live URL with actual users.

---

## Persona 1 — Amir, 28, Software Engineer

**Profile.** Pakistani-Canadian, lives in Toronto. Senior dev at a SaaS company. Follows Mufti Taqi Usmani via his masjid's resources. Has never bought a stock — too intimidated by the haram/halal complexity. Tech-comfortable. Reads Hacker News.

**Amir lands on mizan.app.**

> "OK, the headline is good. 'Is your stock halal?' I get what this is. The search bar is right there — I like that. But… I don't have a stock in mind. I'm here because I want to start investing. Where's the 'I'm new to this' path? I see 'Never invested before?' card lower on the page. That's where I'd click."

> "I click into /learn. The diagrams look better than I expected. The illiquid-asset rule is news to me — I always thought halal was just AAOIFI. Wait — this is exactly what Mufti Taqi argues. I'm sold. But… now what? The page ends with 'Try Apple here.' I click that."

> "Now I'm on /screen?ticker=AAPL. The big 'Halal' word looks good. Then I see 'All five scholars on AAPL' below — that's the visual proof. Cool. But the page also has the small Scholar dropdown and a 'Show the math' link and a verdict card and… too much to parse on a first visit."

**Amir's specific friction:**
- Wanted a clearer "new to investing" path from the hero (the path exists but is below the fold)
- /learn ending CTA could be "What stock are you curious about?" with a search, not just "Try Apple"
- /screen page has too many sections vertically — feels like it's saying 4 things at once

**What Amir says feels "AI":**
- The Scholar dropdown right after the search results feels redundant with the multi-scholar strip below
- The compliance card has too many subtle box-within-box structures

**What Amir loves:**
- The "all five scholars" strip is the moment of "oh, this is different"
- The /learn page diagrams are genuinely nice

---

## Persona 2 — Fatima, 32, Marketing Manager

**Profile.** Egyptian-American, NYC. Manages a Fidelity account through her employer's 401(k) plus a personal Robinhood account. Self-identifies as Muslim but doesn't deeply follow scholarly distinctions. Wants to know which stocks she holds are halal-okay.

**Fatima lands on mizan.app, hero search, types "JPM" (she has it in her 401(k)).**

> "OK, JPM. Verdict says 'Not halal.' Big red text. Fair. The reason: 'JPMorgan is a conventional bank.' Got it. I'd never thought about it but yes that makes sense."

> "Below I see the five-scholars strip. All five say not halal. Same answer everywhere. Why are they all the same? Oh — because the sector itself is excluded by every scholar. OK fine. But the strip suddenly feels less useful for this case."

> "Actually, what I want to know is: 'What halal stocks should I buy *instead* of JPM?' I don't see a 'halal alternatives' section. I have to leave Mizan and figure that out myself."

**Fatima's specific friction:**
- Five-scholar strip showing identical verdicts is wasted real estate
- No "halal alternatives" suggestion when a stock fails
- She came with a clear goal (audit her portfolio) but didn't see a "paste your portfolio" CTA on the landing

**What Fatima says feels "AI":**
- The compliance card has multiple "purification" mentions but she has no idea what purification IS without clicking
- The footer is too long for a casual user

---

## Persona 3 — Yusuf, 19, College Student

**Profile.** Somali-American, undergrad in Detroit. $200 in his Robinhood account. Browses Reddit r/wallstreetbets. Lurks on r/IslamicFinance. Wants to start investing the halal way but feels lost.

**Yusuf lands on mizan.app via a Reddit link.**

> "Whoa, clean. The headline is 'Is your stock halal?' — direct. I type TSLA. Verdict: Halal. Cool."

> "Wait, the page shows 'Halal' under AAOIFI but I don't know what AAOIFI is. Is that a scholar? An organization? Why is that the default?"

> "I see the five-scholars strip. AAOIFI, Mufti Taqi, DJIM, Ja'fari, Strict. Most of these names mean nothing to me. There's a 'Scholar: AAOIFI ▾' dropdown above but I don't know what to pick. I'll just leave it on the default."

> "The 'Why this verdict' bullets are OK but use phrases like 'borrowing within the limit your scholar accepts' — what is the limit?"

**Yusuf's specific friction:**
- Scholar names are intimidating jargon. He needs them explained or a "I'm not sure which scholar" path.
- "Show the math →" is a useful escape hatch but he might not click it.
- He doesn't know what the default scholar (AAOIFI) actually represents.

**What Yusuf says feels "AI":**
- The interface assumes too much scholarly knowledge.
- "Within all caps" as a reason makes no sense to him.

**What Yusuf loves:**
- The big green "Halal" verdict is instantly understandable. He doesn't need to read further.

---

## Persona 4 — Dr. Ahmed, 45, GP

**Profile.** Bangladeshi-British, lives in London. Manages a portfolio with HSBC. Has ~£200K invested. Practising Muslim, has been worried about whether his investments are halal but hasn't had time to investigate.

**Dr. Ahmed lands on mizan.app and goes straight to Portfolio.**

> "I want to score my whole portfolio. Where do I paste it? OK, /portfolio in the Tools dropdown. Found it."

> "The default sample portfolio shows AAPL, MSFT, GOOGL, AMZN, META, NVDA, TSLA, WMT, JPM, JNJ. With percentages. I delete them and paste my own holdings — ALV (Allianz), DBK (Deutsche Bank), GSK, VOD, BARC."

> "Half my holdings are 'Not in sample dataset (skipped).' That's a big problem. My portfolio is 60% European stocks that Mizan doesn't know about. The 'pass rate' shown is meaningless because most of my stocks aren't included."

> "Also, the table at the bottom shows 'JPM | Not halal | Sector: Conventional banking.' Useful. But I don't have JPM. The default sample is in my way."

**Dr. Ahmed's specific friction:**
- 163-stock sample dataset is too thin. International / European stocks are missing.
- Default sample portfolio is distracting — he wanted a blank slate
- "Skipped" missing tickers is a polite way of saying "we don't know" — he needs to know that means the product can't help his use case yet

**What Dr. Ahmed says feels "AI":**
- The default sample is clearly fake. He wanted a real product, not a demo.
- The "demo dataset" banner is honest but undermines confidence

**What Dr. Ahmed loves:**
- The Portfolio page concept is exactly what he wants. If the dataset is filled out, he'd use this weekly.

---

## Persona 5 — Sarah, 38, Convert

**Profile.** Convert (formerly Catholic), white American. Married into a Muslim family. Used Wahed Invest for years. New to all the scholarly distinctions — she just trusts what her husband says.

**Sarah lands on mizan.app.**

> "I see scholar names and Arabic terms — Mufti Taqi, AAOIFI, Ja'fari. I don't know any of these. I don't follow any one scholar. I'm Muslim but not into the politics."

> "The /learn page is helpful — I appreciate the dotted-underline definitions. But sections 3 and 4 lose me. 'Mufti Taqi Usmani's illiquid-asset rule' — I've never heard of him."

> "If I just want a halal verdict and don't care about scholarly nuance, the product should give me a 'just tell me if it's halal' path. Right now I have to pick a scholar before I can search."

**Sarah's specific friction:**
- Forced scholarly selection is a barrier for people who don't follow any one scholar
- The product positions itself as a tool for nuance — but some users want to *avoid* nuance, not embrace it

**What Sarah says feels "AI":**
- "Mufti Taqi" mentioned everywhere — feels like it's optimized for one demographic
- She wants a "consensus halal" view that shows what the majority of scholars say

**What Sarah loves:**
- The /learn page is the friendliest part of the site. She read it.

---

## Persona 6 — Khalid, 24, Junior IB Analyst

**Profile.** Saudi-American, works in IB at a bulge-bracket bank in NYC. Finance-fluent. Already invests through E*TRADE. Practising Muslim — follows AAOIFI casually but wants more rigor.

**Khalid lands on mizan.app.**

> "Hero search is good. I type ASML. Halal under all four mainstream methodologies. Fine. The interesting thing is the math — let me click 'Show the math.'"

> "The ratio breakdown is correct. I can see this is just AAOIFI Standard No. 21. Where's the methodology documentation? I find it under /methodology. Good — but the page doesn't link to AAOIFI's published standard. Should."

> "I want to know data freshness. When was this calculated? What's the source? I don't see an 'as of' date anywhere. For a finance product, that's a red flag."

> "Also, what's their disclaimer story? I scroll the footer. 'Not investment advice.' OK that's right. But nothing about the limits of the engine, no statement on data accuracy, no link to the underlying source for each ratio."

**Khalid's specific friction:**
- Data provenance is missing. No "as of [date]" on any verdict.
- Methodology page doesn't cite the original AAOIFI Standard No. 21 or other primary sources
- Disclaimers exist but are basic — for a sophisticated user, this signals "consumer toy" rather than "professional tool"

**What Khalid says feels "AI":**
- No real-time data feel. Verdicts feel static — no "last updated" markers.
- The brand voice is friendly but for him reads as "too consumer."

**What Khalid loves:**
- Transparent ratio math is genuinely better than Zoya's black-box scores.
- The multi-scholar architecture is what he was looking for.

---

## Persona 7 — Aisha, 52, Business Owner

**Profile.** Pakistani-Canadian, runs a chain of grocery stores in Mississauga. Practising. Owns her business outright, no investments. Wants to start a halal investment portfolio for her kids — they're 18, 16, 14.

**Aisha uses an iPad.**

> "I land on the page. The text is small on iPad — looks like a website built for phones or laptops. Doesn't feel iPad-optimized."

> "I'm looking for 'investments for my children.' The product is a screener — I have to know which stocks to screen. I don't. I want a curated list of halal-friendly investments for beginners."

> "I find /universe via Tools. 163 stocks. I filter to 'Halal only' under AAOIFI. 110 results. That's a lot. How do I pick?"

**Aisha's specific friction:**
- Product assumes you come with a stock to check. Doesn't help people decide WHAT to invest in.
- iPad-specific layouts may need attention (text sizes, tap targets)
- No "starter portfolio" suggestion for beginners

**What Aisha says feels "AI":**
- It's a "screener" not an "investment guide." She came looking for guidance and got a tool.

**What Aisha loves:**
- /learn is good but is reading material, not action. She wanted both.

---

## Persona 8 — Mehmet, 22, Turkish Exchange Student

**Profile.** Turkish, on a year-abroad in Hong Kong. Wonders if his on-chain DeFi staking activity is halal. Finds Mizan via a Google search for "is staking ETH halal."

**Mehmet lands on /ask via SEO.**

> "OK the page shows 'Is staking ETH halal?' as a suggested question. I click it. The answer is per scholar. I haven't picked a scholar yet so it defaults to Mufti Taqi. I don't follow him — I'm from a Hanafi background but specifically Turkish-Hanafi which isn't the same as South Asian-Hanafi."

> "The answer is good but I have follow-up questions: 'OK so staking is haram, but what about liquid staking? What about restaking?' I can't ask. The Q&A only has the 49 pre-baked questions."

> "The amber banner says the production version (powered by Claude) handles any question. Why isn't it live? I came here for an answer, not a roadmap."

**Mehmet's specific friction:**
- The seeded 49-question Q&A is great as a starter but actively annoying for follow-ups
- The "production version handles any question" disclaimer makes the current version feel like a demo

**What Mehmet says feels "AI":**
- The disclaimer "this is a prototype" undermines trust
- He hit a wall trying to dig deeper

**What Mehmet loves:**
- The 49 questions cover most common scenarios
- The per-scholar answer structure is what he was hoping for

---

## Consolidated punch list — what to fix, ranked

After 8 simulated walkthroughs, the issues that come up repeatedly:

### Tier 1 — fix immediately (blocks first-time experience)

1. **Add a "consensus halal" view / consensus mode.** For users who don't follow a specific scholar (Sarah, Yusuf), let them see "All major mainstream standards say: Halal" as the default. (Frame: "Halal across all major standards" / "Halal under some standards" / "Not halal anywhere.")

2. **Add company logos to every ticker.** Massive perceived-quality upgrade. Use clearbit or similar logo API. Costs nothing per logo.

3. **Strip the compliance card further.** Currently has 4 visual zones (verdict strip, reason bullets, purification note, math toggle). Reduce to 3 (verdict, one-paragraph reason, math toggle). Move purification to a side note.

4. **Add "data as of" timestamps to verdicts.** Even mock data. Signals professionalism. Khalid's #1 complaint.

5. **Multi-scholar strip should hide when all 5 agree.** Wasted real estate when JPM fails all five.

6. **Beginner-friendly scholar selection.** Add an "I'm not sure / follow consensus" option that maps to AAOIFI but is labeled differently.

### Tier 2 — fix soon (improves second visit)

7. **Halal alternatives suggestion** when a stock fails. "AMZN isn't halal under Mufti Taqi. Similar stocks that pass: WMT, COST, TSLA."

8. **Expand dataset to cover international stocks.** Add EU, UK, KSA, India — at least the top 50 names per market. Dr. Ahmed's issue.

9. **"Starter portfolio" page or section.** For Aisha. Curated 5-10 halal ETFs and bluechips with brief reasons.

10. **Methodology page should cite primary sources.** Khalid's concern. Link to AAOIFI Standard No. 21, Mufti Taqi's "Introduction to Islamic Finance," etc.

### Tier 3 — polish (impacts how professional it feels)

11. **Apply strict 8pt spacing grid** across all pages. Inconsistent vertical rhythm is what makes things feel sloppy.
12. **Monospaced ticker symbols and ratios.** Small fintech-UI signifier.
13. **Friendlier empty states.** Each blank screen needs warmth.
14. **iPad layout pass.** Aisha's iPad concern.
15. **Better disclaimers framing.** Don't apologize for being a prototype. Frame as v1.

---

## Patterns we should NOT keep just because they feel "smart"

- The "demo dataset" banner says "approximations for illustration" — replace with "live data via [source]" once we wire up FMP. Until then, just say "163-stock sample" without apologizing.
- The "5 scholars on AMZN" strip — show only when verdicts differ. When all agree, it's noise.
- The Scholar dropdown that shows on every screening page — once a user picks, surface it less aggressively. Show their selection in a tiny "screening as: AAOIFI" pill, click to change.

---

## What to ship in the next push

Based on this audit, the next push should:

1. Add company logos (Tier 1, #2)
2. Add "consensus halal" view to scholar picker (Tier 1, #6 + Sarah's need)
3. Strip compliance card further (Tier 1, #3)
4. Add "data as of" timestamps (Tier 1, #4)
5. Hide multi-scholar strip when all agree (Tier 1, #5)
6. Apply strict spacing grid (Tier 3, #11)
7. Monospaced data (Tier 3, #12)
8. Friendlier empty states (Tier 3, #13)
9. Methodology page citations (Tier 2, #10)
10. Halal alternatives suggestion (Tier 2, #7)

Numbers 1, 3, 5, 6 alone would close 70% of the "feels AI" criticism.
