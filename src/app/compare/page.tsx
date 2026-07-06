export const metadata = { title: "HalalGauge vs Zoya, Musaffa, Wahed & Islamicly" };

const ROWS = [
  { feature: "Scholar-level standards (Mufti Taqi Usmani illiquid-asset rule)", mizan: true, zoya: false, musaffa: false, wahed: false, islamicly: false },
  { feature: "Ja'fari (Shia) profile", mizan: true, zoya: false, musaffa: false, wahed: false, islamicly: false },
  { feature: "Switchable screening standards", mizan: true, zoya: true, musaffa: false, wahed: false, islamicly: false },
  { feature: "User-customizable thresholds", mizan: true, zoya: false, musaffa: false, wahed: false, islamicly: false },
  { feature: "Named Shariah supervisory board", mizan: false, zoya: true, musaffa: true, wahed: true, islamicly: true },
  { feature: "Stock screening", mizan: true, zoya: true, musaffa: true, wahed: false, islamicly: true },
  { feature: "Coverage (approx. listed stocks)", mizan: "657+", zoya: "30,000+", musaffa: "30,000+", wahed: "n/a", islamicly: "30,000+" },
  { feature: "Portfolio compliance scoring", mizan: true, zoya: true, musaffa: true, wahed: false, islamicly: true },
  { feature: "Brokerage sync", mizan: "planned", zoya: true, musaffa: true, wahed: false, islamicly: true },
  { feature: "In-app trading / managed money", mizan: false, zoya: true, musaffa: true, wahed: true, islamicly: false },
  { feature: "Purification calculator", mizan: true, zoya: true, musaffa: true, wahed: true, islamicly: true },
  { feature: "Capital-gain purification (Mufti Taqi / Ja'fari)", mizan: true, zoya: false, musaffa: false, wahed: false, islamicly: false },
  { feature: "Open-published methodology with cited primary sources", mizan: true, zoya: "partial", musaffa: "partial", wahed: "partial", islamicly: "partial" },
  { feature: "Free tier", mizan: true, zoya: true, musaffa: true, wahed: false, islamicly: true },
  { feature: "Paid plan (indicative)", mizan: "$9.99/mo", zoya: "$14.99/mo", musaffa: "$6–24/mo", wahed: "advisory fee", islamicly: "subscription" },
];

function Cell({ v }: { v: boolean | string }) {
  if (v === true) return <span className="text-emerald-700" aria-label="yes">✓</span>;
  if (v === false) return <span className="text-gray-300" aria-label="no">—</span>;
  if (v === "partial") return <span className="text-amber-600 text-xs italic">partial</span>;
  return <span className="text-gray-700 text-xs">{v}</span>;
}

export default function ComparePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">HalalGauge vs the rest</h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-600">
          A comparison of HalalGauge against the major halal investing apps in the
          English-speaking market, based on each platform&apos;s public materials. Updated
          quarterly. We compete on scholar-level transparency, not on coverage or price —
          and where a competitor is ahead, this table says so.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              <th className="px-4 py-3">Feature</th>
              <th className="bg-navy-50 px-4 py-3 text-center text-navy-800">HalalGauge</th>
              <th className="px-4 py-3 text-center">Zoya</th>
              <th className="px-4 py-3 text-center">Musaffa</th>
              <th className="px-4 py-3 text-center">Wahed</th>
              <th className="px-4 py-3 text-center">Islamicly</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={i} className="border-t border-gray-100">
                <td className="px-4 py-3 text-gray-800">{r.feature}</td>
                <td className="bg-navy-50/50 px-4 py-3 text-center font-semibold">
                  <Cell v={r.mizan} />
                </td>
                <td className="px-4 py-3 text-center"><Cell v={r.zoya} /></td>
                <td className="px-4 py-3 text-center"><Cell v={r.musaffa} /></td>
                <td className="px-4 py-3 text-center"><Cell v={r.wahed} /></td>
                <td className="px-4 py-3 text-center"><Cell v={r.islamicly} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
        <h2 className="text-lg font-semibold text-gray-900">Honestly, when shouldn&apos;t you use HalalGauge?</h2>
        <ul className="mt-3 list-disc pl-5 text-sm text-gray-700">
          <li>If you only follow AAOIFI and want managed money — Wahed is the better fit. We don&apos;t manage money.</li>
          <li>If you need coverage beyond US large/mid caps today — Zoya, Musaffa and Islamicly screen tens of thousands of global stocks; our universe is still growing.</li>
          <li>If a named Shariah supervisory board is your deciding factor — every competitor above has one; we don&apos;t yet, and we won&apos;t pretend otherwise.</li>
        </ul>
        <p className="mt-3 text-sm text-gray-600">
          We respect the other players. They each serve a real need; we serve a need they
          don&apos;t. If we&apos;re the wrong fit for you, we&apos;ll say so.
        </p>
      </div>

      <p className="text-xs text-gray-500">
        Feature comparison updated 6 July 2026. Prices and features change; always check each
        platform directly. Information reflects publicly disclosed
        capabilities of each platform; we welcome corrections via{" "}
        <a href="mailto:hello@halalgauge.com" className="text-navy-700 underline">hello@halalgauge.com</a>.
      </p>
    </div>
  );
}
