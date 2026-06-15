# MIZAN — project state handoff

A self-contained briefing for a fresh chat to pick up exactly where the
previous session left off. Read this end-to-end before acting on anything.

Last update: **~Day 16 of 30** (start date 2026-05-29, exit gate ~2026-06-28).
Today: 2026-06-13.

---

## Session update — 2026-06-15 (read this first)

Built **Phase 1 (price charts/ROI)** and **Phase 2 (halal indexes)** of the
masterplan. All build-clean (tsc passes), gated behind `LockedFeature` (Pro).

NEW FILES: `src/lib/indicators.ts`, `src/lib/indexes.ts`, `src/lib/indexes.server.ts`,
`src/components/PriceChart.tsx`, `src/components/PortfolioPerformance.tsx`,
`src/components/IndexPerfChart.tsx`, `src/app/api/prices/[ticker]/route.ts`,
`src/app/indexes/page.tsx`, `src/app/indexes/[slug]/page.tsx`. Sitemap + /screen +
/portfolio wired up. Index selection switched to **AAOIFI** (Taqi was too strict —
rejected asset-light tech, gave empty Tech index).

### Price data — VERIFIED CORRECT (earlier "corrupt" scare was a false alarm)
I initially flagged the feed as corrupt (Micron $1,054, SanDisk $2,063, NFLX
$80). **That was wrong** — anchored on my pre-split / pre-boom knowledge cutoff
(May 2025). Verified against live quotes (Jun 2026): Micron really is ~$1,060
(ATH $1,089 Jun 3), SanDisk really is ~$1,995 (+692% YTD on the AI/NAND
shortage), NFLX did a ~10:1 split. The 2025-26 AI semiconductor/memory boom is
real and beyond my training. **The feed is accurate; trust it.**
Kept `fetch_prices.mjs` on the **full**/adjClose endpoint (correct either way).
Removed the over-aggressive index guard (it was hiding real top performers);
`indexes.server.ts` now only drops true unadjusted-split glitches (>+400%/<-80%
one-day).

### Phase 3a — AI compliance report (built, gated, inert without key)
INTEGRITY MODEL: verdict + every ratio come from the deterministic screener;
Claude writes ONLY the prose, under a strict system prompt (never change the
verdict, never invent numbers/rulings). UI renders the deterministic facts +
ratio table itself; AI sections sit alongside; downloadable as .md.
NEW: `src/lib/ai.ts` (Anthropic REST, no npm dep, inert without ANTHROPIC_API_KEY),
`src/lib/aiReport.ts` (facts builder + grounded prompt + JSON parse/validate/
fallback), `src/app/api/ai/report/route.ts` (POST, best-effort per-IP daily cap
via KV), `src/components/AIReport.tsx` (client; honest no-key state). Wired into
`/screen` gated `aiReport` (now **retail** per matrix). `.env.local.example` +
ANTHROPIC_API_KEY/ANTHROPIC_MODEL. tsc clean.
TODO (Phase 4): the `/api/ai/*` routes are gated client-side only — harden with
auth so the paid endpoints can't be called directly once a key is live.

### Phase 3b — AI portfolio assistant (built, gated, inert without key)
Same integrity model. NEW: `src/lib/aiPortfolio.ts` (deterministic weighted
halal %, per-holding verdict/issues/value/weight, halal SWAP candidates via
findHalalAlternatives, notCovered list; Claude writes only the narrative and may
ONLY reference supplied swaps), `src/app/api/ai/portfolio/route.ts`,
`src/components/AIPortfolioAssistant.tsx`. Wired into `/portfolio` gated
`aiReport`. Both AI features GUARD against scholar="custom" (server can't see the
user's localStorage custom thresholds → would falsely pass everything): the UI
disables generate for Custom and the routes 400 `custom_unsupported`. tsc clean.

### Phase 3c — AI Q&A (built, inert without key) — PHASE 3 COMPLETE
NEW: `src/lib/aiAsk.ts` (grounded scholar Q&A — pulls closest vetted KB entries as
context, never invents fatwas/citations), `src/app/api/ai/ask/route.ts` (FREE +
KV-rate-limited — it's a public acquisition surface, unlike the Pro reports).
Wired into `/ask`: "Ask AI for a tailored answer" button → renders AI answer +
citations + caveat; KB stays primary. Portfolio-level Q&A: `generatePortfolioAnswer`
in aiPortfolio + optional `{question}` on `/api/ai/portfolio` + a follow-up
question box in AIPortfolioAssistant ("Which swap raises my halal % most?"). tsc clean.

Phase 3 (AI layer) DONE: 3a stock report, 3b portfolio assistant + swaps, 3c Q&A
(general + portfolio). All gated/free per matrix, all inert without ANTHROPIC_API_KEY.
Optional later: AI report on `/indexes/[slug]`.

### Phase 4 — tiering, paywall, AUTH (built, inert without keys)
Decisions: **Pro = $9.99/mo or $89/yr** (market: Zoya ~$8/mo·$100/yr, Musaffa
$7.49+/mo); institutional = sales-led. **Auth = custom passwordless magic-link**
(fits the stack; reuses KV + Resend; no vendor/deps).
NEW: `src/lib/auth.ts` (HMAC magic-link [15min, single-use via KV] + httpOnly
Secure session cookie [30d]; tier looked up LIVE from KV `mizan:tiers`, never in
the cookie). Routes: `/api/auth/request|callback|logout`, `/api/me`,
`/api/billing/portal`. `/api/checkout` now takes plan monthly|annual + attaches
session email. Webhook = retail on checkout (institutional manual). AI report +
portfolio routes now ENFORCE tier server-side (402) — but only once AUTH_SECRET
is set, so pre-go-live nothing changes. `useEntitlement` reads `/api/me` (server
truth) when auth is on, else localStorage dev override. Pages: `/pricing`
(finalised matrix + monthly/annual toggle + current-plan badge) and `/account`
(magic-link sign-in + plan + manage billing + sign out). Nav has Pricing +
Account. LockedFeature "Unlock" → `/pricing`. tsc clean.

GO-LIVE ORDER (when ready to charge):
 1. Stripe: create Product + 2 prices ($9.99/mo, $89/yr) → STRIPE_PRICE_RETAIL +
    STRIPE_PRICE_RETAIL_ANNUAL + STRIPE_SECRET_KEY; add webhook → STRIPE_WEBHOOK_SECRET.
 2. KV (Upstash) → KV_REST_API_URL/TOKEN (tiers, single-use links, rate limits).
 3. Resend → RESEND_API_KEY + verified domain (sends sign-in links).
 4. AUTH_SECRET = 32-byte hex (turns ON enforcement). Set LAST.
 5. Seed your own access: add your email to KV `mizan:tiers` as "institutional"
    (otherwise once AUTH_SECRET is set you'll be "free" and gated like everyone).
SECURITY: auth is hand-rolled — get it reviewed before heavy reliance. Known
follow-ups: dedupe is fine; consider CSRF token on POST auth routes, and a
`customer.subscription.updated` handler for plan changes.

### Phase 4c — institutional API (built, inert without KV keys)
NEW: `src/lib/apiKeys.ts` (Bearer key → {email,tier} from KV `mizan:apikeys`;
inert without KV) + `GET /api/v1/screen` (institutional-only bulk screening
export; params tickers/scholar/format[json|csv]/limit; deterministic data only;
per-key daily quota). Issue a key by adding to KV: `mizan:apikeys = {"<key>":
{"email":"firm@x.com","tier":"institutional"}}`. White-label reports + multi-seat
= deferred (demand-driven). tsc clean.

### Phase 5 — coverage & scale (pipeline READY, pending your FMP run)
5a: `scripts/enrichStocks.ts` already supports `MIZAN_UNIVERSE=us` (full US
universe via FMP screener) + `MIZAN_MIN_MARKETCAP`. To expand: run enrich with
that flag, then `scripts/fetch_prices.mjs`, then commit. (Reminder scheduled for
2026-06-16 10:30.) 5b perf: on-demand OG/pages already done — revisit at scale.

### Phase 6 — brand & business (your decisions/actions)
Mostly non-code: register HK company + bank (enables billing payout), naming
decision (keep "Mizan" + clearer tagline vs rename — Chong's point), one-pager,
institutional outreach (product now ready), competitions, YouTube, media. Claude
can draft the one-pager / outreach on request.

STATUS: Phases 1–4 (incl. 4c) built & deployable; Phase 5 pipeline ready (your
run); Phase 6 is business-side. Scheduled reminders: Anthropic key (10:00),
go-live keys + data runs (10:30), both 2026-06-16.

### Real index numbers (gated, Pro): Halal 50 **+223%**, Halal Tech **+431%**, Income **+80%** vs S&P ~+23% (~16mo)
Genuine arithmetic — halal baskets exclude banks, skew tech/semi, equal-weight
rewards the smaller names that ran hardest. CAVEAT (disclosed on-page): selection
uses **current** constituents → look-ahead/survivorship bias inflates trailing
returns. A point-in-time rebalanced index is a later-phase fix (Chong will flag
this). Numbers are real but framed as "today's basket's trailing performance,"
not a live track record.

---

## Session update — 2026-06-13 (read this first)

A long working session. What changed since Day 11:

### Data integrity (shipped, live)
- **Found + fixed a systemic FX currency bug.** 21 foreign-listed tickers
  (Toyota, Sony, MUFG, Alibaba, TSMC, Novo, etc.) had balance sheets ingested in
  local currency but tagged USD, so ratios were absurd (Toyota debt = 18,793% of
  market cap). Fixed in the DATA (`scripts/fix_fx_currency.py`, documented FX
  rates) AND at the PIPELINE source (`fmpFetch.ts` now reads `reportedCurrency`
  and converts to USD across all 3 ratio paths). Several names (Sony, Wipro, Dr
  Reddy's, TSMC, Novo) were wrongly failing and now pass correctly.
- Mega-cap market caps verified CORRECT for June 2026 (the old "$4.5T looks
  wrong" worry was stale). Removed ATVI + TWTR (confirmed delisted).
- Full audit in `DATA_AUDIT_2026-06-09.md`. Verdict history for the 21 converted
  tickers was cleared (can't rebuild reliably) → shows "being ingested".

### Product (shipped, live)
- **Self-hosted company logos** (`public/logos/*.png` + `fetch_logos.mjs`) —
  fixed the broken/slow Clearbit loading. `CompanyLogo` now local-first.
- **Inline per-ratio citations** wired on /screen (Ibrahim's ask).
- **Feedback bubble** rewritten: now just shows + copies hello@ email (no
  mailto, no failure modes). Web3Forms key `4a6a5ea7-...` is in the code.
- **Favicon + feedback bubble** recolored to brand navy `#1B2D4A`.

### Distribution engine (shipped, live) — the big one
- **Engine 1 (programmatic SEO) is LIVE:** `/halal/[ticker]` server-rendered
  indexable pages for all ~340 tickers (verdict table, cited sources, JSON-LD),
  dynamic per-ticker OG share cards, `/halal` hub, `/crypto/[slug]` pages (~12),
  a new ETF blog post, ETF pages fixed (SPY/QQQ correctly show "not
  Shariah-screened" via `etfInfo.ts`). Sitemap submitted to Google Search
  Console (verified; status Success).
- **Engine 2 (coverage):** `enrichStocks.ts` upgraded with `MIZAN_UNIVERSE=us`
  full-universe mode — RUN IT with the FMP key (paid tier) to grow 340→thousands.
- **Engine 3 (retention):** `EmailCapture` component live + wired into the
  ticker-not-found state. Full alert-sending system (verdict-change/earnings
  emails) spec'd in `RETENTION_SETUP.md` — needs a store + Resend + Vercel Cron.
- Plans: `SCALE_PLAN_builder.md`, `VALIDATION_GAMEPLAN_2026-06-10.md`,
  `HK_FIRST_2WEEK_PLAN_2026-06-12.md`, `TODAY_2026-06-10.md`,
  `OUTREACH_SEND_QUEUE_2026-06-09.md`, `LINKEDIN_COMMENT_PLAYBOOK_2026-06-09.md`,
  `CONTRIBUTOR_BRIEF.md` (for a non-Muslim engineer friend offering help).

### Outreach / validation state
- **4 academics replied** (all CUHK): Terence Chong (Zoom Mon 15 Jun 3pm HK),
  Pawee Jenweeranon (Law; sending slots; WhatsApp +66639094725), James Frankel
  (Director, Centre for Study of Islamic Culture; Zoom proposed Tue/Wed next
  week — best scholar-intro path), Frankel reply pending Gordon's send.
- HKUSTSU forwarded Mizan to their main group chat (semi-prompted).
- 4 LinkedIn DMs (Mohamed/HSUHK, Bibi/HKU, Faridah, Haneen) — reminder set for
  06-12 10am to send; sharper personalized drafts exist in chat.
- Strategy decided: **HK-first beachhead** (online only — Gordon can't do
  in-person), keep Miqdad as advisor (solo ceiling accepted), read is
  "distribution problem (B)" — but retention NOT yet measured (the real test).
- **Still 0 unprompted shares.** Vercel: ~170 visitors/wk, all from Gordon's own
  channels (no organic yet — SEO engine just launched to fix that). Funnel
  healthy (~42% landing→/screen).

### The honest throughline
The build is now comprehensive (data fixed, product polished, SEO engine live).
**None of it moves the 30-day gate**, which turns on shares + retention — the
human signal from the calls, HK forwards, and whether testers return. SEO
compounds over 6–12 weeks; the gate is ~2 weeks out. Next session: push the
validation/human work, not more code.

---

## Who Gordon is

- **Year 2 medical student at CUHK** (MBChB)
- Not Muslim — open about that in every outreach
- Hong Kong based
- Mizan is a side project, not commercial primary work
- Has been building this for ~1 year

---

## What Mizan is

**mizaninvesting.com** — a free, multi-scholar halal stock screener for
retail Muslim investors. Live, deployed on Vercel.

**The differentiator:** the only halal screener that implements **Mufti Taqi
Usmani's illiquid-asset rule**, and the only one that shows verdicts under
all 6 mainstream scholarly methodologies side-by-side (AAOIFI, Mufti Taqi,
S&P DJIM, Ja'fari, the strict view, plus a custom-thresholds builder).
Every threshold cites a primary source (AAOIFI Standard No. 21, Mufti
Taqi's published rulings, SEC 10-Q filings). No black-box scores.

Free, no signup, no account. Zero data collection — watchlist + portfolio
live in browser localStorage.

**Stack:** Next.js 15 (App Router), React, TypeScript, Tailwind v4.
342 tickers in the universe, ~309 with future earnings dates, 8-quarter
verdict history per stock, full balance sheet snapshots with filing URLs.

---

## Core advisors / inner circle

- **Miqdad** — Founding Advisor. Gordon's closest Muslim friend. CUHK.
  Public name OK (his own permission). His role is the cultural-cover
  asset — every outreach can mention him as Founding Advisor.
- **Ibrahim Malik** — CUHK MSA. Inbound feedback contact who gave the
  strongest single piece of qualitative feedback so far (5 verbatim
  quotes in the tracker, all public-OK). His key feedback: "more stocks
  is the most important." Has been emailed an update.

## "The Council" — Gordon's decision framework

Gordon uses a multi-perspective "Council session" framework to pressure-
test decisions. Voices include: Product Voice, Distribution Voice, Founder
Voice, Skeptic, Pragmatist. When something significant comes up (e.g. the
AI-design feedback from Anas), run a Council session before deciding.

**Pre-committed exit criterion:** If by Day 30 there are fewer than 3
**unprompted shares** (someone forwards Mizan to a friend without being
asked), Gordon exits. No second-guessing. The Council pre-committed this
number so emotion can't revise the bar later.

Currently: **0 unprompted shares.** 19 days remaining.

---

## What's shipped (Day 1-11)

### Outreach
- LinkedIn post (Day 11) — Version A from `LINKEDIN_POST_DRAFTS.md`, quote-
  led, anchors on Ibrahim Malik. First comment posted within 2 min.
- 4 HK Muslim community orgs DM'd (Day 11): Muslim Council HK, Council of
  HK Muslims, Islamic Union HK, HK India Club. **Islamic Union of HK
  replied** asking for WhatsApp/email — Gordon has replied with contact.
- 4 CUHK academic emails sent (Day 11): 3 of 4 confirmed sent (Pawee
  Jenweeranon CUHK Law, Prof. Frankel CSIC, Prof. Terence Chong Econ);
  Dr. HoiYan Kwok still pending send. All redrafted with "Year 2 Medicine
  CUHK" identity.
- HKIYA Instagram DM drafted (pending send).
- PolyU MSA follow-up drafted (pending send).
- Ibrahim Malik update email drafted with three-asks-addressed framing
  (pending send — Gordon may have already sent it).
- US MSA Instagram blitz suggested (MIT, Harvard, Stanford, Berkeley,
  UCLA, NYU, Columbia, UPenn, Princeton, U Michigan) — not yet sent.
- Earlier Days 1-6: 8 HK MSAs IG'd (Day 6); CUHK MSA inbound → Ibrahim
  Zoom session; HKUST Muslim Society replied with "excellent and timely
  solution" + suggested SSB review before going wider; LinkedIn connects
  to Tier-1 scholars (Faraz, Joe, Rakaan, Ibrahim Khan IFG, Mohsin Patel
  — Mohsin accepted, others pending).

### Product/code (most recent changes)
- **Forest palette** — replaced cream `#FAF7F0` + gold `#E8C547` (named in
  the Taste skill's banned premium-consumer palette list) with deep emerald
  `#1C4537` + muted amber `#C89030`. `tailwind.config.ts` keeps `navy` and
  `gold` class names but redefines the HEX values.
- **Sans display font** — `--font-display` CSS variable in `globals.css`,
  Geist Display first with graceful system stack fallback. All `Georgia,
  serif` inline styles across ~30 files migrated. MizanWordmark preserved
  with Georgia (only place serif remains).
- **Asymmetric hero** on landing — replaced centered text-heavy hero with
  60/40 split: left content (headline, tagline, search, secondary CTA,
  privacy line), right `HeroVerdictCard` showing AMZN under all 5 scholars
  with their actual deciding metrics.
- **Privacy trust line** on landing: "No signup · No data collected · Your
  watchlist stays on your device" — direct response to Anas's "AI sites
  trigger data-sharing anxiety" feedback.
- **Em-dashes** removed from user-facing copy on landing + screen.
- **Eyebrow cull** — deleted 2 of 5 landing eyebrows ("Covering N+ tickers",
  "Discover"). Stock-screener eyebrow removed on /screen empty state too.
- **Scholar picker promoted** to primary decision row on /screen empty
  state — sits left of search bar, mirroring stock-selected toolbar.
- **Scholar picker overlay rewrite** — the inline picker dropdown is now
  absolute-positioned with `w-[min(680px,calc(100vw-2rem))]`, escapes any
  narrow column constraint. Outside-click + Escape close. Cleaner card
  grid with selected checkmark.
- **Monogram-first logo loading** — `CompanyLogo` now always renders the
  monogram pill immediately, with the real image layered on top fading in
  on load. No more broken-image flashes or alt-text leaks during slow
  Clearbit/FMP responses.
- **HD logo cascade**: Clearbit (mapped domain) → FMP (per-ticker) →
  Google favicons (sz=128 cap) → monogram. 310 of 342 tickers have
  curated domain mappings.
- **Coverage-gap empty state** on /screen — when ticker not in universe,
  shows "Request {ticker}" mailto button + FeaturedTickers suggestions.
- **Earnings page reframe** (`/calendar`) — 14-day "Who reports next"
  radar + at-risk-first vertical list (sorted by ratio buffer ascending)
  + month grid. Three surfaces, three questions.
- **/screen page polish** — verdict icon (CheckCircle / XCircle /
  AlertCircle), vote tally ("3 of 5 say halal · 2 say not halal"), Share
  Verdict button (Web Share API with clipboard fallback), Forest palette
  pull-through.
- **Favicon** — Forest-palette M on emerald gradient with amber accent
  bar. Cache-busted via `?v=4` on layout.tsx + manifest.
- **Email infrastructure** — Cloudflare Email Routing live:
  `hello@mizaninvesting.com` → `gordonlouie28@gmail.com`. Self-loop is
  expected when Gordon tests from his own gmail; real users unaffected.
- **35 new ticker domain mappings** in `lib/companyDomains.ts` covering 5
  European dot-tickers (NOVO-B.CO, MC.PA, NESN.SW, SAP.DE, MBG.DE) and
  30 popular FMP-fallback tickers (MU, KLAC, TM, QCOM, etc.).

### Code changes pending push to git
Run before continuing if anything new was edited:
```bash
cd /Users/gordon/mizan
rm -f .git/index.lock
git status
git add -A
git commit -m "<message>"
git push origin main
```
Vercel auto-deploys ~60s after push.

---

## What's open / queued

### Outreach pending
- **Reply to Islamic Union of HK** — they asked for WhatsApp/email. Gordon
  has replied per draft.
- **Send (d) Dr. HoiYan Kwok** — Finance for Society Research Centre,
  CUHK. Draft in this state file (see "Drafts" section in chat history).
- **Send HKIYA Instagram DM** — draft ready.
- **Send PolyU MSA follow-up** — draft ready.
- **Send US MSA Instagram blitz** — 10 targets ready.
- **Reply to friend who suggested scholar-picker-at-top** — fix is
  shipped; ask the Q1 "describe Mizan in one sentence" question to
  surface a positioning quote.
- **Reply to Anas** — drafted: thanks for the AI-tells feedback, mentions
  he may not have seen recent versions, asks the single-thing follow-up
  question. Not yet sent.

### Product / engineering open
- **Data validity** — partial audit done. Findings:
  - 33 tickers missing `nextEarningsDate`
  - 22 missing `balanceSheet` quarter info
  - 11 with implausible ratio values
  - 22 with no `verdictHistory`
  - GOOGL market cap reads $4.5T (real-world late-2025 was ~$2T) — likely
    off. AAPL at $4.5T also suspiciously high. NVDA at $5T plausible if
    growth continued. Worth a full data audit + corrections.
- **Coverage expansion** — biggest known blocker per Ibrahim's feedback.
  Currently 342 tickers vs target ~3000-5000 US-listed. Realistic path:
  paid FMP/Polygon API + ingestion pipeline + halal-ratio pre-computation
  cron + ongoing refresh. 2-3 day engineering project. Not yet started.
- **Inline citations on verdict pages** — Ibrahim explicitly asked for
  per-ratio source links on each stock page, not just /methodology.
  Queued, not shipped.
- **SSB / scholar-verification roadmap card** on /trust — answers HKUST
  brother's "submit to scholars before going wider" objection. Drafted
  in GROWTH_NEXT_14_DAYS.md, not yet built.
- **Design Phase 3b** (Lucide → Phosphor icons) — deferred. Taste skill
  allows lucide when "the project already depends on it." Mizan does
  across 25+ files. Re-evaluate later if needed.

### Strategy / outreach open
- **Day 12 morning:** retro on LinkedIn post performance. Reply to every
  comment within 30 min during the post's first 12 hours.
- **Day 14:** POLYU MSA committee promised reply by Friday — check.
- **Day 18:** decision gate per growth plan — if no unprompted shares
  AND no Tier-1 scholar movement, pivot conversation.
- **Day 21:** Tier-1 scholar follow-up window opens (Faraz, Joe, Rakaan,
  Ibrahim Khan, Mohsin) — don't follow up before this.

---

## Critical design decisions made

### The Taste + Emil Kowalski skills
Anas (recent feedback contact, possibly a student) flagged that Mizan's
design read as AI-generated and triggered data-sharing trust anxiety. He
recommended two Claude skills as references: **"Taste"** (anti-LLM-slop
frontend) and **"Emil Kowalski"** (animation/component craft). Both
contain canonical anti-AI-tell rules.

The Council session decided: **Pragmatist path** — phased fixes, no
distribution disruption.
- Phase 1 (shipped): em-dashes, eyebrow cull, privacy line
- Phase 2 (shipped): Forest palette swap
- Phase 3a (shipped): sans display via CSS variable
- Phase 3b: deferred (lucide allowed per skill exception)
- Phase 3c (shipped): asymmetric hero with HeroVerdictCard

### Scholar-as-lens insight
A friend's UX feedback: "the first thing they would do is pick their
scholar then make their decision." This is structurally right — scholar
is the *lens*, not an adjustment. Shipped: picker promoted to primary
decision row on /screen empty state, overlay dropdown that escapes
narrow column.

### Earnings page Option A
"Who reports next" tightened to 14-day radar; vertical list reframed as
"At risk first" sorted by ratio buffer ascending. Three surfaces, three
questions: imminence, at-risk, monthly overview.

---

## Important reference files in `/Users/gordon/mizan/`

- `OUTREACH.md` — the master outreach playbook with DM templates A-F,
  daily count tracker, target ranks, exit criterion details
- `GROWTH_NEXT_14_DAYS.md` — Day 11-24 tactical plan with priority order
  and the LinkedIn-post leverage move
- `LINKEDIN_POST_DRAFTS.md` — 3 versions of the public LinkedIn post,
  recommended Version A which is now live
- `Mizan_Outreach_Tracker.xlsx` — the daily-updated tracker with per-DM
  status, replies, quotable feedback, daily counts
- `Ibrahim_Session_Prep.docx` / `Ibrahim_Session_Script.docx` — prep for
  Ibrahim Malik's Zoom session (already completed Day 4)
- `PRODUCT_SPEC.md` — product specification
- `TICKETS.md` — open work items
- `START_HERE.md` — original onboarding for builder

## Important code locations

- `src/app/page.tsx` — landing page with asymmetric hero + HeroVerdictCard
- `src/app/screen/page.tsx` — stock screening detail page (the high-stakes
  page), includes TickerNotFound + ShareVerdictButton + VerdictIcon
- `src/app/calendar/page.tsx` — earnings page with three-surface layout
- `src/components/CompanyLogo.tsx` — monogram-first logo with cascade
- `src/components/ScholarPicker.tsx` — overlay-dropdown picker
- `src/components/HeroVerdictCard` — defined inline in `src/app/page.tsx`
- `src/lib/companyDomains.ts` — ticker → domain mappings (310 of 342)
- `src/lib/design.ts` — central design tokens (Forest palette)
- `src/lib/scholars.ts` — scholar profiles + thresholds
- `src/data/stocks.json` — 342-ticker universe with fundamentals
- `tailwind.config.ts` — palette config (navy = forest, gold = amber)
- `public/favicon.svg` — Forest M favicon
- `public/manifest.webmanifest` — PWA manifest

---

## Cowork-mode operating notes for the next chat

- Gordon prefers tight, action-dense responses. He's in execution mode.
- Use TaskCreate / TaskUpdate liberally — he likes seeing progress.
- When facing significant decisions, run a Council session.
- He may suggest "do all of these" — be willing to execute long
  sequences with checkpointing.
- He sometimes has typos / brief messages — interpret charitably.
- The single highest-leverage move this week is babysitting the LinkedIn
  post and responding to inbound. Don't drift into deep code refactors
  unless he asks.
- The 30-day exit criterion is real. If by Day 18 there's no unprompted
  share AND no Tier-1 movement, surface that honestly.
- Push commands are run by Gordon in his own Terminal (sandbox can't
  push). Hand him the git commands; he runs them.

---

## How to pick this conversation up

When a new chat starts, Gordon's likely opener will be something brief
like "im back" or "what should i do." The right reply is:

1. Confirm you've read `MIZAN_PROJECT_STATE.md` and identify today's day
   in the 30-day window
2. Ask if he wants to (a) babysit the LinkedIn post, (b) work outreach
   replies, (c) build a queued product item, or (d) something else
3. Whatever he picks, execute hard and track via tasks

Don't waste cycles re-introducing or summarizing what's done. He's lived
through it.
