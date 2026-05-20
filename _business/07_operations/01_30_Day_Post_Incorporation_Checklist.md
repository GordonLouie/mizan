# Mizan — 30-day post-incorporation checklist

The two-week incorporation period ends. Cayman holdco and HK Operating are both live. Here is the operational onboarding to run before you hire anyone or accept investor cash.

Cross items off in order. Most of these are 30-minute tasks. The longest single item is opening HK banking.

---

## Week 1 — Banking, identity, comms

### Day 1
- [ ] Apply for HSBC Business Direct account (HK Operating). Allow 10-14 days for processing — start now.
- [ ] Apply for Statrys business account (HK Operating). Online, usually approved within 2-3 days. Useful as a backup while HSBC processes.
- [ ] Open a Mercury account (Cayman holdco). For receiving pre-seed cash from US investors. Mercury supports Cayman C-corps.
- [ ] Buy mizan.app on Cloudflare Registrar. Buy trymizan.com, mizan.io, mizan.co for defensive registration.
- [ ] Set DNS in Cloudflare. CNAME `www` to `cname.vercel-dns.com`. A and AAAA records for apex via Cloudflare.

### Day 2
- [ ] Create Mizan Google Workspace (Business Starter, $7.20/user/mo). Add domain. Set up MX records.
- [ ] Create `jk@mizan.app` (founder), `legal@mizan.app`, `privacy@mizan.app`, `support@mizan.app`. Set up forwarding for the latter three to the founder until support hire.
- [ ] Set up `hello@mizan.app` for general inbound. Auto-respond template: "Thanks for writing. I read every email personally. Expect a reply within 48 hours."
- [ ] Create canonical Mizan Slack workspace (free tier OK for now). Channels: `#shipping`, `#shariah`, `#growth`, `#hiring`, `#investors`, `#random`.

### Day 3
- [ ] Open 1Password Business workspace. Vaults for: Founder, Engineering, Finance, Growth.
- [ ] Set up Notion Workspace (Team Plan). Top-level pages: Strategy · Engineering · Shariah · Growth · Finance · Hiring · Legal.
- [ ] Migrate this checklist + the Founder Playbook into Notion as the source of truth.
- [ ] Set up GitHub org `mizanhq`. Make the existing prototype the first private repo.

### Day 4
- [ ] Register on LinkedIn as Mizan (company page). Use the wordmark logo. Tagline: "Halal investing, calibrated to your conscience."
- [ ] Claim social handles: `@mizanapp` on X / Twitter, Instagram, TikTok, YouTube, Threads, Bluesky, Mastodon.
- [ ] Create the X account properly: bio with the wedge demo (Mufti Taqi illiquid floor reference), pinned tweet linking to the AMZN demo at mizan.app.
- [ ] Set up a Mizan Buffer or Typefully account for scheduling.

### Day 5
- [ ] Engage Deacons HK for the regulatory structuring call (1 hour, ~$1,500). Goal: written confirmation of non-advisory positioning.
- [ ] Engage Walkers (Cayman) for ongoing corporate maintenance retainer. Annual fee ~$3-5K.
- [ ] Engage a HK tax adviser (RSM or Mazars). Goal: file the offshore profits claim once first year revenue is in.

---

## Week 2 — Finance, accounting, infrastructure

### Day 8
- [ ] Sign up Brex or Mercury IO for HK Operating expense cards.
- [ ] Set up QuickBooks Online or Xero (Cayman holdco bookkeeping). HK Operating uses a separate ledger.
- [ ] Engage a bookkeeper. Pricing rates: ~$200/month part-time for a small startup.
- [ ] Open Stripe account (Cayman holdco). Stripe will ask for company docs, founder ID, beneficial owner KYC. Allow 1 week.

### Day 9
- [ ] Sign up Vercel team plan ($20/user/mo). Connect the GitHub repo.
- [ ] Sign up Fly.io account. Personal tier OK for now. Create Postgres on Fly.
- [ ] Sign up Anthropic API account. Add $50 credits to start.
- [ ] Sign up Financial Modeling Prep API ($50/mo Premium plan).
- [ ] Sign up Plaid account. Note: full production access requires KYB; sandbox access is immediate.
- [ ] Sign up PostHog free tier.

### Day 10
- [ ] Deploy the Mizan prototype to Vercel at staging.mizan.app.
- [ ] Set up basic CI on GitHub Actions: lint + test on PR.
- [ ] Set up Sentry account for error tracking (free tier).
- [ ] Buy domain SSL + force HTTPS in Cloudflare.

### Day 11
- [ ] Draft the company-formation press release (don't publish; save for relaunch).
- [ ] Set up Pitchbook / Crunchbase placeholder entries (claim them — investors check).
- [ ] Open Sleek's secretarial-service dashboard for ongoing HK statutory filings.
- [ ] Confirm year-end date with both Cayman and HK accounts. Standard: 31 December for HK.

### Day 12
- [ ] Set up Pleo / Brex policy. Founder card limit $5K/month for now, no other cards issued yet.
- [ ] Create budget categories in QuickBooks: Personnel · Shariah · Data · Marketing · Legal · G&A. Match the financial model.
- [ ] Set up Monthly Investor Update template in Notion. (Send first one at day 30 even if pre-investors.)

---

## Week 3 — Legal, Shariah board, talent

### Day 15
- [ ] Send drafted email to Mufti Faraz Adam (drafted in _business/04_growth/02_Scholar_Outreach_Emails.md). Subject already in the draft.
- [ ] Send drafted email to Sheikh Joe Bradford.
- [ ] Email two contacts at the Al-Mahdi Institute for a Ja'fari scholar recommendation.
- [ ] Follow up on the SAFE template review with Walkers. Goal: finalized template within 5 business days.

### Day 16
- [ ] Apply to Cyberport Incubation Programme using the pre-filled draft.
- [ ] Apply to HKSTP Ideation Programme using the pre-filled draft.
- [ ] Apply to Y Combinator next batch (or place a calendar reminder for the actual cycle).

### Day 17
- [ ] Post the CTO co-founder JD on LinkedIn, Wellfound, WorkAtAStartup, and the founder's X account.
- [ ] Reach out to 20 candidates in your founder network for the CTO role (warm intros only).
- [ ] Cross-post to Muslim founder Discord / Slack communities.

### Day 18
- [ ] Begin pre-seed outreach. Send 4 emails per day from the drafted list. Track in Notion.
- [ ] Set up Cal.com or Calendly with 30-minute and 45-minute slots for investor calls.
- [ ] Add "investor briefing" video walk-through to YouTube (unlisted). 5 minutes max. Same as the 60-second AMZN demo but with founder context.

---

## Week 4 — Content engine launch

### Day 22
- [ ] Record the first 3 YouTube videos. Scripts already drafted. Setup: smartphone or webcam, natural light, USB mic ($200). Don't over-invest.
- [ ] Set up the basic YouTube channel: banner art (use the OG image), about section, playlists.
- [ ] First X / Twitter intro thread posted. Pin it.

### Day 23
- [ ] Reach out to 5 podcasts from the drafted list. Pitches ready in the content folder.
- [ ] Set up a public Mizan "trust center" page at mizan.app/methodology (page exists in app; just deploy).
- [ ] Set up a Mizan email newsletter (Substack or Beehiiv). First post: "Why I'm building Mizan."

### Day 24
- [ ] CTO candidate first interviews start. You should have 3-5 promising leads by now.
- [ ] Shariah board responses likely coming in. Schedule any that say yes.
- [ ] First investor calls happening from the outreach.

### Day 28
- [ ] First Monthly Investor Update sent (to interested prospects, even if no money in yet). Format: 1 page. What's done · What's coming · Asks. 30 min to write.

### Day 30 — checkpoint
- [ ] Banking: HSBC + Statrys + Mercury + Stripe all open or pending.
- [ ] Tools: Vercel, Fly.io, Plaid, Anthropic, FMP, PostHog, Notion, Slack all live.
- [ ] Legal: Walkers + Deacons + tax adviser engaged.
- [ ] Talent: CTO candidate pool of 5+; 1 or 2 in active conversation.
- [ ] Shariah: at least 1 of 3 board members verbally committed.
- [ ] Content: YouTube live with 3 videos, X account active, podcast tour started.
- [ ] Investors: 12 conversations started, 3 second meetings booked.
- [ ] Applications: Cyberport + HKSTP + YC submitted.

If you've hit all of these by day 30, you are on schedule. If you're behind on 1-2, that's fine. If you're behind on 5+, pause and diagnose — the issue is probably "I'm doing this alone and the CTO hire is the bottleneck" — accelerate that.

---

## Recurring tasks (set as Notion reminders)

| Cadence | Task |
|---------|------|
| Daily | 30 min of X engagement. 1 hr of investor follow-ups. 30 min reading. |
| Weekly | Monday: post the week's plan in #shipping. Friday: weekly progress note to the (eventually) Shariah board secretary. |
| Bi-weekly | Wednesday: Investor update sent to anyone who's said "yes / let me know more." |
| Monthly | First Monday: Monthly Investor Update sent to confirmed prospects + signed investors. |
| Quarterly | Shariah board meeting. Public Shariah report draft. Board minutes published in Trust Center. |
| Annual | Audit. Statutory filings (HK + Cayman). Compensation review. Brand book refresh. |

---

## What to ignore for now

- Hiring a CFO. You're using a bookkeeper + the financial model in this folder. CFO comes at seed.
- Trademarking everywhere. Apply only in HK + US + UK initially.
- Patents. Don't bother — methodology is published openly anyway; the moat is scholar relationships.
- A polished marketing site. The app at mizan.app IS the marketing site for now. Marketing-only landing pages can wait until paid ads start (month 6+).
- Mobile app. React Native shell waits until web is working at $1K MRR.
- A press release for incorporation. Save the press moment for "we signed our Shariah board" or "we closed our pre-seed."
