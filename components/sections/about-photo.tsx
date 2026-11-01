'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import Image from 'next/image';
import { useRef } from 'react';
import type { ReactNode } from 'react';

interface AboutPhotoProps {
  src: string;
  alt: string;
  tag: string;
  children?: ReactNode;
}

export function AboutPhoto({ src, alt, tag, children }: AboutPhotoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [16, -16]);

  return (
    // A detecção de viewport fica no wrapper (sem clip-path): um alvo 100% recortado tem área
    // de interseção zero e o IntersectionObserver nunca o marcaria como visível.
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="relative mx-auto w-full max-w-md px-7 lg:max-w-none"
    >
      <motion.div
        data-testid="about-assembly"
        style={{ y }}
        className="relative aspect-square w-full motion-reduce:transform-none! noscript:transform-none!"
      >
        <div aria-hidden className="absolute inset-0 rounded-full border border-border" />
        {children}
        <div aria-hidden className="absolute inset-[14%] rounded-full border border-border" />
        <span aria-hidden data-testid="photo-orbit-dot" className="absolute inset-[14%] animate-orbit motion-reduce:animate-none">
          <span className="absolute left-1/2 top-0 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal" />
        </span>
        <motion.div
          data-testid="about-photo"
          variants={{ hidden: { clipPath: 'circle(0% at 50% 50%)' }, visible: { clipPath: 'circle(75% at 50% 50%)' } }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-[20%] overflow-hidden rounded-full border border-foreground bg-muted motion-reduce:[clip-path:none]! noscript:[clip-path:none]!"
        >
          <Image src={src} alt={alt} fill sizes="(min-width: 768px) 280px, 60vw" className="object-cover" />
        </motion.div>
        <span className="absolute bottom-[14%] left-1/2 -translate-x-1/2 -rotate-6 whitespace-nowrap rounded-full border border-foreground bg-background px-4 py-1 font-mono text-xs uppercase tracking-widest">
          {tag}
        </span>
      </motion.div>
    </motion.div>
  );
}
