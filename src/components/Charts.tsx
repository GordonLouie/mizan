"use client";

import React from "react";

// ───── Color palette ─────
// Forest replacements (token names kept for compatibility).
const NAVY = "#1C4537";       // forest 800
const NAVY_LIGHT = "#5F9D7E"; // forest 400
const NAVY_50 = "#F1F7F3";    // forest 50
const GOLD = "#A87620";       // amber 600
const GOLD_LIGHT = "#C89030"; // amber 500
const EMERALD = "#16A34A";
const ROSE = "#DC2626";
const AMBER = "#D97706";
const INK = "#0F172A";
const MUTED = "#64748B";
const HAIR = "#E2E8F0";

// Sector palette — coordinated, not rainbow. Updated to harmonise with the
// Forest brand (warm earths + cool greens + muted blues, no AI-purple).
export const SECTOR_COLORS: Record<string, string> = {
  Technology: "#1C4537",            // forest primary
  Healthcare: "#0E7C5A",            // teal-green
  "Financial Services": "#7B7E8A",  // neutral slate
  "Consumer Discretionary": "#B85C3F", // terracotta
  "Consumer Staples": "#A36F4E",    // clay
  Energy: "#A87620",                // amber
  Industrials: "#5F9D7E",           // forest mid
  "Communication Services": "#5A6E8F", // muted blue
  Utilities: "#4A6E4A",
  Materials: "#9C7B5A",
  "Real Estate": "#A07060",
  Automotive: "#3D6C95",            // muted blue
  ETF: "#26543F",                   // forest 700
  Other: "#94A3B8",
};

export function sectorColor(s: string): string {
  return SECTOR_COLORS[s] ?? SECTOR_COLORS.Other;
}

// ───────────────────────────────────────────────
// ProgressRing — circular percentage indicator
// ───────────────────────────────────────────────
export function ProgressRing({
  percent,
  size = 200,
  thickness = 14,
  color = NAVY,
  trackColor = HAIR,
  label,
  sublabel,
}: {
  percent: number;          // 0-100
  size?: number;
  thickness?: number;
  color?: string;
  trackColor?: string;
  label?: string;
  sublabel?: string;
}) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.max(0, Math.min(100, percent)) / 100) * c;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={thickness} />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={thickness}
          strokeDasharray={c} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
        {(() => {
          const text = label ?? `${Math.round(percent)}%`;
          // Scale font down for longer / non-numeric labels
          const isShortNumeric = /^[$\d,.%\s]+$/.test(text) && text.length <= 8;
          const fontSize = isShortNumeric ? size * 0.22 : size * 0.13;
          return (
            <div
              className="font-bold text-gray-900 tabular-nums text-center"
              style={{ fontFamily: "var(--font-display)", fontSize, lineHeight: 1.05 }}
            >
              {text}
            </div>
          );
        })()}
        {sublabel && <div className="mt-1 max-w-[85%] text-center text-[11px] font-medium uppercase tracking-widest text-gray-500">{sublabel}</div>}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────
// DonutChart — multi-segment donut with center text
// ───────────────────────────────────────────────
export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

export function DonutChart({
  segments,
  size = 260,
  thickness = 28,
  centerLabel,
  centerSublabel,
}: {
  segments: DonutSegment[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerSublabel?: string;
}) {
  const cx = size / 2, cy = size / 2;
  const r = (size - thickness) / 2;
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;

  let acc = 0;
  const arcs = segments.map((seg, i) => {
    const startAngle = (acc / total) * 2 * Math.PI - Math.PI / 2;
    acc += seg.value;
    const endAngle = (acc / total) * 2 * Math.PI - Math.PI / 2;

    const sx = cx + r * Math.cos(startAngle);
    const sy = cy + r * Math.sin(startAngle);
    const ex = cx + r * Math.cos(endAngle);
    const ey = cy + r * Math.sin(endAngle);
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

    const path = `M ${sx} ${sy} A ${r} ${r} 0 ${largeArc} 1 ${ex} ${ey}`;
    return (
      <path key={i} d={path} fill="none" stroke={seg.color} strokeWidth={thickness}
        opacity={0.92} strokeLinecap="butt" />
    );
  });

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={HAIR} strokeWidth={thickness} />
        {arcs}
      </svg>
      {(centerLabel || centerSublabel) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {centerLabel && (
            <div className="font-bold text-gray-900 tabular-nums" style={{ fontFamily: "var(--font-display)", fontSize: size * 0.16 }}>
              {centerLabel}
            </div>
          )}
          {centerSublabel && (
            <div className="mt-0.5 max-w-[70%] text-[10px] font-medium uppercase tracking-widest text-gray-500">
              {centerSublabel}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function DonutLegend({ segments, totalLabel }: { segments: DonutSegment[]; totalLabel?: string }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  return (
    <ul className="space-y-2">
      {segments.map((s, i) => (
        <li key={i} className="flex items-center gap-2 text-xs">
          <span className="inline-block h-2.5 w-2.5 flex-shrink-0 rounded-sm" style={{ backgroundColor: s.color }} />
          <span className="flex-1 truncate text-gray-700">{s.label}</span>
          <span className="tabular-nums text-gray-500">{((s.value / total) * 100).toFixed(1)}%</span>
        </li>
      ))}
      {totalLabel && (
        <li className="border-t border-gray-100 pt-2 text-xs text-gray-500">
          {totalLabel}
        </li>
      )}
    </ul>
  );
}

// ───────────────────────────────────────────────
// HorizontalBars — sector/category breakdown
// ───────────────────────────────────────────────
export function HorizontalBars({
  items,
  maxLabelChars = 28,
}: {
  items: { label: string; value: number; color?: string }[];
  maxLabelChars?: number;
}) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="space-y-3">
      {items.map((it, i) => {
        const pct = (it.value / max) * 100;
        return (
          <li key={i}>
            <div className="flex items-baseline justify-between text-xs">
              <span className="truncate text-gray-800" title={it.label}>
                {it.label.length > maxLabelChars ? it.label.slice(0, maxLabelChars - 1) + "…" : it.label}
              </span>
              <span className="ml-2 tabular-nums text-gray-500">{it.value.toFixed(1)}%</span>
            </div>
            <div className="mt-1 h-1.5 w-full rounded-full bg-gray-100">
              <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: it.color ?? NAVY_LIGHT, transition: "width 0.5s ease-out" }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// ───────────────────────────────────────────────
// LineChart — portfolio value vs benchmarks
// ───────────────────────────────────────────────
export interface LineSeries {
  label: string;
  color: string;
  data: number[];   // y values, normalized to 100 at index 0 is typical
  bold?: boolean;
}

export function LineChart({
  series,
  labels,
  height = 260,
}: {
  series: LineSeries[];
  labels: string[]; // x-axis labels (one per data point)
  height?: number;
}) {
  const w = 720, h = height, padL = 40, padR = 16, padT = 20, padB = 26;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;

  const allVals = series.flatMap((s) => s.data);
  const minY = Math.min(...allVals);
  const maxY = Math.max(...allVals);
  const range = maxY - minY || 1;

  const x = (i: number) => padL + (i / Math.max(1, labels.length - 1)) * innerW;
  const y = (v: number) => padT + innerH - ((v - minY) / range) * innerH;

  // Y-axis grid lines (4 lines)
  const gridLines = 4;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img">
      {/* Grid */}
      {Array.from({ length: gridLines + 1 }).map((_, i) => {
        const yy = padT + (i / gridLines) * innerH;
        const v = maxY - (i / gridLines) * range;
        return (
          <g key={i}>
            <line x1={padL} y1={yy} x2={w - padR} y2={yy} stroke={HAIR} strokeWidth={0.5} />
            <text x={padL - 6} y={yy + 3} textAnchor="end" fontSize="10" fill={MUTED} fontFamily="ui-sans-serif" style={{ fontVariantNumeric: "tabular-nums" }}>
              {v.toFixed(0)}
            </text>
          </g>
        );
      })}

      {/* X-axis labels (show ~6 evenly spaced) */}
      {labels.map((lbl, i) => {
        const step = Math.ceil(labels.length / 6);
        if (i % step !== 0 && i !== labels.length - 1) return null;
        return (
          <text key={i} x={x(i)} y={h - 8} textAnchor="middle" fontSize="10" fill={MUTED} fontFamily="ui-sans-serif">
            {lbl}
          </text>
        );
      })}

      {/* Series */}
      {series.map((s, idx) => {
        const d = s.data.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(v)}`).join(" ");
        return (
          <path key={idx} d={d} fill="none" stroke={s.color} strokeWidth={s.bold ? 2.2 : 1.4} strokeLinecap="round" strokeLinejoin="round" />
        );
      })}
    </svg>
  );
}

export function LineLegend({ series }: { series: LineSeries[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
      {series.map((s, i) => (
        <li key={i} className="flex items-center gap-2">
          <span className="inline-block h-0.5 w-6" style={{ backgroundColor: s.color }} />
          <span className={s.bold ? "font-semibold text-gray-900" : "text-gray-600"}>{s.label}</span>
        </li>
      ))}
    </ul>
  );
}
