"use client";

import { useState } from "react";

interface Props {
  ticker: string;
  name: string;
  size?: number;
}

// Approximate company domain mapping. Production version queries an API or
// uses a maintained mapping file. This covers the top tickers in our dataset.
const TICKER_TO_DOMAIN: Record<string, string> = {
  AAPL: "apple.com", MSFT: "microsoft.com", GOOGL: "google.com", AMZN: "amazon.com",
  META: "meta.com", NVDA: "nvidia.com", NFLX: "netflix.com", TSLA: "tesla.com",
  ORCL: "oracle.com", UBER: "uber.com", WMT: "walmart.com", COST: "costco.com",
  PG: "pg.com", JNJ: "jnj.com", PFE: "pfizer.com", KO: "coca-cola.com",
  XOM: "exxonmobil.com", TSM: "tsmc.com", ASML: "asml.com", JPM: "jpmorganchase.com",
  BAC: "bankofamerica.com", GS: "goldmansachs.com", MO: "altria.com",
  WYNN: "wynnresorts.com", BUD: "ab-inbev.com", LMT: "lockheedmartin.com",
  AMD: "amd.com", INTC: "intel.com", V: "visa.com", MA: "mastercard.com",
  DIS: "disney.com", NKE: "nike.com", CRM: "salesforce.com", ADBE: "adobe.com",
  BABA: "alibaba.com", BRK: "berkshirehathaway.com", "BRK.B": "berkshirehathaway.com",
  CSCO: "cisco.com", BA: "boeing.com", PEP: "pepsico.com", AVGO: "broadcom.com",
  NOW: "servicenow.com", ACN: "accenture.com", TXN: "ti.com", QCOM: "qualcomm.com",
  IBM: "ibm.com", AMAT: "appliedmaterials.com", LRCX: "lamresearch.com",
  KLAC: "kla.com", MU: "micron.com", UNH: "unitedhealthgroup.com", LLY: "lilly.com",
  ABBV: "abbvie.com", MRK: "merck.com", TMO: "thermofisher.com", ABT: "abbott.com",
  DHR: "danaher.com", AMGN: "amgen.com", BMY: "bms.com", CVS: "cvshealth.com",
  WFC: "wellsfargo.com", MS: "morganstanley.com", C: "citigroup.com",
  SCHW: "schwab.com", BLK: "blackrock.com", AXP: "americanexpress.com",
  PYPL: "paypal.com", HD: "homedepot.com", MCD: "mcdonalds.com", LOW: "lowes.com",
  BKNG: "booking.com", SBUX: "starbucks.com", TJX: "tjx.com", MAR: "marriott.com",
  CL: "colgatepalmolive.com", MDLZ: "mondelezinternational.com",
  PM: "pmi.com", EL: "elcompanies.com", KMB: "kimberly-clark.com",
  CVX: "chevron.com", COP: "conocophillips.com", SLB: "slb.com", EOG: "eogresources.com",
  PSX: "phillips66.com", HON: "honeywell.com", UPS: "ups.com", CAT: "caterpillar.com",
  GE: "ge.com", RTX: "rtx.com", DE: "deere.com", UNP: "up.com", NOC: "northropgrumman.com",
  NEE: "nexteraenergy.com", DUK: "duke-energy.com", SO: "southerncompany.com",
  PLD: "prologis.com", AMT: "americantower.com", EQIX: "equinix.com",
  SPG: "simon.com", O: "realtyincome.com",
  CMCSA: "comcast.com", T: "att.com", VZ: "verizon.com", CHTR: "charter.com",
  WBD: "wbd.com", LIN: "linde.com", APD: "airproducts.com", NEM: "newmont.com",
  SHW: "sherwin-williams.com", PANW: "paloaltonetworks.com", ZS: "zscaler.com",
  CRWD: "crowdstrike.com", SNOW: "snowflake.com", MDB: "mongodb.com",
  DDOG: "datadoghq.com", ABNB: "airbnb.com", LYFT: "lyft.com", SQ: "block.xyz",
  SHOP: "shopify.com", ROKU: "roku.com", SPOT: "spotify.com",
  REGN: "regeneron.com", GILD: "gilead.com", VRTX: "vrtx.com", MRNA: "modernatx.com",
  F: "ford.com", GM: "gm.com", STLA: "stellantis.com", RIVN: "rivian.com",
  LCID: "lucidmotors.com", LVS: "sands.com", MGM: "mgmresorts.com", DKNG: "draftkings.com",
  STZ: "cbrands.com", DEO: "diageo.com", GIS: "generalmills.com",
};

export default function StockLogo({ ticker, name, size = 32 }: Props) {
  const [error, setError] = useState(false);
  const domain = TICKER_TO_DOMAIN[ticker.toUpperCase()];
  const url = domain ? `https://logo.clearbit.com/${domain}` : undefined;

  const initials = ticker.replace(/[^A-Z]/g, "").slice(0, 2);
  const showFallback = !url || error;

  if (showFallback) {
    return (
      <div
        className="flex flex-shrink-0 items-center justify-center rounded-md bg-navy-50 font-semibold text-navy-700"
        style={{ width: size, height: size, fontSize: size * 0.4, fontFamily: "Georgia, serif" }}
        aria-label={`${name} logo`}
      >
        {initials}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={`${name} logo`}
      width={size}
      height={size}
      className="flex-shrink-0 rounded-md"
      style={{ width: size, height: size }}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}
