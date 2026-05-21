import React from "react";

// Shared brand colors
const NAVY = "#1F3A5F";
const NAVY_LIGHT = "#5E89AF";
const GOLD = "#B8860B";
const GOLD_LIGHT = "#E8C547";
const EMERALD = "#059669";
const EMERALD_LIGHT = "#A7F3D0";
const ROSE = "#DC2626";
const ROSE_LIGHT = "#FECACA";
const AMBER = "#D97706";
const SOFT = "#F4F7FB";
const INK = "#1F2937";
const MUTED = "#6B7280";

// ===========================================================
// 1. Ownership diagram — company split into shares
// ===========================================================
export function ShareSliceDiagram() {
  // Create 100 small squares; highlight one
  const cells: React.ReactElement[] = [];
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      const i = r * 10 + c;
      const isYours = i === 23;
      cells.push(
        <rect
          key={i}
          x={20 + c * 18}
          y={20 + r * 18}
          width={14}
          height={14}
          rx={2}
          fill={isYours ? GOLD : NAVY_LIGHT}
          opacity={isYours ? 1 : 0.18}
          stroke={isYours ? GOLD : "transparent"}
          strokeWidth={isYours ? 2 : 0}
        />
      );
    }
  }
  return (
    <Figure caption="A company is divided into millions of tiny shares. When you buy one share, you own one slice. The price goes up or down based on how well the company does.">
      <svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-md">
        <rect x={10} y={10} width={200} height={200} rx={8} fill={SOFT} stroke="#E5E7EB" />
        <text x={110} y={28} textAnchor="middle" fontSize="11" fill={MUTED} fontFamily="Calibri,sans-serif">Apple Inc. (a company)</text>
        {cells}
        {/* Arrow + label */}
        <line x1={240} y1={70} x2={210} y2={70} stroke={GOLD} strokeWidth={2} markerEnd="url(#arrow)" />
        <defs>
          <marker id="arrow" markerWidth={8} markerHeight={8} refX={6} refY={4} orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill={GOLD} />
          </marker>
        </defs>
        <text x={250} y={66} fontSize="13" fontWeight="bold" fill={NAVY} fontFamily="Georgia,serif">Your share</text>
        <text x={250} y={84} fontSize="11" fill={MUTED} fontFamily="Calibri,sans-serif">Bought through a brokerage</text>
        <text x={250} y={100} fontSize="11" fill={MUTED} fontFamily="Calibri,sans-serif">(Robinhood, Fidelity, Schwab…)</text>
        <text x={250} y={130} fontSize="11" fill={INK} fontFamily="Calibri,sans-serif">If Apple grows:</text>
        <text x={250} y={146} fontSize="12" fontWeight="bold" fill={EMERALD} fontFamily="Calibri,sans-serif">↑ your share goes up</text>
        <text x={250} y={170} fontSize="11" fill={INK} fontFamily="Calibri,sans-serif">If Apple shrinks:</text>
        <text x={250} y={186} fontSize="12" fontWeight="bold" fill={ROSE} fontFamily="Calibri,sans-serif">↓ your share goes down</text>
      </svg>
    </Figure>
  );
}

// ===========================================================
// 2. Halal vs Haram sources
// ===========================================================
export function HalalHaramSourcesDiagram() {
  const halal = ["Selling products", "Selling services", "Manufacturing", "Software", "Real rentals"];
  const haram = ["Interest (riba)", "Alcohol", "Gambling", "Conventional banking", "Pork products"];
  return (
    <Figure caption="A business is halal-investable when its core money comes from permissible sources. A small amount of incidental impermissible income (like interest on cash) can still pass — Mizan's screen checks the limits.">
      <svg viewBox="0 0 480 260" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-md">
        {/* Halal column */}
        <rect x={10} y={20} width={220} height={220} rx={10} fill={EMERALD_LIGHT} fillOpacity={0.35} stroke={EMERALD} strokeWidth={1} />
        <text x={120} y={42} textAnchor="middle" fontSize="14" fontWeight="bold" fill={EMERALD} fontFamily="Georgia,serif">Permissible income</text>
        <text x={120} y={58} textAnchor="middle" fontSize="10" fill={EMERALD} fontFamily="Calibri,sans-serif">("halal")</text>
        {halal.map((t, i) => (
          <g key={t}>
            <circle cx={32} cy={80 + i * 30} r={5} fill={EMERALD} />
            <text x={48} y={84 + i * 30} fontSize="13" fill={INK} fontFamily="Calibri,sans-serif">{t}</text>
          </g>
        ))}

        {/* Haram column */}
        <rect x={250} y={20} width={220} height={220} rx={10} fill={ROSE_LIGHT} fillOpacity={0.35} stroke={ROSE} strokeWidth={1} />
        <text x={360} y={42} textAnchor="middle" fontSize="14" fontWeight="bold" fill={ROSE} fontFamily="Georgia,serif">Forbidden income</text>
        <text x={360} y={58} textAnchor="middle" fontSize="10" fill={ROSE} fontFamily="Calibri,sans-serif">("haram")</text>
        {haram.map((t, i) => (
          <g key={t}>
            <text x={272} y={84 + i * 30} fontSize="14" fill={ROSE} fontFamily="Calibri,sans-serif">✗</text>
            <text x={290} y={84 + i * 30} fontSize="13" fill={INK} fontFamily="Calibri,sans-serif">{t}</text>
          </g>
        ))}
      </svg>
    </Figure>
  );
}

// ===========================================================
// 3. Scholar spectrum — same stock, different verdicts
// ===========================================================
export function ScholarSpectrumDiagram() {
  // Simulating Amazon under each
  const scholars = [
    { name: "Strict", verdict: "fail", note: "Any debt fails" },
    { name: "Mufti Taqi", verdict: "fail", note: "Illiquid floor" },
    { name: "AAOIFI", verdict: "pass", note: "All within limits" },
    { name: "DJIM", verdict: "pass", note: "All within limits" },
    { name: "Ja'fari", verdict: "pass", note: "Khums on gains" },
  ];
  return (
    <Figure caption="Five scholars, one stock (Amazon). Same business, different verdicts. The right answer depends on whose ruling you follow — and Mizan tailors every verdict to your choice.">
      <svg viewBox="0 0 480 240" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-lg">
        {/* Title block */}
        <text x={240} y={20} textAnchor="middle" fontSize="14" fontWeight="bold" fill={NAVY} fontFamily="Georgia,serif">AMZN — under five scholars</text>

        {/* Spectrum line */}
        <line x1={40} y1={205} x2={440} y2={205} stroke={MUTED} strokeWidth={1} />
        <text x={40} y={225} fontSize="10" fill={MUTED} fontFamily="Calibri,sans-serif">stricter</text>
        <text x={440} y={225} textAnchor="end" fontSize="10" fill={MUTED} fontFamily="Calibri,sans-serif">more permissive</text>

        {scholars.map((s, i) => {
          const x = 60 + i * 90;
          const pass = s.verdict === "pass";
          return (
            <g key={s.name}>
              <circle cx={x} cy={205} r={6} fill={pass ? EMERALD : ROSE} stroke="white" strokeWidth={2} />
              <line x1={x} y1={195} x2={x} y2={140} stroke={MUTED} strokeWidth={1} strokeDasharray="2 2" />
              {/* Box */}
              <rect x={x - 40} y={60} width={80} height={75} rx={8} fill={pass ? EMERALD_LIGHT : ROSE_LIGHT} fillOpacity={0.4} stroke={pass ? EMERALD : ROSE} strokeWidth={1} />
              <text x={x} y={80} textAnchor="middle" fontSize="11" fontWeight="bold" fill={INK} fontFamily="Calibri,sans-serif">{s.name}</text>
              <text x={x} y={100} textAnchor="middle" fontSize="14" fontWeight="bold" fill={pass ? EMERALD : ROSE} fontFamily="Georgia,serif">
                {pass ? "PASS" : "FAIL"}
              </text>
              <text x={x} y={120} textAnchor="middle" fontSize="9" fill={MUTED} fontFamily="Calibri,sans-serif">{s.note}</text>
            </g>
          );
        })}
      </svg>
    </Figure>
  );
}

// ===========================================================
// 4. The 5 ratios visualized
// ===========================================================
export function RatiosDiagram() {
  const ratios = [
    { label: "Impermissible income / revenue", value: 35, limit: 50, direction: "max" },  // visual proportion
    { label: "Interest-bearing debt / market cap", value: 22, limit: 60, direction: "max" },
    { label: "Cash + securities / market cap", value: 28, limit: 60, direction: "max" },
    { label: "Receivables / market cap", value: 18, limit: 60, direction: "max" },
    { label: "Illiquid (real) assets / total", value: 65, limit: 40, direction: "min" },
  ];
  return (
    <Figure caption="Five numbers. A stock passes if each one is within your scholar's limits. The grey bar is the threshold; the navy bar is the company's actual value. The illiquid-assets check is unique to Mufti Taqi.">
      <svg viewBox="0 0 480 260" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-lg">
        {ratios.map((r, i) => {
          const y = 30 + i * 45;
          const barX = 230;
          const barW = 200;
          const valueW = (r.value / 100) * barW;
          const limitX = barX + (r.limit / 100) * barW;
          const passes = r.direction === "max" ? r.value <= r.limit : r.value >= r.limit;
          return (
            <g key={r.label}>
              <text x={222} y={y + 4} textAnchor="end" fontSize="11" fill={INK} fontFamily="Calibri,sans-serif">{r.label}</text>
              {/* Track */}
              <rect x={barX} y={y - 6} width={barW} height={12} rx={6} fill="#F3F4F6" />
              {/* Value */}
              <rect x={barX} y={y - 6} width={valueW} height={12} rx={6} fill={passes ? EMERALD : ROSE} />
              {/* Threshold marker */}
              <line x1={limitX} y1={y - 12} x2={limitX} y2={y + 8} stroke={INK} strokeWidth={2} />
              <text x={limitX} y={y - 16} textAnchor="middle" fontSize="9" fill={MUTED} fontFamily="Calibri,sans-serif">limit</text>
            </g>
          );
        })}
      </svg>
    </Figure>
  );
}

// ===========================================================
// 5. Purification flow — dividend → impure portion → charity
// ===========================================================
export function PurificationDiagram() {
  return (
    <Figure caption="Even halal stocks earn a small slice of impure income (interest on bank cash). When you receive a dividend, calculate that slice and donate it to charity — without expecting reward. That's purification.">
      <svg viewBox="0 0 480 200" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-lg">
        {/* Dividend */}
        <rect x={20} y={70} width={130} height={60} rx={10} fill={NAVY} />
        <text x={85} y={94} textAnchor="middle" fontSize="11" fill={GOLD_LIGHT} fontFamily="Calibri,sans-serif">YOUR DIVIDEND</text>
        <text x={85} y={118} textAnchor="middle" fontSize="20" fontWeight="bold" fill="white" fontFamily="Georgia,serif">$100</text>

        {/* Arrow */}
        <line x1={155} y1={100} x2={185} y2={100} stroke={NAVY} strokeWidth={2} markerEnd="url(#arr2)" />
        <defs>
          <marker id="arr2" markerWidth={8} markerHeight={8} refX={6} refY={4} orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill={NAVY} />
          </marker>
        </defs>

        {/* Split */}
        <rect x={195} y={50} width={130} height={55} rx={8} fill={EMERALD_LIGHT} fillOpacity={0.5} stroke={EMERALD} strokeWidth={1} />
        <text x={260} y={70} textAnchor="middle" fontSize="10" fill={EMERALD} fontFamily="Calibri,sans-serif">Pure portion (yours)</text>
        <text x={260} y={92} textAnchor="middle" fontSize="16" fontWeight="bold" fill={EMERALD} fontFamily="Georgia,serif">$97.20</text>

        <rect x={195} y={115} width={130} height={45} rx={8} fill={AMBER} fillOpacity={0.18} stroke={AMBER} strokeWidth={1} />
        <text x={260} y={134} textAnchor="middle" fontSize="10" fill={AMBER} fontFamily="Calibri,sans-serif">Impure 2.8% (donate)</text>
        <text x={260} y={152} textAnchor="middle" fontSize="14" fontWeight="bold" fill={AMBER} fontFamily="Georgia,serif">$2.80</text>

        {/* Arrow to charity */}
        <line x1={330} y1={138} x2={365} y2={138} stroke={AMBER} strokeWidth={2} markerEnd="url(#arr3)" />
        <defs>
          <marker id="arr3" markerWidth={8} markerHeight={8} refX={6} refY={4} orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill={AMBER} />
          </marker>
        </defs>

        {/* Charity icon */}
        <rect x={370} y={105} width={90} height={70} rx={10} fill={GOLD_LIGHT} fillOpacity={0.4} stroke={GOLD} strokeWidth={1} />
        <text x={415} y={130} textAnchor="middle" fontSize="22" fontFamily="Calibri,sans-serif">♥</text>
        <text x={415} y={156} textAnchor="middle" fontSize="11" fontWeight="bold" fill={GOLD} fontFamily="Calibri,sans-serif">Charity</text>
      </svg>
    </Figure>
  );
}

// ===========================================================
// 6. Zakat flow — total wealth → 2.5% slice
// ===========================================================
export function ZakatDiagram() {
  return (
    <Figure caption="Zakat is a separate religious obligation: 2.5% of your net wealth above the nisab threshold, paid annually to charity. Mizan's calculator handles cash, stocks, crypto, gold, and silver.">
      <svg viewBox="0 0 480 200" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-lg">
        {/* Wealth circle */}
        <circle cx={120} cy={100} r={70} fill={NAVY} />
        {/* 2.5% wedge */}
        <path d="M 120 30 A 70 70 0 0 1 137.4 32.2 L 120 100 Z" fill={GOLD_LIGHT} />
        <text x={120} y={95} textAnchor="middle" fontSize="11" fill={GOLD_LIGHT} fontFamily="Calibri,sans-serif">YOUR WEALTH</text>
        <text x={120} y={114} textAnchor="middle" fontSize="9" fill={GOLD_LIGHT} fontFamily="Calibri,sans-serif">(above nisab)</text>

        {/* Pointer to wedge */}
        <line x1={150} y1={36} x2={210} y2={36} stroke={GOLD} strokeWidth={2} />
        <text x={215} y={32} fontSize="14" fontWeight="bold" fill={GOLD} fontFamily="Georgia,serif">2.5%</text>
        <text x={215} y={48} fontSize="11" fill={MUTED} fontFamily="Calibri,sans-serif">— your zakat</text>

        {/* Arrow */}
        <line x1={210} y1={100} x2={300} y2={100} stroke={NAVY} strokeWidth={2} markerEnd="url(#arr4)" />
        <defs>
          <marker id="arr4" markerWidth={8} markerHeight={8} refX={6} refY={4} orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill={NAVY} />
          </marker>
        </defs>

        {/* Charity */}
        <rect x={310} y={60} width={140} height={90} rx={12} fill={GOLD_LIGHT} fillOpacity={0.4} stroke={GOLD} strokeWidth={1} />
        <text x={380} y={95} textAnchor="middle" fontSize="28" fontFamily="Calibri,sans-serif">♥</text>
        <text x={380} y={125} textAnchor="middle" fontSize="12" fontWeight="bold" fill={GOLD} fontFamily="Calibri,sans-serif">Charity</text>
        <text x={380} y={142} textAnchor="middle" fontSize="9" fill={MUTED} fontFamily="Calibri,sans-serif">Annually, on your zakat date</text>
      </svg>
    </Figure>
  );
}

// ===========================================================
// Layout helper
// ===========================================================
function Figure({ children, caption }: { children: React.ReactNode; caption: string }) {
  return (
    <figure className="my-6 flex flex-col items-center rounded-xl border border-gray-200 bg-gray-50 p-4">
      <div className="w-full overflow-x-auto">{children}</div>
      <figcaption className="mt-3 max-w-prose text-center text-xs italic text-gray-600">{caption}</figcaption>
    </figure>
  );
}
