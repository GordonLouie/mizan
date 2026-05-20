# Crisis communications playbook

This document is sealed in case of emergency. The principle: write the responses now, when nothing is wrong. By the time something IS wrong, your judgment is impaired and your audience is unforgiving. Pre-decided beats improvised.

Five named crises, each with a pre-decided response. Every founder should read this before they need it, then know where to find it instantly when they do.

---

## CRISIS 1 — A Shariah board member publicly disowns Mizan

**The scenario.** Mufti Faraz Adam (or another board member) makes a public statement disagreeing with how Mizan implements their methodology. Or worse: announces departure from the board over a methodology dispute. This is the single most existential crisis we face — scholarly credibility is the moat.

**Pre-decided response (executed within 24 hours):**

**Hour 0-2:** The founder personally calls the scholar. Listen first. Apologize for any misrepresentation. Establish whether this is a fixable disagreement or a fundamental departure.

**Hour 2-6:** Internal call between founder, CTO, and any other board members. Agree on the substantive response: are we changing the methodology, or are we standing by it?

**Hour 6-12:** Draft and publish a written response. Template:

> [Date]
>
> Earlier this week, [Scholar's full title and name] published [a clarification / a notice of departure] regarding Mizan's implementation of [his/her] published methodology.
>
> We have spoken with [Scholar] directly. Here is what we are doing:
>
> [If fixable:] We are updating the [specific feature] in Mizan to reflect [specific change]. The update will be live within [date]. [Scholar] has reviewed and approved this change.
>
> [If departure:] We respect [Scholar]'s decision. We will [continue / discontinue] the relevant scholar profile as [specific decision]. The Mizan board now consists of [updated list].
>
> Users currently using the affected scholar profile have been notified directly. If you have questions, you can email me at jk@mizan.app — I read every one.
>
> Founder, Mizan

**Hour 12-24:** Direct email to every user on the affected scholar profile, with the same content adapted personally. Push notification with link.

**Hour 24-72:** Founder makes himself available for podcast interviews, X Spaces, community calls. The medium-term play is to demonstrate that Mizan responds to scholarly disagreement with humility and action, not defensiveness.

**What we DO NOT do:**
- Issue a press release before talking to the scholar directly.
- Defend the methodology in technical detail on social media. Save that for the published response.
- Disparage the scholar in public, ever, no matter what was said.
- Pretend it didn't happen.

**Recovery metric:** Within 30 days, user trust scores (NPS-style survey) returns to within 5 points of pre-crisis levels. If it doesn't, we have a deeper structural issue.

---

## CRISIS 2 — A security incident exposing user data

**The scenario.** Plaid access tokens leaked. Or a database query log exposed user emails. Or a third-party vendor breach affects our users.

**Pre-decided response (executed within 24 hours, regulators within 72 hours):**

**Hour 0-1:** CTO declares incident. Founder notified. Containment first: revoke affected credentials, disable affected systems, rotate keys.

**Hour 1-4:** Forensic assessment. What exactly was exposed? How many users? Was data exfiltrated or just exposed? Engage Field Fisher (HK) or counterpart counsel.

**Hour 4-12:** Affected users notified by direct email. Template:

> [Date]
>
> Earlier today, we discovered that [specific, plain description of what happened]. The investigation showed that [specific scope of exposure].
>
> Specifically, the following information of yours was exposed: [list].
>
> We have already [specific action] to contain it. Going forward, we are [specific action] to prevent a repeat.
>
> Here is what you should do:
> 1. [Concrete action 1, e.g., reset your Mizan password]
> 2. [Concrete action 2, e.g., review your Plaid connections]
> 3. [Concrete action 3]
>
> If you have questions, write directly to jk@mizan.app. I will respond personally within 24 hours.
>
> Founder, Mizan

**Hour 12-24:** Public statement at mizan.app/security or via the Trust Center, mirroring the user notification.

**Hour 24-72:** Regulators notified per jurisdiction:
- HK PCPD (Privacy Commissioner)
- EU/UK supervisory authorities under GDPR
- California AG under CCPA
- Affected payment networks via Stripe

**Hour 72+:** Public post-mortem within 30 days. Findings shared, action items committed to with dates.

**What we DO NOT do:**
- Hide the incident from regulators or users in any way.
- Use weasel words like "an issue was discovered" instead of "a security incident occurred."
- Blame the vendor publicly until full forensics complete.
- Promise it will never happen again. (It might; security is process, not state.)

---

## CRISIS 3 — A hostile journalist or competitor coverage

**The scenario.** A piece of journalism criticizes Mizan in a way that's substantively wrong or unfair. Or a competitor accuses us of methodological errors. Or an X thread goes viral arguing we're a scam.

**Pre-decided response:**

**Hour 0-2:** Internal triage. Read the actual piece, not just the takes. Identify: what's factually wrong, what's an interpretation difference, what's a legitimate criticism we should acknowledge.

**Hour 2-12:** Decide the response posture from this matrix:

| Situation | Response |
|---|---|
| Factually wrong | Send a polite, specific correction request to the journalist. Publicly post the correction if not acknowledged within 48 hours. |
| Legitimate criticism we missed | Acknowledge publicly, commit to a fix with a date. |
| Bad-faith hit piece | Generally ignore. Engagement amplifies. Refute facts privately to the platform if needed. |
| Competitor smear | Do not engage on platform. Use it as an opportunity in your next post to articulate your actual position positively. |
| Going-viral X thread of misinformation | Founder responds with a calm, specific, technical thread of their own. Single response only. Do not relitigate in replies. |

**Internal communication.** Slack the team. Don't let team members find out on social media. Brief them on the response posture.

**What we DO NOT do:**
- Sue. Defamation suits in fintech rarely end well, even when winnable. The "Streisand effect" applies.
- Get a friend to write a defensive thread for us. Authentic founder voice always.
- Pretend it's not happening. Silence is its own message.

---

## CRISIS 4 — The founder is the controversy

**The scenario.** A past tweet of the founder's resurfaces. A college incident is uncovered. A political position the founder holds becomes a controversy that the audience cares about.

**Pre-decided response:**

This is the hardest crisis because it can't be fully delegated and because the company's interests and the founder's interests may diverge.

**Hour 0-6:** Read the actual accusation. Identify: true / partially true / fabricated. Get advice from at least one trusted advisor outside the company.

**Hour 6-24:** Decide on response posture from a separate matrix:

| Situation | Response |
|---|---|
| True and recent | Acknowledge clearly, apologize specifically, commit to a behavior change with measurable outcomes. No equivocation. |
| True but distant past (>5 years) | Acknowledge it's a position you no longer hold; explain what changed your mind. Don't justify, don't excuse. |
| Partial truth (out-of-context) | Provide the missing context calmly, once. Don't re-engage. |
| Fabrication | Publish a clear factual refutation. If clearly defamatory and high-profile, consult counsel. |
| Political position that the audience disagrees with | This is the hardest. Stand by your position if it's a matter of conscience. Acknowledge the disagreement. Some users will leave. Some won't. Decide what you can live with. |

**Communication.** Direct to the team first. Then to the Shariah board. Then to investors. Then to users.

**The board's question.** If the board concludes (after their own investigation) that the controversy is bad enough to require the founder to step back, take that conclusion seriously. The board didn't sign up to support you through anything; they signed up to govern the company.

**What we DO NOT do:**
- Issue a generic apology with no specifics. The audience can tell.
- Blame the platform, the journalist, or the mob.
- Disappear and hope it blows over.

---

## CRISIS 5 — The product itself is the controversy

**The scenario.** Mizan ships a verdict that turns out to be wrong (e.g., we said a stock was halal under Mufti Taqi and the underlying data was misread). Users have made financial decisions based on it. The error is now public.

**Pre-decided response:**

**Hour 0-1:** Confirm the error. The CTO and the Shariah Board secretary both sign off on the determination that the prior verdict was wrong.

**Hour 1-4:** Fix the verdict immediately in production. Issue a re-screen of any portfolio that held the affected ticker. Push notification to Pro users immediately; email to all affected users.

**Hour 4-12:** Published correction at mizan.app/methodology/corrections (we will pre-build this page). Template:

> [Date]
>
> Between [date] and [date], Mizan displayed [specific ticker] as [previous verdict] under [scholar's] methodology. After review, this verdict was incorrect.
>
> The corrected verdict is [new verdict]. The reason for the error: [specific, plain explanation].
>
> If you held [ticker] in a portfolio synced with Mizan during this period and made decisions based on the prior verdict, we want to acknowledge that. We're sorry.
>
> We've updated [specific process change] to prevent a repeat of this specific type of error.
>
> If you'd like to discuss this directly, write to methodology@mizan.app. We will respond personally.

**Compensation.** If the error caused users to take action they wouldn't otherwise have taken (e.g., bought a stock they shouldn't have under their scholar): we will offer a 3-month Pro tier credit and direct guidance from the Shariah Board secretary on how to handle the existing position. We don't offer to compensate financial losses (we are not licensed for that and don't have the capital to make it credible) — but we are honest about the error and helpful about next steps.

**What we DO NOT do:**
- Issue a quiet update without telling users.
- Frame the error as anything other than an error.
- Promise it will never happen again.

---

## A universal principle: speed beats polish

The 24-hour clock starts when the crisis becomes public, not when you finish drafting the perfect response. A clearly-imperfect statement in 6 hours is far better than a perfectly-polished statement in 60.

## A universal principle: the founder writes the public response

The founder, personally. Not the head of growth. Not a PR firm. Not a ghostwriter. The audience knows the difference.

## A universal principle: write the action, then the words

The thing you DO in response matters more than the words. If your response is "we changed X to prevent recurrence," users will believe that more than any apology. If your response is only words, the audience knows that too.

## Pre-crisis hygiene

- Have a designated lawyer on retainer who can take a 6pm Friday call (Deacons HK for us; Field Fisher for UK overlay).
- Have a designated PR/comms advisor in the founder's network (an early angel or board observer).
- Maintain a "founders helping founders" peer group of 5-7 other founders who have been through a real crisis. Their advice is more valuable than any agency's.
- Practice. Once a quarter, the founder picks one of these five scenarios and writes the first-hour response as if it were happening. Keep the draft in the document.

---

This document is not bedtime reading. It's the document you wish you'd written when something inevitably happens. Glad we wrote it now.
