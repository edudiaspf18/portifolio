import { getTranslations } from 'next-intl/server';
import { TechIcon } from '@/components/sections/tech-icon';
import { emphasis } from '@/content/emphasis';

export async function EmphasisMedallions() {
  const t = await getTranslations('about');
  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground">{t('emphasisTitle')}</h3>
      <ul data-testid="emphasis-list" className="mt-6 border-t border-border">
        {emphasis.map((item) => (
          <li
            key={item.id}
            data-testid="emphasis-row"
            className="grid gap-2 border-b border-border py-6 md:grid-cols-12 md:items-baseline md:gap-8"
          >
            <span className="flex items-center gap-3 md:col-span-4">
              <TechIcon icon={{ kind: 'si', id: item.iconId }} className="size-5 shrink-0 text-muted-foreground" />
              <span className="font-display text-2xl tracking-tight md:text-3xl">{item.name}</span>
            </span>
            <span className="leading-relaxed text-muted-foreground md:col-span-8">{t(`emphasis.${item.id}`)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
