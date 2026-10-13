import { getTranslations } from 'next-intl/server';
import { SectionHeading } from '@/components/section-heading';
import { Badge } from '@/components/ui/badge';
import { stackBasic, stackLearning, stackUsing } from '@/content/stack';

interface GroupProps {
  title: string;
  items: readonly string[];
  accent?: boolean;
}

function Group({ title, items, accent = false }: GroupProps) {
  return (
    <div className="border-t border-zinc-200 pt-6 dark:border-zinc-800">
      <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{title}</h3>
      <ul className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item}>
            <Badge
              variant="outline"
              className={
                accent
                  ? 'border-orange-700 font-normal text-orange-700 dark:border-orange-500 dark:text-orange-500'
                  : 'border-zinc-200 font-normal dark:border-zinc-800'
              }
            >
              {item}
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function StackSection() {
  const t = await getTranslations('stack');
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading id="stack" title={t('title')} />
      <div className="mt-16 grid gap-8 md:grid-cols-3">
        <Group title={t('using')} items={stackUsing} />
        <Group title={t('learning')} items={stackLearning} accent />
        <Group title={t('basic')} items={stackBasic} />
      </div>
      <div className="mt-12 border-t border-zinc-200 pt-6 text-sm text-zinc-500 dark:text-zinc-400 dark:border-zinc-800">
        <p className="font-medium">{t('extras')}</p>
        <p className="mt-2">{t('scrum')}</p>
        <p>{t('languages')}</p>
      </div>
    </section>
  );
}
