import { ArrowDown } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export async function Hero() {
  const t = await getTranslations('hero');
  return (
    <section id="top" className="mx-auto max-w-6xl px-6 pb-24 pt-24 md:pt-36">
      <div className="max-w-4xl">
        <p className="text-sm font-medium text-orange-600 dark:text-orange-500">{t('eyebrow')}</p>
        <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
          {t('title')}
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-zinc-500">{t('subtitle')}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="#projects"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'bg-zinc-950 text-zinc-50 transition-all duration-200 ease-in-out hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200',
            )}
          >
            {t('ctaProjects')}
            <ArrowDown className="size-4" />
          </a>
          <a
            href="#contact"
            className={cn(
              buttonVariants({ size: 'lg', variant: 'outline' }),
              'border-zinc-200 transition-all duration-200 ease-in-out hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:border-zinc-800 dark:hover:bg-zinc-900',
            )}
          >
            {t('ctaContact')}
          </a>
        </div>
      </div>
    </section>
  );
}
