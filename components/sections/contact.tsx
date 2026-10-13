import { ArrowUpRight, Download } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { SectionHeading } from '@/components/section-heading';
import { buttonVariants } from '@/components/ui/button';
import { socials } from '@/content/socials';
import { cn } from '@/lib/utils';

export async function ContactSection() {
  const t = await getTranslations('contact');
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading id="contact" index="05" title={t('title')} intro={t('subtitle')} />
      <ul className="mt-16 divide-y divide-zinc-200 border-y border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
        {socials.map((social) => (
          <li key={social.id}>
            <a
              data-testid="social-link"
              href={social.href}
              {...(social.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="flex items-center justify-between py-5 text-lg font-medium tracking-tight transition-all duration-200 ease-in-out hover:text-orange-700 dark:hover:text-orange-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
            >
              {social.label}
              <ArrowUpRight className="size-5 text-zinc-500 dark:text-zinc-400" />
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-10 flex flex-wrap items-center gap-6">
        <a
          href="/curriculo-eduardo-dias.pdf"
          download
          className={cn(
            buttonVariants({ size: 'lg' }),
            'bg-zinc-950 text-zinc-50 transition-all duration-200 ease-in-out hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200',
          )}
        >
          <Download className="size-4" />
          {t('resume')}
        </a>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{t('location')}</p>
      </div>
    </section>
  );
}
