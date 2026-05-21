import React from "react";

// ─── Ruthless palette: 3 colors maximum ───
const INK = "#0F172A";          // primary text
const MUTED = "#64748B";        // labels, captions
const HAIR = "#E2E8F0";         // hairlines
const GOLD = "#B8860B";         // single accent — used sparingly
const EMERALD = "#047857";      // pass (used only for verdict semantics)
const ROSE = "#BE123C";         // fail

const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "ui-sans-serif, system-ui, sans-serif";

// ── shared figure shell ──
function Figure({ children, caption }: { children: React.ReactNode; caption: string }) {
  return (
    <figure className="my-10 border-y border-gray-200 bg-white py-10">
      <div className="mx-auto flex w-full max-w-3xl justify-center px-4">{children}</div>
      <figcaption className="mx-auto mt-6 max-w-prose px-6 text-center text-xs italic leading-5 text-gray-500">
        {caption}
      </figcaption>
    </figure>
  );
}

// ──────────────────────────────────────────────────────────────
// 1.  STOCK = ONE SLICE OF MANY
// ──────────────────────────────────────────────────────────────
export function ShareSliceDiagram() {
  const COLS = 24, ROWS = 8;
  const dotR = 4, gap = 12;
  const gridX = 0, gridY = 60;
  const totalW = (COLS - 1) * gap;
  const highlight = { r: 3, c: 9 };

  const dots: React.ReactElement[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const isYours = r === highlight.r && c === highlight.c;
      dots.push(
        <circle key={`${r}-${c}`}
          cx={gridX + c * gap} cy={gridY + r * gap} r={isYours ? dotR + 1 : dotR}
          fill={isYours ? GOLD : INK} opacity={isYours ? 1 : 0.12} />
      );
    }
  }

  return (
    <Figure caption="A company is divided into many small slices. Buying a share means buying one slice. Its value rises and falls with the business.">
      <svg viewBox={`-40 0 ${totalW + 80} 220`} xmlns="http://www.w3.org/2000/svg" className="w-full max-w-2xl" role="img" aria-label="A grid of dots representing shares of Apple, with one highlighted in gold.">
        {/* Headline */}
        <text x="0" y="22" fontSize="11" fontWeight="600" fill={MUTED} fontFamily={SANS} letterSpacing="0.16em">APPLE  ·  16 BILLION SHARES</text>

        {/* The grid of dots */}
        {dots}

        {/* Pointer from highlighted dot */}
        <line x1={gridX + highlight.c * gap + 8} y1={gridY + highlight.r * gap}
              x2={gridX + highlight.c * gap + 60} y2={gridY + highlight.r * gap - 20}
              stroke={INK} strokeWidth={0.5} />

        <text x={gridX + highlight.c * gap + 64} y={gridY + highlight.r * gap - 22}
              fontSize="12" fontStyle="italic" fill={INK} fontFamily={SERIF}>
          one of these is yours.
        </text>

        {/* Hairline + caption row */}
        <line x1="0" y1="196" x2={totalW} y2="196" stroke={HAIR} />
        <text x="0" y="214" fontSize="10" fill={MUTED} fontFamily={SANS}>If Apple grows, so does your slice.</text>
        <text x={totalW} y="214" textAnchor="end" fontSize="10" fill={MUTED} fontFamily={SANS}>If Apple shrinks, so does your slice.</text>
      </svg>
    </Figure>
  );
}

// ──────────────────────────────────────────────────────────────
// 2.  PERMISSIBLE vs FORBIDDEN  — editorial two-column
// ──────────────────────────────────────────────────────────────
export function HalalHaramSourcesDiagram() {
  const permissible = ["Selling products", "Selling services", "Manufacturing", "Software", "Real-estate rentals"];
  const forbidden = ["Interest (riba)", "Alcohol", "Gambling", "Conventional banking", "Tobacco, pork"];

  return (
    <Figure caption="Islamic finance permits earning from real economic activity. It forbids earning from interest, gambling, and a short list of explicit sources. Every halal-screened stock is checked against both lists.">
      <svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-2xl" role="img" aria-label="Two columns listing permissible and forbidden income sources for halal investing.">
        {/* Headers */}
        <text x="0" y="28" fontSize="11" fontWeight="600" fill={EMERALD} fontFamily={SANS} letterSpacing="0.16em">PERMISSIBLE</text>
        <text x="380" y="28" fontSize="11" fontWeight="600" fill={ROSE} fontFamily={SANS} letterSpacing="0.16em">FORBIDDEN</text>

        {/* Hairlines below headers */}
        <line x1="0" y1="44" x2="340" y2="44" stroke={EMERALD} strokeWidth={0.8} />
        <line x1="380" y1="44" x2="720" y2="44" stroke={ROSE} strokeWidth={0.8} />

        {/* Permissible list */}
        {permissible.map((label, i) => (
          <text key={`p-${i}`} x="0" y={80 + i * 44} fontSize="22" fill={INK} fontFamily={SERIF}>
            {label}
          </text>
        ))}

        {/* Forbidden list */}
        {forbidden.map((label, i) => (
          <text key={`f-${i}`} x="380" y={80 + i * 44} fontSize="22" fill={INK} fontFamily={SERIF}>
            {label}
          </text>
        ))}

        {/* Vertical divider */}
        <line x1="360" y1="0" x2="360" y2="320" stroke={HAIR} />
      </svg>
    </Figure>
  );
}

// ──────────────────────────────────────────────────────────────
// 3.  SCHOLAR SPECTRUM  — typographic
// ──────────────────────────────────────────────────────────────
export function ScholarSpectrumDiagram() {
  const scholars = [
    { name: "Strict",        verdict: "fail", note: "any debt rejected" },
    { name: "Mufti Taqi",    verdict: "fail", note: "illiquid floor not met" },
    { name: "AAOIFI",        verdict: "pass", note: "within all caps" },
    { name: "DJIM",          verdict: "pass", note: "within all caps" },
    { name: "Ja'fari",       verdict: "pass", note: "khums on gains" },
  ];

  return (
    <Figure caption="Five mainstream scholarly methodologies. Same stock — Amazon. Different verdicts. Mizan ships all five plus a custom builder; you pick whose rulings to apply.">
      <svg viewBox="0 0 720 280" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-3xl" role="img" aria-label="Five scholars ranged across a strictness spectrum, with PASS or FAIL verdicts on AMZN.">
        {/* Question, top-left */}
        <text x="0" y="22" fontSize="11" fontWeight="600" fill={MUTED} fontFamily={SANS} letterSpacing="0.16em">THE QUESTION</text>
        <text x="0" y="56" fontSize="28" fontFamily={SERIF} fill={INK} fontStyle="italic">Is AMZN halal?</text>

        {/* Hairline */}
        <line x1="0" y1="98" x2="720" y2="98" stroke={HAIR} />

        {/* 5 scholar columns */}
        {scholars.map((s, i) => {
          const x = i * 144;
          const pass = s.verdict === "pass";
          return (
            <g key={s.name}>
              {/* PASS/FAIL — the big editorial word */}
              <text x={x} y="156" fontSize="32" fontFamily={SERIF}
                    fill={pass ? EMERALD : ROSE} fontWeight="400">
                {pass ? "Yes" : "No"}
              </text>
              {/* Scholar name */}
              <text x={x} y="184" fontSize="13" fontFamily={SANS} fontWeight="600" fill={INK}>
                {s.name}
              </text>
              {/* Reason */}
              <text x={x} y="202" fontSize="11" fontFamily={SANS} fill={MUTED} fontStyle="italic">
                {s.note}
              </text>
            </g>
          );
        })}

        {/* Hairline above scale */}
        <line x1="0" y1="234" x2="720" y2="234" stroke={HAIR} />

        {/* Scale endpoints */}
        <text x="0" y="254" fontSize="10" fontWeight="600" fill={MUTED} fontFamily={SANS} letterSpacing="0.12em">STRICTER</text>
        <text x="720" y="254" textAnchor="end" fontSize="10" fontWeight="600" fill={MUTED} fontFamily={SANS} letterSpacing="0.12em">MORE PERMISSIVE</text>
      </svg>
    </Figure>
  );
}

// ──────────────────────────────────────────────────────────────
// 4.  THE FIVE RATIOS  — financial-statement style
// ──────────────────────────────────────────────────────────────
export function RatiosDiagram() {
  const rows = [
    { label: "Impermissible income / revenue",      value: "2.8",  unit: "%", cap: "5",   pass: true },
    { label: "Interest-bearing debt / market cap",  value: "6.5",  unit: "%", cap: "30",  pass: true },
    { label: "Cash & securities / market cap",      value: "18",   unit: "%", cap: "30",  pass: true },
    { label: "Receivables / market cap",            value: "3.1",  unit: "%", cap: "33",  pass: true },
    { label: "Illiquid (real) assets / total",      value: "12",   unit: "%", min: "20",  pass: false },
  ];

  return (
    <Figure caption="Halal screening checks five numbers per company. Each scholar sets the limit; Mizan shows the company's value against it. The last row is Mufti Taqi Usmani's distinctive floor — no other major standard requires it.">
      <svg viewBox="0 0 720 340" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-3xl" role="img" aria-label="A table of five financial ratios with values and limits.">
        {/* Header */}
        <text x="0" y="20" fontSize="11" fontWeight="600" fill={MUTED} fontFamily={SANS} letterSpacing="0.16em">AMZN  ·  AAOIFI METHODOLOGY</text>

        {/* Column labels */}
        <text x="0" y="58" fontSize="10" fontWeight="600" fill={MUTED} fontFamily={SANS} letterSpacing="0.10em">CHECK</text>
        <text x="540" y="58" textAnchor="end" fontSize="10" fontWeight="600" fill={MUTED} fontFamily={SANS} letterSpacing="0.10em">VALUE</text>
        <text x="640" y="58" textAnchor="end" fontSize="10" fontWeight="600" fill={MUTED} fontFamily={SANS} letterSpacing="0.10em">LIMIT</text>
        <text x="720" y="58" textAnchor="end" fontSize="10" fontWeight="600" fill={MUTED} fontFamily={SANS} letterSpacing="0.10em">STATUS</text>
        <line x1="0" y1="68" x2="720" y2="68" stroke={INK} strokeWidth={0.8} />

        {/* Rows */}
        {rows.map((r, i) => {
          const y = 100 + i * 44;
          const limit = "cap" in r ? `≤ ${r.cap}${r.unit}` : `≥ ${r.min}${r.unit}`;
          return (
            <g key={r.label}>
              <text x="0" y={y} fontSize="14" fill={INK} fontFamily={SERIF}>{r.label}</text>
              <text x="540" y={y} textAnchor="end" fontSize="18" fill={INK} fontFamily={SERIF} fontWeight="600">{r.value}{r.unit}</text>
              <text x="640" y={y} textAnchor="end" fontSize="12" fill={MUTED} fontFamily={SANS}>{limit}</text>
              <text x="720" y={y} textAnchor="end" fontSize="10" fontWeight="600"
                    fill={r.pass ? EMERALD : ROSE} fontFamily={SANS} letterSpacing="0.10em">
                {r.pass ? "OK" : ("cap" in r ? "OVER" : "UNDER")}
              </text>
              <line x1="0" y1={y + 14} x2="720" y2={y + 14} stroke={HAIR} />
            </g>
          );
        })}
      </svg>
    </Figure>
  );
}

// ──────────────────────────────────────────────────────────────
// 5.  PURIFICATION  — editorial equation
// ──────────────────────────────────────────────────────────────
export function PurificationDiagram() {
  return (
    <Figure caption="Even halal-screened companies earn a small slice of impermissible income (mostly interest on their cash). When you receive a dividend, calculate that slice and donate it to charity, without expecting reward.">
      <svg viewBox="0 0 720 200" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-3xl" role="img" aria-label="An equation showing $100 dividend × 2.8% impurity = $2.80 to donate.">
        {/* Label */}
        <text x="0" y="22" fontSize="11" fontWeight="600" fill={MUTED} fontFamily={SANS} letterSpacing="0.16em">YOUR DIVIDEND</text>

        {/* Numbers row, big serif */}
        <text x="0" y="100" fontSize="64" fontFamily={SERIF} fill={INK}>$100</text>
        <text x="170" y="100" fontSize="32" fontFamily={SERIF} fill={MUTED}>×</text>
        <text x="210" y="100" fontSize="64" fontFamily={SERIF} fill={INK}>2.8%</text>
        <text x="370" y="100" fontSize="32" fontFamily={SERIF} fill={MUTED}>=</text>
        <text x="410" y="100" fontSize="64" fontFamily={SERIF} fill={GOLD}>$2.80</text>

        {/* Labels under */}
        <text x="0" y="128" fontSize="11" fontFamily={SANS} fill={MUTED}>paid by the company</text>
        <text x="210" y="128" fontSize="11" fontFamily={SANS} fill={MUTED}>impure income rate</text>
        <text x="410" y="128" fontSize="11" fontFamily={SANS} fill={GOLD} fontWeight="600">DONATE TO CHARITY</text>

        {/* Hairline */}
        <line x1="0" y1="168" x2="720" y2="168" stroke={HAIR} />
        <text x="0" y="190" fontSize="11" fontStyle="italic" fontFamily={SERIF} fill={MUTED}>
          Without expectation of reward — purification, not sadaqah.
        </text>
      </svg>
    </Figure>
  );
}

// ──────────────────────────────────────────────────────────────
// 6.  ZAKAT  — equation + endpoint
// ──────────────────────────────────────────────────────────────
export function ZakatDiagram() {
  return (
    <Figure caption="Zakat is the annual 2.5% obligation on net wealth above the nisab threshold. Distinct from purification. Mizan's calculator handles cash, stocks, gold, silver, and crypto.">
      <svg viewBox="0 0 720 220" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-3xl" role="img" aria-label="An equation showing your wealth × 2.5% = annual zakat to charity.">
        {/* Header */}
        <text x="0" y="22" fontSize="11" fontWeight="600" fill={MUTED} fontFamily={SANS} letterSpacing="0.16em">EACH YEAR  ·  ABOVE NISAB</text>

        {/* Equation row */}
        <text x="0" y="108" fontSize="48" fontFamily={SERIF} fill={INK}>Your wealth</text>
        <text x="320" y="108" fontSize="32" fontFamily={SERIF} fill={MUTED}>×</text>
        <text x="360" y="108" fontSize="64" fontFamily={SERIF} fill={GOLD}>2.5%</text>
        <text x="510" y="108" fontSize="32" fontFamily={SERIF} fill={MUTED}>→</text>
        <text x="560" y="108" fontSize="48" fontFamily={SERIF} fill={INK}>Charity</text>

        {/* Sub-labels */}
        <text x="0" y="136" fontSize="11" fontFamily={SANS} fill={MUTED}>cash, stocks, gold, silver, crypto</text>
        <text x="360" y="136" fontSize="11" fontFamily={SANS} fontWeight="600" fill={GOLD}>YOUR ZAKAT</text>
        <text x="560" y="136" fontSize="11" fontFamily={SANS} fill={MUTED}>on your zakat anniversary</text>

        {/* Hairline */}
        <line x1="0" y1="180" x2="720" y2="180" stroke={HAIR} />
        <text x="0" y="204" fontSize="11" fontStyle="italic" fontFamily={SERIF} fill={MUTED}>
          Nisab = the minimum wealth threshold for zakat obligation (~$520 silver standard, ~$6,500 gold standard).
        </text>
      </svg>
    </Figure>
  );
}
