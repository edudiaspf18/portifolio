import { getTranslations } from 'next-intl/server';
import { emphasis } from '@/content/emphasis';
import { cn } from '@/lib/utils';

export async function EmphasisList() {
  const t = await getTranslations('about');
  return (
    <div>
      <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {t('emphasisTitle')}
      </h3>
      <ul data-testid="emphasis-list" className="mt-6 divide-y divide-border border-y border-border">
        {emphasis.map((item) => (
          <li key={item.id}>
            <a
              href="#stack"
              className="group relative grid items-baseline gap-2 py-6 pl-4 transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:grid-cols-12 md:gap-6"
            >
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 w-0 bg-signal transition-all duration-300 ease-in-out group-hover:w-1.5 group-focus-visible:w-1.5"
              />
              <span className="font-display text-4xl tracking-tight transition-all duration-200 ease-in-out group-hover:translate-x-3 group-focus-visible:translate-x-3 motion-reduce:group-hover:translate-x-0 motion-reduce:group-focus-visible:translate-x-0 md:col-span-5 md:text-6xl">
                {item.name}
              </span>
              <span
                className={cn(
                  'font-mono text-xs uppercase tracking-widest md:col-span-2',
                  item.status === 'learning' ? 'text-signal-ink' : 'text-muted-foreground',
                )}
              >
                {t(`status.${item.status}`)}
              </span>
              <span className="text-muted-foreground transition-all duration-200 ease-in-out md:col-span-5 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-visible:opacity-100">
                {t(`emphasis.${item.id}`)}
              </span>
              <span className="sr-only">{t('viewInStack')}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
