import { getTranslations } from 'next-intl/server';
import { SectionHeading } from '@/components/section-heading';
import { TimelineClient, type TimelineItem } from '@/components/sections/timeline-client';
import { timeline } from '@/content/timeline';

export async function TimelineSection() {
  const t = await getTranslations('timeline');
  const items: TimelineItem[] = timeline.map(({ id, kind, year }, index) => ({
    id,
    kind,
    year,
    index,
    period: t(`items.${id}.period`),
    title: t(`items.${id}.title`),
    org: t(`items.${id}.org`),
    description: t(`items.${id}.description`),
  }));

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <SectionHeading id="timeline" title={t('title')} />
      <div className="mt-12">
        <TimelineClient items={items} />
      </div>
    </section>
  );
}
