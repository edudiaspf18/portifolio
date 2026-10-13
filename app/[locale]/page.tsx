import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/sections/hero';
import { TimelineSection } from '@/components/sections/timeline';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Hero />
      <TimelineSection />
    </>
  );
}
