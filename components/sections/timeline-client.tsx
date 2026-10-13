"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import type { TimelineKind } from "@/content/timeline";
import { cn } from "@/lib/utils";

export interface TimelineItem {
  id: string;
  kind: TimelineKind;
  year: string;
  index: number;
  period: string;
  title: string;
  org: string;
  description: string;
}

interface TimelineClientProps {
  items: readonly TimelineItem[];
}

export function TimelineClient({ items }: TimelineClientProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 70%"],
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  // Servidor e cliente renderizam o mesmo estilo inicial (evita erro de hidratação, pois
  // useReducedMotion é null no servidor). Reduced motion e sem JS são cobertos pelos overrides
  // CSS motion-reduce:* / noscript:*.
  // Linha única: absoluta no wrapper, alinhada à borda esquerda da coluna de conteúdo
  // (md: col 4 de 12 com gap-8 => 25% + 0.5rem; mobile: borda em left-0).
  return (
    <div ref={ref} className="relative">
      <motion.span
        aria-hidden
        data-testid="timeline-line"
        style={{ scaleY }}
        className="absolute left-0 top-0 z-10 h-full w-px origin-top bg-signal motion-reduce:!transform-none noscript:!transform-none md:left-[calc(25%+0.5rem)]"
      />
      <ol>
        {items.map((item) => (
          <motion.li
            key={item.id}
            data-testid="timeline-item"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="grid md:grid-cols-12 md:gap-8 motion-reduce:!transform-none motion-reduce:!opacity-100 noscript:!transform-none noscript:!opacity-100"
          >
            <div className="pt-10 md:col-span-3 md:pb-10">
              <p
                data-testid="timeline-year"
                className="font-display text-6xl leading-none tracking-tight md:sticky md:top-28 md:text-7xl"
              >
                {item.year}
              </p>
            </div>
            <div
              data-testid="timeline-content"
              className="relative mt-4 border-l border-border pb-10 pl-8 pt-2 md:col-span-9 md:mt-0 md:pl-12 md:pt-10"
            >
              <span
                aria-hidden
                className={cn(
                  "absolute -left-1.5 top-4 size-3 rounded-full border bg-background md:top-12",
                  item.kind === "milestone"
                    ? "border-signal bg-signal"
                    : "border-foreground",
                )}
              />
              <span
                aria-hidden
                className="absolute right-0 top-10 hidden size-12 items-center justify-center rounded-full border border-border font-mono text-xs text-muted-foreground md:flex"
              >
                {String(item.index + 1).padStart(2, "0")}
              </span>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {item.period}
              </p>
              <h3 className="mt-2 font-display text-3xl tracking-tight md:text-4xl">
                {item.title}
              </h3>
              <p className="mt-1 text-sm font-medium text-muted-foreground">
                {item.org}
              </p>
              <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground md:pr-20">
                {item.description}
              </p>
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
