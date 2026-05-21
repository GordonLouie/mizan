import type { RatioCheck } from "@/lib/types";
import { RATIO_DEFINITIONS } from "@/lib/ratioGlossary";
import Tooltip from "./Tooltip";

interface Props {
  check: RatioCheck;
}

export default function RatioBar({ check }: Props) {
  const def = RATIO_DEFINITIONS[check.label];

  if (check.threshold === null) {
    return (
      <div className="rounded-md border border-gray-200 bg-white p-3 text-sm text-gray-500">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-gray-700">{check.label}</span>
          {def && <Tooltip text={def} />}
        </div>
        <div className="text-xs italic">Not screened under this standard.</div>
      </div>
    );
  }

  const scaleMax = Math.max(check.threshold * 1.5, check.value * 1.1, 5);
  const valuePct = Math.min(100, (check.value / scaleMax) * 100);
  const thresholdPct = Math.min(100, (check.threshold / scaleMax) * 100);
  const barColor = check.passes ? "bg-emerald-500" : "bg-rose-500";

  return (
    <div className="rounded-md border border-gray-200 bg-white p-3">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-gray-800">{check.label}</span>
          {def && <Tooltip text={def} />}
        </div>
        <div
          className={
            "rounded px-2 py-0.5 text-xs font-semibold " +
            (check.passes ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700")
          }
        >
          {check.passes ? "PASS" : "FAIL"}
        </div>
      </div>
      <div className="relative mt-2 h-2 rounded-full bg-gray-100">
        <div className={"absolute left-0 top-0 h-full rounded-full " + barColor} style={{ width: `${valuePct}%` }} />
        <div className="absolute top-[-2px] h-3 w-0.5 bg-gray-700" style={{ left: `${thresholdPct}%` }} title={`Threshold ${check.threshold}%`} />
      </div>
      <div className="mt-1 flex items-center justify-between text-xs text-gray-600">
        <span>
          Value: <span className="font-medium">{check.value.toFixed(2)}%</span>
        </span>
        <span>
          {check.direction === "max" ? "Max" : "Min"} allowed:{" "}
          <span className="font-medium">{check.threshold}%</span>
        </span>
      </div>
      <div className="mt-1 text-xs text-gray-500">{check.explanation}</div>
    </div>
  );
}
