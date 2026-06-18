# HalalGauge — full product redesign proposal

A proposal to react to *before* any building. Goal: turn a pile of working
features into one coherent product that is positioned strongly for **retail** and,
more importantly, credibly for **institutions** — and to fix the "clustered,
first-version" feel (especially the indexes). Domain secured: **halalgauge.com**.

---

## 0. Brand & positioning

**Name:** HalalGauge — you *gauge* (measure/assess) a stock's halal status.
**Tagline options** (pick one):
- "Gauge any stock. Invest with conviction." (action + benefit)
- "Know it's halal — and why." (transparency)
- "The halal compliance gauge for investors and institutions." (descriptive, dual)

**Positioning statement (the north star):**
> HalalGauge is the transparent, multi-scholar engine for halal investing — free
> for anyone to gauge a stock, and the auditable screening + index infrastructure
> that funds, banks, and pension providers can build Shariah products on.

One product, two faces. Everything below serves that.

---

## 1. What's wrong now (your critique, made concrete)
1. **A pile of tools, not a journey.** Screen, indexes, builder, AI report, portfolio
   are separate islands. Nothing links to anything. A visitor (or an MPFA reviewer)
   never gets pulled from one to the next.
2. **Indexes feel first-draft & clustered.** `/indexes` stacks cards + a "build"
   button + a comparison table on one page. The builder is bolted on. No hierarchy.
3. **Institutional is a page, not a posture.** `/institutions` exists, but the rest
   of the product doesn't *feel* institution-grade or lead an institution anywhere.
4. **Retail first-run is unclear.** A newcomer doesn't instantly get "gauge any stock
   for halal, free, across scholars."
5. **Inconsistent polish.** The screening breach-risk cards are excellent; other
   surfaces don't meet that bar. We should make those cards the design standard.

---

## 2. Two audiences, one engine

**Retail (acquisition + $9.99 Pro):** a Muslim investor who wants to know "is this
halal, and can I trust it?" Journey: search a stock → clear verdict + why → explore
similar halal names / indexes → (Pro) charts, AI report, portfolio compliance.

**Institutional (the high-ticket, HK wedge):** an MPF provider / bank / fund that
wants to launch Shariah products but lacks infrastructure and scholar access.
Journey: lands on "For Institutions" → sees auditable methodology + indices + API →
books a call → pilot (custom index / data feed / white-label).

Shared engine: deterministic multi-scholar screening · real price/index data ·
grounded AI · (future) scholar-reviewed methodology.

---

## 3. Information architecture (the core rework)

**New top nav:** `Screen · Indexes · For Institutions · Pricing` + right: `Account`.
(Move Learn/Discover/tools into a single tidy "More" menu; declutter.)

**Indexes becomes a real hub** (fixes the clustering) — one page, four clear tabs:
- **Explore** — the curated indexes (Core / Tech / Income) as clean cards.
- **Compare** — the risk/reward table (return, vol, Sharpe, drawdown, beta) vs S&P.
- **Build** — the custom builder.
- **Methodology** — how indexes are constructed + honest limits.

(Today these are stacked on one scroll; tabs give hierarchy and stop the clutter.)

**For Institutions becomes a proper section**, not one page: Solutions (index
licensing, data API, white-label, audit screening) · The HK opportunity · API docs ·
Methodology · Book a call.

---

## 4. The integration map (make it a journey)
Concrete cross-links so features feed each other:
- **Stock result →** "Appears in: Halal 50" chip (links to that index) · "Halal
  alternatives" (already there) · "Generate AI report" · "Add to portfolio" · "Build
  an index from this sector."
- **Index page →** constituents already link to Screen; add "Build a variant" → Builder.
- **Portfolio →** "Get AI assessment" (there) + "Swap suggestions" feed back to Screen.
- **Everywhere Pro is gated →** consistent upgrade path to /pricing.
This is the single biggest lever to stop it feeling like islands.

---

## 5. Page-by-page redesign

**Home (retail-first, institutional band):**
- Hero: big search — "Gauge any stock's halal status — free, across 6 scholars" — with
  the live verdict demo (AMZN). One clear action.
- Then: how it works (3 steps) · indexes teaser → hub · AI report teaser · trust strip
  (cited sources, data integrity).
- Bottom band: "For institutions — Shariah infrastructure for HK and beyond" → section.

**Screen (the core, tighten + link):** keep the excellent verdict card + breach-risk
checks; add the cross-links above; make the data-quality "under review" state graceful.

**Indexes hub:** the tabbed structure in §3. Each index page: stats → chart →
methodology caveat → constituents, with "build a variant" CTA.

**For Institutions:** lead with the HK case (below), then solutions, API spec, methodology, contact.

**Pricing / Account:** fine as-is; ensure the upgrade path is consistent.

---

## 6. Institutional positioning — the HK wedge (research-grounded)
HK's gap is **not** "no halal index" (FTSE & DJIM publish HK/China Shariah indices).
Per current sources the real gaps are: **almost no retail-accessible Shariah products,
limited issuer know-how, and a lack of access to Shariah scholars** — and the
government is actively pushing to grow Islamic finance.

**So HalalGauge's institutional story:** be the *infrastructure layer* that lets HK
institutions actually ship Shariah products — transparent screening + index
construction + a compliance API + (once engaged) a scholar-reviewed methodology that
plugs the "scholar access" gap directly. Upsell ladder: data API → custom index
licensing → white-label reports → a Shariah MPF/fund enablement partnership.

---

## 7. Visual / UX polish principles
- **Make the breach-risk card the standard** — cards, status colours (emerald/amber/
  red), generous whitespace, real type hierarchy, section icons. Audit every surface to it.
- **Progressive disclosure** — summary first, detail on demand (stop cramming).
- **Consistency** — one button system, one card system, one spacing scale.
- **Mobile** — verify on device (the remote tooling can't emulate viewport).

---

## 8. Still lacking (maturity gaps — from the game plan, unchanged)
Coverage (HK/international — needs the enrichment script extended + your FMP run),
data verification at scale, a Shariah scholar, production Stripe/Clerk keys, legal
review, and real user/design-partner validation. The redesign doesn't remove these
Stage-1 gates; it makes the product worth putting in front of them.

---

## 9. Proposed build sequence (after you approve)
- **A. Rebrand → HalalGauge** across the app (wordmark, copy, metadata, OG) + connect
  halalgauge.com + 301s from mizaninvesting.com.
- **B. IA rework** — new nav + Indexes hub (tabs) + the cross-feature linking (§4).
- **C. Home + For-Institutions** rebuild (§5–6).
- **D. HK coverage** — extend enrichment to HKEX/international, you re-run, re-audit.
- **E. Polish pass** — design-language consistency + mobile.

---

## 10. Decisions I need from you
1. **Tagline** — which of §0 (or your own)?
2. **Primary emphasis** — retail-led growth with institutions as the prize, or
   institutional-first (slower, higher ticket)? (Affects home + sequencing.)
3. **Rebrand now or after the IA rework?** (Rebrand is cosmetic; IA is the substance —
   I'd suggest IA + integration first, rebrand alongside.)
4. **Scope of this redesign round** — all of A–E, or start with B+C (the cohesion fix
   you care most about) and sequence the rest?
