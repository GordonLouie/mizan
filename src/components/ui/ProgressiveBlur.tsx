/**
 * ProgressiveBlur — stacked semi-transparent layers with increasing backdrop
 * blur, masked by a directional gradient. The effect is a soft "fade-to-blur"
 * edge — used on marquees so the leading and trailing items dissolve instead
 * of being abruptly clipped.
 *
 * Adapted from a 21st.dev community pattern (motion/react variant) and
 * standardised on framer-motion.
 */

"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

const GRADIENT_ANGLES = { top: 0, right: 90, bottom: 180, left: 270 } as const;

type Direction = keyof typeof GRADIENT_ANGLES;

export type ProgressiveBlurProps = {
  direction?: Direction;
  blurLayers?: number;
  className?: string;
  blurIntensity?: number;
} & HTMLMotionProps<"div">;

function joinClass(...parts: (string | undefined | false | null)[]): string {
  return parts.filter(Boolean).join(" ");
}

export function ProgressiveBlur({
  direction = "bottom",
  blurLayers = 8,
  className,
  blurIntensity = 0.25,
  ...props
}: ProgressiveBlurProps) {
  const layers = Math.max(blurLayers, 2);
  const segmentSize = 1 / (blurLayers + 1);

  return (
    <div className={joinClass("relative", className)}>
      {Array.from({ length: layers }).map((_, index) => {
        const angle = GRADIENT_ANGLES[direction];
        const stops = [
          index * segmentSize,
          (index + 1) * segmentSize,
          (index + 2) * segmentSize,
          (index + 3) * segmentSize,
        ]
          .map(
            (pos, posIndex) =>
              `rgba(255,255,255,${posIndex === 1 || posIndex === 2 ? 1 : 0}) ${pos * 100}%`,
          )
          .join(", ");
        const gradient = `linear-gradient(${angle}deg, ${stops})`;
        return (
          <motion.div
            key={index}
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{
              maskImage: gradient,
              WebkitMaskImage: gradient,
              backdropFilter: `blur(${index * blurIntensity}px)`,
            }}
            {...props}
          />
        );
      })}
    </div>
  );
}
