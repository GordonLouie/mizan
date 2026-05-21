import React from "react";

// ── Brand palette (calibrated for whites + grays) ──
const NAVY = "#1F3A5F";
const NAVY_DARK = "#162A44";
const NAVY_50 = "#F3F6FA";
const NAVY_200 = "#C4D4E3";
const GOLD = "#B8860B";
const GOLD_LIGHT = "#E8C547";
const GOLD_50 = "#FFFAEB";
const EMERALD = "#047857";
const EMERALD_LIGHT = "#10B981";
const EMERALD_50 = "#ECFDF5";
const ROSE = "#BE123C";
const ROSE_LIGHT = "#F43F5E";
const ROSE_50 = "#FFF1F2";
const AMBER = "#B45309";
const AMBER_50 = "#FFFBEB";
const INK = "#111827";
const MUTED = "#6B7280";
const HAIR = "#E5E7EB";

// ────────────────────────────────────────────────────────────
// Shared decorations
// ────────────────────────────────────────────────────────────
function SoftShadow({ id }: { id: string }) {
  return (
    <filter id={id} x="-10%" y="-10%" width="120%" height="125%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={NAVY} floodOpacity="0.10" />
    </filter>
  );
}

// ────────────────────────────────────────────────────────────
// 1.  Shares of a company  (refined)
// ────────────────────────────────────────────────────────────
export function ShareSliceDiagram() {
  const ROWS = 6, COLS = 12;
  const cellW = 16, cellH = 14, gap = 3;
  const gridX = 30, gridY = 50;
  const highlight = { r: 2, c: 5 };

  const cells: React.ReactElement[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const isYours = r === highlight.r && c === highlight.c;
      const x = gridX + c * (cellW + gap);
      const y = gridY + r * (cellH + gap);
      cells.push(
        <rect key={`${r}-${c}`} x={x} y={y} width={cellW} height={cellH} rx={2}
          fill={isYours ? GOLD : NAVY} opacity={isYours ? 1 : 0.10} />
      );
      if (isYours) {
        cells.push(<rect key="ring" x={x - 3} y={y - 3} width={cellW + 6} height={cellH + 6} rx={4}
          fill="none" stroke={GOLD} strokeWidth={1.5} opacity={0.9} />);
      }
    }
  }

  return (
    <Figure caption="A company is divided into millions of small ownership slices. When you buy a share, you own one. If the company grows, your slice is worth more — if it shrinks, less.">
      <svg viewBox="0 0 560 220" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-2xl" role="img" aria-label="A grid of share squares representing Apple Inc., with one share highlighted in gold">
        <defs><SoftShadow id="s1" /></defs>
        <rect x={0} y={0} width={560} height={220} fill="white" />

        {/* Company card */}
        <g filter="url(#s1)">
          <rect x={16} y={20} width={280} height={180} rx={14} fill={NAVY_50} stroke={HAIR} />
        </g>
        <text x={30} y={42} fontSize="11" fontWeight="600" fill={NAVY} fontFamily="ui-sans-serif, system-ui" letterSpacing="0.08em">APPLE INC.</text>
        <text x={30} y={56} fontSize="9" fill={MUTED} fontFamily="ui-sans-serif, system-ui">~16 billion shares outstanding</text>
        {cells}

        {/* Arrow + label */}
        <path d="M 300 88 Q 320 88 330 80" stroke={GOLD} strokeWidth={1.5} fill="none" />
        <path d="M 327 75 L 335 78 L 327 84 Z" fill={GOLD} />

        {/* Right side: callout */}
        <g filter="url(#s1)">
          <rect x={340} y={36} width={206} height={148} rx={12} fill="white" stroke={HAIR} />
        </g>
        <text x={356} y={62} fontSize="10" fontWeight="700" fill={GOLD} fontFamily="ui-sans-serif, system-ui" letterSpacing="0.08em">YOUR SHARE</text>
        <text x={356} y={92} fontSize="22" fontWeight="700" fill={INK} fontFamily="Georgia, serif">One slice</text>
        <text x={356} y={108} fontSize="11" fill={MUTED} fontFamily="ui-sans-serif, system-ui">of the whole company</text>

        <line x1={356} y1={122} x2={530} y2={122} stroke={HAIR} />

        <g>
          <circle cx={364} cy={144} r={4} fill={EMERALD_LIGHT} />
          <text x={376} y={148} fontSize="11" fill={INK} fontFamily="ui-sans-serif, system-ui">Apple grows  →  worth more</text>
        </g>
        <g>
          <circle cx={364} cy={166} r={4} fill={ROSE_LIGHT} />
          <text x={376} y={170} fontSize="11" fill={INK} fontFamily="ui-sans-serif, system-ui">Apple shrinks  →  worth less</text>
        </g>
      </svg>
    </Figure>
  );
}

// ────────────────────────────────────────────────────────────
// 2.  Permissible vs forbidden income sources
// ────────────────────────────────────────────────────────────
function IconBag(props: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${props.x}, ${props.y})`} stroke={props.color} fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M 3 5 L 13 5 L 14.5 14 L 1.5 14 Z" />
      <path d="M 6 5 V 3 a 2 2 0 0 1 4 0 V 5" />
    </g>
  );
}
function IconCog(props: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${props.x}, ${props.y})`} stroke={props.color} fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={8} cy={8} r={3} />
      <path d="M 8 1 V 3 M 8 13 V 15 M 1 8 H 3 M 13 8 H 15 M 3 3 L 4.5 4.5 M 11.5 11.5 L 13 13 M 3 13 L 4.5 11.5 M 11.5 4.5 L 13 3" />
    </g>
  );
}
function IconCode(props: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${props.x}, ${props.y})`} stroke={props.color} fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M 5 4 L 1 8 L 5 12" /><path d="M 11 4 L 15 8 L 11 12" /><path d="M 9 2 L 7 14" />
    </g>
  );
}
function IconHouse(props: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${props.x}, ${props.y})`} stroke={props.color} fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M 1 8 L 8 2 L 15 8 V 14 H 1 Z" /><path d="M 6 14 V 10 H 10 V 14" />
    </g>
  );
}
function IconBriefcase(props: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${props.x}, ${props.y})`} stroke={props.color} fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x={1} y={5} width={14} height={9} rx={1.5} /><path d="M 6 5 V 3 H 10 V 5" /><path d="M 1 9 H 15" />
    </g>
  );
}
function IconPercent(props: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${props.x}, ${props.y})`} stroke={props.color} fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <line x1={2} y1={14} x2={14} y2={2} /><circle cx={4} cy={4} r={2} /><circle cx={12} cy={12} r={2} />
    </g>
  );
}
function IconCup(props: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${props.x}, ${props.y})`} stroke={props.color} fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M 4 3 H 12 V 8 a 4 4 0 0 1 -8 0 Z" /><path d="M 6 14 H 10" /><path d="M 8 11 V 14" />
    </g>
  );
}
function IconDice(props: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${props.x}, ${props.y})`} stroke={props.color} fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x={2} y={2} width={12} height={12} rx={2} /><circle cx={5.5} cy={5.5} r={0.8} fill={props.color} /><circle cx={10.5} cy={10.5} r={0.8} fill={props.color} /><circle cx={8} cy={8} r={0.8} fill={props.color} />
    </g>
  );
}
function IconBank(props: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${props.x}, ${props.y})`} stroke={props.color} fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M 1 6 L 8 2 L 15 6" /><path d="M 3 6 V 13 M 7 6 V 13 M 9 6 V 13 M 13 6 V 13" /><path d="M 1 14 H 15" />
    </g>
  );
}
function IconCigarette(props: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${props.x}, ${props.y})`} stroke={props.color} fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x={1} y={10} width={11} height={2.5} /><line x1={3} y1={10} x2={3} y2={12.5} /><path d="M 4 5 q 0 -2 2 -2 q 2 0 2 -2" />
    </g>
  );
}

export function HalalHaramSourcesDiagram() {
  const halal = [
    { Icon: IconBag, label: "Selling products" },
    { Icon: IconBriefcase, label: "Selling services" },
    { Icon: IconCog, label: "Manufacturing" },
    { Icon: IconCode, label: "Software" },
    { Icon: IconHouse, label: "Real estate rentals" },
  ];
  const haram = [
    { Icon: IconPercent, label: "Interest (riba)" },
    { Icon: IconCup, label: "Alcohol" },
    { Icon: IconDice, label: "Gambling" },
    { Icon: IconBank, label: "Conventional banking" },
    { Icon: IconCigarette, label: "Tobacco / pork" },
  ];

  return (
    <Figure caption="A business is investable for Muslims when its core income comes from permissible sources. Most public companies earn a small amount of interest on their cash; the screener checks whether that amount stays within scholar-set limits.">
      <svg viewBox="0 0 560 280" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-2xl" role="img" aria-label="Two columns showing permissible and forbidden income sources for halal investing.">
        <defs><SoftShadow id="s2" /></defs>

        {/* Permissible card */}
        <g filter="url(#s2)">
          <rect x={16} y={20} width={258} height={240} rx={14} fill="white" stroke={HAIR} />
        </g>
        <rect x={16} y={20} width={4} height={240} rx={2} fill={EMERALD_LIGHT} />
        <text x={36} y={50} fontSize="10" fontWeight="700" fill={EMERALD} fontFamily="ui-sans-serif, system-ui" letterSpacing="0.08em">PERMISSIBLE</text>
        <text x={36} y={72} fontSize="20" fontWeight="700" fill={INK} fontFamily="Georgia, serif">Halal income</text>
        {halal.map((h, i) => (
          <g key={h.label}>
            <rect x={36} y={92 + i * 30} width={20} height={20} rx={5} fill={EMERALD_50} />
            <g transform={`translate(${38}, ${94 + i * 30})`}><h.Icon x={0} y={0} color={EMERALD} /></g>
            <text x={64} y={106 + i * 30} fontSize="13" fill={INK} fontFamily="ui-sans-serif, system-ui">{h.label}</text>
          </g>
        ))}

        {/* Forbidden card */}
        <g filter="url(#s2)">
          <rect x={286} y={20} width={258} height={240} rx={14} fill="white" stroke={HAIR} />
        </g>
        <rect x={286} y={20} width={4} height={240} rx={2} fill={ROSE_LIGHT} />
        <text x={306} y={50} fontSize="10" fontWeight="700" fill={ROSE} fontFamily="ui-sans-serif, system-ui" letterSpacing="0.08em">FORBIDDEN</text>
        <text x={306} y={72} fontSize="20" fontWeight="700" fill={INK} fontFamily="Georgia, serif">Haram income</text>
        {haram.map((h, i) => (
          <g key={h.label}>
            <rect x={306} y={92 + i * 30} width={20} height={20} rx={5} fill={ROSE_50} />
            <g transform={`translate(${308}, ${94 + i * 30})`}><h.Icon x={0} y={0} color={ROSE} /></g>
            <text x={334} y={106 + i * 30} fontSize="13" fill={INK} fontFamily="ui-sans-serif, system-ui">{h.label}</text>
          </g>
        ))}
      </svg>
    </Figure>
  );
}

// ────────────────────────────────────────────────────────────
// 3.  Scholar spectrum  (the headline visual)
// ────────────────────────────────────────────────────────────
export function ScholarSpectrumDiagram() {
  const scholars = [
    { initials: "ZT", name: "Strict",        verdict: "fail", note: "any debt rejected" },
    { initials: "MTU", name: "Mufti Taqi",   verdict: "fail", note: "illiquid floor not met" },
    { initials: "AA",  name: "AAOIFI",       verdict: "pass", note: "within all caps" },
    { initials: "DJ",  name: "DJIM",         verdict: "pass", note: "within all caps" },
    { initials: "JA",  name: "Ja'fari",      verdict: "pass", note: "khums on gains" },
  ];

  return (
    <Figure caption="Five scholarly methodologies, one stock — Amazon. Same business, same numbers, five different verdicts. The right answer depends on whose ruling you follow. Mizan ships all five plus a custom builder.">
      <svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-3xl" role="img" aria-label="Five scholars positioned along a strictness spectrum, each showing their verdict on Amazon stock.">
        <defs><SoftShadow id="s3" /></defs>

        {/* Header pill */}
        <g filter="url(#s3)">
          <rect x={260} y={16} width={200} height={42} rx={21} fill={NAVY} />
        </g>
        <text x={360} y={36} textAnchor="middle" fontSize="10" fontWeight="700" fill={GOLD_LIGHT} fontFamily="ui-sans-serif, system-ui" letterSpacing="0.12em">THE QUESTION</text>
        <text x={360} y={51} textAnchor="middle" fontSize="14" fontWeight="600" fill="white" fontFamily="Georgia, serif">Is AMZN halal?</text>

        {/* 5 scholar cards */}
        {scholars.map((s, i) => {
          const x = 20 + i * 138;
          const pass = s.verdict === "pass";
          return (
            <g key={s.initials}>
              <g filter="url(#s3)">
                <rect x={x} y={80} width={128} height={148} rx={12} fill="white" stroke={HAIR} />
              </g>
              {/* Top tint */}
              <rect x={x} y={80} width={128} height={48} rx={12} fill={pass ? EMERALD_50 : ROSE_50} />
              <rect x={x} y={116} width={128} height={12} fill={pass ? EMERALD_50 : ROSE_50} />
              {/* Initials avatar */}
              <circle cx={x + 64} cy={108} r={22} fill="white" stroke={pass ? EMERALD : ROSE} strokeWidth={1.5} />
              <text x={x + 64} y={114} textAnchor="middle" fontSize="13" fontWeight="700" fill={pass ? EMERALD : ROSE} fontFamily="ui-sans-serif, system-ui">{s.initials}</text>

              {/* Name */}
              <text x={x + 64} y={154} textAnchor="middle" fontSize="13" fontWeight="700" fill={INK} fontFamily="Georgia, serif">{s.name}</text>

              {/* Verdict pill */}
              <rect x={x + 32} y={166} width={64} height={22} rx={11} fill={pass ? EMERALD_LIGHT : ROSE_LIGHT} />
              <text x={x + 64} y={181} textAnchor="middle" fontSize="11" fontWeight="700" fill="white" fontFamily="ui-sans-serif, system-ui" letterSpacing="0.08em">{pass ? "PASS" : "FAIL"}</text>

              {/* Reason */}
              <text x={x + 64} y={210} textAnchor="middle" fontSize="10" fill={MUTED} fontFamily="ui-sans-serif, system-ui">
                <tspan x={x + 64} dy="0">{s.note}</tspan>
              </text>
            </g>
          );
        })}

        {/* Spectrum line */}
        <line x1={40} y1={266} x2={680} y2={266} stroke={NAVY_200} strokeWidth={2} strokeLinecap="round" />
        {scholars.map((_s, i) => {
          const x = 84 + i * 138;
          return <circle key={i} cx={x} cy={266} r={5} fill={NAVY} stroke="white" strokeWidth={2} />;
        })}
        <text x={40} y={290} fontSize="10" fontWeight="600" fill={MUTED} fontFamily="ui-sans-serif, system-ui" letterSpacing="0.06em">STRICTER</text>
        <text x={680} y={290} textAnchor="end" fontSize="10" fontWeight="600" fill={MUTED} fontFamily="ui-sans-serif, system-ui" letterSpacing="0.06em">MORE PERMISSIVE</text>
      </svg>
    </Figure>
  );
}

// ────────────────────────────────────────────────────────────
// 4.  The five ratios  (dashboard-style)
// ────────────────────────────────────────────────────────────
export function RatiosDiagram() {
  const rows = [
    { label: "Impermissible income / revenue", value: 2.8,  limit: 5,  unit: "%", passes: true,  scale: 12 },
    { label: "Interest-bearing debt / market cap", value: 6.5,  limit: 30, unit: "%", passes: true,  scale: 50 },
    { label: "Cash + securities / market cap", value: 18,   limit: 30, unit: "%", passes: true,  scale: 50 },
    { label: "Receivables / market cap", value: 3.1,  limit: 33, unit: "%", passes: true,  scale: 50 },
    { label: "Illiquid (real) assets / total", value: 12,   limit: 20, unit: "%", passes: false, scale: 60, minRule: true },
  ];

  return (
    <Figure caption="Halal screening checks five numbers per company. The bar is the company's actual value; the vertical mark is your scholar's threshold. The last rule (illiquid assets) is Mufti Taqi Usmani's unique requirement.">
      <svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-3xl" role="img" aria-label="Five horizontal ratio bars showing each financial check for the AMZN halal screen.">
        <defs><SoftShadow id="s4" /></defs>

        {/* Title strip */}
        <text x={28} y={32} fontSize="11" fontWeight="700" fill={NAVY} fontFamily="ui-sans-serif, system-ui" letterSpacing="0.08em">THE FIVE CHECKS  —  AMZN under AAOIFI</text>
        <line x1={28} y1={44} x2={690} y2={44} stroke={HAIR} />

        {rows.map((r, i) => {
          const y = 76 + i * 44;
          const barX = 320, barW = 320;
          const valuePct = Math.min(1, r.value / r.scale);
          const limitPct = Math.min(1, r.limit / r.scale);
          const valueW = valuePct * barW;
          const limitX = barX + limitPct * barW;
          return (
            <g key={r.label}>
              {/* Label */}
              <text x={28} y={y - 6} fontSize="12" fontWeight="600" fill={INK} fontFamily="ui-sans-serif, system-ui">{r.label}</text>
              {/* Sub */}
              <text x={28} y={y + 10} fontSize="10" fill={MUTED} fontFamily="ui-sans-serif, system-ui">
                {r.minRule ? `minimum ${r.limit}${r.unit}` : `cap ${r.limit}${r.unit}`}
              </text>

              {/* Track */}
              <rect x={barX} y={y - 6} width={barW} height={14} rx={7} fill="#F3F4F6" />
              {/* Value */}
              <rect x={barX} y={y - 6} width={valueW} height={14} rx={7}
                fill={r.passes ? EMERALD_LIGHT : ROSE_LIGHT} />
              {/* Threshold mark */}
              <line x1={limitX} y1={y - 12} x2={limitX} y2={y + 14} stroke={NAVY} strokeWidth={2} strokeLinecap="round" />
              <text x={limitX} y={y - 16} textAnchor="middle" fontSize="9" fontWeight="600" fill={NAVY} fontFamily="ui-sans-serif, system-ui">{r.limit}{r.unit}</text>

              {/* Value label */}
              <text x={660} y={y + 4} textAnchor="end" fontSize="14" fontWeight="700" fill={r.passes ? EMERALD : ROSE} fontFamily="ui-sans-serif, system-ui">{r.value}{r.unit}</text>

              {/* Row hairline */}
              {i < rows.length - 1 && <line x1={28} y1={y + 24} x2={690} y2={y + 24} stroke={HAIR} />}
            </g>
          );
        })}
      </svg>
    </Figure>
  );
}

// ────────────────────────────────────────────────────────────
// 5.  Purification flow
// ────────────────────────────────────────────────────────────
function IconHeart(props: { x: number; y: number; size: number; color: string }) {
  const { x, y, size, color } = props;
  const s = size / 24;
  return (
    <g transform={`translate(${x}, ${y}) scale(${s})`}>
      <path d="M 12 21 C 12 21 4 16 4 9 a 5 5 0 0 1 9 -3 a 5 5 0 0 1 9 3 c 0 7 -10 12 -10 12 z" fill={color} />
    </g>
  );
}

export function PurificationDiagram() {
  return (
    <Figure caption="Even halal stocks earn a small slice of impermissible income (mostly interest on company cash). When you receive a dividend, that small fraction must be donated to charity without expectation of reward. Mizan calculates it for you.">
      <svg viewBox="0 0 720 240" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-3xl" role="img" aria-label="Flow showing a $100 dividend splitting into a pure portion and an impure portion donated to charity.">
        <defs><SoftShadow id="s5" /></defs>

        {/* Step 1: Dividend */}
        <g filter="url(#s5)">
          <rect x={20} y={70} width={170} height={100} rx={14} fill={NAVY} />
        </g>
        <text x={105} y={94} textAnchor="middle" fontSize="10" fontWeight="700" fill={GOLD_LIGHT} fontFamily="ui-sans-serif, system-ui" letterSpacing="0.10em">YOUR DIVIDEND</text>
        <text x={105} y={132} textAnchor="middle" fontSize="34" fontWeight="700" fill="white" fontFamily="Georgia, serif">$100</text>
        <text x={105} y={156} textAnchor="middle" fontSize="10" fill="#94B1CB" fontFamily="ui-sans-serif, system-ui">paid by the company</text>

        {/* Arrow 1 */}
        <path d="M 200 120 Q 230 120 250 100" stroke={NAVY_200} strokeWidth={2} fill="none" strokeLinecap="round" />
        <path d="M 200 120 Q 230 120 250 140" stroke={NAVY_200} strokeWidth={2} fill="none" strokeLinecap="round" />

        {/* Pure portion */}
        <g filter="url(#s5)">
          <rect x={258} y={56} width={200} height={88} rx={12} fill="white" stroke={EMERALD} strokeWidth={1.5} />
        </g>
        <rect x={258} y={56} width={6} height={88} rx={3} fill={EMERALD_LIGHT} />
        <text x={278} y={80} fontSize="10" fontWeight="700" fill={EMERALD} fontFamily="ui-sans-serif, system-ui" letterSpacing="0.08em">PURE PORTION</text>
        <text x={278} y={112} fontSize="26" fontWeight="700" fill={INK} fontFamily="Georgia, serif">$97.20</text>
        <text x={278} y={130} fontSize="10" fill={MUTED} fontFamily="ui-sans-serif, system-ui">stays with you</text>

        {/* Impure portion */}
        <g filter="url(#s5)">
          <rect x={258} y={152} width={200} height={68} rx={12} fill={AMBER_50} stroke={AMBER} strokeWidth={1} />
        </g>
        <rect x={258} y={152} width={6} height={68} rx={3} fill={AMBER} />
        <text x={278} y={172} fontSize="10" fontWeight="700" fill={AMBER} fontFamily="ui-sans-serif, system-ui" letterSpacing="0.08em">IMPURE 2.8%</text>
        <text x={278} y={196} fontSize="18" fontWeight="700" fill={AMBER} fontFamily="Georgia, serif">$2.80</text>
        <text x={278} y={212} fontSize="10" fill={MUTED} fontFamily="ui-sans-serif, system-ui">— donate to charity</text>

        {/* Arrow to charity */}
        <path d="M 464 186 Q 500 186 520 170" stroke={AMBER} strokeWidth={1.5} fill="none" strokeLinecap="round" />
        <path d="M 514 165 L 524 168 L 518 175 Z" fill={AMBER} />

        {/* Charity */}
        <g filter="url(#s5)">
          <rect x={530} y={70} width={170} height={140} rx={14} fill={GOLD_50} stroke={GOLD} strokeWidth={1} />
        </g>
        <IconHeart x={581} y={92} size={68} color={GOLD} />
        <text x={615} y={184} textAnchor="middle" fontSize="13" fontWeight="700" fill={GOLD} fontFamily="Georgia, serif">Charity</text>
        <text x={615} y={200} textAnchor="middle" fontSize="9" fill={MUTED} fontFamily="ui-sans-serif, system-ui">no reward expected</text>
      </svg>
    </Figure>
  );
}

// ────────────────────────────────────────────────────────────
// 6.  Zakat — donut chart + flow to charity
// ────────────────────────────────────────────────────────────
export function ZakatDiagram() {
  // Donut: outer R=80, inner r=52
  const cx = 130, cy = 130, R = 80, r = 52;

  // Compute 2.5% wedge path
  const pct = 0.025;
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + 2 * Math.PI * pct;
  const sx = cx + R * Math.cos(startAngle), sy = cy + R * Math.sin(startAngle);
  const ex = cx + R * Math.cos(endAngle), ey = cy + R * Math.sin(endAngle);
  const isx = cx + r * Math.cos(endAngle), isy = cy + r * Math.sin(endAngle);
  const iex = cx + r * Math.cos(startAngle), iey = cy + r * Math.sin(startAngle);
  const wedge = `M ${sx} ${sy} A ${R} ${R} 0 0 1 ${ex} ${ey} L ${isx} ${isy} A ${r} ${r} 0 0 0 ${iex} ${iey} Z`;

  return (
    <Figure caption="Zakat is a separate religious obligation — 2.5% of your net zakatable wealth (above the nisab threshold) paid annually to charity. Mizan's calculator handles cash, stocks, gold, silver, and crypto.">
      <svg viewBox="0 0 720 280" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-3xl" role="img" aria-label="Donut chart with a 2.5% slice highlighted in gold, flowing to a charity icon.">
        <defs><SoftShadow id="s6" /></defs>

        {/* Donut ring (rest) */}
        <circle cx={cx} cy={cy} r={(R + r) / 2} fill="none" stroke={NAVY} strokeWidth={R - r} />
        {/* Wedge */}
        <path d={wedge} fill={GOLD_LIGHT} stroke={GOLD} strokeWidth={0.5} />

        {/* Center text */}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="10" fontWeight="700" fill={MUTED} fontFamily="ui-sans-serif, system-ui" letterSpacing="0.10em">YOUR WEALTH</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="12" fill={MUTED} fontFamily="ui-sans-serif, system-ui">above nisab</text>

        {/* Callout to slice */}
        <line x1={cx + 4} y1={cy - R} x2={cx + 80} y2={cy - R - 20} stroke={GOLD} strokeWidth={1.5} />
        <circle cx={cx + 4} cy={cy - R} r={3} fill={GOLD} />
        <text x={cx + 88} y={cy - R - 22} fontSize="11" fontWeight="700" fill={GOLD} fontFamily="ui-sans-serif, system-ui" letterSpacing="0.05em">2.5%</text>
        <text x={cx + 88} y={cy - R - 8} fontSize="11" fill={NAVY} fontFamily="ui-sans-serif, system-ui">— your zakat</text>

        {/* Arrow to charity */}
        <path d="M 250 140 Q 360 140 400 130" stroke={NAVY} strokeWidth={2} fill="none" strokeLinecap="round" strokeDasharray="6 6" />
        <path d="M 395 124 L 410 132 L 398 138 Z" fill={NAVY} />

        {/* Charity card */}
        <g filter="url(#s6)">
          <rect x={420} y={50} width={260} height={180} rx={14} fill={GOLD_50} stroke={GOLD} />
        </g>
        <rect x={420} y={50} width={4} height={180} rx={2} fill={GOLD} />
        <text x={440} y={84} fontSize="10" fontWeight="700" fill={GOLD} fontFamily="ui-sans-serif, system-ui" letterSpacing="0.10em">ANNUALLY</text>
        <text x={440} y={120} fontSize="22" fontWeight="700" fill={NAVY} fontFamily="Georgia, serif">Paid to charity</text>
        <IconHeart x={440} y={140} size={42} color={GOLD} />
        <text x={494} y={170} fontSize="11" fill={INK} fontFamily="ui-sans-serif, system-ui">On your zakat anniversary</text>
        <text x={494} y={186} fontSize="11" fill={INK} fontFamily="ui-sans-serif, system-ui">(one lunar year after nisab)</text>
        <text x={440} y={216} fontSize="10" fontStyle="italic" fill={MUTED} fontFamily="ui-sans-serif, system-ui">Mizan&apos;s /zakat calculator handles the math.</text>
      </svg>
    </Figure>
  );
}

// ────────────────────────────────────────────────────────────
// Figure shell — consistent across all six
// ────────────────────────────────────────────────────────────
function Figure({ children, caption }: { children: React.ReactNode; caption: string }) {
  return (
    <figure className="my-8 overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="bg-gradient-to-br from-white to-gray-50 px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto flex w-full justify-center">{children}</div>
      </div>
      <figcaption className="border-t border-gray-100 bg-gray-50/60 px-5 py-3 text-center text-xs leading-5 italic text-gray-600">
        {caption}
      </figcaption>
    </figure>
  );
}
