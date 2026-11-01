"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import type { ReactNode } from "react";

interface ProjectMediaProps {
  children: ReactNode;
}

export function ProjectMedia({ children }: ProjectMediaProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-10, 10]);

  return (
    <div ref={ref} className="absolute inset-0">
      <motion.div
        style={{ y }}
        className="absolute inset-x-0 -inset-y-6 motion-reduce:transform-none! noscript:transform-none!"
      >
        <div className="relative size-full transition-transform duration-500 ease-out group-hover:-translate-y-3 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
