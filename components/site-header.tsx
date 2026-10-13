import { getTranslations } from 'next-intl/server';
import { LocaleSwitch } from '@/components/locale-switch';
import { MobileNav } from '@/components/mobile-nav';
import { SectionNav } from '@/components/section-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { Link } from '@/i18n/navigation';

const links = ['about', 'timeline', 'projects', 'stack', 'contact'] as const;

export async function SiteHeader() {
  const t = await getTranslations('nav');
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-6">
        <Link
          href="/#top"
          className="font-display text-xl tracking-tight transition-all duration-200 ease-in-out hover:text-signal-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Eduardo Dias
        </Link>
        <SectionNav label={t('primary')} links={links.map((id) => ({ id, label: t(id) }))} />
        <div className="flex items-center gap-2">
          <LocaleSwitch />
          <ThemeToggle />
          <MobileNav label={t('menu')} navLabel={t('mobile')} links={links.map((id) => ({ id, label: t(id) }))} />
        </div>
      </div>
    </header>
  );
}
