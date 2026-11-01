"use client";

import { motion, useMotionValue } from "motion/react";
import { useRef } from "react";
import type { PointerEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CursorLabelProps {
  label: string;
  enabled: boolean;
  className?: string;
  children: ReactNode;
}

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), Math.max(min, max));

export function CursorLabel({
  label,
  enabled,
  className,
  children,
}: CursorLabelProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const labelRef = useRef<HTMLSpanElement>(null);

  function onMove(event: PointerEvent<HTMLDivElement>): void {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    // Mantém a etiqueta dentro do container (overflow-hidden cortaria nas bordas).
    const width = labelRef.current?.offsetWidth ?? 0;
    const height = labelRef.current?.offsetHeight ?? 0;
    x.set(clamp(event.clientX - rect.left, 36, rect.width - width + 36));
    y.set(clamp(event.clientY - rect.top, 16, rect.height - height + 16));
  }

  if (!enabled) return <div className={className}>{children}</div>;

  return (
    <div onPointerMove={onMove} className={cn("group/cursor", className)}>
      {children}
      <motion.span
        ref={labelRef}
        aria-hidden
        data-testid="cursor-label"
        style={{ x, y }}
        className="pointer-events-none absolute left-0 top-0 -ml-9 -mt-4 hidden bg-signal motion-reduce:hidden px-3 py-1 font-mono text-xs uppercase tracking-widest text-signal-foreground opacity-0 transition-opacity duration-200 ease-in-out group-hover/cursor:opacity-100 [@media(hover:hover)]:motion-safe:block"
      >
        {label}
      </motion.span>
    </div>
  );
}
