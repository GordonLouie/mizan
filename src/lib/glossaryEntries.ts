export const GLOSSARY: Record<string, string> = {
  // Islamic finance core
  halal: "Permissible under Islamic law. In investing, refers to stocks and transactions that comply with Shariah principles.",
  haram: "Forbidden under Islamic law. Riba (interest), gambling, alcohol, and pork-related businesses are all haram.",
  shariah: "Islamic law derived from the Quran, the Prophet Muhammad's example (peace be upon him), and scholarly consensus. Governs what's permissible in finance.",
  riba: "Interest or usury. The categorical prohibition against riba is one of the foundational principles of Islamic finance — you can't pay or earn interest.",
  gharar: "Excessive uncertainty or ambiguity in a contract. Why conventional options and futures are problematic in Islamic finance.",
  maisir: "Gambling. Categorically prohibited. Why lottery, casino bets, and many speculative derivatives are off-limits.",
  zakat: "An obligatory annual charity — the third pillar of Islam. Paid at 2.5% on net wealth above a minimum threshold (nisab). Mizan has a calculator at /zakat.",
  khums: "One-fifth (20%) annual religious obligation in Shia practice on net annual surplus wealth, including investment gains. Separate from zakat.",
  nisab: "The minimum wealth threshold above which zakat becomes obligatory. Historically defined in gold (87.48g) or silver (612.36g) market value.",
  purification: "Donating the impure portion of investment income (typically dividends) to charity, without expecting reward. Cleanses an otherwise-permissible holding.",
  sukuk: "Islamic financial certificate, often called the halal alternative to bonds. Represents ownership in an underlying asset, not interest-bearing debt.",
  takaful: "Islamic cooperative insurance. Participants pool contributions; claims paid from the pool. The halal alternative to conventional insurance.",
  fatwa: "A scholarly opinion on a question of Islamic law. Not binding but authoritative — Muslims may follow a particular scholar's fatawa.",
  scholar: "A qualified Islamic religious authority. Different scholars can reach different conclusions on contemporary financial questions.",
  madhab: "School of Islamic jurisprudence. Sunni: Hanafi, Maliki, Shafi'i, Hanbali. Shia: Ja'fari. Each can interpret contemporary finance differently.",

  // Scholar names
  aaoifi: "Accounting and Auditing Organization for Islamic Financial Institutions — the Bahrain-based standards body whose Shariah Standard No. 21 is the basis for most mainstream halal screening.",
  "mufti taqi usmani": "The most widely-cited contemporary Hanafi scholar. His published methodology adds an illiquid-asset floor (≥20%) and requires purifying capital gains as well as dividends.",
  "ayatollah sistani": "The most widely-followed contemporary Ja'fari Shia marja (religious authority). His office publishes rulings on contemporary financial questions.",
  djim: "Dow Jones Islamic Market index methodology — used by major Western index providers. Caps at 33% across debt, cash, and receivables.",

  // Financial fundamentals
  stock: "A share of ownership in a publicly-listed company. When you buy a stock, you own a tiny slice of the actual business.",
  share: "Another word for stock — one unit of ownership in a company.",
  equity: "Ownership in a company. Stocks are also called equities.",
  dividend: "A cash payment a company sometimes makes to its shareholders, typically once a quarter. Not all companies pay dividends.",
  "capital gain": "The profit (or loss) when you sell a stock for more (or less) than you paid for it.",
  "market cap": "Market capitalization — the total value of a company. Calculated as: share price × number of shares outstanding.",
  ipo: "Initial Public Offering. When a private company first sells shares to the public.",
  etf: "Exchange-Traded Fund. A basket of many stocks bundled together — buying one share of an ETF gives you exposure to all the underlying companies.",
  reit: "Real Estate Investment Trust. A company that owns and rents out commercial property, with shares you can buy on the stock market.",
  brokerage: "A company that lets you buy and sell stocks. Examples: Robinhood, Fidelity, Charles Schwab, E*TRADE.",
  "401(k)": "A US employer-sponsored retirement account where you contribute pre-tax money, often with an employer match. Funds inside need to be invested in something — usually mutual funds.",
  ira: "Individual Retirement Account. A US tax-advantaged personal retirement account, separate from your employer.",
  "impermissible income": "Money the company earns from sources Islam doesn't allow — mostly interest on cash, but sometimes incidental revenue from alcohol, gambling, etc. Halal investing caps this as a percentage of total revenue.",
  "interest-bearing debt": "Money the company has borrowed at interest. Riba is forbidden, so halal screens cap how much of this a company can have relative to its size.",
  "illiquid assets": "Real, physical things the company owns — factories, equipment, real estate, inventory. Opposite of cash and intangibles.",
  receivables: "Money owed to the company by customers on standard payment terms (typically 30-90 days).",
  "balance sheet": "A financial statement that lists everything a company owns (assets) and everything it owes (liabilities) at a point in time.",
};

export function lookup(term: string): string | undefined {
  return GLOSSARY[term.toLowerCase()];
}
