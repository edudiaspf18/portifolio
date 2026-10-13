import { getTranslations } from 'next-intl/server';

export async function CaminuCard() {
  const t = await getTranslations('about.caminu');
  return (
    <aside
      data-testid="caminu-card"
      className="mt-12 rounded-[2rem] border border-border p-8 md:p-10"
    >
      <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        <span aria-hidden className="size-2.5 rounded-full bg-signal" />
        {t('kicker')}
      </p>
      <h3 className="mt-4 font-display text-5xl tracking-tight">{t('name')}</h3>
      <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">{t('description')}</p>
      <p className="mt-6">
        <span className="inline-flex rounded-full border border-border px-4 py-1 font-mono text-xs uppercase tracking-widest">
          {t('chip')}
        </span>
      </p>
    </aside>
  );
}
