"use client";

import { useMemo, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

interface SectionNavProps {
  label: string;
  links: readonly { id: string; label: string }[];
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener('scroll', onChange, { passive: true });
  window.addEventListener('resize', onChange);
  return () => {
    window.removeEventListener('scroll', onChange);
    window.removeEventListener('resize', onChange);
  };
}

function createSnapshot(ids: readonly string[]): () => string {
  return () => {
    const line = window.innerHeight * 0.35;
    let active = '';
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= line) active = id;
    }
    return active;
  };
}

const getServerSnapshot = (): string => '';

export function SectionNav({ label, links }: SectionNavProps) {
  const ids = links.map((link) => link.id).join(',');
  const getSnapshot = useMemo(() => createSnapshot(ids.split(',')), [ids]);
  const active = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return (
    <nav aria-label={label} className="hidden items-center gap-6 md:flex">
      {links.map((link) => (
        <a
          key={link.id}
          href={`#${link.id}`}
          aria-current={active === link.id ? "location" : undefined}
          className={cn(
            "border-b border-transparent pb-0.5 text-sm transition-all duration-200 ease-in-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal",
            active === link.id
              ? "border-signal text-foreground"
              : "text-muted-foreground",
          )}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
