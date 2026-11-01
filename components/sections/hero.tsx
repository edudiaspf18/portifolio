import { ArrowDown, Download } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';
import { Magnetic } from '@/components/motion/magnetic';
import { Reveal } from '@/components/motion/reveal';
import { HeroTitle } from '@/components/sections/hero-title';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export async function Hero() {
  const t = await getTranslations('hero');
  const locale = await getLocale();
  return (
    <section id="top">
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-24">
        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-base">
          <span className="font-medium">{t('name')}</span>
          <span aria-hidden className="text-muted-foreground">·</span>
          <span data-testid="hero-role" className="text-muted-foreground">
            {t('role')}
          </span>
          <span aria-hidden className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{t('local')}</span>
        </p>
        <div className="mt-8">
          <HeroTitle text={t('headline')} />
        </div>
        <Reveal delay={0} className="mt-10 grid gap-10 md:grid-cols-12">
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground md:col-span-6">
            {t('subtitle')}
          </p>
          <div className="flex flex-wrap items-start gap-3 md:col-span-6 md:justify-end">
            <Magnetic>
              <a
                href="#projects"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'rounded-full transition-all duration-200 ease-in-out hover:bg-signal hover:text-signal-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                )}
              >
                {t('ctaProjects')}
                <ArrowDown className="size-4" />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#contact"
                className={cn(
                  buttonVariants({ size: 'lg', variant: 'outline' }),
                  'rounded-full border-border transition-all duration-200 ease-in-out hover:border-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                )}
              >
                {t('ctaContact')}
              </a>
            </Magnetic>
            <a
              href={`/curriculo-eduardo-dias-${locale}.pdf`}
              download
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-muted-foreground transition-all duration-200 ease-in-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Download className="size-4" />
              {t('ctaResume')}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
