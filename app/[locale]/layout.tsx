import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';
import { SiteHeader } from '@/components/site-header';
import { routing } from '@/i18n/routing';
import { siteUrl } from '@/lib/site';
import { cn } from '@/lib/utils';
import '../globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = { metadataBase: new URL(siteUrl) };

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [messages, t] = await Promise.all([getMessages(), getTranslations('nav')]);
  // Só o namespace usado por componentes client (LocaleSwitch, ThemeToggle) vai para o cliente.
  const clientMessages = { nav: messages.nav };

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          'bg-white font-sans text-zinc-950 antialiased dark:bg-zinc-950 dark:text-zinc-50',
        )}
      >
        <NextIntlClientProvider messages={clientMessages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <a
              href="#content"
              className="sr-only rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-50 transition-all duration-200 ease-in-out focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2 dark:bg-zinc-50 dark:text-zinc-950"
            >
              {t('skip')}
            </a>
            <SiteHeader />
            <main id="content">{children}</main>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
