/**
 * ContainerScroll — scroll-driven 3D card reveal.
 *
 * As the user scrolls into the container, the inner card rotates from
 * a tilted angle to flat, scales slightly, and the title translates up.
 * Adapted from a 21st.dev community pattern (Aceternity UI) and tuned
 * for Mizan's editorial chrome: navy border, off-white inner bg.
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

  const rotate = useTransform(scrollYProgress, [0, 1], [22, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? [0.75, 0.95] : [1.04, 1],
  );
  const translate = useTransform(scrollYProgress, [0, 1], [0, -90]);

  return (
    <div
      ref={containerRef}
      className="relative flex h-[60rem] items-center justify-center p-2 md:h-[80rem] md:p-20"
    >
      <div className="relative w-full py-10 md:py-40" style={{ perspective: "1000px" }}>
        <Header translate={translate}>{titleComponent}</Header>
        <Card rotate={rotate} scale={scale}>{children}</Card>
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
      className="mx-auto max-w-5xl text-center"
    >
      {children}
    </motion.div>
  );
}

function Card({
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
          "0 0 #0000004d, 0 9px 20px #0000001f, 0 37px 37px #00000017, 0 84px 50px #00000010, 0 149px 60px #00000004",
      }}
      className="-mt-12 mx-auto h-[30rem] w-full max-w-5xl rounded-[30px] border-4 border-navy-800/80 bg-navy-900 p-2 shadow-2xl md:h-[40rem] md:p-4"
    >
      <div className="h-full w-full overflow-hidden rounded-2xl bg-[#FAF7F0]">
        {children}
      </div>
    </motion.div>
  );
}
