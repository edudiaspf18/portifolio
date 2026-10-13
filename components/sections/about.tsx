import { getTranslations } from 'next-intl/server';
import { CountUp } from '@/components/motion/count-up';
import { Reveal } from '@/components/motion/reveal';
import { SectionHeading } from '@/components/section-heading';
import { AboutPhoto } from '@/components/sections/about-photo';
import { EmphasisList } from '@/components/sections/emphasis-list';
import { stats } from '@/content/stats';
import { hasProfilePhoto } from '@/lib/profile-photo';

export async function AboutSection() {
  const t = await getTranslations('about');
  const photo = hasProfilePhoto();

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading id="about" index="01" title={t('title')} />
      <div className="mt-16 grid gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          {photo ? (
            <AboutPhoto src="/images/eduardo.jpg" alt={t('photoAlt')} tag={t('tag')} />
          ) : (
            <div
              data-testid="about-photo-placeholder"
              className="flex aspect-square items-center justify-center border border-foreground bg-muted font-display text-8xl"
            >
              ED
            </div>
          )}
        </div>
        <div className="md:col-span-7">
          <Reveal>
            <p className="font-display text-3xl leading-tight tracking-tight md:text-5xl">{t('lead')}</p>
          </Reveal>
          <Reveal delay={0.1} className="mt-8 max-w-xl space-y-4 text-lg leading-relaxed text-muted-foreground">
            <p>{t('body1')}</p>
            <p>{t('body2')}</p>
          </Reveal>
          <dl data-testid="stats" className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-8">
            {stats.map((stat) => (
              <div key={stat.id} className="flex flex-col-reverse gap-1">
                <dt className="text-sm text-muted-foreground">{t(`stats.${stat.id}`)}</dt>
                <dd data-testid={`stat-${stat.id}`} className="font-display text-5xl tracking-tight md:text-6xl">
                  <CountUp to={stat.value} suffix={stat.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <div className="mt-24">
        <Reveal>
          <EmphasisList />
        </Reveal>
      </div>
    </section>
  );
}
