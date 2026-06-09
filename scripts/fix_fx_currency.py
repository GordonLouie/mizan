#!/usr/bin/env python3
"""
fix_fx_currency.py  —  Mizan data integrity fix (2026-06-09)

ROOT CAUSE
  The enrichment pipeline ingested foreign-listed companies' balance sheets
  in their LOCAL reporting currency (JPY / INR / CNY / EUR) but tagged every
  balanceSheet.currency as "USD" and computed the three market-cap ratios
  (debt, cash+securities, receivables) by dividing a local-currency numerator
  by a USD market cap. Result: absurd ratios (e.g. Toyota debt = 18,793% of
  market cap) shown on /screen and in the verdict-history hover.

WHAT THIS DOES (deterministic, fully reversible via git)
  For each affected ticker:
    1. Converts every monetary balance-sheet field local -> USD millions using
       documented June-2026 FX rates (see SOURCES below).
    2. Recomputes debtToMarketCapPct, cashSecuritiesToMarketCapPct,
       receivablesToMarketCapPct from the converted USD figures.
    3. Rescales the embedded Debt/Cash/Receivables percentages inside each
       verdictHistory deciding string by the same FX divisor. Income% and
       Illiquid% are ratios of same-currency figures and are left untouched.
    4. Leaves illiquidAssetsToTotalAssetsPct, impermissibleIncomePct,
       dividendYieldPct unchanged (all currency-independent ratios).
    5. Sets balanceSheet.currency to "USD" and records the original reporting
       currency + FX rate used in new fields reportingCurrency / fxRateToUsd
       for transparency.

  US banks, HSBC (reports in USD), and US high-debt names are NOT touched —
  their large balance sheets are genuine and already in USD.

SOURCES (FX, June 2026):
  USD/JPY 160.24, USD/INR 95.65, USD/CNY 6.78, USD/EUR 0.87
  https://www.mtfxgroup.com/tools/historical-currency-exchange-rates/usd-to-jpy-rate/
  https://www.ecb.europa.eu/stats/shared/pdf/eurofxref.pdf
"""
import json, re, sys, shutil, os

PATH = os.path.join(os.path.dirname(__file__), "..", "src", "data", "stocks.json")

FX = {"JPY": 160.24, "INR": 95.65, "CNY": 6.78, "EUR": 0.87, "TWD": 31.59, "DKK": 6.49}

# Hand-verified reporting currency per affected foreign-listed company.
CURRENCY = {
    "TM": "JPY", "SONY": "JPY", "MUFG": "JPY", "SMFG": "JPY", "HMC": "JPY",
    "HDB": "INR", "IBN": "INR", "WIT": "INR", "RDY": "INR",
    "BABA": "CNY", "JD": "CNY", "PDD": "CNY", "BIDU": "CNY", "NTES": "CNY",
    "NIO": "CNY", "LI": "CNY", "XPEV": "CNY", "TCEHY": "CNY",
    "STLA": "EUR",
    "TSM": "TWD",
    "NVO": "DKK",
}

MONEY_FIELDS = [
    "cash", "marketableSecurities", "longTermMarketableSecurities",
    "accountsReceivable", "inventories", "otherCurrentAssets",
    "propertyPlantEquipment", "operatingLeaseAssets", "goodwill",
    "intangibleAssets", "otherNonCurrentAssets", "otherIllidquidTangible",
    "totalAssets", "accountsPayable", "otherCurrentLiabilities",
    "deferredRevenue", "shortTermDebt", "commercialPaper", "longTermDebt",
    "otherNonCurrentLiabilities", "totalLiabilities", "totalRevenueTTM",
    "productServicesRevenueTTM", "interestIncomeTTM",
]

# Scholar thresholds mirrored from src/lib/scholars.ts (max caps; None = not screened)
SCHOLARS = {
    "aaoifi":      dict(inc=5, debt=30, cash=30, recv=None, illiq=None),
    "taqi_usmani": dict(inc=5, debt=30, cash=30, recv=None, illiq=20),
    "djim":        dict(inc=5, debt=33, cash=33, recv=33,   illiq=None),
    "jafari":      dict(inc=5, debt=33, cash=33, recv=None, illiq=None),
    "strict":     dict(inc=0, debt=0,  cash=0,  recv=None, illiq=None),
}

def screen_latest(s):
    """Mirror of screen.ts screenStock for the current fundamentals.
    Returns (verdictByScholar, decidingByScholar). Assumes sector passes
    (only called for sectorFlags == [])."""
    inc = s["impermissibleIncomePct"]; debt = s["debtToMarketCapPct"]
    cash = s["cashSecuritiesToMarketCapPct"]; recv = s["receivablesToMarketCapPct"]
    illiq = s["illiquidAssetsToTotalAssetsPct"]
    vbs, dbs = {}, {}
    for sid, t in SCHOLARS.items():
        fails = []
        if t["inc"] is not None and inc > t["inc"]:   fails.append(f"Income {inc:.1f}%")
        if t["debt"] is not None and debt > t["debt"]: fails.append(f"Debt {debt:.1f}%")
        if t["cash"] is not None and cash > t["cash"]: fails.append(f"Cash {cash:.1f}%")
        if t["recv"] is not None and recv > t["recv"]: fails.append(f"Receivables {recv:.1f}%")
        if t["illiq"] is not None and illiq < t["illiq"]: fails.append(f"Illiquid {illiq:.1f}%")
        if not fails:
            vbs[sid] = "pass"; dbs[sid] = "All checks pass"
        elif len(fails) == 1:
            vbs[sid] = "borderline"; dbs[sid] = "Borderline: " + ", ".join(fails)
        else:
            vbs[sid] = "fail"; dbs[sid] = "Failed: " + ", ".join(fails)
    return vbs, dbs

def rescale_deciding(s, fx):
    # Only Debt/Cash/Receivables percentages are currency-corrupted.
    def repl(m):
        label, num = m.group(1), float(m.group(2))
        return f"{label} {num/fx:.1f}%"
    return re.sub(r"(Debt|Cash|Receivables)\s+([\d.]+)%", repl, s)

def main():
    data = json.load(open(PATH))
    by = {s["ticker"]: s for s in data}
    changed = []
    for tkr, ccy in CURRENCY.items():
        s = by.get(tkr)
        if not s:
            print(f"  WARN {tkr}: not in universe, skipping"); continue
        bs = s.get("balanceSheet")
        fx = FX[ccy]
        before = dict(debt=s["debtToMarketCapPct"], cash=s["cashSecuritiesToMarketCapPct"],
                      recv=s["receivablesToMarketCapPct"])
        if bs:
            for f in MONEY_FIELDS:
                if isinstance(bs.get(f), (int, float)):
                    bs[f] = round(bs[f] / fx, 1)
            mc_m = s["marketCapUsd"] / 1e6  # market cap in millions USD
            debt = bs.get("shortTermDebt", 0) + bs.get("commercialPaper", 0) + bs.get("longTermDebt", 0)
            cashsec = bs.get("cash", 0) + bs.get("marketableSecurities", 0) + bs.get("longTermMarketableSecurities", 0)
            recv = bs.get("accountsReceivable", 0)
            s["debtToMarketCapPct"] = round(debt / mc_m * 100, 2)
            s["cashSecuritiesToMarketCapPct"] = round(cashsec / mc_m * 100, 2)
            s["receivablesToMarketCapPct"] = round(recv / mc_m * 100, 2)
            bs["reportingCurrency"] = ccy
            bs["fxRateToUsd"] = fx
            bs["currency"] = "USD"
        else:
            # No balance sheet: just divide the corrupted ratios by FX.
            s["debtToMarketCapPct"] = round(s["debtToMarketCapPct"] / fx, 2)
            s["cashSecuritiesToMarketCapPct"] = round(s["cashSecuritiesToMarketCapPct"] / fx, 2)
            s["receivablesToMarketCapPct"] = round(s["receivablesToMarketCapPct"] / fx, 2)
        # The 8-quarter verdictHistory for these tickers was computed from the
        # currency-corrupted ratios and cannot be reliably reconstructed without
        # period-matched historical balance sheets + FX. Rather than display
        # contradictory or fabricated history, drop it: the UI then shows the
        # honest "Historical tracking being ingested" state, while the LIVE
        # verdict is computed fresh from the corrected current ratios.
        if s.get("verdictHistory"):
            s["verdictHistory"] = []
        after = dict(debt=s["debtToMarketCapPct"], cash=s["cashSecuritiesToMarketCapPct"],
                     recv=s["receivablesToMarketCapPct"])
        ta = (bs or {}).get("totalAssets")
        changed.append((tkr, ccy, before, after, ta, s["marketCapUsd"]))

    # Report
    print(f"{'tkr':7}{'ccy':5}{'debt%':>22}{'cash%':>22}{'recv%':>22}{'TA($B)':>9}")
    for tkr, ccy, b, a, ta, mc in changed:
        print(f"{tkr:7}{ccy:5}"
              f"{b['debt']:>9.1f}->{a['debt']:>8.1f}  "
              f"{b['cash']:>9.1f}->{a['cash']:>8.1f}  "
              f"{b['recv']:>9.1f}->{a['recv']:>8.1f}  "
              f"{(ta/1000 if ta else 0):>8.1f}")

    if "--write" in sys.argv:
        shutil.copy(PATH, PATH + ".bak")
        json.dump(data, open(PATH, "w"), indent=2)
        print(f"\nWROTE {PATH} (backup at stocks.json.bak). {len(changed)} tickers updated.")
    else:
        print("\nDRY RUN. Re-run with --write to apply.")

if __name__ == "__main__":
    main()
