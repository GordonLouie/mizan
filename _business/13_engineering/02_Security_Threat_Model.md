# Mizan security & threat model

Last updated: 18 May 2026
Owner: CTO (founder until CTO hired)
Reviewed: quarterly, more often after any incident

This document is meant to be read by every engineer who joins, by investors during due diligence, and by potential B2B API customers' security teams. It is intentionally specific.

---

## What we protect

In order of sensitivity:

1. **User credentials and identity.** Email, password hash (when not using OAuth), Clerk-managed session tokens.
2. **Brokerage data via Plaid.** Read-only holdings; portfolio composition. No account numbers, no ability to trade.
3. **Payment data.** Handled by Stripe; we never see raw card numbers. We retain Stripe customer IDs.
4. **Scholar relationships and methodology IP.** Board engagement letters, supervisory notes, methodology drafts.
5. **User AI Q&A queries.** Anonymized after 14 days; retained 90 days for board audit; deleted thereafter.
6. **Aggregated usage telemetry.** PostHog and Mixpanel; pseudonymized.

## What we do NOT collect

- Government IDs, social security numbers, or any KYC equivalent. We do not need them; we are not a custodian.
- Race, ethnicity, religious affiliation beyond what's implicit in choosing to use a halal-investing product.
- Location beyond the country derived from billing address.
- Browsing history outside Mizan.
- Communications between users.

If we ever need to add a sensitive data type, the addition requires CTO + founder sign-off, a corresponding privacy policy update, and explicit user opt-in for affected users.

---

## Threat surfaces, ranked by likelihood

### 1. Credential stuffing / password reuse (HIGH)

**Risk:** Attacker takes leaked credentials from another breach and tries them on Mizan accounts.

**Controls:**
- Clerk-managed auth. Clerk provides credential breach detection out of the box.
- OAuth-first sign-in (Google, Apple). We push users to OAuth; password is a fallback.
- Rate limiting at the auth endpoint: 5 attempts / minute / IP, 15-minute lockout after 10 fails.
- MFA available for all users; required for Pro tier (year 2).

### 2. Plaid / brokerage credentials exposure (HIGH)

**Risk:** Compromise of Mizan's Plaid integration could expose users' brokerage credentials.

**Controls:**
- We never see brokerage credentials — Plaid mediates entirely; we hold a Plaid `access_token`, not user credentials.
- Plaid `access_token`s stored encrypted-at-rest, encryption key rotated quarterly.
- Access tokens revocable from user account page; revocation propagates to Plaid within seconds.
- Mizan engineers do not have routine access to production token storage. Break-glass via vault audit log.

### 3. AI Q&A prompt injection (MEDIUM)

**Risk:** Malicious user crafts a question that causes the AI to produce a non-scholar-approved answer or to leak system prompt content.

**Controls:**
- System prompt explicitly bounded to scholar-approved scope.
- Response post-processing: filter for refusal markers, profanity, identifying info.
- Output cached and reviewable; anomalous outputs flagged for human review.
- The Shariah Board secretary audits a 1% random sample of outputs quarterly.
- If a prompt-injection successfully extracts the system prompt — that's fine. The system prompt is non-secret. The bounds it specifies are the safeguard.

### 4. Scraping / data exfiltration (MEDIUM)

**Risk:** Competitor scrapes Mizan's screening verdicts at scale, free-riding on our scholar-vetted methodology.

**Controls:**
- Rate limits on the public screener (free tier): 5 screens/day, 30/month per account; per-IP throttling for anonymous users.
- Cloudflare bot management on the marketing pages.
- Methodology is open and published — there's nothing to "leak" beyond the published thresholds. The moat is the named scholars, not the math.

### 5. Payment fraud (MEDIUM)

**Risk:** Stolen credit cards used to sign up for Pro, generating chargebacks.

**Controls:**
- Stripe Radar enabled for risk-scoring at checkout.
- 3D Secure required for high-risk payment regions.
- Chargeback rate monitored monthly; over 0.5% triggers review.

### 6. Compromised employee laptop (MEDIUM)

**Risk:** A team member's machine is compromised; attacker pivots to production access.

**Controls:**
- All employees use 1Password for secrets; no plaintext credentials anywhere.
- FileVault (or equivalent) mandatory on all team devices.
- Production access requires a 1Password Vault membership, audited monthly.
- Production database access from authorized IPs only (Tailscale gateway).
- No production access from personal devices except via 1Password-mediated vault.

### 7. Insider risk (LOW but real)

**Risk:** An employee misuses access.

**Controls:**
- All production access logged (Tailscale logs + database query logs).
- Quarterly access review: every team member's access to every system is reviewed and pruned.
- Background reference checks on every hire.
- No single-point-of-failure on access — every critical access has at least 2 holders, and the founder is one.

### 8. Supply chain (LOW but escalating)

**Risk:** A compromised npm package introduces malicious code.

**Controls:**
- `npm audit` weekly on the main branch as a CI gate.
- We pin to specific versions; no `^` or `~` in production `package.json`.
- Major dependency upgrades reviewed by 2 engineers.
- We minimize dependencies. We prefer writing 50 lines over adding a 50KB package.

### 9. DDoS (LOW)

**Risk:** Volumetric attack on the public site.

**Controls:**
- Cloudflare in front of everything user-facing.
- Cloudflare's L3/L4 protection enabled by default.
- Application-layer rate limiting per IP and per account.

---

## Data classification

| Class | Examples | Treatment |
|------|----------|-----------|
| **P0 — Catastrophic if exposed** | Plaid access tokens, Stripe webhook signing keys, AAOIFI methodology drafts pre-board-approval | Encrypted at rest. Access logged. 2-person rule for export. |
| **P1 — Serious if exposed** | User email, payment metadata, brokerage holdings | Encrypted at rest. Access logged. Rate-limited query patterns. |
| **P2 — Sensitive but recoverable** | Usage telemetry, AI Q&A logs, support conversations | Pseudonymized. Retained per policy. Aggregated reports OK. |
| **P3 — Public** | Methodology, scholar bios, blog content | No special treatment required. |

---

## Encryption at rest

- Postgres: column-level encryption on tokens (Plaid, OAuth refresh tokens). Backups encrypted with AES-256.
- Object storage (logos, user uploads, none currently): encrypted at rest by default.
- Keys managed by Fly.io Vault initially; migrating to AWS KMS at Series A scale.

## Encryption in transit

- TLS 1.3 minimum on every endpoint.
- HSTS enabled with 1-year max-age.
- Certificate pinning on mobile app (planned, year 2).

## Auth posture

- Email + OAuth (Google, Apple) via Clerk for now.
- Session tokens are JWTs signed with rotated keys; 14-day idle expiry.
- MFA available; optional in year 1, required for Pro+ in year 2.

## Backups

- Postgres: nightly snapshots, 7-day rolling retention, 30-day monthly archives in encrypted S3.
- Test-restore drill: first Monday of every quarter.
- Last successful restore: [pending first drill post-launch].

## Logging & monitoring

- Application logs: 30 days retention, structured JSON.
- Auth logs: 1 year retention.
- Sentry for unhandled errors with PII redaction at the SDK level.
- Honeycomb for distributed traces (when we cross 10K MAU and need it).
- Cloudflare access logs: 30 days.

## Vendor / SOC 2 list (year 3 target)

Critical vendors and their security postures:

| Vendor | What we trust them with | Their cert |
|--------|------------------------|-----------|
| Clerk | Auth, sessions | SOC 2 Type 2 |
| Stripe | Payments | PCI DSS Level 1, SOC 2 |
| Anthropic | AI Q&A | SOC 2 Type 2, ISO 27001 |
| Plaid | Brokerage links | SOC 2 Type 2 |
| Fly.io | Hosting, DB | SOC 2 Type 2 |
| Vercel | Hosting (frontend) | SOC 2 Type 2 |
| PostHog | Analytics | SOC 2 Type 2 |
| Cloudflare | CDN, security | SOC 2 Type 2, ISO 27001 |

We have written DPAs (Data Processing Agreements) with every P0/P1 vendor.

## Incident response (security-specific)

In addition to general incident response (see `01_Engineering_Practices.md`):

1. **Suspected breach is treated as P0 until proven otherwise.**
2. **CTO and founder notified immediately**, regardless of time zone.
3. **Containment first.** Disable affected systems, rotate credentials, isolate.
4. **Forensic analysis** with the help of a retained security firm (we'll engage one at Series A).
5. **Disclosure timeline:** internal users within 24 hours; affected end-users within 72 hours; regulators per jurisdiction (HK PCPD, GDPR, CCPA).
6. **Post-mortem published** for any incident affecting more than 100 users.

## Compliance roadmap

| When | What |
|------|------|
| Day 1 | GDPR / UK GDPR / PDPO (HK) / CCPA compliance via privacy policy + minimum data collection |
| Month 6 | Externally-reviewed pen test before paid launch |
| Year 1 | Bug bounty via HackerOne (private to start) |
| Year 2 | SOC 2 Type 1 |
| Year 3 | SOC 2 Type 2 |
| Year 3 | ISO 27001 if European enterprise customers require it |

## Bug bounty

We will accept good-faith security disclosures at `security@mizan.app`. Until we formally launch a bug bounty program, ad-hoc rewards are paid in $50-$500 range depending on severity, at our discretion. Researchers acting in good faith are protected from legal action; see our published [responsible disclosure policy] (year 1 deliverable).

## Annual external audit (year 3+)

Every fiscal year, an external security firm performs:
- Network and application pen test
- Code review of critical paths (engine, billing, auth, AI)
- Process review (access controls, incident response history)
- A report with findings, severity ratings, and remediation timelines

Findings are tracked to closure by the CTO; report summary shared with the board.

---

## What we tell users when something goes wrong

Our communication template, pre-drafted, when an incident has occurred:

> Earlier today/yesterday, [duration] of [service / system] was [unavailable / impaired]. The root cause was [specific, plain-language].
>
> Specifically, the impact was: [number] of users [experienced what].
>
> We've resolved it by [specific action]. To prevent a repeat, we are [specific action].
>
> If you were directly affected, [specific action we'll take]. Reply to this email if you have questions; we will respond personally.

We do not say "your security is our top priority" or any other meaningless reassurance. We say what happened, what we did, and what we're doing.

---

## Final note

Security is a process, not a state. This document is updated whenever the world changes. The security review on the calendar is a check that the document still describes the world; the practice that protects users is what happens every day in code review, on-call, and access discipline.
