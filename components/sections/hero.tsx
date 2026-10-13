import { ArrowDown, Download } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';
import { LiveClock } from '@/components/motion/live-clock';
import { Magnetic } from '@/components/motion/magnetic';
import { Reveal } from '@/components/motion/reveal';
import { HeroOrbits } from '@/components/sections/hero-orbits';
import { HeroTitle } from '@/components/sections/hero-title';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export async function Hero() {
  const t = await getTranslations('hero');
  const locale = await getLocale();
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-24">
        <HeroOrbits />
        <p className="relative z-10 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          <span>{t('nickname')}</span>
          <span aria-hidden>/</span>
          <span>{t('local')}</span>
          <LiveClock label={t('clockLabel')} />
        </p>
        <div className="relative z-10 mt-8">
          <HeroTitle greeting={t('greeting')} name={t('name')} />
        </div>
        <p
          data-testid="hero-role"
          className="relative z-10 mt-6 font-display text-[clamp(1.75rem,4.6vw,3.75rem)] leading-tight tracking-tight"
        >
          {t('role')}
          <span className="text-signal">.</span>
        </p>
        <Reveal delay={0} className="relative z-10 mt-10 grid gap-10 md:grid-cols-12">
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
        <p className="relative z-10 mt-12 flex items-center gap-3 border-t border-border pt-6 text-sm text-muted-foreground">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-signal opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex size-2 rounded-full bg-signal" />
          </span>
          {t('now')}
        </p>
      </div>
    </section>
  );
}
