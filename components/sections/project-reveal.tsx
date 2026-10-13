"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ProjectRevealProps {
  children: ReactNode;
  index: number;
  className?: string;
}

// O observer fica num wrapper sem clip-path: o Chromium ignora elementos
// com circle(0%) no IntersectionObserver e o reveal nunca dispararia.
export function ProjectReveal({
  children,
  index,
  className,
}: ProjectRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });

  return (
    <div ref={ref} className="h-full">
      <motion.article
        data-testid="project-card"
        initial={{ clipPath: "circle(0% at 12% 100%)" }}
        animate={{
          clipPath: inView
            ? "circle(150% at 12% 100%)"
            : "circle(0% at 12% 100%)",
        }}
        transition={{
          duration: 0.9,
          delay: (index % 3) * 0.08,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={cn(
          "motion-reduce:[clip-path:none]! noscript:[clip-path:none]!",
          className,
        )}
      >
        {children}
      </motion.article>
    </div>
  );
}
