"use client";

import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";

export default function RouteMotion({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={reduce ? false : { opacity: 0, y: 10, filter: "blur(5px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={reduce ? { opacity: 1 } : { opacity: 0, y: -6, filter: "blur(3px)" }}
          className="min-h-[100dvh]"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </MotionConfig>
  );
}
