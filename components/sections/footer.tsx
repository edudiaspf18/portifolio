import { getTranslations } from 'next-intl/server';

export async function Footer() {
  const t = await getTranslations('footer');
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-6 py-8 text-sm text-zinc-500 dark:text-zinc-400">
        <p>{t('rights')}</p>
        <p>{t('built')}</p>
      </div>
    </footer>
  );
}
