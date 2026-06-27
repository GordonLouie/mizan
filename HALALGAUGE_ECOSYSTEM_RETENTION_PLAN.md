# HalalGauge — Ecosystem & Retention Plan
*Live stress-test + council, June 2026. The question: how do we make HalalGauge cohesive, sticky, and something a Muslim investor can't invest without?*

---

## ✅ Executed in this pass (June 2026) — type-checked clean, awaiting push

A focused, safe batch covering the bugs, the lock-fatigue, and the biggest cohesion leak. Larger structural items (full nav refactor to the 6-item spine, dedicated "Your scholar" page, calendar timeline overhaul, free/Pro re-cut) are deliberately held for the next pass so you can review direction first.

- **Screen → watch handoff (cohesion).** The post-verdict footer (four identical ghost links) is now a "What's next — now keep watch on TICKER" band: a snapshot becomes an ongoing job, with a primary "Add to my portfolio" CTA. This is the Check → Keep → Catch handoff.
- **Pro locks no longer dead-ends.** `LockedFeature` now shows a *bounded* blurred preview (max-height + fade — no more tall empty void), a bold feature name, and a **concrete benefit line**. Wired real benefit copy into the AI report (Screen) and the three portfolio locks (purification, performance, AI assistant).
- **Sample portfolio is now honest.** Added `isSamplePortfolio()`; the dashboard shows a labelled "This is a sample portfolio… add your holdings" banner instead of implying the demo positions are the user's. Header copy de-overclaimed.
- **Earnings calendar.** Empty 14-day radar is now a calm, intentional "all quiet" state (not a sad empty box); fixed leftover "DOUBTFUL" → "BORDERLINE" to match the rest of the app.
- **Earnings disclaimer bug.** "within 5 percentage points" → "within ~15% of its limit (same proximity the drift watch uses)", matching the corrected logic.
- **404 page on-brand.** Old gold scales → the gauge mark with needle off the dial; "out of balance" → "This reading's off the dial."
- **/scholars + /standards** now redirect to /methodology instead of 404-ing.
- **Theme.** Extended the `gold` scale (50/100/200/700) so warm callouts render.

*Files touched: `src/app/screen/page.tsx`, `src/app/portfolio/page.tsx`, `src/lib/portfolio.ts`, `src/components/LockedFeature.tsx`, `src/components/EarningsCalendar.tsx`, `src/components/EarningsWidget.tsx`, `src/app/not-found.tsx`, `next.config.js`, `tailwind.config.ts`.*

**Next pass (structural, needs your sign-off on direction):** collapse nav to the 6-item spine (merge the six Research surfaces into one Discover; fold Watchlist into the holdings hub; move Custom profile into a real "Your scholar" page); rebuild the calendar's three-redundant-views into one timeline; re-cut free vs Pro so basic drift + portfolio are free.

---

## 0. How I tested this

I walked the live site (halalgauge.com) in the browser as a new user would: landing → screen AMZN → the multi-scholar table → ratio cards → 8-quarter history → portfolio dashboard → every nav dropdown. No console errors anywhere; the aesthetic is clean and the brand is coherent. The engine-driven hero card is now live ("4 of 5 standards say halal"). The *substance* is genuinely strong — the citations, the buffer/breach-risk meters, the "scholars disagree" table, the drift watch. This is not a polish problem.

It's a **shape** problem. Right now HalalGauge is a very good **screener with a pile of features bolted around it**. It is not yet an **ecosystem with a loop**. That distinction is the whole game for retention, so the rest of this doc is about turning the pile into a spine.

---

## 1. The core diagnosis

**You have ~20 destinations and no path.** Counting the nav: Screen, then Research (Discover, Halal baskets, Sectors, Curated lists, Compare stocks, Universe — *six* overlapping ways to browse grouped stocks), Portfolio (Portfolio score, Watchlist, Earnings calendar, Custom profile), Calculators (Zakat, Purification), Learn (101, Q&A, Methodology), Pricing, plus a footer of ten more. For a pre-launch solo product this is *more surface than a team of ten could keep alive*, and crucially none of it tells the user **what to do next**.

The symptom that proves it: the Screen page — your single best asset — **ends on a Pro paywall** (a tall, mostly-empty blurred "AI Compliance Report" panel). The most engaged moment in the entire product, the instant after someone gets a verdict on a stock they care about, is spent showing them a locked box instead of pulling them one step deeper. That's a loop that leaks at exactly the wrong place.

**The features don't hand off to each other.** Screening doesn't funnel into the portfolio. The portfolio's stickiest parts (drift, purification, performance) are *all* walled behind Pro, so a free user never forms the habit that would make them pay. Discovery is six disconnected list pages. The one concept that makes HalalGauge unique — *your scholar, applied to everything* — has no home; it's an inline dropdown, even though "pick your scholar" is literally step 1 of your own pitch.

So: the parts are excellent, the connective tissue is missing, and the monetization is gating the wrong layer.

---

## 2. The retention thesis (the one job that makes you indispensable)

Strip everything away and ask: *what recurring job, done under religious obligation, would make someone unable to invest without HalalGauge?*

It is **not** "look up if a stock is halal" — that's a one-shot acquisition action. Once answered, they leave. It's a great front door, a terrible retention engine.

The indispensable job is the **ongoing one**:

> *"I told HalalGauge which scholar I follow. I put my holdings in. Now it watches them for me — it warns me before one drifts out of compliance, and at year-end it hands me the exact amount I owe to charity, itemised, as a record I keep."*

That job is **recurring** (compliance changes every quarter), **obligatory** (purification + zakat are religious duties, not nice-to-haves), and **switching-costly** (your portfolio, your scholar setting, and a year of purification records all live here). Nobody else does the *continuous, scholar-calibrated* version of this. **That** is the moat — sitting on top of the deeper moat you already know about (a credentialed scholar making the verdicts trustworthy).

The screener acquires. The **scholar-calibrated, monitored portfolio retains.** Everything in the product should be bent toward moving a user from the first to the second.

---

## 3. The Council

I convened six lenses on "cohesion + indispensability." They disagreed in useful ways; the verdict resolves the disagreements.

### Seat 1 — The Retention PM (thinks in loops & habits)
"You've built a *lookup tool*, and lookup tools have no retention curve — usage spikes when someone has a stock in mind and flatlines otherwise. You need a **return trigger you don't control**: a reason the product pings *them*. The only honest one you have is **drift** — 'AAPL is approaching its debt limit ahead of earnings.' That's your weekly heartbeat. Build the loop around it: every action should end by adding something to the watched set, because the watched set is what generates return triggers."

### Seat 2 — The Behavioral Economist (thinks in commitment & identity)
"Stickiness = accumulated personal investment + identity. Two levers. **Sunk cost:** make the user *build* something — their scholar profile, their portfolio, their year of purification history. Leaving means abandoning their own work. **Identity:** this is religious practice, the single strongest retention force that exists. Don't position this as 'a finance tool.' Position it as *part of practicing Islam correctly* — 'invest without doubt.' But heed the warning: sunk-cost assets only work if they're **free to build**. Wall the construction and you get nothing."

### Seat 3 — The Muslim Retail Investor (the actual user)
"I don't want a Bloomberg terminal. I want two feelings gone: the **anxiety** before I buy ('am I sinning?') and the **guilt** after ('I never purified those dividends'). Kill those two feelings and I will never leave — and I'll tell the WhatsApp group. I do **not** care about six ways to browse lists. Honestly the wall of 'Unlock with Pro' boxes makes me trust you *less* — it feels like you built a paywall before you built the thing."

### Seat 4 — The Fintech Designer (thinks in focus & flow)
"One job per screen, and every screen answers 'what now?' You have twenty front doors and no hallway. Collapse it to a **single spine** and make each step physically hand off to the next. Cut the six discovery pages down to one. The blurred empty locked panels are the worst offenders — a teaser that shows *nothing* is just a dead end with a lock on it. Show one real row and a door, never a void."

### Seat 5 — The Skeptic / Bear (devil's advocate)
"All of this is rearranging furniture until a **credentialed scholar** signs the methodology. Retention features on an untrusted base just mean people churn slower from something they arguably shouldn't trust yet. And you're monetizing **backwards**: the habit-forming core (drift, purification) is exactly what's Pro-walled, so free users never get hooked, so there's nothing to upsell. You're charging for the bait."

### Seat 6 — The Ecosystem Architect (synthesizer)
"Everyone's right about a different piece. The PM's loop is correct but its trigger (drift) and the Economist's sunk-cost asset (portfolio) and the Investor's two feelings (anxiety/guilt) are *the same spine* — Calibrate, Check, Keep, Catch, Cleanse. The Skeptic and Economist together settle the monetization fight: **the habit must be free; sell the depth.** The Designer settles the IA: **one spine in the nav, everything else demoted to acquisition surfaces.** And the Skeptic's base-trust point isn't a UX task — it's the gating dependency that sits under all of it, which you already know and own."

### Where they disagreed, and the ruling
- *PM wants more hooks; Investor wants less product.* → Ship **exactly one** hook — drift — because it's the only one that *reduces* anxiety rather than adding noise. No engagement-bait notifications.
- *Economist wants commitment devices; Skeptic says don't wall them.* → The **sunk-cost assets (scholar profile + portfolio + basic drift) are free forever.** Pro sells *depth* (history, unlimited monitoring, the downloadable record, AI, performance).
- *Designer wants to cut features; SEO value of the list pages is real.* → Don't delete them — **demote** them. They stay as indexed landing pages for Google, but leave the primary nav.

---

## 4. The cohesive ecosystem — the 5-stage spine

One setting (your scholar) personalizes five stages, and **each stage ends by handing you into the next.** This is the "one feature flowing into the next" you asked for.

**① CALIBRATE — Set your scholar (once).**
This is the identity commitment and it deserves a real home, not a dropdown. A "Your scholar" page: pick one of the five, or build custom thresholds (this is where "Custom profile" belongs — it's a scholar concept, not a portfolio one). Every verdict, drift flag, and purification number downstream is stamped "under *your* scholar." That stamp is the glue that makes the whole product feel like one thing.
→ *Handoff:* "Your scholar's set. Now check a stock against it." → ②

**② CHECK — Screen any stock (the anxiety-killer).**
Your strongest page. Keep the verdict, the cited ratios, the "scholars disagree" table. **Change the ending:** the moment after the verdict must not be a paywall. It must be **"Save to your portfolio — we'll watch it under your scholar"** (and a softer "add to watchlist" for things they're only considering).
→ *Handoff:* every verdict ends in Keep, not in a locked box. → ③

**③ KEEP — Watchlist + Portfolio (the sunk-cost asset).**
Fold Watchlist and Portfolio into **one hub** — they're the same job ("things I'm tracking"), just with/without cost basis. This is the asset the user *builds*; it must be free to build. The more they add, the more return triggers exist, the harder it is to leave.
→ *Handoff:* "You're tracking 6 holdings — here's what's drifting." → ④

**④ CATCH — Drift watch (the recurring hook = your heartbeat).**
The only reason the product earns the right to contact them. "MSFT is at 28% debt, approaching the 30% AAOIFI limit, reports in 9 days." Basic drift on a handful of holdings should be **free** — that's the hook that creates the habit. *Depth* (full 8-quarter history, unlimited holdings, email alerts) is Pro. When something drifts out, hand them a **screened halal swap** — which loops them back to ②.
→ *Handoff:* drift → "replace it" (back to Check) **and** "update what you owe" → ⑤

**⑤ CLEANSE — Purification + Zakat (the obligation = the switching cost).**
At year-end HalalGauge hands them the itemised purification statement and a zakat figure computed from the *same* portfolio. This is the highest-willingness-to-pay surface because it's a **record they keep** for charity/tax — and once they've relied on it for a year, leaving means losing their history. Purification owed should be visible free; the **downloadable, dated statement** is the natural Pro line.
→ *Handoff:* loops to ① annually ("new tax year — confirm your scholar and holdings").

**The throughline:** Calibrate once → Check kills anxiety → Keep builds the asset → Catch brings them back → Cleanse makes leaving expensive. Your scholar setting threads all five. That's an ecosystem, not a menu.

---

## 5. What to cut, merge, keep, build

**Merge (kill the sprawl):**
- The six Research surfaces → **one "Discover"** with filters (sector, basket, curated, ETFs). Remove the other five from primary nav; keep the URLs as SEO landing pages linked *from inside* Discover.
- "Portfolio score" → it's already *in* the Portfolio dashboard. Delete the duplicate nav entry.
- Watchlist + Portfolio → one **"My holdings"** hub with two views.

**Move:**
- "Custom profile" out of the Portfolio menu → into **CALIBRATE / Your scholar**. It's a scholar concept.

**Keep (they're load-bearing):**
- Screen, the multi-scholar table, cited ratios, 8-quarter history, drift watch, Zakat calculator, Methodology, the honest "what it is / isn't" block.

**Build (small, high-leverage):**
- A real **"Your scholar"** home (wire the "Pick your scholar" promise that currently 404s at /scholars).
- The **end-of-verdict handoff** on Screen ("Save & watch under your scholar").
- A **unified My-holdings hub** that surfaces drift + purification together.

**Nav, redrawn:** `Screen · Discover · My Holdings · Calculators · Learn · Pricing` — six items, each a stage of the spine or a clear support role. Compare ~20 today.

---

## 6. Redraw the Pro line (stop the paywall maze)

The current build stacks 4+ "Unlock with Pro" panels (AI report on Screen; purification + performance + AI assistant on Portfolio), several as tall empty blurs. The Skeptic is right: you're gating the habit. Re-cut it so **free forms the habit, Pro sells depth:**

**Free forever (the habit + the sunk-cost asset):**
- Set/build your scholar; unlimited screening; save to watchlist + portfolio; portfolio compliance %; **basic drift** on up to ~5–10 holdings; purification *amount* visible.

**Pro (depth & records, genuine willingness to pay):**
- Full 8-quarter history + drift across unlimited holdings; **email/push drift alerts**; the **downloadable, dated purification statement**; zakat export; AI compliance reports; performance benchmarking; multiple portfolios.

**And fix the lock pattern itself:** never a tall empty blur. Show **one real row of value + a single door** ("MSFT drift history — 8 quarters · see all under Pro"). A teaser must tease something concrete.

---

## 7. Live bugs found during the walkthrough (quick wins)

1. **Earnings disclaimer contradicts its own logic.** Portfolio + `EarningsWidget` footer still read "*within 5 percentage points of its threshold*," but the logic was corrected to relative 85%-of-cap proximity. Update the copy to match (e.g. "…within ~15% of its limit").
2. **404 page is off-brand.** "That page is out of balance" still uses the **old gold scales** icon. Cute pun, wrong mark now. Re-do with the gauge ("the needle's off the dial" / "this reading doesn't exist").
3. **`/scholars` 404s** while the homepage pitches "Browse scholars" / "Pick your scholar." Wire the promise to the new CALIBRATE page.
4. **AI Compliance Report locked panel = tall empty void** on Screen. Replace with a compact concrete teaser per §6.
5. **Demo portfolio ambiguity.** "Real positions with cost basis" labels sample data; a new user can't tell it's a demo. Label it clearly + one-click "Make this mine / Clear."

---

## 8. Prioritized sequence

**Now (cohesion, no new infra):** redraw nav to the 6-item spine; merge Research→Discover and Watchlist→My-holdings; move Custom profile into a real "Your scholar" page; add the end-of-verdict "Save & watch" handoff; fix the 5 bugs in §7; re-cut the free/Pro line so basic drift + portfolio are free.

**Next (the heartbeat):** make drift the spine's engine — surface it on My-holdings, attach the halal-swap suggestion, and make the locked states concrete teasers.

**Then (the switching cost):** the downloadable, dated purification + zakat statement as the flagship Pro deliverable.

**Gating everything (yours, not buildable here):** the credentialed scholar. The Skeptic's point stands — the ecosystem makes people churn slower, but *trust* is what makes them pay and refer. Keep that as the parallel track.

---

## 9. How to prompt me for this kind of work (you asked)

You prompted this one fine — "stress test live, run the council, make it cohesive and sticky" got us here. To make it sharper next time, give me four things:

1. **The one metric.** "Make X go up." Here it'd be *return-visit rate* or *portfolio-created rate*. A single metric forces prioritisation and kills feature sprawl.
2. **The constraint set.** "Solo, pre-revenue, no scholar yet, don't overclaim." Keeps me honest and realistic instead of proposing a 12-person roadmap.
3. **Touch vs don't-touch.** "Refactor nav and Pro-gating, but don't touch the engine or the citations." Tells me where the scalpel goes.
4. **The judgement bar.** "Run the council and only surface what survives the skeptic." Invokes the adversarial pass so you get conclusions, not a brainstorm.

A reusable template: *"Goal: move [metric]. Constraints: [reality]. In scope: [areas]. Out of scope: [protected]. Method: walk it live, run the council, give me the prioritised cut that survives the skeptic — not a wishlist."*
