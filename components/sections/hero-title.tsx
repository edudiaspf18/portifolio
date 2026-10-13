'use client';

import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

interface HeroTitleProps {
  lead: string;
  focus: string;
  keyword: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

interface WordProps {
  text: string;
  index: number;
  italic?: boolean;
}

function Word({ text, index, italic = false }: WordProps) {
  const reduce = useReducedMotion();
  return (
    <span className="inline-block overflow-hidden pb-[0.14em] pr-[0.08em] align-bottom">
      <motion.span
        data-testid="hero-word"
        initial={reduce ? false : { y: '110%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay: 0.15 + index * 0.07, ease: EASE }}
        className={cn('inline-block motion-reduce:!transform-none noscript:!transform-none', italic && 'italic')}
      >
        {text}
      </motion.span>
    </span>
  );
}

export function HeroTitle({ lead, focus, keyword }: HeroTitleProps) {
  const reduce = useReducedMotion();
  const leadWords = lead.split(' ');
  const focusWords = focus.split(' ');
  const offset = leadWords.length;
  const keyIndex = offset + focusWords.length;

  return (
    <h1 className="font-display text-[clamp(3.25rem,11vw,9.5rem)] leading-[0.95] tracking-tight">
      {leadWords.map((word, i) => (
        <span key={`l-${i}`}>
          <Word text={word} index={i} />{' '}
        </span>
      ))}
      <br className="hidden md:block" />
      {focusWords.map((word, i) => (
        <span key={`f-${i}`}>
          <Word text={word} index={offset + i} italic />{' '}
        </span>
      ))}
      <span className="relative inline-block">
        <Word text={keyword} index={keyIndex} italic />
        <svg
          aria-hidden
          viewBox="0 0 200 12"
          preserveAspectRatio="none"
          className="absolute -bottom-1 left-0 h-3 w-full text-signal md:h-4"
        >
          <motion.path
            data-testid="hero-underline"
            d="M2 8 C 40 2, 90 12, 130 6 S 190 4, 198 7"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, delay: 0.15 + keyIndex * 0.07 + 0.4, ease: EASE }}
            className="motion-reduce:![stroke-dasharray:none] noscript:![stroke-dasharray:none]"
          />
        </svg>
      </span>
      <span className="text-signal">.</span>
    </h1>
  );
}
