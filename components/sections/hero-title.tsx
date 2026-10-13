import { cn } from '@/lib/utils';

interface HeroTitleProps {
  lead: string;
  focus: string;
  keyword: string;
}

// Animação em CSS puro: o texto do LCP não depende de hidratação do JS.
const delay = (index: number): string => `${0.05 + index * 0.04}s`;

interface WordProps {
  text: string;
  index: number;
  italic?: boolean;
}

function Word({ text, index, italic = false }: WordProps) {
  return (
    <span className={'inline-block overflow-hidden pb-[0.14em] pr-[0.08em] align-bottom'}>
      <span
        data-testid="hero-word"
        style={{ animationDelay: delay(index) }}
        className={cn('inline-block animate-word-up motion-reduce:animate-none', italic && 'italic')}
      >
        {text}
      </span>
    </span>
  );
}

export function HeroTitle({ lead, focus, keyword }: HeroTitleProps) {
  const leadWords = lead.split(' ');
  const focusWords = focus.split(' ');
  const offset = leadWords.length;
  const keyIndex = offset + focusWords.length;

  return (
    <h1 className="font-display text-[clamp(3.25rem,11vw,9.5rem)] leading-[0.95] tracking-tight">
      {leadWords.map((word, i) => (
        <span key={`l-${i}`}>
          <Word text={word} index={i} />{' '}
        </span>
      ))}
      <br className="hidden md:block" />
      {focusWords.map((word, i) => (
        <span key={`f-${i}`}>
          <Word text={word} index={offset + i} italic />{' '}
        </span>
      ))}
      <span className="relative inline-block">
        <Word text={keyword} index={keyIndex} italic />
        <svg
          aria-hidden
          viewBox="0 0 200 12"
          preserveAspectRatio="none"
          className="absolute -bottom-1 left-0 h-3 w-full text-signal md:h-4"
        >
          <path
            data-testid="hero-underline"
            pathLength={1}
            d="M2 8 C 40 2, 90 12, 130 6 S 190 4, 198 7"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            style={{ animationDelay: `${0.05 + keyIndex * 0.04 + 0.3}s` }}
            className="animate-draw motion-reduce:animate-none"
          />
        </svg>
      </span>
      <span className="-ml-[0.1em] text-signal">.</span>
    </h1>
  );
}
