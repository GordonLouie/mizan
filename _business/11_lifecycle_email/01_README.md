# Lifecycle email — drip sequences

Twelve emails across five sequences. Each is drafted, formatted, and ready to load into Customer.io, Loops, Resend, or any drip tool. Subject lines optimized for inbox-skim; copy keeps the brand voice (confident, plain, scholarly without being preachy).

## Sequences

1. **Welcome** — fires when a user signs up for the free tier. 3 emails over 7 days.
2. **Onboarding activation** — fires when a free user has not done the AMZN demo within 24h of signup. 2 emails.
3. **Paywall conversion** — fires when free user hits the 5-screens-per-day cap. 2 emails.
4. **Subscription renewal nudge** — fires 14 days before annual renewal. 1 email.
5. **Win-back / churn recovery** — fires when a Pro user cancels. 4 emails over 30 days.

## Setup notes

- **From name:** `jk @ Mizan` for personal-feeling sends; `Mizan` for transactional / billing.
- **From address:** `jk@mizan.app` (personal), `hello@mizan.app` (brand), `billing@mizan.app` (transactional).
- **Reply-to:** Always `jk@mizan.app` until founder hands off. Replying to a drip email reaches the founder.
- **Unsubscribe:** One-click unsubscribe per CAN-SPAM and GDPR. Required in every footer.
- **Timing:** Send 9am local time in user's timezone where known; default 9am ET otherwise.
- **A/B testing:** Start single-variant. Pull A/B test variants from the file when you have >2K monthly sends per variant — not before.

## Tracking

| Metric | Where it's tracked |
|---|---|
| Open rate | Customer.io / Loops dashboard |
| Click-through rate | Same; deep links UTM-tagged |
| Conversion to Pro (paywall sequence) | Stripe dashboard, attributed via `mizan_source=email` UTM |
| Reactivation (win-back) | Same |
