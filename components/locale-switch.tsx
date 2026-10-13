'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';

export function LocaleSwitch() {
  const active = useLocale();
  const pathname = usePathname();
  const t = useTranslations('nav');

  return (
    <nav aria-label={t('language')} className="flex items-center gap-1 text-xs font-medium">
      {routing.locales.map((locale) => (
        <Link
          key={locale}
          href={pathname}
          locale={locale}
          aria-current={locale === active ? 'true' : undefined}
          className={cn(
            'rounded-md px-2 py-1 uppercase transition-all duration-200 ease-in-out hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:hover:text-zinc-50',
            locale === active ? 'text-zinc-950 dark:text-zinc-50' : 'text-zinc-500',
          )}
        >
          {locale}
        </Link>
      ))}
    </nav>
  );
}
