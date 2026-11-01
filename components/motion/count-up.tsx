'use client';

import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react';

interface CountUpProps {
  to: number;
  suffix?: string;
}

// O valor inicial já é o final: SSR, sem JS e reduced-motion exibem o número correto.
// Ao entrar na tela, zera e conta até o final (uma vez).
export function CountUp({ to, suffix = '' }: CountUpProps) {
  const reduce = useReducedMotion();
  const value = useMotionValue(to);
  const text = useTransform(value, (v) => `${Math.round(v)}${suffix}`);

  function onEnter(): void {
    if (reduce) return;
    value.set(0);
    animate(value, to, { duration: 1.2, ease: [0.22, 1, 0.36, 1] });
  }

  return (
    <motion.span onViewportEnter={onEnter} viewport={{ once: true, margin: '-40px' }}>
      {text}
    </motion.span>
  );
}
