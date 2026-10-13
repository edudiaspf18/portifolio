import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function NotFound() {
  const t = await getTranslations('notFound');
  return (
    <section className="mx-auto max-w-6xl px-6 py-36">
      <h1 className="text-4xl font-bold tracking-tight">{t('title')}</h1>
      <Link
        href="/"
        className="mt-8 inline-block text-sm text-zinc-500 transition-all duration-200 ease-in-out hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:hover:text-zinc-50"
      >
        {t('back')}
      </Link>
    </section>
  );
}
