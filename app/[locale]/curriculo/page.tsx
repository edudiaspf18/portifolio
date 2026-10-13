import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CurveDivider } from '@/components/curve-divider';
import { projects } from '@/content/projects';
import { profile } from '@/content/profile';
import { stackIcons } from '@/content/stack-icons';
import { hasProfilePhoto } from '@/lib/profile-photo';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'resume' });
  return { title: t('metaTitle'), robots: { index: false, follow: false } };
}

// PDF mostra só os 9 logos originais
const resumeIcons = stackIcons.slice(0, 9);
const EXPERIENCE_IDS = ['frontend', 'techWinner', 'baan'] as const;
const EDUCATION_IDS = ['degree', 'cpet'] as const;

export default async function ResumePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [r, tl, tp, th, ts] = await Promise.all([
    getTranslations('resume'),
    getTranslations('timeline'),
    getTranslations('projects'),
    getTranslations('hero'),
    getTranslations('stack'),
  ]);
  const photo = hasProfilePhoto();

  return (
    <main className="min-h-screen bg-[#ebe6d9] print:bg-white">
      <div
        data-testid="resume"
        className="mx-auto h-[297mm] w-[210mm] overflow-hidden bg-[#f5f2eb] p-[14mm] text-[10.5pt] leading-snug text-[#0f0e0c]"
      >
        <div className="flex items-center gap-6">
          {photo ? (
            <div className="relative size-[28mm] shrink-0">
              <span aria-hidden className="absolute -inset-[3mm] rounded-full border border-[#d8d3c7]" />
              <span className="absolute inset-0 overflow-hidden rounded-full border border-[#0f0e0c]">
                <Image src="/images/eduardo.jpg" alt="" fill sizes="106px" className="object-cover" />
              </span>
              <span aria-hidden className="absolute -right-[3.5mm] top-[6mm] size-[3mm] rounded-full bg-[#ff5a1f]" />
            </div>
          ) : null}
          <div>
            <h1 className="font-display text-[34pt] leading-none tracking-tight">{profile.name}</h1>
            <p className="mt-2 font-display text-[15pt] leading-tight">
              {th('role')}.
            </p>
          </div>
        </div>

        <CurveDivider className="my-6 text-[#d8d3c7]" />

        <div className="grid grid-cols-[1fr_58mm] gap-10">
          <div className="space-y-7">
            <section>
              <h2 className="font-mono text-[8pt] uppercase tracking-widest text-[#5c5850]">{r('sections.profile')}</h2>
              <p className="mt-3">{r('summary')}</p>
            </section>
            <section>
              <h2 className="font-mono text-[8pt] uppercase tracking-widest text-[#5c5850]">{r('sections.experience')}</h2>
              <ol className="mt-3 space-y-5">
                {EXPERIENCE_IDS.map((id) => (
                  <li key={id}>
                    <p className="font-mono text-[8pt] uppercase tracking-widest text-[#5c5850]">{tl(`items.${id}.period`)}</p>
                    <p className="font-display text-[14pt] leading-tight">{tl(`items.${id}.title`)}</p>
                    <p className="text-[#5c5850]">{tl(`items.${id}.org`)}</p>
                    <p className="mt-0.5">{tl(`items.${id}.description`)}</p>
                  </li>
                ))}
              </ol>
            </section>
            <section>
              <h2 className="font-mono text-[8pt] uppercase tracking-widest text-[#5c5850]">{r('sections.projects')}</h2>
              <ul className="mt-3 space-y-2.5">
                {projects.map((p) => (
                  <li key={p.id}>
                    <span className="font-display text-[12.5pt]">{p.name}</span>
                    <span className="text-[#5c5850]"> · {tp(`items.${p.id}.niche`)}</span>
                  </li>
                ))}
                <li className="pt-1">{r('caminuLine')}</li>
              </ul>
            </section>
          </div>

          <aside className="space-y-7">
            <section>
              <h2 className="font-mono text-[8pt] uppercase tracking-widest text-[#5c5850]">{r('sections.contact')}</h2>
              <ul className="mt-3 space-y-1.5 break-words">
                <li>
                  <a href={`mailto:${profile.email}`} className="transition-all duration-200 ease-in-out hover:text-[#c2410c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c2410c]">{profile.email}</a>
                </li>
                <li>
                  <a href="https://wa.me/5562994267841" className="transition-all duration-200 ease-in-out hover:text-[#c2410c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c2410c]">{profile.phone}</a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/in/eduardo-dias-8a924131a" className="transition-all duration-200 ease-in-out hover:text-[#c2410c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c2410c]">{profile.linkedin.replace('linkedin.com/', '')}</a>
                </li>
                <li>
                  <a href="https://github.com/edudiaspf18" className="transition-all duration-200 ease-in-out hover:text-[#c2410c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c2410c]">{profile.github}</a>
                </li>
                <li>
                  <a href="https://www.instagram.com/dudu_diaspf/" className="transition-all duration-200 ease-in-out hover:text-[#c2410c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c2410c]">{profile.instagram}</a>
                </li>
                <li>{th('local')}</li>
              </ul>
            </section>
            <section>
              <h2 className="font-mono text-[8pt] uppercase tracking-widest text-[#5c5850]">{r('sections.education')}</h2>
              <ol className="mt-3 space-y-3.5">
                {EDUCATION_IDS.map((id) => (
                  <li key={id}>
                    <p className="font-display text-[12.5pt] leading-tight">{tl(`items.${id}.title`)}</p>
                    <p className="text-[#5c5850]">{tl(`items.${id}.org`)}</p>
                    <p className="font-mono text-[8pt] uppercase tracking-widest text-[#5c5850]">{tl(`items.${id}.period`)}</p>
                  </li>
                ))}
              </ol>
            </section>
            <section>
              <h2 className="font-mono text-[8pt] uppercase tracking-widest text-[#5c5850]">{r('sections.stack')}</h2>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {resumeIcons.map((icon) => (
                  <li key={icon.id}>
                    <span className="sr-only">{icon.name}</span>
                    <span aria-hidden className="flex size-[8mm] items-center justify-center rounded-full border border-[#d8d3c7]">
                      <svg viewBox="0 0 24 24" className="size-[4mm] fill-current" role="presentation">
                        <path d={icon.path} />
                      </svg>
                    </span>
                  </li>
                ))}
              </ul>
              <p aria-hidden className="mt-3 font-mono text-[7.5pt] text-[#5c5850]">{resumeIcons.map((i) => i.name).join(' · ')}</p>
            </section>
            <section>
              <h2 className="font-mono text-[8pt] uppercase tracking-widest text-[#5c5850]">{r('sections.certification')}</h2>
              <p className="mt-3">{ts('scrum')}</p>
            </section>
            <section>
              <h2 className="font-mono text-[8pt] uppercase tracking-widest text-[#5c5850]">{r('sections.languages')}</h2>
              <p className="mt-3">{ts('languages')}</p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
