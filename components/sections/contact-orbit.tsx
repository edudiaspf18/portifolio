import { TechIcon } from '@/components/sections/tech-icon';
import { socials } from '@/content/socials';
import { orbitPosition } from '@/lib/orbit';

const chips = socials.flatMap((social) => (social.iconId ? [{ ...social, iconId: social.iconId }] : []));

interface ContactOrbitProps {
  label: string;
  email: string;
}

export function ContactOrbit({ label, email }: ContactOrbitProps) {
  const [user, domain] = email.split('@');
  return (
    <div data-testid="contact-orbit" className="relative mx-auto w-full max-w-[22rem] md:aspect-square">
      <div aria-hidden className="absolute inset-[28%] hidden rounded-full border border-border md:block" />
      <ul
        aria-label={label}
        className="flex flex-wrap justify-center gap-4 md:absolute md:inset-8 md:block motion-safe:md:animate-orbit md:rounded-full md:border md:border-border"
      >
        {chips.map((chip, i) => {
          const pos = orbitPosition(i, chips.length);
          return (
            <li key={chip.id} className="md:absolute md:size-0" style={{ left: pos.left, top: pos.top }}>
              <div className="md:absolute md:-left-8 md:-top-8 md:size-16 motion-safe:md:animate-orbit-reverse">
                <a
                  data-testid="social-link"
                  href={chip.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex size-16 items-center justify-center rounded-full border border-border bg-background text-foreground transition-all duration-200 ease-in-out hover:scale-110 hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:hover:scale-100"
                >
                  <span className="sr-only">{chip.label}</span>
                  <TechIcon icon={{ kind: 'si', id: chip.iconId }} className="size-6" />
                </a>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-6 text-center font-mono text-xs text-muted-foreground md:absolute md:inset-0 md:mt-0 md:flex md:items-center md:justify-center md:px-[34%]">
        {user}@<wbr />{domain}
      </p>
    </div>
  );
}
