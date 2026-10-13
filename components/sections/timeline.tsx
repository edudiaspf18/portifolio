import { getTranslations } from 'next-intl/server';
import { SectionHeading } from '@/components/section-heading';
import { TimelineClient, type TimelineItem } from '@/components/sections/timeline-client';
import { timeline } from '@/content/timeline';

export async function TimelineSection() {
  const t = await getTranslations('timeline');
  const items: TimelineItem[] = timeline.map(({ id, kind }) => ({
    id,
    kind,
    period: t(`items.${id}.period`),
    title: t(`items.${id}.title`),
    org: t(`items.${id}.org`),
    description: t(`items.${id}.description`),
  }));

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading id="timeline" title={t('title')} />
      <div className="mt-16 md:ml-[41.666%]">
        <TimelineClient items={items} />
      </div>
    </section>
  );
}
