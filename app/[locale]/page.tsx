import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/sections/hero';
import { ContactSection } from '@/components/sections/contact';
import { Footer } from '@/components/sections/footer';
import { ProjectsSection } from '@/components/sections/projects';
import { StackSection } from '@/components/sections/stack';
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
      <ProjectsSection />
      <StackSection />
      <ContactSection />
      <Footer />
    </>
  );
}
