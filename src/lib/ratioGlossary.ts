export const RATIO_DEFINITIONS: Record<string, string> = {
  "Impermissible income / revenue":
    "The share of the company's total revenue that comes from impermissible sources — primarily interest income, but also incidental revenue from sectors like alcohol or gambling that the company isn't primarily in. Most scholars cap this at 5%.",
  "Interest-bearing debt / market cap":
    "How much money the company has borrowed at interest, relative to its market value. Riba (interest) is prohibited; this ratio measures how much exposure the company has. AAOIFI caps at 30%; DJIM caps at 33%.",
  "Cash + interest-bearing securities / market cap":
    "How much of the company's value sits in cash or interest-earning securities. Above a certain threshold, buying the stock becomes like buying into an interest-earning entity. Standards cap at 30-33%.",
  "Accounts receivable / market cap":
    "Money owed to the company by customers on standard payment terms. Receivables are debts owed to the company; under classical Islamic finance, debt cannot trade at premium or discount. DJIM caps at 33%.",
  "Illiquid (tangible) assets / total assets":
    "How much of the company's balance sheet is real, physical assets — factories, equipment, inventory, real estate — vs. cash + intangibles. Mufti Taqi Usmani requires this be at least 20%. No other major standard screens this.",
};

export const SCHOLAR_DEFINITIONS: Record<string, string> = {
  aaoifi: "Accounting and Auditing Organization for Islamic Financial Institutions — the Bahrain-based body whose Shariah Standard No. 21 is the basis for most mainstream halal stock screening.",
  taqi_usmani: "Mufti Muhammad Taqi Usmani — the most widely-cited contemporary Hanafi scholar. His published methodology adds an illiquid-asset floor (≥20%) and requires purifying both dividends and capital gains.",
  djim: "Dow Jones Islamic Market index methodology — used by major Western index providers. Caps at 33% across debt, cash, and receivables.",
  jafari: "Shia Ja'fari methodology, aligned with Ayatollah Sistani's published rulings. Adds the obligation of khums (20% on net annual surplus) to capital-gain treatment.",
  strict: "Zero-tolerance interpretation: any riba exposure (debt, interest income, cash + securities) above 0% renders a stock impermissible. Held by a minority of scholars.",
  custom: "User-defined thresholds. Use the Custom profile builder to set your own caps and floors per ratio.",
};
