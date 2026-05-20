# Mizan — start here

A complete startup-in-a-folder: working product + full business operating set.

---

## Where everything lives

```
.
├── START_HERE.md                  ← you are here
├── README.md                      ← app technical readme
│
├── package.json, src/, public/    ← the working Next.js prototype
│                                    npm install && npm run dev → http://localhost:3000
│
└── _business/
    ├── 00_strategy/               Memo + Founder Playbook
    ├── 01_fundraising/            Pre-seed + seed decks, one-pager, FAQ, financial model
    ├── 02_legal/                  SAFE, founder agreement, scholar engagement, employee offer
    ├── 03_brand/                  Logos, OG image, brand guidelines
    ├── 04_growth/                 VC emails, scholar emails, YouTube scripts, Twitter, podcasts, masjid
    ├── 05_applications/           Cyberport, YC, HKSTP
    ├── 06_hiring/                 7 job descriptions
    ├── 07_operations/             30-day post-incorporation checklist
    ├── 08_product/                B2B compliance API spec (year 2)
    ├── 09_investor_relations/     Monthly update template, press kit, PR templates
    ├── 10_content/blog/           5 SEO blog posts
    ├── 11_lifecycle_email/        5 email sequences + first newsletter draft
    ├── 12_research/               Customer interview kit (5 cohorts, 25-interview plan)
    ├── 13_engineering/            Practices doc + security & threat model
    └── 14_crisis/                 5 pre-decided crisis responses
```

## What's running in the app

| Path | What it does |
|------|-------------|
| `/` | Landing |
| `/screen?ticker=AMZN` | **The investor demo.** Toggle scholar; verdict flips. |
| `/universe` | Browse all 163 tickers; filter by sector and verdict; sort by any column |
| `/portfolio` | Paste holdings; weighted compliance score |
| `/purification` | Dividend + capital-gain purification |
| `/zakat` | **Working zakat calculator** — assets, debts, nisab check, 2.5% |
| `/ask` | 49-question scholar Q&A with keyword search and per-scholar fallback |
| `/custom` | **Build your own scholar profile** with sliders + localStorage save |
| `/blog` | Renders the 5 essays from `_business/10_content/blog/` |
| `/compare` | Mizan vs Wahed / Zoya / Musaffa / Islamicly |
| `/methodology` | Public trust center — full thresholds per scholar |
| `/glossary` | Plain-language definitions of riba, gharar, sukuk, etc. |
| `/about` | Mission, founder, board |
| `/roadmap` | Public Now / Next / Later / Someday |
| `/help` | 21-item expandable FAQ |
| `/contact` | Working form with mailto fallback + newsletter signup |
| `/terms`, `/privacy` | Required legal pages |
| `/not-found` | Custom 404 with brand |

Plus: PWA-installable, full SEO + OG tags, sitemap.xml, robots.txt. Engine 39/39 passing.

## What to do, in order

### Today (30 minutes)
1. **Run the app.** `cd "/Users/gordon/Halal project " && npm install && npm run dev`
2. **Try the AMZN demo** at `/screen?ticker=AMZN`.
3. **Browse the universe** at `/universe`, filter to "Pass under Mufti Taqi."
4. **Calculate your zakat** at `/zakat` (real working tool).
5. **Ask a question** at `/ask` — try "Is staking ETH halal?"
6. **Build a Custom profile** at `/custom`.

### This week
- Buy `mizan.app`. Apply to Cyberport. Send the Mufti Faraz Adam email. Engage Deacons HK.

### This month
- Incorporate. Start YouTube. Publish the blog. Pre-seed outreach. Post CTO JD. Load email sequences. First investor update.
- **Run 25 customer interviews** following the kit in `_business/12_research/`.

### Day 90 victory condition
HK entity registered · $750K pre-seed closed · 3 Shariah board members signed · alpha in 100 hands · 1,000 YouTube subs · 5K-person waitlist · 5 blog posts published · 25 customer interviews done · first investor update sent.

---

## What still needs you (only this)

- Signatures (Cayman + HK incorporation, SAFEs, scholar engagement)
- Money (domain, vendors, legal)
- Sending emails from your account
- Attending meetings, pitches, scholar calls
- Hiring decisions
- Recording YouTube videos

---

## What I can still build, no extra access

- Hiring process playbook (interview rubrics, take-home tests)
- Sales playbook for B2B API
- Partnership playbook (masjid + brokerage)
- 5 more blog posts
- Incorporation press release polished
- Investor relations playbook (post-funding)
- Annual planning + OKR template
- Discord community structure (10 channels)
- Brand voice guide for non-writers
- Compliance / audit prep checklist

## What unlocks more, with one switch each

- **GitHub + Vercel** → live URL in 20 minutes
- **Anthropic API key** → /ask becomes live Claude
- **Financial Modeling Prep key** → swap mock data for live equities
- **Stripe key** → real billing
- **Customer.io / Loops** → load all 12 lifecycle emails

---

## Status

- **17 pages, TypeScript clean.**
- **163-ticker dataset, 49-question Q&A knowledge base.**
- **PWA installable. Full SEO + OG. Sitemap + robots.**
- **Engine: 39/39 tests passing.**
- **14 business categories, 55+ deliverables.**
- **Crisis playbook + security model written for the things that actually break companies.**

The plan is decided. The work is in your folder. Move.

— Team Mizan, day zero.
