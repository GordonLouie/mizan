# Using 21st.dev with Mizan — practical guide

**Goal:** Use 21st.dev to upgrade individual Mizan components (cards, headers, hero sections, etc.) without re-architecting the site. You stay in Cowork; I integrate what 21st produces.

---

## The mental model

21st.dev gives you two things:

1. **A marketplace** of pre-built React + Tailwind components (free + paid). You browse, find one you like, copy the code, paste it to me, I drop it into Mizan with the right colors/data.
2. **A generator** ("Magic") that produces a component from a text prompt. Built for Cursor / Windsurf / VS Code. You don't use those, so this isn't your primary path — but the marketplace covers ~90% of polish work anyway.

You don't need 21st installed anywhere. It runs entirely in their web app. Mizan stays untouched until you paste code to me.

---

## Step-by-step: the polish workflow

### 1. Go to [21st.dev](https://21st.dev) and skip the sign-up if it lets you

The marketplace is browsable without an account. Sign in only if you want to save favorites or use Magic. Free tier is plenty for our purposes.

### 2. Browse by category

Top of the page → "Components" → categories like:

- **Hero sections** — homepage above-the-fold
- **Buttons** — replace our existing `<Button>` if Miqdad wants a different feel
- **Cards** — the scholar cards on `/learn`, the stock cards on `/screen`
- **Dropdowns / Selects** — already standardized, but if you find a fancier one we can swap
- **Forms** — the `/contact` form, the `/custom` thresholds page
- **Sliders** — the `/custom` threshold sliders (could pair with the tick-marks we added)
- **Stats / Numbers** — the trust strip on home, the summary on `/universe`
- **Charts** — the donut on `/zakat`, the timeline on `/screen`
- **Empty states** — the "no holdings" view on `/portfolio`, the empty watchlist
- **Pricing tables** — for when you launch a Premium tier
- **Footers** — current footer is fine, but if you want something with newsletter signup integrated

### 3. Open a component and grab its code

Each component has a preview, a "Code" tab showing the JSX/Tailwind, and an "Install" button. Ignore Install — that's for Cursor users. Use the **Copy code** button on the Code tab.

### 4. Paste it into our chat with one sentence of context

Format that works best:

```
Use this on /portfolio instead of the current empty state.
I want it to say "No holdings yet — add your first one" and
link to the existing /portfolio/edit page.

<paste the code here>
```

That's it. I'll:

- Translate any non-Mizan colors to your design tokens (navy-700, gold-600, emerald-700, rose-700)
- Replace any `next/image` placeholders with your real assets
- Wire up event handlers to the existing state / router
- Make sure it matches the editorial typography (Georgia for display, system sans for body)
- Run `tsc` and confirm it compiles
- Give you the commit + push command

### 5. If a component depends on libraries we don't have

Some 21st components use `framer-motion`, `react-hook-form`, `@radix-ui/...`, etc. Tell me what they want, I'll either:

- Install it (if it's small and worth keeping)
- Rewrite the component without it (often a 1-line CSS transition replaces `framer-motion` for our use case)

I'll always tell you which I'm doing and why.

---

## Where 21st would help Mizan most (ranked by impact)

Based on Tyler + Miqdad + friend feedback, the highest-leverage polish targets:

### 1. Homepage hero — the "Why Mizan" wedge

Tyler said this section already lands well. A 21st hero with a side-by-side comparison animation (AAOIFI vs Mufti Taqi) could make it land harder. Browse "Heroes" → "Comparison" or "Split-screen". Look for ones with two big numbers and a divider line.

### 2. Scholar cards on `/learn` and home

We have basic cards. 21st has card patterns with hover lifts, gradient accents, citation badges. Browse "Cards" → "Feature cards" or "Article cards." Pick one that emphasizes hierarchy (big headline, supporting line, small tag).

### 3. Stock detail page (`/screen`)

This is where users spend the most time. The verdict card is the focal point. 21st has "Stat displays" and "Metric cards" with bigger numbers and clearer secondary text. Browse "Stats" or "Dashboards."

### 4. Zakat result hero

The three-column grid is functional but bland. 21st has "Result panels" and "Calculator outputs" that surface a single big number with breakdown. Browse "Stats" → look for ones with one dominant value + nisab progress.

### 5. Portfolio page

The portfolio is the weakest page visually right now. 21st has whole portfolio dashboards with gain/loss tiles, donut allocations, and time-period selectors. Whole `/portfolio` is a candidate for a 21st-derived redesign.

---

## What NOT to use 21st for

- **Real estate where data is the point.** The annotated balance sheet, the multi-scholar comparison table — those are bespoke for Mizan. No 21st component will match the domain.
- **Methodology text and citations.** Editorial writing, sourced. 21st can't produce this.
- **Anything that requires our screening engine.** The verdict card needs to call `screenStock()`. A 21st component is a shell; the data wiring is mine.

---

## The honest cost / benefit

- **Setup time:** ~5 minutes (browse, copy)
- **My integration time:** 10–30 minutes per component depending on complexity
- **Result:** Faster aesthetic upgrades than designing from scratch
- **Risk:** 21st components can drift from Mizan's editorial voice (FT-print, cream backgrounds, gold accents). I'll keep them in line, but you should always review before pushing.

---

## Workflow shortcut

If you don't know what to look for on 21st, just describe what you want in our chat:

> "I want the verdict card on /screen to feel more like a Bloomberg
> Terminal block — dense, monospaced, very serious."

I'll either browse 21st on your behalf (via WebFetch on their public pages — limited but useful for ideas), or build it directly from Mizan's design tokens. Often you don't need 21st at all; the design system primitives we have already cover most asks.

---

**Bottom line:** Use 21st as a *visual reference library* and *paste pipeline*. Browse → copy → tell me where you want it → I integrate. Don't try to manage 21st as a separate workflow tool; it lives entirely on their site, and Mizan only sees the code you choose to paste.
