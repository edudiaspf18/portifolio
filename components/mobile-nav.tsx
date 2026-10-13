'use client';

import { Menu } from 'lucide-react';
import type { MouseEvent } from 'react';

interface MobileNavProps {
  label: string;
  links: readonly { id: string; label: string }[];
}

// <details> nativo: abre/fecha sem JS; o onClick só fecha o menu após escolher um link.
function closeMenu(event: MouseEvent<HTMLAnchorElement>): void {
  event.currentTarget.closest('details')?.removeAttribute('open');
}

export function MobileNav({ label, links }: MobileNavProps) {
  return (
    <details className="group md:hidden">
      <summary
        aria-label={label}
        className="flex size-9 cursor-pointer list-none items-center justify-center rounded-md border border-zinc-200 text-zinc-950 transition-all duration-200 ease-in-out hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 group-open:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-900 dark:group-open:bg-zinc-900 [&::-webkit-details-marker]:hidden"
      >
        <Menu className="size-4" aria-hidden />
      </summary>
      <nav
        aria-label={label}
        className="absolute inset-x-0 top-full border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950"
      >
        <ul className="flex flex-col">
          {links.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={closeMenu}
                className="block py-3 text-base text-zinc-500 transition-all duration-200 ease-in-out hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:hover:text-zinc-50"
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
