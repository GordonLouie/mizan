/**
 * ContainerScroll — scroll-driven iPad reveal.
 *
 * As the user scrolls into the container, the device rotates from a tilted
 * angle to flat and scales slightly. The chrome is rendered to look like
 * an actual iPad: matte aluminium frame, fine inner bezel, camera notch,
 * subtle screen glare. The inner content area is cream so the embedded
 * HalalGauge UI sits naturally inside it.
 */

"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

interface ContainerScrollProps {
  titleComponent: ReactNode;
  children: ReactNode;
}

export function ContainerScroll({ titleComponent, children }: ContainerScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? [0.72, 0.94] : [1.02, 1],
  );
  const translate = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <div
      ref={containerRef}
      className="relative flex h-[60rem] items-center justify-center px-4 sm:px-8 md:h-[80rem] md:px-12"
    >
      <div className="relative w-full py-10 md:py-32" style={{ perspective: "1200px" }}>
        <Header translate={translate}>{titleComponent}</Header>
        <Device rotate={rotate} scale={scale}>
          {children}
        </Device>
      </div>
    </div>
  );
}

function Header({
  translate,
  children,
}: {
  translate: MotionValue<number>;
  children: ReactNode;
}) {
  return (
    <motion.div
      style={{ translateY: translate }}
      className="mx-auto max-w-3xl px-4 text-center"
    >
      {children}
    </motion.div>
  );
}

/**
 * iPad-style chrome. Layers from outside in:
 *   1. Matte aluminium body — dark charcoal with a faint vertical gradient
 *   2. Fine inner bezel ring — slightly lighter to suggest reflectivity
 *   3. Black bezel — the actual screen border
 *   4. Cream content area where HalalGauge's UI lives
 *   5. Front camera dot at top center
 *   6. Subtle glare overlay across the top of the screen
 */
function Device({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  children: ReactNode;
}) {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.04) inset, " +
          "0 30px 60px -20px rgba(0,0,0,0.45), " +
          "0 80px 120px -30px rgba(0,0,0,0.30), " +
          "0 0 0 1px rgba(0,0,0,0.5)",
        background:
          "linear-gradient(180deg, #2a2c2f 0%, #1a1c1e 50%, #232527 100%)",
      }}
      className="relative mx-auto mt-10 aspect-[16/10.5] w-full max-w-5xl rounded-[36px] p-[10px] md:p-[14px]"
    >
      {/* Camera dot */}
      <div
        aria-hidden
        className="absolute left-1/2 top-[8px] z-20 -translate-x-1/2 rounded-full bg-black md:top-[10px]"
        style={{
          width: 7,
          height: 7,
          boxShadow:
            "inset 0 0 0 1px rgba(255,255,255,0.06), 0 0 6px rgba(0,0,0,0.4)",
        }}
      />

      {/* Inner reflective ring */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[6px] rounded-[30px]"
        style={{
          boxShadow:
            "inset 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      />

      {/* Black bezel */}
      <div className="h-full w-full overflow-hidden rounded-[26px] bg-black p-[6px] md:p-[8px]">
        {/* Screen content area */}
        <div className="relative h-full w-full overflow-hidden rounded-[20px] bg-[#F5F6F3]">
          {children}

          {/* Soft top-glare overlay — keep below content scroll, above bg */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-1/3"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 100%)",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
