'use client';

import { Menu } from 'lucide-react';
import type { KeyboardEvent, MouseEvent } from 'react';

interface MobileNavProps {
  label: string;
  navLabel: string;
  links: readonly { id: string; label: string }[];
}

// <details> nativo: abre/fecha sem JS; o onClick só fecha o menu após escolher um link.
function closeMenu(event: MouseEvent<HTMLAnchorElement>): void {
  event.currentTarget.closest('details')?.removeAttribute('open');
}

// Escape fecha o menu e devolve o foco ao summary (sem useEffect).
function onEscape(event: KeyboardEvent<HTMLDetailsElement>): void {
  if (event.key !== 'Escape' || !event.currentTarget.open) return;
  event.currentTarget.removeAttribute('open');
  event.currentTarget.querySelector('summary')?.focus();
}

export function MobileNav({ label, navLabel, links }: MobileNavProps) {
  return (
    <details className="group relative md:hidden" onKeyDown={onEscape}>
      <summary
        aria-label={label}
        className="flex size-9 cursor-pointer list-none items-center justify-center rounded-md border border-border text-foreground transition-all duration-200 ease-in-out hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal group-open:bg-muted [&::-webkit-details-marker]:hidden"
      >
        <Menu className="size-4" aria-hidden />
      </summary>
      <nav
        aria-label={navLabel}
        className="absolute right-0 top-full z-50 mt-3 w-56 rounded-md border border-border bg-background px-4 py-2 shadow-sm"
      >
        <ul className="flex flex-col">
          {links.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={closeMenu}
                className="block py-3 text-base text-muted-foreground transition-all duration-200 ease-in-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}
