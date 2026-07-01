# HalalGauge — 12-Month Roadmap
*Phased plan across four tracks. Plain English. Brutally honest. The critical path is the Scholar/Governance track — everything institutional and most trust-building is gated behind it.*

---

## The one thing to internalise first

You have a good product and no credentialed Shariah scholar. Until that gap closes, you are a **smart, transparent information tool** — not a trusted authority. Every plan below is sequenced around that fact. Do not let product polish or growth metrics distract you from the gating track. A prettier screener with no scholar is still un-trustable to the people who matter.

**The critical path (the chain that actually blocks everything):**
> Frankel intro → finance-qualified scholar contact → informal review of methodology → named advisor on the site → design partner willing to be associated → any institutional conversation.

Everything else (ETFs, crypto engine, SEO) can move in parallel but does **not** unblock the chain. Spend your scarcest resource — your time and your credibility asks — on the chain first.

---

## Legend

- **[GATEKEEPER]** = nothing meaningful unlocks until this is done. Non-negotiable, on the critical path.
- **[CORE]** = high-value, do it, but not existentially blocking.
- **[NICE]** = do only when the above are handled or when it's cheap/opportunistic.

---

## TRACK A — Product

Sequencing logic: extend coverage into the assets your existing retail users already ask about (ETFs/REITs/funds), because those reuse your ratio engine and cited-source model. Push the crypto engine **late** — it's a different methodology, more contested among scholars, and higher reputational risk while you still have no scholar to stand behind it.

### Phase 1 (Months 0–3)
- **Halal Asset Map — finish and harden** [CORE]. It's your best SEO and education asset (see Track D). Make sure all 63 asset-class entries cite sources and carry the "information, not a fatwa" disclaimer. This is a content moat and a lead magnet — treat it as marketing infrastructure, not a side feature.
- **Stock screener — quality over count** [CORE]. Do NOT chase stock count. 650 well-sourced, correct verdicts beat 3,000 shaky ones. Every wrong verdict is a credibility bomb once a scholar or a sharp user finds it. Lock a data-quality QA loop first (see Track C).
- **Drift watch + purification calculator — validate accuracy** [CORE]. These are your differentiators. Confirm the drift logic against at least a handful of real pre-earnings cases so the feature earns trust rather than crying wolf.

### Phase 2 (Months 3–6)
- **ETF / REIT screening** [CORE]. Natural next step; reuses the ratio engine (look-through to underlying holdings for ETFs; asset-composition + income screens for REITs). REITs are methodologically fiddly (rental income vs. interest, leverage) — flag these as the questions to put to the finance scholar once you have one. **Do not ship a REIT verdict you can't cite.**
- **Standard coverage parity** [CORE]. Whatever new asset type you add, add it across the existing scholarly standards, or clearly mark which standards it's not yet screened under. Half-covered standards break the core "pick your standard" promise.

### Phase 3 (Months 6–9)
- **Funds / mutual funds screening** [CORE]. Look-through screening at scale. Depends on holdings data licensing (Track C) — verify Twelve Data or a secondary provider actually gives you fund constituents before you promise this.

### Phase 4 (Months 9–12)
- **Crypto screening engine** [NICE / deliberately late]. Contested territory. Do NOT ship until (a) you have a scholar who will engage on it, and (b) you can present it as "here are the differing scholarly views + our transparent criteria," not a verdict. Shipping crypto verdicts with no scholar is the single fastest way to torch your credibility. **Flag to verify:** confirm your chosen standards even have a published position on crypto before implying one.

---

## TRACK B — Scholar / Governance  ← THE GATING TRACK / CRITICAL PATH

This is the whole ballgame. If you do nothing else well this year, do this.

### Phase 1 (Months 0–3)
- **[GATEKEEPER] Frankel relationship — convert to an intro.** He is academic, likely not a finance mufti (you already know this). The realistic, correct ask is: informal advice + an **introduction to a finance-qualified scholar**. Do not ask him to "approve" the finance rules. Get one warm intro out of the relationship and you've moved the critical path forward more than any product feature could.
- **[GATEKEEPER] Land a first informal review** of the Methodology Brief by anyone finance-qualified (even a junior scholar or a Shariah advisory associate). You need a real person to say "this is broadly sound, here's what to fix." Their critique becomes your fix-list and, eventually, their name (if willing) becomes your first credibility signal.
- **[CORE] Governance page — honesty scaffolding.** Publish a clear "How we're governed / what we don't yet have" page. Stating plainly "no formal Shariah board yet — here's our path" is more trustworthy than vague implied authority, and it protects you legally and reputationally. Never imply certification you don't have.

### Phase 2 (Months 3–6)
- **[GATEKEEPER] Named advisor secured.** Move from "informal review" to at least **one named advisor** willing to appear on the site. This is the single biggest trust unlock of the year. One credible named finance scholar changes what you're allowed to claim and who will take a meeting.
- **[CORE] Formalise the review scope.** Define exactly what the advisor has reviewed (e.g. "reviewed the AAOIFI and DJIM screening logic") vs. not, so your claims stay precise.

### Phase 3 (Months 6–12)
- **[CORE] Path toward a review panel / board** (2+ scholars, or a defined review cadence). Full certification (e.g. a Shariah audit) is likely a Year-2 goal and possibly costly — **verify the cost and process** before promising it. Don't overbuy governance you can't afford; one solid named advisor + a documented methodology beats an empty "advisory board" page.

**Blunt truth:** if by Month 6 you have zero named finance-qualified scholar attached, treat that as a red alert, not a footnote. Re-prioritise everything toward fixing it. Product will not save you.

---

## TRACK C — Data / Legal

Foundational plumbing. Mostly [CORE] — necessary, not differentiating, but if it breaks it poisons everything (a wrong ratio = a wrong verdict = lost trust).

### Phase 1 (Months 0–3)
- **[GATEKEEPER-ish] HK incorporation — finish it.** It's in progress; close it out. You cannot sign a data licence, take grant money, or enter an accelerator cleanly as an unincorporated person. It gates the funding and institutional tracks. (Marked gatekeeper because Tracks D-institutional and Funding depend on it.)
- **[CORE] Complete the Twelve Data migration** and lock a **data-licensing check**: confirm your licence actually permits (a) displaying derived halal verdicts publicly and (b) any future paid tier. **Verify the licence terms in writing** — redistribution/derivative-data clauses are where fintechs get burned.
- **[CORE] Data-quality QA loop.** Automated sanity checks on financials (nulls, stale fields, absurd ratios) + a manual spot-check cadence. Your verdicts are only as trustworthy as the worst data point behind them.

### Phase 2 (Months 3–9)
- **[CORE] Coverage expansion, quality-gated.** Grow stock count only as fast as QA can vet it. Prioritise the markets your users and any SE-Asia design partner actually care about (see Funding doc: Malaysia/Indonesia coverage angle).
- **[CORE] Disclaimers + ToS reviewed.** As you approach any revenue or partner, get the "information, not financial/religious advice" language checked. Cheap insurance.

### Phase 3 (Months 9–12)
- **[NICE] Fund/holdings data licensing** to support Track A Phase 3. Verify availability and cost before committing the funds-screening feature.

---

## TRACK D — Go-to-Market (retail-first)

Near-term revenue and traction come from **retail + becoming the cited authority**, not institutions. Institutions are a 2–3 year relationship game (see the Institutional GTM doc). This track is where you can safely move fast now.

### Phase 1 (Months 0–3)
- **[CORE] Content/SEO engine off the Asset Map.** The 63-asset-class map is a natural SEO surface: one indexable, genuinely-useful page per asset class ("Is [X] halal?"). This is your cheapest, most durable growth lever. Own the "is it halal" search intent.
- **[CORE] Retail growth loops.** Portfolio tracking + drift watch are retention features — lean on them. Ship shareable outputs (e.g. "your portfolio's compliance snapshot") that users naturally post in Muslim finance communities.
- **[CORE] Community presence** in the halal-investing communities you already know. Be the transparent, no-black-box voice. Under-promise on authority (no scholar yet), over-deliver on transparency.

### Phase 2 (Months 3–6)
- **[GATEKEEPER for the partner sub-goal] First design partner — small, not tier-1.** A **halal fintech, an Islamic-finance educator, or a community org**. NOT Standard Chartered, NOT a bank. The goal is a real user of your screening as an embedded/white-label feed or a co-branded tool, giving you a reference logo and product feedback. This is realistic and near-term; a bank is not.
- **[CORE] Instrument everything.** You're pre-revenue — get real usage/retention data so the accelerator applications (Funding doc) have numbers.

### Phase 3 (Months 6–12)
- **[CORE] Introduce monetisation carefully.** Likely a modest pro tier (deeper screening, portfolio limits, drift alerts) — verify none of it implies religious certification you lack. Keep the core screener free to protect the "cited authority" positioning.
- **[NICE] Thought-leadership** (writeups on methodology, transparency) that make HalalGauge the thing people *cite*. Becoming the cited reference is a slow compounding asset and pairs directly with the scholar track.

---

## The critical path, one more time (pin this)

1. **Incorporate** (Track C) — unblocks money and partnerships.
2. **Frankel → finance-scholar intro** (Track B) — unblocks trust.
3. **Informal review → named advisor** (Track B) — the biggest unlock of the year.
4. **First small design partner** (Track D) — your first real reference, not a bank.
5. Everything in Product (Track A) rides alongside but does **not** substitute for the above.

**If you're ever unsure what to work on:** ask "does this move the scholar chain or the incorporation?" If no, and it's not cheap, it waits.

---

## Things to verify before relying on them (flagged, don't invent)
- Whether Frankel will/can actually make a finance-scholar intro (assume "maybe," plan a plan-B outreach list).
- Twelve Data licence terms for public derivative-data display and paid tiers.
- Whether fund/ETF **constituent** data is available and licensable at your budget.
- Real cost and process of any formal Shariah certification/audit (likely Year-2).
- Whether your implemented standards have published positions on crypto/REITs before you ship verdicts for them.
