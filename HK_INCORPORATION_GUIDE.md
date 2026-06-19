# Incorporating HalalGauge Ltd in Hong Kong — practical guide (2026)

> General info, **not legal/tax advice.** HK fees change (the BR levy changed 1 Apr 2026).
> Have a HK CPA + a licensed company-secretary (TCSP) firm confirm figures, your share
> structure, audit scope, tax position, and the SFC/data-licensing questions specific to a
> stock-screening app before filing. Your brother (law grad) can do a useful first-pass review.

## Why we're doing this now
Proper **commercial data licensing** — Twelve Data Venture *or* FMP Enterprise — requires a
**company tax ID**, which means a registered company. Incorporation also unlocks the business
bank account, Stripe Live, and institutional credibility. It's the single step that unblocks the
whole commercial layer, so it's worth doing before paying for any commercial data plan.

## What you need (private company limited by shares)
- **Directors:** min 1, must include a natural person; **no nationality/residency requirement** — you qualify. Sole director + sole shareholder is fine.
- **Shareholders:** min 1 (can be you). **Share capital:** no minimum — e.g. 10,000 shares × HK$1.
- **Company secretary:** **mandatory**, must be a HK-resident individual or a TCSP-licensed firm. **A sole director cannot also be the secretary** → this is why solo founders use an agent.
- **Registered office:** a physical HK address (agents bundle this).
- **Significant Controllers Register (SCR):** mandatory; the secretary maintains it + a Designated Representative.
- **Form NNC1** + Articles of Association + **IRBR1** filed together (one-stop: Companies Registry incorporation + IRD business registration at once).

## Government cost (2026, electronic, 1-year BR) ≈ **HK$3,895**
- Incorporation fee (NNC1, electronic): **HK$1,545**
- Business Registration Certificate (1-yr): **HK$2,200 + HK$150 levy = HK$2,350** (the levy is **back** as of 1 Apr 2026; no general waiver currently — re-check the IRD fee table before paying).
- 3-year BR option: ~HK$6,170 (cheaper per year).

## Your "Tax ID" = **BRN** (not CRN)
- **BRN (Business Registration Number)** — **8 digits**, on the BR Certificate. HK's tax-ID equivalent (and the Unique Business Identifier). **This is what you enter in any vendor "Tax ID" field — Twelve Data, FMP, Stripe, etc.**
- **CRN (Company Registration Number)** — 7 digits, on the Certificate of Incorporation; for Companies Registry filings, **not** a tax ID.
- HK has no VAT/GST, so there's no separate VAT number.

## DIY vs agent
- **DIY (e-Registry):** government fees only (~HK$3,895), **but** you still legally need a TCSP secretary + HK address, which you'd have to source separately — rarely worth it for a first-time solo founder.
- **Agent bundle (recommended):** Sleek, Osome, Air Corporate, Bridges, Hawksford. Bundles incorporation + Year-1 company secretary + registered address + BR + SCR. **All-in Year 1 ≈ HK$4,000–8,000** for budget online agents (Hawksford/premium higher). Use one.

## Timeline
- Electronic filing: Certificate of Incorporation often in **~1 hour – 4 business days**, BR follows in ~1–2 days. With an agent (name check + your KYC/signing): **a few days to ~1–2 weeks**.

## Business bank account — the real bottleneck
HK traditional banks (HSBC, Hang Seng) are **slow/strict** for pre-revenue startups (2 weeks–3 months, rejection risk; HSBC has a startup-oriented "Sprint Account").
- **Recommended:** open a **fintech account first — Airwallex / Statrys / Aspire** — light digital KYC, **days not months**, good for SaaS receivables. (These are payment-institution e-money accounts, not deposit-insured banks — fine for operating cash, don't park reserves.)
- Optionally pursue HSBC Sprint in parallel for a traditional HKD relationship.

## Sequence — what unlocks what
1. Decide name + structure (sole director+shareholder, share capital).
2. Engage agent's **TCSP company secretary + registered office**.
3. File **NNC1 + Articles + IRBR1** (electronic). Pay ~HK$3,895.
4. Receive **CI (CRN) + BR (BRN)** in ~1–4 days. **Save the BR — BRN is your tax ID.**
5. Secretary sets up the **SCR** + Designated Representative.
6. Open **fintech business account** (Airwallex/Statrys/Aspire) — unlocks money in/out.
7. (Site already live) → activate **Stripe Live** — needs CI, BR, director KYC, a HK bank/payment account, and the live business website.
8. Buy **Twelve Data Venture / FMP Enterprise** — checkout asks for company name + **BRN as Tax ID**; pay from the business account.

Dependency notes: **BR/BRN unlocks almost everything downstream** (Stripe, vendor tax-ID fields, banking). Stripe Live also needs the live site. The data licenses just need a valid company + BRN + a payment method.

## Ongoing obligations (annual)
- **Annual Return (NAR1):** within **42 days** of incorporation anniversary; HK$105 on time (late escalates to HK$870→3,480 — don't miss it).
- **BR renewal:** ~HK$2,350/yr.
- **Company secretary + registered office:** ~HK$1,500–6,000/yr (agent).
- **Statutory audit:** **mandatory every year** by a HK CPA — budget **~HK$5,000–15,000+/yr**.
- **Profits Tax Return:** first ~18 months after incorporation, then annual. **Two-tier rate: 8.25% on first HK$2m profit, 16.5% above.** Territorial system; offshore claims need IRD application + CPA.
- **Realistic Year-1 spend:** ~HK$3,895 gov + ~HK$4,000–8,000 agent. **Year 2+:** ~HK$10,000–25,000/yr all-in (sec + address + BR + audit/accounting).

## Watch-outs
- **BR levy is back (HK$150) as of 1 Apr 2026** — re-check the IRD fee table; the Feb Budget can change it.
- **You cannot be your own secretary as sole director** — TCSP/HK-resident secretary is non-negotiable.
- **Banking is the real delay** — start the fintech account immediately.
- **Stripe Live needs the live site** describing the product (you have it).
- **Tax ID = BRN (8 digits), not CRN (7).**
- **Audit is mandatory** even if tiny — budget a CPA.
- **SFC / regulated-activity check:** a halal stock-screening app can brush against SFC perimeter questions (advice on securities). Get legal advice on whether any feature is regulated activity — your law-grad brother can do a first pass, then confirm with a HK lawyer.
- **Data-vendor license is separate from incorporation** — Venture/Enterprise display rights are a contract term; you've already confirmed Venture covers display.

## Immediate next action
Pick an incorporation agent (Sleek / Osome / Air Corporate), choose the company name + run a name check, and engage their company-secretary + registered-address bundle. That kicks off everything above. Once you have the **BR Certificate**, you're cleared to subscribe to Twelve Data Venture (BRN as tax ID) and the HK data switch goes live.
