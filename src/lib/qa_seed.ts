// Auto-generated knowledge base for /ask page.
// Each entry has a question, keywords for fuzzy matching, and per-scholar answers.
// Edit data here; the /ask page consumes this file directly.

export interface QAEntry {
  q: string;
  k: string[];                  // keywords for matching
  a: Record<string, {           // scholar id → answer
    t: string;                  // answer text
    c: string[];                // citations
  }>;
}

export const QA_KNOWLEDGE_BASE: QAEntry[] = [
  {
    "q": "Is Bitcoin halal?",
    "k": [
      "bitcoin",
      "btc",
      "crypto",
      "cryptocurrency"
    ],
    "a": {
      "aaoifi": {
        "t": "AAOIFI has not issued a categorical ruling on Bitcoin. Many AAOIFI-aligned scholars consider Bitcoin permissible to hold and trade as it represents a form of digital property with a market price; gambling or yield-bearing uses remain impermissible. Confirm with a qualified scholar for material decisions.",
        "c": [
          "AAOIFI working group on virtual assets, 2024"
        ]
      },
      "taqi_usmani": {
        "t": "Mufti Taqi Usmani has expressed strong reservations about cryptocurrencies as a class, citing their speculative nature and the lack of intrinsic value. His published view leans toward impermissibility for trading. Some students of his school have moderated this view for holding (not trading) Bitcoin as digital property.",
        "c": [
          "Mufti Taqi Usmani, public statements 2018-2023"
        ]
      },
      "djim": {
        "t": "DJIM screens equities only — direct crypto holdings aren't within its scope. ETFs and trusts holding Bitcoin (like spot BTC ETFs) would be screened on the underlying instrument; Mizan currently treats Bitcoin spot ETFs as borderline pending board review.",
        "c": [
          "DJIM Methodology, scope note"
        ]
      },
      "jafari": {
        "t": "Most contemporary Ja'fari scholars permit holding Bitcoin as digital property, subject to it not being acquired through impermissible means and subject to khums on net annual surplus including realized gains.",
        "c": [
          "Ayatollah Sistani's office, contemporary Q&A archive"
        ]
      },
      "strict": {
        "t": "Under the zero-tolerance view, Bitcoin's volatile speculative trading character renders it problematic. Holding for use (not investment) may be acceptable; holding for speculative gain is generally not permitted.",
        "c": [
          "Strict-view scholars, general principle"
        ]
      }
    }
  },
  {
    "q": "Is staking ETH halal?",
    "k": [
      "staking",
      "eth",
      "ethereum",
      "yield"
    ],
    "a": {
      "aaoifi": {
        "t": "Proof-of-stake yield closely resembles riba (returns earned on capital deposited with a counterparty) and is therefore generally impermissible under AAOIFI-aligned reasoning.",
        "c": [
          "AAOIFI Shariah Standard No. 21 by analogy"
        ]
      },
      "taqi_usmani": {
        "t": "Mufti Taqi has argued that any yield-bearing crypto instrument promising a fixed or quasi-fixed return on deposited capital is riba and impermissible. ETH staking falls clearly within that category.",
        "c": [
          "Mufti Taqi Usmani, public statements on crypto"
        ]
      },
      "djim": {
        "t": "Staking yield isn't directly addressed. By analogy to interest-bearing deposits, most DJIM-aligned advisors treat staking returns as riba.",
        "c": []
      },
      "jafari": {
        "t": "Most contemporary Ja'fari scholars consider proof-of-stake returns analogous to riba and impermissible. A minority view distinguishes the validator service from pure lending but does not authorize the yield.",
        "c": [
          "Ayatollah Sistani's office, contemporary Q&A"
        ]
      },
      "strict": {
        "t": "Impermissible without exception.",
        "c": []
      }
    }
  },
  {
    "q": "Is buying NFTs halal?",
    "k": [
      "nft",
      "non-fungible",
      "art token",
      "digital art"
    ],
    "a": {
      "aaoifi": {
        "t": "Trading NFTs that represent real, identifiable assets or services (e.g., a verified digital artwork, a domain name, an event ticket) is generally permissible. NFTs whose primary use is speculative or as gambling instruments are impermissible. The underlying use matters more than the technology.",
        "c": []
      },
      "taqi_usmani": {
        "t": "Mufti Taqi has cautioned strongly against NFTs as a class given the speculative trading patterns. Purchase of NFTs for genuine utility (artwork ownership, access tokens) may be permissible if the underlying use is permissible.",
        "c": []
      },
      "jafari": {
        "t": "Permissible if the NFT represents a real asset, service, or right with genuine utility. Pure speculation is discouraged.",
        "c": []
      }
    }
  },
  {
    "q": "Are stablecoins halal?",
    "k": [
      "stablecoin",
      "usdc",
      "usdt",
      "tether"
    ],
    "a": {
      "aaoifi": {
        "t": "Holding stablecoins backed 1:1 by audited cash reserves (USDC, BUSD historically) is generally permissible — they function as a digital cash equivalent. Algorithmic stablecoins are more problematic because of the leverage mechanisms underlying them. Earning interest/yield on stablecoins through DeFi protocols is impermissible riba.",
        "c": []
      },
      "taqi_usmani": {
        "t": "Stablecoins backed by hard cash reserves can be held as cash equivalents. Earning yield on them is impermissible.",
        "c": []
      }
    }
  },
  {
    "q": "Is investing in gold halal?",
    "k": [
      "gold",
      "silver",
      "precious metal",
      "bullion"
    ],
    "a": {
      "aaoifi": {
        "t": "Physical gold ownership is highly recommended and permissible. The key rule (from a sound hadith): gold must be exchanged hand-to-hand for cash equivalent of full value — no deferred settlement, no interest. Physical bullion in your possession or in allocated (not unallocated) storage is permissible. Gold ETFs that hold allocated physical gold are generally accepted; some scholars are more cautious on unallocated/synthetic gold exposure.",
        "c": [
          "Sahih Muslim, hadith on gold/silver exchange"
        ]
      },
      "taqi_usmani": {
        "t": "Same as AAOIFI position. Mufti Taqi has additionally cautioned about paper gold (futures, unallocated certificates) as approaching gharar (excessive uncertainty).",
        "c": []
      },
      "jafari": {
        "t": "Gold and silver are foundational permissible stores of value. Khums applies on gold/silver holdings on the khums year.",
        "c": [
          "Ayatollah Sistani, khums rulings"
        ]
      }
    }
  },
  {
    "q": "Is a gold ETF halal?",
    "k": [
      "gold etf",
      "gld",
      "iau",
      "gold fund"
    ],
    "a": {
      "aaoifi": {
        "t": "Gold ETFs backed by allocated physical gold (where each share corresponds to a specific gold bar) are generally permissible. ETFs holding gold futures or synthetic exposure are debated; many scholars treat them as not permissible due to the absence of immediate hand-to-hand exchange that hadith literature requires.",
        "c": []
      }
    }
  },
  {
    "q": "Is investing in real estate halal?",
    "k": [
      "real estate",
      "property",
      "rental",
      "land"
    ],
    "a": {
      "aaoifi": {
        "t": "Direct real estate investment for rental income or capital appreciation is permissible and historically encouraged. The financing arrangement matters: if you use an interest-bearing mortgage to acquire the property, the financing itself is impermissible even though the underlying asset is fine. Use a halal home-finance product (diminishing musharaka, ijara) or self-fund.",
        "c": []
      }
    }
  },
  {
    "q": "Is a REIT halal?",
    "k": [
      "reit",
      "real estate investment trust",
      "spg",
      "o",
      "amt"
    ],
    "a": {
      "aaoifi": {
        "t": "REITs are screened similarly to stocks — both for the underlying business (residential, retail, industrial, office vs. e.g., casino-hotel REITs) and for the leverage. Many large REITs carry debt at or above 50% of assets, which under AAOIFI's 30% market-cap threshold is problematic.",
        "c": []
      },
      "taqi_usmani": {
        "t": "Same plus the illiquid floor: most REITs comfortably exceed 20% illiquid assets (real estate is inherently illiquid), so they pass that rule. Debt levels are the more common failure point.",
        "c": []
      }
    }
  },
  {
    "q": "Is SPRE (the halal REIT ETF) halal?",
    "k": [
      "spre",
      "sp funds reit",
      "halal reit etf"
    ],
    "a": {
      "aaoifi": {
        "t": "SPRE (SP Funds S&P Global REIT Sharia ETF) is explicitly designed to hold only AAOIFI-compliant REITs. Permissible to hold under AAOIFI-aligned methodologies.",
        "c": []
      }
    }
  },
  {
    "q": "Is sukuk halal?",
    "k": [
      "sukuk",
      "islamic bond",
      "fixed income"
    ],
    "a": {
      "aaoifi": {
        "t": "Properly-structured sukuk are halal and are designed as the Shariah-compliant alternative to interest-bearing bonds. They represent ownership in an underlying asset rather than a debt obligation. Sovereign sukuk (issued by Islamic governments) are widely accepted. Some corporate sukuk structures have been criticized when the underlying transaction is engineered to mimic conventional bonds — buyer should verify the structure.",
        "c": [
          "AAOIFI Sukuk standard"
        ]
      }
    }
  },
  {
    "q": "Are conventional bonds halal?",
    "k": [
      "bond",
      "treasury",
      "corporate bond",
      "fixed income"
    ],
    "a": {
      "aaoifi": {
        "t": "Conventional bonds — including US Treasuries, corporate bonds, and bond funds — are impermissible. They are explicit interest-bearing debt instruments, which fall under the prohibition of riba. Use sukuk (e.g., SPSK ETF) for halal fixed-income exposure.",
        "c": []
      }
    }
  },
  {
    "q": "Is SPSK (the sukuk ETF) halal?",
    "k": [
      "spsk",
      "sukuk etf",
      "sp funds sukuk"
    ],
    "a": {
      "aaoifi": {
        "t": "SPSK (SP Funds Dow Jones Global Sukuk ETF) holds AAOIFI-compliant sovereign and corporate sukuk. Permissible. Reasonable halal alternative to conventional bond funds.",
        "c": []
      }
    }
  },
  {
    "q": "Is my 401(k) halal?",
    "k": [
      "401k",
      "retirement",
      "ira",
      "roth"
    ],
    "a": {
      "aaoifi": {
        "t": "The 401(k) account itself is a tax-deferred wrapper and not inherently haram. What's haram is what your contributions are invested in. Most default target-date funds hold conventional banks, alcohol, defense, and a large bond allocation — all problematic. If your plan has a brokerage window, use it to invest in halal ETFs (SPUS, HLAL, SPSK, SPRE). If not, take the employer match and use IRA/Roth IRA for direct halal allocation. See our full guide at /blog.",
        "c": []
      }
    }
  },
  {
    "q": "Can I take a 401(k) loan?",
    "k": [
      "401k loan",
      "retirement loan",
      "borrow from 401k"
    ],
    "a": {
      "aaoifi": {
        "t": "401(k) loans are debated. The IRS requires you to pay interest on the loan, but that interest goes back into your own account — you're effectively paying yourself. Many scholars consider this acceptable because there is no third-party riba. Others recommend avoiding even this on the principle of strict abstention. Your scholar's view applies.",
        "c": []
      }
    }
  },
  {
    "q": "Should I roll over my 401(k) to a halal IRA?",
    "k": [
      "rollover",
      "ira rollover",
      "halal ira"
    ],
    "a": {
      "aaoifi": {
        "t": "If you've left an employer and your old 401(k) holds non-halal investments, rolling over to a self-directed IRA you control (e.g., at Fidelity, Schwab, or a halal-specialized custodian like Saturna) lets you invest the entire balance in halal-screened equities or sukuk. This is generally recommended.",
        "c": []
      }
    }
  },
  {
    "q": "Is a conventional mortgage halal?",
    "k": [
      "mortgage",
      "home loan",
      "house loan"
    ],
    "a": {
      "aaoifi": {
        "t": "Conventional mortgages are explicit interest-bearing debt — directly impermissible under the prohibition of riba. The fact that interest is paid to a bank (not earned) doesn't change the impermissibility. Halal alternatives exist: diminishing musharaka (Guidance Residential, UIF Corporation in the US), ijara (lease-to-own), and full cash purchase.",
        "c": []
      },
      "taqi_usmani": {
        "t": "Mufti Taqi Usmani has issued specific fatawa cautioning against conventional mortgages even in Western markets where 'necessity' has been argued. He has approved diminishing musharaka structures (Guidance Residential being a flagship US example).",
        "c": [
          "Mufti Taqi Usmani, fatawa on housing finance"
        ]
      }
    }
  },
  {
    "q": "What's diminishing musharaka?",
    "k": [
      "musharaka",
      "diminishing musharaka",
      "guidance residential",
      "halal mortgage"
    ],
    "a": {
      "aaoifi": {
        "t": "Diminishing musharaka is a partnership structure where you and the financier jointly purchase a property; you pay rent on the financier's portion while gradually buying out their stake over time. As your ownership grows, your rent decreases. By the end, you own 100% and have paid no interest. The standard halal home-finance structure in the US and UK.",
        "c": []
      }
    }
  },
  {
    "q": "Are stock options halal?",
    "k": [
      "options",
      "call option",
      "put option",
      "derivatives"
    ],
    "a": {
      "aaoifi": {
        "t": "Conventional options trading is generally impermissible. They involve gharar (excessive uncertainty) and a structure that combines speculation with delayed settlement of mutual obligations. Employee stock options (received as compensation) are a separate question; many scholars permit exercising them since you're acquiring real shares.",
        "c": []
      },
      "taqi_usmani": {
        "t": "Mufti Taqi has been categorical: conventional options trading is impermissible. Employee stock options for exercise (not speculation) are different and acceptable.",
        "c": []
      }
    }
  },
  {
    "q": "Are stock futures halal?",
    "k": [
      "futures",
      "stock futures",
      "commodity futures"
    ],
    "a": {
      "aaoifi": {
        "t": "Conventional futures contracts are generally impermissible. They violate the requirement of immediate or at-least specified exchange of value for value, and they're typically settled in cash without underlying delivery.",
        "c": []
      }
    }
  },
  {
    "q": "Can I short stocks?",
    "k": [
      "short selling",
      "short sell",
      "short stocks"
    ],
    "a": {
      "aaoifi": {
        "t": "Conventional short selling (borrowing shares, selling them, buying them back later) is impermissible. It involves selling something you don't own, plus the share-lending mechanism typically involves interest. Many scholars consider it haram on multiple counts.",
        "c": []
      }
    }
  },
  {
    "q": "What about margin trading?",
    "k": [
      "margin",
      "margin loan",
      "leveraged trading"
    ],
    "a": {
      "aaoifi": {
        "t": "Margin trading uses an interest-bearing loan from your broker to buy more shares. The loan itself is riba and impermissible. Even if the underlying shares are halal, the financing structure makes the transaction impermissible.",
        "c": []
      }
    }
  },
  {
    "q": "Do I pay zakat on my stocks?",
    "k": [
      "zakat",
      "stocks zakat",
      "investment zakat"
    ],
    "a": {
      "aaoifi": {
        "t": "Yes. The classical view: zakat is due annually on the market value of shares held for trading (2.5% of value), and on the net liquid assets of long-term holdings (a calculation we'll add to Mizan). The Custom approach favored by many contemporary scholars: 2.5% on the market value of all your stock holdings on your zakat anniversary date, regardless of intent. Mizan's zakat calculator is on the roadmap.",
        "c": []
      },
      "jafari": {
        "t": "Ja'fari practice uses khums (one-fifth, 20%) instead of zakat on certain wealth categories. Net annual surplus including realized gains is subject to khums on the khums anniversary date.",
        "c": []
      }
    }
  },
  {
    "q": "How do I calculate zakat on my portfolio?",
    "k": [
      "calculate zakat",
      "zakat calculator",
      "zakat amount"
    ],
    "a": {
      "aaoifi": {
        "t": "Pick your zakat anniversary date (the lunar date one year after you first reached nisab). On that date: sum the market value of all your stock holdings + cash + business inventory + gold/silver + crypto + other zakatable assets. Subtract any short-term debts owed by you. Multiply by 2.5%. That's your zakat. We'll add an automated calculator to Mizan in 2027.",
        "c": []
      }
    }
  },
  {
    "q": "How do I purify dividends?",
    "k": [
      "purify dividends",
      "dividend purification",
      "haram income"
    ],
    "a": {
      "aaoifi": {
        "t": "For each stock you own that pays dividends, calculate: (impermissible income % of the company's revenue) × (your dividend received) = amount to donate to charity, without expecting reward. Mizan calculates this automatically in /purification.",
        "c": []
      },
      "taqi_usmani": {
        "t": "Same as AAOIFI on dividends. Additionally, purify the same percentage of realized capital gains. Most halal apps miss this; Mizan implements it.",
        "c": [
          "Mufti Taqi Usmani, equity screening guidance"
        ]
      }
    }
  },
  {
    "q": "Do I need to purify capital gains?",
    "k": [
      "capital gains purification",
      "purify gains"
    ],
    "a": {
      "aaoifi": {
        "t": "Under AAOIFI and most mainstream halal methodologies: no, dividends only. The capital gain itself reflects market appreciation, not direct receipt of impermissible income.",
        "c": []
      },
      "taqi_usmani": {
        "t": "Yes. Mufti Taqi Usmani's published view requires purifying both dividends AND capital gains at the impermissible-income rate. This is a meaningful difference; we implement it in Mizan.",
        "c": []
      },
      "jafari": {
        "t": "Under Ja'fari practice, capital gains are subject to khums (20% of net annual surplus) rather than the percentage-purification approach used by Sunni scholars. Different mechanism, similar effect of cleansing.",
        "c": []
      }
    }
  },
  {
    "q": "Where should I donate purified money?",
    "k": [
      "charity for purification",
      "donate purification",
      "where to donate"
    ],
    "a": {
      "aaoifi": {
        "t": "Purification funds should go to charity WITHOUT expectation of reward (this is the technical Shariah requirement — purification is cleansing, not voluntary sadaqah). Suitable channels: humanitarian aid (where direct support is clearly not investing back into impermissible activities), educational scholarships, infrastructure projects. Mizan partners with LaunchGood, Islamic Relief, and Penny Appeal for the integrated donation flow.",
        "c": []
      }
    }
  },
  {
    "q": "Is Tesla (TSLA) halal?",
    "k": [
      "tesla",
      "tsla"
    ],
    "a": {
      "aaoifi": {
        "t": "Yes. Tesla passes all three AAOIFI ratios. Verdict: HALAL.",
        "c": []
      },
      "taqi_usmani": {
        "t": "Yes. Tesla is hardware-heavy with ~50% illiquid assets — well above the 20% floor. Verdict: HALAL.",
        "c": []
      },
      "djim": {
        "t": "Yes. All thresholds met. Verdict: HALAL.",
        "c": []
      },
      "strict": {
        "t": "Fail. Tesla carries some interest-bearing debt.",
        "c": []
      }
    }
  },
  {
    "q": "Is Amazon (AMZN) halal?",
    "k": [
      "amazon",
      "amzn"
    ],
    "a": {
      "aaoifi": {
        "t": "Yes. Verdict: HALAL.",
        "c": []
      },
      "taqi_usmani": {
        "t": "No. Amazon's illiquid assets (~12% of total) fall below Mufti Taqi's 20% floor. Verdict: NOT HALAL under his rulings.",
        "c": []
      },
      "djim": {
        "t": "Yes. Verdict: HALAL.",
        "c": []
      },
      "jafari": {
        "t": "Yes. All thresholds met. Khums applies on gains. Verdict: HALAL.",
        "c": []
      },
      "strict": {
        "t": "Fail. Carries debt.",
        "c": []
      }
    }
  },
  {
    "q": "Is Apple (AAPL) halal?",
    "k": [
      "apple",
      "aapl"
    ],
    "a": {
      "aaoifi": {
        "t": "Yes. Apple's ratios are all comfortably below thresholds. Verdict: HALAL.",
        "c": []
      },
      "taqi_usmani": {
        "t": "Yes. Apple's illiquid assets are ~28% — above the 20% floor. Verdict: HALAL.",
        "c": []
      },
      "strict": {
        "t": "Fail. Apple has some debt and significant cash holdings.",
        "c": []
      }
    }
  },
  {
    "q": "Is Microsoft (MSFT) halal?",
    "k": [
      "microsoft",
      "msft"
    ],
    "a": {
      "aaoifi": {
        "t": "Yes. Verdict: HALAL.",
        "c": []
      },
      "taqi_usmani": {
        "t": "Yes. Microsoft's illiquid assets (~36%) clear the 20% floor. Verdict: HALAL.",
        "c": []
      }
    }
  },
  {
    "q": "Is JPMorgan (JPM) halal?",
    "k": [
      "jpmorgan",
      "jpm",
      "jp morgan"
    ],
    "a": {
      "aaoifi": {
        "t": "No. JPMorgan is a conventional bank — its core business is interest-based lending. Sector exclusion. Verdict: NOT HALAL across all standards.",
        "c": []
      }
    }
  },
  {
    "q": "Is Saudi Aramco halal?",
    "k": [
      "aramco",
      "saudi aramco",
      "2222"
    ],
    "a": {
      "aaoifi": {
        "t": "Yes. Energy sector, ratios within thresholds. Saudi Aramco is widely held in halal-screened portfolios. Verdict: HALAL.",
        "c": []
      }
    }
  },
  {
    "q": "What halal ETFs should I buy?",
    "k": [
      "halal etf",
      "best halal etf",
      "shariah etf"
    ],
    "a": {
      "aaoifi": {
        "t": "The major ones: SPUS (S&P 500 Sharia exclusions), HLAL (Wahed FTSE USA Shariah), UMMA (Wahed Dow Jones Islamic World), SPRE (Global REIT Sharia), SPSK (Global Sukuk). For a balanced halal portfolio: 60-70% SPUS or HLAL, 10-15% SPRE, 15-25% SPSK depending on age and risk tolerance. None of these is investment advice — consult an advisor.",
        "c": []
      }
    }
  },
  {
    "q": "Can I buy SPY (S&P 500 ETF)?",
    "k": [
      "spy",
      "s&p 500 etf",
      "broad market etf"
    ],
    "a": {
      "aaoifi": {
        "t": "Generally no. SPY is the standard S&P 500 ETF — it includes JPMorgan, Bank of America, Wells Fargo, alcohol companies, defense contractors, gambling companies. These are sector-excluded. Use SPUS instead (S&P 500 Sharia exclusions) for similar broad-US exposure without the impermissible holdings.",
        "c": []
      }
    }
  },
  {
    "q": "Should I dollar-cost average into halal stocks?",
    "k": [
      "dca",
      "dollar cost average",
      "regular investing"
    ],
    "a": {
      "aaoifi": {
        "t": "Dollar-cost averaging into halal investments is a sound strategy widely endorsed by halal-finance practitioners — it removes emotional timing pressure and aligns well with the long-term ownership mindset Islamic finance encourages. The mechanics (regular contributions, no timing speculation) are entirely permissible.",
        "c": []
      }
    }
  },
  {
    "q": "How do I rebalance a halal portfolio?",
    "k": [
      "rebalance",
      "portfolio rebalancing"
    ],
    "a": {
      "aaoifi": {
        "t": "Standard rebalancing (selling appreciated positions, buying underweight ones to return to target allocation) is permissible. The act of selling and buying isn't itself problematic. Two considerations: (1) realized gains may need purification depending on your scholar; (2) frequent rebalancing for tax-loss harvesting is permissible mechanically but should not become speculative trading.",
        "c": []
      }
    }
  },
  {
    "q": "Is conventional insurance halal?",
    "k": [
      "insurance",
      "life insurance",
      "auto insurance"
    ],
    "a": {
      "aaoifi": {
        "t": "Conventional insurance is generally considered impermissible due to gharar (excessive uncertainty), maisir (gambling-like risk transfer), and the underlying insurance investments earning interest. Use takaful — Islamic cooperative insurance — where available. In jurisdictions where no takaful provider exists and insurance is legally required (e.g., auto insurance), most scholars permit conventional insurance under necessity.",
        "c": []
      }
    }
  },
  {
    "q": "What's takaful?",
    "k": [
      "takaful",
      "islamic insurance"
    ],
    "a": {
      "aaoifi": {
        "t": "Takaful is Islamic cooperative insurance based on mutual contribution and shared risk rather than risk transfer for premium. Participants pool contributions; claims are paid from the pool. Surplus goes back to participants. Available in many Muslim-majority countries and increasingly in the UK. US availability is limited.",
        "c": []
      }
    }
  },
  {
    "q": "How do I cancel my Mizan subscription?",
    "k": [
      "cancel",
      "cancel subscription",
      "unsubscribe mizan"
    ],
    "a": {
      "aaoifi": {
        "t": "From your account page on mizaninvesting.com, click Billing → Cancel subscription. Cancellation takes effect at the end of your current billing period. You'll retain Pro features until then.",
        "c": []
      }
    }
  },
  {
    "q": "How much does Mizan cost?",
    "k": [
      "price",
      "pricing",
      "cost",
      "subscription"
    ],
    "a": {
      "aaoifi": {
        "t": "Free tier: 5 screens per day, AAOIFI default. Plus: $7.99/month, unlimited screens and all six scholar profiles. Pro: $14.99/month, adds portfolio sync and purification automation. Family (4 seats): $19.99/month. Masjid plans (min 10 seats): $4.99/seat/month. Annual plans save ~38%.",
        "c": []
      }
    }
  },
  {
    "q": "Who runs Mizan?",
    "k": [
      "who runs",
      "team",
      "founders",
      "mizan team"
    ],
    "a": {
      "aaoifi": {
        "t": "Mizan is a Hong Kong-based fintech, founded solo in 2026 by Gordon Louie — a non-Muslim technologist. A Shariah Supervisory Board is not yet engaged; credibility currently comes from the primary-source citations on /methodology (AAOIFI Standard No. 21, Mufti Taqi Usmani's published works, the DJIM methodology PDF, the Sistani office). The honest scoreboard of what is and isn't in place lives at /trust.",
        "c": []
      }
    }
  },
  {
    "q": "Is Mizan giving me investment advice?",
    "k": [
      "investment advice",
      "advice",
      "is this advice"
    ],
    "a": {
      "aaoifi": {
        "t": "No. Mizan is an informational research tool. We tell you what scholarly opinions exist about a stock's compliance under various methodologies; we do not tell you what to buy or sell. We are not licensed as an investment advisor and do not provide individualized advice. For decisions with material financial consequences, consult a licensed financial advisor.",
        "c": []
      }
    }
  },
  {
    "q": "Is investing in the stock market halal at all?",
    "k": [
      "stock market halal",
      "is investing halal",
      "stock investing"
    ],
    "a": {
      "aaoifi": {
        "t": "Yes — investing in the equity of permissible businesses is widely accepted as halal across major scholarly traditions. You become a part-owner of a real economic enterprise, sharing in its risks and rewards. The screening is to ensure the business itself is permissible and that the company's financial structure doesn't make ownership equivalent to participating in riba.",
        "c": [
          "AAOIFI Standard No. 21"
        ]
      }
    }
  },
  {
    "q": "Can I invest in IPOs?",
    "k": [
      "ipo",
      "initial public offering"
    ],
    "a": {
      "aaoifi": {
        "t": "Yes, provided the underlying company passes Shariah screening. Use the same sector + financial-ratio analysis you'd apply to any stock. Many IPOs offer little public financial data before the offering — exercise caution and consult published prospectus for the relevant figures.",
        "c": []
      }
    }
  },
  {
    "q": "Are dividends halal?",
    "k": [
      "dividends halal",
      "are dividends halal"
    ],
    "a": {
      "aaoifi": {
        "t": "Yes, dividends from Shariah-compliant companies are halal. Note: even for compliant companies, you need to purify the small impermissible-income portion (typically 1-5%) of dividends received. Mizan calculates this automatically.",
        "c": []
      }
    }
  },
  {
    "q": "What's the difference between AAOIFI and DJIM?",
    "k": [
      "aaoifi vs djim",
      "aaoifi djim difference"
    ],
    "a": {
      "aaoifi": {
        "t": "AAOIFI Shariah Standard No. 21 uses 30% caps on debt and cash/securities, with no receivables ratio. Dow Jones Islamic Market uses 33% across debt, cash/securities, AND receivables. AAOIFI is stricter on debt/cash; DJIM adds receivables to the screen. Both use 5% for impermissible income. See /methodology for the full table.",
        "c": []
      }
    }
  },
  {
    "q": "What's the illiquid asset rule?",
    "k": [
      "illiquid asset",
      "20% rule",
      "illiquid floor",
      "mufti taqi rule"
    ],
    "a": {
      "taqi_usmani": {
        "t": "Mufti Taqi Usmani's published methodology requires that a stock's company have at least 20% of total assets as illiquid (tangible) assets — property, equipment, inventory. The reasoning: a company that's mostly cash + intangibles is, in commercial substance, trading paper for paper, which approaches the impermissible category. No major halal app outside Mizan implements this rule explicitly. We do.",
        "c": [
          "Mufti Taqi Usmani, An Introduction to Islamic Finance"
        ]
      }
    }
  },
  {
    "q": "What's khums?",
    "k": [
      "khums",
      "fifth",
      "ja'fari tax",
      "shia khums"
    ],
    "a": {
      "jafari": {
        "t": "Khums is one of the foundational obligations in Ja'fari Shia practice — payment of one-fifth (20%) of net annual surplus wealth on your khums anniversary date. It applies to income beyond necessary expenses, including investment gains. Half goes to the Imam's portion (today distributed through marja accounts) and half to sayyids (descendants of the Prophet, peace be upon him). Distinct from purification (which is per-stock impermissible income) and from zakat.",
        "c": [
          "Ayatollah Sistani, khums rulings"
        ]
      }
    }
  },
  {
    "q": "What is the difference between strict and AAOIFI?",
    "k": [
      "strict vs aaoifi",
      "zero tolerance",
      "strict view"
    ],
    "a": {
      "strict": {
        "t": "AAOIFI permits up to 5% impermissible income, 30% interest-bearing debt, 30% interest-bearing assets — the strict zero-tolerance view holds that any of these above 0% is impermissible. The strict view excludes essentially every public equity except some Islamic banks and a handful of pure businesses. Most users of the strict view invest only in physical gold, real estate, sukuk, or private musharaka arrangements.",
        "c": []
      }
    }
  }
];
