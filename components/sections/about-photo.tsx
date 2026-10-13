'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import Image from 'next/image';
import { useRef } from 'react';

interface AboutPhotoProps {
  src: string;
  alt: string;
  tag: string;
}

export function AboutPhoto({ src, alt, tag }: AboutPhotoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [24, -24]);

  return (
    // A detecção de viewport fica no wrapper (sem clip-path): um alvo 100% recortado tem área
    // de interseção zero e o IntersectionObserver nunca o marcaria como visível em telas estreitas.
    <motion.div
      ref={ref}
      initial={reduce ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="relative mx-auto max-w-md pb-4 pr-4 md:max-w-none"
    >
      <div aria-hidden className="absolute bottom-0 right-0 size-[calc(100%-1rem)] bg-signal" />
      <motion.div
        data-testid="about-photo"
        style={{ y }}
        variants={{ hidden: { clipPath: 'inset(0 0 100% 0)' }, visible: { clipPath: 'inset(0 0 0% 0)' } }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative aspect-square overflow-hidden border border-foreground bg-muted motion-reduce:[clip-path:none]! noscript:[clip-path:none]!"
      >
        <Image src={src} alt={alt} fill sizes="(min-width: 768px) 440px, 90vw" className="object-cover" />
      </motion.div>
      <span className="absolute -left-2 top-6 -rotate-6 border border-foreground bg-background px-3 py-1 font-mono text-xs uppercase tracking-widest">
        {tag}
      </span>
    </motion.div>
  );
}
