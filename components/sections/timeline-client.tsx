'use client';

import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { useRef } from 'react';
import type { TimelineKind } from '@/content/timeline';
import { cn } from '@/lib/utils';

export interface TimelineItem {
  id: string;
  kind: TimelineKind;
  period: string;
  title: string;
  org: string;
  description: string;
}

interface TimelineClientProps {
  items: readonly TimelineItem[];
}

export function TimelineClient({ items }: TimelineClientProps) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 70%'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <ol ref={ref} className="relative ml-2 border-l border-zinc-200 dark:border-zinc-800">
      <motion.span
        aria-hidden
        data-testid="timeline-line"
        style={{ scaleY: reduce ? 1 : scaleY }}
        className="absolute -left-px top-0 h-full w-px origin-top bg-orange-600 motion-reduce:!transform-none dark:bg-orange-500"
      />
      {items.map((item) => (
        <motion.li
          key={item.id}
          data-testid="timeline-item"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative pb-14 pl-8 last:pb-0 motion-reduce:!transform-none motion-reduce:!opacity-100 md:pl-12"
        >
          <span
            aria-hidden
            className={cn(
              'absolute -left-[5px] top-2 size-2.5 rounded-full border bg-white dark:bg-zinc-950',
              item.kind === 'milestone'
                ? 'border-orange-600 bg-orange-600 dark:border-orange-500 dark:bg-orange-500'
                : 'border-zinc-400 dark:border-zinc-600',
            )}
          />
          <p className="font-mono text-xs uppercase tracking-wide text-zinc-500">{item.period}</p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight">{item.title}</h3>
          <p className="mt-1 text-sm font-medium text-zinc-500">{item.org}</p>
          <p className="mt-3 max-w-xl leading-relaxed text-zinc-500">{item.description}</p>
        </motion.li>
      ))}
    </ol>
  );
}
