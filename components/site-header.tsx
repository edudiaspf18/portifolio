import { getTranslations } from 'next-intl/server';
import { LocaleSwitch } from '@/components/locale-switch';
import { MobileNav } from '@/components/mobile-nav';
import { ThemeToggle } from '@/components/theme-toggle';

const links = ['timeline', 'projects', 'stack', 'contact'] as const;

export async function SiteHeader() {
  const t = await getTranslations('nav');
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-6">
        <a
          href="#top"
          className="text-sm font-semibold tracking-tight transition-all duration-200 ease-in-out hover:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
        >
          Eduardo Dias
        </a>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className="text-sm text-zinc-500 transition-all duration-200 ease-in-out hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:hover:text-zinc-50"
            >
              {t(id)}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LocaleSwitch />
          <ThemeToggle />
          <MobileNav label={t('menu')} links={links.map((id) => ({ id, label: t(id) }))} />
        </div>
      </div>
    </header>
  );
}
