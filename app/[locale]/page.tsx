import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ContactSection } from '@/components/sections/contact';
import { Footer } from '@/components/sections/footer';
import { Hero } from '@/components/sections/hero';
import { ProjectsSection } from '@/components/sections/projects';
import { StackSection } from '@/components/sections/stack';
import { TimelineSection } from '@/components/sections/timeline';
import { socials } from '@/content/socials';
import { routing } from '@/i18n/routing';
import { siteUrl } from '@/lib/site';

interface PageProps {
  params: Promise<{ locale: string }>;
}

const OG_LOCALES: Record<string, string> = { pt: 'pt_BR', en: 'en_US' };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ...Object.fromEntries(routing.locales.map((l) => [l, `/${l}`])),
        'x-default': `/${routing.defaultLocale}`,
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      locale: OG_LOCALES[locale] ?? locale,
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title: t('title'), description: t('description') },
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'meta' });

  const personLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Eduardo Dias',
    url: `${siteUrl}/${locale}`,
    jobTitle: t('jobTitle'),
    description: t('description'),
    address: { '@type': 'PostalAddress', addressLocality: 'Anápolis', addressRegion: 'GO', addressCountry: 'BR' },
    sameAs: socials.filter((s) => s.href.startsWith('http') && !s.href.includes('wa.me')).map((s) => s.href),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd).replace(/</g, '\\u003c') }}
      />
      <Hero />
      <TimelineSection />
      <ProjectsSection />
      <StackSection />
      <ContactSection />
      <Footer />
    </>
  );
}
