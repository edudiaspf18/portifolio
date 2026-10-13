import { getTranslations } from 'next-intl/server';
import { TechIcon } from '@/components/sections/tech-icon';
import { emphasis } from '@/content/emphasis';
import { cn } from '@/lib/utils';

export async function EmphasisMedallions() {
  const t = await getTranslations('about');
  return (
    <div>
      <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {t('emphasisTitle')}
      </h3>
      <ul
        data-testid="emphasis-medallions"
        className="mt-6 flex snap-x gap-6 overflow-x-auto pb-4 pt-2 lg:grid lg:grid-cols-5 lg:overflow-visible"
      >
        {emphasis.map((item) => (
          <li
            key={item.id}
            data-testid="emphasis-medallion"
            className="group flex w-56 shrink-0 snap-center flex-col items-center text-center lg:w-auto"
          >
            <span className="flex size-44 items-center justify-center rounded-full border border-border transition-all duration-200 ease-in-out group-hover:-translate-y-1 group-hover:border-foreground motion-reduce:group-hover:translate-y-0">
              <TechIcon icon={{ kind: 'si', id: item.iconId }} className="size-14" />
            </span>
            <span className="mt-5 font-display text-3xl tracking-tight">{item.name}</span>
            <span
              className={cn(
                'mt-1 font-mono text-xs uppercase tracking-widest',
                item.status === 'learning' ? 'text-signal-ink' : 'text-muted-foreground',
              )}
            >
              {t(`status.${item.status}`)}
            </span>
            <span className="mt-2 text-sm text-muted-foreground">{t(`emphasis.${item.id}`)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
