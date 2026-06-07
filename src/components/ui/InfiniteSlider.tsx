/**
 * InfiniteSlider — auto-scrolling marquee.
 *
 * Doubles its children and animates a translate so the row appears to scroll
 * forever. Direction + reverse + hover-slow are supported.
 *
 * Adapted from a 21st.dev community pattern (ibelick/infinite-slider) and
 * standardised on framer-motion so we don't pull in two motion libs.
 */

"use client";

import { useState, useEffect, type ReactNode } from "react";
import { animate, motion, useMotionValue } from "framer-motion";
import useMeasure from "react-use-measure";

interface InfiniteSliderProps {
  children: ReactNode;
  gap?: number;
  duration?: number;
  durationOnHover?: number;
  direction?: "horizontal" | "vertical";
  reverse?: boolean;
  className?: string;
}

export function InfiniteSlider({
  children,
  gap = 16,
  duration = 25,
  durationOnHover,
  direction = "horizontal",
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const [currentDuration, setCurrentDuration] = useState(duration);
  const [ref, { width, height }] = useMeasure();
  const translation = useMotionValue(0);
  const [hovering, setHovering] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const size = direction === "horizontal" ? width : height;
    const segment = size + gap;
    if (segment <= 0) return;
    const from = reverse ? -segment / 2 : 0;
    const to = reverse ? 0 : -segment / 2;

    let controls;
    if (hovering && durationOnHover) {
      controls = animate(translation, [translation.get(), to], {
        ease: "linear",
        duration:
          currentDuration *
          Math.abs((translation.get() - to) / segment),
        onComplete: () => {
          setHovering(false);
          setKey((k) => k + 1);
        },
      });
    } else {
      controls = animate(translation, [from, to], {
        ease: "linear",
        duration: currentDuration,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0,
        onRepeat: () => translation.set(from),
      });
    }
    return () => controls?.stop();
  }, [
    key, translation, currentDuration, width, height, gap,
    hovering, direction, reverse, durationOnHover,
  ]);

  const hoverProps = durationOnHover
    ? {
        onHoverStart: () => {
          setHovering(true);
          setCurrentDuration(durationOnHover);
        },
        onHoverEnd: () => {
          setHovering(true);
          setCurrentDuration(duration);
        },
      }
    : {};

  return (
    <div className={"overflow-hidden " + (className ?? "")}>
      <motion.div
        ref={ref}
        className="flex w-max"
        style={{
          ...(direction === "horizontal"
            ? { x: translation }
            : { y: translation }),
          gap: `${gap}px`,
          flexDirection: direction === "horizontal" ? "row" : "column",
        }}
        {...hoverProps}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
