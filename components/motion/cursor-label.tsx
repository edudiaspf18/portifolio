"use client";

import { motion, useMotionValue } from "motion/react";
import type { PointerEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CursorLabelProps {
  label: string;
  enabled: boolean;
  className?: string;
  children: ReactNode;
}

export function CursorLabel({
  label,
  enabled,
  className,
  children,
}: CursorLabelProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  function onMove(event: PointerEvent<HTMLDivElement>): void {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  if (!enabled) return <div className={className}>{children}</div>;

  return (
    <div onPointerMove={onMove} className={cn("group/cursor", className)}>
      {children}
      <motion.span
        aria-hidden
        data-testid="cursor-label"
        style={{ x, y }}
        className="pointer-events-none absolute left-0 top-0 -ml-9 -mt-4 hidden bg-signal px-3 py-1 font-mono text-xs uppercase tracking-widest text-[#0f0e0c] opacity-0 transition-opacity duration-200 ease-in-out group-hover/cursor:opacity-100 [@media(hover:hover)]:block"
      >
        {label}
      </motion.span>
    </div>
  );
}
