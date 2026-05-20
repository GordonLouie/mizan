# Mizan engineering practices

Last updated: 18 May 2026

This document is the constitution. Every engineer who joins reads it on day one. We update it by pull request to this file; changes require approval from the CTO and at least one other engineer.

---

## Principles

1. **Shipping bias.** Done is better than perfect. Done in two weeks is better than perfect in six. Imperfection that ships becomes information; perfection in a branch becomes drag.
2. **Correctness matters more here than at most consumer products.** A bug that shows a wrong halal verdict is not a UI bug. We test the engine like we'd test a payment processor.
3. **Boring tech.** Postgres, Node, Next.js, TypeScript. We don't write the next React. We don't reach for novel runtimes unless the current stack genuinely doesn't serve.
4. **No cleverness for cleverness's sake.** Code is read more than it's written. Optimize for the second reader, not the first writer.
5. **Make the right thing the easy thing.** Tooling exists to remove friction from doing the correct thing. If a process keeps getting skipped, fix the tooling, not the people.

---

## Stack (canonical)

| Layer | Choice | Why |
|------|---------|------|
| Frontend (web) | Next.js 15 App Router, React 19, Tailwind | Cohesive, hireable, fast |
| Frontend (mobile) | React Native + Expo | Shares engine with web; one codebase |
| Backend | Node.js with Fastify | Performant, ecosystem-rich |
| Database | Postgres on Fly.io | Reliable, well-understood, scales to 100K MAU on one node |
| ORM | Drizzle (or just `pg` for simple queries) | Type-safe, low overhead |
| Cache | Redis (when needed; not before $1K MRR) | Use sparingly |
| Queue | BullMQ (Redis-backed) | When async work emerges |
| Auth | Clerk | Cheaper than rolling our own |
| Payments | Stripe + RevenueCat (mobile) | Industry standard |
| Financial data | Financial Modeling Prep, graduating to Refinitiv | Mizan-specific |
| LLM | Anthropic Claude | Best-aligned, lowest hallucination |
| Brokerage links | Plaid (US), TrueLayer (UK/EU), Salt Edge (MENA) | Geo-fanout |
| Analytics | PostHog (product), Mixpanel (funnels) | Two tools, each for what it's best at |
| Errors | Sentry | Standard |
| Observability | OpenTelemetry → Honeycomb | When we cross 10K MAU |
| Hosting | Vercel (frontend), Fly.io (backend) | Both let us deploy without infra ops |
| CI | GitHub Actions | Free for our size |

**To change the stack:** open an RFC (template below). Stack changes require 48h review and CTO approval.

---

## Code review

- Every PR requires at least 1 reviewer's approval before merge.
- Critical paths (engine, billing, auth, AI Q&A prompt logic) require 2 reviewers.
- The author does not merge their own PRs except when the only change is documentation, brand assets, or content.
- Author writes the PR description; reviewer doesn't have to dig for context.
- Aim for PRs under 400 lines. If yours is bigger, you split it.
- Review turn-around: same business day for PRs under 100 lines; 24 hours for larger.
- Be specific in review comments. "I'd consider X because Y" beats "could be cleaner."
- Trust the test suite. If tests pass and the reviewer approves, ship. Don't second-guess.

## Testing standards

Three layers:

1. **Engine unit tests.** Every screening rule has a positive and negative test. Every purification calculation has a test. The test suite must run in under 10 seconds locally.
2. **Integration tests.** Critical user flows tested end-to-end via Playwright: pick scholar, search ticker, see verdict; link a brokerage; complete a purification donation flow.
3. **Manual scholar review.** Before any methodology release, the Shariah Supervisory Board secretary runs the new scholar profile against a fixed set of 50 reference tickers and confirms the verdicts match expectation.

We do not ship to production without:
- 100% of unit tests passing.
- A successful staging deployment.
- One human's eyes on the staging build.

## Branching

- `main` is always deployable to production.
- Every feature is a branch off `main`: `feature/<short-name>` or `fix/<short-name>`.
- Squash-merge into `main`. Linear history.
- Tag every production release: `v0.1.0`, `v0.1.1`, etc. Semantic versioning.
- Hot-fix branches off the production tag, never off main during a broken state.

## Deployment

- `main` deploys to staging automatically on push.
- Production deploys are manual, triggered by a tag push. (Until we have enough confidence to make production automatic.)
- Every deploy posts to #shipping with: tag, deployer, summary, link to changelog entry.
- Rollback is a one-command revert to the previous tag. Practice it monthly.

## Incident response

When something is wrong in production:

1. **Acknowledge.** Whoever notices first posts in #incidents with: `[INCIDENT] [brief description] — investigating`.
2. **Stop the bleeding first.** If users are affected, the first action is to disable the affected feature or revert. Diagnosis comes after.
3. **One person owns the incident.** Usually the founder or CTO until we have an on-call rotation.
4. **Communicate.** Update #incidents every 30 minutes during active incidents. Post-resolution: a thread with what happened, why, what we changed.
5. **Post-mortem within 48 hours.** Template below. Blameless. Action items have owners.

### Post-mortem template

```
Date:
Duration:
Severity: P0 / P1 / P2 / P3
Owner:

Summary (2 sentences):

Timeline (UTC):
- 14:00 — first symptom detected
- 14:05 — incident declared
- 14:30 — root cause identified
- 14:45 — fix deployed
- 15:00 — confirmed resolved

What we did right:
- ...

What we did wrong:
- ...

Action items (with owners and dates):
- [ ] [Owner] [Date]
```

## On-call (year 2+)

Until we cross 5,000 paying users, the CTO is on-call 24/7 (founder backup). After that:

- Weekly rotation among engineers.
- Pages only for P0 (production down, billing broken, data integrity issue).
- Sub-15-minute acknowledgement target.
- Sub-2-hour mitigation target.
- One on-call shift per engineer per month maximum.
- Generous on-call comp (week off following month or $1K cash).

## Security baseline

- All HTTPS, TLS 1.3. No exceptions.
- No secrets in code. Ever. 1Password Vaults for sharing; environment variables in production.
- All third-party API keys rotatable. Rotate annually as a calendar task.
- Database backups: nightly, 7-day retention. Test restore quarterly.
- All employees use 1Password. Personal device hardening (FileVault, lockdown) required.
- See `13_engineering/02_Security_Threat_Model.md` for the full posture.

## Documentation

- Every public-facing API endpoint has an OpenAPI spec.
- Internal services have a README in the repo with: purpose, how to run locally, how to deploy, who owns it.
- Architecture decisions of any consequence go into `docs/adr/NNNN-title.md` (Architecture Decision Records).
- Code comments explain "why", never "what". The code shows the what.

## Performance

We measure but don't obsess.

- LCP (largest contentful paint) target: under 2.5 seconds on simulated 4G.
- Time to interactive: under 3.5 seconds.
- Engine response: 95th percentile under 100ms for a single ticker screen (cache hit), 500ms (cache miss).

Performance regressions over 10% block deploy.

## Hiring philosophy in engineering

- Hire shippers. Past production output beats credentials.
- One paid two-week trial before signing. Always.
- We never hire on resume sheen. We hire on what we've seen of someone's work, ideally including a trial.
- We are remote-first by design, not by default. Async writing is a real skill we hire for.

## Working hours

We don't have core hours. We have core artifacts: ship, commit messages, written updates.

- Standups: Async in #shipping, written, 9am local time. 4 lines: yesterday / today / blockers / mood.
- Weekly review: Friday afternoon, written, 30 minutes.
- Quarterly review: in-person preferred, with the founder.

## RFC template

For non-trivial technical decisions:

```
# RFC: [title]
Status: draft / open / accepted / rejected
Authors: [you]
Reviewers required: [list]

## Problem
What are we trying to solve?

## Proposal
What we plan to do, in plain language.

## Alternatives considered
At least 2.

## Trade-offs
What we give up. Why we accept that.

## Open questions
What we don't yet know.

## Decision timeline
Open until [date]; CTO approval required to accept.
```

Submit RFCs as PRs against `docs/rfc/NNNN-title.md`. 48 hours minimum review. Comments via PR review.

---

## What I won't tolerate

(The founder's commitment to engineers.)

- Being asked to compromise correctness on the engine because of marketing deadlines.
- Toxic code review (personal, not technical).
- Working on a Saturday for no business-critical reason.
- Being shamed for not knowing something.

If any of these are happening, escalate to the founder directly. They're a culture failure I will fix.
