import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';
import { routing } from '@/i18n/routing';
import { siteUrl } from '@/lib/site';
import { cn } from '@/lib/utils';
import '../globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

const instrumentSerif = Instrument_Serif({
  variable: '--font-instrument-serif',
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
});

// 1ª visita: grava a chave e, ao fim da 1ª cortina, marca data-intro=seen (esconde cortinas remontadas por troca de idioma).
const introScript =
  "try{var k='intro-seen';if(sessionStorage.getItem(k)){document.documentElement.dataset.intro='seen'}else{sessionStorage.setItem(k,'1');document.addEventListener('animationend',function h(e){if(e.animationName==='curtain-hide'||e.animationName==='curtain-fade'){document.documentElement.dataset.intro='seen';sessionStorage.setItem('intro-done','1');document.removeEventListener('animationend',h)}})}}catch(e){}";

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
  const messages = await getMessages();
  // Só o namespace usado por componentes client (LocaleSwitch, ThemeToggle) vai para o cliente.
  const clientMessages = { nav: messages.nav };

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* beforeInteractive: roda antes do paint na carga completa e não re-executa em navegação client-side. */}
        <Script id="intro-seen" strategy="beforeInteractive">{introScript}</Script>
      </head>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          instrumentSerif.variable,
          'bg-background font-sans text-foreground antialiased dark:bg-dots',
        )}
      >
        <NextIntlClientProvider messages={clientMessages}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
