import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function NotFound() {
  const t = await getTranslations('notFound');
  return (
    <section className="mx-auto max-w-6xl px-6 py-36">
      <h1 className="font-display text-6xl tracking-tight">{t('title')}</h1>
      <Link
        href="/"
        className="mt-8 inline-block text-sm text-muted-foreground transition-all duration-200 ease-in-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
      >
        {t('back')}
      </Link>
    </section>
  );
}
