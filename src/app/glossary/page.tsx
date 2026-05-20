import Link from "next/link";

export const metadata = {
  title: "Glossary · Mizan",
  description: "Plain-language definitions of Islamic finance terms: riba, gharar, maisir, sukuk, zakat, khums, mudaraba, musharaka, ijara, and more.",
};

interface Term { term: string; transliteration?: string; def: string; }

const TERMS: { letter: string; entries: Term[] }[] = [
  {
    letter: "A",
    entries: [
      { term: "AAOIFI", def: "Accounting and Auditing Organization for Islamic Financial Institutions. The Bahrain-based standards body whose Shariah Standard No. 21 is the basis for most mainstream halal-stock screening." },
      { term: "Ajr", transliteration: "أجر", def: "Reward. In Islamic finance, especially used to denote the legitimate compensation for service rendered (as opposed to interest)." },
    ],
  },
  {
    letter: "B",
    entries: [
      { term: "Bai'", transliteration: "بيع", def: "Sale or exchange. The foundational permissible transaction type in Islamic commerce — exchange of value for value with clear terms and immediate transfer of ownership." },
      { term: "Bai' al-kali bi-l-kali", def: "The sale of one debt for another, classically prohibited. Modern application: trading shares of a company whose balance sheet is essentially debt for debt approaches this prohibition." },
    ],
  },
  {
    letter: "F",
    entries: [
      { term: "Fatwa", transliteration: "فتوى", def: "A scholarly opinion on a question of Islamic law. Not a binding ruling for the asker but an authoritative interpretation; Muslims may follow a particular scholar's fatwas." },
      { term: "Fiqh", transliteration: "فقه", def: "Islamic jurisprudence — the science of deriving rulings from primary sources. Different schools of fiqh (madhabs) sometimes reach different conclusions on contemporary financial questions." },
    ],
  },
  {
    letter: "G",
    entries: [
      { term: "Gharar", transliteration: "غرر", def: "Excessive uncertainty or ambiguity in a transaction. A contract with substantial gharar — where the subject matter, price, or delivery is not sufficiently specified — is impermissible. The reason conventional options and futures are problematic." },
    ],
  },
  {
    letter: "H",
    entries: [
      { term: "Halal", transliteration: "حلال", def: "Permissible under Islamic law. In finance, refers to investments and transactions that comply with Shariah principles." },
      { term: "Haram", transliteration: "حرام", def: "Forbidden under Islamic law. Direct riba (interest), gambling, and trading in prohibited substances are categorical examples." },
    ],
  },
  {
    letter: "I",
    entries: [
      { term: "Ijara", transliteration: "إجارة", def: "Leasing. A Shariah-compliant financing structure where a financier owns an asset and leases it to the user for rent. Used in halal car finance and as one structure for halal home finance." },
      { term: "Istisna'a", transliteration: "استصناع", def: "A manufacturing/construction contract — the buyer commissions a producer to manufacture something for an agreed price and delivery date. Permissible because both parties accept a defined risk of non-delivery." },
    ],
  },
  {
    letter: "J",
    entries: [
      { term: "Ja'fari", transliteration: "جعفري", def: "The most widely-followed school of Shia Islamic jurisprudence, also called Imamiyya or Ithna 'Ashari (Twelver) Shia. Most-followed contemporary scholar: Ayatollah Sistani. Includes the obligation of khums (one-fifth on net annual surplus)." },
    ],
  },
  {
    letter: "K",
    entries: [
      { term: "Khums", transliteration: "خمس", def: "One-fifth (20%) — a religious obligation in Ja'fari Shia practice on net annual surplus wealth (income beyond ordinary expenses, including realized investment gains). Distinct from zakat. Paid through marja accounts." },
    ],
  },
  {
    letter: "M",
    entries: [
      { term: "Madhab", transliteration: "مذهب", def: "School of Islamic jurisprudence. The four major Sunni madhabs are Hanafi, Maliki, Shafi'i, and Hanbali. The major Shia school is Ja'fari. Each can reach materially different conclusions on contemporary financial questions." },
      { term: "Maisir", transliteration: "ميسر", def: "Gambling or speculative gain dependent on chance. Categorically prohibited. The reason lotteries, casino betting, and many derivative instruments are impermissible." },
      { term: "Marja", transliteration: "مرجع", def: "In Ja'fari Shia practice, a senior religious authority whose rulings (taqlid) a believer may choose to follow. Ayatollah Sistani is widely considered the most prominent contemporary marja." },
      { term: "Mudaraba", transliteration: "مضاربة", def: "A profit-sharing partnership where one party provides capital and the other provides labor/expertise. The capital provider bears financial loss; the manager bears the loss of their effort. Shariah-compliant financing alternative to debt." },
      { term: "Musharaka", transliteration: "مشاركة", def: "Equity partnership — multiple parties contribute capital and share profits and losses according to agreed ratios. The basis for diminishing musharaka home financing." },
    ],
  },
  {
    letter: "N",
    entries: [
      { term: "Nisab", transliteration: "نصاب", def: "The minimum threshold of wealth above which zakat becomes obligatory. Historically defined in terms of gold (87.48g) or silver (612.36g) — modern application uses current market value. The silver standard is more conservative (lower threshold)." },
    ],
  },
  {
    letter: "P",
    entries: [
      { term: "Purification", def: "The practice of donating the impermissible portion of investment income (typically dividends, and under stricter scholars also capital gains) to charity without expecting reward. Cleanses the otherwise-permissible holding. Calculated as: (impermissible income % of company revenue) × (income received)." },
    ],
  },
  {
    letter: "Q",
    entries: [
      { term: "Qard hasan", transliteration: "قرض حسن", def: "A benevolent loan — no interest, no profit expected, sometimes no fixed repayment schedule. The Shariah-compliant form of lending. Practiced charitably between Muslims." },
    ],
  },
  {
    letter: "R",
    entries: [
      { term: "Riba", transliteration: "ربا", def: "Interest or usury. The categorical prohibition against riba is one of the foundational principles of Islamic finance. Refers to both interest on loans (riba al-nasiyah) and certain unequal commodity exchanges (riba al-fadl)." },
    ],
  },
  {
    letter: "S",
    entries: [
      { term: "SAC", def: "Shariah Advisory Council — typically refers to the SAC of Securities Commission Malaysia, which sets methodology for Shariah-compliant securities listed in Malaysia. Tightened from a 5%/20% mixed-activity benchmark to a single 5% benchmark effective for FY ending Dec 2025 onward." },
      { term: "Salam", transliteration: "سلم", def: "A forward sale where the buyer pays upfront and the seller delivers a specified good at a future date. Permissible because both price and specifications are defined in advance — different from speculative futures." },
      { term: "Shariah", transliteration: "شريعة", def: "Islamic law derived from the Quran, the Sunnah (Prophet's example, peace be upon him), and scholarly consensus. In finance, governs what transactions and structures are permissible." },
      { term: "Shariah Supervisory Board", def: "A body of qualified scholars who supervise an Islamic financial institution's compliance — approving methodologies, reviewing products, auditing operations. Mizan has its own Supervisory Board governing all methodologies displayed in the product." },
      { term: "Sukuk", transliteration: "صكوك", def: "Islamic financial certificate, often called the Shariah-compliant alternative to bonds. Unlike conventional bonds, sukuk represent ownership in an underlying asset (real estate, infrastructure, equipment) rather than interest-bearing debt. SPSK is a US ETF that holds Sukuk." },
    ],
  },
  {
    letter: "T",
    entries: [
      { term: "Takaful", transliteration: "تكافل", def: "Cooperative Shariah-compliant insurance. Participants pool contributions; claims are paid from the pool; surplus returned to participants. The Islamic alternative to conventional insurance." },
      { term: "Taqlid", transliteration: "تقليد", def: "Following the rulings of a particular scholar in matters of practical law. A Muslim chooses a scholar whose interpretations they will follow on matters they themselves cannot derive." },
    ],
  },
  {
    letter: "U",
    entries: [
      { term: "'Urf", transliteration: "عرف", def: "Custom and convention — recognized as a secondary source of Islamic law where there is no explicit text on a matter. Contemporary financial practice often relies on 'urf for novel instruments." },
    ],
  },
  {
    letter: "W",
    entries: [
      { term: "Wakala", transliteration: "وكالة", def: "Agency — a contract where one party appoints another to act on their behalf for a fee. Shariah-compliant structure used in many Islamic banking products and asset management arrangements." },
    ],
  },
  {
    letter: "Z",
    entries: [
      { term: "Zakat", transliteration: "زكاة", def: "An obligatory annual charity, the third pillar of Islam. Paid at 2.5% on net zakatable wealth above the nisab threshold. Categories of wealth include cash, stocks, gold/silver, trade inventory. Mizan provides a zakat calculator at /zakat." },
    ],
  },
];

export default function GlossaryPage() {
  return (
    <article className="mx-auto max-w-3xl">
      <div className="inline-block rounded-full bg-navy-50 px-3 py-1 text-xs font-medium text-navy-800">
        Glossary
      </div>
      <h1 className="mt-3 text-3xl font-bold text-gray-900">
        Islamic finance terms, in plain language.
      </h1>
      <p className="mt-2 text-sm text-gray-600">
        Every term you&apos;ll encounter in halal investing, written without
        jargon. Bookmark this page; we add to it monthly.
      </p>

      <nav className="mt-6 flex flex-wrap gap-2">
        {TERMS.map((t) => (
          <a key={t.letter} href={`#${t.letter}`}
            className="rounded-md border border-gray-200 bg-white px-2 py-1 font-mono text-xs text-gray-700 hover:bg-navy-50 hover:text-navy-700">
            {t.letter}
          </a>
        ))}
      </nav>

      <div className="mt-8 space-y-8">
        {TERMS.map((section) => (
          <section key={section.letter} id={section.letter}>
            <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-gold-600">{section.letter}</h2>
            <dl className="mt-3 space-y-4">
              {section.entries.map((e) => (
                <div key={e.term} className="rounded-lg border border-gray-200 bg-white p-4">
                  <dt className="flex items-baseline gap-2">
                    <span className="text-base font-semibold text-gray-900">{e.term}</span>
                    {e.transliteration && (
                      <span className="font-mono text-xs text-gray-500" dir="rtl">{e.transliteration}</span>
                    )}
                  </dt>
                  <dd className="mt-1 text-sm leading-7 text-gray-700">{e.def}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      <p className="mt-10 text-xs text-gray-500">
        Missing a term? Email <Link href="/contact" className="text-navy-700 underline">our team</Link>.
      </p>
    </article>
  );
}
