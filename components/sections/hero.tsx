import { ArrowDown } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { LiveClock } from '@/components/motion/live-clock';
import { Magnetic } from '@/components/motion/magnetic';
import { Reveal } from '@/components/motion/reveal';
import { HeroTitle } from '@/components/sections/hero-title';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export async function Hero() {
  const t = await getTranslations('hero');
  return (
    <section id="top" className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-28">
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        <span>Eduardo Dias</span>
        <span aria-hidden>/</span>
        <span>{t('local')}</span>
        <LiveClock label={t('clockLabel')} />
      </p>
      <div className="mt-8">
        <HeroTitle lead={t('titleLead')} focus={t('titleFocus')} keyword={t('titleKey')} />
      </div>
      <Reveal delay={0.5} className="mt-10 grid gap-10 md:grid-cols-12">
        <p className="max-w-xl text-lg leading-relaxed text-muted-foreground md:col-span-6">
          {t('subtitle')}
        </p>
        <div className="flex flex-wrap items-start gap-3 md:col-span-6 md:justify-end">
          <Magnetic>
            <a
              href="#projects"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'transition-all duration-200 ease-in-out hover:bg-signal hover:text-[#0f0e0c] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
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
                'border-border transition-all duration-200 ease-in-out hover:border-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              )}
            >
              {t('ctaContact')}
            </a>
          </Magnetic>
        </div>
      </Reveal>
      <p className="mt-12 flex items-center gap-3 border-t border-border pt-6 text-sm text-muted-foreground">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-signal opacity-75 motion-reduce:animate-none" />
          <span className="relative inline-flex size-2 rounded-full bg-signal" />
        </span>
        {t('now')}
      </p>
    </section>
  );
}
