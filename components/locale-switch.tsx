'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';

export function LocaleSwitch() {
  const active = useLocale();
  const pathname = usePathname();
  const t = useTranslations('nav');

  return (
    <nav aria-label={t('language')} className="flex items-center gap-1 text-xs font-medium">
      {routing.locales.map((locale) => (
        // Navegação completa (não client-side): o documento muda de idioma (lang, mensagens) e o
        // <html> não é remontado pelo React — evita re-render do script do next-themes e da cortina.
        <a
          key={locale}
          href={`/${locale}${pathname === '/' ? '' : pathname}`}
          hrefLang={locale}
          aria-current={locale === active ? 'page' : undefined}
          className={cn(
            'rounded-full border px-2 py-1 uppercase transition-all duration-200 ease-in-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            locale === active ? 'border-border text-foreground' : 'border-transparent text-muted-foreground',
          )}
        >
          {locale}
        </a>
      ))}
    </nav>
  );
}
