import React from "react";

// ─── Editorial palette: 3 colors maximum ───
const INK = "#0F172A";          // primary text
const MUTED = "#64748B";        // labels, captions
const HAIR = "#E2E8F0";         // hairlines
const GOLD = "#B8860B";         // single accent — used sparingly
const EMERALD = "#047857";      // pass (used only for verdict semantics)
const ROSE = "#BE123C";         // fail

const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "ui-sans-serif, system-ui, sans-serif";

// ──────────────────────────────────────────────────────────────
// Shared figure shell — Pentagram / FT-style border-y container
// ──────────────────────────────────────────────────────────────
function Figure({ children, caption }: { children: React.ReactNode; caption: string }) {
  return (
    <figure className="my-12 border-y border-gray-200 bg-white py-12">
      <div className="mx-auto flex w-full max-w-3xl justify-center px-6">{children}</div>
      <figcaption className="mx-auto mt-8 max-w-prose px-6 text-center text-xs italic leading-relaxed text-gray-500">
        {caption}
      </figcaption>
    </figure>
  );
}

// ──────────────────────────────────────────────────────────────
// 1.  STOCK = ONE SLICE OF MANY
//
// Layout — measured to a 720×360 viewBox; nothing overlaps at any scale.
//
//   y =  20–46   kicker (small caps)
//   y =  56–84   headline (serif 24px) — bounded to grid area only
//   y =  94      top hairline
//   y = 120–232  dot matrix: 8 rows × 26 cols, 14-px gap
//                grid lives in x = 80…430 (350×112)
//   y = 252      single bottom rule
//   y = 268      single editorial subtitle (centered)
//
// Callout sits in the EMPTY right margin (x = 450–700) and is anchored
// to row 4 of the grid — far below the headline, far above the subtitle.
// The label cannot collide with any other element.
// ──────────────────────────────────────────────────────────────
export function ShareSliceDiagram() {
  const COLS = 26;
  const ROWS = 8;
  const dotR = 3;
  const gap = 14;
  const gridX = 80;
  const gridY = 120;
  const gridW = (COLS - 1) * gap; // 350
  const gridH = (ROWS - 1) * gap; // 98

  // Highlighted share — rightmost column on row 4 so the callout leader
  // emerges into pure empty space (no other dots in its path).
  const hl = { row: 4, col: COLS - 1 };
  const hlX = gridX + hl.col * gap; // 80 + 350 = 430
  const hlY = gridY + hl.row * gap; // 120 + 56 = 176

  // Callout line — clean horizontal hop from the dot into the right margin
  const calloutX1 = hlX + dotR + 6;
  const calloutX2 = 478;
  const labelX = calloutX2 + 6;
  const labelY = hlY + 4;

  return (
    <Figure caption="A public company is divided into many small shares — Apple has about sixteen billion. Buying a share means buying one of those slices; its value rises and falls with the business.">
      <svg
        viewBox="0 0 720 360"
        xmlns="http://www.w3.org/2000/svg"
        className="block w-full max-w-3xl"
        role="img"
        aria-label="A grid of dots representing Apple's sixteen billion shares, with one highlighted in gold to show one share."
      >
        {/* Kicker — top-left, inside the same x-margin as the grid */}
        <text x="80" y="40" fontSize="11" fontWeight="600" fill={MUTED} fontFamily={SANS} letterSpacing="0.18em">
          ONE COMPANY
        </text>

        {/* Headline — bounded to grid width so we never cross into the callout zone */}
        <text x="80" y="74" fontSize="24" fill={INK} fontFamily={SERIF}>
          Apple — 16 billion shares
        </text>

        {/* Top hairline — extends only across the grid, not the callout zone */}
        <line x1="80" y1="94" x2={80 + gridW} y2="94" stroke={HAIR} />

        {/* The grid of dots */}
        {Array.from({ length: ROWS }).map((_, r) =>
          Array.from({ length: COLS }).map((__, c) => {
            const isHl = r === hl.row && c === hl.col;
            return (
              <circle
                key={`${r}-${c}`}
                cx={gridX + c * gap}
                cy={gridY + r * gap}
                r={isHl ? dotR + 1.5 : dotR}
                fill={isHl ? GOLD : INK}
                opacity={isHl ? 1 : 0.16}
              />
            );
          })
        )}

        {/* Horizontal callout into the empty right margin */}
        <line x1={calloutX1} y1={hlY} x2={calloutX2} y2={hlY} stroke={INK} strokeWidth={0.6} />
        <text x={labelX} y={labelY} fontSize="13" fontStyle="italic" fill={INK} fontFamily={SERIF}>
          one share
        </text>
        <text x={labelX} y={labelY + 18} fontSize="13" fontStyle="italic" fill={INK} fontFamily={SERIF}>
          is yours
        </text>

        {/* Bottom hairline — single full-width rule */}
        <line x1="80" y1="252" x2="640" y2="252" stroke={HAIR} />

        {/* Single editorial subtitle — replaces the two dueling labels */}
        <text x="360" y="278" textAnchor="middle" fontSize="11" fill={MUTED} fontFamily={SANS} letterSpacing="0.14em">
          YOUR SHARE RISES AND FALLS WITH THE BUSINESS
        </text>
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
      <svg
        viewBox="0 0 720 340"
        xmlns="http://www.w3.org/2000/svg"
        className="block w-full max-w-3xl"
        role="img"
        aria-label="Two columns listing permissible and forbidden income sources for halal investing."
      >
        {/* Column headers */}
        <text x="0" y="28" fontSize="11" fontWeight="600" fill={EMERALD} fontFamily={SANS} letterSpacing="0.18em">
          PERMISSIBLE
        </text>
        <text x="380" y="28" fontSize="11" fontWeight="600" fill={ROSE} fontFamily={SANS} letterSpacing="0.18em">
          FORBIDDEN
        </text>

        {/* Underlines below headers — same weight, same length per side */}
        <line x1="0" y1="44" x2="340" y2="44" stroke={EMERALD} strokeWidth={1.2} />
        <line x1="380" y1="44" x2="720" y2="44" stroke={ROSE} strokeWidth={1.2} />

        {/* Permissible list */}
        {permissible.map((label, i) => (
          <g key={`p-${i}`}>
            <text x="0" y={86 + i * 46} fontSize="22" fill={INK} fontFamily={SERIF}>
              {label}
            </text>
            {i < permissible.length - 1 && (
              <line x1="0" y1={86 + i * 46 + 18} x2="340" y2={86 + i * 46 + 18} stroke={HAIR} />
            )}
          </g>
        ))}

        {/* Forbidden list */}
        {forbidden.map((label, i) => (
          <g key={`f-${i}`}>
            <text x="380" y={86 + i * 46} fontSize="22" fill={INK} fontFamily={SERIF}>
              {label}
            </text>
            {i < forbidden.length - 1 && (
              <line x1="380" y1={86 + i * 46 + 18} x2="720" y2={86 + i * 46 + 18} stroke={HAIR} />
            )}
          </g>
        ))}

        {/* Vertical divider — clipped to list region only */}
        <line x1="360" y1="20" x2="360" y2="316" stroke={HAIR} />
      </svg>
    </Figure>
  );
}

// ──────────────────────────────────────────────────────────────
// 3.  SCHOLAR SPECTRUM  — typographic
// ──────────────────────────────────────────────────────────────
export function ScholarSpectrumDiagram() {
  const scholars = [
    { name: "Strict",     verdict: "fail", note: "any debt rejected" },
    { name: "Mufti Taqi", verdict: "fail", note: "illiquid floor not met" },
    { name: "AAOIFI",     verdict: "pass", note: "within all caps" },
    { name: "DJIM",       verdict: "pass", note: "within all caps" },
    { name: "Ja'fari",    verdict: "pass", note: "khums on gains" },
  ];

  // 5 columns, centered text per column, even spacing across 720
  const COL_W = 720 / 5; // 144
  const colX = (i: number) => i * COL_W + COL_W / 2;

  return (
    <Figure caption="Five mainstream scholarly methodologies. Same stock — Amazon. Different verdicts. HalalGauge ships all five plus a custom builder; you pick whose rulings to apply.">
      <svg
        viewBox="0 0 720 300"
        xmlns="http://www.w3.org/2000/svg"
        className="block w-full max-w-3xl"
        role="img"
        aria-label="Five scholars ranged across a strictness spectrum, with PASS or FAIL verdicts on AMZN."
      >
        {/* Kicker + question, top-left */}
        <text x="0" y="22" fontSize="11" fontWeight="600" fill={MUTED} fontFamily={SANS} letterSpacing="0.18em">
          THE QUESTION
        </text>
        <text x="0" y="58" fontSize="28" fontFamily={SERIF} fill={INK} fontStyle="italic">
          Is AMZN halal?
        </text>

        {/* Hairline above the verdict row */}
        <line x1="0" y1="98" x2="720" y2="98" stroke={HAIR} />

        {/* 5 scholar columns, center-aligned within each cell */}
        {scholars.map((s, i) => {
          const pass = s.verdict === "pass";
          const cx = colX(i);
          return (
            <g key={s.name}>
              <text
                x={cx}
                y="162"
                fontSize="34"
                fontFamily={SERIF}
                fill={pass ? EMERALD : ROSE}
                fontWeight="400"
                textAnchor="middle"
              >
                {pass ? "Yes" : "No"}
              </text>
              <text x={cx} y="196" fontSize="13" fontFamily={SANS} fontWeight="600" fill={INK} textAnchor="middle">
                {s.name}
              </text>
              <text x={cx} y="216" fontSize="11" fontFamily={SANS} fill={MUTED} fontStyle="italic" textAnchor="middle">
                {s.note}
              </text>
            </g>
          );
        })}

        {/* Hairline above scale */}
        <line x1="0" y1="248" x2="720" y2="248" stroke={HAIR} />

        {/* Scale endpoints */}
        <text x="0" y="270" fontSize="10" fontWeight="600" fill={MUTED} fontFamily={SANS} letterSpacing="0.14em">
          STRICTER
        </text>
        <text x="720" y="270" textAnchor="end" fontSize="10" fontWeight="600" fill={MUTED} fontFamily={SANS} letterSpacing="0.14em">
          MORE PERMISSIVE
        </text>
      </svg>
    </Figure>
  );
}

// ──────────────────────────────────────────────────────────────
// 4.  THE FIVE RATIOS  — financial-statement style
// ──────────────────────────────────────────────────────────────
export function RatiosDiagram() {
  const rows = [
    { label: "Impermissible income / revenue",     value: "2.8",  unit: "%", cap: "5",   pass: true },
    { label: "Interest-bearing debt / market cap", value: "6.5",  unit: "%", cap: "30",  pass: true },
    { label: "Cash & securities / market cap",     value: "18",   unit: "%", cap: "30",  pass: true },
    { label: "Receivables / market cap",           value: "3.1",  unit: "%", cap: "33",  pass: true },
    { label: "Illiquid (real) assets / total",     value: "12",   unit: "%", min: "20",  pass: false, emphasize: true },
  ];

  // Column anchors — chosen for clean alignment at 720 viewBox width.
  // value = end-x for the number; unit = start-x for the "%" (rendered
  // separately so text-anchor="end" doesn't collapse them on top of each other).
  const COL = {
    label:    0,
    value:    430,
    unit:     436,
    limit:    580,
    status:   700,
  };

  return (
    <Figure caption="Halal screening checks five numbers per company. Each scholar sets the limit; HalalGauge shows the company's value against it. The last row is Mufti Taqi Usmani's distinctive floor — no other major standard requires it.">
      <svg
        viewBox="0 0 720 380"
        xmlns="http://www.w3.org/2000/svg"
        className="block w-full max-w-3xl"
        role="img"
        aria-label="A table of five financial ratios with values and limits, screened under AAOIFI methodology."
      >
        {/* Kicker */}
        <text x="0" y="20" fontSize="11" fontWeight="600" fill={MUTED} fontFamily={SANS} letterSpacing="0.18em">
          AMZN  ·  AAOIFI METHODOLOGY
        </text>

        {/* Column headers — same small-caps treatment as a financial filing */}
        <text x={COL.label}  y="62" fontSize="10" fontWeight="600" fill={MUTED} fontFamily={SANS} letterSpacing="0.12em">CHECK</text>
        <text x={COL.unit}   y="62" fontSize="10" fontWeight="600" fill={MUTED} fontFamily={SANS} letterSpacing="0.12em">VALUE</text>
        <text x={COL.limit}  y="62" textAnchor="end" fontSize="10" fontWeight="600" fill={MUTED} fontFamily={SANS} letterSpacing="0.12em">LIMIT</text>
        <text x={COL.status} y="62" textAnchor="end" fontSize="10" fontWeight="600" fill={MUTED} fontFamily={SANS} letterSpacing="0.12em">STATUS</text>

        {/* Top rule */}
        <line x1="0" y1="74" x2="720" y2="74" stroke={INK} strokeWidth={1} />

        {/* Rows — 50-px row height, baseline on row mid */}
        {rows.map((r, i) => {
          const y = 110 + i * 50;
          const limit = "cap" in r ? `≤ ${r.cap}${r.unit}` : `≥ ${r.min}${r.unit}`;
          const isLast = i === rows.length - 1;
          return (
            <g key={r.label}>
              <text x={COL.label} y={y} fontSize="14" fill={INK} fontFamily={SERIF} fontWeight={r.emphasize ? "600" : "400"}>
                {r.label}
              </text>
              {/* Number — right-aligned to the value column */}
              <text x={COL.value} y={y} textAnchor="end" fontSize="20" fill={INK} fontFamily={SERIF} fontWeight="600">
                {r.value}
              </text>
              {/* Unit ("%") — separate text element, left-anchored just past the number to avoid overlap */}
              <text x={COL.unit} y={y} fontSize="14" fontWeight="400" fill={MUTED} fontFamily={SERIF}>
                {r.unit}
              </text>
              <text x={COL.limit} y={y} textAnchor="end" fontSize="12" fill={MUTED} fontFamily={SANS}>
                {limit}
              </text>
              <text
                x={COL.status}
                y={y}
                textAnchor="end"
                fontSize="10"
                fontWeight="700"
                fill={r.pass ? EMERALD : ROSE}
                fontFamily={SANS}
                letterSpacing="0.12em"
              >
                {r.pass ? "OK" : ("cap" in r ? "OVER" : "UNDER")}
              </text>
              {!isLast && <line x1="0" y1={y + 18} x2="720" y2={y + 18} stroke={HAIR} />}
            </g>
          );
        })}

        {/* Bottom rule, slightly heavier */}
        <line x1="0" y1={110 + rows.length * 50 - 12} x2="720" y2={110 + rows.length * 50 - 12} stroke={INK} strokeWidth={1} />
      </svg>
    </Figure>
  );
}

// ──────────────────────────────────────────────────────────────
// 5.  PURIFICATION  — editorial equation
//
// Layout: three groups (PAID / RATE / DONATE) on a single horizontal
// baseline, with operators (×, =) as muted serif glyphs between them.
// Each group has its label directly underneath, locked to the same
// x-anchor as its number for clean vertical alignment.
// ──────────────────────────────────────────────────────────────
export function PurificationDiagram() {
  return (
    <Figure caption="Even halal-screened companies earn a small slice of impermissible income (mostly interest on their cash). When you receive a dividend, calculate that slice and donate it to charity, without expecting reward.">
      <svg
        viewBox="0 0 720 240"
        xmlns="http://www.w3.org/2000/svg"
        className="block w-full max-w-3xl"
        role="img"
        aria-label="An equation showing $100 dividend × 2.8% impurity equals $2.80 to donate."
      >
        {/* Kicker */}
        <text x="0" y="22" fontSize="11" fontWeight="600" fill={MUTED} fontFamily={SANS} letterSpacing="0.18em">
          YOUR DIVIDEND
        </text>

        {/* Equation row — single baseline at y=112 */}
        <text x="0"   y="112" fontSize="64" fontFamily={SERIF} fill={INK}>$100</text>
        <text x="180" y="112" fontSize="32" fontFamily={SERIF} fill={MUTED}>×</text>
        <text x="222" y="112" fontSize="64" fontFamily={SERIF} fill={INK}>2.8%</text>
        <text x="402" y="112" fontSize="32" fontFamily={SERIF} fill={MUTED}>=</text>
        <text x="444" y="112" fontSize="64" fontFamily={SERIF} fill={GOLD}>$2.80</text>

        {/* Labels under — locked to each value's x */}
        <text x="0"   y="140" fontSize="11" fontFamily={SANS} fill={MUTED} letterSpacing="0.08em">PAID BY THE COMPANY</text>
        <text x="222" y="140" fontSize="11" fontFamily={SANS} fill={MUTED} letterSpacing="0.08em">IMPURE INCOME RATE</text>
        <text x="444" y="140" fontSize="11" fontFamily={SANS} fill={GOLD} fontWeight="700" letterSpacing="0.08em">DONATE TO CHARITY</text>

        {/* Hairline + footnote */}
        <line x1="0" y1="190" x2="720" y2="190" stroke={HAIR} />
        <text x="0" y="216" fontSize="12" fontStyle="italic" fontFamily={SERIF} fill={MUTED}>
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
    <Figure caption="Zakat is the annual 2.5% obligation on net wealth above the nisab threshold. Distinct from purification. HalalGauge's calculator handles cash, stocks, gold, silver, and crypto.">
      <svg
        viewBox="0 0 720 240"
        xmlns="http://www.w3.org/2000/svg"
        className="block w-full max-w-3xl"
        role="img"
        aria-label="An equation showing your wealth times two and a half percent equals your annual zakat."
      >
        {/* Kicker */}
        <text x="0" y="22" fontSize="11" fontWeight="600" fill={MUTED} fontFamily={SANS} letterSpacing="0.18em">
          EACH YEAR  ·  ABOVE NISAB
        </text>

        {/* Equation row — single baseline at y=120 */}
        <text x="0"   y="120" fontSize="44" fontFamily={SERIF} fill={INK}>Your wealth</text>
        <text x="296" y="120" fontSize="32" fontFamily={SERIF} fill={MUTED}>×</text>
        <text x="340" y="120" fontSize="60" fontFamily={SERIF} fill={GOLD}>2.5%</text>
        <text x="500" y="120" fontSize="32" fontFamily={SERIF} fill={MUTED}>→</text>
        <text x="546" y="120" fontSize="44" fontFamily={SERIF} fill={INK}>Charity</text>

        {/* Sub-labels — locked to each piece's x */}
        <text x="0"   y="146" fontSize="11" fontFamily={SANS} fill={MUTED} letterSpacing="0.08em">CASH · STOCKS · GOLD · SILVER · CRYPTO</text>
        <text x="340" y="146" fontSize="11" fontFamily={SANS} fontWeight="700" fill={GOLD} letterSpacing="0.08em">YOUR ZAKAT</text>
        <text x="546" y="146" fontSize="11" fontFamily={SANS} fill={MUTED} letterSpacing="0.08em">ON YOUR ZAKAT ANNIVERSARY</text>

        {/* Hairline + footnote */}
        <line x1="0" y1="192" x2="720" y2="192" stroke={HAIR} />
        <text x="0" y="218" fontSize="12" fontStyle="italic" fontFamily={SERIF} fill={MUTED}>
          Nisab = the minimum wealth threshold for zakat obligation (~$520 silver standard, ~$6,500 gold standard).
        </text>
      </svg>
    </Figure>
  );
}
