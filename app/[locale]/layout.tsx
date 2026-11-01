import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { IBM_Plex_Mono, IBM_Plex_Sans, Schibsted_Grotesk } from 'next/font/google';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';
import { routing } from '@/i18n/routing';
import { siteUrl } from '@/lib/site';
import { cn } from '@/lib/utils';
import '../globals.css';

const plexSans = IBM_Plex_Sans({ variable: '--font-plex-sans', weight: ['400', '500', '600'], subsets: ['latin'] });
const plexMono = IBM_Plex_Mono({ variable: '--font-plex-mono', weight: ['400', '500'], subsets: ['latin'] });

// Só o peso 600: todo `font-display` sai no mesmo peso, sem precisar de classe extra em cada título.
const schibsted = Schibsted_Grotesk({ variable: '--font-schibsted', weight: '600', subsets: ['latin'] });

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
      <body
        className={cn(
          plexSans.variable,
          plexMono.variable,
          schibsted.variable,
          'bg-background font-sans text-foreground antialiased dark:bg-dots',
        )}
      >
        {/* Script de bootstrap da cortina via innerHTML: o parser executa no SSR antes de pintar a cortina;
            em navegação client-side o React só reatribui innerHTML (sem criar <script>), então não há aviso
            "Encountered a script tag" nem re-execução. A remontagem é coberta pelo ref em IntroCurtain. */}
        <div hidden dangerouslySetInnerHTML={{ __html: `<script>${introScript}</script>` }} />
        <NextIntlClientProvider messages={clientMessages}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
