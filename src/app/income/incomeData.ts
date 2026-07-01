/**
 * Data for /income — the halal fixed-income & protection explorer.
 *
 * Education, not a fatwa. HalalGauge has no credentialed scholar on staff yet,
 * so every claim here is plain-English mainstream contemporary reasoning and
 * every product ends on "check the specific structure / ask a scholar."
 *
 * Kept as a standalone module (new file) so the page component stays readable.
 */

export type Kind = "sukuk" | "takaful" | "deposit";

export interface CheckItem {
  q: string;
  detail: string;
}

export interface Product {
  id: string;
  kind: Kind;
  name: string;
  arabic?: string;
  arabicGloss?: string;
  tagline: string;
  /** One-line "what it is". */
  what: string;
  /** How the money actually moves. */
  how: string;
  /** Why mainstream scholars treat it as permissible. */
  why: string;
  /** The conventional product it replaces. */
  replaces: string;
  /** What to verify before buying — structure decides the ruling. */
  checks: CheckItem[];
}

export const KIND_META: Record<
  Kind,
  { label: string; blurb: string; dot: string; chip: string; accent: string }
> = {
  sukuk: {
    label: "Sukuk",
    blurb: "Islamic 'bonds' — ownership in real assets that pay rent or profit.",
    dot: "bg-emerald-500",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200",
    accent: "border-emerald-300",
  },
  takaful: {
    label: "Takaful",
    blurb: "Islamic mutual insurance — a pool members donate into to cover each other.",
    dot: "bg-navy-500",
    chip: "bg-navy-50 text-navy-700 border-navy-200",
    accent: "border-navy-300",
  },
  deposit: {
    label: "Islamic deposits",
    blurb: "Bank placements built on agency, cost-plus trade or profit-sharing — never a loan at interest.",
    dot: "bg-gold-500",
    chip: "bg-gold-50 text-gold-700 border-gold-200",
    accent: "border-gold-200",
  },
};

export const PRODUCTS: Product[] = [
  // ── SUKUK ───────────────────────────────────────────────────────────────
  {
    id: "sovereign-sukuk",
    kind: "sukuk",
    name: "Sovereign sukuk",
    arabic: "صكوك",
    arabicGloss: "sukuk = certificates",
    tagline: "A government 'Islamic bond'.",
    what: "A certificate showing you co-own a slice of a real government asset — say, an airport terminal or a highway — rather than a slice of the government's debt.",
    how: "The state sets up a special vehicle that buys (or builds) a real asset and leases it back to the government. Your periodic payment is your share of that rent; at maturity the vehicle buys the asset back and returns your principal.",
    why: "You are paid rent on an asset you genuinely own, not interest (riba = a guaranteed increase on a loan). Because the payment traces to a real, productive asset, mainstream scholars treat well-structured sovereign sukuk as permissible.",
    replaces: "Government bond / treasury bill",
    checks: [
      { q: "Is it asset-backed, not just asset-based?", detail: "You want a real transfer of (or claim on) the underlying asset — not a paper wrapper that just mimics a loan's cash flows." },
      { q: "What is the structure — ijara, wakala, murabaha?", detail: "Ijara (lease = you own and rent out an asset) and wakala (agency) are widely accepted. Pure murabaha or tawarruq structures are more debated." },
      { q: "Who certified it?", detail: "Look for a named Shariah board and, ideally, AAOIFI-standard compliance. A prospectus should state both." },
    ],
  },
  {
    id: "corporate-sukuk",
    kind: "sukuk",
    name: "Corporate sukuk",
    arabic: "صكوك الشركات",
    arabicGloss: "company sukuk",
    tagline: "A company's 'Islamic bond'.",
    what: "The same idea as sovereign sukuk, but issued by a company to fund real projects — a fleet, a factory, a property portfolio — that you partly own through the certificate.",
    how: "A company packages a real asset or a profit-sharing venture into certificates. Holders receive a share of the lease income or venture profit, and their capital back at the end when the asset is bought out.",
    why: "The return is profit or rent from a real business asset, borne on genuine ownership — not a fixed coupon on money lent. Loss on the underlying asset can in principle flow back to holders, which is what distinguishes ownership from lending.",
    replaces: "Corporate bond",
    checks: [
      { q: "Is the issuer's core business halal?", detail: "A perfectly-structured sukuk from an alcohol or conventional-bank issuer still funds a prohibited business." },
      { q: "Does the return track a real asset, or an interest benchmark?", detail: "Many sukuk price off a rate like SOFR for convenience. A benchmark alone isn't fatal, but the cash flow must genuinely come from the asset." },
      { q: "What happens on default?", detail: "In a true sukuk you have recourse to the asset. If your only recourse is the issuer's promise to repay par, scholars flag it as debt in disguise." },
    ],
  },
  // ── TAKAFUL ─────────────────────────────────────────────────────────────
  {
    id: "family-takaful",
    kind: "takaful",
    name: "Family takaful",
    arabic: "تكافل",
    arabicGloss: "takaful = mutual guaranteeing",
    tagline: "Islamic life / savings protection.",
    what: "A cooperative alternative to life insurance. Members contribute to a shared pool as a donation (tabarru') to help whichever member suffers a loss; a linked savings account grows via halal investment.",
    how: "Your contribution splits: part is a donation into the risk pool, part goes to an investment account managed on your behalf. Claims are paid from the pool. Any surplus in the pool can be shared back with members — it isn't kept as company profit.",
    why: "Conventional insurance sells you certainty against an uncertain event for a premium — a trade of money for money with heavy gharar (excessive uncertainty) and interest-invested reserves. Takaful reframes it as mutual aid: you donate to help others and are helped in turn, so the uncertainty is in a gift, not a sale.",
    replaces: "Whole / term life insurance",
    checks: [
      { q: "Is the donation (tabarru') genuinely a donation?", detail: "The defining feature. Your contribution to the risk pool must be given as help to others, not a premium bought for a guaranteed payout." },
      { q: "Where are the reserves invested?", detail: "The pool and your savings account must be invested only in halal, screened assets — not interest-bearing bonds or deposits." },
      { q: "How is surplus handled?", detail: "Leftover funds in the pool should be returned to members or rolled forward — not simply booked as the operator's profit." },
    ],
  },
  {
    id: "general-takaful",
    kind: "takaful",
    name: "General takaful",
    arabic: "تكافل عام",
    arabicGloss: "general takaful",
    tagline: "Islamic home / motor / health cover.",
    what: "The everyday-protection version: property, motor, travel or health cover run on the same cooperative-pool model instead of a for-profit insurer selling risk.",
    how: "Members pay into a pooled fund as donations. When someone has a valid claim, it is paid from the pool. A separate operator company runs the scheme for a fixed fee (wakala) or a share of investment profit (mudaraba) — not by keeping the premiums.",
    why: "Because members collectively bear each other's losses through donations, the excessive uncertainty (gharar) and interest (riba) of a conventional policy are removed. The operator earns a transparent management fee, not the spread on gambled-against risk.",
    replaces: "Home / motor / health insurance",
    checks: [
      { q: "Wakala or mudaraba operator model?", detail: "Wakala = the operator takes a disclosed fee (agency). Mudaraba = it shares investment profit. Both are accepted; you just want it stated clearly." },
      { q: "Is it a real takaful window, or conventional relabelled?", detail: "Some insurers slap 'takaful' on a conventional product. Check for a named Shariah board and a genuine tabarru' pool." },
      { q: "Are claims paid from the pool, not company capital?", detail: "In true takaful the members' fund pays claims. If the shareholders' company underwrites the risk for profit, it's conventional insurance." },
    ],
  },
  // ── DEPOSITS ────────────────────────────────────────────────────────────
  {
    id: "wakala-deposit",
    kind: "deposit",
    name: "Wakala deposit",
    arabic: "وكالة",
    arabicGloss: "wakala = agency",
    tagline: "Agency-based term placement.",
    what: "You appoint the bank as your agent to invest your money in real, halal transactions and hand you the profit, keeping a fee for its work.",
    how: "You place funds and agree an expected profit rate. The bank invests them in Shariah-compliant assets as your agent. It keeps a pre-agreed fee (and often any profit above the target); you receive the returns of the underlying investments.",
    why: "You own the invested funds throughout and take the real investment result — the bank is a paid agent, not a borrower paying you interest. The 'expected' rate is a target, not a guaranteed increase on a loan.",
    replaces: "Fixed-term interest deposit",
    checks: [
      { q: "Is the profit rate 'expected', not guaranteed?", detail: "A wakala return must be indicative. A contractually guaranteed rate on your money is interest (riba) wearing an Islamic label." },
      { q: "What is the bank actually investing in?", detail: "The agency only works if your funds go into genuinely halal assets — ask what the underlying investments are." },
      { q: "Is the agency fee disclosed up front?", detail: "The wakil's (agent's) fee should be transparent, not hidden in an opaque spread." },
    ],
  },
  {
    id: "murabaha-deposit",
    kind: "deposit",
    name: "Murabaha term deposit",
    arabic: "مرابحة",
    arabicGloss: "murabaha = cost-plus sale",
    tagline: "Cost-plus commodity trade deposit.",
    what: "Your fixed-term return comes from a real, disclosed-markup commodity sale arranged by the bank — not from lending the bank your cash at interest.",
    how: "The bank buys a real commodity, sells it on at cost plus a disclosed profit margin, and the timing of that trade generates your return over the term. It looks bond-like from the outside but rests on an actual sale of goods.",
    why: "Profit from buying and selling a real commodity at a known markup is trade, which is permitted; interest on a loan is not. The margin is fixed and disclosed because it is a sale price, not a rate charged on borrowed money.",
    replaces: "Certificate of deposit (CD)",
    checks: [
      { q: "Is there a genuine underlying commodity trade?", detail: "There must be a real asset that is actually bought and sold — not a paper loop designed only to produce a return." },
      { q: "Is this tawarruq, and are you comfortable with it?", detail: "Commodity murabaha (tawarruq) is widely used but debated when the trade is purely synthetic. Some scholars accept it; some don't." },
      { q: "Is the markup disclosed as a sale price?", detail: "The profit should be a stated part of the sale, agreed once — not a floating interest rate." },
    ],
  },
  {
    id: "mudaraba-deposit",
    kind: "deposit",
    name: "Mudaraba deposit",
    arabic: "مضاربة",
    arabicGloss: "mudaraba = profit-sharing",
    tagline: "Profit-and-loss sharing account.",
    what: "You provide the capital, the bank provides the expertise, and you split the real profit on an agreed ratio — the classic Islamic investment partnership.",
    how: "Your deposit joins a pool the bank invests in halal assets. Profits are shared by a pre-agreed ratio (say 70/30). If the venture loses money, you as the capital provider bear the capital loss; the bank loses its effort and fee.",
    why: "Return tied to real profit — and genuine exposure to loss — is exactly what makes this an investment rather than a loan. There is no guaranteed increase, so there is no riba; the risk-sharing is the point.",
    replaces: "Interest-bearing savings account",
    checks: [
      { q: "Do you actually share in loss?", detail: "True mudaraba means your capital is at risk. If loss is impossible and return is fixed, it has quietly become an interest account." },
      { q: "Is the profit-sharing ratio fixed, not the amount?", detail: "You agree a share of profit (e.g. 70%), never a fixed sum — a fixed sum would be a guaranteed return." },
      { q: "Are the pool's assets screened?", detail: "The invested pool must hold only halal assets for the profit to be permissible." },
    ],
  },
  {
    id: "qard-hasan",
    kind: "deposit",
    name: "Qard hasan account",
    arabic: "قرض حسن",
    arabicGloss: "qard hasan = benevolent loan",
    tagline: "Interest-free safekeeping.",
    what: "A plain, interest-free loan to the bank: it safeguards your money, repays it in full on demand, and pays you nothing extra. The model of a permissible loan.",
    how: "You deposit funds; legally you have lent them to the bank interest-free. The bank guarantees to return the exact amount. It may use the funds, but any 'reward' must be a discretionary gift (hiba), never a promised or expected return.",
    why: "A loan repaid at face value with no stipulated increase is the textbook halal loan — the very thing riba corrupts. Because nothing extra is promised, there is no interest. It is the benchmark against which every other deposit is judged.",
    replaces: "Basic current / checking account",
    checks: [
      { q: "Is any 'bonus' truly a gift, not a promise?", detail: "A bank may gift a reward, but the moment it is expected, advertised or contractual, it becomes interest (riba)." },
      { q: "Is your capital guaranteed at face value?", detail: "A qard must be repayable in full — that's what makes it a loan rather than an investment." },
      { q: "Are you being offered a 'rate'? Walk away.", detail: "Any stated rate on a deposit account is the classic sign of riba, however it is dressed up." },
    ],
  },
];

// ── EXCLUDED CONVENTIONAL PRODUCTS ─────────────────────────────────────────

export interface Excluded {
  name: string;
  what: string;
  reason: string;
  /** Short terms driving the exclusion. */
  flags: ("riba" | "gharar" | "maysir")[];
  halalAlt: string;
}

export const EXCLUDED: Excluded[] = [
  {
    name: "Government & corporate bonds",
    what: "You lend money and are paid fixed interest (a coupon) plus your principal back.",
    reason: "The entire return is a guaranteed increase on a loan — the definition of riba.",
    flags: ["riba"],
    halalAlt: "Sovereign / corporate sukuk",
  },
  {
    name: "Treasury bills",
    what: "Short-term government debt, sold at a discount and redeemed at face value.",
    reason: "The discount you earn is interest on a loan to the state (riba), just structured as a price gap.",
    flags: ["riba"],
    halalAlt: "Short-tenor sovereign sukuk",
  },
  {
    name: "Certificates of deposit (CDs)",
    what: "You lock cash with a bank for a term in exchange for a guaranteed interest rate.",
    reason: "A guaranteed rate on money lent to the bank is riba, plain and simple.",
    flags: ["riba"],
    halalAlt: "Murabaha or wakala term deposit",
  },
  {
    name: "Conventional insurance",
    what: "You pay premiums to a for-profit insurer that pays out if a covered event occurs.",
    reason: "It trades money for an uncertain payout (heavy gharar) and invests reserves in interest-bearing assets (riba).",
    flags: ["gharar", "riba"],
    halalAlt: "Family / general takaful",
  },
  {
    name: "Annuities",
    what: "You hand over a lump sum for a guaranteed income stream for life or a set term.",
    reason: "The guaranteed return is interest-based (riba) and the lifetime payout is structurally uncertain (gharar).",
    flags: ["riba", "gharar"],
    halalAlt: "Sukuk ladder + takaful",
  },
];

// ── SIDE-BY-SIDE COMPARISONS ───────────────────────────────────────────────

export interface CompareRow {
  dimension: string;
  halal: string;
  conventional: string;
}

export interface Comparison {
  id: string;
  halalName: string;
  conventionalName: string;
  rows: CompareRow[];
}

export const COMPARISONS: Comparison[] = [
  {
    id: "sukuk-vs-bond",
    halalName: "Sukuk",
    conventionalName: "Conventional bond",
    rows: [
      { dimension: "What you hold", halal: "Ownership of a real, productive asset", conventional: "A loan (IOU) to the issuer" },
      { dimension: "Where the return comes from", halal: "Rent or profit the asset generates", conventional: "Fixed interest (coupon) on the loan" },
      { dimension: "Exposure to loss", halal: "Can, in a true structure, share in asset loss", conventional: "Principal is a debt claim, not asset-linked" },
      { dimension: "On default", halal: "Recourse to the underlying asset", conventional: "Recourse to the issuer's covenant to repay" },
      { dimension: "Core issue", halal: "Trade & ownership — permitted", conventional: "Riba (interest on a loan)" },
    ],
  },
  {
    id: "takaful-vs-insurance",
    halalName: "Takaful",
    conventionalName: "Conventional insurance",
    rows: [
      { dimension: "The relationship", halal: "Members mutually help each other", conventional: "You buy cover from a for-profit insurer" },
      { dimension: "Your contribution", halal: "A donation (tabarru') into a shared pool", conventional: "A premium paid to purchase risk cover" },
      { dimension: "Who bears the risk", halal: "The pool of members, collectively", conventional: "The insurer, which profits from the spread" },
      { dimension: "Surplus", halal: "Can be shared back with members", conventional: "Kept by the company as profit" },
      { dimension: "Core issue", halal: "Cooperation — permitted", conventional: "Gharar (uncertainty) + riba on reserves" },
    ],
  },
];
