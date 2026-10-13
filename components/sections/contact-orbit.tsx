import { TechIcon } from '@/components/sections/tech-icon';
import { socials } from '@/content/socials';
import { orbitPosition } from '@/lib/orbit';

const chips = socials.flatMap((social) => (social.iconId ? [{ ...social, iconId: social.iconId }] : []));

interface ContactOrbitProps {
  label: string;
  email: string;
}

export function ContactOrbit({ label, email }: ContactOrbitProps) {
  return (
    <div data-testid="contact-orbit" className="relative mx-auto w-full max-w-sm md:aspect-square">
      <ul
        aria-label={label}
        className="flex flex-wrap justify-center gap-4 md:absolute md:inset-8 md:block md:animate-orbit motion-reduce:animate-none"
      >
        {chips.map((chip, i) => {
          const pos = orbitPosition(i, chips.length);
          return (
            <li key={chip.id} className="md:absolute md:size-0" style={{ left: pos.left, top: pos.top }}>
              <div className="md:absolute md:-left-8 md:-top-8 md:size-16 md:animate-orbit-reverse motion-reduce:animate-none">
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
      <p className="mt-6 text-center font-mono text-xs text-muted-foreground md:absolute md:inset-0 md:mt-0 md:flex md:items-center md:justify-center md:px-[28%]">
        {email.split('@')[0]}@<wbr />{email.split('@')[1]}
      </p>
    </div>
  );
}
