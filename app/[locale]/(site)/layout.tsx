import type { ReactNode } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { IntroCurtain } from '@/components/intro-curtain';
import { ScrollProgress } from '@/components/motion/scroll-progress';
import { SiteHeader } from '@/components/site-header';

interface SiteLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function SiteLayout({ children, params }: SiteLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('nav');
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html:
            "try{var k='intro-seen';if(sessionStorage.getItem(k)){document.documentElement.dataset.intro='seen'}else{sessionStorage.setItem(k,'1')}}catch(e){}",
        }}
      />
      <IntroCurtain label={t('introLabel')} />
      <a
        href="#content"
        className="sr-only rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-all duration-200 ease-in-out focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {t('skip')}
      </a>
      <ScrollProgress />
      <SiteHeader />
      <main id="content">{children}</main>
    </>
  );
}
