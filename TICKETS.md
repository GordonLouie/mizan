# Mizan Product Tickets

Living list of bugs, UX gaps, and feature improvements. Sourced from real-user feedback sessions.

---

## Priority 1 — THE BLOCKER

### TICKET-001: Expand ticker universe beyond 163 prototype tickers
**Source:** Ibrahim Malik session, 2026-06-04
**Quote:** *"More stocks is the most important — when there's a potential stock people are buying, I look at whether it is halal or not"*

The current 163-ticker prototype dataset is the single biggest reason users can't actually use Mizan for their own portfolios. Without coverage, Mizan is a demo, not a tool.

**Sub-tasks:**
- [ ] Determine target universe size (S&P 500 minimum? Russell 3000? Global mid-caps?)
- [ ] Re-evaluate FMP API tier — current free tier may bottleneck this
- [ ] Audit `enrichStocks.ts` script for batch-add performance
- [ ] Define ticker-add cadence (weekly batch? on-demand?)
- [ ] Add a "request a ticker" path on `/screen` empty state for missing tickers

---

## Priority 2 — UX gaps flagged by real users

### TICKET-002: Inline source citations on verdict pages
**Source:** Ibrahim Malik session, 2026-06-04
**Quote:** *"We should try to reference where the numbers are coming from, cross check if needed"*

Currently citations live on `/methodology`. Ibrahim wanted to see the source reference INLINE on the verdict page itself — next to each threshold check, ideally with a "see source" hover or expandable note.

**Sub-tasks:**
- [ ] Audit `ComplianceCard.tsx` — add small source label next to each ratio check
- [ ] Format: "AAOIFI Std 21 §X.Y" or "Mufti Taqi Usmani, published 2020"
- [ ] Optional hover/expand for the full citation chain
- [ ] Don't clutter — keep the verdict hero prominent, citations as quiet secondary

### TICKET-003: Data lag visibility
**Source:** Ibrahim Malik session
**Note:** Ibrahim flagged that financial data feels lagging. Mizan currently shows "Data as of Q1 2026" in the verdict card. Could be more prominent / explanatory.

**Sub-tasks:**
- [ ] Make "Data as of [quarter]" more visible on the verdict page (not buried in meta row)
- [ ] Add a small tooltip: "Updated quarterly with each company's earnings release"
- [ ] On `/methodology`: explain the data-update cadence transparently

---

## Priority 3 — Deprioritize / reposition

### TICKET-004: Reconsider Purification feature placement
**Source:** Ibrahim Malik session
**Quote:** *"a lot of companies offer in dividend and this person is not getting paid, so this person does not use any purification — you can kind of calculate on your own"*

Purification isn't useful for young investors who don't have dividend income. Don't kill the feature, but stop leading with it.

**Action:**
- [ ] Demote `/purification` from primary nav? Move under "Tools" only.
- [ ] Add copy clarifying when purification matters (dividend-paying stocks, larger portfolios)

### TICKET-005: Reconsider Zakat calculator priority
**Source:** Ibrahim Malik session
**Note:** "Could be important for older investors, but for him it's easy to calculate manually — 2.5% of wealth"

Same as Purification — useful but not differentiating. Don't lead with it.

### TICKET-006: Crypto verdicts feel dubious
**Source:** Ibrahim Malik session
**Quote:** *"He's not sure about crypto, is kinda dubious"*

The `/crypto` page may need more methodology clarity — Ibrahim's intuition was that crypto verdicts felt less trustworthy than stock verdicts.

**Sub-tasks:**
- [ ] Audit `/crypto` page methodology presentation
- [ ] Make scholar-by-scholar reasoning more explicit for crypto
- [ ] Add disclaimer that crypto is in earlier development

---

## Priority 4 — Operational (not user-facing)

### TICKET-007: Quarterly data update process
**Source:** Ibrahim Malik session (mentioned as awareness, not bug)
**Note:** Ibrahim flagged the operational challenge of updating all stocks quarterly. This is a Mizan-internal scaling concern.

**Action:**
- [ ] Document the data-refresh playbook
- [ ] Automate FMP enrichment runs on quarterly earnings cadence
- [ ] Add data-freshness monitoring (alert if any ticker's data is >120 days old)

---

## Closed / not-yet-actioned

(none yet)

---

*Last updated: 2026-06-04 after Ibrahim Malik session.*
