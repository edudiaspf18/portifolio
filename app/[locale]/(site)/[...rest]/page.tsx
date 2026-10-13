import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';

interface CatchAllProps {
  params: Promise<{ locale: string; rest: string[] }>;
}

// Catch-all: faz qualquer URL desconhecida dentro de /[locale] renderizar o not-found localizado
// dentro do layout (com header, tema e <html lang>), em vez da página 404 padrão do Next.
export async function generateMetadata({ params }: CatchAllProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'notFound' });
  return { title: t('title') };
}

export default async function CatchAllPage({ params }: CatchAllProps) {
  const { locale } = await params;
  if (hasLocale(routing.locales, locale)) setRequestLocale(locale);
  notFound();
}
